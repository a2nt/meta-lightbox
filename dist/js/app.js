!function(){var e={617:function(e,t,n){e.exports=n(456)},990:function(e,t,n){"use strict";var r=n(390),o=n(72),a=n(894),i=n(359),s=n(215),c=n(758),u=n(763),l=n(547);e.exports=function xhrAdapter(e){return new Promise((function dispatchXhrRequest(t,n){var f=e.data,d=e.headers,p=e.responseType;r.isFormData(f)&&delete d["Content-Type"];var m=new XMLHttpRequest;if(e.auth){var h=e.auth.username||"",g=e.auth.password?unescape(encodeURIComponent(e.auth.password)):"";d.Authorization="Basic "+btoa(h+":"+g)}var y=s(e.baseURL,e.url);function onloadend(){if(m){var r="getAllResponseHeaders"in m?c(m.getAllResponseHeaders()):null,a={data:p&&"text"!==p&&"json"!==p?m.response:m.responseText,status:m.status,statusText:m.statusText,headers:r,config:e,request:m};o(t,n,a),m=null}}if(m.open(e.method.toUpperCase(),i(y,e.params,e.paramsSerializer),!0),m.timeout=e.timeout,"onloadend"in m?m.onloadend=onloadend:m.onreadystatechange=function handleLoad(){m&&4===m.readyState&&(0!==m.status||m.responseURL&&0===m.responseURL.indexOf("file:"))&&setTimeout(onloadend)},m.onabort=function handleAbort(){m&&(n(l("Request aborted",e,"ECONNABORTED",m)),m=null)},m.onerror=function handleError(){n(l("Network Error",e,null,m)),m=null},m.ontimeout=function handleTimeout(){var t="timeout of "+e.timeout+"ms exceeded";e.timeoutErrorMessage&&(t=e.timeoutErrorMessage),n(l(t,e,e.transitional&&e.transitional.clarifyTimeoutError?"ETIMEDOUT":"ECONNABORTED",m)),m=null},r.isStandardBrowserEnv()){var v=(e.withCredentials||u(y))&&e.xsrfCookieName?a.read(e.xsrfCookieName):void 0;v&&(d[e.xsrfHeaderName]=v)}"setRequestHeader"in m&&r.forEach(d,(function setRequestHeader(e,t){"undefined"===typeof f&&"content-type"===t.toLowerCase()?delete d[t]:m.setRequestHeader(t,e)})),r.isUndefined(e.withCredentials)||(m.withCredentials=!!e.withCredentials),p&&"json"!==p&&(m.responseType=e.responseType),"function"===typeof e.onDownloadProgress&&m.addEventListener("progress",e.onDownloadProgress),"function"===typeof e.onUploadProgress&&m.upload&&m.upload.addEventListener("progress",e.onUploadProgress),e.cancelToken&&e.cancelToken.promise.then((function onCanceled(e){m&&(m.abort(),n(e),m=null)})),f||(f=null),m.send(f)}))}},456:function(e,t,n){"use strict";var r=n(390),o=n(691),a=n(963),i=n(881);function createInstance(e){var t=new a(e),n=o(a.prototype.request,t);return r.extend(n,a.prototype,t),r.extend(n,t),n}var s=createInstance(n(754));s.Axios=a,s.create=function create(e){return createInstance(i(s.defaults,e))},s.Cancel=n(681),s.CancelToken=n(335),s.isCancel=n(114),s.all=function all(e){return Promise.all(e)},s.spread=n(852),s.isAxiosError=n(481),e.exports=s,e.exports.default=s},681:function(e){"use strict";function Cancel(e){this.message=e}Cancel.prototype.toString=function toString(){return"Cancel"+(this.message?": "+this.message:"")},Cancel.prototype.__CANCEL__=!0,e.exports=Cancel},335:function(e,t,n){"use strict";var r=n(681);function CancelToken(e){if("function"!==typeof e)throw new TypeError("executor must be a function.");var t;this.promise=new Promise((function promiseExecutor(e){t=e}));var n=this;e((function cancel(e){n.reason||(n.reason=new r(e),t(n.reason))}))}CancelToken.prototype.throwIfRequested=function throwIfRequested(){if(this.reason)throw this.reason},CancelToken.source=function source(){var e;return{token:new CancelToken((function executor(t){e=t})),cancel:e}},e.exports=CancelToken},114:function(e){"use strict";e.exports=function isCancel(e){return!(!e||!e.__CANCEL__)}},963:function(e,t,n){"use strict";var r=n(390),o=n(359),a=n(550),i=n(404),s=n(881),c=n(938),u=c.validators;function Axios(e){this.defaults=e,this.interceptors={request:new a,response:new a}}Axios.prototype.request=function request(e){"string"===typeof e?(e=arguments[1]||{}).url=arguments[0]:e=e||{},(e=s(this.defaults,e)).method?e.method=e.method.toLowerCase():this.defaults.method?e.method=this.defaults.method.toLowerCase():e.method="get";var t=e.transitional;void 0!==t&&c.assertOptions(t,{silentJSONParsing:u.transitional(u.boolean,"1.0.0"),forcedJSONParsing:u.transitional(u.boolean,"1.0.0"),clarifyTimeoutError:u.transitional(u.boolean,"1.0.0")},!1);var n=[],r=!0;this.interceptors.request.forEach((function unshiftRequestInterceptors(t){"function"===typeof t.runWhen&&!1===t.runWhen(e)||(r=r&&t.synchronous,n.unshift(t.fulfilled,t.rejected))}));var o,a=[];if(this.interceptors.response.forEach((function pushResponseInterceptors(e){a.push(e.fulfilled,e.rejected)})),!r){var l=[i,void 0];for(Array.prototype.unshift.apply(l,n),l=l.concat(a),o=Promise.resolve(e);l.length;)o=o.then(l.shift(),l.shift());return o}for(var f=e;n.length;){var d=n.shift(),p=n.shift();try{f=d(f)}catch(m){p(m);break}}try{o=i(f)}catch(m){return Promise.reject(m)}for(;a.length;)o=o.then(a.shift(),a.shift());return o},Axios.prototype.getUri=function getUri(e){return e=s(this.defaults,e),o(e.url,e.params,e.paramsSerializer).replace(/^\?/,"")},r.forEach(["delete","get","head","options"],(function forEachMethodNoData(e){Axios.prototype[e]=function(t,n){return this.request(s(n||{},{method:e,url:t,data:(n||{}).data}))}})),r.forEach(["post","put","patch"],(function forEachMethodWithData(e){Axios.prototype[e]=function(t,n,r){return this.request(s(r||{},{method:e,url:t,data:n}))}})),e.exports=Axios},550:function(e,t,n){"use strict";var r=n(390);function InterceptorManager(){this.handlers=[]}InterceptorManager.prototype.use=function use(e,t,n){return this.handlers.push({fulfilled:e,rejected:t,synchronous:!!n&&n.synchronous,runWhen:n?n.runWhen:null}),this.handlers.length-1},InterceptorManager.prototype.eject=function eject(e){this.handlers[e]&&(this.handlers[e]=null)},InterceptorManager.prototype.forEach=function forEach(e){r.forEach(this.handlers,(function forEachHandler(t){null!==t&&e(t)}))},e.exports=InterceptorManager},215:function(e,t,n){"use strict";var r=n(53),o=n(981);e.exports=function buildFullPath(e,t){return e&&!r(t)?o(e,t):t}},547:function(e,t,n){"use strict";var r=n(420);e.exports=function createError(e,t,n,o,a){var i=new Error(e);return r(i,t,n,o,a)}},404:function(e,t,n){"use strict";var r=n(390),o=n(647),a=n(114),i=n(754);function throwIfCancellationRequested(e){e.cancelToken&&e.cancelToken.throwIfRequested()}e.exports=function dispatchRequest(e){return throwIfCancellationRequested(e),e.headers=e.headers||{},e.data=o.call(e,e.data,e.headers,e.transformRequest),e.headers=r.merge(e.headers.common||{},e.headers[e.method]||{},e.headers),r.forEach(["delete","get","head","post","put","patch","common"],(function cleanHeaderConfig(t){delete e.headers[t]})),(e.adapter||i.adapter)(e).then((function onAdapterResolution(t){return throwIfCancellationRequested(e),t.data=o.call(e,t.data,t.headers,e.transformResponse),t}),(function onAdapterRejection(t){return a(t)||(throwIfCancellationRequested(e),t&&t.response&&(t.response.data=o.call(e,t.response.data,t.response.headers,e.transformResponse))),Promise.reject(t)}))}},420:function(e){"use strict";e.exports=function enhanceError(e,t,n,r,o){return e.config=t,n&&(e.code=n),e.request=r,e.response=o,e.isAxiosError=!0,e.toJSON=function toJSON(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:this.config,code:this.code}},e}},881:function(e,t,n){"use strict";var r=n(390);e.exports=function mergeConfig(e,t){t=t||{};var n={},o=["url","method","data"],a=["headers","auth","proxy","params"],i=["baseURL","transformRequest","transformResponse","paramsSerializer","timeout","timeoutMessage","withCredentials","adapter","responseType","xsrfCookieName","xsrfHeaderName","onUploadProgress","onDownloadProgress","decompress","maxContentLength","maxBodyLength","maxRedirects","transport","httpAgent","httpsAgent","cancelToken","socketPath","responseEncoding"],s=["validateStatus"];function getMergedValue(e,t){return r.isPlainObject(e)&&r.isPlainObject(t)?r.merge(e,t):r.isPlainObject(t)?r.merge({},t):r.isArray(t)?t.slice():t}function mergeDeepProperties(o){r.isUndefined(t[o])?r.isUndefined(e[o])||(n[o]=getMergedValue(void 0,e[o])):n[o]=getMergedValue(e[o],t[o])}r.forEach(o,(function valueFromConfig2(e){r.isUndefined(t[e])||(n[e]=getMergedValue(void 0,t[e]))})),r.forEach(a,mergeDeepProperties),r.forEach(i,(function defaultToConfig2(o){r.isUndefined(t[o])?r.isUndefined(e[o])||(n[o]=getMergedValue(void 0,e[o])):n[o]=getMergedValue(void 0,t[o])})),r.forEach(s,(function merge(r){r in t?n[r]=getMergedValue(e[r],t[r]):r in e&&(n[r]=getMergedValue(void 0,e[r]))}));var c=o.concat(a).concat(i).concat(s),u=Object.keys(e).concat(Object.keys(t)).filter((function filterAxiosKeys(e){return-1===c.indexOf(e)}));return r.forEach(u,mergeDeepProperties),n}},72:function(e,t,n){"use strict";var r=n(547);e.exports=function settle(e,t,n){var o=n.config.validateStatus;n.status&&o&&!o(n.status)?t(r("Request failed with status code "+n.status,n.config,null,n.request,n)):e(n)}},647:function(e,t,n){"use strict";var r=n(390),o=n(754);e.exports=function transformData(e,t,n){var a=this||o;return r.forEach(n,(function transform(n){e=n.call(a,e,t)})),e}},754:function(e,t,n){"use strict";var r=n(390),o=n(698),a=n(420),i={"Content-Type":"application/x-www-form-urlencoded"};function setContentTypeIfUnset(e,t){!r.isUndefined(e)&&r.isUndefined(e["Content-Type"])&&(e["Content-Type"]=t)}var s={transitional:{silentJSONParsing:!0,forcedJSONParsing:!0,clarifyTimeoutError:!1},adapter:function getDefaultAdapter(){var e;return("undefined"!==typeof XMLHttpRequest||"undefined"!==typeof process&&"[object process]"===Object.prototype.toString.call(process))&&(e=n(990)),e}(),transformRequest:[function transformRequest(e,t){return o(t,"Accept"),o(t,"Content-Type"),r.isFormData(e)||r.isArrayBuffer(e)||r.isBuffer(e)||r.isStream(e)||r.isFile(e)||r.isBlob(e)?e:r.isArrayBufferView(e)?e.buffer:r.isURLSearchParams(e)?(setContentTypeIfUnset(t,"application/x-www-form-urlencoded;charset=utf-8"),e.toString()):r.isObject(e)||t&&"application/json"===t["Content-Type"]?(setContentTypeIfUnset(t,"application/json"),function stringifySafely(e,t,n){if(r.isString(e))try{return(t||JSON.parse)(e),r.trim(e)}catch(o){if("SyntaxError"!==o.name)throw o}return(n||JSON.stringify)(e)}(e)):e}],transformResponse:[function transformResponse(e){var t=this.transitional,n=t&&t.silentJSONParsing,o=t&&t.forcedJSONParsing,i=!n&&"json"===this.responseType;if(i||o&&r.isString(e)&&e.length)try{return JSON.parse(e)}catch(s){if(i){if("SyntaxError"===s.name)throw a(s,this,"E_JSON_PARSE");throw s}}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,validateStatus:function validateStatus(e){return e>=200&&e<300},headers:{common:{Accept:"application/json, text/plain, */*"}}};r.forEach(["delete","get","head"],(function forEachMethodNoData(e){s.headers[e]={}})),r.forEach(["post","put","patch"],(function forEachMethodWithData(e){s.headers[e]=r.merge(i)})),e.exports=s},691:function(e){"use strict";e.exports=function bind(e,t){return function wrap(){for(var n=new Array(arguments.length),r=0;r<n.length;r++)n[r]=arguments[r];return e.apply(t,n)}}},359:function(e,t,n){"use strict";var r=n(390);function encode(e){return encodeURIComponent(e).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}e.exports=function buildURL(e,t,n){if(!t)return e;var o;if(n)o=n(t);else if(r.isURLSearchParams(t))o=t.toString();else{var a=[];r.forEach(t,(function serialize(e,t){null!==e&&"undefined"!==typeof e&&(r.isArray(e)?t+="[]":e=[e],r.forEach(e,(function parseValue(e){r.isDate(e)?e=e.toISOString():r.isObject(e)&&(e=JSON.stringify(e)),a.push(encode(t)+"="+encode(e))})))})),o=a.join("&")}if(o){var i=e.indexOf("#");-1!==i&&(e=e.slice(0,i)),e+=(-1===e.indexOf("?")?"?":"&")+o}return e}},981:function(e){"use strict";e.exports=function combineURLs(e,t){return t?e.replace(/\/+$/,"")+"/"+t.replace(/^\/+/,""):e}},894:function(e,t,n){"use strict";var r=n(390);e.exports=r.isStandardBrowserEnv()?function standardBrowserEnv(){return{write:function write(e,t,n,o,a,i){var s=[];s.push(e+"="+encodeURIComponent(t)),r.isNumber(n)&&s.push("expires="+new Date(n).toGMTString()),r.isString(o)&&s.push("path="+o),r.isString(a)&&s.push("domain="+a),!0===i&&s.push("secure"),document.cookie=s.join("; ")},read:function read(e){var t=document.cookie.match(new RegExp("(^|;\\s*)("+e+")=([^;]*)"));return t?decodeURIComponent(t[3]):null},remove:function remove(e){this.write(e,"",Date.now()-864e5)}}}():{write:function write(){},read:function read(){return null},remove:function remove(){}}},53:function(e){"use strict";e.exports=function isAbsoluteURL(e){return/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(e)}},481:function(e){"use strict";function _typeof(e){return(_typeof="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function _typeof(e){return typeof e}:function _typeof(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}e.exports=function isAxiosError(e){return"object"===_typeof(e)&&!0===e.isAxiosError}},763:function(e,t,n){"use strict";var r=n(390);e.exports=r.isStandardBrowserEnv()?function standardBrowserEnv(){var e,t=/(msie|trident)/i.test(navigator.userAgent),n=document.createElement("a");function resolveURL(e){var r=e;return t&&(n.setAttribute("href",r),r=n.href),n.setAttribute("href",r),{href:n.href,protocol:n.protocol?n.protocol.replace(/:$/,""):"",host:n.host,search:n.search?n.search.replace(/^\?/,""):"",hash:n.hash?n.hash.replace(/^#/,""):"",hostname:n.hostname,port:n.port,pathname:"/"===n.pathname.charAt(0)?n.pathname:"/"+n.pathname}}return e=resolveURL(window.location.href),function isURLSameOrigin(t){var n=r.isString(t)?resolveURL(t):t;return n.protocol===e.protocol&&n.host===e.host}}():function isURLSameOrigin(){return!0}},698:function(e,t,n){"use strict";var r=n(390);e.exports=function normalizeHeaderName(e,t){r.forEach(e,(function processHeader(n,r){r!==t&&r.toUpperCase()===t.toUpperCase()&&(e[t]=n,delete e[r])}))}},758:function(e,t,n){"use strict";var r=n(390),o=["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"];e.exports=function parseHeaders(e){var t,n,a,i={};return e?(r.forEach(e.split("\n"),(function parser(e){if(a=e.indexOf(":"),t=r.trim(e.substr(0,a)).toLowerCase(),n=r.trim(e.substr(a+1)),t){if(i[t]&&o.indexOf(t)>=0)return;i[t]="set-cookie"===t?(i[t]?i[t]:[]).concat([n]):i[t]?i[t]+", "+n:n}})),i):i}},852:function(e){"use strict";e.exports=function spread(e){return function wrap(t){return e.apply(null,t)}}},938:function(e,t,n){"use strict";function _typeof(e){return(_typeof="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function _typeof(e){return typeof e}:function _typeof(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var r=n(671),o={};["object","boolean","number","function","string","symbol"].forEach((function(e,t){o[e]=function validator(n){return _typeof(n)===e||"a"+(t<1?"n ":" ")+e}}));var a={},i=r.version.split(".");function isOlderVersion(e,t){for(var n=t?t.split("."):i,r=e.split("."),o=0;o<3;o++){if(n[o]>r[o])return!0;if(n[o]<r[o])return!1}return!1}o.transitional=function transitional(e,t,n){var o=t&&isOlderVersion(t);function formatMessage(e,t){return"[Axios v"+r.version+"] Transitional option '"+e+"'"+t+(n?". "+n:"")}return function(n,r,i){if(!1===e)throw new Error(formatMessage(r," has been removed in "+t));return o&&!a[r]&&(a[r]=!0,console.warn(formatMessage(r," has been deprecated since v"+t+" and will be removed in the near future"))),!e||e(n,r,i)}},e.exports={isOlderVersion:isOlderVersion,assertOptions:function assertOptions(e,t,n){if("object"!==_typeof(e))throw new TypeError("options must be an object");for(var r=Object.keys(e),o=r.length;o-- >0;){var a=r[o],i=t[a];if(i){var s=e[a],c=void 0===s||i(s,a,e);if(!0!==c)throw new TypeError("option "+a+" must be "+c)}else if(!0!==n)throw Error("Unknown option "+a)}},validators:o}},390:function(e,t,n){"use strict";function _typeof(e){return(_typeof="function"===typeof Symbol&&"symbol"===typeof Symbol.iterator?function _typeof(e){return typeof e}:function _typeof(e){return e&&"function"===typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}var r=n(691),o=Object.prototype.toString;function isArray(e){return"[object Array]"===o.call(e)}function isUndefined(e){return"undefined"===typeof e}function isObject(e){return null!==e&&"object"===_typeof(e)}function isPlainObject(e){if("[object Object]"!==o.call(e))return!1;var t=Object.getPrototypeOf(e);return null===t||t===Object.prototype}function isFunction(e){return"[object Function]"===o.call(e)}function forEach(e,t){if(null!==e&&"undefined"!==typeof e)if("object"!==_typeof(e)&&(e=[e]),isArray(e))for(var n=0,r=e.length;n<r;n++)t.call(null,e[n],n,e);else for(var o in e)Object.prototype.hasOwnProperty.call(e,o)&&t.call(null,e[o],o,e)}e.exports={isArray:isArray,isArrayBuffer:function isArrayBuffer(e){return"[object ArrayBuffer]"===o.call(e)},isBuffer:function isBuffer(e){return null!==e&&!isUndefined(e)&&null!==e.constructor&&!isUndefined(e.constructor)&&"function"===typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)},isFormData:function isFormData(e){return"undefined"!==typeof FormData&&e instanceof FormData},isArrayBufferView:function isArrayBufferView(e){return"undefined"!==typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(e):e&&e.buffer&&e.buffer instanceof ArrayBuffer},isString:function isString(e){return"string"===typeof e},isNumber:function isNumber(e){return"number"===typeof e},isObject:isObject,isPlainObject:isPlainObject,isUndefined:isUndefined,isDate:function isDate(e){return"[object Date]"===o.call(e)},isFile:function isFile(e){return"[object File]"===o.call(e)},isBlob:function isBlob(e){return"[object Blob]"===o.call(e)},isFunction:isFunction,isStream:function isStream(e){return isObject(e)&&isFunction(e.pipe)},isURLSearchParams:function isURLSearchParams(e){return"undefined"!==typeof URLSearchParams&&e instanceof URLSearchParams},isStandardBrowserEnv:function isStandardBrowserEnv(){return("undefined"===typeof navigator||"ReactNative"!==navigator.product&&"NativeScript"!==navigator.product&&"NS"!==navigator.product)&&("undefined"!==typeof window&&"undefined"!==typeof document)},forEach:forEach,merge:function merge(){var e={};function assignValue(t,n){isPlainObject(e[n])&&isPlainObject(t)?e[n]=merge(e[n],t):isPlainObject(t)?e[n]=merge({},t):isArray(t)?e[n]=t.slice():e[n]=t}for(var t=0,n=arguments.length;t<n;t++)forEach(arguments[t],assignValue);return e},extend:function extend(e,t,n){return forEach(t,(function assignValue(t,o){e[o]=n&&"function"===typeof t?r(t,n):t})),e},trim:function trim(e){return e.trim?e.trim():e.replace(/^\s+|\s+$/g,"")},stripBOM:function stripBOM(e){return 65279===e.charCodeAt(0)&&(e=e.slice(1)),e}}},525:function(e){"use strict";e.exports=function makeYoutubeEmbed(e){if("string"===typeof e){var t=function getId(e){var t=e.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/);if(t&&11==t[2].length)return t[2]}(e);return t?"//www.youtube.com/embed/"+t:void 0}}},671:function(e){"use strict";e.exports=JSON.parse('{"name":"axios","version":"0.21.4","description":"Promise based HTTP client for the browser and node.js","main":"index.js","scripts":{"test":"grunt test","start":"node ./sandbox/server.js","build":"NODE_ENV=production grunt build","preversion":"npm test","version":"npm run build && grunt version && git add -A dist && git add CHANGELOG.md bower.json package.json","postversion":"git push && git push --tags","examples":"node ./examples/server.js","coveralls":"cat coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js","fix":"eslint --fix lib/**/*.js"},"repository":{"type":"git","url":"https://github.com/axios/axios.git"},"keywords":["xhr","http","ajax","promise","node"],"author":"Matt Zabriskie","license":"MIT","bugs":{"url":"https://github.com/axios/axios/issues"},"homepage":"https://axios-http.com","devDependencies":{"coveralls":"^3.0.0","es6-promise":"^4.2.4","grunt":"^1.3.0","grunt-banner":"^0.6.0","grunt-cli":"^1.2.0","grunt-contrib-clean":"^1.1.0","grunt-contrib-watch":"^1.0.0","grunt-eslint":"^23.0.0","grunt-karma":"^4.0.0","grunt-mocha-test":"^0.13.3","grunt-ts":"^6.0.0-beta.19","grunt-webpack":"^4.0.2","istanbul-instrumenter-loader":"^1.0.0","jasmine-core":"^2.4.1","karma":"^6.3.2","karma-chrome-launcher":"^3.1.0","karma-firefox-launcher":"^2.1.0","karma-jasmine":"^1.1.1","karma-jasmine-ajax":"^0.1.13","karma-safari-launcher":"^1.0.0","karma-sauce-launcher":"^4.3.6","karma-sinon":"^1.0.5","karma-sourcemap-loader":"^0.3.8","karma-webpack":"^4.0.2","load-grunt-tasks":"^3.5.2","minimist":"^1.2.0","mocha":"^8.2.1","sinon":"^4.5.0","terser-webpack-plugin":"^4.2.3","typescript":"^4.0.5","url-search-params":"^0.10.0","webpack":"^4.44.2","webpack-dev-server":"^3.11.0"},"browser":{"./lib/adapters/http.js":"./lib/adapters/xhr.js"},"jsdelivr":"dist/axios.min.js","unpkg":"dist/axios.min.js","typings":"./index.d.ts","dependencies":{"follow-redirects":"^1.14.0"},"bundlesize":[{"path":"./dist/axios.min.js","threshold":"5kB"}]}')}},t={};function __webpack_require__(n){var r=t[n];if(void 0!==r)return r.exports;var o=t[n]={exports:{}};return e[n](o,o.exports,__webpack_require__),o.exports}!function(){"use strict";var e="ajax-load",t="load";function _toConsumableArray(e){return function _arrayWithoutHoles(e){if(Array.isArray(e))return _arrayLikeToArray(e)}(e)||function _iterableToArray(e){if("undefined"!==typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||function _unsupportedIterableToArray(e,t){if(!e)return;if("string"===typeof e)return _arrayLikeToArray(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(e,t)}(e)||function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _defineProperties(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function _defineProperty(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var n=window,r=__webpack_require__(617),o=function(){function MetaWindow(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{shown:!1},o=arguments.length>1?arguments[1]:void 0;_classCallCheck(this,MetaWindow),_defineProperty(this,"state",{content:"",type:["empty"],shown:!1,loading:!1,error:!1,embed:!1,collections:[],current:null,target:null}),_defineProperty(this,"show",(function(){var t=e;console.log("".concat(t.name,": show")),t.setState({shown:!0}),n.dispatchEvent(new Event("{ui.name}.show"))})),_defineProperty(this,"hide",(function(){var t=e;console.log("".concat(t.name,": hide")),t.setState({shown:!1}),n.dispatchEvent(new Event("{ui.name}.hide"))})),_defineProperty(this,"next",(function(){var t=e,r=t.state.current.getAttribute("data-gallery"),o=t._currIndex();o<t.state.collections[r].length-1?o++:o=0,t.state.collections[r][o].click(),console.log("".concat(t.name,": next")),n.dispatchEvent(new Event("{ui.name}.next"))})),_defineProperty(this,"prev",(function(){var t=e,r=t.state.current.getAttribute("data-gallery"),o=t._currIndex();o>0?o--:o=t.state.collections[r].length-1,t.state.collections[r][o].click(),console.log("".concat(t.name,": prev")),n.dispatchEvent(new Event("{ui.name}.prev"))})),_defineProperty(this,"reset",(function(){e.setState({content:"",type:["empty"],shown:!1,loading:!1,error:!1,embed:!1})})),_defineProperty(this,"load",(function(t){var r=e,o=r.axios;r.reset(),r.setState({loading:!0}),r.show(),o.get(t,{responseType:"arraybuffer"}).then((function(e){console.log("".concat(r.name,": response content-type: ").concat(e.headers["content-type"]));switch(e.headers["content-type"]){case"image/jpeg":case"image/png":case"image/svg+xml":case"image/bmp":case"image/gif":case"image/tiff":case"image/webp":case"image/jpg":case"image/svg":r.setContent('<img src="data:'.concat(e.headers["content-type"],";base64,").concat(r._imageEncode(e.data),'" />'),"meta-".concat(r.name,"--image"));break;case"application/json":case"application/ld+json":case"application/json; charset=UTF-8":r.setContent("".concat((!1).Content),["meta-".concat(r.name,"--text"),"meta-".concat(r.name,"--html"),"meta-".concat(r.name,"--json")]);break;case"text/html":case"application/xhtml+xml":case"text/plain":case"text/html; charset=UTF-8":case"application/xhtml+xml; charset=UTF-8":case"text/plain; charset=UTF-8":r.setContent(r._abToString(e.data),["meta-".concat(r.name,"--text"),"meta-".concat(r.name,"--html"),"meta-".concat(r.name,"--pajax")]);break;default:console.warn("".concat(r.name,": Unknown response content-type!"))}n.dispatchEvent(new Event("{ui.name}.loaded"))})).catch((function(e){console.error(e);var t="";if(e.response)switch(e.response.status){case 404:t="Not Found.";break;case 500:t="Server issue, please try again latter.";break;default:t="Something went wrong."}else e.request?t="No response received":console.warn("Error",e.message);r.setState({error:t}),n.dispatchEvent(new Event("{ui.name}.error"))})).then((function(){r.setState({loading:!1})}))})),_defineProperty(this,"_currIndex",(function(){var t=e,n=t.state.current,r=n.getAttribute("data-gallery");return t.state.collections[r].indexOf(n)})),_defineProperty(this,"embed",(function(t){var n=e;console.log("".concat(n.name,": embed")),n.reset(),n.setState({embed:t,loading:!1,type:["meta-".concat(n.name,"--embed"),"meta-".concat(n.name,"--video")]}),n.show()})),_defineProperty(this,"setCaption",(function(t){var n=e;console.log("".concat(n.name,": setCaption")),n.state.caption=t})),_defineProperty(this,"getCaption",(function(){return e.state.caption})),_defineProperty(this,"_abToString",(function(e){return String.fromCharCode.apply(null,new Uint8Array(e))})),_defineProperty(this,"_imageEncode",(function(e){new Uint8Array(e);return btoa([].reduce.call(new Uint8Array(e),(function(e,t){return e+String.fromCharCode(t)}),""))})),_defineProperty(this,"setContent",(function(t,n){var r=e;console.log("".concat(r.name,": setContent"));var o=n||["meta-".concat(r.name,"--html"),"meta-".concat(r.name,"--text")];Array.isArray(o)||(o=n.split(" ")),r.setState({content:t,type:o})})),_defineProperty(this,"getHtml",(function(){var t=e;if(t.state.embed){var n=__webpack_require__(525)(t.state.embed);t.state.content='<iframe width="600" height="380" src="'.concat(n,'" frameborder="0"></iframe>')}return t.state.content}));var a=this;switch(a.name=a.constructor.name,console.log("".concat(a.name,": init")),a.axios=r,a.setState(t),o){case"show":case"hide":a.hide()}n.dispatchEvent(new Event("{ui.name}.init"))}return function _createClass(e,t,n){return t&&_defineProperties(e.prototype,t),n&&_defineProperties(e,n),e}(MetaWindow,[{key:"init",value:function init(){var e=this;console.log("MetaWindow: [links] init"),document.querySelectorAll('[data-toggle="lightbox"],[data-gallery="${gallery}"]').forEach((function(t){var n=t.getAttribute("data-gallery");n&&(e.state.collections[n]=[],document.querySelectorAll('[data-toggle="lightbox"][data-gallery="'.concat(n,'"]')).forEach((function(t){e.state.collections[n].push(t)}))),t.addEventListener("click",(function(t){t.preventDefault(),console.log("MetaWindow: [link] click");var n=t.currentTarget,r=n.getAttribute("href")||n.getAttribute("data-href"),o=n.getAttribute("data-embed");e.state.current=n,o?e.embed(r):e.load(r);var a=n.getAttribute("data-title");a&&e.setCaption(a)}))}))}},{key:"setState",value:function setState(e){var t=this;t.state=Object.assign({},t.state,e),t.render()}},{key:"render",value:function render(){var e,t=this,n=t.name,r=t.state.current;t.state.target.innerHTML="";var o=document.createElement("div");o.classList.add("meta-".concat(n)),(e=o.classList).add.apply(e,_toConsumableArray(t.state.type)),t.state.target.append(o);var a=document.createElement("div");a.classList.add("meta-".concat(n,"-overlay")),t.state.shown&&a.classList.add("meta-".concat(n,"-overlay--open")),t.state.loading&&a.classList.add("meta-".concat(n,"-overlay--loading")),t.state.error&&a.classList.add("meta-".concat(n,"-overlay--error")),o.append(a);var i=document.createElement("div");i.classList.add("meta-content"),a.append(i);var s=document.createElement("button");if(s.classList.add("meta-nav","meta-close","a"),s.innerHTML='<i class="icon fa fas fa-times"></i> <span class="visually-hidden">Close</span>',s.addEventListener("click",(function(e){e.preventDefault(),t.hide()})),i.append(s),r){var c=r.getAttribute("data-gallery");if(c&&t.state.collections[c].length>1){var u=document.createElement("nav");u.classList.add("meta-navs");var l=document.createElement("button");l.classList.add("meta-nav","meta-nav-arrow","meta-nav-arrow__prev","a"),l.innerHTML='<i class="icon fa fas fa-chevron-left"></i> <span class="visually-hidden">Previous</span>',l.addEventListener("click",(function(e){e.preventDefault(),t.prev()})),u.append(l);var f=document.createElement("button");f.classList.add("meta-nav","meta-nav-arrow","meta-nav-arrow__next","a"),f.innerHTML='<i class="icon fa fas fa-chevron-right"></i> <span class="visually-hidden">Next</span>',f.addEventListener("click",(function(e){e.preventDefault(),t.next()})),u.append(f),i.append(u)}}var d=document.createElement("section");if(d.classList.add("meta-wrap","typography"),d.innerHTML=t.getHtml(),i.append(d),t.state.error){var p=document.createElement("div");p.classList.add("meta-error"),p.innerHTML=t.state.error,i.append(p)}else if(t.state.caption){var m=document.createElement("div");m.classList.add("meta-caption"),m.innerHTML=t.getCaption(),i.append(m)}return t}}]),MetaWindow}(),a=document.getElementById("MetaLightboxApp");a||console.log("MetaWindow: missing container #MetaLightboxApp");var i=new o({target:a}),s=function init(){i.init()};window.addEventListener("".concat(t),s),window.addEventListener("".concat(e),s),window.addEventListener("MetaWindow.initLinks",s),window.MetaWindow=i}()}();