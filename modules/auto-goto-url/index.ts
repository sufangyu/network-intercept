import { defaultConfigList } from './config';
import { AUTO_GOTO_URL_REDIRECT_TYPE_ENUM, AutoGotoUrl } from './types';

/**
 * 移除协议
 *
 * @param {string} url
 * @return {*}
 */
const removeProtocol = (url: string): string => {
  return url.replace(/^https?\??:\/\//gm, '');
};

/**
 * 是否匹配规则
 *
 * @param {string} pattern URL 匹配规则
 * @param {boolean} [enableRegex=false] 是否是正则表达式
 * @return {*}
 */
const matchRule = (pattern: string, enableRegex: boolean = false): boolean => {
  const curURL = window.location.href;
  const curURLProto = removeProtocol(curURL);
  pattern = removeProtocol(pattern);

  if (enableRegex) {
    return curURLProto.search(pattern) > -1;
  }

  return curURLProto.indexOf(pattern) === 0;
};

/**
 * 跳转目标
 *
 * @param {*} targetURLParam 目标 URL 的参数 key
 */
const redirectTo = (targetURLParam: string) => {
  const curURLStr = window.location.href;
  const curURL = new URL(curURLStr);
  let targetURL = curURL.searchParams.get(targetURLParam);

  if (!targetURL) {
    return;
  }

  // 跳转目标地址补全协议
  if (targetURL.indexOf('http://') !== 0 && targetURL.indexOf('https://') !== 0) {
    targetURL = 'https://' + targetURL;
  }

  window.location.replace(targetURL);
};

/**
 * 运行自动跳转处理逻辑
 *
 * @param {AutoGotoUrl} autoGotoUrl
 */
const runAutoGotoUrl = async (autoGotoUrl: AutoGotoUrl) => {
  const { toggle, configList = [] } = autoGotoUrl ?? {};
  const curConfigList = toggle
    ? [...defaultConfigList, ...configList].filter((item) => item.status === 'enabled')
    : [];

  curConfigList.forEach((config) => {
    const { match, enableRegex = false, redirectType, redirect } = config;
    const isMatch = matchRule(match, enableRegex);

    if (!isMatch) {
      return;
    }

    switch (redirectType) {
      case AUTO_GOTO_URL_REDIRECT_TYPE_ENUM.目标Key:
        redirectTo(redirect as string);
        break;
      case AUTO_GOTO_URL_REDIRECT_TYPE_ENUM.执行程序:
        try {
          const func = new Function(redirect);
          func();
        } catch (error) {
          console.log(
            `%c[${getExtensionName}]%c${'自动跳转配置'}-${config.name}`,
            pluginStyleScoped,
            scopedStyle,
            `函数类型执行错误`,
            error
          );
        }

        break;
      default:
        console.log(
          `%c[${getExtensionName}]%c${'自动跳转配置'}-${config.name}`,
          pluginStyleScoped,
          scopedStyle,
          `${config.name} redirect 规则类型错误`
        );
        break;
    }
  });
};

/**
 * 初始化自动跳转
 *
 */
export const initAutoGotoUrl = async () => {
  const autoGotoUrlConfigRes = await postMessageWithPromise<AutoGotoUrl>({
    actionType: MESSAGE_EVENT_DATA_ACTION_TYPE.获取自动跳转配置
  });

  // FIX: 使用 setInterval 轮询方式等待页面加载完成后再执行,
  // 避免使用监听 load 事件不会触发 run 函数
  const intervalId = setInterval(() => {
    if (document.readyState !== 'complete') {
      return;
    }

    runAutoGotoUrl(autoGotoUrlConfigRes);
    clearInterval(intervalId);
  }, 250);
};
