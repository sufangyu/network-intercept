import { BatchInterceptor } from '@mswjs/interceptors';
import { XMLHttpRequestInterceptor } from '@mswjs/interceptors/XMLHttpRequest';
import { FetchInterceptor } from '@mswjs/interceptors/fetch';
import { getMockRespponse } from './mock';
import { renderToast } from './toast';
import { ResponseProject } from '@/entrypoints/response-mock/modules/types';
import { MOCK_HEADER_KEY_MAP } from '@/entrypoints/response-mock/modules/const';

/**
 * 拦截请求
 *
 */
export const interceptorRequest = async () => {
  try {
    const interceptor = new BatchInterceptor({
      name: 'interceptor',
      interceptors: [new XMLHttpRequestInterceptor(), new FetchInterceptor()]
    });

    interceptor.on('request', async ({ request, controller }) => {
      const responseMockConfigRes = await postMessageWithPromise<ResponseProject>({
        actionType: MESSAGE_EVENT_DATA_ACTION_TYPE.获取响应模拟数据设置
      });

      const { mockResponse } = await getMockRespponse(request, responseMockConfigRes);
      mockResponse && controller.respondWith(mockResponse);
    });

    interceptor.on('response', async ({ request, response }) => {
      const mockType = response.headers.get(MOCK_HEADER_KEY_MAP.模拟类型);

      // 常规 Mock
      // 不能使用`TS`的枚举, 否则会报错
      if (mockType === 'normal') {
        const resData = await response.json();
        const headersObj = Array.from(response.headers.entries()).reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {} as Record<string, string>);

        console.log(
          `%c[${getExtensionName}]%c${request.method}`,
          pluginStyleScoped,
          scopedStyle,
          request.url,
          '\n',
          '响应头:',
          headersObj,
          '\n',
          '响应数据:',
          resData
        );
      }

      // 显示 toast
      const isShowToast = response.headers.get(MOCK_HEADER_KEY_MAP.是否显示Toast) === 'yes';
      if (mockType && isShowToast) {
        renderToast(request, response);
      }
    });

    interceptor.apply();
  } catch (error) {
    console.error(`[Network-Intercept]: ${(error as Error).message as string}`);
  }
};
