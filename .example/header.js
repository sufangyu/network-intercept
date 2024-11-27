const request = (url) => {
  return fetch(url).then((res) => res.json());
}


// 阻止请求
var $blockRequest = document.querySelector('#blockRequest');
$blockRequest.addEventListener('click', () => {
  const url = 'https://www.example.com/api/block-request';
  request(url).then((res) => {
    console.log('阻止请求 =>>', res);
  });
});

// 重定向请求
var $redirectRequest = document.querySelector('#redirectRequest');
$redirectRequest.addEventListener('click', () => {
  const url = 'https://www.example.com/api/redirect-request';
  request(url).then((res) => {
    console.log('重定向请求 =>>', res);
  });
});


// 修改请求头
var $modifyRequestHeader = document.querySelector('#modifyRequestHeader');
$modifyRequestHeader.addEventListener('click', () => {
  const url = 'https://www.example.com/api/modify-request-header';
  request(url).then((res) => {
    console.log('修改请求头 =>>', res);
  });
});


// 修改响应头
var $modifyResponseHeader = document.querySelector('#modifyResponseHeader');
$modifyResponseHeader.addEventListener('click', () => {
  const url = 'https://echo.apifox.com/get';
  request(url).then((res) => {
    console.log('修改响应头 =>>', res);
  });
});
