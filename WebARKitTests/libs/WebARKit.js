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

(function() {

	// The polyfill is only injected if the code is loaded in the safari webview.
	var standalone = window.navigator.standalone,
	    userAgent = window.navigator.userAgent.toLowerCase(),
	    safari = /safari/.test( userAgent ),
	    ios = /iphone|ipod|ipad/.test( userAgent );
	if (!ios || standalone || safari) {
		return;
	}

	// alert("This is the iOS WebView!");

	// Polyfill the window.addEventListene to handle the load event. Once the bidge is set, and the page is loaded, the load event can be triggered.
	var windowLoadEventCallbacks = [];
	var windowAlreadyLoaded = false;
	var bridgeAlreadySetup = false;

	function callWindowLoadEventCallbacks() {
		for (var i = 0; i < windowLoadEventCallbacks.length; i++) {
			windowLoadEventCallbacks[i].call(window, event);
		}
		windowLoadEventCallbacks = [];
		if (typeof(window.onload) === "function") {
			window.onload();
		}
	}

	window.addEventListener("load", function() {
		windowAlreadyLoaded = true;
		if (bridgeAlreadySetup) {
			callWindowLoadEventCallbacks();
		}
	});

	var oldWindowAddEventListener = window.addEventListener;
	window.addEventListener = function(eventName, callback) {
		var argumentsArray = Array.prototype.slice.call(arguments);
		if (eventName === "load") {
			if (windowAlreadyLoaded && bridgeAlreadySetup) {
				setTimeout(function() {
					callback.apply(this, argumentsArray);
				}, 100);
			}
			else {
				windowLoadEventCallbacks.push(callback);
			}
		}
		else {
			return oldWindowAddEventListener.apply(this, argumentsArray);
		}
	};

	function setupWebViewJavascriptBridge(callback) {
		if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
		if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
		window.WVJBCallbacks = [callback];
		var WVJBIframe = document.createElement('iframe');
		WVJBIframe.style.display = 'none';
		WVJBIframe.src = 'https://__bridge_loaded__';
		document.documentElement.appendChild(WVJBIframe);
		setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
	}

	setupWebViewJavascriptBridge(function(bridge) {
		if (!navigator.getVRDisplays) {
			function notifyVRDisplayPresentChangeEvent(vrDisplay) {
				var event = new CustomEvent('vrdisplaypresentchange', {detail: {vrdisplay: self}});
				window.dispatchEvent(event);
				if (typeof(window.onvrdisplaypresentchange) === "function") {
					window.onvrdisplaypresentchange(event);
				}
			}

			var MAX_NUMBER_OF_POINTS_IN_POINT_CLOUD = 1000;
			var MAX_FLOAT32_VALUE = 3.4028e38;

			VRDisplay = function() {
				var _layers = null;
				var _rigthEyeParameters = new VREyeParameters();
				var _leftEyeParameters = new VREyeParameters();

				this.isConnected = false;
				this.isPresenting = false;
				this.capabilities = new VRDisplayCapabilities();
			    this.capabilities.hasOrientation = true;
			    this.capabilities.canPresent = true;
			    this.capabilities.maxLayers = 1;
			    this.capabilities.hasPosition = true;
			    this.capabilities.hasSeeThroughCamera = true;
			    this.capabilities.hasPointCloud = true;
					// this.stageParameters = null; // OculusMobileSDK (Gear VR) does not support room scale VR yet, this attribute is optional.
				this.getEyeParameters = function(eye) {
					var eyeParameters = null;
					// if (vrWebGLRenderingContexts.length > 0) {
					// 	eyeParameters = vrWebGLRenderingContexts[0].getEyeParameters(eye);
					// }
					if (eyeParameters !== null && eye === 'left') {
						eyeParameters.offset = -eyeParameters.offset;
					}
					return eyeParameters;
				};
				this.displayId = nextDisplayId++;
				this.displayName = 'ARKit VR Device';

				var enableDisable = true;

				this.getPose = function() {
					// Make a call to the native side to retrieve a new pose.
					// Commented out for now because the pose is being passed per frame to the window.WebARKitSetPose call.
					// bridge.callHandler('getPose', _getPoseCallback);

					// Return whatever pose we have.
					return _pose;
				};
				this.getImmediatePose = function() {
					return getPose();
				};
				this.resetPose = function() {
					// TODO: Make a call to the native extension to reset the pose.
				};
				this.depthNear = 0.01;
				this.depthFar = 10000.0;
				this.requestAnimationFrame = function(callback) {
					return window.requestAnimationFrame(callback);
				};
				this.cancelAnimationFrame = function(handle) {
					return window.cancelAnimationFrame(handle);
				};
				this.requestPresent = function(layers) {
					var self = this;
					return new Promise(function(resolve, reject) {
						self.isPresenting = true;
						notifyVRDisplayPresentChangeEvent(self);
						_layers = layers;
						resolve();
					});
				};
				this.exitPresent = function() {
					var self = this;
					return new Promise(function(resolve, reject) {
						self.isPresenting = false;
						resolve();
					});
				};
				this.getLayers = function() {
					return _layers;
				};
				this.submitFrame = function(pose) {
					// TODO: Learn fom the WebVR Polyfill how to make the barrel distortion.
				};

				// WebAR API
				this.getPickingPointAndPlaneInPointCloud = function(x, y) {
					// Make a call to the native side to retrieve a new hit.
					bridge.callHandler('hitTest', "" + x + "," + y, _hitTestCallback);
					// Return whatever hit is available that corresponds to the x,y point
					var pickingPointAndPlane = null;
					if (_hits[x] &&_hits[x][y]) {
						pickingPointAndPlane = _hits[x][y];
					}
					return pickingPointAndPlane;
				};
				this.getPointCloud = function(pointCloud, justUpdatePointCloud, pointsToSkip) {
					// TODO: pointsToSkip could be implemented by passing it to the native call
					if (!justUpdatePointCloud) {
						// Make a call to the native side to retrieve a new point cloud.
						bridge.callHandler('getPointCloud', null, _getPointCloudCallback);
					}
					// Store a reference to the point cloud to store the result of the callback in it.
					_pointCloud = pointCloud;
				};
				this.getSeeThroughCamera = function() {
					return _seeThoughCamera;
				};


				return this;
			};

			VRLayer = function() {
				this.source = null;
				this.leftBounds = [];
				this.rightBounds = [];
				return this;
			};

			VRDisplayCapabilities = function() {
				this.hasPosition = false;
				this.hasOrientation = false;
				this.hasExternalDisplay = false;
				this.canPresent = false;
				this.maxLayers = 0;
				this.hasSeeThroughCamera = false;
				this.hasPointCloud = false;
				this.hasMarkerSupport = false;
				this.hasADFSupport = false;
				return this;
			};

			VREye = {
				left: "left",
				right: "right"
			};

			VRFieldOfView = function() {
				this.upDegrees = 0;
				this.rightDegrees = 0;
				this.downDegrees = 0;
				this.leftDegrees = 0;
				return this;
			};

			VRPose = function() {
				this.timeStamp = 0;
				this.position = null;
				this.linearVelocity = null;
				this.linearAcceleration = null;
				this.orientation = null;
				this.angularVelocity = null;
				this.angularAcceleration = null;
				return this;
			};

			VREyeParameters = function() {
				this.offset = 0;
				this.fieldOfView = new VRFieldOfView();
				this.renderWidth = 0;
				this.renderHeight = 0;
				return this;
			};

			VRStageParameters = function() {
				this.sittingToStandingTransform = null;
				this.sizeX = 0;
				this.sizeZ = 0;
				return this;
			};

			// WebAR structures
			VRPickingPointAndPlane = function() {
				this.point = new Float32Array(3);
				this.plane = new Float32Array(4);
				return this;
			};

			VRPointCloud = function() {
				this.numberOfPoints = 0;
				// The default max number of points in point cloud
				this.points = new Float32Array(MAX_NUMBER_OF_POINTS_IN_POINT_CLOUD * 3);
				for (var i = 0; i < this.points.length; i++) {
					this.points[i] = MAX_FLOAT32_VALUE;
				}
				return this;
			};

			VRSeeThroughCamera = function() {
				this.projectionMatrix = new Float32Array(16);
				return this;
			};

			// As the bridge is asynchronous we need a structure to hold the information while it is retrieved.
			var _pose = new VRPose();
			_pose.orientation = new Float32Array(4);
			_pose.position = new Float32Array(3);

			// This is the callback for the bridge call to the native side.
			function _getPoseCallback(poseString) {
				var pose = JSON.parse(poseString);
				_pose.position[0] = pose.position[0];
				_pose.position[1] = pose.position[1];
				_pose.position[2] = pose.position[2];
				_pose.orientation[0] = pose.orientation[0];
				_pose.orientation[1] = pose.orientation[1];
				_pose.orientation[2] = pose.orientation[2];
				_pose.orientation[3] = pose.orientation[3];
			}

			window.WebARKitSetPose = function(pose) {
				_pose.position[0] = pose.position[0];
				_pose.position[1] = pose.position[1];
				_pose.position[2] = pose.position[2];
				_pose.orientation[0] = pose.orientation[0];
				_pose.orientation[1] = pose.orientation[1];
				_pose.orientation[2] = pose.orientation[2];
				_pose.orientation[3] = pose.orientation[3];
			};

			var _seeThoughCamera = new VRSeeThroughCamera();
			function _getProjectionMatrixCallback(projectionMatrixString) {
				var projectionMatrix = JSON.parse(projectionMatrixString);
				for (var i = 0; i < 16; i++) {
					_seeThoughCamera.projectionMatrix[i] = projectionMatrix[i];
				}
				// We can finally say that the bidge setup has ended!
				bridgeAlreadySetup = true;
				if (windowAlreadyLoaded) {
					callWindowLoadEventCallbacks();
				}
			}
			bridge.callHandler("getProjectionMatrix", null, _getProjectionMatrixCallback);

			var _hits = {};
			function _hitTestCallback(dataString) {
				if (!dataString) return;
				var data = JSON.parse(dataString);
				var x = data.p[0];
				var y = data.p[1];
				if (_hits[x]) {
					if (_hits[x][y]) {
						_hits[x][y].point[0] = data.point[0];
						_hits[x][y].point[1] = data.point[1];
						_hits[x][y].point[2] = data.point[2];
						_hits[x][y].plane[0] = data.plane[0];
						_hits[x][y].plane[1] = data.plane[1];
						_hits[x][y].plane[2] = data.plane[2];
						_hits[x][y].plane[3] = data.plane[3];
					}
					else {
						_hits[x][y] = { point: data.point, plane: data.plane };
					}
				}
				else {
					_hits[x] = {};
					_hits[x][y] = { point: data.point, plane: data.plane };
				}
			}

			var _pointCloud = null;
			function _getPointCloudCallback(dataString) {
				if (!_pointCloud || !dataString) return;
				var data = JSON.parse(dataString);
				for (var i = 0; i < data.points.length; i++) {
					_pointCloud.points[i] = data.points[i];
				}
				if (data.numberOfPoints < _pointCloud.numberOfPoints) {
					for (var i = data.numberOfPoints * 3; i < _pointCloud.numberOfPoints * 3; i++) {
						_pointCloud.points[i] = MAX_FLOAT32_VALUE;
					}
				}
				_pointCloud.numberOfPoints = data.numberOfPoints;
			}

			var nextDisplayId = 1000;

			// The VR displayes
			var displays = [ new VRDisplay() ];
			// The promise resolvers for those promises created before the start event is received === devices are created.
			var resolvers = [];

			navigator.getVRDisplays = function() {
				return new Promise(
					function(resolve, reject) {
						resolve(displays);
					});
			};
		}
	});
})();