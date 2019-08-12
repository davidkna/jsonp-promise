"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = jsonp;

// Copyright 2016 David Knaack
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
function toQueryString(obj) {
  return Object.keys(obj).map(function (key) {
    return "".concat(key, "=").concat(encodeURIComponent(obj[key]));
  }).join('&');
}

var counter = 0;

function cleanup(callbackName) {
  delete global[callbackName];
  var script = document.getElementById(callbackName);
  document.head.removeChild(script);
}

function jsonp(_url) {
  var _queryParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var queryParams = _queryParams;

  if (!queryParams.callback) {
    counter += 1;
    queryParams.callback = "_jsonp_".concat(counter);
  }

  var callbackName = queryParams.callback;
  return new Promise(function (resolve, reject) {
    var url = "".concat(_url, "?").concat(toQueryString(queryParams));
    var script = document.createElement('script');
    script.id = callbackName;
    script.src = url;
    script.type = 'text/javascript';

    global[callbackName] = function (response) {
      resolve(response);
      cleanup(callbackName);
    };

    script.onerror = function (err) {
      reject(err);
      cleanup(callbackName);
    };

    document.head.appendChild(script);
  });
}