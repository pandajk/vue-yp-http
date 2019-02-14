/*
 * @Author: panda
 * @Date:   2018-07-10 15:33:18
 * @Last Modified by:   PandaJ
 * @Last Modified time: 2019-02-14 15:33:52
 */

let is_debug = false;
if (/ypdebug/.test(navigator.userAgent.toLowerCase())) {
  is_debug = true;
}

import axios from 'axios';

function install(Vue, options) {
  const _opt = Object.assign({
    // baseURL: '/',
    // path: '',
    // timeout: 5000,
    // headers: {}
    method: '$http'
  }, options);

  _opt.baseURL && (axios.default.baseURL = _opt.baseURL);

  Vue.prototype[_opt.method] = {};

  const post = function(method, params, options) {
    return new Promise((resolve, reject) => {
      axios.post(options && options.path || _opt.path, {
        method,
        biz_content: params
      }, {
        headers: {
          method
        }
      }).then(resp => {
        is_debug && console.group();
        is_debug && console.log(`%c POST %c ${method} `, 'background: #222; color: #bada55', 'background: green; color: white');
        is_debug && console.log('%c PARAMS ', 'background: #222; color: #fff', params);
        is_debug && console.log('%c RESPONSE ', 'background: #222; color: yellow', resp);
        is_debug && console.groupEnd();
        resolve(resp);
      }).catch((err, resp) => {
        is_debug && console.group();
        is_debug && console.error(`%c POST %c ${method} `, 'background: #222; color: #bada55', 'background: green; color: white');
        is_debug && console.error('%c PARAMS ', 'background: #222; color: #fff', params);
        is_debug && console.error('%c RESPONSE ', 'background: #222; color: yellow', resp);
        is_debug && console.groupEnd();
        reject(err, resp)
      })
    })
  };


  const get = function(method, params, options) {
    return new Promise((resolve, reject) => {

      axios.get(options && options.path || _opt.path, {
        params: {
          method,
          biz_content: params
        }
      }, {
        headers: {
          method
        }
      }).then(resp => {
        is_debug && console.group();
        is_debug && console.log(`%c GET %c ${method} `, 'background: #222; color: #bada55', 'background: green; color: white');
        is_debug && console.log('%c PARAMS ', 'background: #222; color: #fff', params);
        is_debug && console.log('%c RESPONSE ', 'background: #222; color: yellow', resp);
        is_debug && console.groupEnd();
        resolve(resp);
      }).catch((err, resp) => {
        iis_debug && console.group();
        is_debug && console.error(`%c GET %c ${method} `, 'background: #222; color: #bada55', 'background: green; color: white');
        is_debug && console.error('%c PARAMS ', 'background: #222; color: #fff', params);
        is_debug && console.error('%c RESPONSE ', 'background: #222; color: yellow', resp);
        is_debug && console.groupEnd();
        reject(err, resp)
      })
    });
  };

  const upload = function(params, options) {
    return new Promise((resolve, reject) => {
      is_debug && console.log(`%c UPLOAD `, 'background: #222; color: #bada55', params);
      try {
        let _options;
        let formData;
        if (!options || !options.type || options.type == 'form-data') {
          _options = {
            header: {
              'Content-Type': 'multipart/form-data'
            }
          };
          formData = new FormData();
          Object.keys(params).map(key => {
            if (Object.prototype.toString.call(params[key]) == '[object Array]') {
              formData.append(key, params[key][0], params[key][1] || '');
            } else {
              formData.append(key, params[key]);
            }
          })
        }

        _options = Object.assign(_options, options.options);


        resolve(axios.post(options && options.path || _opt.path, formData, _options));
      } catch (err) {
        is_debug && console.error(`%c UPLOAD `, 'background: #222; color: #bada55', resp);
        reject(err)
      }
    })
  };

  const download = function(method, params, options) {
    return new Promise((resolve, reject) => {
      is_debug && console.log(`%c DOWNLOAD %c ${method} `, 'background: #222; color: #bada55', 'background: green; color: white');
      is_debug && console.log('%c PARAMS ', 'background: #222; color: #fff', params);

      let _options = Object.assign({
        responseType: 'blob'
      }, options && options.options);

      axios.post(options && options.path || _opt.path, {
        method,
        biz_content: params
      }, _options).then((resp) => {
        try {
          parseResponseToJSON(resp.data)
            .then(response => {
              is_debug && console.log('%c DOWNLOAD RESPONSE ', 'background: #222; color: yellow', response);


              resolve(Object.assign(resp, {
                data: response
              }));
            }).catch(err => {
              // console.log(err);
              const blob = new Blob([resp.data], {
                type: resp.data.type
              })

              var downloadElement = document.createElement('a');
              var href = window.URL.createObjectURL(blob); //创建下载的链接

              downloadElement.href = href;
              let filename;
              let tmp = decodeURIComponent(resp.headers['content-disposition']);

              if (tmp.match(/filename\*=UTF-8''.+/g)) {
                filename = tmp.match(/filename\*=UTF-8''.+/g)[0].replace("filename*=UTF-8''", '');
              } else if (tmp.match(/filename=.+;/g)) {
                filename = tmp.match(/filename=.+;/g)[0].replace(/(filename=|;)/g, '');
              } else {
                filename = +new Date();
              }

              if (options && options.filename) {
                filename = options.filename;
              }

              downloadElement.download = filename; //下载后文件名

              document.body.appendChild(downloadElement);
              downloadElement.click(); //点击下载

              document.body.removeChild(downloadElement); //下载完成移除元素

              window.URL.revokeObjectURL(href); //释放掉blob对象 
              resolve(resp);
            })

        } catch (err) {
          is_debug && console.error('%c DOWNLOAD ', 'background: #222; color: yellow', err);
          reject(err)
        }
      }).catch(err => {
        is_debug && console.error('%c DOWNLOAD ', 'background: #222; color: yellow', err);

        reject(err);
      })
    })
  };

  const downloadFile = function(method, params, options) {
    return new Promise((resolve, reject) => {
      is_debug && console.log(`%c DOWNLOADFILE %c ${method} `, 'background: #222; color: #bada55', 'background: green; color: white');
      is_debug && console.log('%c PARAMS ', 'background: #222; color: #fff', params);

      const formData = {};
      formData['method'] = method;
      Object.keys(params).map(key=>{
        formData[`biz_content[${key}]`] = params[key];
      });
      mockForm('/api', 'POST', formData);
      resolve('trigger form submit');
    })
  };

  Vue.prototype[_opt.method].get = get;
  Vue.prototype[_opt.method].post = post;
  Vue.prototype[_opt.method].upload = upload;
  Vue.prototype[_opt.method].download = download;
  Vue.prototype[_opt.method].downloadFile = downloadFile;

  Vue.prototype.$axios = axios;

  Vue.yphttp = {
    get: get,
    post: post,
    upload: upload,
    download: download,
    downloadFile: downloadFile
  };
}

// for download method
// parse blob type response to json
function parseResponseToJSON(data) {
  return new Promise((resolve, reject) => {
    try {
      let fr = new FileReader();
      fr.onload = function() {
        try {

          const tmpResp = JSON.parse(this.result);
          if (tmpResp.error_code != 0) {
            resolve(tmpResp);
          }
        } catch (err) {
          reject(err)
        }
      }
      fr.readAsText(data);
    } catch (err) {
      reject(err)
    }
  })
}

function mockForm(url, method, formdata) {
  const form = document.createElement('Form');
  // form.setAttribute('class', 'invisible-form');
  form.setAttribute('action', url);
  form.setAttribute('method', method);
  Object.keys(formdata).map(key => {
    const input = document.createElement('Input');
    input.setAttribute('name', key);
    input.setAttribute('value', formdata[key]);
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
  form.remove();
}

export default install;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install);
  if (install.installed) {
    install.installed = false;
  }
}