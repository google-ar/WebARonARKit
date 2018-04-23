# WebARonARKit

**개발자들이 웹 기술을 이용해 증강현실(AR) 환경을 만들 수 있도록 하는 iOS의 실험적 앱입니다.   [안드로이드 버전](https://github.com/google-ar/WebARonARCore)도 사용할 수 있습니다.**

<img alt="Spawn-at-Camera example" src="https://github.com/google-ar/three.ar.js/raw/master/examples/screencaps/20170829-arkit-spawnAtCamera-1.gif" style="float: left; object-fit: cover; width: 45%; height: 20em; margin-right: 1em; "><img alt="Spawn-at-Surface example" src="https://github.com/google-ar/three.ar.js/raw/master/examples/screencaps/20170829-arkit-spawnAtSurface-1.gif" style="width: 45%; height: 20em; object-fit: cover;">

**Note**: 이 것은 구글의 정식 제품이 아닙니다. 완전한 기능을 갖춘 웹브라우저도 아닙니다. 또한 JavaScript API의 표준 혹은 표준경로를 사용하도록 설정하지 않았습니다. WebARonARKit는 개발자 실험을 가능하게 하는데 의미가 있습니다. WebARonARKit 의 시스템 구성에 대한 자세한 내용은,  [WebARonARKit작동방식](#WebARonARKit작동방식)를 참조하세요.

## 

## 시작하기

WebARonARKit는 반드시 Xcode9 와 iOS 11을 이용하는 환경으로부터 빌드되어야 합니다. 이것은 Apple 개발자 계정을 필요로 합니다.  아직 계정이 없으시다면, [developer.apple.com](http://developer.apple.com)에 가입하세요.



### <a name="전제 조건">0. 전제조건</a>

WebARonARKit은 iOS ARKit 위에서 구축되었으며, A9+ 프로세서가 탑재되고, iOS11이 구동되는 iOS 기기를 필요로 합니다:

+ iPad (2017)
+ iPad Pro (9.7, 10.5 or 12.9 inches)
+ iPhone 7 and 7 Plus



WebARonARKit은 다음과 같은 환경과 조건에서 빌드되어야 합니다. 

+ [Xcode 9](https://developer.apple.com/xcode/)
+ iOS 11
+ Apple 개발자 계정. 아직 계정이 없으시다면, [developer.apple.com](http://developer.apple.com)에 가입하세요.
  ​


### <a name="WebARonARKit를실행하세요">1. WebARonARKit를 실행하세요</a>

1. WebARonARKit 깃헙 저장소를 복사하세요.
2. Xcode9를 실행하세요.
3. 복사한 WebARonARKit 저장소안에 있는 Xcode 프로젝트를 (.xcodeproj) Xcode9로 실행하세요.
4. 프로젝트 네비게이션 (왼쪽 행에 있는 윗쪽의 파란 아이콘)에서 WebARonARKit 프로젝트를 선택하세요. 그리고 WebARonARKit의 target을 `Targets`아래 것으로 선택해주세요.

- ![GIF showing how to set the project target.](https://media.giphy.com/media/xUOxfc84FVlNqqeJeU/giphy.gif)
5. WebARonARKit를 target으로 선택한 경우, 기본 패널에서 자동으로 "General"  탭이 표시됩니다. 여기서 signing 섹션을 찾아 iOS 개발자 계정/팀에 해당하는 팀을 선택합니다. 다음 단계에서 오류가 발생하는 경우, 아마도 code signing 오류 때문입니다. code signing 오류가 발생한다면, Xcode에서 아래와 같이 지시사항을 따르세요. (아래의 GIF 예제에서 식별자에 "-personal"이 추가 된 것처럼 번들 식별자가 변경되어야 합니다.)
- ![GIF showing how to code sign.](https://media.giphy.com/media/3osBL6RqUu3prBVYOc/giphy.gif)
6. 먼저 컴퓨터에 연결되어 있는지 확인한 다음, Product >> Destination 메뉴에서 선택하거나 실행버튼 옆에 있는 드롭 다운 메뉴에서 기기를 빌드 대상으로 설정하세요. 
- ![GIF showing how to set the build destination!](https://media.giphy.com/media/3osBL6aab1y581gPyE/giphy.gif)
7. 빌드하세요. 그리고  Run 버튼을 누르거나 `⌘-R`을  타이핑해서 당신의 기기에 푸시하세요. 빌드가 완료되고 기기에 푸시되면 앱이 자동으로 열립니다. 기기로 푸시하기 위해 개발자 계정을 승인하려면 화면의 안내를 따라야 할 수 있습니다. 앱을 처음 실행하면 올바른 사용자 프로필을 설치하는 데 약간의 시간이 걸릴 수 있습니다.



### <a name="예제보기">2. 예제보기</a>

WebARonARKit 및 [WebARonARCore](https://github.com/google-ar/WebARonARCore)과 호환되는 [예제 장면 목록들](https://developers.google.com/ar/develop/web/getting-started#examples)은  [developers.google.com](https://developers.google.com/ar/develop/web/getting-started#examples)에서 사용할 수 있습니다.

### <a name="당신만의장면을만드는것">3. 당신만의 장면을 만드는 것</a>

WebARonARKit 및 [Android 용 WebARonARCore](https://github.com/google-ar/WebARonARCore)과 함께 작동하는 AR 웹 환경을 구축하기 위해, 인기있는 WebGL 프레임워크인 [three.js](http://threejs.org)과 함께 작동하는 헬퍼 라이브러리인 [three.ar.js](https://github.com/google-ar/three.ar.js)를 추천합니다. [three.ar.js](https://github.com/google-ar/three.ar.js)는 현실 세계의 표면 위에 그리는 가시적 십자선과 같은 일반적인 AR구성 요소와 예제 장면들을 제공합니다.

### <a name="디버깅">4. 디버깅 </a>

웹 사이트의 페이지는 MacOS Safari와 함께 원격으로 검사하고 디버깅 할 수 있지만 이 작업을 수행하려면 MacOSSafari11.0(SafariTechnologyPreview)이상이 필요합니다. [https://developer.apple.com/safari/technology-preview/](https://developer.apple.com/safari/technology-preview/)에서 MacOSSafari11을 다운로드할 수 있습니다.



## <a name="WebARonARKit작동방식">WebARonARKit 작동방식</a>

WebARonARKit은 다음과 같이 구축되었습니다:

* **WKWebView 인스턴스.**  [WKWebView](https://developer.apple.com/documentation/webkit/wkwebview)는 개발자가 네이티브 앱에 웹 뷰를 삽입할 수 있게 하고, 사용자 정의 API를 통해 네이티브 장치 기능을 웹 콘텐츠에 노출시킬 수 있게 하는 iOS 클래스입니다. 우리의 경우에는 ARKit의 기능을 웹 콘텐츠에 노출시키는 것을 위해 WKWebView를 사용합니다. [Cordova](https://cordova.apache.org/)와 같은 네이티브/웹 앱 프레임워크도 유사한 접근 방식을 사용합니다.
* **WebVR API의 확장.** WebVR API (v1.1)는 AR에 필요한 대부분을 제공합니다. 그런 다음 이 기능을 확장하여 모션 추적, 카메라의 비디오 피드 렌더링, 실제 환경에 대한 기본적인 이해 등의 몇가지 필수 요소를 추가합니다. 자세한 내용은 [WebVR API extension for smartphone AR](https://github.com/google-ar/three.ar.js/blob/master/webvr_ar_extension.md) 보세요.

WebARonARKit는 페이지가 WKWebView에 로딩되는 즉시 스크립트(WebARonARKit.js)를 주입합니다. 특히 이 스크립트는 WebVR 1.1 API 를 폴리필해주고 네이티브와 웹 컨텐츠 사이의 모든 통신을 처리해줍니다. 

실행 중일때, WebARonARKit은 전체 화면 카메라 피드를 가장 상단에 위치한 투명한  WKWebView의 백그라운드에 삽입합니다. 이런 배열은 "현실 세계"와  렌더링된 웹 컨텐츠 사이에서 비교적 매끄러운 결과를 만듭니다. 그러나 몇가지 한계가 있습니다.

* 패스-스루 카메라 기반 AR에서는 카메라 프레임의 동기화를 기반으로 한 타임 스탬프와 6DOF(6Degrees Of Freedom , 6자유도) 포즈가 최대한 정확해야 합니다. 이러한 두 계층 시스템 특성 때문에, WebARonARKit은 적절한 동기화를 보장할 수 없습니다. 이것은 특히 아이폰에서 카메라 피드와 함께 보여지는 가상 객체들과 현실 세계 사이의 감지할 수 있는 "편차"에 기여합니다.
* 항상 네이티브 측과 Javascript 측 사이의 양방향 통신 브릿지를 사용합니다. WebARonARKit는 이런 한계를 해결하기 위해 가능한 많은 다양한 기술들(동기적이어야하는 hitTest와 같은)을 사용하며 시도합니다. 
* 현재 WebARonARKit 버전에서는, 웹 컨텐츠를 실행하는 WKWebView의 아래에서 카메라 피드는 항상 네이티브 측에서 렌더링 됩니다. 비디오 프레임을 웹에 노출시키지 못하는 것은 반사,굴절, 환경 매핑 또는 특정 위치 혹은 사이즈 (현재 빌드되어 있는 것은 항상 전체화면입니다.)에서의 단순한 비디오 렌더링과 같은 흥미로운 유스케이스들을 방해합니다. 웹 측에서 비디오 피드를 렌더링을 하면 이전에 언급한 동기 문제도 해결됩니다.

## <a name="알려진문제">알려진 문제</a>
+ iOS 10 [WKWebView](https://developer.apple.com/documentation/webkit/wkwebview)에 영향을 주는 WebKit의 [버그](https://bugs.webkit.org/show_bug.cgi?id=170595)가 있는 것 같습니다. 여기서 이벤트가 발생하면 window.innerWidth 및 window.innerHeight 값이 정확하게 업데이트되지 않아 디바이스의 오리엔테이션이 변경 될 때 제대로 크기를 조정할 수 없습니다. WebARonARKit에서 이 문제를 해결하려면,  윈도우에서 '크기조정' 이벤트를 수신하기위해 이벤트 리스너가 생성됬을 때, 이 것은 디바이스의 오리엔테이션이 변경될때만 인터셉트 되어 업데이트 되면 됩니다. 
+ WebARonARKit의 구현된 방식때문에 (웹뷰는 웹 컨텐츠를 렌더링하여 카메라 피드를 렌더링하고 ARKit 코드와 그 사이의 통신을 처리하는 웹 프로세스를 실행하는 웹 뷰이므로) 기본 카메라 피드를 기반으로 완전히 일치하는 올바른 포즈 추정을 얻는 것은 매우 어렵습니다. 이러한 추적 및 렌더링 동기화의 부족은 iPhone에서 특히 두드러집니다. iPads에서는 이러한 오류가 덜 감지되므로 최적의 결과를 위해 iPads를 권장합니다. 

## <a name="앞으로할일">앞으로 할 일</a>
+ 특히 iPhone에서 대체가능한 WKWebView와 네이티브 측 간의 통신 방법을 구현하여 성능을 향상시켜야 합니다. 목표는 가능한 한 카메라 피드와 WebVR에서 사용되는 포즈를 동기화하는 것입니다.
+ 더 많은 AR 관련 기능을 추가하세요.

## <a name="License">License</a>
Apache License Version 2.0 (see the `LICENSE` file inside this repo).
