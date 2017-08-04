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
      safari = /safari/.test(userAgent),
      ios = /iphone|ipod|ipad/.test(userAgent);
  if (!ios || standalone || safari) {
    return;
  }

  var nextDisplayId = 1000;

  VRDisplay = function () {
    var _layers = null;

    this.isConnected = false;
    this.isPresenting = false;
    this.capabilities = new VRDisplayCapabilities();
    this.capabilities.hasOrientation = true;
    this.capabilities.canPresent = true;
    this.capabilities.maxLayers = 1;
    this.capabilities.hasPosition = true;
    this.capabilities.hasSeeThroughCamera = true;
    // this.stageParameters = null; // OculusMobileSDK (Gear VR) does not support room scale VR yet, this attribute is optional.
    this.getEyeParameters = function (eye) {
      var eyeParameters = null;
      // if (vrWebGLRenderingContexts.length > 0) {
      //  eyeParameters = vrWebGLRenderingContexts[0].getEyeParameters(eye);
      // }
      if (eyeParameters !== null && eye === "left") {
        eyeParameters.offset = -eyeParameters.offset;
      }
      return eyeParameters;
    };
    this.displayId = nextDisplayId++;
    this.displayName = "ARKit VR Device";

    var enableDisable = true;

    this.getFrameData = function (frameData) {
      frameData.timestamp = performance.now();
      frameData.pose = this.getPose();
      frameData.projectionMatrix = this.getProjectionMatrix();
    };

    this._pose = new VRPose();
    this.getPose = function() {
      var result = prompt("getPose:");
      var data = JSON.parse(result);
      this._pose.position = data.position;
      this._pose.orientation = data.orientation;
      return this._pose;
    };

    this._projectionMatrix = new Float32Array(16);
    this.getProjectionMatrix = function() {
      var result = prompt("getProjectionMatrix:");
      var data = JSON.parse(result);
      for (var i = 0; i < 16; i++) {
        this._projectionMatrix[i] = data[i];
      }
      return this._projectionMatrix;
    };

    this.resetPose = function () {
      // TODO: Make a call to the native extension to reset the pose.
    };

    this.depthNear = 0.01;
    this.depthFar = 10000.0;

    this.requestAnimationFrame = function (callback) {
      return window.requestAnimationFrame(callback);
    };

    this.cancelAnimationFrame = function (handle) {
      return window.cancelAnimationFrame(handle);
    };

    this.requestPresent = function (layers) {
      var self = this;
      return new Promise(function (resolve, reject) {
        self.isPresenting = true;
        notifyVRDisplayPresentChangeEvent(self);
        _layers = layers;
        resolve();
      });
    };

    this.exitPresent = function () {
      var self = this;
      return new Promise(function (resolve, reject) {
        self.isPresenting = false;
        resolve();
      });
    };

    this.getLayers = function () {
      return _layers;
    };

    this.submitFrame = function (pose) {
      // TODO: Learn fom the WebVR Polyfill how to make the barrel distortion.
    };

    // WebAR API
    this.hitTest = function (x, y) {
      var result = prompt("hitTest:" + x + "," + y);
      if (!result) {
        return null;
      }
      var hits = [];
      var data = JSON.parse(result);
      for (var i = 0; i < data.hits.length; i++) {
        var entry = data.hits[i];
        var hit = new VRHit();
        for (var mi = 0; mi < 16; mi++) {
          hit.modelMatrix[mi] = entry[mi];
        }
        hits.push(hit);
      }
      return hits;
    };

    return this;
  };

  VRLayer = function () {
    this.source = null;
    this.leftBounds = [];
    this.rightBounds = [];
    return this;
  };

  VRDisplayCapabilities = function () {
    this.hasPosition = false;
    this.hasOrientation = false;
    this.hasExternalDisplay = false;
    this.canPresent = false;
    this.maxLayers = 0;
    this.hasSeeThroughCamera = false;
    return this;
  };

  VREye = {
    left: "left",
    right: "right"
  };

  VRFieldOfView = function () {
    this.upDegrees = 0;
    this.rightDegrees = 0;
    this.downDegrees = 0;
    this.leftDegrees = 0;
    return this;
  };

  VRPose = function () {
    this.position = null;
    this.linearVelocity = null;
    this.linearAcceleration = null;
    this.orientation = null;
    this.angularVelocity = null;
    this.angularAcceleration = null;
    return this;
  };

  VRFrameData = function () {
    this.timestamp = null;
    this.leftProjectionMatrix = null;
    this.leftViewMatrix = null;
    this.rightProjectionMatrix = null;
    this.rightViewMatrix = null;
    this.pose = null;
    this.projectionMatrix = null;
  };

  VREyeParameters = function () {
    this.offset = 0;
    this.fieldOfView = new VRFieldOfView();
    this.renderWidth = 0;
    this.renderHeight = 0;
    return this;
  };

  VRStageParameters = function () {
    this.sittingToStandingTransform = null;
    this.sizeX = 0;
    this.sizeZ = 0;
    return this;
  };

  // WebAR structures
  VRHit = function () {
    this.modelMatrix = new Float32Array(16);
    return this;
  };

  function setupWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
      return callback(WebViewJavascriptBridge);
    }
    if (window.WVJBCallbacks) {
      return window.WVJBCallbacks.push(callback);
    }
    window.WVJBCallbacks = [callback];
    var WVJBIframe = document.createElement("iframe");
    WVJBIframe.style.display = "none";
    WVJBIframe.src = "https://__bridge_loaded__";
    document.documentElement.appendChild(WVJBIframe);
    setTimeout(function() {
      document.documentElement.removeChild(WVJBIframe);
    }, 0);
  }

  navigator.getVRDisplays = function() {
    if (window.getVRDisplaysPromise != null) {
      return window.getVRDisplaysPromise;
    }
    window.getVRDisplaysPromise = new Promise(function (resolve, reject) {
      setupWebViewJavascriptBridge(function(bridge) {
        resolve([new VRDisplay()]);
      });
    });
    return window.getVRDisplaysPromise;
  }
})();
