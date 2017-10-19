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

#import "ViewController.h"
#import "Renderer.h"
#import "ProgressView.h"

// TODO: Should this be a percentage?
#define URL_TEXTFIELD_HEIGHT 44
#define PROGRESSVIEW_HEIGHT 4

@interface ViewController () <MTKViewDelegate, ARSessionDelegate>

@property (nonatomic, strong) ARSession *session;
@property (nonatomic, strong) Renderer *renderer;
@property (nonatomic, strong) ProgressView *progressView;
@property (nonatomic, assign) bool webviewNavigationSuccess;

@end

@interface MTKView () <RenderDestinationProvider>

@end

@implementation ViewController

- (void)showAlertDialog:(NSString *)message
      completionHandler:(void (^)(void))completionHandler
{
    UIAlertController *alertController =
        [UIAlertController alertControllerWithTitle:message
                                            message:nil
                                     preferredStyle:UIAlertControllerStyleAlert];
    [alertController
        addAction:[UIAlertAction actionWithTitle:@"OK"
                                           style:UIAlertActionStyleCancel
                                         handler:^(UIAlertAction *action) {
                                             if (completionHandler) {
                                                 completionHandler();
                                             }
                                         }]];
    [self presentViewController:alertController
                       animated:YES
                     completion:^{
                     }];
}

- (void)setWKWebViewScrollEnabled:(BOOL)enabled
{
    self->wkWebView.scrollView.scrollEnabled = enabled;
    self->wkWebView.scrollView.panGestureRecognizer.enabled = enabled;
    self->wkWebView.scrollView.bounces = enabled;
}

- (bool)loadURLInWKWebView:(NSString *)urlString
{
    bool result = true;
    // Try to create a url with the provided string
    NSURL *nsurl = [NSURL URLWithString:urlString];
    bool fileScheme = nsurl && nsurl.scheme &&
                      [[nsurl.scheme lowercaseString] isEqualToString:@"file"];
    // Quick hack: If the url string is not a proper URL, try to add http to it to
    // see if it is an actual URL
    if (!nsurl || !nsurl.scheme || !nsurl.host) {
        NSString *urlStringWithHTTP =
            [NSString stringWithFormat:@"http://%@", urlString];
        nsurl = [NSURL URLWithString:urlStringWithHTTP];
    }
    // If the string did not represent a url or is a filescheme url, the way the
    // page is loaded is different
    if (!nsurl || !nsurl.scheme || !nsurl.host || fileScheme) {
        NSString *nsurlPath = urlString;
        NSString *pathExtension = @"html";
        // If the file:// scheme was provided, remove the scheme and trim the
        // extension if included.
        if (fileScheme) {
            nsurlPath = [NSString stringWithFormat:@"%@%@", nsurl.host, nsurl.path];
            if ([[nsurl.pathExtension lowercaseString]
                    isEqualToString:pathExtension]) {
                NSRange range =
                    [[nsurlPath lowercaseString] rangeOfString:@".html"
                                                       options:NSBackwardsSearch];
                nsurlPath = [nsurlPath stringByReplacingCharactersInRange:range
                                                               withString:@""];
            }
        } else {
            // If the file:// was not provided, trim the extension if included.
            NSRange range =
                [[nsurlPath lowercaseString] rangeOfString:@".html"
                                                   options:NSBackwardsSearch];
            if (range.location != NSNotFound &&
                range.location == nsurlPath.length - 5) {
                nsurlPath = [nsurlPath stringByReplacingCharactersInRange:range
                                                               withString:@""];
            }
        }
        //        NSLog(@"nsurlPath = %@", nsurlPath);
        // Is the URL string a path to a file?
        NSString *path =
            [[NSBundle mainBundle] pathForResource:nsurlPath
                                            ofType:pathExtension];
        // If the path is incorrect, it could be because is a path to a folder
        // instead of a file
        if (!path) {
            path = [[NSBundle mainBundle] pathForResource:nsurlPath ofType:nil];
        }
        bool isDirectory = false;
        //        NSLog(@"Loading a file from resources with path = %@", path);
        // Make sure that the path exists and get a flag to indicate if the path
        // represents a directory
        if (path &&
            [[NSFileManager defaultManager] fileExistsAtPath:path
                                                 isDirectory:&isDirectory]) {
            // If the path is to a directory, add the index at the end (try to load
            // index.html).
            if (isDirectory) {
                nsurlPath = [NSString stringWithFormat:@"%@/index", nsurlPath];
            }
            NSURL *url = [[NSBundle mainBundle] URLForResource:nsurlPath
                                                 withExtension:pathExtension];
            // The final URL to the resource may fail so just in case...
            if (!url) {
                result = false;
            } else {
                //                NSLog(@"Loading a file from resources with url = %@",
                //                url.absoluteString);
                [self->wkWebView loadRequest:[NSURLRequest requestWithURL:url]];
            }
        } else {
            result = false;
        }
    } else {
        NSURLRequest *nsrequest = [NSURLRequest requestWithURL:nsurl];
        [self->wkWebView loadRequest:nsrequest];
    }
    return result;
}

- (NSString *)getURLFromUserDefaults
{
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    return [defaults stringForKey:@"url"];
}

- (void)storeURLInUserDefaults:(NSString *)urlString
{
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    [defaults setObject:urlString forKey:@"url"];
    [defaults synchronize];
}

- (void)backButtonClicked:(UIButton *)button
{
    if ([self->wkWebView canGoBack]) {
        WKBackForwardList *backForwardList = [self->wkWebView backForwardList];
        WKBackForwardListItem *backItem = [backForwardList backItem];
        if (backItem != nil) {
            NSURL *url = [backItem URL];
            [self->urlTextField setText:[url absoluteString]];
        }
        [self->wkWebView goBack];
    }
}

- (void)forwardButtonClicked:(UIButton *)button
{
    [self->wkWebView goForward];
}

- (void)refreshButtonClicked:(UIButton *)button
{
    [self->wkWebView reload];
}

- (void)setShowCameraFeed:(bool)show
{
    if (show) {
        self->wkWebView.opaque = false;
        self->wkWebView.backgroundColor = [UIColor clearColor];
        self->wkWebView.scrollView.backgroundColor = [UIColor clearColor];
    } else {
        self->wkWebView.opaque = true;
        self->wkWebView.backgroundColor = self->wkWebViewOriginalBackgroundColor;
        self->wkWebView.scrollView.backgroundColor = self->wkWebViewOriginalBackgroundColor;
    }
    self->showingCameraFeed = show;
}

- (void)viewDidLoad
{
    [super viewDidLoad];

    self->near = 0.01f;
    self->far = 10000.0f;

    self->showingCameraFeed = false;

    // Create an ARSession
    self.session = [ARSession new];
    self.session.delegate = self;

    // Set the view to use the default device
    MTKView *view = (MTKView *)self.view;
    view.device = MTLCreateSystemDefaultDevice();
    view.delegate = self;

    if (!view.device) {
        NSLog(@"Metal is not supported on this device");
        return;
    }

    // Configure the renderer to draw to the view
    self.renderer = [[Renderer alloc] initWithSession:self.session
                                          metalDevice:view.device
                            renderDestinationProvider:view];

    [self.renderer drawRectResized:view.bounds.size];

    UITapGestureRecognizer *tapGesture =
        [[UITapGestureRecognizer alloc] initWithTarget:self
                                                action:@selector(handleTap:)];
    NSMutableArray *gestureRecognizers = [NSMutableArray array];
    [gestureRecognizers addObject:tapGesture];
    [gestureRecognizers addObjectsFromArray:view.gestureRecognizers];
    view.gestureRecognizers = gestureRecognizers;

    // Clear the webview completely
    //    NSSet *websiteDataTypes = [NSSet setWithArray:@[
    //        WKWebsiteDataTypeDiskCache,
    //        //WKWebsiteDataTypeOfflineWebApplicationCache,
    //        WKWebsiteDataTypeMemoryCache,
    //        //WKWebsiteDataTypeLocalStorage,
    //        //WKWebsiteDataTypeCookies,
    //        //WKWebsiteDataTypeSessionStorage,
    //        //WKWebsiteDataTypeIndexedDBDatabases,
    //        //WKWebsiteDataTypeWebSQLDatabases
    //    ]];
    NSSet *websiteDataTypes = [WKWebsiteDataStore allWebsiteDataTypes];
    NSDate *dateFrom = [NSDate dateWithTimeIntervalSince1970:0];
    [[WKWebsiteDataStore defaultDataStore] removeDataOfTypes:websiteDataTypes
                                               modifiedSince:dateFrom
                                           completionHandler:^{
                                           }];
    // Make sure that WebARonARKit.js is injected at the beginning of any webpage
    // Load the WebARonARKit.js file
    NSString *WebARonARKitJSPath =
        [[NSBundle mainBundle] pathForResource:@"WebARonARKit"
                                        ofType:@"js"];
    //  NSLog(WebARonARKitJSPath);
    NSString *WebARonARKitJSContent =
        [NSString stringWithContentsOfFile:WebARonARKitJSPath
                                  encoding:NSUTF8StringEncoding
                                     error:NULL];
    //  NSLog(WebARonARKitJSContent);
    // Setup the script injection
    WKUserScript *WebARonARKitJSUserScript = [[WKUserScript alloc]
          initWithSource:WebARonARKitJSContent
           injectionTime:WKUserScriptInjectionTimeAtDocumentStart
        forMainFrameOnly:true];
    WKUserContentController *userContentController =
        [[WKUserContentController alloc] init];
    [userContentController addScriptMessageHandler:self name:@"WebARonARKit"];
    [userContentController addUserScript:WebARonARKitJSUserScript];
    WKWebViewConfiguration *wkWebViewConfig =
        [[WKWebViewConfiguration alloc] init];
    wkWebViewConfig.userContentController = userContentController;
    // Create the WKWebView using the configuration/script injection and add it to
    // the top of the view graph
    self->wkWebView = [[WKWebView alloc]
        initWithFrame:CGRectMake(
                          0, URL_TEXTFIELD_HEIGHT, self.view.frame.size.width,
                          self.view.frame.size.height - URL_TEXTFIELD_HEIGHT)
        configuration:wkWebViewConfig];
    self->wkWebViewOriginalBackgroundColor = self->wkWebView.backgroundColor;
    // By default, the camera feed won't be shown until instructed otherwise
    [self setShowCameraFeed:false];
    [self->wkWebView.configuration.preferences
        setValue:@TRUE
          forKey:@"allowFileAccessFromFileURLs"];
    [self setWKWebViewScrollEnabled:true];
    // Needed to show alerts. Check the WKUIDelegate protocol and the
    // runJavaScriptAlertPanelWithMessage method in this file :(
    self->wkWebView.UIDelegate = self;
    self->wkWebView.navigationDelegate = self;
    [self.view addSubview:self->wkWebView];
    
    // Add a textfield for the URL on top of the webview
    self->urlTextField = [[UITextField alloc]
        initWithFrame:CGRectMake(URL_TEXTFIELD_HEIGHT, 0, self.view.frame.size.width - URL_TEXTFIELD_HEIGHT * 2,
                                 URL_TEXTFIELD_HEIGHT)];
    [self->urlTextField setBackgroundColor:[UIColor whiteColor]];
    [self->urlTextField setTextColor:[UIColor colorWithRed:0.2f green:0.2f blue:0.2f alpha:1.0]];
    [self->urlTextField setKeyboardType:UIKeyboardTypeURL];
    [self->urlTextField setAutocorrectionType:UITextAutocorrectionTypeNo];
    [self->urlTextField setAutocapitalizationType:UITextAutocapitalizationTypeNone];
    [self->urlTextField setDelegate:self];
    [self.view addSubview:self->urlTextField];

    // Add the back/refresh buttons
    self->backButton = [[UIButton alloc] initWithFrame:CGRectMake(0, 0, URL_TEXTFIELD_HEIGHT, URL_TEXTFIELD_HEIGHT)];
    self->backButton.backgroundColor = [UIColor whiteColor];
    UIImage *backIcon = [UIImage imageNamed:@"BackIcon"];
    [self->backButton setImage:backIcon forState:UIControlStateNormal];
    [self->backButton addTarget:self action:@selector(backButtonClicked:) forControlEvents:UIControlEventTouchDown];
    [self.view addSubview:self->backButton];

    self->refreshButton = [[UIButton alloc] initWithFrame:CGRectMake(self.view.frame.size.width - URL_TEXTFIELD_HEIGHT, 0, URL_TEXTFIELD_HEIGHT, URL_TEXTFIELD_HEIGHT)];
    [self->refreshButton setBackgroundColor:[UIColor whiteColor]];
    UIImage *refreshIcon = [UIImage imageNamed:@"RefreshIcon"];
    [self->refreshButton setImage:refreshIcon forState:UIControlStateNormal];
    [self->refreshButton addTarget:self action:@selector(refreshButtonClicked:) forControlEvents:UIControlEventTouchDown];
    [self.view addSubview:self->refreshButton];

    //Progress View Setup
    [self initProgressView];
    //Observe the estimatedProgress to uodate progress view
    [self->wkWebView addObserver:self forKeyPath:NSStringFromSelector(@selector(estimatedProgress)) options:NSKeyValueObservingOptionNew context:NULL];
    
    // Load the default website
    NSString *defaultSite = @"https://developers.google.com/ar/develop/web/getting-started#examples";
    NSURL *url = [NSURL URLWithString:defaultSite];
    [self->wkWebView loadRequest:[NSURLRequest requestWithURL:url]];
    [self->urlTextField setText:defaultSite];
    self->initialPageLoadedWhenTrackingBegins = false;

    // Calculate the orientation of the device
    UIDevice *device = [UIDevice currentDevice];
    [device beginGeneratingDeviceOrientationNotifications];
    [[NSNotificationCenter defaultCenter]
        addObserver:self
           selector:@selector(deviceOrientationDidChange:)
               name:UIDeviceOrientationDidChangeNotification
             object:nil];
    deviceOrientation = [device orientation];
    [self updateOrientation];
}

- (void)dealloc {
    
    if ([self isViewLoaded]) {
        [self->wkWebView removeObserver:self forKeyPath:NSStringFromSelector(@selector(estimatedProgress))];
    }
    
    [self->wkWebView setNavigationDelegate:nil];
    [self->wkWebView setUIDelegate:nil];
}

#pragma mark - Progress View

- (void)initProgressView {
    self.progressView = [[ProgressView alloc] initWithFrame:CGRectMake(0, URL_TEXTFIELD_HEIGHT - PROGRESSVIEW_HEIGHT, self.view.frame.size.width, PROGRESSVIEW_HEIGHT)];
    [self.view addSubview:self.progressView];
    [self setProgressViewColorSuccessful];
    [self startAndShowProgressView];
}

- (void)setProgressViewColorSuccessful {
    //Material Design Blue 100 #BBDEFB
    [self.progressView setProgressBackgroundColor:[UIColor colorWithRed:0.7333333333 green:0.8705882353 blue:0.9843137255 alpha:1.0]];
    //Material Design Blue 500 #2196F3
    [self.progressView setProgressFillColor:[UIColor colorWithRed:0.1294117647 green:0.5882352941 blue:0.9529411765 alpha:1.0]];
}

                                             
- (void)setProgressViewColorErrored {
    //Material Design Red 100 #FFCDD2
    [self.progressView setProgressFillColor:[UIColor colorWithRed:1.0 green:0.8039215686 blue:0.8235294118 alpha:1.0]];
    //Material Design Red 500 #F44336
    [self.progressView setProgressFillColor:[UIColor colorWithRed:0.9568627451 green:0.262745098 blue:0.2117647059 alpha:1.0]];
}

- (void)startAndShowProgressView {
    self.progressView.progressValue = 0;
    [self.progressView setHidden:NO animated:YES completion:nil];
}

- (void)completeAndHideProgressViewSuccessful {
    __weak __typeof__(self) weakSelf = self;
    [self.progressView setProgressValue:1 animated:YES completion:^(BOOL finished){
        [weakSelf.progressView setHidden:YES animated:YES completion:nil];
    }];
}

- (void)completeAndHideProgressViewErrored:(float) progress {
    __weak __typeof__(self) weakSelf = self;
    [self.progressView setProgressValue:progress animated:YES completion:^(BOOL finished){
        [weakSelf.progressView setHidden:YES animated:YES completion:nil];
    }];
}

- (void)deviceOrientationDidChange:(NSNotification *)notification
{
    [self->urlTextField setFrame:CGRectMake(URL_TEXTFIELD_HEIGHT, 0, self.view.frame.size.width - URL_TEXTFIELD_HEIGHT * 2, URL_TEXTFIELD_HEIGHT)];

    [self->refreshButton setFrame:CGRectMake(self.view.frame.size.width - URL_TEXTFIELD_HEIGHT, 0, URL_TEXTFIELD_HEIGHT, URL_TEXTFIELD_HEIGHT)];

    [self->wkWebView setFrame:CGRectMake(0, URL_TEXTFIELD_HEIGHT, self.view.frame.size.width,
                                         self.view.frame.size.height - URL_TEXTFIELD_HEIGHT)];

    [self.progressView setFrame:CGRectMake(0, URL_TEXTFIELD_HEIGHT - PROGRESSVIEW_HEIGHT, self.view.frame.size.width, PROGRESSVIEW_HEIGHT)];
    
    [self updateOrientation];
    updateWindowSize = true;
}

- (void)updateOrientation
{
    deviceOrientation = [[UIDevice currentDevice] orientation];
    switch (deviceOrientation) {
        case UIDeviceOrientationPortrait: {
            interfaceOrientation = UIInterfaceOrientationPortrait;
        } break;

        case UIDeviceOrientationPortraitUpsideDown: {
            interfaceOrientation = UIInterfaceOrientationPortraitUpsideDown;
        } break;

        case UIDeviceOrientationLandscapeLeft: {
            interfaceOrientation = UIInterfaceOrientationLandscapeRight;
        } break;

        case UIDeviceOrientationLandscapeRight: {
            interfaceOrientation = UIInterfaceOrientationLandscapeLeft;
        } break;

        default:
            break;
    }
    [self->_renderer setInterfaceOrientation:interfaceOrientation];
}
- (void)restartSession
{
    ARWorldTrackingConfiguration *configuration =
        [ARWorldTrackingConfiguration new];
    configuration.planeDetection = ARPlaneDetectionHorizontal;
    [self.session runWithConfiguration:configuration
                               options:ARSessionRunOptionResetTracking];
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];

    UIDevice *device = [UIDevice currentDevice];
    if (![device isGeneratingDeviceOrientationNotifications]) {
        [device beginGeneratingDeviceOrientationNotifications];
    }

    [self restartSession];
}

- (void)viewWillDisappear:(BOOL)animated
{
    [super viewWillDisappear:animated];

    UIDevice *device = [UIDevice currentDevice];
    if ([device isGeneratingDeviceOrientationNotifications]) {
        [device endGeneratingDeviceOrientationNotifications];
    }
    [self.session pause];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Release any cached data, images, etc that aren't in use.
}

- (void)handleTap:(UIGestureRecognizer *)gestureRecognize
{
    ARFrame *currentFrame = [self.session currentFrame];

    // Create anchor using the camera's current position
    if (currentFrame) {
        // Create a transform with a translation of 0.2 meters in front of the
        // camera
        matrix_float4x4 translation = matrix_identity_float4x4;
        translation.columns[3].z = -0.2;
        matrix_float4x4 transform =
            matrix_multiply(currentFrame.camera.transform, translation);

        // Add a new anchor to the session
        ARAnchor *anchor = [[ARAnchor alloc] initWithTransform:transform];
        [self.session addAnchor:anchor];
    }
}

#pragma mark - MTKViewDelegate

// Called whenever view changes orientation or layout is changed
- (void)mtkView:(nonnull MTKView *)view drawableSizeWillChange:(CGSize)size
{
    [self.renderer drawRectResized:view.bounds.size];
}

// Called whenever the view needs to render
- (void)drawInMTKView:(nonnull MTKView *)view
{
    [self.renderer update];
}

#pragma mark - ARSessionDelegate

- (void)session:(ARSession *)session didFailWithError:(NSError *)error
{
    // Present an error message to the user
}

- (void)sessionWasInterrupted:(ARSession *)session
{
    // Inform the user that the session has been interrupted, for example, by
    // presenting an overlay
}

- (void)sessionInterruptionEnded:(ARSession *)session
{
    // Reset tracking and/or remove existing anchors if consistent tracking is
    // required
}

- (NSString *)getPlanesString:(nonnull NSArray<ARAnchor *> *)anchors
{
  NSString *result = @"[";
  for (int i = 0; i < anchors.count; i++) {
    if (![anchors[i] isKindOfClass:[ARPlaneAnchor class]]) {
      // We only want anchors of type plane.
      continue;
    }
    ARPlaneAnchor *plane = (ARPlaneAnchor *)anchors[i];
    matrix_float4x4 planeTransform = plane.transform;
    const float *planeMatrix = (const float *)(&planeTransform);
    NSString *planeStr = [NSString stringWithFormat:
                          @"{\"modelMatrix\":[%f,%f,%f,%f,%f,%f,%f,%f,"
                          @"%f,%f,%f,%f,%f,%f,%f,%f],"
                          @"\"identifier\":%i,"
                          @"\"alignment\":%i,"
                          @"\"extent\":[%f,%f],"
                          @"\"vertices\":[%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f]}",
                          planeMatrix[0], planeMatrix[1], planeMatrix[2],
                          planeMatrix[3], planeMatrix[4], planeMatrix[5],
                          planeMatrix[6], planeMatrix[7], planeMatrix[8],
                          planeMatrix[9], planeMatrix[10], planeMatrix[11],
                          planeMatrix[12] + plane.center.x,
                          planeMatrix[13] + plane.center.y,
                          planeMatrix[14] + plane.center.z,
                          planeMatrix[15],
                          (int)plane.identifier,
                          (int)plane.alignment,
                          plane.extent.x, plane.extent.z,
                          plane.extent.x / 2, 0.0, plane.extent.z / 2,
                          -plane.extent.x / 2, 0.0, plane.extent.z / 2,
                          -plane.extent.x / 2, 0.0, -plane.extent.z / 2,
                          plane.extent.x / 2, 0.0, -plane.extent.z / 2];
        if (i < anchors.count - 1) {
            planeStr = [planeStr stringByAppendingString:@","];
        }
        result = [result stringByAppendingString:planeStr];
    }
    result = [result stringByAppendingString:@"]"];
    return result;
}

- (void) dispatchVRDisplayPlaneEvent:(NSString *)type planes:(NSString *)planes
{
  NSString *jsCode = [NSString
        stringWithFormat:@"if (window.WebARonARKitDispatchARDisplayEvent) "
                         @"window.WebARonARKitDispatchARDisplayEvent({"
                         @"\"type\":\"%@\","
                         @"\"planes\":%@"
                         @"});",
                         type,
                         planes];

    [self->wkWebView
        evaluateJavaScript:jsCode
         completionHandler:^(id data, NSError *error) {
             if (error) {
                 [self showAlertDialog:
                     [NSString stringWithFormat:@"ERROR: Evaluating jscode: %@", error]
                     completionHandler:^{
                     }];
             }
         }];
}

- (void)session:(ARSession *)session didAddAnchors:(nonnull NSArray<ARAnchor *> *)anchors
{
  [self dispatchVRDisplayPlaneEvent:@"planesadded" planes:[self getPlanesString:anchors]];
}

- (void)session:(ARSession *)session didUpdateAnchors:(nonnull NSArray<ARAnchor *> *)anchors
{
  [self dispatchVRDisplayPlaneEvent:@"planesupdated" planes:[self getPlanesString:anchors]];
}

- (void)session:(ARSession *)session didRemoveAnchors:(nonnull NSArray<ARAnchor *> *)anchors
{
  NSString *removedStr = @"[";
  for (int i = 0; i < anchors.count; i++) {
    if (![anchors[i] isKindOfClass:[ARPlaneAnchor class]]) {
      // We only want anchors of type plane.
      continue;
    }
    ARPlaneAnchor *plane = (ARPlaneAnchor *)anchors[i];
    NSString *identifierStr = [NSString stringWithFormat:
                           @"%i",
                           (int)plane.identifier];
    if (i < anchors.count - 1) {
      identifierStr = [identifierStr stringByAppendingString:@","];
    }
    removedStr = [removedStr stringByAppendingString:identifierStr];
  }
  removedStr = [removedStr stringByAppendingString:@"]"];

  [self dispatchVRDisplayPlaneEvent:@"planesremoved" planes:removedStr];
}

- (void)session:(ARSession *)session didUpdateFrame:(ARFrame *)frame
{
    // If the window size has changed, notify the JS side about it.
    // This is a hack due to the WKWebView not handling the
    // window.innerWidth/Height
    // correctly in the window.onresize events.
    // TODO: Remove this hack once the WKWebView has fixed the issue.

    // Send the per frame data needed in the JS side
    matrix_float4x4 viewMatrix =
        [frame.camera viewMatrixForOrientation:interfaceOrientation];
    matrix_float4x4 modelMatrix = matrix_invert(viewMatrix);
    matrix_float4x4 projectionMatrix = [frame.camera
        projectionMatrixForOrientation:interfaceOrientation
                          viewportSize:CGSizeMake(self->wkWebView.frame.size.width,
                                                  self->wkWebView.frame.size.height)
                                 zNear:self->near
                                  zFar:self->far];

    const float *pModelMatrix = (const float *)(&modelMatrix);
    const float *pViewMatrix = (const float *)(&viewMatrix);
    const float *pProjectionMatrix = (const float *)(&projectionMatrix);

    simd_quatf orientationQuat = simd_quaternion(modelMatrix);
    const float *pOrientationQuat = (const float *)(&orientationQuat);
    float position[3];
    position[0] = pModelMatrix[12];
    position[1] = pModelMatrix[13];
    position[2] = pModelMatrix[14];

    // TODO: Testing to see if we can pass the whole frame to JS...
    //  size_t width = CVPixelBufferGetWidth(frame.capturedImage);
    //  size_t height = CVPixelBufferGetHeight(frame.capturedImage);
    //  size_t bytesPerRow = CVPixelBufferGetBytesPerRow(frame.capturedImage);
    //  void* pixels = CVPixelBufferGetBaseAddress(frame.capturedImage);
    //  OSType pixelFormatType =
    //  CVPixelBufferGetPixelFormatType(frame.capturedImage);
    //  NSLog(@"width = %d, height = %d, bytesPerRow = %d, ostype = %d", width,
    //  height, bytesPerRow, pixelFormatType);
    
    NSString *jsCode = [NSString
        stringWithFormat:@"if (window.WebARonARKitSetData) "
                         @"window.WebARonARKitSetData({"
                         @"\"position\":[%f,%f,%f],"
                         @"\"orientation\":[%f,%f,%f,%f],"
                         @"\"viewMatrix\":[%f,%f,%f,%f,%f,%f,%f,%"
                         @"f,%f,%f,%f,%f,%f,%f,%f,%f],"
                         @"\"projectionMatrix\":[%f,%f,%f,%f,%f,%f,%f,%"
                         @"f,%f,%f,%f,%f,%f,%f,%f,%f]"
                         @"});",
                         position[0], position[1], position[2],
                         pOrientationQuat[0], pOrientationQuat[1],
                         pOrientationQuat[2], pOrientationQuat[3], pViewMatrix[0],
                         pViewMatrix[1], pViewMatrix[2], pViewMatrix[3],
                         pViewMatrix[4], pViewMatrix[5], pViewMatrix[6],
                         pViewMatrix[7], pViewMatrix[8], pViewMatrix[9],
                         pViewMatrix[10], pViewMatrix[11], pViewMatrix[12],
                         pViewMatrix[13], pViewMatrix[14], pViewMatrix[15],
                         pProjectionMatrix[0], pProjectionMatrix[1],
                         pProjectionMatrix[2], pProjectionMatrix[3],
                         pProjectionMatrix[4], pProjectionMatrix[5],
                         pProjectionMatrix[6], pProjectionMatrix[7],
                         pProjectionMatrix[8], pProjectionMatrix[9],
                         pProjectionMatrix[10], pProjectionMatrix[11],
                         pProjectionMatrix[12], pProjectionMatrix[13],
                         pProjectionMatrix[14], pProjectionMatrix[15]];

    [self->wkWebView
        evaluateJavaScript:jsCode
         completionHandler:^(id data, NSError *error) {
             if (error) {
                 [self showAlertDialog:
                           [NSString stringWithFormat:@"ERROR: Evaluating jscode: %@",
                                                      error]
                     completionHandler:^{
                     }];
             }
         }];

    //This needs to be called after because the window size will affect the
    //projection matrix calculation upon resize
    if (updateWindowSize) {
        int width = self->wkWebView.frame.size.width;
        int height = self->wkWebView.frame.size.height;
        NSString *updateWindowSizeJsCode = [NSString
            stringWithFormat:
                @"if(window.WebARonARKitSetWindowSize)"
                @"WebARonARKitSetWindowSize({\"width\":%i,\"height\":%i});",
                width, height];
        [self->wkWebView
            evaluateJavaScript:updateWindowSizeJsCode
             completionHandler:^(id data, NSError *error) {
                 if (error) {
                     [self showAlertDialog:
                               [NSString stringWithFormat:
                                             @"ERROR: Evaluating jscode to provide "
                                             @"window size: %@",
                                             error]
                         completionHandler:^{
                         }];
                 }
             }];
        updateWindowSize = false;
    }
}

#pragma mark - WK Estimated Progress

- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context {
    if ([keyPath isEqualToString:NSStringFromSelector(@selector(estimatedProgress))] && object == self->wkWebView) {        
        if( self.webviewNavigationSuccess ) {
            [self.progressView setProgressValue:self->wkWebView.estimatedProgress];
        }
    }
    else {
        [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
    }
}

#pragma mark - WKUIDelegate

- (void)webView:(WKWebView *)webView
    runJavaScriptAlertPanelWithMessage:(NSString *)message
                      initiatedByFrame:(WKFrameInfo *)frame
                     completionHandler:(void (^)(void))completionHandler
{
    [self showAlertDialog:message completionHandler:completionHandler];
}

#pragma mark - WKNavigationDelegate

- (void)webView:(WKWebView *)webView
    didStartProvisionalNavigation:(null_unspecified WKNavigation *)navigation
{
    [self setShowCameraFeed:false];
    [self startAndShowProgressView];
    [self setProgressViewColorSuccessful];
    self.webviewNavigationSuccess = true;
}

- (void)webView:(WKWebView *)webView
    didFinishNavigation:(WKNavigation *)navigation
{
    [self restartSession];
    // By default, when a page is loaded, the camera feed should not be shown.
    [self->urlTextField setText:[[self->wkWebView URL] absoluteString]];
    [self setProgressViewColorSuccessful];
    [self completeAndHideProgressViewSuccessful];
}

- (void)webView:(WKWebView *)webView
    didFailNavigation:(WKNavigation *)navigation
            withError:(NSError *)error
{
    self.webviewNavigationSuccess = false;
    if (error.code != -999) {
        [self showAlertDialog:error.localizedDescription completionHandler:nil];
        NSLog(@"ERROR: webview didFailNavigation with error '%@'", error);
    }
    [self setProgressViewColorErrored];
    [self completeAndHideProgressViewErrored:self->wkWebView.estimatedProgress];
}

- (void)webViewDidFinishLoad:(UIWebView *)webView
{
    [self restartSession];
    [self completeAndHideProgressViewSuccessful];
}

- (void)webView:(WKWebView *)webView
    didFailProvisionalNavigation:(WKNavigation *)navigation
                       withError:(NSError *)error
{
    self.webviewNavigationSuccess = false;
    if (error.code != -999) {
        [self showAlertDialog:error.localizedDescription completionHandler:nil];
        NSLog(@"ERROR: webview didFailProvisionalNavigation with error '%@'", error);
    }
    [self setProgressViewColorErrored];
    [self completeAndHideProgressViewErrored:self->wkWebView.estimatedProgress];
}

#pragma mark - UITextFieldDelegate

- (BOOL)textFieldShouldReturn:(UITextField *)textField
{
    BOOL result = NO;
    NSString *urlString = self->urlTextField.text;
    if (![self loadURLInWKWebView:urlString]) {
        [self showAlertDialog:@"The URL is not valid." completionHandler:NULL];
    } else {
        [self storeURLInUserDefaults:urlString];
        [self->urlTextField resignFirstResponder];
        result = YES;
    }
    return result;
}

#pragma mark - ARSessionObserver

- (void)session:(ARSession *)session
    cameraDidChangeTrackingState:(ARCamera *)camera
{
    NSString *trackingStateString = nil;
    if (camera.trackingState == ARTrackingStateNotAvailable) {
        trackingStateString = @"Not Available";
    } else if (camera.trackingState == ARTrackingStateLimited) {
        trackingStateString = @"Limited";
    } else if (camera.trackingState == ARTrackingStateNormal) {
        trackingStateString = @"Normal";
    }
    NSString *trackingStateReasonString = nil;
    if (camera.trackingStateReason == ARTrackingStateReasonExcessiveMotion) {
        trackingStateReasonString = @"Excessive Motion";
    } else if (camera.trackingStateReason ==
               ARTrackingStateReasonInsufficientFeatures) {
        trackingStateReasonString = @"Insufficient Featues";
    }
    NSLog(@"AR camera tracking state = %@%@", trackingStateString,
          (trackingStateReasonString != nil ? trackingStateReasonString : @""));

    // Only the first time the tacking state is something else but unavailable
    // load the initial page.
    if (camera.trackingState != ARTrackingStateNotAvailable &&
        !self->initialPageLoadedWhenTrackingBegins) {
        // Retore a URL from a previous execution and load it.
        NSString *urlString = [self getURLFromUserDefaults];
        if (urlString) {
            // As the code bellow does not allow to store invalid URLs, we will assume
            // that the URL is
            // correct.
            if (![self loadURLInWKWebView:urlString]) {
                [self showAlertDialog:@"The URL is not valid." completionHandler:NULL];
            }
            self->urlTextField.text = urlString;
        }
        self->initialPageLoadedWhenTrackingBegins = true;
    }
}

#pragma mark - WKScriptMessageHandler

- (void)userContentController:(WKUserContentController *)userContentController
      didReceiveScriptMessage:(WKScriptMessage *)message
{
    NSString *messageString = message.body;
    NSArray *values = [messageString componentsSeparatedByString:@":"];
    if ([values count] > 1) {
        NSString *method = values[0];
        NSArray *params = [values[1] componentsSeparatedByString:@","];
        if ([method isEqualToString:@"setDepthNear"]) {
            self->near = [params[0] floatValue];
        } else if ([method isEqualToString:@"setDepthFar"]) {
            self->far = [params[0] floatValue];
        } else if ([method isEqualToString:@"log"]) {
            // As a log command can have colons in its content, just get rid of the
            // 'log:' string and show the rest.
            NSRange range = NSMakeRange(4, messageString.length - 4);
            NSLog(@"%@", [message.body substringWithRange:range]);
        } else if ([method isEqualToString:@"resetPose"]) {
            [self restartSession];
        } else if ([method isEqualToString:@"showCameraFeed"]) {
            [self setShowCameraFeed:true];
        } else if ([method isEqualToString:@"hideCameraFeed"]) {
            [self setShowCameraFeed:false];
        } else {
            NSLog(@"WARNING: Unknown message received: '%@'", method);
        }
    }
}

@end
