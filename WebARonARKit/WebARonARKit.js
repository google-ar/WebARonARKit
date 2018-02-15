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

  if (window.VRDisplay !== undefined) {
    return;
  }

  // Inlined gl-matrix-min.js so the gl-matrix library gets injected too.
  /////////////////////////////////////////////////////////////////////////////
  /**
   * @fileoverview gl-matrix - High performance matrix and vector operations
   * @author Brandon Jones
   * @author Colin MacKenzie IV
   * @version 2.4.0
   */

  /* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documentation files (the "Software"), to deal
   in the Software without restriction, including without limitation the rights
   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   copies of the Software, and to permit persons to whom the Software is
   furnished to do so, subject to the following conditions:

   The above copyright notice and this permission notice shall be included in
   all copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   THE SOFTWARE. */

  !function(t,n){if("object"==typeof exports&&"object"==typeof module)module.exports=n();else if("function"==typeof define&&define.amd)define([],n);else{var r=n();for(var a in r)("object"==typeof exports?exports:t)[a]=r[a]}}(this,function(){return function(t){function n(a){if(r[a])return r[a].exports;var e=r[a]={i:a,l:!1,exports:{}};return t[a].call(e.exports,e,e.exports,n),e.l=!0,e.exports}var r={};return n.m=t,n.c=r,n.d=function(t,r,a){n.o(t,r)||Object.defineProperty(t,r,{configurable:!1,enumerable:!0,get:a})},n.n=function(t){var r=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(r,"a",r),r},n.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},n.p="",n(n.s=4)}([function(t,n,r){"use strict";function a(t){n.ARRAY_TYPE=i=t}function e(t){return t*s}function u(t,n){return Math.abs(t-n)<=o*Math.max(1,Math.abs(t),Math.abs(n))}Object.defineProperty(n,"__esModule",{value:!0}),n.setMatrixArrayType=a,n.toRadian=e,n.equals=u;var o=n.EPSILON=1e-6,i=n.ARRAY_TYPE="undefined"!=typeof Float32Array?Float32Array:Array,s=(n.RANDOM=Math.random,Math.PI/180)},function(t,n,r){"use strict";function a(){var t=new g.ARRAY_TYPE(9);return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t}function e(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[4],t[4]=n[5],t[5]=n[6],t[6]=n[8],t[7]=n[9],t[8]=n[10],t}function u(t){var n=new g.ARRAY_TYPE(9);return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n[4]=t[4],n[5]=t[5],n[6]=t[6],n[7]=t[7],n[8]=t[8],n}function o(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t}function i(t,n,r,a,e,u,o,i,s){var c=new g.ARRAY_TYPE(9);return c[0]=t,c[1]=n,c[2]=r,c[3]=a,c[4]=e,c[5]=u,c[6]=o,c[7]=i,c[8]=s,c}function s(t,n,r,a,e,u,o,i,s,c){return t[0]=n,t[1]=r,t[2]=a,t[3]=e,t[4]=u,t[5]=o,t[6]=i,t[7]=s,t[8]=c,t}function c(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t}function f(t,n){if(t===n){var r=n[1],a=n[2],e=n[5];t[1]=n[3],t[2]=n[6],t[3]=r,t[5]=n[7],t[6]=a,t[7]=e}else t[0]=n[0],t[1]=n[3],t[2]=n[6],t[3]=n[1],t[4]=n[4],t[5]=n[7],t[6]=n[2],t[7]=n[5],t[8]=n[8];return t}function M(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=n[4],i=n[5],s=n[6],c=n[7],f=n[8],M=f*o-i*c,h=-f*u+i*s,l=c*u-o*s,v=r*M+a*h+e*l;return v?(v=1/v,t[0]=M*v,t[1]=(-f*a+e*c)*v,t[2]=(i*a-e*o)*v,t[3]=h*v,t[4]=(f*r-e*s)*v,t[5]=(-i*r+e*u)*v,t[6]=l*v,t[7]=(-c*r+a*s)*v,t[8]=(o*r-a*u)*v,t):null}function h(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=n[4],i=n[5],s=n[6],c=n[7],f=n[8];return t[0]=o*f-i*c,t[1]=e*c-a*f,t[2]=a*i-e*o,t[3]=i*s-u*f,t[4]=r*f-e*s,t[5]=e*u-r*i,t[6]=u*c-o*s,t[7]=a*s-r*c,t[8]=r*o-a*u,t}function l(t){var n=t[0],r=t[1],a=t[2],e=t[3],u=t[4],o=t[5],i=t[6],s=t[7],c=t[8];return n*(c*u-o*s)+r*(-c*e+o*i)+a*(s*e-u*i)}function v(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=n[4],s=n[5],c=n[6],f=n[7],M=n[8],h=r[0],l=r[1],v=r[2],d=r[3],b=r[4],m=r[5],p=r[6],P=r[7],E=r[8];return t[0]=h*a+l*o+v*c,t[1]=h*e+l*i+v*f,t[2]=h*u+l*s+v*M,t[3]=d*a+b*o+m*c,t[4]=d*e+b*i+m*f,t[5]=d*u+b*s+m*M,t[6]=p*a+P*o+E*c,t[7]=p*e+P*i+E*f,t[8]=p*u+P*s+E*M,t}function d(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=n[4],s=n[5],c=n[6],f=n[7],M=n[8],h=r[0],l=r[1];return t[0]=a,t[1]=e,t[2]=u,t[3]=o,t[4]=i,t[5]=s,t[6]=h*a+l*o+c,t[7]=h*e+l*i+f,t[8]=h*u+l*s+M,t}function b(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=n[4],s=n[5],c=n[6],f=n[7],M=n[8],h=Math.sin(r),l=Math.cos(r);return t[0]=l*a+h*o,t[1]=l*e+h*i,t[2]=l*u+h*s,t[3]=l*o-h*a,t[4]=l*i-h*e,t[5]=l*s-h*u,t[6]=c,t[7]=f,t[8]=M,t}function m(t,n,r){var a=r[0],e=r[1];return t[0]=a*n[0],t[1]=a*n[1],t[2]=a*n[2],t[3]=e*n[3],t[4]=e*n[4],t[5]=e*n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t}function p(t,n){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=n[0],t[7]=n[1],t[8]=1,t}function P(t,n){var r=Math.sin(n),a=Math.cos(n);return t[0]=a,t[1]=r,t[2]=0,t[3]=-r,t[4]=a,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t}function E(t,n){return t[0]=n[0],t[1]=0,t[2]=0,t[3]=0,t[4]=n[1],t[5]=0,t[6]=0,t[7]=0,t[8]=1,t}function O(t,n){return t[0]=n[0],t[1]=n[1],t[2]=0,t[3]=n[2],t[4]=n[3],t[5]=0,t[6]=n[4],t[7]=n[5],t[8]=1,t}function x(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=r+r,i=a+a,s=e+e,c=r*o,f=a*o,M=a*i,h=e*o,l=e*i,v=e*s,d=u*o,b=u*i,m=u*s;return t[0]=1-M-v,t[3]=f-m,t[6]=h+b,t[1]=f+m,t[4]=1-c-v,t[7]=l-d,t[2]=h-b,t[5]=l+d,t[8]=1-c-M,t}function A(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=n[4],i=n[5],s=n[6],c=n[7],f=n[8],M=n[9],h=n[10],l=n[11],v=n[12],d=n[13],b=n[14],m=n[15],p=r*i-a*o,P=r*s-e*o,E=r*c-u*o,O=a*s-e*i,x=a*c-u*i,A=e*c-u*s,q=f*d-M*v,y=f*b-h*v,w=f*m-l*v,R=M*b-h*d,L=M*m-l*d,S=h*m-l*b,_=p*S-P*L+E*R+O*w-x*y+A*q;return _?(_=1/_,t[0]=(i*S-s*L+c*R)*_,t[1]=(s*w-o*S-c*y)*_,t[2]=(o*L-i*w+c*q)*_,t[3]=(e*L-a*S-u*R)*_,t[4]=(r*S-e*w+u*y)*_,t[5]=(a*w-r*L-u*q)*_,t[6]=(d*A-b*x+m*O)*_,t[7]=(b*E-v*A-m*P)*_,t[8]=(v*x-d*E+m*p)*_,t):null}function q(t,n,r){return t[0]=2/n,t[1]=0,t[2]=0,t[3]=0,t[4]=-2/r,t[5]=0,t[6]=-1,t[7]=1,t[8]=1,t}function y(t){return"mat3("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+", "+t[6]+", "+t[7]+", "+t[8]+")"}function w(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2)+Math.pow(t[4],2)+Math.pow(t[5],2)+Math.pow(t[6],2)+Math.pow(t[7],2)+Math.pow(t[8],2))}function R(t,n,r){return t[0]=n[0]+r[0],t[1]=n[1]+r[1],t[2]=n[2]+r[2],t[3]=n[3]+r[3],t[4]=n[4]+r[4],t[5]=n[5]+r[5],t[6]=n[6]+r[6],t[7]=n[7]+r[7],t[8]=n[8]+r[8],t}function L(t,n,r){return t[0]=n[0]-r[0],t[1]=n[1]-r[1],t[2]=n[2]-r[2],t[3]=n[3]-r[3],t[4]=n[4]-r[4],t[5]=n[5]-r[5],t[6]=n[6]-r[6],t[7]=n[7]-r[7],t[8]=n[8]-r[8],t}function S(t,n,r){return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=n[3]*r,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=n[7]*r,t[8]=n[8]*r,t}function _(t,n,r,a){return t[0]=n[0]+r[0]*a,t[1]=n[1]+r[1]*a,t[2]=n[2]+r[2]*a,t[3]=n[3]+r[3]*a,t[4]=n[4]+r[4]*a,t[5]=n[5]+r[5]*a,t[6]=n[6]+r[6]*a,t[7]=n[7]+r[7]*a,t[8]=n[8]+r[8]*a,t}function I(t,n){return t[0]===n[0]&&t[1]===n[1]&&t[2]===n[2]&&t[3]===n[3]&&t[4]===n[4]&&t[5]===n[5]&&t[6]===n[6]&&t[7]===n[7]&&t[8]===n[8]}function N(t,n){var r=t[0],a=t[1],e=t[2],u=t[3],o=t[4],i=t[5],s=t[6],c=t[7],f=t[8],M=n[0],h=n[1],l=n[2],v=n[3],d=n[4],b=n[5],m=n[6],p=n[7],P=n[8];return Math.abs(r-M)<=g.EPSILON*Math.max(1,Math.abs(r),Math.abs(M))&&Math.abs(a-h)<=g.EPSILON*Math.max(1,Math.abs(a),Math.abs(h))&&Math.abs(e-l)<=g.EPSILON*Math.max(1,Math.abs(e),Math.abs(l))&&Math.abs(u-v)<=g.EPSILON*Math.max(1,Math.abs(u),Math.abs(v))&&Math.abs(o-d)<=g.EPSILON*Math.max(1,Math.abs(o),Math.abs(d))&&Math.abs(i-b)<=g.EPSILON*Math.max(1,Math.abs(i),Math.abs(b))&&Math.abs(s-m)<=g.EPSILON*Math.max(1,Math.abs(s),Math.abs(m))&&Math.abs(c-p)<=g.EPSILON*Math.max(1,Math.abs(c),Math.abs(p))&&Math.abs(f-P)<=g.EPSILON*Math.max(1,Math.abs(f),Math.abs(P))}Object.defineProperty(n,"__esModule",{value:!0}),n.sub=n.mul=void 0,n.create=a,n.fromMat4=e,n.clone=u,n.copy=o,n.fromValues=i,n.set=s,n.identity=c,n.transpose=f,n.invert=M,n.adjoint=h,n.determinant=l,n.multiply=v,n.translate=d,n.rotate=b,n.scale=m,n.fromTranslation=p,n.fromRotation=P,n.fromScaling=E,n.fromMat2d=O,n.fromQuat=x,n.normalFromMat4=A,n.projection=q,n.str=y,n.frob=w,n.add=R,n.subtract=L,n.multiplyScalar=S,n.multiplyScalarAndAdd=_,n.exactEquals=I,n.equals=N;var Y=r(0),g=function(t){if(t&&t.__esModule)return t;var n={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r]);return n.default=t,n}(Y);n.mul=v,n.sub=L},function(t,n,r){"use strict";function a(){var t=new Z.ARRAY_TYPE(3);return t[0]=0,t[1]=0,t[2]=0,t}function e(t){var n=new Z.ARRAY_TYPE(3);return n[0]=t[0],n[1]=t[1],n[2]=t[2],n}function u(t){var n=t[0],r=t[1],a=t[2];return Math.sqrt(n*n+r*r+a*a)}function o(t,n,r){var a=new Z.ARRAY_TYPE(3);return a[0]=t,a[1]=n,a[2]=r,a}function i(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t}function s(t,n,r,a){return t[0]=n,t[1]=r,t[2]=a,t}function c(t,n,r){return t[0]=n[0]+r[0],t[1]=n[1]+r[1],t[2]=n[2]+r[2],t}function f(t,n,r){return t[0]=n[0]-r[0],t[1]=n[1]-r[1],t[2]=n[2]-r[2],t}function M(t,n,r){return t[0]=n[0]*r[0],t[1]=n[1]*r[1],t[2]=n[2]*r[2],t}function h(t,n,r){return t[0]=n[0]/r[0],t[1]=n[1]/r[1],t[2]=n[2]/r[2],t}function l(t,n){return t[0]=Math.ceil(n[0]),t[1]=Math.ceil(n[1]),t[2]=Math.ceil(n[2]),t}function v(t,n){return t[0]=Math.floor(n[0]),t[1]=Math.floor(n[1]),t[2]=Math.floor(n[2]),t}function d(t,n,r){return t[0]=Math.min(n[0],r[0]),t[1]=Math.min(n[1],r[1]),t[2]=Math.min(n[2],r[2]),t}function b(t,n,r){return t[0]=Math.max(n[0],r[0]),t[1]=Math.max(n[1],r[1]),t[2]=Math.max(n[2],r[2]),t}function m(t,n){return t[0]=Math.round(n[0]),t[1]=Math.round(n[1]),t[2]=Math.round(n[2]),t}function p(t,n,r){return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t}function P(t,n,r,a){return t[0]=n[0]+r[0]*a,t[1]=n[1]+r[1]*a,t[2]=n[2]+r[2]*a,t}function E(t,n){var r=n[0]-t[0],a=n[1]-t[1],e=n[2]-t[2];return Math.sqrt(r*r+a*a+e*e)}function O(t,n){var r=n[0]-t[0],a=n[1]-t[1],e=n[2]-t[2];return r*r+a*a+e*e}function x(t){var n=t[0],r=t[1],a=t[2];return n*n+r*r+a*a}function A(t,n){return t[0]=-n[0],t[1]=-n[1],t[2]=-n[2],t}function q(t,n){return t[0]=1/n[0],t[1]=1/n[1],t[2]=1/n[2],t}function y(t,n){var r=n[0],a=n[1],e=n[2],u=r*r+a*a+e*e;return u>0&&(u=1/Math.sqrt(u),t[0]=n[0]*u,t[1]=n[1]*u,t[2]=n[2]*u),t}function w(t,n){return t[0]*n[0]+t[1]*n[1]+t[2]*n[2]}function R(t,n,r){var a=n[0],e=n[1],u=n[2],o=r[0],i=r[1],s=r[2];return t[0]=e*s-u*i,t[1]=u*o-a*s,t[2]=a*i-e*o,t}function L(t,n,r,a){var e=n[0],u=n[1],o=n[2];return t[0]=e+a*(r[0]-e),t[1]=u+a*(r[1]-u),t[2]=o+a*(r[2]-o),t}function S(t,n,r,a,e,u){var o=u*u,i=o*(2*u-3)+1,s=o*(u-2)+u,c=o*(u-1),f=o*(3-2*u);return t[0]=n[0]*i+r[0]*s+a[0]*c+e[0]*f,t[1]=n[1]*i+r[1]*s+a[1]*c+e[1]*f,t[2]=n[2]*i+r[2]*s+a[2]*c+e[2]*f,t}function _(t,n,r,a,e,u){var o=1-u,i=o*o,s=u*u,c=i*o,f=3*u*i,M=3*s*o,h=s*u;return t[0]=n[0]*c+r[0]*f+a[0]*M+e[0]*h,t[1]=n[1]*c+r[1]*f+a[1]*M+e[1]*h,t[2]=n[2]*c+r[2]*f+a[2]*M+e[2]*h,t}function I(t,n){n=n||1;var r=2*Z.RANDOM()*Math.PI,a=2*Z.RANDOM()-1,e=Math.sqrt(1-a*a)*n;return t[0]=Math.cos(r)*e,t[1]=Math.sin(r)*e,t[2]=a*n,t}function N(t,n,r){var a=n[0],e=n[1],u=n[2],o=r[3]*a+r[7]*e+r[11]*u+r[15];return o=o||1,t[0]=(r[0]*a+r[4]*e+r[8]*u+r[12])/o,t[1]=(r[1]*a+r[5]*e+r[9]*u+r[13])/o,t[2]=(r[2]*a+r[6]*e+r[10]*u+r[14])/o,t}function Y(t,n,r){var a=n[0],e=n[1],u=n[2];return t[0]=a*r[0]+e*r[3]+u*r[6],t[1]=a*r[1]+e*r[4]+u*r[7],t[2]=a*r[2]+e*r[5]+u*r[8],t}function g(t,n,r){var a=n[0],e=n[1],u=n[2],o=r[0],i=r[1],s=r[2],c=r[3],f=c*a+i*u-s*e,M=c*e+s*a-o*u,h=c*u+o*e-i*a,l=-o*a-i*e-s*u;return t[0]=f*c+l*-o+M*-s-h*-i,t[1]=M*c+l*-i+h*-o-f*-s,t[2]=h*c+l*-s+f*-i-M*-o,t}function T(t,n,r,a){var e=[],u=[];return e[0]=n[0]-r[0],e[1]=n[1]-r[1],e[2]=n[2]-r[2],u[0]=e[0],u[1]=e[1]*Math.cos(a)-e[2]*Math.sin(a),u[2]=e[1]*Math.sin(a)+e[2]*Math.cos(a),t[0]=u[0]+r[0],t[1]=u[1]+r[1],t[2]=u[2]+r[2],t}function j(t,n,r,a){var e=[],u=[];return e[0]=n[0]-r[0],e[1]=n[1]-r[1],e[2]=n[2]-r[2],u[0]=e[2]*Math.sin(a)+e[0]*Math.cos(a),u[1]=e[1],u[2]=e[2]*Math.cos(a)-e[0]*Math.sin(a),t[0]=u[0]+r[0],t[1]=u[1]+r[1],t[2]=u[2]+r[2],t}function D(t,n,r,a){var e=[],u=[];return e[0]=n[0]-r[0],e[1]=n[1]-r[1],e[2]=n[2]-r[2],u[0]=e[0]*Math.cos(a)-e[1]*Math.sin(a),u[1]=e[0]*Math.sin(a)+e[1]*Math.cos(a),u[2]=e[2],t[0]=u[0]+r[0],t[1]=u[1]+r[1],t[2]=u[2]+r[2],t}function V(t,n){var r=o(t[0],t[1],t[2]),a=o(n[0],n[1],n[2]);y(r,r),y(a,a);var e=w(r,a);return e>1?0:e<-1?Math.PI:Math.acos(e)}function z(t){return"vec3("+t[0]+", "+t[1]+", "+t[2]+")"}function F(t,n){return t[0]===n[0]&&t[1]===n[1]&&t[2]===n[2]}function Q(t,n){var r=t[0],a=t[1],e=t[2],u=n[0],o=n[1],i=n[2];return Math.abs(r-u)<=Z.EPSILON*Math.max(1,Math.abs(r),Math.abs(u))&&Math.abs(a-o)<=Z.EPSILON*Math.max(1,Math.abs(a),Math.abs(o))&&Math.abs(e-i)<=Z.EPSILON*Math.max(1,Math.abs(e),Math.abs(i))}Object.defineProperty(n,"__esModule",{value:!0}),n.forEach=n.sqrLen=n.len=n.sqrDist=n.dist=n.div=n.mul=n.sub=void 0,n.create=a,n.clone=e,n.length=u,n.fromValues=o,n.copy=i,n.set=s,n.add=c,n.subtract=f,n.multiply=M,n.divide=h,n.ceil=l,n.floor=v,n.min=d,n.max=b,n.round=m,n.scale=p,n.scaleAndAdd=P,n.distance=E,n.squaredDistance=O,n.squaredLength=x,n.negate=A,n.inverse=q,n.normalize=y,n.dot=w,n.cross=R,n.lerp=L,n.hermite=S,n.bezier=_,n.random=I,n.transformMat4=N,n.transformMat3=Y,n.transformQuat=g,n.rotateX=T,n.rotateY=j,n.rotateZ=D,n.angle=V,n.str=z,n.exactEquals=F,n.equals=Q;var X=r(0),Z=function(t){if(t&&t.__esModule)return t;var n={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r]);return n.default=t,n}(X);n.sub=f,n.mul=M,n.div=h,n.dist=E,n.sqrDist=O,n.len=u,n.sqrLen=x,n.forEach=function(){var t=a();return function(n,r,a,e,u,o){var i=void 0,s=void 0;for(r||(r=3),a||(a=0),s=e?Math.min(e*r+a,n.length):n.length,i=a;i<s;i+=r)t[0]=n[i],t[1]=n[i+1],t[2]=n[i+2],u(t,t,o),n[i]=t[0],n[i+1]=t[1],n[i+2]=t[2];return n}}()},function(t,n,r){"use strict";function a(){var t=new T.ARRAY_TYPE(4);return t[0]=0,t[1]=0,t[2]=0,t[3]=0,t}function e(t){var n=new T.ARRAY_TYPE(4);return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n}function u(t,n,r,a){var e=new T.ARRAY_TYPE(4);return e[0]=t,e[1]=n,e[2]=r,e[3]=a,e}function o(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t}function i(t,n,r,a,e){return t[0]=n,t[1]=r,t[2]=a,t[3]=e,t}function s(t,n,r){return t[0]=n[0]+r[0],t[1]=n[1]+r[1],t[2]=n[2]+r[2],t[3]=n[3]+r[3],t}function c(t,n,r){return t[0]=n[0]-r[0],t[1]=n[1]-r[1],t[2]=n[2]-r[2],t[3]=n[3]-r[3],t}function f(t,n,r){return t[0]=n[0]*r[0],t[1]=n[1]*r[1],t[2]=n[2]*r[2],t[3]=n[3]*r[3],t}function M(t,n,r){return t[0]=n[0]/r[0],t[1]=n[1]/r[1],t[2]=n[2]/r[2],t[3]=n[3]/r[3],t}function h(t,n){return t[0]=Math.ceil(n[0]),t[1]=Math.ceil(n[1]),t[2]=Math.ceil(n[2]),t[3]=Math.ceil(n[3]),t}function l(t,n){return t[0]=Math.floor(n[0]),t[1]=Math.floor(n[1]),t[2]=Math.floor(n[2]),t[3]=Math.floor(n[3]),t}function v(t,n,r){return t[0]=Math.min(n[0],r[0]),t[1]=Math.min(n[1],r[1]),t[2]=Math.min(n[2],r[2]),t[3]=Math.min(n[3],r[3]),t}function d(t,n,r){return t[0]=Math.max(n[0],r[0]),t[1]=Math.max(n[1],r[1]),t[2]=Math.max(n[2],r[2]),t[3]=Math.max(n[3],r[3]),t}function b(t,n){return t[0]=Math.round(n[0]),t[1]=Math.round(n[1]),t[2]=Math.round(n[2]),t[3]=Math.round(n[3]),t}function m(t,n,r){return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=n[3]*r,t}function p(t,n,r,a){return t[0]=n[0]+r[0]*a,t[1]=n[1]+r[1]*a,t[2]=n[2]+r[2]*a,t[3]=n[3]+r[3]*a,t}function P(t,n){var r=n[0]-t[0],a=n[1]-t[1],e=n[2]-t[2],u=n[3]-t[3];return Math.sqrt(r*r+a*a+e*e+u*u)}function E(t,n){var r=n[0]-t[0],a=n[1]-t[1],e=n[2]-t[2],u=n[3]-t[3];return r*r+a*a+e*e+u*u}function O(t){var n=t[0],r=t[1],a=t[2],e=t[3];return Math.sqrt(n*n+r*r+a*a+e*e)}function x(t){var n=t[0],r=t[1],a=t[2],e=t[3];return n*n+r*r+a*a+e*e}function A(t,n){return t[0]=-n[0],t[1]=-n[1],t[2]=-n[2],t[3]=-n[3],t}function q(t,n){return t[0]=1/n[0],t[1]=1/n[1],t[2]=1/n[2],t[3]=1/n[3],t}function y(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=r*r+a*a+e*e+u*u;return o>0&&(o=1/Math.sqrt(o),t[0]=r*o,t[1]=a*o,t[2]=e*o,t[3]=u*o),t}function w(t,n){return t[0]*n[0]+t[1]*n[1]+t[2]*n[2]+t[3]*n[3]}function R(t,n,r,a){var e=n[0],u=n[1],o=n[2],i=n[3];return t[0]=e+a*(r[0]-e),t[1]=u+a*(r[1]-u),t[2]=o+a*(r[2]-o),t[3]=i+a*(r[3]-i),t}function L(t,n){return n=n||1,t[0]=T.RANDOM(),t[1]=T.RANDOM(),t[2]=T.RANDOM(),t[3]=T.RANDOM(),y(t,t),m(t,t,n),t}function S(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3];return t[0]=r[0]*a+r[4]*e+r[8]*u+r[12]*o,t[1]=r[1]*a+r[5]*e+r[9]*u+r[13]*o,t[2]=r[2]*a+r[6]*e+r[10]*u+r[14]*o,t[3]=r[3]*a+r[7]*e+r[11]*u+r[15]*o,t}function _(t,n,r){var a=n[0],e=n[1],u=n[2],o=r[0],i=r[1],s=r[2],c=r[3],f=c*a+i*u-s*e,M=c*e+s*a-o*u,h=c*u+o*e-i*a,l=-o*a-i*e-s*u;return t[0]=f*c+l*-o+M*-s-h*-i,t[1]=M*c+l*-i+h*-o-f*-s,t[2]=h*c+l*-s+f*-i-M*-o,t[3]=n[3],t}function I(t){return"vec4("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"}function N(t,n){return t[0]===n[0]&&t[1]===n[1]&&t[2]===n[2]&&t[3]===n[3]}function Y(t,n){var r=t[0],a=t[1],e=t[2],u=t[3],o=n[0],i=n[1],s=n[2],c=n[3];return Math.abs(r-o)<=T.EPSILON*Math.max(1,Math.abs(r),Math.abs(o))&&Math.abs(a-i)<=T.EPSILON*Math.max(1,Math.abs(a),Math.abs(i))&&Math.abs(e-s)<=T.EPSILON*Math.max(1,Math.abs(e),Math.abs(s))&&Math.abs(u-c)<=T.EPSILON*Math.max(1,Math.abs(u),Math.abs(c))}Object.defineProperty(n,"__esModule",{value:!0}),n.forEach=n.sqrLen=n.len=n.sqrDist=n.dist=n.div=n.mul=n.sub=void 0,n.create=a,n.clone=e,n.fromValues=u,n.copy=o,n.set=i,n.add=s,n.subtract=c,n.multiply=f,n.divide=M,n.ceil=h,n.floor=l,n.min=v,n.max=d,n.round=b,n.scale=m,n.scaleAndAdd=p,n.distance=P,n.squaredDistance=E,n.length=O,n.squaredLength=x,n.negate=A,n.inverse=q,n.normalize=y,n.dot=w,n.lerp=R,n.random=L,n.transformMat4=S,n.transformQuat=_,n.str=I,n.exactEquals=N,n.equals=Y;var g=r(0),T=function(t){if(t&&t.__esModule)return t;var n={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r]);return n.default=t,n}(g);n.sub=c,n.mul=f,n.div=M,n.dist=P,n.sqrDist=E,n.len=O,n.sqrLen=x,n.forEach=function(){var t=a();return function(n,r,a,e,u,o){var i=void 0,s=void 0;for(r||(r=4),a||(a=0),s=e?Math.min(e*r+a,n.length):n.length,i=a;i<s;i+=r)t[0]=n[i],t[1]=n[i+1],t[2]=n[i+2],t[3]=n[i+3],u(t,t,o),n[i]=t[0],n[i+1]=t[1],n[i+2]=t[2],n[i+3]=t[3];return n}}()},function(t,n,r){"use strict";function a(t){if(t&&t.__esModule)return t;var n={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r]);return n.default=t,n}Object.defineProperty(n,"__esModule",{value:!0}),n.vec4=n.vec3=n.vec2=n.quat=n.mat4=n.mat3=n.mat2d=n.mat2=n.glMatrix=void 0;var e=r(0),u=a(e),o=r(5),i=a(o),s=r(6),c=a(s),f=r(1),M=a(f),h=r(7),l=a(h),v=r(8),d=a(v),b=r(9),m=a(b),p=r(2),P=a(p),E=r(3),O=a(E);n.glMatrix=u,n.mat2=i,n.mat2d=c,n.mat3=M,n.mat4=l,n.quat=d,n.vec2=m,n.vec3=P,n.vec4=O},function(t,n,r){"use strict";function a(){var t=new L.ARRAY_TYPE(4);return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t}function e(t){var n=new L.ARRAY_TYPE(4);return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n}function u(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t}function o(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t}function i(t,n,r,a){var e=new L.ARRAY_TYPE(4);return e[0]=t,e[1]=n,e[2]=r,e[3]=a,e}function s(t,n,r,a,e){return t[0]=n,t[1]=r,t[2]=a,t[3]=e,t}function c(t,n){if(t===n){var r=n[1];t[1]=n[2],t[2]=r}else t[0]=n[0],t[1]=n[2],t[2]=n[1],t[3]=n[3];return t}function f(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=r*u-e*a;return o?(o=1/o,t[0]=u*o,t[1]=-a*o,t[2]=-e*o,t[3]=r*o,t):null}function M(t,n){var r=n[0];return t[0]=n[3],t[1]=-n[1],t[2]=-n[2],t[3]=r,t}function h(t){return t[0]*t[3]-t[2]*t[1]}function l(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=r[0],s=r[1],c=r[2],f=r[3];return t[0]=a*i+u*s,t[1]=e*i+o*s,t[2]=a*c+u*f,t[3]=e*c+o*f,t}function v(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=Math.sin(r),s=Math.cos(r);return t[0]=a*s+u*i,t[1]=e*s+o*i,t[2]=a*-i+u*s,t[3]=e*-i+o*s,t}function d(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=r[0],s=r[1];return t[0]=a*i,t[1]=e*i,t[2]=u*s,t[3]=o*s,t}function b(t,n){var r=Math.sin(n),a=Math.cos(n);return t[0]=a,t[1]=r,t[2]=-r,t[3]=a,t}function m(t,n){return t[0]=n[0],t[1]=0,t[2]=0,t[3]=n[1],t}function p(t){return"mat2("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"}function P(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2))}function E(t,n,r,a){return t[2]=a[2]/a[0],r[0]=a[0],r[1]=a[1],r[3]=a[3]-t[2]*r[1],[t,n,r]}function O(t,n,r){return t[0]=n[0]+r[0],t[1]=n[1]+r[1],t[2]=n[2]+r[2],t[3]=n[3]+r[3],t}function x(t,n,r){return t[0]=n[0]-r[0],t[1]=n[1]-r[1],t[2]=n[2]-r[2],t[3]=n[3]-r[3],t}function A(t,n){return t[0]===n[0]&&t[1]===n[1]&&t[2]===n[2]&&t[3]===n[3]}function q(t,n){var r=t[0],a=t[1],e=t[2],u=t[3],o=n[0],i=n[1],s=n[2],c=n[3];return Math.abs(r-o)<=L.EPSILON*Math.max(1,Math.abs(r),Math.abs(o))&&Math.abs(a-i)<=L.EPSILON*Math.max(1,Math.abs(a),Math.abs(i))&&Math.abs(e-s)<=L.EPSILON*Math.max(1,Math.abs(e),Math.abs(s))&&Math.abs(u-c)<=L.EPSILON*Math.max(1,Math.abs(u),Math.abs(c))}function y(t,n,r){return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=n[3]*r,t}function w(t,n,r,a){return t[0]=n[0]+r[0]*a,t[1]=n[1]+r[1]*a,t[2]=n[2]+r[2]*a,t[3]=n[3]+r[3]*a,t}Object.defineProperty(n,"__esModule",{value:!0}),n.sub=n.mul=void 0,n.create=a,n.clone=e,n.copy=u,n.identity=o,n.fromValues=i,n.set=s,n.transpose=c,n.invert=f,n.adjoint=M,n.determinant=h,n.multiply=l,n.rotate=v,n.scale=d,n.fromRotation=b,n.fromScaling=m,n.str=p,n.frob=P,n.LDU=E,n.add=O,n.subtract=x,n.exactEquals=A,n.equals=q,n.multiplyScalar=y,n.multiplyScalarAndAdd=w;var R=r(0),L=function(t){if(t&&t.__esModule)return t;var n={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r]);return n.default=t,n}(R);n.mul=l,n.sub=x},function(t,n,r){"use strict";function a(){var t=new R.ARRAY_TYPE(6);return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=0,t[5]=0,t}function e(t){var n=new R.ARRAY_TYPE(6);return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n[4]=t[4],n[5]=t[5],n}function u(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t}function o(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=0,t[5]=0,t}function i(t,n,r,a,e,u){var o=new R.ARRAY_TYPE(6);return o[0]=t,o[1]=n,o[2]=r,o[3]=a,o[4]=e,o[5]=u,o}function s(t,n,r,a,e,u,o){return t[0]=n,t[1]=r,t[2]=a,t[3]=e,t[4]=u,t[5]=o,t}function c(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=n[4],i=n[5],s=r*u-a*e;return s?(s=1/s,t[0]=u*s,t[1]=-a*s,t[2]=-e*s,t[3]=r*s,t[4]=(e*i-u*o)*s,t[5]=(a*o-r*i)*s,t):null}function f(t){return t[0]*t[3]-t[1]*t[2]}function M(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=n[4],s=n[5],c=r[0],f=r[1],M=r[2],h=r[3],l=r[4],v=r[5];return t[0]=a*c+u*f,t[1]=e*c+o*f,t[2]=a*M+u*h,t[3]=e*M+o*h,t[4]=a*l+u*v+i,t[5]=e*l+o*v+s,t}function h(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=n[4],s=n[5],c=Math.sin(r),f=Math.cos(r);return t[0]=a*f+u*c,t[1]=e*f+o*c,t[2]=a*-c+u*f,t[3]=e*-c+o*f,t[4]=i,t[5]=s,t}function l(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=n[4],s=n[5],c=r[0],f=r[1];return t[0]=a*c,t[1]=e*c,t[2]=u*f,t[3]=o*f,t[4]=i,t[5]=s,t}function v(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=n[4],s=n[5],c=r[0],f=r[1];return t[0]=a,t[1]=e,t[2]=u,t[3]=o,t[4]=a*c+u*f+i,t[5]=e*c+o*f+s,t}function d(t,n){var r=Math.sin(n),a=Math.cos(n);return t[0]=a,t[1]=r,t[2]=-r,t[3]=a,t[4]=0,t[5]=0,t}function b(t,n){return t[0]=n[0],t[1]=0,t[2]=0,t[3]=n[1],t[4]=0,t[5]=0,t}function m(t,n){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=n[0],t[5]=n[1],t}function p(t){return"mat2d("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+")"}function P(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2)+Math.pow(t[4],2)+Math.pow(t[5],2)+1)}function E(t,n,r){return t[0]=n[0]+r[0],t[1]=n[1]+r[1],t[2]=n[2]+r[2],t[3]=n[3]+r[3],t[4]=n[4]+r[4],t[5]=n[5]+r[5],t}function O(t,n,r){return t[0]=n[0]-r[0],t[1]=n[1]-r[1],t[2]=n[2]-r[2],t[3]=n[3]-r[3],t[4]=n[4]-r[4],t[5]=n[5]-r[5],t}function x(t,n,r){return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=n[3]*r,t[4]=n[4]*r,t[5]=n[5]*r,t}function A(t,n,r,a){return t[0]=n[0]+r[0]*a,t[1]=n[1]+r[1]*a,t[2]=n[2]+r[2]*a,t[3]=n[3]+r[3]*a,t[4]=n[4]+r[4]*a,t[5]=n[5]+r[5]*a,t}function q(t,n){return t[0]===n[0]&&t[1]===n[1]&&t[2]===n[2]&&t[3]===n[3]&&t[4]===n[4]&&t[5]===n[5]}function y(t,n){var r=t[0],a=t[1],e=t[2],u=t[3],o=t[4],i=t[5],s=n[0],c=n[1],f=n[2],M=n[3],h=n[4],l=n[5];return Math.abs(r-s)<=R.EPSILON*Math.max(1,Math.abs(r),Math.abs(s))&&Math.abs(a-c)<=R.EPSILON*Math.max(1,Math.abs(a),Math.abs(c))&&Math.abs(e-f)<=R.EPSILON*Math.max(1,Math.abs(e),Math.abs(f))&&Math.abs(u-M)<=R.EPSILON*Math.max(1,Math.abs(u),Math.abs(M))&&Math.abs(o-h)<=R.EPSILON*Math.max(1,Math.abs(o),Math.abs(h))&&Math.abs(i-l)<=R.EPSILON*Math.max(1,Math.abs(i),Math.abs(l))}Object.defineProperty(n,"__esModule",{value:!0}),n.sub=n.mul=void 0,n.create=a,n.clone=e,n.copy=u,n.identity=o,n.fromValues=i,n.set=s,n.invert=c,n.determinant=f,n.multiply=M,n.rotate=h,n.scale=l,n.translate=v,n.fromRotation=d,n.fromScaling=b,n.fromTranslation=m,n.str=p,n.frob=P,n.add=E,n.subtract=O,n.multiplyScalar=x,n.multiplyScalarAndAdd=A,n.exactEquals=q,n.equals=y;var w=r(0),R=function(t){if(t&&t.__esModule)return t;var n={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r]);return n.default=t,n}(w);n.mul=M,n.sub=O},function(t,n,r){"use strict";function a(){var t=new C.ARRAY_TYPE(16);return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function e(t){var n=new C.ARRAY_TYPE(16);return n[0]=t[0],n[1]=t[1],n[2]=t[2],n[3]=t[3],n[4]=t[4],n[5]=t[5],n[6]=t[6],n[7]=t[7],n[8]=t[8],n[9]=t[9],n[10]=t[10],n[11]=t[11],n[12]=t[12],n[13]=t[13],n[14]=t[14],n[15]=t[15],n}function u(t,n){return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],t}function o(t,n,r,a,e,u,o,i,s,c,f,M,h,l,v,d){var b=new C.ARRAY_TYPE(16);return b[0]=t,b[1]=n,b[2]=r,b[3]=a,b[4]=e,b[5]=u,b[6]=o,b[7]=i,b[8]=s,b[9]=c,b[10]=f,b[11]=M,b[12]=h,b[13]=l,b[14]=v,b[15]=d,b}function i(t,n,r,a,e,u,o,i,s,c,f,M,h,l,v,d,b){return t[0]=n,t[1]=r,t[2]=a,t[3]=e,t[4]=u,t[5]=o,t[6]=i,t[7]=s,t[8]=c,t[9]=f,t[10]=M,t[11]=h,t[12]=l,t[13]=v,t[14]=d,t[15]=b,t}function s(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function c(t,n){if(t===n){var r=n[1],a=n[2],e=n[3],u=n[6],o=n[7],i=n[11];t[1]=n[4],t[2]=n[8],t[3]=n[12],t[4]=r,t[6]=n[9],t[7]=n[13],t[8]=a,t[9]=u,t[11]=n[14],t[12]=e,t[13]=o,t[14]=i}else t[0]=n[0],t[1]=n[4],t[2]=n[8],t[3]=n[12],t[4]=n[1],t[5]=n[5],t[6]=n[9],t[7]=n[13],t[8]=n[2],t[9]=n[6],t[10]=n[10],t[11]=n[14],t[12]=n[3],t[13]=n[7],t[14]=n[11],t[15]=n[15];return t}function f(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=n[4],i=n[5],s=n[6],c=n[7],f=n[8],M=n[9],h=n[10],l=n[11],v=n[12],d=n[13],b=n[14],m=n[15],p=r*i-a*o,P=r*s-e*o,E=r*c-u*o,O=a*s-e*i,x=a*c-u*i,A=e*c-u*s,q=f*d-M*v,y=f*b-h*v,w=f*m-l*v,R=M*b-h*d,L=M*m-l*d,S=h*m-l*b,_=p*S-P*L+E*R+O*w-x*y+A*q;return _?(_=1/_,t[0]=(i*S-s*L+c*R)*_,t[1]=(e*L-a*S-u*R)*_,t[2]=(d*A-b*x+m*O)*_,t[3]=(h*x-M*A-l*O)*_,t[4]=(s*w-o*S-c*y)*_,t[5]=(r*S-e*w+u*y)*_,t[6]=(b*E-v*A-m*P)*_,t[7]=(f*A-h*E+l*P)*_,t[8]=(o*L-i*w+c*q)*_,t[9]=(a*w-r*L-u*q)*_,t[10]=(v*x-d*E+m*p)*_,t[11]=(M*E-f*x-l*p)*_,t[12]=(i*y-o*R-s*q)*_,t[13]=(r*R-a*y+e*q)*_,t[14]=(d*P-v*O-b*p)*_,t[15]=(f*O-M*P+h*p)*_,t):null}function M(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=n[4],i=n[5],s=n[6],c=n[7],f=n[8],M=n[9],h=n[10],l=n[11],v=n[12],d=n[13],b=n[14],m=n[15];return t[0]=i*(h*m-l*b)-M*(s*m-c*b)+d*(s*l-c*h),t[1]=-(a*(h*m-l*b)-M*(e*m-u*b)+d*(e*l-u*h)),t[2]=a*(s*m-c*b)-i*(e*m-u*b)+d*(e*c-u*s),t[3]=-(a*(s*l-c*h)-i*(e*l-u*h)+M*(e*c-u*s)),t[4]=-(o*(h*m-l*b)-f*(s*m-c*b)+v*(s*l-c*h)),t[5]=r*(h*m-l*b)-f*(e*m-u*b)+v*(e*l-u*h),t[6]=-(r*(s*m-c*b)-o*(e*m-u*b)+v*(e*c-u*s)),t[7]=r*(s*l-c*h)-o*(e*l-u*h)+f*(e*c-u*s),t[8]=o*(M*m-l*d)-f*(i*m-c*d)+v*(i*l-c*M),t[9]=-(r*(M*m-l*d)-f*(a*m-u*d)+v*(a*l-u*M)),t[10]=r*(i*m-c*d)-o*(a*m-u*d)+v*(a*c-u*i),t[11]=-(r*(i*l-c*M)-o*(a*l-u*M)+f*(a*c-u*i)),t[12]=-(o*(M*b-h*d)-f*(i*b-s*d)+v*(i*h-s*M)),t[13]=r*(M*b-h*d)-f*(a*b-e*d)+v*(a*h-e*M),t[14]=-(r*(i*b-s*d)-o*(a*b-e*d)+v*(a*s-e*i)),t[15]=r*(i*h-s*M)-o*(a*h-e*M)+f*(a*s-e*i),t}function h(t){var n=t[0],r=t[1],a=t[2],e=t[3],u=t[4],o=t[5],i=t[6],s=t[7],c=t[8],f=t[9],M=t[10],h=t[11],l=t[12],v=t[13],d=t[14],b=t[15];return(n*o-r*u)*(M*b-h*d)-(n*i-a*u)*(f*b-h*v)+(n*s-e*u)*(f*d-M*v)+(r*i-a*o)*(c*b-h*l)-(r*s-e*o)*(c*d-M*l)+(a*s-e*i)*(c*v-f*l)}function l(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=n[4],s=n[5],c=n[6],f=n[7],M=n[8],h=n[9],l=n[10],v=n[11],d=n[12],b=n[13],m=n[14],p=n[15],P=r[0],E=r[1],O=r[2],x=r[3];return t[0]=P*a+E*i+O*M+x*d,t[1]=P*e+E*s+O*h+x*b,t[2]=P*u+E*c+O*l+x*m,t[3]=P*o+E*f+O*v+x*p,P=r[4],E=r[5],O=r[6],x=r[7],t[4]=P*a+E*i+O*M+x*d,t[5]=P*e+E*s+O*h+x*b,t[6]=P*u+E*c+O*l+x*m,t[7]=P*o+E*f+O*v+x*p,P=r[8],E=r[9],O=r[10],x=r[11],t[8]=P*a+E*i+O*M+x*d,t[9]=P*e+E*s+O*h+x*b,t[10]=P*u+E*c+O*l+x*m,t[11]=P*o+E*f+O*v+x*p,P=r[12],E=r[13],O=r[14],x=r[15],t[12]=P*a+E*i+O*M+x*d,t[13]=P*e+E*s+O*h+x*b,t[14]=P*u+E*c+O*l+x*m,t[15]=P*o+E*f+O*v+x*p,t}function v(t,n,r){var a=r[0],e=r[1],u=r[2],o=void 0,i=void 0,s=void 0,c=void 0,f=void 0,M=void 0,h=void 0,l=void 0,v=void 0,d=void 0,b=void 0,m=void 0;return n===t?(t[12]=n[0]*a+n[4]*e+n[8]*u+n[12],t[13]=n[1]*a+n[5]*e+n[9]*u+n[13],t[14]=n[2]*a+n[6]*e+n[10]*u+n[14],t[15]=n[3]*a+n[7]*e+n[11]*u+n[15]):(o=n[0],i=n[1],s=n[2],c=n[3],f=n[4],M=n[5],h=n[6],l=n[7],v=n[8],d=n[9],b=n[10],m=n[11],t[0]=o,t[1]=i,t[2]=s,t[3]=c,t[4]=f,t[5]=M,t[6]=h,t[7]=l,t[8]=v,t[9]=d,t[10]=b,t[11]=m,t[12]=o*a+f*e+v*u+n[12],t[13]=i*a+M*e+d*u+n[13],t[14]=s*a+h*e+b*u+n[14],t[15]=c*a+l*e+m*u+n[15]),t}function d(t,n,r){var a=r[0],e=r[1],u=r[2];return t[0]=n[0]*a,t[1]=n[1]*a,t[2]=n[2]*a,t[3]=n[3]*a,t[4]=n[4]*e,t[5]=n[5]*e,t[6]=n[6]*e,t[7]=n[7]*e,t[8]=n[8]*u,t[9]=n[9]*u,t[10]=n[10]*u,t[11]=n[11]*u,t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],t}function b(t,n,r,a){var e=a[0],u=a[1],o=a[2],i=Math.sqrt(e*e+u*u+o*o),s=void 0,c=void 0,f=void 0,M=void 0,h=void 0,l=void 0,v=void 0,d=void 0,b=void 0,m=void 0,p=void 0,P=void 0,E=void 0,O=void 0,x=void 0,A=void 0,q=void 0,y=void 0,w=void 0,R=void 0,L=void 0,S=void 0,_=void 0,I=void 0;return Math.abs(i)<C.EPSILON?null:(i=1/i,e*=i,u*=i,o*=i,s=Math.sin(r),c=Math.cos(r),f=1-c,M=n[0],h=n[1],l=n[2],v=n[3],d=n[4],b=n[5],m=n[6],p=n[7],P=n[8],E=n[9],O=n[10],x=n[11],A=e*e*f+c,q=u*e*f+o*s,y=o*e*f-u*s,w=e*u*f-o*s,R=u*u*f+c,L=o*u*f+e*s,S=e*o*f+u*s,_=u*o*f-e*s,I=o*o*f+c,t[0]=M*A+d*q+P*y,t[1]=h*A+b*q+E*y,t[2]=l*A+m*q+O*y,t[3]=v*A+p*q+x*y,t[4]=M*w+d*R+P*L,t[5]=h*w+b*R+E*L,t[6]=l*w+m*R+O*L,t[7]=v*w+p*R+x*L,t[8]=M*S+d*_+P*I,t[9]=h*S+b*_+E*I,t[10]=l*S+m*_+O*I,t[11]=v*S+p*_+x*I,n!==t&&(t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15]),t)}function m(t,n,r){var a=Math.sin(r),e=Math.cos(r),u=n[4],o=n[5],i=n[6],s=n[7],c=n[8],f=n[9],M=n[10],h=n[11];return n!==t&&(t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15]),t[4]=u*e+c*a,t[5]=o*e+f*a,t[6]=i*e+M*a,t[7]=s*e+h*a,t[8]=c*e-u*a,t[9]=f*e-o*a,t[10]=M*e-i*a,t[11]=h*e-s*a,t}function p(t,n,r){var a=Math.sin(r),e=Math.cos(r),u=n[0],o=n[1],i=n[2],s=n[3],c=n[8],f=n[9],M=n[10],h=n[11];return n!==t&&(t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15]),t[0]=u*e-c*a,t[1]=o*e-f*a,t[2]=i*e-M*a,t[3]=s*e-h*a,t[8]=u*a+c*e,t[9]=o*a+f*e,t[10]=i*a+M*e,t[11]=s*a+h*e,t}function P(t,n,r){var a=Math.sin(r),e=Math.cos(r),u=n[0],o=n[1],i=n[2],s=n[3],c=n[4],f=n[5],M=n[6],h=n[7];return n!==t&&(t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15]),t[0]=u*e+c*a,t[1]=o*e+f*a,t[2]=i*e+M*a,t[3]=s*e+h*a,t[4]=c*e-u*a,t[5]=f*e-o*a,t[6]=M*e-i*a,t[7]=h*e-s*a,t}function E(t,n){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=n[0],t[13]=n[1],t[14]=n[2],t[15]=1,t}function O(t,n){return t[0]=n[0],t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=n[1],t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=n[2],t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function x(t,n,r){var a=r[0],e=r[1],u=r[2],o=Math.sqrt(a*a+e*e+u*u),i=void 0,s=void 0,c=void 0;return Math.abs(o)<C.EPSILON?null:(o=1/o,a*=o,e*=o,u*=o,i=Math.sin(n),s=Math.cos(n),c=1-s,t[0]=a*a*c+s,t[1]=e*a*c+u*i,t[2]=u*a*c-e*i,t[3]=0,t[4]=a*e*c-u*i,t[5]=e*e*c+s,t[6]=u*e*c+a*i,t[7]=0,t[8]=a*u*c+e*i,t[9]=e*u*c-a*i,t[10]=u*u*c+s,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t)}function A(t,n){var r=Math.sin(n),a=Math.cos(n);return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=a,t[6]=r,t[7]=0,t[8]=0,t[9]=-r,t[10]=a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function q(t,n){var r=Math.sin(n),a=Math.cos(n);return t[0]=a,t[1]=0,t[2]=-r,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=r,t[9]=0,t[10]=a,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function y(t,n){var r=Math.sin(n),a=Math.cos(n);return t[0]=a,t[1]=r,t[2]=0,t[3]=0,t[4]=-r,t[5]=a,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function w(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=a+a,s=e+e,c=u+u,f=a*i,M=a*s,h=a*c,l=e*s,v=e*c,d=u*c,b=o*i,m=o*s,p=o*c;return t[0]=1-(l+d),t[1]=M+p,t[2]=h-m,t[3]=0,t[4]=M-p,t[5]=1-(f+d),t[6]=v+b,t[7]=0,t[8]=h+m,t[9]=v-b,t[10]=1-(f+l),t[11]=0,t[12]=r[0],t[13]=r[1],t[14]=r[2],t[15]=1,t}function R(t,n){return t[0]=n[12],t[1]=n[13],t[2]=n[14],t}function L(t,n){var r=n[0],a=n[1],e=n[2],u=n[4],o=n[5],i=n[6],s=n[8],c=n[9],f=n[10];return t[0]=Math.sqrt(r*r+a*a+e*e),t[1]=Math.sqrt(u*u+o*o+i*i),t[2]=Math.sqrt(s*s+c*c+f*f),t}function S(t,n){var r=n[0]+n[5]+n[10],a=0;return r>0?(a=2*Math.sqrt(r+1),t[3]=.25*a,t[0]=(n[6]-n[9])/a,t[1]=(n[8]-n[2])/a,t[2]=(n[1]-n[4])/a):n[0]>n[5]&n[0]>n[10]?(a=2*Math.sqrt(1+n[0]-n[5]-n[10]),t[3]=(n[6]-n[9])/a,t[0]=.25*a,t[1]=(n[1]+n[4])/a,t[2]=(n[8]+n[2])/a):n[5]>n[10]?(a=2*Math.sqrt(1+n[5]-n[0]-n[10]),t[3]=(n[8]-n[2])/a,t[0]=(n[1]+n[4])/a,t[1]=.25*a,t[2]=(n[6]+n[9])/a):(a=2*Math.sqrt(1+n[10]-n[0]-n[5]),t[3]=(n[1]-n[4])/a,t[0]=(n[8]+n[2])/a,t[1]=(n[6]+n[9])/a,t[2]=.25*a),t}function _(t,n,r,a){var e=n[0],u=n[1],o=n[2],i=n[3],s=e+e,c=u+u,f=o+o,M=e*s,h=e*c,l=e*f,v=u*c,d=u*f,b=o*f,m=i*s,p=i*c,P=i*f,E=a[0],O=a[1],x=a[2];return t[0]=(1-(v+b))*E,t[1]=(h+P)*E,t[2]=(l-p)*E,t[3]=0,t[4]=(h-P)*O,t[5]=(1-(M+b))*O,t[6]=(d+m)*O,t[7]=0,t[8]=(l+p)*x,t[9]=(d-m)*x,t[10]=(1-(M+v))*x,t[11]=0,t[12]=r[0],t[13]=r[1],t[14]=r[2],t[15]=1,t}function I(t,n,r,a,e){var u=n[0],o=n[1],i=n[2],s=n[3],c=u+u,f=o+o,M=i+i,h=u*c,l=u*f,v=u*M,d=o*f,b=o*M,m=i*M,p=s*c,P=s*f,E=s*M,O=a[0],x=a[1],A=a[2],q=e[0],y=e[1],w=e[2];return t[0]=(1-(d+m))*O,t[1]=(l+E)*O,t[2]=(v-P)*O,t[3]=0,t[4]=(l-E)*x,t[5]=(1-(h+m))*x,t[6]=(b+p)*x,t[7]=0,t[8]=(v+P)*A,t[9]=(b-p)*A,t[10]=(1-(h+d))*A,t[11]=0,t[12]=r[0]+q-(t[0]*q+t[4]*y+t[8]*w),t[13]=r[1]+y-(t[1]*q+t[5]*y+t[9]*w),t[14]=r[2]+w-(t[2]*q+t[6]*y+t[10]*w),t[15]=1,t}function N(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=r+r,i=a+a,s=e+e,c=r*o,f=a*o,M=a*i,h=e*o,l=e*i,v=e*s,d=u*o,b=u*i,m=u*s;return t[0]=1-M-v,t[1]=f+m,t[2]=h-b,t[3]=0,t[4]=f-m,t[5]=1-c-v,t[6]=l+d,t[7]=0,t[8]=h+b,t[9]=l-d,t[10]=1-c-M,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t}function Y(t,n,r,a,e,u,o){var i=1/(r-n),s=1/(e-a),c=1/(u-o);return t[0]=2*u*i,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=2*u*s,t[6]=0,t[7]=0,t[8]=(r+n)*i,t[9]=(e+a)*s,t[10]=(o+u)*c,t[11]=-1,t[12]=0,t[13]=0,t[14]=o*u*2*c,t[15]=0,t}function g(t,n,r,a,e){var u=1/Math.tan(n/2),o=1/(a-e);return t[0]=u/r,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=u,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=(e+a)*o,t[11]=-1,t[12]=0,t[13]=0,t[14]=2*e*a*o,t[15]=0,t}function T(t,n,r,a){var e=Math.tan(n.upDegrees*Math.PI/180),u=Math.tan(n.downDegrees*Math.PI/180),o=Math.tan(n.leftDegrees*Math.PI/180),i=Math.tan(n.rightDegrees*Math.PI/180),s=2/(o+i),c=2/(e+u);return t[0]=s,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=c,t[6]=0,t[7]=0,t[8]=-(o-i)*s*.5,t[9]=(e-u)*c*.5,t[10]=a/(r-a),t[11]=-1,t[12]=0,t[13]=0,t[14]=a*r/(r-a),t[15]=0,t}function j(t,n,r,a,e,u,o){var i=1/(n-r),s=1/(a-e),c=1/(u-o);return t[0]=-2*i,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=-2*s,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=2*c,t[11]=0,t[12]=(n+r)*i,t[13]=(e+a)*s,t[14]=(o+u)*c,t[15]=1,t}function D(t,n,r,a){var e=void 0,u=void 0,o=void 0,i=void 0,s=void 0,c=void 0,f=void 0,M=void 0,h=void 0,l=void 0,v=n[0],d=n[1],b=n[2],m=a[0],p=a[1],P=a[2],E=r[0],O=r[1],x=r[2];return Math.abs(v-E)<C.EPSILON&&Math.abs(d-O)<C.EPSILON&&Math.abs(b-x)<C.EPSILON?mat4.identity(t):(f=v-E,M=d-O,h=b-x,l=1/Math.sqrt(f*f+M*M+h*h),f*=l,M*=l,h*=l,e=p*h-P*M,u=P*f-m*h,o=m*M-p*f,l=Math.sqrt(e*e+u*u+o*o),l?(l=1/l,e*=l,u*=l,o*=l):(e=0,u=0,o=0),i=M*o-h*u,s=h*e-f*o,c=f*u-M*e,l=Math.sqrt(i*i+s*s+c*c),l?(l=1/l,i*=l,s*=l,c*=l):(i=0,s=0,c=0),t[0]=e,t[1]=i,t[2]=f,t[3]=0,t[4]=u,t[5]=s,t[6]=M,t[7]=0,t[8]=o,t[9]=c,t[10]=h,t[11]=0,t[12]=-(e*v+u*d+o*b),t[13]=-(i*v+s*d+c*b),t[14]=-(f*v+M*d+h*b),t[15]=1,t)}function V(t,n,r,a){var e=n[0],u=n[1],o=n[2],i=a[0],s=a[1],c=a[2],f=e-r[0],M=u-r[1],h=o-r[2],l=f*f+M*M+h*h;l>0&&(l=1/Math.sqrt(l),f*=l,M*=l,h*=l);var v=s*h-c*M,d=c*f-i*h,b=i*M-s*f;return t[0]=v,t[1]=d,t[2]=b,t[3]=0,t[4]=M*b-h*d,t[5]=h*v-f*b,t[6]=f*d-M*v,t[7]=0,t[8]=f,t[9]=M,t[10]=h,t[11]=0,t[12]=e,t[13]=u,t[14]=o,t[15]=1,t}function z(t){return"mat4("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+", "+t[6]+", "+t[7]+", "+t[8]+", "+t[9]+", "+t[10]+", "+t[11]+", "+t[12]+", "+t[13]+", "+t[14]+", "+t[15]+")"}function F(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2)+Math.pow(t[4],2)+Math.pow(t[5],2)+Math.pow(t[6],2)+Math.pow(t[7],2)+Math.pow(t[8],2)+Math.pow(t[9],2)+Math.pow(t[10],2)+Math.pow(t[11],2)+Math.pow(t[12],2)+Math.pow(t[13],2)+Math.pow(t[14],2)+Math.pow(t[15],2))}function Q(t,n,r){return t[0]=n[0]+r[0],t[1]=n[1]+r[1],t[2]=n[2]+r[2],t[3]=n[3]+r[3],t[4]=n[4]+r[4],t[5]=n[5]+r[5],t[6]=n[6]+r[6],t[7]=n[7]+r[7],t[8]=n[8]+r[8],t[9]=n[9]+r[9],t[10]=n[10]+r[10],t[11]=n[11]+r[11],t[12]=n[12]+r[12],t[13]=n[13]+r[13],t[14]=n[14]+r[14],t[15]=n[15]+r[15],t}function X(t,n,r){return t[0]=n[0]-r[0],t[1]=n[1]-r[1],t[2]=n[2]-r[2],t[3]=n[3]-r[3],t[4]=n[4]-r[4],t[5]=n[5]-r[5],t[6]=n[6]-r[6],t[7]=n[7]-r[7],t[8]=n[8]-r[8],t[9]=n[9]-r[9],t[10]=n[10]-r[10],t[11]=n[11]-r[11],t[12]=n[12]-r[12],t[13]=n[13]-r[13],t[14]=n[14]-r[14],t[15]=n[15]-r[15],t}function Z(t,n,r){return t[0]=n[0]*r,t[1]=n[1]*r,t[2]=n[2]*r,t[3]=n[3]*r,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=n[7]*r,t[8]=n[8]*r,t[9]=n[9]*r,t[10]=n[10]*r,t[11]=n[11]*r,t[12]=n[12]*r,t[13]=n[13]*r,t[14]=n[14]*r,t[15]=n[15]*r,t}function k(t,n,r,a){return t[0]=n[0]+r[0]*a,t[1]=n[1]+r[1]*a,t[2]=n[2]+r[2]*a,t[3]=n[3]+r[3]*a,t[4]=n[4]+r[4]*a,t[5]=n[5]+r[5]*a,t[6]=n[6]+r[6]*a,t[7]=n[7]+r[7]*a,t[8]=n[8]+r[8]*a,t[9]=n[9]+r[9]*a,t[10]=n[10]+r[10]*a,t[11]=n[11]+r[11]*a,t[12]=n[12]+r[12]*a,t[13]=n[13]+r[13]*a,t[14]=n[14]+r[14]*a,t[15]=n[15]+r[15]*a,t}function U(t,n){return t[0]===n[0]&&t[1]===n[1]&&t[2]===n[2]&&t[3]===n[3]&&t[4]===n[4]&&t[5]===n[5]&&t[6]===n[6]&&t[7]===n[7]&&t[8]===n[8]&&t[9]===n[9]&&t[10]===n[10]&&t[11]===n[11]&&t[12]===n[12]&&t[13]===n[13]&&t[14]===n[14]&&t[15]===n[15]}function W(t,n){var r=t[0],a=t[1],e=t[2],u=t[3],o=t[4],i=t[5],s=t[6],c=t[7],f=t[8],M=t[9],h=t[10],l=t[11],v=t[12],d=t[13],b=t[14],m=t[15],p=n[0],P=n[1],E=n[2],O=n[3],x=n[4],A=n[5],q=n[6],y=n[7],w=n[8],R=n[9],L=n[10],S=n[11],_=n[12],I=n[13],N=n[14],Y=n[15];return Math.abs(r-p)<=C.EPSILON*Math.max(1,Math.abs(r),Math.abs(p))&&Math.abs(a-P)<=C.EPSILON*Math.max(1,Math.abs(a),Math.abs(P))&&Math.abs(e-E)<=C.EPSILON*Math.max(1,Math.abs(e),Math.abs(E))&&Math.abs(u-O)<=C.EPSILON*Math.max(1,Math.abs(u),Math.abs(O))&&Math.abs(o-x)<=C.EPSILON*Math.max(1,Math.abs(o),Math.abs(x))&&Math.abs(i-A)<=C.EPSILON*Math.max(1,Math.abs(i),Math.abs(A))&&Math.abs(s-q)<=C.EPSILON*Math.max(1,Math.abs(s),Math.abs(q))&&Math.abs(c-y)<=C.EPSILON*Math.max(1,Math.abs(c),Math.abs(y))&&Math.abs(f-w)<=C.EPSILON*Math.max(1,Math.abs(f),Math.abs(w))&&Math.abs(M-R)<=C.EPSILON*Math.max(1,Math.abs(M),Math.abs(R))&&Math.abs(h-L)<=C.EPSILON*Math.max(1,Math.abs(h),Math.abs(L))&&Math.abs(l-S)<=C.EPSILON*Math.max(1,Math.abs(l),Math.abs(S))&&Math.abs(v-_)<=C.EPSILON*Math.max(1,Math.abs(v),Math.abs(_))&&Math.abs(d-I)<=C.EPSILON*Math.max(1,Math.abs(d),Math.abs(I))&&Math.abs(b-N)<=C.EPSILON*Math.max(1,Math.abs(b),Math.abs(N))&&Math.abs(m-Y)<=C.EPSILON*Math.max(1,Math.abs(m),Math.abs(Y))}Object.defineProperty(n,"__esModule",{value:!0}),n.sub=n.mul=void 0,n.create=a,n.clone=e,n.copy=u,n.fromValues=o,n.set=i,n.identity=s,n.transpose=c,n.invert=f,n.adjoint=M,n.determinant=h,n.multiply=l,n.translate=v,n.scale=d,n.rotate=b,n.rotateX=m,n.rotateY=p,n.rotateZ=P,n.fromTranslation=E,n.fromScaling=O,n.fromRotation=x,n.fromXRotation=A,n.fromYRotation=q,n.fromZRotation=y,n.fromRotationTranslation=w,n.getTranslation=R,n.getScaling=L,n.getRotation=S,n.fromRotationTranslationScale=_,n.fromRotationTranslationScaleOrigin=I,n.fromQuat=N,n.frustum=Y,n.perspective=g,n.perspectiveFromFieldOfView=T,n.ortho=j,n.lookAt=D,n.targetTo=V,n.str=z,n.frob=F,n.add=Q,n.subtract=X,n.multiplyScalar=Z,n.multiplyScalarAndAdd=k,n.exactEquals=U,n.equals=W;var B=r(0),C=function(t){if(t&&t.__esModule)return t;var n={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r]);return n.default=t,n}(B);n.mul=l,n.sub=X},function(t,n,r){"use strict";function a(t){if(t&&t.__esModule)return t;var n={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r]);return n.default=t,n}function e(){var t=new E.ARRAY_TYPE(4);return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t}function u(t){return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t}function o(t,n,r){r*=.5;var a=Math.sin(r);return t[0]=a*n[0],t[1]=a*n[1],t[2]=a*n[2],t[3]=Math.cos(r),t}function i(t,n){var r=2*Math.acos(n[3]),a=Math.sin(r/2);return 0!=a?(t[0]=n[0]/a,t[1]=n[1]/a,t[2]=n[2]/a):(t[0]=1,t[1]=0,t[2]=0),r}function s(t,n,r){var a=n[0],e=n[1],u=n[2],o=n[3],i=r[0],s=r[1],c=r[2],f=r[3];return t[0]=a*f+o*i+e*c-u*s,t[1]=e*f+o*s+u*i-a*c,t[2]=u*f+o*c+a*s-e*i,t[3]=o*f-a*i-e*s-u*c,t}function c(t,n,r){r*=.5;var a=n[0],e=n[1],u=n[2],o=n[3],i=Math.sin(r),s=Math.cos(r);return t[0]=a*s+o*i,t[1]=e*s+u*i,t[2]=u*s-e*i,t[3]=o*s-a*i,t}function f(t,n,r){r*=.5;var a=n[0],e=n[1],u=n[2],o=n[3],i=Math.sin(r),s=Math.cos(r);return t[0]=a*s-u*i,t[1]=e*s+o*i,t[2]=u*s+a*i,t[3]=o*s-e*i,t}function M(t,n,r){r*=.5;var a=n[0],e=n[1],u=n[2],o=n[3],i=Math.sin(r),s=Math.cos(r);return t[0]=a*s+e*i,t[1]=e*s-a*i,t[2]=u*s+o*i,t[3]=o*s-u*i,t}function h(t,n){var r=n[0],a=n[1],e=n[2];return t[0]=r,t[1]=a,t[2]=e,t[3]=Math.sqrt(Math.abs(1-r*r-a*a-e*e)),t}function l(t,n,r,a){var e=n[0],u=n[1],o=n[2],i=n[3],s=r[0],c=r[1],f=r[2],M=r[3],h=void 0,l=void 0,v=void 0,d=void 0,b=void 0;return l=e*s+u*c+o*f+i*M,l<0&&(l=-l,s=-s,c=-c,f=-f,M=-M),1-l>1e-6?(h=Math.acos(l),v=Math.sin(h),d=Math.sin((1-a)*h)/v,b=Math.sin(a*h)/v):(d=1-a,b=a),t[0]=d*e+b*s,t[1]=d*u+b*c,t[2]=d*o+b*f,t[3]=d*i+b*M,t}function v(t,n){var r=n[0],a=n[1],e=n[2],u=n[3],o=r*r+a*a+e*e+u*u,i=o?1/o:0;return t[0]=-r*i,t[1]=-a*i,t[2]=-e*i,t[3]=u*i,t}function d(t,n){return t[0]=-n[0],t[1]=-n[1],t[2]=-n[2],t[3]=n[3],t}function b(t,n){var r=n[0]+n[4]+n[8],a=void 0;if(r>0)a=Math.sqrt(r+1),t[3]=.5*a,a=.5/a,t[0]=(n[5]-n[7])*a,t[1]=(n[6]-n[2])*a,t[2]=(n[1]-n[3])*a;else{var e=0;n[4]>n[0]&&(e=1),n[8]>n[3*e+e]&&(e=2);var u=(e+1)%3,o=(e+2)%3;a=Math.sqrt(n[3*e+e]-n[3*u+u]-n[3*o+o]+1),t[e]=.5*a,a=.5/a,t[3]=(n[3*u+o]-n[3*o+u])*a,t[u]=(n[3*u+e]+n[3*e+u])*a,t[o]=(n[3*o+e]+n[3*e+o])*a}return t}function m(t,n,r,a){var e=.5*Math.PI/180;n*=e,r*=e,a*=e;var u=Math.sin(n),o=Math.cos(n),i=Math.sin(r),s=Math.cos(r),c=Math.sin(a),f=Math.cos(a);return t[0]=u*s*f-o*i*c,t[1]=o*i*f+u*s*c,t[2]=o*s*c-u*i*f,t[3]=o*s*f+u*i*c,t}function p(t){return"quat("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"}Object.defineProperty(n,"__esModule",{value:!0}),n.setAxes=n.sqlerp=n.rotationTo=n.equals=n.exactEquals=n.normalize=n.sqrLen=n.squaredLength=n.len=n.length=n.lerp=n.dot=n.scale=n.mul=n.add=n.set=n.copy=n.fromValues=n.clone=void 0,n.create=e,n.identity=u,n.setAxisAngle=o,n.getAxisAngle=i,n.multiply=s,n.rotateX=c,n.rotateY=f,n.rotateZ=M,n.calculateW=h,n.slerp=l,n.invert=v,n.conjugate=d,n.fromMat3=b,n.fromEuler=m,n.str=p;var P=r(0),E=a(P),O=r(1),x=a(O),A=r(2),q=a(A),y=r(3),w=a(y),R=(n.clone=w.clone,n.fromValues=w.fromValues,n.copy=w.copy,n.set=w.set,n.add=w.add,n.mul=s,n.scale=w.scale,n.dot=w.dot,n.lerp=w.lerp,n.length=w.length),L=(n.len=R,n.squaredLength=w.squaredLength),S=(n.sqrLen=L,n.normalize=w.normalize);n.exactEquals=w.exactEquals,n.equals=w.equals,n.rotationTo=function(){var t=q.create(),n=q.fromValues(1,0,0),r=q.fromValues(0,1,0);return function(a,e,u){var i=q.dot(e,u);return i<-.999999?(q.cross(t,n,e),q.len(t)<1e-6&&q.cross(t,r,e),q.normalize(t,t),o(a,t,Math.PI),a):i>.999999?(a[0]=0,a[1]=0,a[2]=0,a[3]=1,a):(q.cross(t,e,u),a[0]=t[0],a[1]=t[1],a[2]=t[2],a[3]=1+i,S(a,a))}}(),n.sqlerp=function(){var t=e(),n=e();return function(r,a,e,u,o,i){return l(t,a,o,i),l(n,e,u,i),l(r,t,n,2*i*(1-i)),r}}(),n.setAxes=function(){var t=x.create();return function(n,r,a,e){return t[0]=a[0],t[3]=a[1],t[6]=a[2],t[1]=e[0],t[4]=e[1],t[7]=e[2],t[2]=-r[0],t[5]=-r[1],t[8]=-r[2],S(n,b(n,t))}}()},function(t,n,r){"use strict";function a(){var t=new V.ARRAY_TYPE(2);return t[0]=0,t[1]=0,t}function e(t){var n=new V.ARRAY_TYPE(2);return n[0]=t[0],n[1]=t[1],n}function u(t,n){var r=new V.ARRAY_TYPE(2);return r[0]=t,r[1]=n,r}function o(t,n){return t[0]=n[0],t[1]=n[1],t}function i(t,n,r){return t[0]=n,t[1]=r,t}function s(t,n,r){return t[0]=n[0]+r[0],t[1]=n[1]+r[1],t}function c(t,n,r){return t[0]=n[0]-r[0],t[1]=n[1]-r[1],t}function f(t,n,r){return t[0]=n[0]*r[0],t[1]=n[1]*r[1],t}function M(t,n,r){return t[0]=n[0]/r[0],t[1]=n[1]/r[1],t}function h(t,n){return t[0]=Math.ceil(n[0]),t[1]=Math.ceil(n[1]),t}function l(t,n){return t[0]=Math.floor(n[0]),t[1]=Math.floor(n[1]),t}function v(t,n,r){return t[0]=Math.min(n[0],r[0]),t[1]=Math.min(n[1],r[1]),t}function d(t,n,r){return t[0]=Math.max(n[0],r[0]),t[1]=Math.max(n[1],r[1]),t}function b(t,n){return t[0]=Math.round(n[0]),t[1]=Math.round(n[1]),t}function m(t,n,r){return t[0]=n[0]*r,t[1]=n[1]*r,t}function p(t,n,r,a){return t[0]=n[0]+r[0]*a,t[1]=n[1]+r[1]*a,t}function P(t,n){var r=n[0]-t[0],a=n[1]-t[1];return Math.sqrt(r*r+a*a)}function E(t,n){var r=n[0]-t[0],a=n[1]-t[1];return r*r+a*a}function O(t){var n=t[0],r=t[1];return Math.sqrt(n*n+r*r)}function x(t){var n=t[0],r=t[1];return n*n+r*r}function A(t,n){return t[0]=-n[0],t[1]=-n[1],t}function q(t,n){return t[0]=1/n[0],t[1]=1/n[1],t}function y(t,n){var r=n[0],a=n[1],e=r*r+a*a;return e>0&&(e=1/Math.sqrt(e),t[0]=n[0]*e,t[1]=n[1]*e),t}function w(t,n){return t[0]*n[0]+t[1]*n[1]}function R(t,n,r){var a=n[0]*r[1]-n[1]*r[0];return t[0]=t[1]=0,t[2]=a,t}function L(t,n,r,a){var e=n[0],u=n[1];return t[0]=e+a*(r[0]-e),t[1]=u+a*(r[1]-u),t}function S(t,n){n=n||1;var r=2*V.RANDOM()*Math.PI;return t[0]=Math.cos(r)*n,t[1]=Math.sin(r)*n,t}function _(t,n,r){var a=n[0],e=n[1];return t[0]=r[0]*a+r[2]*e,t[1]=r[1]*a+r[3]*e,t}function I(t,n,r){var a=n[0],e=n[1];return t[0]=r[0]*a+r[2]*e+r[4],t[1]=r[1]*a+r[3]*e+r[5],t}function N(t,n,r){var a=n[0],e=n[1];return t[0]=r[0]*a+r[3]*e+r[6],t[1]=r[1]*a+r[4]*e+r[7],t}function Y(t,n,r){var a=n[0],e=n[1];return t[0]=r[0]*a+r[4]*e+r[12],t[1]=r[1]*a+r[5]*e+r[13],t}function g(t){return"vec2("+t[0]+", "+t[1]+")"}function T(t,n){return t[0]===n[0]&&t[1]===n[1]}function j(t,n){var r=t[0],a=t[1],e=n[0],u=n[1];return Math.abs(r-e)<=V.EPSILON*Math.max(1,Math.abs(r),Math.abs(e))&&Math.abs(a-u)<=V.EPSILON*Math.max(1,Math.abs(a),Math.abs(u))}Object.defineProperty(n,"__esModule",{value:!0}),n.forEach=n.sqrLen=n.sqrDist=n.dist=n.div=n.mul=n.sub=n.len=void 0,n.create=a,n.clone=e,n.fromValues=u,n.copy=o,n.set=i,n.add=s,n.subtract=c,n.multiply=f,n.divide=M,n.ceil=h,n.floor=l,n.min=v,n.max=d,n.round=b,n.scale=m,n.scaleAndAdd=p,n.distance=P,n.squaredDistance=E,n.length=O,n.squaredLength=x,n.negate=A,n.inverse=q,n.normalize=y,n.dot=w,n.cross=R,n.lerp=L,n.random=S,n.transformMat2=_,n.transformMat2d=I,n.transformMat3=N,n.transformMat4=Y,n.str=g,n.exactEquals=T,n.equals=j;var D=r(0),V=function(t){if(t&&t.__esModule)return t;var n={};if(null!=t)for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r]);return n.default=t,n}(D);n.len=O,n.sub=c,n.mul=f,n.div=M,n.dist=P,n.sqrDist=E,n.sqrLen=x,n.forEach=function(){var t=a();return function(n,r,a,e,u,o){var i=void 0,s=void 0;for(r||(r=2),a||(a=0),s=e?Math.min(e*r+a,n.length):n.length,i=a;i<s;i+=r)t[0]=n[i],t[1]=n[i+1],u(t,t,o),n[i]=t[0],n[i+1]=t[1];return n}}()}])});
  //////////////////////////////////////////////////////////////////////////////

  // Platform independent functions between ARKit and ARCore
  function callNativeFunction(functionName) {
    var args = Array.prototype.slice.call(arguments, 1);
    if (window.ARCore) {
      if (args.length > 0) {
        return window.ARCore[functionName].apply(window.ARCore, args);
      } else {
        return window.ARCore[functionName]();
      }
    }
    else {
      return window.webkit.messageHandlers.WebARonARKit.postMessage(
          functionName + ':' + args.join(','));
    }
  }

  function nativeHideCameraFeed() {
    callNativeFunction('hideCameraFeed')
  }

  function nativeShowCameraFeed() {
    callNativeFunction('showCameraFeed');
  }

  function nativeResetPose() {
    callNativeFunction('resetPose');
  }

  function nativeSetDepthNear(depthNear) {
    callNativeFunction('setDepthNear', depthNear);
  }

  function nativeSetDepthFar(depthFar) {
    callNativeFunction('setDepthFar', depthFar);
  }

  function nativeAddAnchor(identifier, modelMatrixString) {
    callNativeFunction('addAnchor', identifier, modelMatrixString);
  }

  function nativeRemoveAnchor(identifier, modelMatrixString) {
    callNativeFunction('removeAnchor', identifier);
  }

  function nativeGetFrame() {
    return callNativeFunction('getFrame');
  }

  function nativeAdvanceFrame() {
    callNativeFunction('advanceFrame');
  }

  function nativeLog(message) {
    callNativeFunction('log', message);
  }

  var nextDisplayId = 1000;

  var pixels = null;

  /**
   * VR/AR functionality class (call navigator.getVRDisplays() to acquire).
   * @constructor
   */
  VRDisplay = function() {

    var _layers = null;

    /**
     * Whether the display is connected to the device.
     * @type {boolean}
     */
    this.isConnected = false;
    /**
     * Whether the display is currently active.
     * @type {boolean}
     */
    this.isPresenting = false;
    /**
     * The supported VR/AR capabilities of the current platform/device.
     * @type {VRDisplayCapabilities}
     */
    this.capabilities = new VRDisplayCapabilities();
    this.capabilities.hasOrientation = true;
    this.capabilities.canPresent = true;
    this.capabilities.maxLayers = 1;
    this.capabilities.hasPosition = true;
    this.capabilities.hasPassThroughCamera = true;
    /**
     * Gets the eye parameters for the display, such as offsets and FOV.
     * @param {string} eye Which eye to get - either "left" or "right".
     * @return {!VREyeParameters} The eye parameters for the display.
     */
    this.getEyeParameters = function(eye) {
      var eyeParameters = null;
      if (eyeParameters !== null && eye === "left") {
        eyeParameters.offset = -eyeParameters.offset;
      }
      return eyeParameters;
    };
    /**
     * A unique identifier for this display.
     * @type {number}
     */
    this.displayId = nextDisplayId++;
    /**
     * The name of this display.
     * @type {string}
     */
    this.displayName = "ARKit VR Device";

    // Hacky code to handle camera feed show/hide
    // TODO: Improve it somehow.
    this.showingCameraFeed_ = false;
    this.hideCameraFeedTimeoutId_ = -1;
    var CAMERA_FEED_HIDE_TIMEOUT_IN_MILLIS = 1000;
    function hideCameraFeed() {
      if (this.showingCameraFeed_) {
        nativeHideCameraFeed();
        this.showingCameraFeed_ = false;
      }
    }
    hideCameraFeed = hideCameraFeed.bind(this);
    this.showCameraFeed_ = function() {
      // If the camera is not being shown, enable it.
      if (!this.showingCameraFeed_) {
        nativeShowCameraFeed();
        this.showingCameraFeed_ = true;
      }
      // Set a timeout to hide the camera feed if a significant amount of time passed since the last call to this function
      if (this.hideCameraFeedTimeoutId_ !== -1) {
        window.clearTimeout(this.hideCameraFeedTimeoutId_);
      }
      this.hideCameraFeedTimeoutId_ = setTimeout(
        hideCameraFeed,
        CAMERA_FEED_HIDE_TIMEOUT_IN_MILLIS
      );
    };

    /**
     * Populates given data with pose, timestamp, projection, and view matrices.
     * @param {!VRFrameData} frameData
     */
    this.getFrameData = function(frameData) {
      frameData.timestamp = performance.now();
      frameData.pose = this.getPose();
      // TODO: FieldOfView does not have the correct values. Not important for now as devs should not rely on it
      frameData.leftProjectionMatrix = frameData.rightProjectionMatrix = this.projectionMatrix_;
      frameData.leftViewMatrix = frameData.rightViewMatrix = this.viewMatrix_;
    };

    /**
     * The current pose of the device.
     * @type {VRPose}
     * @private
     */
    this.pose_ = new VRPose();
    /**
     * Gets the current device pose.
     * @return {!VRPose} A structure representing the device pose.
     */
    this.getPose = function() {
      // Make sure that the camera feed can be seen when the pose is requested.
      // TODO: Improve this with maybe a call to requestPresent or by providing the camera feed to JS.
      this.showCameraFeed_();
      return this.pose_;
    };

    /**
     * The current projection matrix of the device.
     * @type {Float32Array}
     * @private
     */
    this.projectionMatrix_ = new Float32Array(16);
    /**
     * The current view matrix of the device.
     * @type {Float32Array}
     * @private
     */
    this.viewMatrix_ = new Float32Array(16);

    /**
     * The list of planes coming from ARKit.
     * @type {Map<number, ARPlane}
     * @private
     */
    this.planes_ = new Map();

    this.anchors_ = new Map();
    this.anchorsIdCounter_ = 0;

    /**
     * Resets the pose of the device so the current transform is world origin.
     */
    this.resetPose = function() {
      nativeResetPose();
    };

    var depthNear = 0.01;
    Object.defineProperty(this, "depthNear", {
      get: function() {
        return depthNear;
      },
      set: function(value) {
        depthNear = value;
        nativeSetDepthNear(depthNear);
      }
    });
    var depthFar = 10000.0;
    Object.defineProperty(this, "depthFar", {
      get: function() {
        return depthFar;
      },
      set: function(value) {
        depthFar = value;
        nativeSetDepthFar(depthFar);
      }
    });

    /**
     * Request the given callback to be executed on the next animation tick.
     * @param {function()} callback The update function to be called.
     * @return {number} The request id that identifies the entry.
     */
    this.requestAnimationFrame = function(callback) {
      return window.requestAnimationFrame(callback);
    };

    /**
     * Cancel a previously-registered animation frame function.
     * @param {number} handle The handle returned from requestAnimationFrame().
     * @return {number} The same id passed in.
     */
    this.cancelAnimationFrame = function(handle) {
      return window.cancelAnimationFrame(handle);
    };

    /**
     * [UNUSED] Enter the VR/AR experience.
     * Note: this is an unused placeholder for the future.
     * @param {!Array<VRLayer>} layers The canvas(es) to use as render targets.
     * @return {Promise} A promise that resolves when the device is presenting.
     */
    this.requestPresent = function(layers) {
      var self = this;
      return new Promise(function(resolve, reject) {
        self.isPresenting = true;
        _layers = layers;
        resolve();
      });
    };

    /**
     * [UNUSED] Exit the VR/AR experience.
     * Note: this is an unused placeholder for the future.
     * @return {Promise} A promise that resolves when the device is stopped.
     */
    this.exitPresent = function() {
      var self = this;
      return new Promise(function(resolve, reject) {
        self.isPresenting = false;
        resolve();
      });
    };

    /**
     * [UNUSED] Get the layers being used to present.
     * Note: this is an unused placeholder for the future.
     * @return {!Array<VRLayer>}
     */
    this.getLayers = function() {
      return _layers;
    };

    this.submitFrame = function(pose) {
      // TODO: Learn fom the WebVR Polyfill how to make the barrel distortion.
    };

    if (window.WebARonARKitSendsCameraFrames) {
      // On WebARonARKit, the pass through camera can be simulated using an
      // image.
      this.passThroughCameraImage_ = document.createElement("img");
      this.passThroughCameraImage_.textureWidth = 0;
      this.passThroughCameraImage_.textureHeight = 0;
      this.passThroughCameraImage_.focalLengthX = 0;
      this.passThroughCameraImage_.focalLengthY = 0;
      this.passThroughCameraImage_.pointX = 0;
      this.passThroughCameraImage_.pointX = 0;
      this.passThroughCameraImage_.orientation = 90;

      this.passThroughCameraImage_.addEventListener("load", function(event) {
        event.target.textureWidth = event.target.width; 
        event.target.textureHeight = event.target.height;

        // Now we can call the callbacks as we know that the camera frame is
        // loaded in the image. This makes the synchronization to be "perfect".
        callRafCallbacks();

        // Now we can advance a frame
        nativeAdvanceFrame();
      });

      /**
      * Returns an instance that represents the camera pass through.
      *
      * @return {HTMLImageElement} An instance that represents the camera
      * pass through.
      */
      this.getPassThroughCamera = function() {
        return this.passThroughCameraImage_;
      };
    }

    /**
     * Get intersection array with planes ARKit detected for the screen coords.
     *
     * @param {number} x The x coordinate in normalized screen space [0,1].
     * @param {number} y The y coordinate in normalized screen space [0,1].
     *
     * @return {!Array<VRHit>} The array of hits sorted based on distance.
     */
    this.hitTest = (function() {
      /**
       * Cached vec3, mat4, and quat structures needed for the hit testing to
       * avoid generating garbage.
       * @type {Object}
       */
      var hitVars = {
        rayStart: vec3.create(),
        rayEnd: vec3.create(),
        cameraPosition: vec3.create(),
        cameraQuaternion: quat.create(),
        modelViewMatrix: mat4.create(),
        projectionMatrix: mat4.create(),
        projViewMatrix: mat4.create(),
        worldRayStart: vec3.create(),
        worldRayEnd: vec3.create(),
        worldRayDir: vec3.create(),
        planeMatrix: mat4.create(),
        planeExtent: vec3.create(),
        planePosition: vec3.create(),
        planeCenter: vec3.create(),
        planeNormal: vec3.create(),
        planeIntersection: vec3.create(),
        planeIntersectionLocal: vec3.create(),
        planeHit: mat4.create()
        //planeQuaternion: quat.create()
      };

      /**
       * Sets the given mat4 from the given float[16] array.
       *
       * @param {!mat4} m The mat4 to populate with values.
       * @param {!Array<number>} a The source array of floats (must be size 16).
       */
      var setMat4FromArray = function(m, a) {
        mat4.set(
          m,
          a[0],
          a[1],
          a[2],
          a[3],
          a[4],
          a[5],
          a[6],
          a[7],
          a[8],
          a[9],
          a[10],
          a[11],
          a[12],
          a[13],
          a[14],
          a[15]
        );
      };

      /**
       * Tests whether the given ray intersects the given plane.
       *
       * @param {!vec3} planeNormal The normal of the plane.
       * @param {!vec3} planePosition Any point on the plane.
       * @param {!vec3} rayOrigin The origin of the ray.
       * @param {!vec3} rayDirection The direction of the ray (normalized).
       * @return {number} The t-value of the intersection (-1 for none).
       */
      var rayIntersectsPlane = (function() {
        var rayToPlane = vec3.create();
        return function(planeNormal, planePosition, rayOrigin, rayDirection) {
          // assuming vectors are all normalized
          var denom = vec3.dot(planeNormal, rayDirection);
          vec3.subtract(rayToPlane, planePosition, rayOrigin);
          return vec3.dot(rayToPlane, planeNormal) / denom;
        };
      })();

      /**
       * Sorts based on the distance from the VRHits to the camera.
       *
       * @param {!VRHit} a The first hit to compare.
       * @param {!VRHit} b The second hit item to compare.
       * @returns {number} -1 if a is closer than b, otherwise 1.
       */
      var sortFunction = function(a, b) {
        // Get the matrix of hit a.
        setMat4FromArray(hitVars.planeMatrix, a.modelMatrix);
        // Get the translation component of a's matrix.
        mat4.getTranslation(hitVars.planeIntersection, hitVars.planeMatrix);
        // Get the distance from the intersection point to the camera.
        var distA = vec3.distance(
          hitVars.planeIntersection,
          hitVars.cameraPosition
        );

        // Get the matrix of hit b.
        setMat4FromArray(hitVars.planeMatrix, b.modelMatrix);
        // Get the translation component of b's matrix.
        mat4.getTranslation(hitVars.planeIntersection, hitVars.planeMatrix);
        // Get the distance from the intersection point to the camera.
        var distB = vec3.distance(
          hitVars.planeIntersection,
          hitVars.cameraPosition
        );

        // Return comparison of distance from camera to a and b.
        return distA < distB ? -1 : 1;
      };

      return function(x, y) {
        // Coordinates must be in normalized screen space.
        if (x < 0 || x > 1 || y < 0 || y > 1) {
          throw new Error(
              "hitTest - x and y values must be normalized [0,1]!")
          ;
        }

        var hits = [];

        // If there are no anchors detected, there will be no hits.
        var planes = this.getPlanes();
        if (!planes || planes.length == 0) {
          return hits;
        }

        // Create a ray in screen space for the hit test ([-1, 1] with y flip).
        vec3.set(hitVars.rayStart, 2 * x - 1, 2 * (1 - y) - 1, 0);
        vec3.set(hitVars.rayEnd, 2 * x - 1, 2 * (1 - y) - 1, 1);

        // Set the projection matrix.
        setMat4FromArray(hitVars.projectionMatrix, this.projectionMatrix_);

        // Set the model view matrix.
        setMat4FromArray(hitVars.modelViewMatrix, this.viewMatrix_);

        // Combine the projection and model view matrices.
        mat4.multiply(
          hitVars.projViewMatrix,
          hitVars.projectionMatrix,
          hitVars.modelViewMatrix
        );
        // Invert the combined matrix because we need to go from screen -> world.
        mat4.invert(hitVars.projViewMatrix, hitVars.projViewMatrix);

        // Transform the screen-space ray start and end to world-space.
        vec3.transformMat4(
          hitVars.worldRayStart,
          hitVars.rayStart,
          hitVars.projViewMatrix
        );
        vec3.transformMat4(
          hitVars.worldRayEnd,
          hitVars.rayEnd,
          hitVars.projViewMatrix
        );

        // Subtract start from end to get the ray direction and then normalize.
        vec3.subtract(
          hitVars.worldRayDir,
          hitVars.worldRayEnd,
          hitVars.worldRayStart
        );
        vec3.normalize(hitVars.worldRayDir, hitVars.worldRayDir);

        // Go through all the anchors and test for intersections with the ray.
        for (var i = 0; i < planes.length; i++) {
          var plane = planes[i];

          // Get the anchor transform.
          setMat4FromArray(hitVars.planeMatrix, plane.modelMatrix);

          // Get the position of the anchor in world-space.
          vec3.set(
            hitVars.planeCenter,
            0,
            0,
            0
          );
          vec3.transformMat4(
            hitVars.planePosition,
            hitVars.planeCenter,
            hitVars.planeMatrix
          );

          // Get the plane normal.
          // TODO: use alignment to determine this.
          vec3.set(hitVars.planeNormal, 0, 1, 0);

          // Check if the ray intersects the plane.
          var t = rayIntersectsPlane(
            hitVars.planeNormal,
            hitVars.planePosition,
            hitVars.worldRayStart,
            hitVars.worldRayDir
          );

          // if t < 0, there is no intersection.
          if (t < 0) {
            continue;
          }

          // Calculate the actual intersection point.
          vec3.scale(hitVars.planeIntersection, hitVars.worldRayDir, t);
          vec3.add(
            hitVars.planeIntersection,
            hitVars.worldRayStart,
            hitVars.planeIntersection
          );

          // Get the plane extents (extents are in plane local space).
          vec3.set(hitVars.planeExtent, plane.extent[0], 0, plane.extent[1]);

          /*
           ///////////////////////////////////////////////
           // Test by converting extents to world-space.
           // TODO: get this working to avoid matrix inversion in method below.

           // Get the rotation component of the anchor transform.
           mat4.getRotation(hitVars.planeQuaternion, hitVars.planeMatrix);

           // Convert the extent into world space.
           vec3.transformQuat(
           hitVars.planeExtent, hitVars.planeExtent, hitVars.planeQuaternion);

           // Check if intersection is outside of the extent of the anchor.
           if (Math.abs(hitVars.planeIntersection[0] - hitVars.planePosition[0]) > hitVars.planeExtent[0] / 2) {
           continue;
           }
           if (Math.abs(hitVars.planeIntersection[2] - hitVars.planePosition[2]) > hitVars.planeExtent[2] / 2) {
           continue;
           }
           ////////////////////////////////////////////////
           */

          ////////////////////////////////////////////////
          // Test by converting intersection into plane-space.
          mat4.invert(hitVars.planeMatrix, hitVars.planeMatrix);
          vec3.transformMat4(
            hitVars.planeIntersectionLocal,
            hitVars.planeIntersection,
            hitVars.planeMatrix
          );

          // Check if intersection is outside of the extent of the anchor.
          // Tolerance is added to match the behavior of the native hitTest call.
          var tolerance = 0.0075;
          if (
            Math.abs(hitVars.planeIntersectionLocal[0]) >
            hitVars.planeExtent[0] / 2 + tolerance
          ) {
            continue;
          }
          if (
            Math.abs(hitVars.planeIntersectionLocal[2]) >
            hitVars.planeExtent[2] / 2 + tolerance
          ) {
            continue;
          }

          ////////////////////////////////////////////////

          // The intersection is valid - create a matrix from hit position.
          mat4.fromTranslation(hitVars.planeHit, hitVars.planeIntersection);
          var hit = new VRHit();
          for (var j = 0; j < 16; j++) {
            hit.modelMatrix[j] = hitVars.planeHit[j];
          }
          hit.i = i;
          hits.push(hit);
        }

        // Sort the hits by distance.
        hits.sort(sortFunction);

        return hits;
      };
    })();

    /**
     * Get an iterable of plane objects representing ARKit's current understanding of the world.
     * @return {iterator<Object>} The iterable of plane objects.
     */
    this.getPlanes = function() {
      return Array.from(this.planes_.values());
    };

    this.addAnchor = function(modelMatrix) {
      // Create the js anchor.
      var anchor = new VRAnchor(modelMatrix);
      var modelMatrixString = "";
      for (var i = 0; i < 16; i++) {
        modelMatrixString += modelMatrix[i] + (i < 15 ? "," : "");
      }
      nativeAddAnchor(anchor.identifier, modelMatrixString);
      this.anchors_.set(anchor.identifier, anchor);
      // Dispatch an event that the anchor has been added.
      this.dispatchEvent({type:"anchorsadded", anchors:[anchor]});
      return anchor;
    };

    this.removeAnchor = function(anchor) {
      nativeRemoveAnchor(anchor.identifier);
      this.anchors_.delete(anchor.identifier);
      this.dispatchEvent({type:"anchorsremoved", anchors:[anchor]});
    };

    /**
     * Get an iterable of anchor objects representing all the anchors created up until this point
     * @return {iterator<Object>} The iterable of plane objects.
     */
    this.getAnchors =  function() {
      return Array.from(this.anchors_.values());
    };

    // EventTarget implementation.
    this.listeners_ = {};

    /**
     * Register a callback function for an event of the given type.
     * Important events are "planesadded", "planesupdated", and "planesremoved".
     * @param {string} type The type of event to listen for.
     * @param {function<Object>} callback The callback to call, which must take an event object parameter,
     *     which will have the attribute "type" in addition to any event-specific attributes.
     */ 
    this.addEventListener = function(type, callback) {
      if (!(type in this.listeners_)) {
        this.listeners_[type] = [];
      }
      // Only add the callback if it has not already been added.
      if (this.listeners_[type].indexOf(callback) < 0) {
        this.listeners_[type].push(callback);
      }
    };

    /**
     * Unregister a callback function for an event of the given type.
     * @param {string} type The type of event to remove.
     * @param {function<Object>} callback The callback to remove.
     */
    this.removeEventListener = function(type, callback) {
      if (!(type in this.listeners_)) {
        return;
      }

      var stack = this.listeners_[type];
      for (var i = 0, l = stack.length; i < l; i++) {
        if (stack[i] === callback){
          stack.splice(i, 1);
          return;
        }
      }
    };

    /**
     * Fire an event to all listeners.
     * @param {Object} event The event to fire, which must have a "type" attribute in addition to any
     *     event-specific attributes.
     */
    this.dispatchEvent = function(event) {
      if (!(event.type in this.listeners_)) {
        return true;
      }
 
      var stack = this.listeners_[event.type];
      for (var i = 0, l = stack.length; i < l; i++) {
        stack[i].call(this, event);
      }

      // Check for "onXXX" version of event handlers.
      var onFunc = this["on" + event.type];
      if (typeof onFunc == 'function') {
        onFunc.call(this, event);
      }
      return !event.defaultPrevented;
    };

    return this;
  };

  /**
   * [UNUSED] A canvas used as a render target for VR/AR.
   * Note: this is an unused placeholder for the future.
   * @constructor
   */
  VRLayer = function() {
    this.source = null;
    this.leftBounds = [];
    this.rightBounds = [];
    return this;
  };

  /**
   * The display capabilities of the VR/AR device associated with this session.
   * @constructor
   */
  VRDisplayCapabilities = function() {
    /**
     * Whether this device has positional information (6dof).
     * @type {boolean}
     */
    this.hasPosition = false;
    /**
     * Whether this device has orientation information.
     * @type {boolean}
     */
    this.hasOrientation = false;
    /**
     * Whether the device has its own display capabilities.
     * @type {boolean}
     */
    this.hasExternalDisplay = false;
    /**
     * Whether the device can be drawn to.
     * @type {boolean}
     */
    this.canPresent = false;
    /**
     * The maximum number of layers.
     * @type {number}
     */
    this.maxLayers = 0;
    /**
     * Whether the device has a camera for rendering pass-through, AR images.
     * @type {boolean}
     */
    this.hasPassThroughCamera = false;
    return this;
  };

  /**
   * The enumeration of eyes for a VR/AR display device.
   * @type {{left: string, right: string}}
   */
  VREye = {
    left: "left",
    right: "right"
  };

  /**
   * [UNUSED] Represents the field-of-view of an eye of a VR/AR display.
   * Note: this is an unused placeholder for the future.
   * @constructor
   */
  VRFieldOfView = function() {
    /**
     * The upper boundary of the frustum in degrees.
     * @type {number}
     */
    this.upDegrees = 0;
    /**
     * The right boundary of the frustum in degrees.
     * @type {number}
     */
    this.rightDegrees = 0;
    /**
     * The bottom boundary of the frustum in degrees.
     * @type {number}
     */
    this.downDegrees = 0;
    /**
     * The left boundary of the frustum in degrees.
     * @type {number}
     */
    this.leftDegrees = 0;
    return this;
  };

  /**
   * Represents the pose of the VR/AR device.
   * @constructor
   */
  VRPose = function() {
    /**
     * The position of the VR/AR device in session-space.
     * @type {Float32Array}
     */
    this.position = new Float32Array(3);
    /**
     * The orientation of the VR/AR device in session-space.
     * @type {Float32Array}
     */
    this.orientation = new Float32Array(4);
    /**
     * [UNUSED] The velocity of the VR/AR device.
     * @type {Float32Array}
     */
    this.linearVelocity = null;
    /**
     * [UNUSED] The acceleration of the VR/AR device.
     * @type {Float32Array}
     */
    this.linearAcceleration = null;
    /**
     * [UNUSED] The angular velocity of the VR/AR device.
     * @type {Float32Array}
     */
    this.angularVelocity = null;
    /**
     * [UNUSED] The angular acceleration of the VR/AR device.
     * @type {Float32Array}
     */
    this.angularAcceleration = null;
    return this;
  };

  /**
   * Represents the data about the VR/AR device as last measured.
   * @constructor
   */
  VRFrameData = function() {
    /**
     * The timestamp of this data (when it was collected).
     * @type {number}
     */
    this.timestamp = null;
    /**
     * The projection matrix for the left eye.
     * @type {Float32Array}
     */
    this.leftProjectionMatrix = new Float32Array(16);
    /**
     * The view matrix for the left eye.
     * @type {Float32Array}
     */
    this.leftViewMatrix = new Float32Array(16);
    /**
     * The projection matrix for the right eye.
     * @type {Float32Array}
     */
    this.rightProjectionMatrix = new Float32Array(16);
    /**
     * The view matrix for the right eye.
     * @type {Float32Array}
     */
    this.rightViewMatrix = new Float32Array(16);
    // TODO: Initialize matrices to identity
    /**
     * The pose of the device.
     * @type {VRPose}
     */
    this.pose = null;
    return this;
  };

  /**
   * [UNUSED] The parameters for an eye of the VR/AR device (FOV, width/height).
   * @constructor
   */
  VREyeParameters = function() {
    /**
     * The offset, in meters, from the center point of the device/head.
     * @type {number}
     */
    this.offset = 0;
    /**
     * The field of view of the eye.
     * @type {VRFieldOfView}
     */
    this.fieldOfView = new VRFieldOfView();
    /**
     * The width of the render area for this eye.
     * @type {number}
     */
    this.renderWidth = 0;
    /**
     * The height of the render area for this eye.
     * @type {number}
     */
    this.renderHeight = 0;
    return this;
  };

  /**
   * [UNUSED] Placeholder for future functionality.
   * @constructor
   */
  VRStageParameters = function() {
    this.sittingToStandingTransform = null;
    this.sizeX = 0;
    this.sizeZ = 0;
    return this;
  };

  /**
   * The result of a raycast into the AR world encoded as a transform matrix.
   * This structure has a single property - modelMatrix - which encodes the
   * translation of the intersection of the hit in the form of a 4x4 matrix.
   * @constructor
   */
  VRHit = function() {
    this.modelMatrix = new Float32Array(16);
    return this;
  };

  /**
   * The structure that represents a plane detected by the underlying AR
   * system.
   * This structure has 4 properties:
   * - identifier: The unique id of the plane.
   * - modelMatrix: a matrix that represents the position and orientation
   * of the plane in world space.
   * - extent: The 2 dimensions extents of the plane.
   * - vertices: The list of 3D points that conform the plane.
   * @constructor
   */
  VRPlane = function(plane) {
    this.set_(plane);
    return this;
  };

  VRPlane.prototype.set_ = function(plane) {
    this.identifier = plane.identifier;
    this.modelMatrix = new Float32Array(plane.modelMatrix.length);
    for (var i = 0; i < plane.modelMatrix.length; i++) {
      this.modelMatrix[i] = plane.modelMatrix[i];
    }
    this.extent = new Float32Array(plane.extent.length);
    for (var i = 0; i < plane.extent.length; i++) {
      this.extent[i] = plane.extent[i];
    }
    this.vertices = new Float32Array(plane.vertices.length);
    for (var i = 0; i < plane.vertices.length; i++) {
      this.vertices[i] = plane.vertices[i];
    }
    return this;
  };

  /**
   * The structure that represents an anchor created by the user and notified
   * to the underlying AR platform so it keeps track of it. If the AR system
   * changes its tracking estimation, the user anchors might need to be updated
   * too.
   * This structure has 2 properties:
   * - identifier: The unique id of the anchor.
   * - modelMatrix: a matrix that represents the position and orientation
   * of the anchor in world space.
   * @constructor
   */
  VRAnchor = function(modelMatrix) {
    this.identifier = WebARonARKitVRDisplay.anchorsIdCounter_++;
    this.modelMatrix = new Float32Array(16);
    if (modelMatrix && modelMatrix.length === 16) {
      for (var i = 0; i < 16; i++) {
        this.modelMatrix[i] = modelMatrix[i];
      }
    } else {
      throw new Error(
          "ERROR: The given parameter is not a 16 value matrix in the " +
          "VRAnchor constructor."
      );
    }
    return this;
  };

  var WebARonARKitVRDisplay = new VRDisplay();

  //
  /**
   * This function will be called from the native side every frame/pose update.
   * @param {Object} data The data containing pose and feature information from
   *     native, which must contain the following properties:
   *     position - a float[3] with the device position as a vector.
   *     orientation - a float[4] with the device orientation as a quaternion.
   *     viewMatrix - a float[16] with the device view matrix (camera matrix).
   *     projectionMatrix - a float[16] with the device projection matrix.
   *     anchors - an array of objects containing detected planes in the world.
   * @constructor
   */

  window.WebARonARKitSetData = function(data) {
    WebARonARKitVRDisplay.pose_.position[0] = data.position[0];
    WebARonARKitVRDisplay.pose_.position[1] = data.position[1];
    WebARonARKitVRDisplay.pose_.position[2] = data.position[2];
    WebARonARKitVRDisplay.pose_.orientation[0] = data.orientation[0];
    WebARonARKitVRDisplay.pose_.orientation[1] = data.orientation[1];
    WebARonARKitVRDisplay.pose_.orientation[2] = data.orientation[2];
    WebARonARKitVRDisplay.pose_.orientation[3] = data.orientation[3];
    for (var i = 0; i < 16; i++) {
      WebARonARKitVRDisplay.viewMatrix_[i] = data.viewMatrix[i];
    }
    for (var i = 0; i < 16; i++) {
      WebARonARKitVRDisplay.projectionMatrix_[i] = data.projectionMatrix[i];
    }

    // Did the native side pass the camera frame? Then update the image!
    if (window.WebARonARKitSendsCameraFrames && data.cameraFrame !== "") {
      WebARonARKitVRDisplay.passThroughCameraImage_.src = data.cameraFrame;
      // The raf callbacks and the advance of the frame will be done once the
      // image is loaded (see the image load event above)
    }
    else {
      // Only on iOS and when there is no camera frame, call the raf callbacks
      // and advance a frame
      if (!window.ARCore) {
        callRafCallbacks();
        nativeAdvanceFrame();
      }
    }

  };

  window.WebARonARKitDispatchARDisplayEvent = function(events) {
    // Keep the list of planes updated to support the polling planes api.
    //console.log("GOT PLANES DELTA!");
    if (events.type == "planesdelta") {
      var es = [];
      if (events.planesadded.planes.length > 0) {
        es.push(events.planesadded);
      }
      if (events.planesupdated.planes.length > 0) {
        es.push(events.planesupdated);
      }
      if (events.planesremoved.planes.length > 0) {
        es.push(events.planesremoved);
      }
      events = es;
    } else {
      events = [events];
    }

    for (var i = 0; i < events.length; i++) {
      var event = events[i];
      if (event.type == "planesadded" ||
          event.type == "planesupdated" ||
          event.type === "planesremoved") {
        for (var j = 0; j < event.planes.length; j++) {
          var eventPlane = event.planes[j];
          var plane = null;
          if (event.type === "planesadded") {
            // Add the plane.
            plane = new VRPlane(eventPlane);
            WebARonARKitVRDisplay.planes_.set(plane.identifier, plane);
          } else if (event.type === "planesupdated") {
            // Update the plane
            plane = WebARonARKitVRDisplay.planes_.get(eventPlane.identifier);
            if (plane) {
              plane.set_(eventPlane);
            }
          } else if (event.type === "planesremoved") {
            // If the plane has been removed, remove the actual VRPlane instance.
            plane = WebARonARKitVRDisplay.planes_.get(eventPlane.identifier);
            WebARonARKitVRDisplay.planes_.delete(eventPlane.identifier);
          }
          // The event planes should include the same references to the planes
          // in the getPlanes call.
          event.planes[j] = plane;
        }
      } else if (event.type == "anchorsupdated") {
        var updatedAnchors = [];
        for (var j = 0; j < event.anchors.length; j++) {
          var eventAnchor = event.anchors[j];
          var anchor = WebARonARKitVRDisplay.anchors_.get(
              eventAnchor.identifier);
          // As the bridge is asynchronous, it could happen that an anchor is
          // updated but it has already been removed.
          if (anchor) {
            for (var k = 0; k < 16; k++) {
              anchor.modelMatrix[k] = eventAnchor.modelMatrix[k];
            }
            updatedAnchors.push(anchor);
          }
        }
        // The event anchors should include the same references to the anchors
        // in the getAnchors call.
        event.anchors = updatedAnchors;
      }

      // Dispatch the event to any listeners.
      WebARonARKitVRDisplay.dispatchEvent(event);
    }
  };

  /**
   * If the window size has changed, the native side will call this function.
   * This is a hack due to WKWebView not handling the window.innerWidth/Height
   * correctly in the window.onresize events.
   * TODO: Remove this hack once the WKWebView has fixed the issue.
   * @param size The size in pixels of the window.
   * @constructor
   */
  window.WebARonARKitSetWindowSize = function(size) {
    window.innerWidth = size.width;
    window.innerHeight = size.height;
    var resizeEvent = new Event("resize");
    for (var i = 0; i < resizeEventListeners.length; i++) {
      if (typeof(resizeEventListeners[i]) === "function") {
        resizeEventListeners[i].call(this, resizeEvent);
      }
      else if (typeof(resizeEventListeners[i]) === "object" && typeof(resizeEventListeners[i].handleEvent) === "function") {
        resizeEventListeners[i].handleEvent(resizeEvent);
      }
    }
    if (typeof window.onresize === "function") {
      window.onresize.call(this, resizeEvent);
    }
  };

  /**
   * The main interface for acquiring a VRDisplay (and AR too).
   * @return {!Promise<Array<VRDisplay>>} A promise that resolves when the VR/AR
   *     display is ready.
   */
  navigator.getVRDisplays = function() {
    if (window.getVRDisplaysPromise != null) {
      return window.getVRDisplaysPromise;
    }
    window.getVRDisplaysPromise = new Promise(function(resolve, reject) {
      resolve([WebARonARKitVRDisplay]);
    });
    return window.getVRDisplaysPromise;
  };

  // TODO: iOS 11 Safari requires MacOS Safari 11 or higher to debug a WKWebVew (or any iOS Safari page). 
  // Reimplementing console.log allows for logs to be shown in older versions of MacOS Safari.
  // This could be removed once MacOS Safari 11.0 is released (currently available as Safari Technology Preview)
  var oldConsoleLog = console.log;
  console.log = function() {
    var argumentsArray = Array.prototype.slice.call(arguments);
    nativeLog(argumentsArray.join(" "));
    return oldConsoleLog.apply(this, argumentsArray);
  };

  // TODO: Reimplement window.requestAnimationFrame because it seems
  // camera and pose synchronization improves noticeably on iPhones.
  // If at some point the original raf is performant enough, remove this.
  var oldRequestAnimationFrame = window.requestAnimationFrame;
  var rafCallbacks = [];
  window.requestAnimationFrame = function(callback) {
    if (typeof callback !== "function") {
      throw new TypeError(
          "Failed to execute 'requestAnimationFrame' on 'Window':" +
          "The callback provided as parameter 1 is not a function."
      );
    }
    rafCallbacks.push(callback);
  };

  var resizeEventListeners = [];
  var oldWindowAddEventListener = window.addEventListener;
  window.addEventListener = function() {
    var argumentsArray = Array.prototype.slice.call(arguments);
    if (argumentsArray[0] === "resize") {
      resizeEventListeners.push(argumentsArray[1]);
    } else {
      return oldWindowAddEventListener.apply(this, argumentsArray);
    }
  };
  var oldWindowRemoveEventListener = window.removeEventListener;
  window.removeEventListener = function() {
    var argumentsArray = Array.prototype.slice.call(arguments);
    if (argumentsArray[0] === "resize") {
      var index = resizeEventListeners.indexOf(argumentsArray[1]);
      if (index >= 0) {
        resizeEventListeners.splice(index, 1);
      }
    } else {
      return oldWindowRemoveEventListener.apply(this, argumentsArray);
    }
  };

  function forceRedraw() {
    // Modify the DOM trivially to force a redraw.
    var canvases = document.getElementsByTagName("canvas");
    if (canvases.length > 0) {
      var canvas = canvases[canvases.length - 1];
      var disp = canvas.style.display;
      canvas.style.display = 'none';
      var trick = canvas.offsetHeight;
      canvas.style.display = disp;
    }
  }

  function raf() {
    var frameStr = nativeGetFrame();
    var frame = JSON.parse(frameStr);
    if (frame.data) {
      window.WebARonARKitSetData(frame.data);

      if (frame.planes) {
        window.WebARonARKitDispatchARDisplayEvent(frame.planes);
      }

      callRafCallbacks();

      // Only on Android!
      if (window.ARCore) {
        forceRedraw();
      }
    }

    oldRequestAnimationFrame(() => {
      // When we get the first RAF after modifying the DOM, we are guaranteed that
      // the rendering has actually occurred. This is when we can advance the frame
      // and then schedule our subsequent RAF (double-RAF-trick).
      nativeAdvanceFrame();
      oldRequestAnimationFrame(raf);
    });
  }

  /**
   * Call all update functions - called when native sets device data to achieve
   * synchronization between device pose and rendering.
   */
  function callRafCallbacks() {
    var rafCallbacksCopy = new Array(rafCallbacks.length);
    for (var i = 0; i < rafCallbacks.length; i++) {
      rafCallbacksCopy[i] = rafCallbacks[i];
    }
    rafCallbacks = [];

    for (var i = 0; i < rafCallbacksCopy.length; i++) {
      rafCallbacksCopy[i](performance.now());
    }
  }

  // Only on Android!
  if (window.ARCore) {
    oldRequestAnimationFrame(raf);
  }

  // TODO: Implement cancelAnimationFrame. raf needs to return a unique
  // identifier and use it to cancel the call (remove it from the array).
})();
