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
    queryParams.callback = `_jsonp_${counter++}`
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
