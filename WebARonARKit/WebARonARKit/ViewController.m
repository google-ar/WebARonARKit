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

#import "NavigationView.h"
#import "ProgressView.h"
#import "Renderer.h"
#import "ViewController.h"

#import <sys/utsname.h>

#define FBOX(x) [NSNumber numberWithFloat:x]

NSString *deviceName() {
    struct utsname systemInfo;
    uname(&systemInfo);
    return [NSString stringWithCString:systemInfo.machine
                              encoding:NSUTF8StringEncoding];
}

// TODO: Should this be a percentage?
#define NOTCH_TAB_WIDTH 83
#define NOTCH_HEIGHT 30
#define NOTCH_WIDTH 209

#define URL_SAFE_AREA_VERTICAL 8
#define URL_SAFE_AREA_HORIZONTAL 16

#define URL_BUTTON_PADDING 16

#define URL_BUTTON_WIDTH_PORTRAIT_X 64
#define URL_BUTTON_HEIGHT_PORTRAIT_X 30

#define URL_BUTTON_WIDTH_PORTRAIT 44
#define URL_BUTTON_HEIGHT_PORTRAIT 44

#define URL_BUTTON_WIDTH_LANDSCAPE 44
#define URL_BUTTON_HEIGHT_LANDSCAPE 44

#define URL_TEXTFIELD_HEIGHT_EXPANDED 44
#define URL_TEXTFIELD_HEIGHT_MINIFIED 14

#define URL_TEXTFIELD_HEIGHT 44
#define PROGRESSVIEW_HEIGHT 2

// Helper functions to determine the iOS version
#define SYSTEM_VERSION_EQUAL_TO(v)                  ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] == NSOrderedSame)
#define SYSTEM_VERSION_GREATER_THAN(v)              ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] == NSOrderedDescending)
#define SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO(v)  ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] != NSOrderedAscending)
#define SYSTEM_VERSION_LESS_THAN(v)                 ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] == NSOrderedAscending)
#define SYSTEM_VERSION_LESS_THAN_OR_EQUAL_TO(v)     ([[[UIDevice currentDevice] systemVersion] compare:v options:NSNumericSearch] != NSOrderedDescending)

// Set this value to true or false to enable the passing of the camera
// frame from the native side to the JS side in each frame.
bool USE_CAMERA_FRAME = false;
// On iOS 11.3 the webgl context transparency does not work any longer.
// This flag checks the iOS version and forces to use the camera frames
// in iOS 11.3 and beyond (this flag and check might disappear once the
// webview problem is resolved by Apple).
const bool FORCE_USE_CAMERA_FRAME_ON_IOS_11_3_AND_ABOVE = true;
// Use these values to control the camera frame quality
const float CAMERA_FRAME_SCALE_FACTOR = 0.4;
const float CAMERA_FRAME_JPEG_COMPRESSION_FACTOR = 0.5;

@interface ViewController ()<MTKViewDelegate, ARSessionDelegate>

@property(nonatomic, strong) ARSession *session;
@property(nonatomic, strong) Renderer *renderer;
@property(nonatomic, strong) ProgressView *progressView;
@property(nonatomic, strong) NavigationView *navigationBacking;
@property(nonatomic, assign) bool webviewNavigationSuccess;

@end

@interface MTKView ()<RenderDestinationProvider>

@end

@implementation ViewController

- (void)showAlertDialog:(NSString *)message
      completionHandler:(void (^)(void))completionHandler {
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

- (void)setWKWebViewScrollEnabled:(BOOL)enabled {
    wkWebView.scrollView.scrollEnabled = enabled;
    wkWebView.scrollView.panGestureRecognizer.enabled = enabled;
    wkWebView.scrollView.bounces = enabled;
}

- (bool)loadURLInWKWebView:(NSString *)urlString {
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
                nsurlPath =
                [nsurlPath stringByReplacingCharactersInRange:range withString:@""];
            }
        } else {
            // If the file:// was not provided, trim the extension if included.
            NSRange range =
            [[nsurlPath lowercaseString] rangeOfString:@".html"
                                               options:NSBackwardsSearch];
            if (range.location != NSNotFound &&
                range.location == nsurlPath.length - 5) {
                nsurlPath =
                [nsurlPath stringByReplacingCharactersInRange:range withString:@""];
            }
        }
        //        NSLog(@"nsurlPath = %@", nsurlPath);
        // Is the URL string a path to a file?
        NSString *path =
        [[NSBundle mainBundle] pathForResource:nsurlPath ofType:pathExtension];
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

- (void)loadURL:(NSString *)urlString {
    if (![self loadURLInWKWebView:urlString]) {
        [self showAlertDialog:@"The URL is not valid." completionHandler:NULL];
    } else {
        [self storeURLInUserDefaults:urlString];
    }
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

- (void)backButtonClicked:(UIButton *)button {
    if ([wkWebView canGoBack]) {
        WKBackForwardList *backForwardList = [wkWebView backForwardList];
        WKBackForwardListItem *backItem = [backForwardList backItem];
        if (backItem != nil) {
            NSURL *url = [backItem URL];
            [urlTextField setText:[url absoluteString]];
        }
        [wkWebView goBack];
    }
}

- (void)forwardButtonClicked:(UIButton *)button {
    [wkWebView goForward];
}

- (void)refreshButtonClicked:(UIButton *)button {
    [wkWebView reload];
}

- (void)setShowCameraFeed:(bool)show {
    if (show && !USE_CAMERA_FRAME) {
        wkWebView.opaque = false;
        wkWebView.backgroundColor = [UIColor clearColor];
        wkWebView.scrollView.backgroundColor = [UIColor clearColor];
        [wkWebView.scrollView
            setContentInsetAdjustmentBehavior:
            UIScrollViewContentInsetAdjustmentNever];
    } else {
        wkWebView.opaque = true;
        wkWebView.backgroundColor = wkWebViewOriginalBackgroundColor;
        wkWebView.scrollView.backgroundColor = wkWebViewOriginalBackgroundColor;
        [wkWebView.scrollView
            setContentInsetAdjustmentBehavior:
            UIScrollViewContentInsetAdjustmentAutomatic];
      
    }
    showingCameraFeed = show;
    NSLog(@"show camera feed: %@", show ? @"YES" : @"NO");
}

- (void)deviceCheck {
    NSString *deviceType = deviceName();
    NSRange containiPhoneX = [deviceType rangeOfString:@"iPhone10" options:NSCaseInsensitiveSearch];
    if (containiPhoneX.location == NSNotFound) {
        iPhoneXDevice = false;

    } else {
        iPhoneXDevice = true;
    }
}

- (void)viewDidLoad {
    [super viewDidLoad];

    // If the iOS version is 11.3 or above and the flag to force the use of
    // the camera frames is set, force the use of the camera frames.
    if (SYSTEM_VERSION_GREATER_THAN_OR_EQUAL_TO(@"11.3") &&
        FORCE_USE_CAMERA_FRAME_ON_IOS_11_3_AND_ABOVE) {
      USE_CAMERA_FRAME = true;
    }
  
    [self deviceCheck];

    near = 0.01f;
    far = 10000.0f;
    showingCameraFeed = false;

    // By default, we draw camera frames but do not send AR data until a frame
    // is drawn.
    drawNextCameraFrame = false;
    sendARData = false;

    timeOfLastDrawnCameraFrame = 0;

    jsAnchorIdsToObjCAnchorIds = [[NSMutableDictionary alloc] init];
    objCAnchorIdsToJSAnchorIds = [[NSMutableDictionary alloc] init];
    anchors = [[NSMutableDictionary alloc] init];

    // Create an ARSession
    _session = [ARSession new];
    _session.delegate = self;

    // Set the view to use the default device
    mtkView = [[MTKView alloc] initWithFrame:self.view.frame device:MTLCreateSystemDefaultDevice()];
    mtkView.delegate = self;
    int mtkViewOffset =
    NOTCH_HEIGHT + URL_SAFE_AREA_VERTICAL * 2 + URL_TEXTFIELD_HEIGHT_MINIFIED;
    [mtkView setFrame:CGRectMake(0, mtkViewOffset, self.view.frame.size.width,
                              self.view.frame.size.height - mtkViewOffset)];

    if (!mtkView.device) {
        NSLog(@"Metal is not supported on this device");
        return;
    }
    [self.view addSubview:mtkView];

    // Configure the renderer to draw to the view
    _renderer = [[Renderer alloc] initWithSession:self.session
                                      metalDevice:mtkView.device
                        renderDestinationProvider:mtkView];
    [_renderer drawRectResized:mtkView.bounds.size];

    UITapGestureRecognizer *tapGesture =
    [[UITapGestureRecognizer alloc] initWithTarget:self
                                            action:@selector(handleTap:)];
    NSMutableArray *gestureRecognizers = [NSMutableArray array];
    [gestureRecognizers addObject:tapGesture];
    [gestureRecognizers addObjectsFromArray:self.view.gestureRecognizers];
    self.view.gestureRecognizers = gestureRecognizers;

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
    [[NSBundle mainBundle] pathForResource:@"WebARonARKit" ofType:@"js"];
    NSString *WebARonARKitJSContent =
    [NSString stringWithContentsOfFile:WebARonARKitJSPath
                              encoding:NSUTF8StringEncoding
                                 error:NULL];
    // Setup the script injection
    WKUserScript *useCameraFrameUserScript = [[WKUserScript alloc]
                                              initWithSource:
                                              [NSString stringWithFormat:
                                               @"window.WebARonARKitUsesCameraFrames = %@;",
                                               USE_CAMERA_FRAME ? @"true" : @"false"]
                                              injectionTime:WKUserScriptInjectionTimeAtDocumentStart
                                              forMainFrameOnly:true];
    WKUserScript *WebARonARKitJSUserScript = [[WKUserScript alloc]
                                              initWithSource:WebARonARKitJSContent
                                              injectionTime:WKUserScriptInjectionTimeAtDocumentStart
                                              forMainFrameOnly:true];
    WKUserContentController *userContentController =
    [[WKUserContentController alloc] init];
    [userContentController addScriptMessageHandler:self name:@"WebARonARKit"];
    [userContentController addUserScript:useCameraFrameUserScript];
    [userContentController addUserScript:WebARonARKitJSUserScript];
    WKWebViewConfiguration *wkWebViewConfig =
    [[WKWebViewConfiguration alloc] init];
    wkWebViewConfig.userContentController = userContentController;
    // Create the WKWebView using the configuration/script injection and add it to
    // the top of the view graph
    wkWebView = [[WKWebView alloc] initWithFrame:self.view.frame
                                   configuration:wkWebViewConfig];
    wkWebViewOriginalBackgroundColor = [UIColor whiteColor];
    // By default, the camera feed won't be shown until instructed otherwise
    [self setShowCameraFeed:NO];

    [wkWebView.scrollView
     setContentInsetAdjustmentBehavior:UIScrollViewContentInsetAdjustmentNever];

    [wkWebView.configuration.preferences setValue:@TRUE
                                           forKey:@"allowFileAccessFromFileURLs"];
    [self setWKWebViewScrollEnabled:true];
    // Needed to show alerts. Check the WKUIDelegate protocol and the
    // runJavaScriptAlertPanelWithMessage method in this file :(
    wkWebView.UIDelegate = self;
    wkWebView.navigationDelegate = self;
    [self.view addSubview:wkWebView];

    [self initNavigation];

    // Observe the estimatedProgress to uodate progress view
    [wkWebView addObserver:self
                forKeyPath:NSStringFromSelector(@selector(estimatedProgress))
                   options:NSKeyValueObservingOptionNew
                   context:NULL];

    // Load the default website.
    NSString *defaultSite =
        @"https://developers.google.com/ar/develop/web/getting-started#examples";
    NSURL *url = [NSURL URLWithString:defaultSite];
    [wkWebView loadRequest:[NSURLRequest requestWithURL:url]];
    [urlTextField setText:url.absoluteString];
    initialPageLoadedWhenTrackingBegins = false;

    [self initOrientationNotifications];
    [self updateOrientation];
    [self updateInterface];
}

- (void)initOrientationNotifications {
    // Calculate the orientation of the device
    UIDevice *device = [UIDevice currentDevice];
    [device beginGeneratingDeviceOrientationNotifications];
    [[NSNotificationCenter defaultCenter]
     addObserver:self
     selector:@selector(deviceOrientationDidChange:)
     name:UIDeviceOrientationDidChangeNotification
     object:nil];
    deviceOrientation = [device orientation];
}

- (void)initNavigation {
    [self initNavigationBacking];
    [self initUrlTextField];
    [self initButtons];
    [self initProgressView];
}

- (void)initNavigationBacking {
    _navigationBacking = [[NavigationView alloc] init];
    _navigationBacking.backgroundColor = [UIColor whiteColor];
    [self.view addSubview:_navigationBacking];
}

- (void)initUrlTextField {
    urlTextFieldActive = false;
    urlTextField = [[UITextField alloc] init];
    [urlTextField setBackgroundColor:[UIColor clearColor]];
    [urlTextField
     setTextColor:[UIColor colorWithRed:0.2f green:0.2f blue:0.2f alpha:1.0]];
    [urlTextField setKeyboardType:UIKeyboardTypeURL];
    [urlTextField setAutocorrectionType:UITextAutocorrectionTypeNo];
    [urlTextField setAutocapitalizationType:UITextAutocapitalizationTypeNone];
    [urlTextField setAdjustsFontSizeToFitWidth:YES];

    urlTextField.contentVerticalAlignment =
    UIControlContentVerticalAlignmentCenter;
    urlTextField.textAlignment = NSTextAlignmentCenter;

    [urlTextField setDelegate:self];
    [self.view addSubview:urlTextField];
}

- (void)initButtons {
    [self initBackButton];
    [self initRefreshButton];
}

- (void)initBackButton {
    backButton = [[UIButton alloc] init];
    UIImage *backIcon = [UIImage imageNamed:@"BackIcon"];
    [backButton setBackgroundColor:[UIColor clearColor]];
    [backButton setImage:backIcon forState:UIControlStateNormal];
    [backButton addTarget:self
                   action:@selector(backButtonClicked:)
         forControlEvents:UIControlEventTouchDown];
    [self.view addSubview:backButton];
}

- (void)initRefreshButton {
    refreshButton = [[UIButton alloc] init];
    [refreshButton setBackgroundColor:[UIColor clearColor]];
    UIImage *refreshIcon = [UIImage imageNamed:@"RefreshIcon"];
    [refreshButton setImage:refreshIcon forState:UIControlStateNormal];
    [refreshButton addTarget:self
                      action:@selector(refreshButtonClicked:)
            forControlEvents:UIControlEventTouchDown];
    [self.view addSubview:refreshButton];
}

- (void)dealloc {
    if ([self isViewLoaded]) {
        [wkWebView
         removeObserver:self
         forKeyPath:NSStringFromSelector(@selector(estimatedProgress))];
    }

    [wkWebView setNavigationDelegate:nil];
    [wkWebView setUIDelegate:nil];
}

#pragma mark - Progress View

- (void)initProgressView {
    _progressView = [[ProgressView alloc] init];
    [self.view addSubview:_progressView];
    [self setProgressViewColorSuccessful];
    [self startAndShowProgressView];
}

- (void)setProgressViewColorSuccessful {
    // Material Design Blue 100 #BBDEFB
    [_progressView setProgressBackgroundColor:[UIColor colorWithRed:0.7333333333
                                                              green:0.8705882353
                                                               blue:0.9843137255
                                                              alpha:1.0]];
    // Material Design Blue 500 #2196F3
    [_progressView setProgressFillColor:[UIColor colorWithRed:0.1294117647
                                                        green:0.5882352941
                                                         blue:0.9529411765
                                                        alpha:1.0]];
}

- (void)setProgressViewColorErrored {
    // Material Design Red 100 #FFCDD2
    [_progressView setProgressFillColor:[UIColor colorWithRed:1.0
                                                        green:0.8039215686
                                                         blue:0.8235294118
                                                        alpha:1.0]];
    // Material Design Red 500 #F44336
    [_progressView setProgressFillColor:[UIColor colorWithRed:0.9568627451
                                                        green:0.262745098
                                                         blue:0.2117647059
                                                        alpha:1.0]];
}

- (void)startAndShowProgressView {
    _progressView.progressValue = 0;
    [_progressView setHidden:NO animated:YES completion:nil];
}

- (void)completeAndHideProgressViewSuccessful {
    [self updateInterface];
    __weak __typeof__(self) weakSelf = self;
    [_progressView
     setProgressValue:1
     animated:YES
     completion:^(BOOL finished) {
         [weakSelf.progressView setHidden:YES animated:YES completion:nil];
     }];
}

- (void)completeAndHideProgressViewErrored:(float)progress {
    __weak __typeof__(self) weakSelf = self;
    [self.progressView
     setProgressValue:progress
     animated:YES
     completion:^(BOOL finished) {
         [weakSelf.progressView setHidden:YES animated:YES completion:nil];
     }];
}

#pragma mark - Orientation Change

- (void)deviceOrientationDidChange:(NSNotification *)notification {
    [self updateOrientation];
    [self updateInterface];
    updateWindowSize = true;
}

- (void)updateOrientation {
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
    [_renderer setInterfaceOrientation:interfaceOrientation];
}

- (void)updateInterface {
    if (iPhoneXDevice) {
        if (UIInterfaceOrientationIsPortrait(interfaceOrientation)) {
            [backButton
             setFrame:CGRectMake(URL_BUTTON_PADDING, 0, URL_BUTTON_WIDTH_PORTRAIT,
                                 URL_BUTTON_HEIGHT_PORTRAIT)];
            [refreshButton setFrame:CGRectMake(self.view.frame.size.width -
                                               URL_BUTTON_WIDTH_PORTRAIT -
                                               URL_BUTTON_PADDING,
                                               0, URL_BUTTON_WIDTH_PORTRAIT,
                                               URL_BUTTON_HEIGHT_PORTRAIT)];
            int contentOffset = NOTCH_HEIGHT + URL_SAFE_AREA_VERTICAL * 2 +
            URL_TEXTFIELD_HEIGHT_MINIFIED;
            CGRect contentRect = CGRectMake(0, contentOffset, self.view.frame.size.width,
                                            self.view.frame.size.height - contentOffset);
            [mtkView setFrame:contentRect];
            [wkWebView setFrame:contentRect];

            if (urlTextFieldActive) {
                [urlTextField setFont:[UIFont systemFontOfSize:17]];
                [urlTextField setFrame:CGRectMake(URL_SAFE_AREA_HORIZONTAL,
                                                  NOTCH_HEIGHT + URL_SAFE_AREA_VERTICAL,
                                                  self.view.frame.size.width -
                                                  URL_SAFE_AREA_HORIZONTAL * 2.0,
                                                  URL_TEXTFIELD_HEIGHT_EXPANDED)];
                [_navigationBacking
                 setFrame:CGRectMake(0, 0, self.view.frame.size.width,
                                     NOTCH_HEIGHT + URL_SAFE_AREA_VERTICAL * 2 +
                                     URL_TEXTFIELD_HEIGHT_EXPANDED)];
                [_progressView
                 setFrame:CGRectMake(0,
                                     NOTCH_HEIGHT + URL_SAFE_AREA_VERTICAL * 2 +
                                     URL_TEXTFIELD_HEIGHT_EXPANDED -
                                     PROGRESSVIEW_HEIGHT,
                                     self.view.frame.size.width,
                                     PROGRESSVIEW_HEIGHT)];
            } else {
                [urlTextField setFont:[UIFont systemFontOfSize:12]];
                [urlTextField setFrame:CGRectMake(URL_SAFE_AREA_HORIZONTAL,
                                                  NOTCH_HEIGHT + URL_SAFE_AREA_VERTICAL,
                                                  self.view.frame.size.width -
                                                  URL_SAFE_AREA_HORIZONTAL * 2.0,
                                                  URL_TEXTFIELD_HEIGHT_MINIFIED)];
                [_navigationBacking
                 setFrame:CGRectMake(0, 0, self.view.frame.size.width,
                                     NOTCH_HEIGHT + URL_SAFE_AREA_VERTICAL * 2 +
                                     URL_TEXTFIELD_HEIGHT_MINIFIED)];
                [_progressView
                 setFrame:CGRectMake(0,
                                     NOTCH_HEIGHT + URL_SAFE_AREA_VERTICAL * 2 +
                                     URL_TEXTFIELD_HEIGHT_MINIFIED -
                                     PROGRESSVIEW_HEIGHT,
                                     self.view.frame.size.width,
                                     PROGRESSVIEW_HEIGHT)];
            }
        } else {
            [urlTextField setFont:[UIFont systemFontOfSize:17]];
            [urlTextField
             setFrame:CGRectMake(
                                 URL_BUTTON_PADDING + URL_SAFE_AREA_HORIZONTAL, 0,
                                 self.view.frame.size.width -
                                 (URL_BUTTON_PADDING + URL_SAFE_AREA_HORIZONTAL) * 2,
                                 URL_TEXTFIELD_HEIGHT_EXPANDED)];

            [backButton
             setFrame:CGRectMake(URL_BUTTON_PADDING, 0, URL_BUTTON_WIDTH_LANDSCAPE,
                                 URL_BUTTON_HEIGHT_LANDSCAPE)];

            [refreshButton
             setFrame:CGRectMake(self.view.frame.size.width - URL_BUTTON_PADDING -
                                 URL_BUTTON_WIDTH_LANDSCAPE,
                                 0, URL_BUTTON_WIDTH_LANDSCAPE,
                                 URL_BUTTON_HEIGHT_LANDSCAPE)];

            int contentOffset = URL_TEXTFIELD_HEIGHT_EXPANDED;
            CGRect contentRect = CGRectMake(0, contentOffset, self.view.frame.size.width,
                                            self.view.frame.size.height - contentOffset);
            [mtkView setFrame:contentRect];
            [wkWebView setFrame:contentRect];

            [_navigationBacking setFrame:CGRectMake(0, 0, self.view.frame.size.width,
                                                    URL_TEXTFIELD_HEIGHT_EXPANDED)];
            [_progressView
             setFrame:CGRectMake(
                                 0, URL_TEXTFIELD_HEIGHT_EXPANDED - PROGRESSVIEW_HEIGHT,
                                 self.view.frame.size.width, PROGRESSVIEW_HEIGHT)];
        }
    } else {
        [_navigationBacking setFrame:CGRectMake(0, 0, self.view.frame.size.width,
                                                URL_TEXTFIELD_HEIGHT_EXPANDED)];
        [backButton setFrame:CGRectMake(0, 0, URL_BUTTON_WIDTH_LANDSCAPE,
                                        URL_BUTTON_HEIGHT_LANDSCAPE)];
        [urlTextField setFont:[UIFont systemFontOfSize:17]];
        [urlTextField setFrame:CGRectMake(URL_BUTTON_WIDTH_LANDSCAPE, 0,
                                          self.view.frame.size.width -
                                          URL_BUTTON_WIDTH_LANDSCAPE * 2,
                                          URL_TEXTFIELD_HEIGHT_EXPANDED)];
        [refreshButton
         setFrame:CGRectMake(
                             self.view.frame.size.width - URL_BUTTON_WIDTH_LANDSCAPE, 0,
                             URL_BUTTON_WIDTH_LANDSCAPE, URL_BUTTON_HEIGHT_LANDSCAPE)];


        int contentOffset = URL_TEXTFIELD_HEIGHT_EXPANDED;
        CGRect contentRect = CGRectMake(0, contentOffset, self.view.frame.size.width,
                                        self.view.frame.size.height - contentOffset);

        [mtkView setFrame:contentRect];
        [wkWebView setFrame:contentRect];

        [_progressView
         setFrame:CGRectMake(0,
                             URL_TEXTFIELD_HEIGHT_EXPANDED - PROGRESSVIEW_HEIGHT,
                             self.view.frame.size.width, PROGRESSVIEW_HEIGHT)];
    }
}

- (void)restartSession {
    // Remove all the cached structures.
    [anchors removeAllObjects];
    [jsAnchorIdsToObjCAnchorIds removeAllObjects];
    [objCAnchorIdsToJSAnchorIds removeAllObjects];
    ARWorldTrackingConfiguration *configuration =
    [ARWorldTrackingConfiguration new];
    configuration.planeDetection = ARPlaneDetectionHorizontal;
    [_session runWithConfiguration:configuration
                           options:ARSessionRunOptionResetTracking];
}

- (void)viewWillAppear:(BOOL)animated {
    [super viewWillAppear:animated];

    UIDevice *device = [UIDevice currentDevice];
    if (![device isGeneratingDeviceOrientationNotifications]) {
        [device beginGeneratingDeviceOrientationNotifications];
    }

    [self restartSession];
}

- (void)viewWillDisappear:(BOOL)animated {
    [super viewWillDisappear:animated];

    UIDevice *device = [UIDevice currentDevice];
    if ([device isGeneratingDeviceOrientationNotifications]) {
        [device endGeneratingDeviceOrientationNotifications];
    }

    [_session pause];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Release any cached data, images, etc that aren't in use.
}

- (void)handleTap:(UIGestureRecognizer *)gestureRecognize {
    ARFrame *currentFrame = [_session currentFrame];

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
- (void)mtkView:(nonnull MTKView *)view drawableSizeWillChange:(CGSize)size {
    [_renderer drawRectResized:view.bounds.size];
}

// Called whenever the view needs to render
- (void)drawInMTKView:(nonnull MTKView *)view {
    // Calculate the time passed since the last camera frame that was drawn.
    CFTimeInterval currentTime = CACurrentMediaTime();
    // If the time of the last drawn camera frame is 0, use the current time.
    if (timeOfLastDrawnCameraFrame == 0) {
        timeOfLastDrawnCameraFrame = currentTime;
    }
    CFTimeInterval timeSinceLastDrawnCameraFrame =
    currentTime - timeOfLastDrawnCameraFrame;
    // If the time passed since the last camera frame was drawn is over a second
    // it means that the JS side was not ready to listen to the send AR data event
    // and therefore, we need to force a camera frame draw and an AR data send.
    if (timeSinceLastDrawnCameraFrame > 1) {
        drawNextCameraFrame = true;
    }
    // Only if the JS side stated that the AR data was used to render the 3D
    // scene, we can render a camera frame.
    if (drawNextCameraFrame) {
        if (!USE_CAMERA_FRAME) {
          [_renderer update];
        }
        drawNextCameraFrame = false;
        // Now that the camera frame has been rendered, the AR data can be sent.
        sendARData = true;
        // Store the time when the camera frame was drawn just in case...
        timeOfLastDrawnCameraFrame = currentTime;
    }
}

#pragma mark - ARSessionDelegate

- (void)session:(ARSession *)session didFailWithError:(NSError *)error {
    // Present an error message to the user
}

- (void)sessionWasInterrupted:(ARSession *)session {
    // Inform the user that the session has been interrupted, for example, by
    // presenting an overlay
}

- (void)sessionInterruptionEnded:(ARSession *)session {
    // Reset tracking and/or remove existing anchors if consistent tracking is
    // required
}

- (NSString *)getPlanesString:(nonnull NSArray<ARAnchor *> *)anchors {
    // Return nil if no planes are among the anchors
    NSString *result = nil;
    for (int i = 0; i < anchors.count; i++) {
        if (![anchors[i] isKindOfClass:[ARPlaneAnchor class]]) {
            // We only want anchors of type plane.
            continue;
        }
        // Now that we know that there is at least one plane among the anchors,
        // create the returning string.
        if (result == nil) {
            result = @"[";
        }
        ARPlaneAnchor *plane = (ARPlaneAnchor *)anchors[i];
        matrix_float4x4 planeTransform = plane.transform;
        const float *planeMatrix = (const float *)(&planeTransform);
        NSString *planeStr = [NSString
                              stringWithFormat:
                              @"{\"modelMatrix\":[%f,%f,%f,%f,%f,%f,%f,%f,"
                              @"%f,%f,%f,%f,%f,%f,%f,%f],"
                              @"\"identifier\":%i,"
                              @"\"extent\":[%f,%f],"
                              @"\"vertices\":[%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f,%f]}",
                              planeMatrix[0], planeMatrix[1], planeMatrix[2], planeMatrix[3],
                              planeMatrix[4], planeMatrix[5], planeMatrix[6], planeMatrix[7],
                              planeMatrix[8], planeMatrix[9], planeMatrix[10], planeMatrix[11],
                              planeMatrix[12] + plane.center.x, planeMatrix[13] + plane.center.y,
                              planeMatrix[14] + plane.center.z, planeMatrix[15],
                              (int)plane.identifier, plane.extent.x, plane.extent.z,
                              plane.extent.x / 2, 0.0, plane.extent.z / 2, -plane.extent.x / 2,
                              0.0, plane.extent.z / 2, -plane.extent.x / 2, 0.0,
                              -plane.extent.z / 2, plane.extent.x / 2, 0.0, -plane.extent.z / 2];
        planeStr = [planeStr stringByAppendingString:@","];
        result = [result stringByAppendingString:planeStr];
    }
    // Remove the last coma if there is any string
    if (result != nil) {
        result = [result substringToIndex:result.length - 1];
        result = [result stringByAppendingString:@"]"];
    }
    return result;
}

- (NSString *)getAnchorsString:(nonnull NSArray<ARAnchor *> *)anchors {
    NSString *result = nil;
    for (int i = 0; i < anchors.count; i++) {
        if ([anchors[i] isKindOfClass:[ARPlaneAnchor class]] ||
            [anchors[i] isKindOfClass:[ARFaceAnchor class]]) {
            // We do not want Plane or Face anchors.
            continue;
        }
        if (result == nil) {
            result = @"[";
        }
        ARAnchor *anchor = (ARAnchor *)anchors[i];
        matrix_float4x4 anchorTransform = anchor.transform;
        const float *anchorMatrix = (const float *)(&anchorTransform);
        NSString *jsAnchorId =
        objCAnchorIdsToJSAnchorIds[anchor.identifier.UUIDString];
        NSString *anchorStr = [NSString
                               stringWithFormat:
                               @"{\"modelMatrix\":[%f,%f,%f,%f,%f,%f,%f,%f,"
                               @"%f,%f,%f,%f,%f,%f,%f,%f],"
                               @"\"identifier\":%@}",
                               anchorMatrix[0], anchorMatrix[1], anchorMatrix[2], anchorMatrix[3],
                               anchorMatrix[4], anchorMatrix[5], anchorMatrix[6], anchorMatrix[7],
                               anchorMatrix[8], anchorMatrix[9], anchorMatrix[10],
                               anchorMatrix[11], anchorMatrix[12], anchorMatrix[13],
                               anchorMatrix[14], anchorMatrix[15], jsAnchorId];
        anchorStr = [anchorStr stringByAppendingString:@","];
        result = [result stringByAppendingString:anchorStr];
    }
    // Remove the last coma if there is any string
    if (result != nil) {
        result = [result substringToIndex:result.length - 1];
        result = [result stringByAppendingString:@"]"];
    }
    return result;
}

- (void)dispatchVRDisplayEvent:(NSString *)type
                      dataName:(NSString *)dataName
                    dataString:(NSString *)dataString {
    NSString *jsCode =
    [NSString stringWithFormat:
     @"if (window.WebARonARKitDispatchARDisplayEvent) "
     @"window.WebARonARKitDispatchARDisplayEvent({"
     @"\"type\":\"%@\","
     @"\"%@\":%@"
     @"});",
     type, dataName, dataString];

    [wkWebView
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
}

- (void)session:(ARSession *)session
  didAddAnchors:(nonnull NSArray<ARAnchor *> *)anchors {
    NSString *planesString = [self getPlanesString:anchors];
    if (planesString) {
        [self dispatchVRDisplayEvent:@"planesadded"
                            dataName:@"planes"
                          dataString:planesString];
    }
}

- (void)session:(ARSession *)session
didUpdateAnchors:(nonnull NSArray<ARAnchor *> *)anchors {
    // TODO(@ijamardo): Instead of iterating over the anchors collection several
    // times for differnt types, merge them into one function.
    NSString *planesString = [self getPlanesString:anchors];
    if (planesString) {
        [self dispatchVRDisplayEvent:@"planesupdated"
                            dataName:@"planes"
                          dataString:planesString];
    }
    NSString *anchorsString = [self getAnchorsString:anchors];
    if (anchorsString) {
        [self dispatchVRDisplayEvent:@"anchorsupdated"
                            dataName:@"anchors"
                          dataString:anchorsString];
    }

    // TODO: As we are not able to get an update on the anchors this code forces
    // a call to the anchorsUpdated event dispatching for testing purposes.
    //  if (anchorsString == nil && self->anchors.count > 0) {
    //    anchorsString = [self getAnchorsString:self->anchors.allValues];
    //    [self dispatchVRDisplayEvent:@"anchorsupdated"
    //                        dataName:@"anchors" dataString:anchorsString];
    //  }
}

- (void)session:(ARSession *)session
didRemoveAnchors:(nonnull NSArray<ARAnchor *> *)anchors {
    NSString *planesString = [self getPlanesString:anchors];
    if (planesString) {
        [self dispatchVRDisplayEvent:@"planesremoved"
                            dataName:@"planes"
                          dataString:planesString];
    }
}

- (void)session:(ARSession *)session didUpdateFrame:(ARFrame *)frame {
    // Do not send AR data until a camera frame has been rendered.
    if (!sendARData) {
        return;
    }

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
                                        viewportSize:CGSizeMake(wkWebView.frame.size.width,
                                                                wkWebView.frame.size.height)
                                        zNear:near
                                        zFar:far];

    const float *pModelMatrix = (const float *)(&modelMatrix);
    const float *pViewMatrix = (const float *)(&viewMatrix);
    const float *pProjectionMatrix = (const float *)(&projectionMatrix);

    simd_quatf orientationQuat = simd_quaternion(modelMatrix);
    const float *pOrientationQuat = (const float *)(&orientationQuat);
    float position[3];
    position[0] = pModelMatrix[12];
    position[1] = pModelMatrix[13];
    position[2] = pModelMatrix[14];

    // Get the camera frame in base 64.
    NSString* base64ImageString = @"";
    if (USE_CAMERA_FRAME) {
      base64ImageString = [self getBase64ImageFromPixelBuffer:
                           frame.capturedImage];
      if (!base64ImageString) {
        base64ImageString = @"";
      }
      else {
        base64ImageString = [NSString stringWithFormat:
                             @"data:image/jpg;base64, %@", base64ImageString];
      }
    }
  
    // Create a NSDictionary that will be parsed as a json and then passed to the JS side
    NSDictionary* jsonDictionary = @{
        @"position":@[FBOX(position[0]), FBOX(position[1]), FBOX(position[2])],
        @"orientation":@[FBOX(pOrientationQuat[0]), FBOX(pOrientationQuat[1]),
                         FBOX(pOrientationQuat[2]), FBOX(pOrientationQuat[3])],
        @"viewMatrix":@[FBOX(pViewMatrix[0]), FBOX(pViewMatrix[1]),
                        FBOX(pViewMatrix[2]), FBOX(pViewMatrix[3]),
                        FBOX(pViewMatrix[4]), FBOX(pViewMatrix[5]),
                        FBOX(pViewMatrix[6]), FBOX(pViewMatrix[7]),
                        FBOX(pViewMatrix[8]), FBOX(pViewMatrix[9]),
                        FBOX(pViewMatrix[10]), FBOX(pViewMatrix[11]),
                        FBOX(pViewMatrix[12]), FBOX(pViewMatrix[13]),
                        FBOX(pViewMatrix[14]), FBOX(pViewMatrix[15])],
        @"projectionMatrix":@[FBOX(pProjectionMatrix[0]),
                              FBOX(pProjectionMatrix[1]),
                              FBOX(pProjectionMatrix[2]),
                              FBOX(pProjectionMatrix[3]),
                              FBOX(pProjectionMatrix[4]),
                              FBOX(pProjectionMatrix[5]),
                              FBOX(pProjectionMatrix[6]),
                              FBOX(pProjectionMatrix[7]),
                              FBOX(pProjectionMatrix[8]),
                              FBOX(pProjectionMatrix[9]),
                              FBOX(pProjectionMatrix[10]),
                              FBOX(pProjectionMatrix[11]),
                              FBOX(pProjectionMatrix[12]),
                              FBOX(pProjectionMatrix[13]),
                              FBOX(pProjectionMatrix[14]),
                              FBOX(pProjectionMatrix[15])]
        ,@"cameraFrame":base64ImageString
    };
    // Pass the dictionary to JSON and back to a string.
    NSError* error;
    NSData* jsonData = [NSJSONSerialization dataWithJSONObject:jsonDictionary options:NSJSONWritingPrettyPrinted error:&error];
    NSString* jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
  
//    NSLog(@"jsonString = %@", jsonString);

    // This will be the final JS code to evaluate
    NSString* jsCode =
        [NSString stringWithFormat:
        @"if (window.WebARonARKitSetData) "
        @"window.WebARonARKitSetData(%@)",
        jsonString];

    // Execute the JS code
    [wkWebView
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

    // This needs to be called after because the window size will affect the
    // projection matrix calculation upon resize
    if (updateWindowSize) {
        int width = wkWebView.frame.size.width;
        int height = wkWebView.frame.size.height;
        NSString *updateWindowSizeJsCode = [NSString
                                            stringWithFormat:
                                            @"if(window.WebARonARKitSetWindowSize)"
                                            @"WebARonARKitSetWindowSize({\"width\":%i,\"height\":%i});",
                                            width, height];
        [wkWebView
         evaluateJavaScript:updateWindowSizeJsCode
         completionHandler:^(id data, NSError *error) {
             if (error) {
                 [self showAlertDialog:[NSString
                                        stringWithFormat:@"ERROR: Evaluating "
                                        @"jscode to provide "
                                        @"window size: %@",
                                        error]
                     completionHandler:^{
                     }];
             }
         }];
        updateWindowSize = false;
    }

    sendARData = false;
}

#pragma mark - WK Estimated Progress

- (void)observeValueForKeyPath:(NSString *)keyPath
                      ofObject:(id)object
                        change:(NSDictionary *)change
                       context:(void *)context {
    if ([keyPath
         isEqualToString:NSStringFromSelector(@selector(estimatedProgress))] &&
        object == self->wkWebView) {
        if (_webviewNavigationSuccess) {
            [_progressView setProgressValue:wkWebView.estimatedProgress];
        }
    } else {
        [super observeValueForKeyPath:keyPath
                             ofObject:object
                               change:change
                              context:context];
    }
}

#pragma mark - WKUIDelegate

- (void)webView:(WKWebView *)webView
runJavaScriptAlertPanelWithMessage:(NSString *)message
initiatedByFrame:(WKFrameInfo *)frame
completionHandler:(void (^)(void))completionHandler {
    [self showAlertDialog:message completionHandler:completionHandler];
}

#pragma mark - WKNavigationDelegate

- (void)webView:(WKWebView *)webView
didStartProvisionalNavigation:(null_unspecified WKNavigation *)navigation {
    [self restartSession];
    [self setShowCameraFeed:NO];
    [self startAndShowProgressView];
    [self setProgressViewColorSuccessful];
    _webviewNavigationSuccess = true;
}

- (void)webView:(WKWebView *)webView
didFinishNavigation:(WKNavigation *)navigation {
    [self restartSession];
    // By default, when a page is loaded, the camera feed should not be shown.
    if (initialPageLoadedWhenTrackingBegins) {
        [self storeURLInUserDefaults:urlTextField.text];
    }
    [urlTextField setText:[[wkWebView URL] absoluteString]];
    if (initialPageLoadedWhenTrackingBegins) {
        [self storeURLInUserDefaults:[[wkWebView URL] absoluteString]];
    }
    [self setProgressViewColorSuccessful];
    // By default, when a page is loaded, the camera feed should not be shown.
    [self completeAndHideProgressViewSuccessful];
}

- (void)webView:(WKWebView *)webView
didFailNavigation:(WKNavigation *)navigation
      withError:(NSError *)error {
    _webviewNavigationSuccess = false;
    if (error.code != -999) {
        [self showAlertDialog:error.localizedDescription completionHandler:nil];
        NSLog(@"ERROR: webview didFailNavigation with error '%@'", error);
    }
    [self setProgressViewColorErrored];
    [self completeAndHideProgressViewErrored:wkWebView.estimatedProgress];
}

- (void)webViewDidFinishLoad:(UIWebView *)webView {
    [self restartSession];
    [self completeAndHideProgressViewSuccessful];
}

- (void)webView:(WKWebView *)webView
didFailProvisionalNavigation:(WKNavigation *)navigation
      withError:(NSError *)error {
    _webviewNavigationSuccess = false;
    if (error.code != -999) {
        [self showAlertDialog:error.localizedDescription completionHandler:nil];
        NSLog(@"ERROR: webview didFailProvisionalNavigation with error '%@'",
              error);
    }
    [self setProgressViewColorErrored];
    [self completeAndHideProgressViewErrored:wkWebView.estimatedProgress];
}

#pragma mark - UITextFieldDelegate

- (void)textFieldDidBeginEditing:(UITextField *)textField {
    urlTextFieldActive = YES;
    [urlTextField
     setSelectedTextRange:[urlTextField
                           textRangeFromPosition:urlTextField
                           .beginningOfDocument
                           toPosition:urlTextField
                           .endOfDocument]];
    if (iPhoneXDevice) {
        if (UIInterfaceOrientationIsPortrait(interfaceOrientation)) {
            [urlTextField setFont:[UIFont systemFontOfSize:17]];
            [urlTextField setFrame:CGRectMake(URL_SAFE_AREA_HORIZONTAL,
                                              NOTCH_HEIGHT + URL_SAFE_AREA_VERTICAL,
                                              self.view.frame.size.width -
                                              URL_SAFE_AREA_HORIZONTAL * 2,
                                              URL_TEXTFIELD_HEIGHT_EXPANDED)];

            [_navigationBacking
             setFrame:CGRectMake(0, 0, self.view.frame.size.width,
                                 NOTCH_HEIGHT + URL_SAFE_AREA_VERTICAL * 2 +
                                 URL_TEXTFIELD_HEIGHT_EXPANDED)];

            [_progressView
             setFrame:CGRectMake(0,
                                 NOTCH_HEIGHT + URL_SAFE_AREA_VERTICAL * 2 +
                                 URL_TEXTFIELD_HEIGHT_EXPANDED -
                                 PROGRESSVIEW_HEIGHT,
                                 self.view.frame.size.width, PROGRESSVIEW_HEIGHT)];
        }
    }
}

- (void)textFieldDidEndEditing:(UITextField *)textField {
    urlTextFieldActive = NO;
    if (iPhoneXDevice) {
        if (UIInterfaceOrientationIsPortrait(interfaceOrientation)) {
            [urlTextField setFont:[UIFont systemFontOfSize:12]];
            [urlTextField setFrame:CGRectMake(URL_SAFE_AREA_HORIZONTAL,
                                              NOTCH_HEIGHT + URL_SAFE_AREA_VERTICAL,
                                              self.view.frame.size.width -
                                              URL_SAFE_AREA_HORIZONTAL * 2.0,
                                              URL_TEXTFIELD_HEIGHT_MINIFIED)];

            [_navigationBacking
             setFrame:CGRectMake(0, 0, self.view.frame.size.width,
                                 NOTCH_HEIGHT + URL_SAFE_AREA_VERTICAL * 2 +
                                 URL_TEXTFIELD_HEIGHT_MINIFIED)];

            [_progressView
             setFrame:CGRectMake(0,
                                 NOTCH_HEIGHT + URL_SAFE_AREA_VERTICAL * 2 +
                                 URL_TEXTFIELD_HEIGHT_MINIFIED -
                                 PROGRESSVIEW_HEIGHT,
                                 self.view.frame.size.width, PROGRESSVIEW_HEIGHT)];
        } else {
            [urlTextField setFont:[UIFont systemFontOfSize:17]];
        }
    }
}

- (BOOL)textFieldShouldReturn:(UITextField *)textField {
    BOOL result = NO;
    NSString *urlString = urlTextField.text;
    if (![self loadURLInWKWebView:urlString]) {
        [self showAlertDialog:@"The URL is not valid." completionHandler:NULL];
    } else {
        [self storeURLInUserDefaults:urlString];
        [urlTextField resignFirstResponder];
        result = YES;
    }
    return result;
}

#pragma mark - ARSessionObserver

- (void)session:(ARSession *)session
cameraDidChangeTrackingState:(ARCamera *)camera {
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
        !initialPageLoadedWhenTrackingBegins) {
        // Retore a URL from a previous execution and load it.
        NSString *urlString = [self getURLFromUserDefaults];
        if (urlString) {
            // As the code bellow does not allow to store invalid URLs, we will assume
            // that the URL is
            // correct.
            if (![self loadURLInWKWebView:urlString]) {
                [self showAlertDialog:@"The URL is not valid." completionHandler:NULL];
            }
            urlTextField.text = urlString;
        }
        initialPageLoadedWhenTrackingBegins = true;
    }
}

#pragma mark - WKScriptMessageHandler

- (void)userContentController:(WKUserContentController *)userContentController
      didReceiveScriptMessage:(WKScriptMessage *)message {
    NSString *messageString = message.body;
    NSArray *values = [messageString componentsSeparatedByString:@":"];
    if ([values count] > 1) {
        NSString *method = values[0];
        NSArray *params = [values[1] componentsSeparatedByString:@","];
        if ([method isEqualToString:@"setDepthNear"]) {
            near = [params[0] floatValue];
        } else if ([method isEqualToString:@"setDepthFar"]) {
            far = [params[0] floatValue];
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
        } else if ([method isEqualToString:@"addAnchor"]) {
            // Construct the ARAnchor with the matrix provided from the js side.
            NSString *jsAnchorId = params[0];
            matrix_float4x4 modelMatrix;
            float *pModelMatrix = (float *)(&modelMatrix);
            for (int i = 0; i < 16; i++) {
                pModelMatrix[i] = [params[i + 1] floatValue];
            }
            ARAnchor *anchor = [[ARAnchor alloc] initWithTransform:modelMatrix];
            [_session addAnchor:anchor];
            // Create an entry to convert from the js id to the objective c id (and
            // viceversa)
            [jsAnchorIdsToObjCAnchorIds setValue:anchor.identifier.UUIDString
                                          forKey:jsAnchorId];
            [objCAnchorIdsToJSAnchorIds setValue:jsAnchorId
                                          forKey:anchor.identifier.UUIDString];
            // Store the anchor
            [anchors setValue:anchor forKey:jsAnchorId];
        } else if ([method isEqualToString:@"removeAnchor"]) {
            // Retrive the ARAnchor from the jsAnchorId and remove it from the
            // session. Of course, also remove all the id mapping and the anchor
            // from the anchors container.
            NSString *jsAnchorId = params[0];
            ARAnchor *anchor = anchors[jsAnchorId];
            NSString *objCAnchorId = anchor.identifier.UUIDString;
            [jsAnchorIdsToObjCAnchorIds removeObjectForKey:jsAnchorId];
            [objCAnchorIdsToJSAnchorIds removeObjectForKey:objCAnchorId];
            [anchors removeObjectForKey:jsAnchorId];

            [_session removeAnchor:anchor];
        } else if ([method isEqualToString:@"advanceFrame"]) {
            // The JS side stated that the AR data was used so we can render
            // a new camera frame now.
            drawNextCameraFrame = true;
        } else {
            NSLog(@"WARNING: Unknown message received: '%@'", method);
        }
    }
}

/*
 This code is inspired by the open source project:
 https://github.com/Stinkstudios/arkit-web
 Kudos to: Amelie (@ixviii_io)
 */
-(NSString*)getBase64ImageFromPixelBuffer:(CVPixelBufferRef)pixelBuffer {
  // The context to be able to create the CGImage.
  static CIContext* ciContext = nil;
  ciContext = [CIContext contextWithOptions:nil];
  // Convert the pixel buffer to a CIImage
  CIImage* ciImage = [CIImage imageWithCVPixelBuffer:pixelBuffer];
  // Apply a scaling transformation to the CIImage and get a new one
  CGAffineTransform scaleTransform =
  CGAffineTransformScale(CGAffineTransformIdentity,
                         CAMERA_FRAME_SCALE_FACTOR, CAMERA_FRAME_SCALE_FACTOR);
  CIImage* resizedCIImage = [ciImage imageByApplyingTransform:scaleTransform];
  // Create a CGImage from the CIImage
  CGImageRef cgImage = [ciContext createCGImage:resizedCIImage
                                       fromRect:resizedCIImage.extent];
  if (cgImage) {
    // Create an UIImage from the CGImage
    UIImage* uiImage = [UIImage imageWithCGImage:cgImage];
    // IMPORTANT: CG structures are not handled by the ARC system.
    // Release the CG image now that we have a corresponding UIImage.
    CGImageRelease(cgImage);
    // Compress the image as JPEG
    NSData* jpegImageData =
        UIImageJPEGRepresentation(uiImage, CAMERA_FRAME_JPEG_COMPRESSION_FACTOR);
    if (jpegImageData) {
      // Transform the JPEG data into a base64 format so it can be
      // passed to the JS side as a string.
      return [jpegImageData base64EncodedStringWithOptions:
              NSDataBase64Encoding64CharacterLineLength];
    }
  }
  return nil;
}

@end
