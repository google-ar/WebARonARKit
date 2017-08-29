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

#import <ARKit/ARKit.h>
#import <Metal/Metal.h>
#import <MetalKit/MetalKit.h>
#import <UIKit/UIKit.h>
#import <WebKit/WebKit.h>

@interface ViewController : UIViewController <WKUIDelegate, WKNavigationDelegate, UITextFieldDelegate, ARSessionDelegate, ARSessionObserver, WKScriptMessageHandler> {

    WKWebView *wkWebView;

    UITextField *urlTextField;
    UIButton *backButton;
    UIButton *refreshButton;

    bool initialPageLoadedWhenTrackingBegins;

    UIDeviceOrientation deviceOrientation;
    UIInterfaceOrientation interfaceOrientation;
    bool updateWindowSize;

    float near;
    float far;

    bool showingCameraFeed;
    UIColor *wkWebViewOriginalBackgroundColor;
}

@end
