import { version } from '../package.json';
import { STORAGE_KEY_RESPONSE_MOCK } from './response-mock/modules/mock/const';
import { ResponseProject } from './response-mock/modules/mock/types';

export default defineContentScript({
  matches: ['*://*/*'],
  runAt: 'document_start',
  async main() {
    window.addEventListener('message', handlePostMessageCallback);

    await injectScript('/injected.js', {
      keepInDom: true
    });

    console.log(`%c[${getExtensionName}]`, pluginStyle, `v${version} 加载完毕!`);
  }
});

/**
 * 处理 postMessage 回调
 *
 * @param {MessageEvent} event
 */
const handlePostMessageCallback = async (event: MessageEvent<MessageEventData>) => {
  const { ports } = event;
  const { actionType, id, payload } = event.data;
  const port = ports[0];
  // console.log(`[${getExtensionName}]: 收到消息`, event.data);

  switch (actionType) {
    case MESSAGE_EVENT_DATA_ACTION_TYPE.获取响应模拟数据设置:
      let responseMockConfig: ResponseProject | null = null;
      try {
        // const installSetting: string | null = await storage.getItem(storageKeyForResponseSetting);
        const installConfig: string | null = await storage.getItem(STORAGE_KEY_RESPONSE_MOCK);
        // console.log(`[${getExtensionName}]: 获取响应模拟数据设置`, installSetting);
        responseMockConfig = installConfig ? JSON.parse(installConfig) : {};

        // console.log(
        //   `%c[${getExtensionName}]`,
        //   pluginStyle,
        //   '获取响应模拟数据设置',
        //   responseMockConfig
        // );
      } catch (err) {
        console.error(`%c[${getExtensionName}]`, pluginStyle, '获取响应模拟数据设置失败', err);
      }

      // 发送异步结果回去
      port?.postMessage({ id, data: responseMockConfig });
      break;
  }

  // 关闭端口
  port?.close();
};
