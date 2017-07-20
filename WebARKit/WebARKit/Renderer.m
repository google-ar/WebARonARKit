/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#import <simd/simd.h>
#import <ModelIO/ModelIO.h>
#import <MetalKit/MetalKit.h>

#import "Renderer.h"

// Include header shared between C code here, which executes Metal API commands, and .metal files
#import "ShaderTypes.h"

// The max number of command buffers in flight
static const NSUInteger kMaxBuffersInFlight = 3;

// The max number anchors our uniform buffer will hold
static const NSUInteger kMaxAnchorInstanceCount = 64;

// The 256 byte aligned size of our uniform structures
static const size_t kAlignedSharedUniformsSize = (sizeof(SharedUniforms) & ~0xFF) + 0x100;
static const size_t kAlignedInstanceUniformsSize = ((sizeof(InstanceUniforms) * kMaxAnchorInstanceCount) & ~0xFF) + 0x100;

// Vertex data for an image plane
static const float kImagePlaneVertexData[16] = {
    -1.0, -1.0,  0.0, 1.0,
    1.0, -1.0,  1.0, 1.0,
    -1.0,  1.0,  0.0, 0.0,
    1.0,  1.0,  1.0, 0.0,
};


@implementation Renderer {
    // The session the renderer will render
    ARSession *_session;
    
    // The object controlling the ultimate render destination
    __weak id<RenderDestinationProvider> _renderDestination;
    
    dispatch_semaphore_t _inFlightSemaphore;

    // Metal objects
    id <MTLDevice> _device;
    id <MTLCommandQueue> _commandQueue;
    id <MTLBuffer> _sharedUniformBuffer;
    id <MTLBuffer> _anchorUniformBuffer;
    id <MTLBuffer> _imagePlaneVertexBuffer;
    id <MTLRenderPipelineState> _capturedImagePipelineState;
    id <MTLDepthStencilState> _capturedImageDepthState;
    id <MTLRenderPipelineState> _anchorPipelineState;
    id <MTLDepthStencilState> _anchorDepthState;
    id <MTLTexture> _capturedImageTextureY;
    id <MTLTexture> _capturedImageTextureCbCr;
    
    // Captured image texture cache
    CVMetalTextureCacheRef _capturedImageTextureCache;
    
    // Metal vertex descriptor specifying how vertices will by laid out for input into our
    //   anchor geometry render pipeline and how we'll layout our Model IO verticies
    MTLVertexDescriptor *_geometryVertexDescriptor;
    
    // MetalKit mesh containing vertex data and index buffer for our anchor geometry
    MTKMesh *_cubeMesh;
    
    // Used to determine _uniformBufferStride each frame.
    //   This is the current frame number modulo kMaxBuffersInFlight
    uint8_t _uniformBufferIndex;
    
    // Offset within _sharedUniformBuffer to set for the current frame
    uint32_t _sharedUniformBufferOffset;
    
    // Offset within _anchorUniformBuffer to set for the current frame
    uint32_t _anchorUniformBufferOffset;
    
    // Addresses to write shared uniforms to each frame
    void *_sharedUniformBufferAddress;
    
    // Addresses to write anchor uniforms to each frame
    void *_anchorUniformBufferAddress;
    
    // The number of anchor instances to render
    NSUInteger _anchorInstanceCount;
    
    // Flag for viewport size changes
    BOOL _viewportSizeDidChange;
}

- (instancetype)initWithSession:(ARSession *)session metalDevice:(id<MTLDevice>)device renderDestinationProvider:(id<RenderDestinationProvider>)renderDestinationProvider {
    self = [super init];
    if (self) {
        _session = session;
        _device = device;
        _renderDestination = renderDestinationProvider;
        _inFlightSemaphore = dispatch_semaphore_create(kMaxBuffersInFlight);
        self.cameraRenderEnabled = true;
        [self _loadMetal];
        [self _loadAssets];
    }
    
    return self;
}

- (void)drawRectResized:(CGSize)size {
    self->viewportSize = size;
    _viewportSizeDidChange = YES;
}

- (void)update {
    // Wait to ensure only kMaxBuffersInFlight are getting proccessed by any stage in the Metal
    //   pipeline (App, Metal, Drivers, GPU, etc)
    dispatch_semaphore_wait(_inFlightSemaphore, DISPATCH_TIME_FOREVER);
    
    // Create a new command buffer for each renderpass to the current drawable
    id <MTLCommandBuffer> commandBuffer = [_commandQueue commandBuffer];
    commandBuffer.label = @"MyCommand";
    
    // Add completion hander which signal _inFlightSemaphore when Metal and the GPU has fully
    //   finished proccssing the commands we're encoding this frame.  This indicates when the
    //   dynamic buffers, that we're writing to this frame, will no longer be needed by Metal
    //   and the GPU.
    __block dispatch_semaphore_t block_sema = _inFlightSemaphore;
    [commandBuffer addCompletedHandler:^(id<MTLCommandBuffer> buffer) {
        dispatch_semaphore_signal(block_sema);
    }];
    
    [self _updateBufferStates];
    [self _updateGameState];
    
    // Obtain a renderPassDescriptor generated from the view's drawable textures
    MTLRenderPassDescriptor* renderPassDescriptor = _renderDestination.currentRenderPassDescriptor;
    
    // If we've gotten a renderPassDescriptor we can render to the drawable, otherwise we'll skip
    //   any rendering this frame because we have no drawable to draw to
    if (renderPassDescriptor != nil) {
        
        // Create a render command encoder so we can render into something
        id <MTLRenderCommandEncoder> renderEncoder =
        [commandBuffer renderCommandEncoderWithDescriptor:renderPassDescriptor];
        renderEncoder.label = @"MyRenderEncoder";
        
        [self _drawCapturedImageWithCommandEncoder:renderEncoder];
        [self _drawAnchorGeometryWithCommandEncoder:renderEncoder];
        
        // We're done encoding commands
        [renderEncoder endEncoding];
    }
    
    // Schedule a present once the framebuffer is complete using the current drawable
    [commandBuffer presentDrawable:_renderDestination.currentDrawable];
    
    // Finalize rendering here & push the command buffer to the GPU
    [commandBuffer commit];
}

#pragma mark - Private

- (void)_loadMetal {
    // Create and load our basic Metal state objects
    
    // Set the default formats needed to render
    _renderDestination.depthStencilPixelFormat = MTLPixelFormatDepth32Float_Stencil8;
    _renderDestination.colorPixelFormat = MTLPixelFormatBGRA8Unorm;
    _renderDestination.sampleCount = 1;
    
    // Calculate our uniform buffer sizes. We allocate kMaxBuffersInFlight instances for uniform
    //   storage in a single buffer. This allows us to update uniforms in a ring (i.e. triple
    //   buffer the uniforms) so that the GPU reads from one slot in the ring wil the CPU writes
    //   to another. Anchor uniforms should be specified with a max instance count for instancing.
    //   Also uniform storage must be aligned (to 256 bytes) to meet the requirements to be an
    //   argument in the constant address space of our shading functions.
    const NSUInteger sharedUniformBufferSize = kAlignedSharedUniformsSize * kMaxBuffersInFlight;
    const NSUInteger anchorUniformBufferSize = kAlignedInstanceUniformsSize * kMaxBuffersInFlight;
    
    // Create and allocate our uniform buffer objects. Indicate shared storage so that both the
    //   CPU can access the buffer
    _sharedUniformBuffer = [_device newBufferWithLength:sharedUniformBufferSize
                                                options:MTLResourceStorageModeShared];
    
    _sharedUniformBuffer.label = @"SharedUniformBuffer";
    
    _anchorUniformBuffer = [_device newBufferWithLength:anchorUniformBufferSize options:MTLResourceStorageModeShared];
    
    _anchorUniformBuffer.label = @"AnchorUniformBuffer";
    
    // Create a vertex buffer with our image plane vertex data.
    _imagePlaneVertexBuffer = [_device newBufferWithBytes:&kImagePlaneVertexData length:sizeof(kImagePlaneVertexData) options:MTLResourceCPUCacheModeDefaultCache];
    
    _imagePlaneVertexBuffer.label = @"ImagePlaneVertexBuffer";
    
    // Load all the shader files with a metal file extension in the project
    id <MTLLibrary> defaultLibrary = [_device newDefaultLibrary];
    
    id <MTLFunction> capturedImageVertexFunction = [defaultLibrary newFunctionWithName:@"capturedImageVertexTransform"];
    id <MTLFunction> capturedImageFragmentFunction = [defaultLibrary newFunctionWithName:@"capturedImageFragmentShader"];
    
    // Create a vertex descriptor for our image plane vertex buffer
    MTLVertexDescriptor *imagePlaneVertexDescriptor = [[MTLVertexDescriptor alloc] init];
    
    // Positions.
    imagePlaneVertexDescriptor.attributes[kVertexAttributePosition].format = MTLVertexFormatFloat2;
    imagePlaneVertexDescriptor.attributes[kVertexAttributePosition].offset = 0;
    imagePlaneVertexDescriptor.attributes[kVertexAttributePosition].bufferIndex = kBufferIndexMeshPositions;
    
    // Texture coordinates.
    imagePlaneVertexDescriptor.attributes[kVertexAttributeTexcoord].format = MTLVertexFormatFloat2;
    imagePlaneVertexDescriptor.attributes[kVertexAttributeTexcoord].offset = 8;
    imagePlaneVertexDescriptor.attributes[kVertexAttributeTexcoord].bufferIndex = kBufferIndexMeshPositions;
    
    // Position Buffer Layout
    imagePlaneVertexDescriptor.layouts[kBufferIndexMeshPositions].stride = 16;
    imagePlaneVertexDescriptor.layouts[kBufferIndexMeshPositions].stepRate = 1;
    imagePlaneVertexDescriptor.layouts[kBufferIndexMeshPositions].stepFunction = MTLVertexStepFunctionPerVertex;
    
    // Create a pipeline state for rendering the captured image
    MTLRenderPipelineDescriptor *capturedImagePipelineStateDescriptor = [[MTLRenderPipelineDescriptor alloc] init];
    capturedImagePipelineStateDescriptor.label = @"MyCapturedImagePipeline";
    capturedImagePipelineStateDescriptor.sampleCount = _renderDestination.sampleCount;
    capturedImagePipelineStateDescriptor.vertexFunction = capturedImageVertexFunction;
    capturedImagePipelineStateDescriptor.fragmentFunction = capturedImageFragmentFunction;
    capturedImagePipelineStateDescriptor.vertexDescriptor = imagePlaneVertexDescriptor;
    capturedImagePipelineStateDescriptor.colorAttachments[0].pixelFormat = _renderDestination.colorPixelFormat;
    capturedImagePipelineStateDescriptor.depthAttachmentPixelFormat = _renderDestination.depthStencilPixelFormat;
    capturedImagePipelineStateDescriptor.stencilAttachmentPixelFormat = _renderDestination.depthStencilPixelFormat;
    
    NSError *error = nil;
    _capturedImagePipelineState = [_device newRenderPipelineStateWithDescriptor:capturedImagePipelineStateDescriptor error:&error];
    if (!_capturedImagePipelineState) {
        NSLog(@"Failed to created captured image pipeline state, error %@", error);
    }
    
    MTLDepthStencilDescriptor *capturedImageDepthStateDescriptor = [[MTLDepthStencilDescriptor alloc] init];
    capturedImageDepthStateDescriptor.depthCompareFunction = MTLCompareFunctionAlways;
    capturedImageDepthStateDescriptor.depthWriteEnabled = NO;
    _capturedImageDepthState = [_device newDepthStencilStateWithDescriptor:capturedImageDepthStateDescriptor];
    
    // Create captured image texture cache
    CVMetalTextureCacheCreate(NULL, NULL, _device, NULL, &_capturedImageTextureCache);
    
    id <MTLFunction> anchorGeometryVertexFunction = [defaultLibrary newFunctionWithName:@"anchorGeometryVertexTransform"];
    id <MTLFunction> anchorGeometryFragmentFunction = [defaultLibrary newFunctionWithName:@"anchorGeometryFragmentLighting"];
    
    // Create a vertex descriptor for our Metal pipeline. Specifies the layout of vertices the
    //   pipeline should expect. The layout below keeps attributes used to calculate vertex shader
    //   output position separate (world position, skinning, tweening weights) separate from other
    //   attributes (texture coordinates, normals).  This generally maximizes pipeline efficiency
    _geometryVertexDescriptor = [[MTLVertexDescriptor alloc] init];
    
    // Positions.
    _geometryVertexDescriptor.attributes[kVertexAttributePosition].format = MTLVertexFormatFloat3;
    _geometryVertexDescriptor.attributes[kVertexAttributePosition].offset = 0;
    _geometryVertexDescriptor.attributes[kVertexAttributePosition].bufferIndex = kBufferIndexMeshPositions;
    
    // Texture coordinates.
    _geometryVertexDescriptor.attributes[kVertexAttributeTexcoord].format = MTLVertexFormatFloat2;
    _geometryVertexDescriptor.attributes[kVertexAttributeTexcoord].offset = 0;
    _geometryVertexDescriptor.attributes[kVertexAttributeTexcoord].bufferIndex = kBufferIndexMeshGenerics;
    
    // Normals.
    _geometryVertexDescriptor.attributes[kVertexAttributeNormal].format = MTLVertexFormatHalf3;
    _geometryVertexDescriptor.attributes[kVertexAttributeNormal].offset = 8;
    _geometryVertexDescriptor.attributes[kVertexAttributeNormal].bufferIndex = kBufferIndexMeshGenerics;
    
    // Position Buffer Layout
    _geometryVertexDescriptor.layouts[kBufferIndexMeshPositions].stride = 12;
    _geometryVertexDescriptor.layouts[kBufferIndexMeshPositions].stepRate = 1;
    _geometryVertexDescriptor.layouts[kBufferIndexMeshPositions].stepFunction = MTLVertexStepFunctionPerVertex;
    
    // Generic Attribute Buffer Layout
    _geometryVertexDescriptor.layouts[kBufferIndexMeshGenerics].stride = 16;
    _geometryVertexDescriptor.layouts[kBufferIndexMeshGenerics].stepRate = 1;
    _geometryVertexDescriptor.layouts[kBufferIndexMeshGenerics].stepFunction = MTLVertexStepFunctionPerVertex;
    
    // Create a reusable pipeline state for rendering anchor geometry
    MTLRenderPipelineDescriptor *anchorPipelineStateDescriptor = [[MTLRenderPipelineDescriptor alloc] init];
    anchorPipelineStateDescriptor.label = @"MyAnchorPipeline";
    anchorPipelineStateDescriptor.sampleCount = _renderDestination.sampleCount;
    anchorPipelineStateDescriptor.vertexFunction = anchorGeometryVertexFunction;
    anchorPipelineStateDescriptor.fragmentFunction = anchorGeometryFragmentFunction;
    anchorPipelineStateDescriptor.vertexDescriptor = _geometryVertexDescriptor;
    anchorPipelineStateDescriptor.colorAttachments[0].pixelFormat = _renderDestination.colorPixelFormat;
    anchorPipelineStateDescriptor.depthAttachmentPixelFormat = _renderDestination.depthStencilPixelFormat;
    anchorPipelineStateDescriptor.stencilAttachmentPixelFormat = _renderDestination.depthStencilPixelFormat;
    
    _anchorPipelineState = [_device newRenderPipelineStateWithDescriptor:anchorPipelineStateDescriptor error:&error];
    if (!_anchorPipelineState) {
        NSLog(@"Failed to created geometry pipeline state, error %@", error);
    }
    
    MTLDepthStencilDescriptor *anchorDepthStateDescriptor = [[MTLDepthStencilDescriptor alloc] init];
    anchorDepthStateDescriptor.depthCompareFunction = MTLCompareFunctionLess;
    anchorDepthStateDescriptor.depthWriteEnabled = YES;
    _anchorDepthState = [_device newDepthStencilStateWithDescriptor:anchorDepthStateDescriptor];
    
    // Create the command queue
    _commandQueue = [_device newCommandQueue];
}

- (void)_loadAssets {
    // Create and load our assets into Metal objects including meshes and textures
    
    // Create a MetalKit mesh buffer allocator so that ModelIO will load mesh data directly into
    //   Metal buffers accessible by the GPU
    MTKMeshBufferAllocator *metalAllocator = [[MTKMeshBufferAllocator alloc] initWithDevice: _device];
    
    // Creata a Model IO vertexDescriptor so that we format/layout our model IO mesh vertices to
    //   fit our Metal render pipeline's vertex descriptor layout
    MDLVertexDescriptor *vertexDescriptor = MTKModelIOVertexDescriptorFromMetal(_geometryVertexDescriptor);
    
    // Indicate how each Metal vertex descriptor attribute maps to each ModelIO attribute
    vertexDescriptor.attributes[kVertexAttributePosition].name  = MDLVertexAttributePosition;
    vertexDescriptor.attributes[kVertexAttributeTexcoord].name  = MDLVertexAttributeTextureCoordinate;
    vertexDescriptor.attributes[kVertexAttributeNormal].name    = MDLVertexAttributeNormal;
    
    // Use ModelIO to create a box mesh as our object
    MDLMesh *mesh = [MDLMesh newBoxWithDimensions:(vector_float3){.075, .075, .075}
                                            segments:(vector_uint3){1, 1, 1}
                                        geometryType:MDLGeometryTypeTriangles
                                       inwardNormals:NO
                                           allocator:metalAllocator];
    
    
    // Perform the format/relayout of mesh vertices by setting the new vertex descriptor in our
    //   Model IO mesh
    mesh.vertexDescriptor = vertexDescriptor;
    
    NSError *error = nil;
    
    // Create a MetalKit mesh (and submeshes) backed by Metal buffers
    _cubeMesh = [[MTKMesh alloc] initWithMesh:mesh device:_device error:&error];
    
    if(!_cubeMesh || error) {
        NSLog(@"Error creating MetalKit mesh %@", error.localizedDescription);
    }
}

- (void)_updateBufferStates {
    // Update the location(s) to which we'll write to in our dynamically changing Metal buffers for
    //   the current frame (i.e. update our slot in the ring buffer used for the current frame)
    
    _uniformBufferIndex = (_uniformBufferIndex + 1) % kMaxBuffersInFlight;
    
    _sharedUniformBufferOffset = kAlignedSharedUniformsSize * _uniformBufferIndex;
    _anchorUniformBufferOffset = kAlignedInstanceUniformsSize * _uniformBufferIndex;
    
    _sharedUniformBufferAddress = ((uint8_t*)_sharedUniformBuffer.contents) + _sharedUniformBufferOffset;
    _anchorUniformBufferAddress = ((uint8_t*)_anchorUniformBuffer.contents) + _anchorUniformBufferOffset;
}

- (void)_updateGameState {
    // Update any game state
    
    ARFrame *currentFrame = _session.currentFrame;
    
    if (!currentFrame) {
        return;
    }
    
    // These calls are not necessary for WbARKit
//    [self _updateSharedUniformsWithFrame:currentFrame];
//    [self _updateAnchorsWithFrame:currentFrame];
    if (self.cameraRenderEnabled)
    {
        [self _updateCapturedImageTexturesWithFrame:currentFrame];
    }
    
    if (_viewportSizeDidChange) {
        _viewportSizeDidChange = NO;
        
        [self _updateImagePlaneWithFrame:currentFrame];
    }
}

- (void)_updateSharedUniformsWithFrame:(ARFrame *)frame {
    // Update the shared uniforms of the frame
    SharedUniforms *uniforms = (SharedUniforms *)_sharedUniformBufferAddress;
    
    uniforms->viewMatrix = matrix_invert(frame.camera.transform);
    uniforms->projectionMatrix = [frame.camera projectionMatrixWithViewportSize:self->viewportSize orientation:UIInterfaceOrientationLandscapeRight zNear:0.001 zFar:1000];
    
    // Set up lighting for the scene using the ambient intensity if provided
    float ambientIntensity = 1.0;
    
    if (frame.lightEstimate) {
        ambientIntensity = frame.lightEstimate.ambientIntensity / 1000;
    }
    
    vector_float3 ambientLightColor = { 0.5, 0.5, 0.5 };
    uniforms->ambientLightColor = ambientLightColor * ambientIntensity;
    
    vector_float3 directionalLightDirection = { 0.0, 0.0, -1.0 };
    directionalLightDirection = vector_normalize(directionalLightDirection);
    uniforms->directionalLightDirection = directionalLightDirection;
    
    vector_float3 directionalLightColor = { 0.6, 0.6, 0.6};
    uniforms->directionalLightColor = directionalLightColor * ambientIntensity;
    
    uniforms->materialShininess = 30;
}

- (void)_updateAnchorsWithFrame:(ARFrame *)frame {
    // Update the anchor uniform buffer with transforms of the current frame's anchors
    NSInteger anchorInstanceCount = MIN(frame.anchors.count, kMaxAnchorInstanceCount);
    
    NSInteger anchorOffset = 0;
    if (anchorInstanceCount == kMaxAnchorInstanceCount) {
        anchorOffset = MAX(frame.anchors.count - kMaxAnchorInstanceCount, 0);
    }
    
    for (NSInteger index = 0; index < anchorInstanceCount; index++) {
        InstanceUniforms *anchorUniforms = ((InstanceUniforms *)_anchorUniformBufferAddress) + index;
        ARAnchor *anchor = frame.anchors[index + anchorOffset];
        
        // Flip Z axis to convert geometry from right handed to left handed
        matrix_float4x4 coordinateSpaceTransform = matrix_identity_float4x4;
        coordinateSpaceTransform.columns[2].z = -1.0;
        
        anchorUniforms->modelMatrix = matrix_multiply(anchor.transform, coordinateSpaceTransform);
    }
    
    _anchorInstanceCount = anchorInstanceCount;
}

- (void)_updateCapturedImageTexturesWithFrame:(ARFrame *)frame {
    // Create two textures (Y and CbCr) from the provided frame's captured image
    CVPixelBufferRef pixelBuffer = frame.capturedImage;
    
    if (CVPixelBufferGetPlaneCount(pixelBuffer) < 2) {
        return;
    }
    
    _capturedImageTextureY = [self _createTextureFromPixelBuffer:pixelBuffer pixelFormat:MTLPixelFormatR8Unorm planeIndex:0];
    _capturedImageTextureCbCr = [self _createTextureFromPixelBuffer:pixelBuffer pixelFormat:MTLPixelFormatRG8Unorm planeIndex:1];
}

- (id<MTLTexture>)_createTextureFromPixelBuffer:(CVPixelBufferRef)pixelBuffer pixelFormat:(MTLPixelFormat)pixelFormat planeIndex:(NSInteger)planeIndex {
    id<MTLTexture> mtlTexture = nil;
    
    const size_t width = CVPixelBufferGetWidthOfPlane(pixelBuffer, planeIndex);
    const size_t height = CVPixelBufferGetHeightOfPlane(pixelBuffer, planeIndex);
    
    CVMetalTextureRef texture = NULL;
    CVReturn status = CVMetalTextureCacheCreateTextureFromImage(NULL, _capturedImageTextureCache, pixelBuffer, NULL, pixelFormat, width, height, planeIndex, &texture);
    
    if(status == kCVReturnSuccess) {
        mtlTexture = CVMetalTextureGetTexture(texture);
        CFRelease(texture);
    }
    
    return mtlTexture;
}

- (void)_updateImagePlaneWithFrame:(ARFrame *)frame {
    // Update the texture coordinates of our image plane to aspect fill the viewport
    CGAffineTransform displayToCameraTransform = CGAffineTransformInvert(
        [frame displayTransformWithViewportSize:self->viewportSize orientation:UIInterfaceOrientationLandscapeRight]);
    
    float *vertexData = [_imagePlaneVertexBuffer contents];
    for (NSInteger index = 0; index < 4; index++) {
        NSInteger textureCoordIndex = 4 * index + 2;
        CGPoint textureCoord = CGPointMake(kImagePlaneVertexData[textureCoordIndex], kImagePlaneVertexData[textureCoordIndex + 1]);
        CGPoint transformedCoord = CGPointApplyAffineTransform(textureCoord, displayToCameraTransform);
        vertexData[textureCoordIndex] = transformedCoord.x;
        vertexData[textureCoordIndex + 1] = transformedCoord.y;
    }
}

- (void)_drawCapturedImageWithCommandEncoder:(id<MTLRenderCommandEncoder>)renderEncoder {
    if (_capturedImageTextureY == nil || _capturedImageTextureCbCr == nil) {
        return;
    }
    
    // Push a debug group allowing us to identify render commands in the GPU Frame Capture tool
    [renderEncoder pushDebugGroup:@"DrawCapturedImage"];
    
    // Set render command encoder state
    [renderEncoder setCullMode:MTLCullModeNone];
    [renderEncoder setRenderPipelineState:_capturedImagePipelineState];
    [renderEncoder setDepthStencilState:_capturedImageDepthState];
    
    // Set mesh's vertex buffers
    [renderEncoder setVertexBuffer:_imagePlaneVertexBuffer offset:0 atIndex:kBufferIndexMeshPositions];
    
    // Set any textures read/sampled from our render pipeline
    [renderEncoder setFragmentTexture:_capturedImageTextureY atIndex:kTextureIndexY];
    [renderEncoder setFragmentTexture:_capturedImageTextureCbCr atIndex:kTextureIndexCbCr];
    
    // Draw each submesh of our mesh
    [renderEncoder drawPrimitives:MTLPrimitiveTypeTriangleStrip vertexStart:0 vertexCount:4];
    
    [renderEncoder popDebugGroup];
}

- (void)_drawAnchorGeometryWithCommandEncoder:(id<MTLRenderCommandEncoder>)renderEncoder {
    if (_anchorInstanceCount == 0) {
        return;
    }
    
    // Push a debug group allowing us to identify render commands in the GPU Frame Capture tool
    [renderEncoder pushDebugGroup:@"DrawAnchors"];
    
    // Set render command encoder state
    [renderEncoder setCullMode:MTLCullModeBack];
    [renderEncoder setRenderPipelineState:_anchorPipelineState];
    [renderEncoder setDepthStencilState:_anchorDepthState];
    
    // Set any buffers fed into our render pipeline
    [renderEncoder setVertexBuffer:_anchorUniformBuffer offset:_anchorUniformBufferOffset atIndex:kBufferIndexInstanceUniforms];
    
    [renderEncoder setVertexBuffer:_sharedUniformBuffer offset:_sharedUniformBufferOffset atIndex:kBufferIndexSharedUniforms];
    
    [renderEncoder setFragmentBuffer:_sharedUniformBuffer offset:_sharedUniformBufferOffset atIndex:kBufferIndexSharedUniforms];
    
    
    // Set mesh's vertex buffers
    for (NSUInteger bufferIndex = 0; bufferIndex < _cubeMesh.vertexBuffers.count; bufferIndex++) {
        MTKMeshBuffer *vertexBuffer = _cubeMesh.vertexBuffers[bufferIndex];
        [renderEncoder setVertexBuffer:vertexBuffer.buffer offset:vertexBuffer.offset atIndex:bufferIndex];
    }
    
    // Draw each submesh of our mesh
    for(MTKSubmesh *submesh in _cubeMesh.submeshes) {
        [renderEncoder drawIndexedPrimitives:submesh.primitiveType indexCount:submesh.indexCount indexType:submesh.indexType indexBuffer:submesh.indexBuffer.buffer indexBufferOffset:submesh.indexBuffer.offset instanceCount:_anchorInstanceCount];
    }
    
    [renderEncoder popDebugGroup];
}

- (void)disableCameraRender
{
    self.cameraRenderEnabled = false;
}

- (void)enableCameraRender
{
    self.cameraRenderEnabled = true;
}

@end
