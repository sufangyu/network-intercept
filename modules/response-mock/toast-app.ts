import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import 'reflect-metadata';
import { MOCK_HEADER_KEY_MAP } from '@/entrypoints/response-mock/modules/const';

@customElement('mock-toast-item')
class TaostApp extends LitElement {
  /**
   * 请求对象
   *
   * @type {Partial<Request>}
   * @memberof TaostApp
   */
  @property({ type: Object })
  request: Partial<Request> = {};

  /**
   * 响应对象
   *
   * @type {Partial<Response>}
   * @memberof TaostApp
   */
  @property({ type: Object })
  response: Partial<Response> = {};

  /**
   * 延迟销毁时间（毫秒）
   */
  @property({ type: Number })
  delay: number = 3000;

  constructor(request?: Request, response?: Response, delay = 2500) {
    super();

    this.request = request || {};
    this.response = response || {};
    this.delay = delay ?? 3000;

    // 延迟销毁组件
    this.delayedDestroy();
  }

  static styles = css`
    .mock-toast-item {
      background-color: rgba(0, 0, 0, 0.65);
      border-radius: 4px;
      padding: 6px;
      margin-top: 4px;
      font-size: 12px;
      color: #fff;
      word-break: break-all;
      max-width: 80vw;
    }
  `;

  render() {
    const isNormalMock = this.response.headers?.get(MOCK_HEADER_KEY_MAP.模拟类型) === 'normal';
    const { method, url } = this.request;
    // 原 apiUrl
    const apiReferer = this.response.headers?.get(MOCK_HEADER_KEY_MAP.重定向来源);

    return html`
      <div class="mock-toast-item">
        ${isNormalMock
          ? html`REQUEST MOCK: (${method}) ${url} is mocking`
          : html`REQUEST REDIRECT: (${method}) ${apiReferer} -> ${url} is redirecting`}
      </div>
    `;
  }

  delayedDestroy() {
    setTimeout(() => {
      this.remove();
    }, this.delay);
  }
}

export default TaostApp;
