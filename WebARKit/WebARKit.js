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
  var nextDisplayId = 1000;

  VRDisplay = function() {
    var _layers = null;

    this.isConnected = false;
    this.isPresenting = false;
    this.capabilities = new VRDisplayCapabilities();
    this.capabilities.hasOrientation = true;
    this.capabilities.canPresent = true;
    this.capabilities.maxLayers = 1;
    this.capabilities.hasPosition = true;
    this.capabilities.hasSeeThroughCamera = true;
    this.stageParameters = null;
    this.getEyeParameters = function(eye) {
      var eyeParameters = null;
      if (eyeParameters !== null && eye === "left") {
        eyeParameters.offset = -eyeParameters.offset;
      }
      return eyeParameters;
    };
    this.displayId = nextDisplayId++;
    this.displayName = "ARKit VR Device";

    var enableDisable = true;

    this.getFrameData = function(frameData) {
      frameData.timestamp = performance.now();
      frameData.pose = this.getPose();
      // TODO: FieldOfView does not have the correct values. Not important for now as devs should not rely on it
      frameData.leftProjectionMatrix =
        frameData.rightProjectionMatrix =
        this._projectionMatrix;
      frameData.leftViewMatrix =
        frameData.rightViewMatrix =
        this.viewMatrix_;
    };

    this._pose = new VRPose();
    this.getPose = function() {
      return this._pose;
    };

    this._projectionMatrix = new Float32Array(16);
    this.viewMatrix_ = new Float32Array(16);

    this.resetPose = function() {
      prompt("resetPose:");
    };

    var depthNear = 0.01;
    Object.defineProperty(this, "depthNear", {
      get: function() {
        return depthNear
      },
      set: function(value) {
        depthNear = value;
        window.webkit.messageHandlers.WebARKit.postMessage("setDepthNear:" + depthNear);
      }
    });
    var depthFar = 10000.0;
    Object.defineProperty(this, "depthFar", {
      get: function() {
        return depthFar
      },
      set: function(value) {
        depthFar = value;
        window.webkit.messageHandlers.WebARKit.postMessage("setDepthFar:" + depthFar);
      }
    });

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
    this.hitTest = function(x, y) {
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
    this.hasPassThroughCamera = false;
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

  VRPose = function () {
    this.position = new Float32Array(3);
    this.linearVelocity = null;
    this.linearAcceleration = null;
    this.orientation = new Float32Array(4);
    this.angularVelocity = null;
    this.angularAcceleration = null;
    return this;
  };

  VRFrameData = function() {
    this.timestamp = null;
    this.leftProjectionMatrix = new Float32Array(16);
    this.leftViewMatrix = new Float32Array(16);
    this.rightProjectionMatrix = new Float32Array(16);
    this.rightViewMatrix = new Float32Array(16);
    // TODO: Initialize matrices to identity
    this.pose = null;
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

  VRHit = function () {
    this.modelMatrix = new Float32Array(16);
    return this;
  };

  var webarkitVRDisplay = new VRDisplay();

 // This function will be called from the native side every frame/pose
 // update.
  window.WebARKitSetData = function(data) {
    webarkitVRDisplay._pose.position[0] = data.position[0];
    webarkitVRDisplay._pose.position[1] = data.position[1];
    webarkitVRDisplay._pose.position[2] = data.position[2];
    webarkitVRDisplay._pose.orientation[0] = data.orientation[0];
    webarkitVRDisplay._pose.orientation[1] = data.orientation[1];
    webarkitVRDisplay._pose.orientation[2] = data.orientation[2];
    webarkitVRDisplay._pose.orientation[3] = data.orientation[3];
    for (var i = 0; i < 16; i++) {
      webarkitVRDisplay.viewMatrix_[i] = data.viewMatrix[i];
    }
    for (var i = 0; i < 16; i++) {
      webarkitVRDisplay._projectionMatrix[i] = data.projectionMatrix[i];
    }
    callRafCallbacks();
  };

 // If the window size has changed, the native side will call this function.
 // This is a hack due to the WKWebView not handling the window.innerWidth/Height
 // correctly in the window.onresize events.
 // TODO: Remove this hack once the WKWebView has fixed the issue.
  window.WebARKitSetWindowSize = function(size) {
    window.innerWidth = size.width;
    window.innerHeight = size.height;
    window.dispatchEvent(new Event("resize"));
  };

  navigator.getVRDisplays = function() {
    if (window.getVRDisplaysPromise != null) {
      return window.getVRDisplaysPromise;
    }
    window.getVRDisplaysPromise = new Promise(function(resolve, reject) {
      resolve([webarkitVRDisplay]);
    });
    return window.getVRDisplaysPromise;
  };

 // TODO: MacOS Safari and iOS 11 seem to have some kind of disagreement
 // and it is to possible to debug the WKWebView (or a Safari iOS page).
 // As console.log calls are not being shown in the XCode console, this
 // reimplementation of console.log does the trick.
 // This could be removed in case the Safari debugging tool is restored.
  var oldConsoleLog = console.log;
  console.log = function() {
    var argumentsArray = Array.prototype.slice.call(arguments);
    window.webkit.messageHandlers.WebARKit.postMessage("log:" + argumentsArray.join(" "));
    oldConsoleLog.apply(this, argumentsArray);
  };

 // TODO: Reimplement window.requestAnimationFrame because it seems
 // camera and pose synchronization improves noticeably on iPhones.
 // If at some point the original raf is performant enough, remove this.
  var oldRequestAnimationFrame = window.requestAnimationFrame;
  var rafCallbacks = [];
  window.requestAnimationFrame = function(callback) {
    if (typeof(callback) !== "function") {
      throw new TypeError("Failed to execute 'requestAnimationFrame' on 'Window':" +
                          "The callback provided as parameter 1 is not a function.");
    }
    rafCallbacks.push(callback);
  };

  function callRafCallbacks() {
    var rafCallbacksCopy = new Array(rafCallbacks.length);
    for (var i = 0; i < rafCallbacks.length; i++) {
      rafCallbacksCopy[i] = rafCallbacks[i];
    }
    rafCallbacks = [];
    for (var i = 0; i < rafCallbacksCopy.length; i++) {
      rafCallbacksCopy[i]();
    }
  }
 
// TODO: Implement cancelAnimationFrame. raf needs to return a unique
// identifier and use it to cancel the call (remove it from the array).

})();
