import superagent from 'superagent';
import superagentCache from 'superagent-cache';

import API_PATH_HASH from './ApiPathHash';
import { DEFAULT_HTTP_STATUS_MSG_HASH, DEFAULT_ERR_MSG_HASH } from './ApiErrorCode';

const METHODS = ['get', 'post', 'put', 'patch', 'del'];

const SERVER_URL = API_PATH_HASH.server;

const CONTENT_TYPE_HASH = {
  html: 'text/html',
  json: 'application/json',
  xml: 'application/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  form: 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded',
};

export function formatUrl(path) {
  const adjustedPath = path[0] !== '/' ? `/${path}` : path;

  if (__MOCK_API_IS_USE__) {
    return `${__MOCK_API_HOST__}:${__MOCK_API_PORT__}${adjustedPath}`;
  }

  return `${SERVER_URL}${adjustedPath}`;
}

function formartResult(body, text) {
  let result;

  if (body) {
    result = body;
  } else {
    result = text;
  }

  return {
    status: 200,
    result,
  };
}

function errorFormatter(agentErr, body, bodyText, httpStatus) {
  if (!agentErr) {
    return null;
  }

  const unknownError = DEFAULT_HTTP_STATUS_MSG_HASH.UNKNOWN;
  const errOuput = {
    status: httpStatus,
    err: {
      status: unknownError.status,
      code: unknownError.errorCode,
      msg: unknownError.message,
    },
  };

  if (body) {
    try {
      const errorResult = body;
      const message = errorResult.message;
      let errorObj;

      if (DEFAULT_ERR_MSG_HASH[message]) {
        errorObj = DEFAULT_ERR_MSG_HASH[message];
      } else if (DEFAULT_HTTP_STATUS_MSG_HASH[httpStatus]) {
        errorObj = DEFAULT_HTTP_STATUS_MSG_HASH[httpStatus];
      }

      Object.assign(errOuput.err, {
        status: errorObj.status,
        code: errorObj.errorCode,
        msg: errorObj.message,
      });
    } catch (error) {
      errOuput.err.msg = bodyText;
    }
  }

  return errOuput;
}

class Request {
  static getRequest(path, method, {params = {}, isExternal = false, requestType = 'form', responseType = '', isCached = false} = {}) {
    const request = Request.getHttpClient(path, method, isExternal, isCached);

    Request.setQueryParams(request, method, params);
    Request.setDefaultHeaders(request, method, requestType);
    Request.setResponseType(request, responseType);

    /*
    if (!__MOCK_API_IS_USE__) {
      // 沒有這行，cross domain拿到的cookie不會set, 只有不使用useMockApi才加上
      request.withCredentials();
    }
    */

    return request;
  }
  static getHttpClient(path, method, isExternal, isCached) {

    // 如果是外部第三方API就不需透過formatUrl, 避免自己的API路徑被加上
    const _path = isExternal ? path : formatUrl(path);

    if (isCached) {
      return superagentCache()[method](_path);
    }

    return superagent[method](_path);
  }
  static setQueryParams(request, method, params) {
    if (method === 'get') {
      params.timestamp = new Date().getTime();
    }

    request.query(params);
  }
  static setDefaultHeaders(request, method, requestType) {
    const headers = {};
    /* CORS 規範
      只用GET, HEAD, POST方法
      標頭必須為下列類型：Accept, Accept-Language, Content-Language(不區分大小寫),
      或者是Content-Type必須為下列application/x-www-form-urlencoded, multipart/form-data,
      或text/plain其中一種。
      沒有自訂義的標頭，例如X-Modified等等。
    */
    headers['Content-Type'] = 'text/plain';

    /* CORS 規範
      只用GET, HEAD, POST方法
      標頭必須為下列類型：Accept, Accept-Language, Content-Language(不區分大小寫),
      或者是Content-Type必須為下列application/x-www-form-urlencoded, multipart/form-data,
      或text/plain其中一種。
      沒有自訂義的標頭，例如X-Modified等等。
    */
    headers['Content-Type'] = 'text/plain';

    if (method !== 'get') {
      headers['Content-Type'] = `${CONTENT_TYPE_HASH[requestType]};`;
    }

    request.set(headers);
  }

  static setResponseType(request, responseType) {

    if (responseType) {
      request.responseType(responseType);
    }
  }

  static setEndCallback(request, { resolveFunc, endCallback, resolve, reject } = {}) {
    let endFunc;

    if (resolveFunc && resolveFunc instanceof Function) {
      endFunc = (body) => {
        resolve(resolveFunc(body));
      };
    } else {
      endFunc = (body) => resolve(body);
    }

    request.end((err, resp) => {
      const _resp = resp || {};
      const { body, text, status } = _resp;
      const _err = errorFormatter(err, body, text, status);

      if (endCallback && typeof endCallback === 'function') {
        return endCallback(_err, formartResult(body, text), resolve, reject);
      }

      return _err ? reject(_err) : endFunc(formartResult(body, text));
    });
  }
}

class ApiClient {
  static postByForm(path, params, method = 'get') {
    const _path = formatUrl(path);
    const form = document.createElement('form');
    form.setAttribute('method', method);
    form.setAttribute('action', _path);
    form.setAttribute('target', '_blank');

    const data = JSON.stringify(params);

    const hiddenField = document.createElement('input');
    hiddenField.setAttribute('type', 'hidden');
    hiddenField.setAttribute('name', 'data');
    hiddenField.setAttribute('value', data);
    form.appendChild(hiddenField);

    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  }
  static getInstance() {
    if (!ApiClient._instance) {
      ApiClient._instance = new ApiClient();
    }

    return ApiClient._instance;
  }

  constructor() {
    METHODS.forEach((method) => {
      this[method] = (path, {isExternal = false, requestType = 'form', responseType, isCached = false, params = {}, data = {}, resolveFunc, endCallback} = {}) => {

        return new Promise((resolve, reject) => {

          const request = Request.getRequest(path, method, { isExternal, requestType, responseType, params, isCached });

          request.send(data);

          Request.setEndCallback(request, { resolveFunc, endCallback, resolve, reject });
        });
      };
    });
  }
  uploadFiles(path, { files = [], isExternal = false, requestType = 'form', responseType, isCached = false, params = {}, data = {}, progressCallback, resolveFunc, endCallback } = {}) {
    return new Promise((resolve, reject) => {
      const request = Request.getRequest(path, 'post', { isExternal, requestType, responseType, params, isCached });
      const _progressCallback = typeof progressCallback === 'function' ? progressCallback : () => { };

      files.forEach((file) => {
        request.attach(file.name, file);
      });

      request.on('progress', (e) => {
        _progressCallback(e.percent);
      });

      if (data && typeof data === 'object') {
        Object.keys(data).forEach((key) => {
          request.field(key, data[key]);
        });
      }

      Request.setEndCallback(request, { resolveFunc, endCallback, resolve, reject });
    });
  }
}

export default ApiClient;
