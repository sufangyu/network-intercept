const requestFn = (url, options = {}) => {
  return fetch(url, options).then((res) => {
    console.log('===================================================');
    res.headers.forEach((value, key) => {
      console.log('ResponseHeader =>>', key, value);
    });
    console.log('===================================================');

    return res.json()
  });
}


// 常规-GET请求
var $normalGetRequest = document.querySelector('#normalGetRequest');
$normalGetRequest.addEventListener('click', function () {
  const url = 'https://echo.apifox.com/get';
  requestFn(url).then((res) => {
    console.log('常规-GET请求 =>>', res);
  });
});

// 常规-POST请求
var $normalPostRequest = document.querySelector('#normalPostRequest');
$normalPostRequest.addEventListener('click', function () {
  const url = 'https://echo.apifox.com/post';
  requestFn(url, { method: 'POST' }).then((res) => {
    console.log('常规-POST请求 =>>', res);
  });
});

// 常规-PUT请求
var $normalPutRequest = document.querySelector('#normalPutRequest');
$normalPutRequest.addEventListener('click', function () {
  const url = 'https://echo.apifox.com/put';
  requestFn(url, { method: 'PUT' }).then((res) => {
    console.log('常规-PUT请求 =>>', res);
  });
});

// 常规-DELETE请求
var $normalDeleteRequest = document.querySelector('#normalDeleteRequest');
$normalDeleteRequest.addEventListener('click', function () {
  const url = 'https://echo.apifox.com/delete';
  requestFn(url, { method: 'DELETE' }).then((res) => {
    console.log('常规-DELETE请求 =>>', res);
  });
});

// 常规-PATCH请求
var $normalPatchRequest = document.querySelector('#normalPatchRequest');
$normalPatchRequest.addEventListener('click', function () {
  const url = 'https://echo.apifox.com/patch';
  requestFn(url, { method: 'PATCH' }).then((res) => {
    console.log('常规-PATCH请求 =>>', res);
  });
});


// 重定向-GET请求
var $redirectGetRequest = document.querySelector('#redirectGetRequest');
$redirectGetRequest.addEventListener('click', function () {
  const url = 'https://echo.apifox.com/status/200';
  requestFn(url).then((res) => {
    console.log('重定向-GET请求 =>>', res);
  });
});




// 数据包裹-返回业务响应
var $baseApiPartData = document.querySelector('#baseApiPartData');
$baseApiPartData.addEventListener('click', function () {
  const url = 'https://echo.apifox.com/status/500';
  requestFn(url, { method: 'POST' }).then((res) => {
    console.log('数据包裹-返回业务响应 =>>', res);
  });
});

// 数据包裹-返回完整响应
var $baseApiFullData = document.querySelector('#baseApiFullData');
$baseApiFullData.addEventListener('click', function () {
  const url = 'https://echo.apifox.com/status/404';
  requestFn(url, { method: 'PUT' }).then((res) => {
    console.log('数据包裹-返回完整响应 =>>', res);
  });
});
