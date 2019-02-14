# VUE-YP-HTTP

基于axios使用在vue上的HTTP组件，根据YP业务二次封装。

## Installing
Using yarn:
```
$ yarn add vue-yp-http
```

## Example

Use in Vue
```
    import YpHttp from 'vue-yp-http';

    Vue.use(YpHttp, {
        method: '$yphttp', // custom invoke method name, default $http, recommended use default value
        path: '/api', // set global request path
    });


    // in vue scope
    ...
    
    this.$
    
    ...


```

Performing a `POST` request, `$http.post(method, {params}, {options})`
```
    // method, biz_method
    // params，biz_content
    this.$http.post(method, {params})
        .then(resp=>{
            console.log(resp.data);
        }).catch(err=>{
            console.log(err);        
        });
```

Performing a `UPLOAD`  `POST` request, `$http.upload({params}, {options})`
```
    this.$http.upload({
        method: '', // biz_method
        UploadFile: ''
    }).then(resp=>{
        console.log(resp.data);
    }).catch(err=>{
        console.log(err);        
    });
```

Performing a `DOWNLOAD`  `POST` request, `$http.download(method,{params}, {options})`
```
    this.$http.download(
        method, // biz_method
        params, // biz_content
    ).then(resp=>{
            console.log(resp.data);
        }).catch(err=>{
            console.log(err);        
        });
```

Performing a `DOWNLOADFILE`  `POST` request, `$http.downloadFile(method,{params})`, use post method to submit a form, than download a file
```
    this.$http.downloadFile(
        method, // biz_method
        params, // biz_content
    )
```
