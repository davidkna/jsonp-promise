'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = jsonp;
function toQueryString(obj) {
  return Object.keys(obj).map(function (key) {
    return key + '=' + encodeURIComponent(obj[key]);
  }).join('&');
}

var counter = 0;

function cleanup(callbackName) {
  delete global[callbackName];
  var script = document.getElementById(callbackName);
  document.head.removeChild(script);
}

function jsonp(_url) {
  var _queryParams = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var queryParams = _queryParams;
  if (!queryParams.callback) {
    queryParams.callback = '_jsonp_' + counter++;
  }

  var callbackName = queryParams.callback;

  return new Promise(function (resolve, reject) {
    var url = _url + '?' + toQueryString(queryParams);
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