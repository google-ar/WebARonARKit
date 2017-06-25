//
//  ViewController.h
//  WebARKit
//
//  Created by Iker Jamardo Zugaza on 6/17/17.
//  Copyright © 2017 Iker Jamardo Zugaza. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <Metal/Metal.h>
#import <MetalKit/MetalKit.h>
#import <ARKit/ARKit.h>
#import <WebKit/WebKit.h>

#import "WebViewJavascriptBridge.h"

@interface ViewController : UIViewController <WKUIDelegate, WKNavigationDelegate, UITextFieldDelegate, ARSessionDelegate, ARSessionObserver>
{
    WKWebView* wkWebView;
    WebViewJavascriptBridge* bridge;
    UITextField* urlTextField;
    bool decisionHandlerCalled;
    bool initialPageLoadedWhenTrackingBegins;
}

@end


