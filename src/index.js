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
  return Object
    .keys(obj)
    .map(key => `${key}=${encodeURIComponent(obj[key])}`)
    .join('&')
}

let counter = 0

function cleanup(callbackName) {
  delete global[callbackName]
  const script = document.getElementById(callbackName)
  document.head.removeChild(script)
}

export default function jsonp(_url, _queryParams = {}) {
  const queryParams = _queryParams
  if (!queryParams.callback) {
    counter += 1
    queryParams.callback = `_jsonp_${counter}`
  }

  const callbackName = queryParams.callback

  return new Promise((resolve, reject) => {
    const url = `${_url}?${toQueryString(queryParams)}`
    const script = document.createElement('script')
    script.id = callbackName
    script.src = url
    script.type = 'text/javascript'

    global[callbackName] = (response) => {
      resolve(response)
      cleanup(callbackName)
    }

    script.onerror = (err) => {
      reject(err)
      cleanup(callbackName)
    }

    document.head.appendChild(script)
  })
}
