/**
 * 通讯消息事件的数据
 *
 * @export
 * @interface MessageEventData
 */
export interface MessageEventData<T = Record<string, any> | string | number | boolean | null> {
  /**
   * 消息动作类型
   *
   * @type {MESSAGE_EVENT_DATA_ACTION_TYPE}
   * @memberof MessageEventData
   */
  actionType: MESSAGE_EVENT_DATA_ACTION_TYPE;
  /**
   * 消息唯一ID
   *
   * - 不传入时, 将使用时间戳自动生成
   *
   * @type {string}
   * @memberof MessageEventData
   */
  id?: string;
  /**
   * 消息内容传参
   *
   * @type {T}
   * @memberof MessageEventData
   */
  payload?: T;
}

/**
 * 通讯消息事件的动作类型
 *
 * @export
 * @enum {number}
 */
export enum MESSAGE_EVENT_DATA_ACTION_TYPE {
  获取响应模拟数据设置 = 'getResponseMockConfig'
}

export const postMessageWithPromise = <T = any>(
  message: MessageEventData,
  targetOrigin = '*'
): Promise<T> => {
  return new Promise((resolve, reject) => {
    const messageId = message.id || Date.now().toString();
    if (!message.id) {
      message.id = messageId;
    }

    // 1. 创建 MessageChannel
    const channel = new MessageChannel();

    // 2. 监听 port1 上的消息接收响应
    // - 处理匹配的 ID & 关闭端口
    channel.port1.onmessage = (event) => {
      const response = event.data;
      if (response && response.id === messageId) {
        channel.port1.close();

        if (response.error) {
          reject(new Error(response.error));
        } else {
          resolve(response.data);
        }
      }
    };

    // 3. 发送消息到目标窗口，使用 port2
    window.postMessage({ ...message, port: channel.port2 }, targetOrigin, [channel.port2]);
  });
};
