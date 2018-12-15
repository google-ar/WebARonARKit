# WebARonARKit

**这是一款实验性的iOS应用程序，开发者可以使用web技术体验增强现实(AR)。同样有[Android版本](https://github.com/google-ar/WebARonARCore)。**

<img alt="Spawn-at-Camera example" src="https://github.com/google-ar/three.ar.js/raw/master/examples/screencaps/20170829-arkit-spawnAtCamera-1.gif" style="float: left; object-fit: cover; width: 45%; height: 20em; margin-right: 1em; "><img alt="Spawn-at-Surface example" src="https://github.com/google-ar/three.ar.js/raw/master/examples/screencaps/20170829-arkit-spawnAtSurface-1.gif" style="width: 45%; height: 20em; object-fit: cover;">

**注意:** 这不是一个正式的谷歌产品。它也不是一个功能齐全的web浏览器。即没有启用JavaScript api的标准，也没有标准化路径。WebARonARKit只支持开发人员试验。有关WebARonARKit体系结构的详细信息，请参见[How WebARonARKit works](#HowWebARonARKitWorks)。

## 准备工作

[WebARonARKit](http://developer.apple.com)必须使用Xcode 9和ios11构建源码。这需要一个苹果开发者账号。如果您还没有，请登录developer.apple.com。

### <a name="Prerequisites">0. 前提要求</a>

WebARonARKit是在iOS [ARKit](https://developer.apple.com/arkit/))的基础上构建的，iOS ARKit需要一个带有A9+处理器、运行iOS 11的iOS设备。为取得最佳效果，我们建议您的设备选择以下任一项:

- iPad(2017)
- iPad Pro(9.7、10.5或12.9英寸)
- iPhone 7和7 Plus

WebARonARKit必须从源码构建，并要求:

- Xcode 9
- iOS 11
- 苹果开发者账号。如果您还没有，请登录[developer.apple.com](http://developer.apple.com)。

### <a name="RunWebARonARKit">1. 运行WebARonARKit</a>

1. 克隆WebARonARKit GitHub仓库到本地。
2. 启动Xcode 9。
3. 使用Xcode 9从克隆的WebARonARKit仓库中打开项目(.xcodeproj)。
4. 从项目导航器中选择WebARonARKit项目文件(左列顶部蓝色图标)，然后在Targets下选择WebARonARKit。

  - ![GIF showing how to set the project target.](https://media.giphy.com/media/xUOxfc84FVlNqqeJeU/giphy.gif)
5. 使用WebARonARKit作为选择的目标，您将在主面板中自动查看“General”选项卡。从那里找到签名部分，并选择与您的iOS开发人员帐户/团队相对应的团队。如果在以下步骤中出现错误，可能是由于代码签名错误。如果遇到错误，请遵循Xcode中提供的说明(注意，您肯定需要更改的一个默认值是 `Bundle Identifier`，可以是一个简单的添加，例如在下面的GIF示例中向标识符追加“-personal”)。

  - ![GIF showing how to code sign.](https://media.giphy.com/media/3osBL6RqUu3prBVYOc/giphy.gif)
6. 将设备设置为构建目标，首先确保它已连接到计算机，然后从Production>> destination菜单或从UI左上角的Run按钮旁边的下拉菜单中选择它。
  - ![GIF showing how to set the build destination!](https://media.giphy.com/media/3osBL6aab1y581gPyE/giphy.gif)
7. 通过选择Run按钮或按⌘- r快捷键构建并将应用推送到你的设备。一旦构建完成并推送到您的设备上，应用程序应该会自动打开。您可能必须按照屏幕上的说明授权您的开发人员帐户推送到您的设备。注意，第一次运行应用程序安装正确的用户配置文件可能需要一些时间。

### <a name="ViewingExamples">2. 查看样例</a>

一系列与WebARonARKit和[WebARonARCore](https://github.com/google-ar/WebARonARCore)兼容的[示例场景](https://developers.google.com/ar/develop/web/getting-started#examples))可在[developers.google.com](https://github.com/google-ar/WebARonARCore))获得。

### <a name="BuildingScenes">3. 构建你自己的场景</a>

为了构建与WebARonARKit和[WebARonARCore for Android](https://github.com/google-ar/WebARonARCore)协同工作的AR web体验，我们推荐[three.ar.js](https://github.com/google-ar/three.ar.js)，一个与流行的[three.js](http://threejs.org) WebGL框架一起工作的辅助库。Three.ar.js提供了通用的AR构建块，例如绘制在真实世界表面上的可见十字线和[示例场景](https://github.com/google-ar/three.ar.js#examples)。

### <a name="Debugging">4. 调试</a>

可以使用MacOS Safari远程检查和调试WebARonARKit中的页面，但这需要MacOS Safari 11.0(可作为Safari技术预览版使用)或更高版本。您可以从https://developer.apple.com/safari/technologypreview/下载MacOS Safari 11。

## <a name="HowWebARonARKitWorks">WevARibARKit是怎样工作的</a>

WebARonARKit基于以下内容构建:

- **一个WKWebView实例**。[WKWebView](https://developer.apple.com/documentation/webkit/wkwebview)是一个iOS类，允许开发者将web视图嵌入到他们的本地应用程序中，并通过自定义api向web内容提供本地设备功能的使用。在我们的例子中，我们使用WKWebView向web内容提供ARKit功能。本地/web应用程序框架(如[Cordova](https://cordova.apache.org/))使用了类似的方法。

- **WebVR API的扩展**。WebVR API (v1.1)为我们提供了很多AR所需要的东西，然后我们对其进行了扩展，添加了更多的要素:运动跟踪、摄像机视频的渲染以及对现实世界的基本认知。详情请参阅[WebVR API extension for smartphone AR](https://github.com/google-ar/three.ar.js/blob/master/webvr_ar_extension.md)

一旦页面加载到WKWebView中，WebARonARKit就会注入一个脚本(WebARonARKit.js)。这个腻子脚本(Polyfills)将会支持WebVR 1.1 API，并处理本地内容和web内容之间的所有通信。

当运行时，WebARonARKit在后台使用一个全屏摄像头，顶部是一个透明的WKWebView。这种排布方式在“真实世界”和呈现的web内容之间得到了一个相当无缝的结果，但是还有一些限制:

- 在基于直通相机的AR中，基于时间戳的相机帧同步化和6自由度位姿需要尽可能的精确。由于这个双层系统的性质，WebARonARKit无法保证适当的同步。这有助于虚拟物体与摄像头拍摄到的真实世界之间明显的“漂移”，尤其是在iphone上。
- 本机端和JavaScript端之间的双向通信桥接总是异步的。WebARonARKit试图使用各种技术尽可能地解决这个限制(例如对于hitTest，它必须是同步的)。
- 在当前版本的WebARonARKit中，摄像头总是在运行web内容的WKWebView下面的本机端呈现。不能将视频帧公开到web端会导致一些有趣的用例无法展示，例如反射、折射、环境映射，或者只是在特定位置或大小呈现视频(在当前构建中，它总是全屏的)。在web端呈现视频提要还可以解决前面提到的同步问题。

## <a name="KnownIssues">已知问题</a>

- WebKit中似乎有一个bug，在iOS 10+中的WKWebView，当事件被触发时，window.innerWidth和window.innerHeight的值不能正确地更新，因此，当设备改变方向时，不能正确地调整大小。为了解决这个问题，在WebARonARKit中，当创建一个事件侦听器来侦听窗口上的“resize”事件时，它只在设备方向更改时被拦截和更新。
- 由于WebARonARKit构建的本质 (webview在本地进程上执行web内容来呈现相机和处理ARKit代码和它们之间的通信)，所以很难得到一个正确的姿态估计与底层相机完全匹配。这种缺乏跟踪和呈现同步的情况在iphone上尤其明显。它在ipad上不太容易被察觉，所以我们推荐使用ipad以获得最佳效果。

## <a name="FutureWork">下一步工作</a>

- 通过实现WKWebView与本机通信的替代方法来提高性能，尤其是在iphone上。目的是同步尽可能多的相机和使用在WebVR的姿势。
- 增加更多ar相关功能。

## <a name="License">License</a>

## <a name="License">开源协议</a>

Apache License 2.0版 (在本仓库的 `LICENSE`文件中查看 ).
