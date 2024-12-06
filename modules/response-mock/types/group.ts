import { HeadersConfigItem, STATUS_GLOBAL_ENUM } from '@/types';

export interface ResponseGroupItem {
  id: string;
  /**
   * 分组名称
   *
   * @type {string}
   * @memberof ResponseGroupItem
   */
  name: string;
  /**
   * 请求头配置
   *
   * - 请求发起会添加这里的请求配置信息
   *
   * @type {HeadersConfigItem[]}
   * @memberof ResponseSettingItem
   */
  requestHeaders?: HeadersConfigItem[];
  /**
   * 响应数据数据包装
   * ```
   * 统一添加一层数据包装，例如：
   * {
   *   "code": 200,
   *   "message": "Operation successful",
   *   "success": true,
   *   "data": null
   * }
   * 会将 data 字段下的 null 替换为自动生成的 Mock 数据。如果接口定义中有定义同类型字段，该配置会覆盖自动生成的对应字段。
   * ```
   * @type {string}
   * @memberof ResponseSettingItem
   */
  responseDataBase?: string;
  /**
   * 接口 Mock 规则列表
   *
   * @type {ResponseSettingItemMockList[]}
   * @memberof ResponseSettingItem
   */
  mockRules?: MockRuleItem[];

  // /**
  //  * 当前分组 id
  //  *
  //  * @type {string}
  //  * @memberof ResponseGroupItem
  //  */
  // curGroupId?: string;
}

export interface MockRuleItem {
  id: string;
  /**
   * 接口地址
   *
   * @type {string}
   * @memberof MockRuleItem
   */
  apiUrl: string;
  /**
   * 接口名称
   *
   * @type {string}
   * @memberof MockRuleItem
   */
  apiName?: string;
  /**
   * mock 规则状态
   *
   * @type {STATUS_GLOBAL_ENUM}
   * @memberof MockRuleItem
   */
  state: STATUS_GLOBAL_ENUM;
  /**
   * mock 类型
   *
   * - 默认 '常规-normal'
   *
   * @type {MOCK_TYPE_ENUM}
   * @memberof MockRuleItem
   */
  mockType: MOCK_TYPE_ENUM;
  /**
   * 匹配类型
   *
   * - 默认 '包含-contains'
   *
   * @type {MATCH_TYPE_ENUM}
   * @memberof MockRuleItem
   */
  matchType: MATCH_TYPE_ENUM;
  /**
   * 请求方式
   *
   * @type {METHOD_ENUM}
   * @memberof MockRuleItem
   */
  methodType: METHOD_TYPE_ENUM | '';
  /**
   * 重定向地址
   *
   * @type {string}
   * @memberof MockRuleItem
   */
  redirectUrl?: string;
  /**
   * 响应状态码
   *
   * - 默认 200
   *
   * @type {string}
   * @memberof MockRuleItem
   */
  responseState?: string;
  /**
   * 响应状态描述
   *
   * @type {string}
   * @memberof MockRuleItem
   */
  responseStateText?: string;
  /**
   * 延迟时间
   *
   * - 默认延迟 500ms
   *
   * @type {DELAY_TIME_ENUM}
   * @memberof MockRuleItem
   */
  delayTime?: DELAY_TIME_ENUM;

  /**
   * 返回响应
   *
   * @type {string}
   * @memberof MockRuleItem
   */
  responseData?: string;
  /**
   * 响应头配置
   *
   * @type {HeadersConfigItem[]}
   * @memberof MockRuleItem
   */
  responseHeaders?: HeadersConfigItem[];

  /**
   * 响应数据数据包装（所属分组的配置）
   * ```
   * 统一添加一层数据包装，例如：
   * {
   *   "code": 200,
   *   "message": "Operation successful",
   *   "success": true,
   *   "data": null
   * }
   * 会将 data 字段下的 null 替换为自动生成的 Mock 数据。如果接口定义中有定义同类型字段，该配置会覆盖自动生成的对应字段。
   * ```
   * @type string
   * @memberof MockRuleItem
   */
  responseDataBase?: string;
}

/**
 * Mock 类型
 *
 * @export
 * @enum {number}
 */
export enum MOCK_TYPE_ENUM {
  '常规' = 'normal',
  '重定向' = 'redirect'
}

/**
 * Mock 匹配类型
 *
 * @export
 * @enum {number}
 */
export enum MATCH_TYPE_ENUM {
  '包含' = 'contains',
  '等于' = 'equals',
  '正则表达式' = 'regExp'
}

/**
 * 请求方式
 *
 * @export
 * @enum {number}
 */
export enum METHOD_TYPE_ENUM {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  OPTIONS = 'OPTIONS',
  HEAD = 'HEAD',
  TRACE = 'TRACE',
  CONNECT = 'CONNECT'
}

export enum DELAY_TIME_ENUM {
  '无延迟' = '0',
  '500ms' = '500',
  '1000ms' = '1000',
  '3000ms' = '3000',
  '5000ms' = '5000'
}

/**
 * 覆盖指定的 key 值
 *
 * @export
 * @interface ConvertFileds
 */
export interface ConvertFileds {
  /** 分组 key 列表 */
  group: (keyof ResponseGroupItem)[];
  /** 规则 key 列表 */
  rule: (keyof MockRuleItem)[];
}
