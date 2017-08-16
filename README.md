# WebARonARKit Documentation

## Contents

+ [Overview](#Overview)
+ [Disclaimer](#Disclaimer)
+ [Supported devices](#SupportedDevices)
+ [Installing WebARonARKit](#InstallingWebARonARKit)
  1. [Install iOS 11 beta](#InstalliOS11beta)
  2. [Install Xcode 9 beta](#InstallXcode9beta)
  3. [Run WebARonARKit](#RunWebARonARKit)
+ [Running examples](#RunningExamples)
+ [Building your own scenes](#BuildingScenes)
+ [Using the AR JavaScript API](#ARJavascriptAPI)
+ [How does WebARonARKit work?](#HowWebARonARKitWorks)
+ [Known issues](#KnownIssues)
+ [Future work](#FutureWork)
+ [License](#License)


## <a name="Overview">Overview</a>
WebARonARKit is an experimental app for iOS that lets developers create Augmented Reality (AR) experiences for the web, using iOS ARKit and JavaScript APIs. It exposes a non standard extension to the WebVR API. The WebARonARKit source/repo includes basic JavaScript examples that developers can use as starting points for their own AR experiences.

The goal of the WebARonARKit project is to enable web developers to create AR experiences on top of iOS ARKit using JavaScript.

WebARonARKit must be built from source using Xcode 9 beta and iOS 11 beta. See [instructions](#InstallingWebARonARKit).

## <a name="Disclaimer">Disclaimer</a>
<span style="color:red">**This is not an official Google product.**</span>

<span style="color:red">**The added browser APIs are not on a standards track and are only for experimentation.**</span>

Defining new web APIs is a complex process. The code and ideas in this project are not meant to be definitive proposals for AR capabilities for the web, but prototypes that developers can experiment with, at their own risk.

## <a name="SupportedDevices">Supported devices</a>
WebARonARKit is built on top of iOS [ARKit](https://developer.apple.com/arkit/), which requires an iOS device with an A9+ processor, running iOS 11. For best results, we recommend one of the following:

+ iPad (2017)
+ iPad Pro (9.7, 10.5 or 12.9 inches)
+ iPhone 7 and 7 Plus

## <a name="InstallingWebARonARKit">Installing WebARonARKit</a>
WebARonARKit must be built from source using Xcode 9 beta and iOS 11 beta. This requires an Apple Developer Account. If you do not have one already, you can sign up at [developer.apple.com](http://developer.apple.com).

### <a name="InstalliOS11beta">Install iOS 11 beta</a>
ARKit is currently only available for iOS 11 beta. To install iOS 11 beta on your iOS device, consult [Apple’s official guide](https://developer.apple.com/support/beta-software/install-ios-beta/), or follow these steps:

1. Download the iOS 11 Beta configuration profile [developer.apple.com/download](https://developer.apple.com/download/) and double click on the iOS_11_beta_Profile.mobileconfig file in Finder to install the profile.
2. Download an iOS restore image for iOS 11 beta for your specific device from [developer.apple.com/download](https://developer.apple.com/download/), under Featured Downloads > iOS Restore Images > See all.
3. Connect your iOS device to your computer with a cable.
4. Open iTunes and select your device.
5. Option-click on the "Check for Update" button, select the iOS 11 restore image you downloaded, and follow the instructions to install it on your device.

### <a name="InstallXcode9beta">Install Xcode 9 beta</a>
Working with ARKit and iOS 11 requires XCode 9 beta.

1. Download Xcode 9 beta from [developer.apple.com/download](https://developer.apple.com/download/).
2. Unpack Xcode 9 beta and copy to your Applications folder.

### <a name="RunWebARonARKit">Run WebARonARKit</a>
1. Clone the WebARonARKit GitHub repo.
2. Launch Xcode 9 beta.
3. Open the Xcode project from the cloned WebARonARKit repo using Xcode 9 beta.
4. Select WebARonARKit Project file (top blue icon in the left column) and then select the WebARonARKit target under TARGETS. Then in the signing section make sure you have selected the right Team (this should correspond to your iOS Developer Account / Team). If you get an error in the following steps, it's probably due to a code signing error.
5. Set your device as build destination by first ensuring it is connected to your computer, then selecting it the Product menu, under Destination, or from the drop-down menu next to the Run button (in the top top-left of the UI).
6. Build and push to your device by selecting the Run button or typing command-R. Once the build is complete and has been pushed to your device, the app should open automatically.

## <a name="RunningExamples">Running examples</a>
WebARonARKit comes with several example scenes. To run them, type the following URLs into the white address bar at the top of the screen:

+ WebGL Cubes: file://examples/webgl/cubes.html
+ Three.js Cubes: file://examples/threejs/cubes.html
+ Three.js Reticle: file://examples/threejs/reticle.html

These examples are bundled with the WebARonARKit app, so we must use the “file://” protocol to access them. WebARonARKit’s address bar can also access https and http URLs.


## <a name="BuildingScenes">Building your own scenes</a>
The easiest way to start building scenes for WebARonARKit is to fork one of the examples included with this repo. E.g. examples/threejs/cubes.html, which includes boilerplate for hooking into the pose and projection matrix of the AR Camera, and is built on the popular [Three.js](https://threejs.org/) framework.

Once you’re ready to test your scene in WebARonARKit, you can either bundle it with the app, or serve it over your local network. To bundle with the app, add your example to the examples/ directory, build the app using Xcode, and load your scene in WebARonARKit by entering the appropriate path in the address bar, e.g. file://examples/path-to-your-demo. To load your scene over the your local network, serve it via your preferred server solution (e.g. [SimpleHTTPServer](http://lifehacker.com/start-a-simple-web-server-from-any-directory-on-your-ma-496425450)), and load the URL in WebARonARKit.

## <a name="ARJavascriptAPI">Using the AR JavaScript API</a>
<p style="color=red">Documentation for the WebVR extension API for AR can be found on [LINK](link to MD file below, and replace with link to dev.google.com on 8/29)</p>

## <a name="HowWebARonARKitWorks">How does WebARonARKit work?</a>
<p style="color=red">[TODO: Explain the basic structure behind WebARonARKit: Transparent WKWebview on top of a native iOS component rendering the video feed and communication between the 2 processes.]</p>

## <a name="KnownIssues">Known issues</a>
+ There seems to be a [bug](https://bugs.webkit.org/show_bug.cgi?id=170595) in WebKit that affects the [WKWebView](https://developer.apple.com/documentation/webkit/wkwebview) in iOS 10+ where the window.innerWidth and window.innerHeight values are not correctly up to date when the event is fired and thus, not being able to properly resizing when the device changes orientation. To resolve this issue the, in WebARonARKit, the window.resize event is fired twice.
+ Because of the nature of how WebARonARKit is built (a webview executing the web content on top of a native process rendering the camera feed and handling ARKit code and the communication between them), it is very hard to get a correct pose estimation that completely matches the underlying camera feed. This desynchronization is more noticeable on an iPhone device as tracking & rendering desynchronization is more noticeable. On the other hand, this desynchronization is far less noticeable on iPad Pro (2nd generation), so it is the device recommended for optimal results.

## <a name="FutureWork">Future work</a>
+ Speed up performance (specially on iPhone) implementing different ways to communicate the WKWebView and the native side trying to synchronize as much as possible the camera feed and the pose used in WebVR.
+ Add more AR-related features.


## <a name="License">License</a>
Apache License Version 2.0 (see the `LICENSE' file inside this repo).
