import ToastApp from './toast-app';

const createToastWrapper = () => {
  const $toastEle = document.createElement('div');
  $toastEle.classList.add('network-intercept-mock-toast');
  $toastEle.id = 'network-intercept-mock-toast';
  const styleStr = `
    position: fixed;
    z-index: 99999;
    bottom: 10px;
    right: 10px;
  `;
  $toastEle.setAttribute('style', styleStr);
  document.body.appendChild($toastEle);
  return $toastEle;
};

export const renderToast = (() => {
  let destroy: Function;
  let $toastEle: HTMLDivElement | null = null;

  return (request: Request, response: Response) => {
    if (!$toastEle) {
      $toastEle = createToastWrapper();
    }

    // // 只创建唯一的 toast
    // destroy?.();
    destroy = magicRender(new ToastApp(request, response), () => $toastEle);
  };
})();
