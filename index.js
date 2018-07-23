/*
 * @Author: panda
 * @Date:   2018-07-10 15:33:18
 * @Last Modified by:   PandaJ
 * @Last Modified time: 2018-07-23 16:04:47
 */

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

  Vue.prototype[_opt.method].post = function(method, params, options) {
    return axios.post(options && options.path || _opt.path, {
      method,
      biz_content: params
    });
  };


  Vue.prototype[_opt.method].get = function(method, params, options) {
    return axios.get(options && options.path || _opt.path, {
      method,
      biz_content: params
    });
  };

  Vue.prototype[_opt.method].upload = function(params, options) {
    return new Promise((resolve, reject) => {
      try {
        let _options;
        let formData;
        if (!options || !options.type ||options.type == 'form-data') {
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
        reject(err)
      }
    })
  }

  Vue.prototype[_opt.method].download = function(method, params, options) {
    return new Promise((resolve, reject) => {
      let _options = Object.assign({
        responseType: 'blob'
      }, options && options.options);

      axios.post(options && options.path || _opt.path, {
        method,
        biz_content: params
      }, _options).then((resp) => {
        try {
          const blob = new Blob([resp.data], {
            type: resp.data.type
          })

          var downloadElement = document.createElement('a');　　
          var href = window.URL.createObjectURL(blob); //创建下载的链接
          　　
          downloadElement.href = href;
          let tmp = decodeURIComponent(resp.headers['content-disposition']);
          tmp = tmp.match(/filename\*=UTF-8''\W+\.\w+/);

          let filename;
          if (options && options.filename) {
            filename = options.filename;
          } else {
            filename = +new Date();
            if (tmp) {
              filename = tmp[0].replace("filename*=UTF-8''", '');
            }　　
          }
          
          downloadElement.download = filename; //下载后文件名
          　　
          document.body.appendChild(downloadElement);　　
          downloadElement.click(); //点击下载
          　　
          document.body.removeChild(downloadElement); //下载完成移除元素
          　　
          window.URL.revokeObjectURL(href); //释放掉blob对象 
          resolve(resp);
        } catch (err) {
          reject(err)
        }
      }).catch(err => {
        reject(err);
      })
    })
  }


  Vue.prototype.$axios = axios;
}

export default install;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(install);
  if (install.installed) {
    install.installed = false;
  }
}
