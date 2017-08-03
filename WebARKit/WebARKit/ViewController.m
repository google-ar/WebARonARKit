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

#define URL_TEXTFIELD_HEIGHT 30

@interface ViewController ()<MTKViewDelegate, ARSessionDelegate>

@property(nonatomic, strong) ARSession *session;
@property(nonatomic, strong) Renderer *renderer;

@end

@interface MTKView ()<RenderDestinationProvider>

@end

void extractQuaternionFromMatrix(const float *m, float *o) {
  assert(m != o);

  // Code from
  // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/

  // 2 dimensional matrix conversion:

  // FROM

  // 0,0  1,0  2,0
  // 0,1  1,1  2,1
  // 0,2  1,2  2,2

  // TO

  // 0    1    2
  // 4    5    6
  // 8    9    10

  float trace = m[0] + m[5] + m[10];  // I removed + 1.0f; see discussion with Ethan
  if (trace > 0) {                    // I changed M_EPSILON to 0
    float s = 0.5f / sqrtf(trace + 1.0f);
    o[3] = 0.25f / s;
    o[0] = (m[6] - m[9]) * s;
    o[1] = (m[8] - m[2]) * s;
    o[2] = (m[1] - m[4]) * s;
  } else {
    if (m[0] > m[5] && m[0] > m[10]) {
      float s = 2.0f * sqrtf(1.0f + m[0] - m[5] - m[10]);
      o[3] = (m[6] - m[9]) / s;
      o[0] = 0.25f * s;
      o[1] = (m[4] + m[1]) / s;
      o[2] = (m[8] + m[2]) / s;
    } else if (m[5] > m[10]) {
      float s = 2.0f * sqrtf(1.0f + m[5] - m[0] - m[10]);
      o[3] = (m[8] - m[2]) / s;
      o[0] = (m[4] + m[1]) / s;
      o[1] = 0.25f * s;
      o[2] = (m[9] + m[6]) / s;
    } else {
      float s = 2.0f * sqrtf(1.0f + m[10] - m[0] - m[5]);
      o[3] = (m[1] - m[4]) / s;
      o[0] = (m[8] + m[2]) / s;
      o[1] = (m[9] + m[6]) / s;
      o[2] = 0.25f * s;
    }
  }
}

@implementation ViewController

- (void)showAlertDialog:(NSString *)message completionHandler:(void (^)(void))completionHandler {
  UIAlertController *alertController =
      [UIAlertController alertControllerWithTitle:message
                                          message:nil
                                   preferredStyle:UIAlertControllerStyleAlert];
  [alertController addAction:[UIAlertAction actionWithTitle:@"OK"
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

- (void)setWKWebViewScrollEnabled:(BOOL)enabled {
  self->wkWebView.scrollView.scrollEnabled = enabled;
  self->wkWebView.scrollView.panGestureRecognizer.enabled = enabled;
  self->wkWebView.scrollView.bounces = enabled;
}

- (bool)loadURLInWKWebView:(NSString*)urlString
{
    bool result = true;
    NSURL* nsurl = [NSURL URLWithString:urlString];
    if (!nsurl || !nsurl.scheme || !nsurl.host)
    {
        // The string is not a URL. Is it a local path?
        NSString* path = [[NSBundle mainBundle] pathForResource:urlString ofType:@"html"];
        NSLog(@"Loading a file from resources with path = %@", path);
        if (path)
        {
            NSURL *url = [[NSBundle mainBundle] URLForResource:urlString withExtension:@"html"];
            [self->wkWebView loadRequest:[NSURLRequest requestWithURL:url]];
        }
        else
        {
            result = false;
        }
    }
    else
    {
        NSURLRequest* nsrequest=[NSURLRequest requestWithURL:nsurl];
        [self->wkWebView loadRequest:nsrequest];
    }
    return result;
}

- (NSString *)getURLFromUserDefaults {
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  return [defaults stringForKey:@"url"];
}

- (void)storeURLInUserDefaults:(NSString *)urlString {
  NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
  [defaults setObject:urlString forKey:@"url"];
  [defaults synchronize];
}

- (void)viewDidLoad {
  [super viewDidLoad];

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
      [[UITapGestureRecognizer alloc] initWithTarget:self action:@selector(handleTap:)];
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
  // Add the WKWebView on top of the Metal view
  self->wkWebView = [[WKWebView alloc]
      initWithFrame:CGRectMake(0, URL_TEXTFIELD_HEIGHT, self.view.frame.size.width,
                               self.view.frame.size.height - URL_TEXTFIELD_HEIGHT)];
  self->wkWebView.opaque = false;
  self->wkWebView.backgroundColor = [UIColor clearColor];
  self->wkWebView.scrollView.backgroundColor = [UIColor clearColor];
  [self->wkWebView.configuration.preferences setValue:@TRUE forKey:@"allowFileAccessFromFileURLs"];
  [self setWKWebViewScrollEnabled:false];
  // Needed to show alerts. Check the WKUIDelegate protocol and the
  // runJavaScriptAlertPanelWithMessage method in this file :(
  self->wkWebView.UIDelegate = self;
  [self.view addSubview:self->wkWebView];

  // Create the bidge to communicate the ObjectiveC code with the JavaScript code in the WKWebView
  // The bridge will log all the communications (useful during development). Comment it out for a
  // cleaner console (production).
  //    [WebViewJavascriptBridge enableLogging];
  self->bridge = [WebViewJavascriptBridge bridgeForWebView:self->wkWebView];
  // TODO - IMPORTANT (Iker Jamardo): There seems to be a bug in the WebViewJavascriptBridge and the
  // decisionHandler of one of the delegat methods is being called multiple times and iOS does not
  // seem to like it. In essence, and AFAIK, this is a correct behavior because different pages need
  // to be loaded (the requested page, the request to inject the JavaScript bridge code, ...) and
  // all require to specify an allow policy. In order to fix it with a hack (without modifying
  // WebViewJavascriptBridge) it is mandatory to listen to the webview delegate and handle the call
  // of the decisionHandler here. Check the code of the decidePolicyForNavigationAction method to
  // further understand the fix.
  [self->bridge setWebViewDelegate:self];
  // TODO: Change the inline functions for methods in this class to make the code clearer/cleaner.
  [self->bridge
      registerHandler:@"getPose"
              handler:^(id data, WVJBResponseCallback responseCallback) {
                ARFrame *currentFrame = [self.session currentFrame];
                matrix_float4x4 m = currentFrame.camera.transform;
                const float *matrix = (const float *)(&m);
                float orientation[4];
                extractQuaternionFromMatrix(matrix, orientation);
                float position[3];
                position[0] = matrix[12];
                position[1] = matrix[13];
                position[2] = matrix[14];
                data = [NSString
                    stringWithFormat:@"{\"position\":[%f,%f,%f],\"orientation\":[%f,%f,%f,%f]}",
                                     position[0], position[1], position[2], orientation[0],
                                     orientation[1], orientation[2], orientation[3]];
                responseCallback(data);
              }];
  [self->bridge registerHandler:@"getProjectionMatrix"
                        handler:^(id data, WVJBResponseCallback responseCallback) {
                          ARFrame *currentFrame = [self.session currentFrame];
                          matrix_float4x4 m4x4 = [currentFrame.camera
                              projectionMatrixWithViewportSize:self.renderer->viewportSize
                                                   orientation:UIInterfaceOrientationLandscapeRight
                                                         zNear:0.001
                                                          zFar:1000];
                          //        matrix_float4x4 m4x4 = currentFrame.camera.projectionMatrix;
                          const float *m = (const float *)(&m4x4);
                          data = [NSString
                              stringWithFormat:@"[%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f]",
                                               m[0], m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8],
                                               m[9], m[10], m[11], m[12], m[13], m[14], m[15]];
                          responseCallback(data);
                        }];
  [self->bridge
      registerHandler:@"hitTest"
              handler:^(id data, WVJBResponseCallback responseCallback) {
                NSString *dataString = data;
                NSArray *values = [dataString componentsSeparatedByString:@","];
                float x = [values[0] floatValue];
                float y = [values[1] floatValue];
                CGPoint point = CGPointMake(x, y);
                ARFrame *currentFrame = [self.session currentFrame];
                // TODO: Play with the different types of hit tests to see what corresponds best
                // with what tango already provides.
                NSArray<ARHitTestResult *> *hits = [currentFrame
                    hitTest:point
                      types:(ARHitTestResultType)ARHitTestResultTypeExistingPlaneUsingExtent];
                //        NSArray<ARHitTestResult *> * hits = [currentFrame hitTest:point
                //        types:(ARHitTestResultType)ARHitTestResultTypeExistingPlane];
                if (hits.count > 0) {
                  matrix_float4x4 m = hits[0].worldTransform;
                  const float *matrix = (const float *)(&m);
                  float plane[4];
                  plane[0] = matrix[4];
                  plane[1] = matrix[5];
                  plane[2] = matrix[6];
                  plane[3] = 1;
                  float point[3];
                  point[0] = matrix[12];
                  point[1] = matrix[13];
                  point[2] = matrix[14];
                  data = [NSString
                      stringWithFormat:@"{\"p\":[%@],\"point\":[%f,%f,%f],\"plane\":[%f,%f,%f,%f]}",
                                       data, point[0], point[1], point[2], plane[0], plane[1],
                                       plane[2], plane[3]];
                } else {
                  data = nil;
                }
                //        NSLog(@"WebARKit: hitTest hits count for (%f, %f) = %ld - %@", x, y,
                //        hits.count, data);
                responseCallback(data);
              }];

  // Add a textfield for the URL on top of the webview
  self->urlTextField = [[UITextField alloc]
      initWithFrame:CGRectMake(0, 0, self.view.frame.size.width, URL_TEXTFIELD_HEIGHT)];
  self->urlTextField.backgroundColor = [UIColor whiteColor];
  [self->urlTextField setKeyboardType:UIKeyboardTypeURL];
  self->urlTextField.autocapitalizationType = UITextAutocapitalizationTypeNone;
  self->urlTextField.delegate = self;
  [self.view addSubview:self->urlTextField];

  self->initialPageLoadedWhenTrackingBegins = false;
}

- (void)viewWillAppear:(BOOL)animated {
  [super viewWillAppear:animated];

  ARWorldTrackingSessionConfiguration *configuration = [ARWorldTrackingSessionConfiguration new];
  configuration.planeDetection = ARPlaneDetectionHorizontal;

  [self.session runWithConfiguration:configuration];
}

- (void)viewWillDisappear:(BOOL)animated {
  [super viewWillDisappear:animated];

  [self.session pause];
}

- (void)didReceiveMemoryWarning {
  [super didReceiveMemoryWarning];
  // Release any cached data, images, etc that aren't in use.
}

- (void)handleTap:(UIGestureRecognizer *)gestureRecognize {
  ARFrame *currentFrame = [self.session currentFrame];

  // Create anchor using the camera's current position
  if (currentFrame) {
    // Create a transform with a translation of 0.2 meters in front of the camera
    matrix_float4x4 translation = matrix_identity_float4x4;
    translation.columns[3].z = -0.2;
    matrix_float4x4 transform = matrix_multiply(currentFrame.camera.transform, translation);

    // Add a new anchor to the session
    ARAnchor *anchor = [[ARAnchor alloc] initWithTransform:transform];
    [self.session addAnchor:anchor];
  }
}

#pragma mark - MTKViewDelegate

// Called whenever view changes orientation or layout is changed
- (void)mtkView:(nonnull MTKView *)view drawableSizeWillChange:(CGSize)size {
  [self.renderer drawRectResized:view.bounds.size];
}

// Called whenever the view needs to render
- (void)drawInMTKView:(nonnull MTKView *)view {
  [self.renderer update];
}

#pragma mark - ARSessionDelegate

- (void)session:(ARSession *)session didFailWithError:(NSError *)error {
  // Present an error message to the user
}

- (void)sessionWasInterrupted:(ARSession *)session {
  // Inform the user that the session has been interrupted, for example, by presenting an overlay
}

- (void)sessionInterruptionEnded:(ARSession *)session {
  // Reset tracking and/or remove existing anchors if consistent tracking is required
}

- (void)session:(ARSession *)session didUpdateFrame:(ARFrame *)frame {
    matrix_float4x4 m = frame.camera.transform;
    matrix_float4x4 p = [frame.camera
                    projectionMatrixWithViewportSize:self.renderer->viewportSize
                    orientation:UIInterfaceOrientationLandscapeRight
                    zNear:0.001
                    zFar:1000];
    
  const float *matrix = (const float *)(&m);
  const float *pMatrix = (const float *)(&p);

  float orientation[4];
  extractQuaternionFromMatrix(matrix, orientation);
  float position[3];
  position[0] = matrix[12];
  position[1] = matrix[13];
  position[2] = matrix[14];
  NSString *updatePoseJsCode =
      [NSString stringWithFormat:@"if (window.WebARKitSetPose) "
                                 @"window.WebARKitSetPose({\"position\":[%f,%f,%f],"
                                 @"\"orientation\":[%f,%f,%f,%f]});",
                                 position[0], position[1], position[2], orientation[0],
                                 orientation[1], orientation[2], orientation[3]];
    
    [self->wkWebView
      evaluateJavaScript:updatePoseJsCode
       completionHandler:^(id data, NSError *error) {
         if (error) {
           [self showAlertDialog:
                     [NSString
                         stringWithFormat:@"ERROR: Evaluating jscode to provide pose: %@", error]
               completionHandler:^{
               }];
         }
       }];

  NSString *updateProjectionMatrixJsCode = [NSString
      stringWithFormat:@"if (window.WebARKitSetProjectionMatrix) "
                       @"WebARKitSetProjectionMatrix([%f,%f,%f,%f,%f,%f,%f,%"
                       @"f,%f,%f,%f,%f,%f,%f,%f,%f]);",
                       pMatrix[0], pMatrix[1], pMatrix[2], pMatrix[3], pMatrix[4], pMatrix[5],
                       pMatrix[6], pMatrix[7], pMatrix[8], pMatrix[9], pMatrix[10], pMatrix[11],
                       pMatrix[12], pMatrix[13], pMatrix[14], pMatrix[15]];
  [self->wkWebView
      evaluateJavaScript:updateProjectionMatrixJsCode
       completionHandler:^(id data, NSError *error) {
         if (error) {
           [self showAlertDialog:[NSString stringWithFormat:@"ERROR: Evaluating jscode to provide "
                                                            @"projection matrix: %@",
                                                            error]
               completionHandler:^{
               }];
         }
       }];
}

#pragma mark - WKUIDelegate

- (void)webView:(WKWebView *)webView
    runJavaScriptAlertPanelWithMessage:(NSString *)message
                      initiatedByFrame:(WKFrameInfo *)frame
                     completionHandler:(void (^)(void))completionHandler {
  [self showAlertDialog:message completionHandler:completionHandler];
}

- (void)webView:(WKWebView *)webView runJavaScriptTextInputPanelWithPrompt:(NSString *)prompt defaultText:(nullable NSString *)defaultText initiatedByFrame:(WKFrameInfo *)frame completionHandler:(void (^)(NSString * _Nullable result))completionHandler
{
    NSArray* values = [prompt componentsSeparatedByString:@":"];
    NSString* method = values[0];
    NSArray* params = [values[1] componentsSeparatedByString:@","];
    NSString* result = nil;
    if ([method isEqualToString:@"hitTest"]) {
        float x = [params[0] floatValue];
        float y = [params[1] floatValue];
        CGPoint point = CGPointMake(x, y);
        ARFrame *currentFrame = [self.session currentFrame];
        // TODO: Play with the different types of hit tests to see what corresponds best with what tango already provides.
        NSArray<ARHitTestResult *> * hits = [currentFrame hitTest:point types:(ARHitTestResultType)ARHitTestResultTypeExistingPlaneUsingExtent];
        //        NSArray<ARHitTestResult *> * hits = [currentFrame hitTest:point types:(ARHitTestResultType)ARHitTestResultTypeExistingPlane];
        if (hits.count > 0)
        {
            matrix_float4x4 m = hits[0].worldTransform;
            const float* matrix = (const float*)(&m);
            float plane[4];
            plane[0] = matrix[ 4];
            plane[1] = matrix[ 5];
            plane[2] = matrix[ 6];
            plane[3] = 1;
            float point[3];
            point[0] = matrix[12];
            point[1] = matrix[13];
            point[2] = matrix[14];
            result = [NSString stringWithFormat:@"{\"point\":[%f,%f,%f],\"plane\":[%f,%f,%f,%f]}", point[0], point[1], point[2], plane[0], plane[1], plane[2], plane[3]];
        }
        //        NSLog(@"WebARKit: hitTest hits count for (%f, %f) = %ld - %@", x, y, hits.count, data);
    }
    else
    {
        NSLog(@"%@", prompt);
    }
    completionHandler(result);
}

#pragma mark - WKNavigationDelegate

// TODO - IMPORTANT (Iker Jamardo): There seems to be a bug in the WebViewJavascriptBridge and the decisionHandler is being called multiple times and iOS does not seem to like it. In essence, and AFAIK, this is a correct behavior because different pages need to be loaded (the requested page, the request to inject the JavaScript bridge code, ...) and all require to specify an allow policy. With this hack, I was able to resolve the problm just by calling the decisionHandler only once.
- (void)webView:(WKWebView *)webView decidePolicyForNavigationAction:(WKNavigationAction *)navigationAction decisionHandler:(void (^)(WKNavigationActionPolicy))decisionHandler
{
    NSURL *url = navigationAction.request.URL;
    NSString* urlString = url.absoluteString;
    bool isABridgeURL = [urlString rangeOfString:@"__bridge_loaded__" options:NSCaseInsensitiveSearch].location != NSNotFound || [urlString rangeOfString:@"__wvjb_" options:NSCaseInsensitiveSearch].location != NSNotFound;
//    NSLog(@"url = %@, isABridgeURL = %@", urlString, (isABridgeURL ? @"YES" : @"NO"));
    if (isABridgeURL) return;
    decisionHandler(WKNavigationActionPolicyAllow);
}

- (void)webView:(WKWebView *)webView didFinishNavigation:(WKNavigation *)navigation {
}

- (void)webView:(WKWebView *)webView
    didFailNavigation:(WKNavigation *)navigation
            withError:(NSError *)error {
  NSLog(@"ERROR: webview didFailNavigation with error %@", error);
}

#pragma mark - UITextFieldDelegate

- (BOOL)textFieldShouldReturn:(UITextField *)textField {
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

- (void)session:(ARSession *)session cameraDidChangeTrackingState:(ARCamera *)camera {
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
  } else if (camera.trackingStateReason == ARTrackingStateReasonInsufficientFeatures) {
    trackingStateReasonString = @"Insufficient Featues";
  }
  NSLog(@"AR camera tracking state = %@%@", trackingStateString,
        (trackingStateReasonString != nil ? trackingStateReasonString : @""));

  // Only the first time the tacking state is something else but unavailable load the initial page.
  if (camera.trackingState != ARTrackingStateNotAvailable &&
      !self->initialPageLoadedWhenTrackingBegins) {
    // Retore a URL from a previous execution and load it.
    NSString *urlString = [self getURLFromUserDefaults];
    if (urlString) {
      // As the code bellow does not allow to store invalid URLs, we will assume that the URL is
      // correct.
      [self loadURLInWKWebView:urlString];
      self->urlTextField.text = urlString;
    }
    self->initialPageLoadedWhenTrackingBegins = true;
  }
}

@end
