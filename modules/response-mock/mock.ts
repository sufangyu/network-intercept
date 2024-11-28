import { cloneDeep } from 'lodash-es';
import {
  type ResponseProject,
  type MockRuleItem,
  MATCH_TYPE_ENUM
} from '@/entrypoints/response-mock/modules/mock/types';
import { MOCK_HEADER_KEY_MAP } from '@/entrypoints/response-mock/modules/mock/const';

/**
 * 获取 Mock 响应数据
 *
 * @param {Request} request 请求对象
 * @param {ResponseProject} responseMockProject Mock 项目配置
 */
export const getMockRespponse = async (
  request: Request,
  responseMockProject?: ResponseProject
): Promise<{
  mockResponse: Response | null;
  mockRule: MockRuleItem | null;
}> => {
  const enableMockRules = getEnableMockRules(responseMockProject);
  const matchMockRule = getMatchMockRule(request, enableMockRules);
  let mockResponse: Response | null = null;

  if (!matchMockRule) {
    return { mockResponse, mockRule: matchMockRule };
  }

  switch (matchMockRule.mockType) {
    case 'normal':
      let curResponseData = matchMockRule.responseData || '';
      if (matchMockRule.responseDataBase) {
        // 处理有 API 响应数据数据包装
        curResponseData = wrapResponseData(curResponseData, matchMockRule.responseDataBase);
      }

      const status = matchMockRule.responseState || '200';
      const statusText = matchMockRule.responseStateText || 'OK';
      const headers = new Headers({
        'Content-Type': 'application/json',
        [MOCK_HEADER_KEY_MAP.模拟类型]: 'normal',
        [MOCK_HEADER_KEY_MAP.是否显示Toast]: responseMockProject?.toast ? 'yes' : 'no'
      });
      (matchMockRule.responseHeaders ?? []).forEach((it) => {
        // 如果响应头配置中存在该字段，则删除原有值再重新赋值
        it.status === 'enabled' && headers.set(it.key, it.value ?? '');
      });

      mockResponse = new Response(curResponseData, {
        status: Number(status),
        statusText,
        headers
      });

      // 延迟返回
      const duraction = Number(matchMockRule.delayTime) ?? 0;
      duraction > 0 && (await sleep(duraction));
      break;
    case 'redirect':
      mockResponse = await fetch(matchMockRule.redirectUrl || '', {
        method: request.method,
        headers: request.headers,
        body: request.body
      });

      // 创建并返回新的响应对象
      const customHeaders = new Headers(mockResponse.headers);
      customHeaders.set(MOCK_HEADER_KEY_MAP.模拟类型, 'redirect');
      customHeaders.set(MOCK_HEADER_KEY_MAP.重定向来源, request.url);
      customHeaders.set(MOCK_HEADER_KEY_MAP.重定向目标, matchMockRule.redirectUrl!);
      customHeaders.set(
        MOCK_HEADER_KEY_MAP.是否显示Toast,
        responseMockProject?.toast ? 'yes' : 'no'
      );

      const responseWithCustomHeaders = new Response(await mockResponse.text(), {
        status: mockResponse.status,
        statusText: mockResponse.statusText,
        headers: customHeaders
      });

      mockResponse = responseWithCustomHeaders;
      break;
  }

  return { mockResponse, mockRule: matchMockRule };
};

/**
 * 获取启用状态的 Mock 规则集合
 *
 * - 不能使用枚举（MOCK_STATE_ENUM.启用）,否则会报错
 *
 * @param {ResponseProject} [responseMockProject]
 * @return {*}
 */
const getEnableMockRules = (responseMockProject?: ResponseProject): MockRuleItem[] => {
  // 不存在或者未开启 Mock 规则，返回空数组
  if (!responseMockProject || !responseMockProject?.toggle) {
    return [];
  }

  const mockResults: MockRuleItem[] = [];
  responseMockProject?.list?.forEach((projectItem) => {
    if (projectItem?.status === 'enabled') {
      projectItem.groupList?.forEach((groupItem) => {
        groupItem?.mockRules?.forEach((ruleItem) => {
          if (ruleItem.state === 'enabled') {
            const mockRuleItem = cloneDeep(ruleItem);
            mockRuleItem.responseDataBase = projectItem.responseDataBase || '';
            mockResults.push(mockRuleItem);
          }
        });
      });
    }
  });

  return mockResults;
};

/**
 * 获取匹配的 Mock 规则
 *
 * - 只匹配第一条符合的规则
 *
 * @param {Request} request 请求数据
 * @param {MockRuleItem[]} [mockRules=[]] Mock 规则集合
 * @return {*}  {(MockRuleItem | null)}
 */
const getMatchMockRule = (
  request: Request,
  mockRules: MockRuleItem[] = []
): MockRuleItem | null => {
  const { method, url } = request;
  // 是否匹配的 URL 规则
  const isMatchUrlRuleMap: Record<MATCH_TYPE_ENUM, (reqUrl: string, apiUrl: string) => boolean> = {
    contains: (reqUrl, apiUrl) => {
      return reqUrl.includes(apiUrl);
    },
    equals: (reqUrl, apiUrl) => {
      return reqUrl === apiUrl;
    },
    regExp: (reqUrl, apiUrl) => {
      const reg = new RegExp(apiUrl);
      return reg.test(reqUrl);
    }
  };

  const mockRuleItem =
    mockRules.find((item) => {
      const matchMethod = item.methodType === method;
      const matchUrlRule = isMatchUrlRuleMap[item.matchType]?.(url, item.apiUrl);
      return matchMethod && matchUrlRule;
    }) || null;

  return mockRuleItem;
};

/**
 * 响应数据统一包裹
 *
 * @param {string} rawResponse 原始响应数据
 * @param {string} responseDataBase 响应数据数据包装配置
 * @return {*}
 */
const wrapResponseData = (rawResponse: string, responseDataBase: string) => {
  try {
    const wrapHandle = (response: Record<string, any>, dataBase: Record<string, any>) => {
      if (typeof dataBase === 'object') {
        for (const key in dataBase) {
          const curBaseVal = dataBase[key];
          const curResVal = response[key];
          // console.log('curVal =>>', key, curBaseVal, curResVal);

          if (curBaseVal === null) {
            // 值为 null时 => 替换为响应数据的对应层级的数据, 不存在对应层级则直接替换为响应数据
            dataBase[key] = curResVal ?? JSON.parse(rawResponse);
          } else if (typeof curBaseVal === 'object') {
            // 值是对象或数组时 => 递归处理
            const nextResponse = curResVal ?? response;
            wrapHandle(nextResponse, curBaseVal);
          } else {
            // 其他类型时 => 响应数据的对应层级的数据就直接赋值
            curResVal !== undefined && (dataBase[key] = response[key]);
          }
        }
      }
    };

    if (responseDataBase === 'null' || !responseDataBase || !rawResponse) {
      return JSON.parse(rawResponse);
    }

    const formatResponseDataBase = JSON.parse(responseDataBase);
    const response = JSON.parse(rawResponse);
    if (typeof formatResponseDataBase === 'object') {
      wrapHandle(response, formatResponseDataBase);
    }

    return JSON.stringify(formatResponseDataBase);
  } catch (err) {
    console.error(
      `%c[${getExtensionName}]%c${'数据包裹失败'}`,
      pluginStyleScoped,
      scopedStyle,
      err
    );
    return rawResponse;
  }
};
