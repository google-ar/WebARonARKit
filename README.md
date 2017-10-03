# WebARonARKit

**An experimental app for iOS that lets developers create Augmented Reality (AR) experiences using web technologies. An [Android version](https://github.com/google-ar/WebARonARCore) is also available.**

<img alt="Spawn-at-Camera example" src="https://github.com/google-ar/three.ar.js/raw/master/examples/screencaps/20170829-arkit-spawnAtCamera-1.gif" style="float: left; object-fit: cover; width: 45%; height: 20em; margin-right: 1em; "><img alt="Spawn-at-Surface example" src="https://github.com/google-ar/three.ar.js/raw/master/examples/screencaps/20170829-arkit-spawnAtSurface-1.gif" style="width: 45%; height: 20em; object-fit: cover;">

**Note:** This is not an official Google product. Nor is it a fully-featured web browser. Nor are the enabling JavaScript APIs standards, or on the standardization path. WebARonARKit is only meant to enable developer experimentation. For details on the WebARonARKit architecture, see [How WebARonARKit works](#HowWebARonARKitWorks).

## Getting started
WebARonARKit must be built from source using Xcode 9 and iOS 11. This requires an Apple Developer Account. If you do not have one already, sign up at [developer.apple.com](http://developer.apple.com).

### <a name="Prerequisites">0. Prerequisites</a> 
WebARonARKit is built on top of iOS [ARKit](https://developer.apple.com/arkit/), which requires an iOS device with an A9+ processor, running iOS 11. For best results, we recommend one of the following:

+ iPad (2017)
+ iPad Pro (9.7, 10.5 or 12.9 inches)
+ iPhone 7 and 7 Plus

WebARonARKit must be built from source and requires the following:

+ [Xcode 9](https://developer.apple.com/xcode/) 
+ iOS 11
+ An Apple Developer Account. If you do have one already, sign up at [developer.apple.com](http://developer.apple.com).


### <a name="RunWebARonARKit">1. Run WebARonARKit</a>
1. Clone the WebARonARKit GitHub repo.
2. Launch Xcode 9.
3. Open the Xcode project (.xcodeproj) from within the cloned WebARonARKit repo using Xcode 9. 
4. Select WebARonARKit Project file from the Project Navigator (top blue icon in the left column) and then select the WebARonARKit target under TARGETS. 
5. With WebARonARKit as the selected target, you'll automatically be viewing the "General" tab in the main panel. From there find the signing section and select the Team that corresponds to your iOS Developer Account / Team. If you get an error in the following steps, it's probably due to a code signing error. If you encounter errors, follow the instructions provided within Xcode.
6. Set your device as build destination by first ensuring it is connected to your computer, then selecting it from Product >> Destination menu or from the drop-down menu next to the Run button (in the top top-left of the UI).
7. Build and push to your device by selecting the Run button or typing command-R. Once the build is complete and has been pushed to your device, the app should open automatically. You may have to follow on screen instructions to authorize your developer account to push to your device.

### <a name="ViewingExamples">2. Viewing examples</a>
A [list of example scenes](https://developers.google.com/ar/develop/web/getting-started#examples) compatible with WebARonARKit and [WebARonARCore](https://github.com/google-ar/WebARonARCore) are available at [developers.google.com](https://developers.google.com/ar/develop/web/getting-started#examples).

### <a name="BuildingScenes">3. Building your own scenes</a>
To build AR web experiences that work with WebARonARKit and [WebARonARCore for Android](https://github.com/google-ar/WebARonARCore), we recommend **[three.ar.js](https://github.com/google-ar/three.ar.js)**, a helper library that works with the popular [three.js](http://threejs.org) WebGL framework. [Three.ar.js](https://github.com/google-ar/three.ar.js) provides common AR building blocks, such as a visible reticle that draws on top of real world surfaces, and [example scenes](https://github.com/google-ar/three.ar.js#examples).

### <a name="Debugging">4. Debugging </a>
Pages in WebARonARKit can be inspected and debugged remotely with MacOS Safari, however this requires MacOS Safari 11.0 (available as Safari Technology Preview) or higher. You can download MacOS Safari 11 from [https://developer.apple.com/safari/technology-preview/](https://developer.apple.com/safari/technology-preview/). 

## <a name="HowWebARonARKitWorks">How WebARonARKit works</a>

WebARonARKit is built on the following:

* **An WKWebView instance**. [WKWebView](https://developer.apple.com/documentation/webkit/wkwebview) is an iOS class that enables developers to embed web views in their native apps, and to expose native device capabilities to web content via custom APIs. In our case, we use WKWebView to expose ARKit functionality to web content. Native/web app frameworks such as [Cordova](https://cordova.apache.org/) use a similar approach.
* **Extensions to the WebVR API.** The WebVR API (v1.1) gives us much of what we need for AR. We then extend it to add a few more essentials: motion tracking, rendering of the camera's video feed, and basic understanding of the real world. For details, see [WebVR API extension for smartphone AR](https://github.com/google-ar/three.ar.js/blob/master/webvr_ar_extension.md)

WebARonARKit injects a script (WebARonARKit.js) as soon as a page is loaded into the WKWebView. This script, among other things, polyfills the WebVR 1.1 API and handles all the communication between native and web content.

When running, WebARonARKit layers a fullscreen camera feed in the background with a transparent WKWebView on top. This arrangement creates a fairly seamless result between "real world" and rendered web content, but comes with a few limitations:

* In pass-through camera-based AR, the time stamp based syncrhonization of the camera frame and the 6DOF pose needs to be as accurate as possible. Beause of the nature of this two-layer system, WebARonARKit is not able to ensure the proper synchronization. This contributes to perceptible "drift" between virtual objects and the real world seen in with the camera feed, especially on iPhones.
* The bidirectional communciation bridge between the native side and the JavaScript side in always asynchronous. WebARonARKit tries to resolve this limitation as much as possible using various techniques (like for hitTest, that has to be synchronous).
* In the current version of WebARonARKit the camera feed is always rendered in the native side, underneath the WKWebView that runs the web content. Not being able to expose the video frame to the web side prevents interesting use cases such as reflections, refractions, environment mapping, or simply rendering the video in a specific location or size (in current builds it is always fullscreen). Rendering the video feed in the web side would also resolve the synchronization problems mentioned earlier.

## <a name="KnownIssues">Known issues</a>
+ There seems to be a [bug](https://bugs.webkit.org/show_bug.cgi?id=170595) in WebKit that affects the [WKWebView](https://developer.apple.com/documentation/webkit/wkwebview) in iOS 10+ where the window.innerWidth and window.innerHeight values are not correctly up to date when the event is fired and thus, not being able to properly resizing when the device changes orientation. To resolve this issue, in WebARonARKit, when an event listener is created to listen to the 'resize' event on the window, it is intercepted and updated only when the device orientation changes.

+ Because of the nature of how WebARonARKit is built (a webview executing the web content on top of a native process rendering the camera feed and handling ARKit code and the communication between them), it is very hard to get a correct pose estimation that completely matches the underlying camera feed. This lack of tracking and rendering synchronization is particularly noticeable on iPhones. It is less perceptible on iPads, so we recommend iPads for optimal results.

## <a name="FutureWork">Future work</a>
+ Improve performance, particularly on iPhones, by implementing alternative methods of communicating between the WKWebView and the native side. The goal being to synchronize as much as possible the camera feed and the pose used in WebVR.
+ Add more AR-related features.

## <a name="License">License</a>
Apache License Version 2.0 (see the `LICENSE` file inside this repo).
