import { HeadersConfigItem, STATUS_GLOBAL_ENUM } from '@/types';

/**
 * 请求头拦截配置
 *
 * @export
 * @interface HeaderInterceptConfig
 */
export interface HeaderInterceptConfig {
  /**
   * 是否开启
   *
   * @type {boolean}
   * @memberof HeaderInterceptConfig
   */
  toggle: boolean;
  /**
   * 请求头规则分组列表
   *
   * @type {HeaderInterceptConfig[]}
   * @memberof HeaderInterceptConfig
   */
  data: HeaderInterceptGroupItem[];
}

/**
 * 请求头配置项目
 *
 * @export
 * @interface HeaderInterceptGroupItem
 */
export interface HeaderInterceptGroupItem {
  /**
   * 分组 ID
   *
   * @type {string}
   * @memberof HeaderInterceptGroupItem
   */
  id: string;
  /**
   * 分组名称
   *
   * @type {string}
   * @memberof HeaderInterceptGroupItem
   */
  groupName: string;
  /**
   * 分组的请求头配置列表
   *
   * @type {HeaderRuleItem[]}
   * @memberof HeaderInterceptGroupItem
   */
  rules: HeaderRuleItem[];
}

/**
 * 请求规则配置项目
 *
 * @export
 * @interface HeaderRuleItem
 */
export interface HeaderRuleItem {
  /**
   * 规则 ID
   *
   * @type {string}
   * @memberof HeaderRuleItem
   */
  id: string;
  /**
   * 规则名称
   *
   * @type {string}
   * @memberof HeaderRuleItem
   */
  name: string;
  // createdTime: string;
  // updatedTime: string;
  /**
   * 规则状态
   *
   * @type {STATUS_GLOBAL_ENUM}
   * @memberof HeaderRuleItem
   */
  state: STATUS_GLOBAL_ENUM;
  /**
   * 规则类型
   *
   * @type {RULE_TYPE_ENUM}
   * @memberof HeaderRuleItem
   */
  ruleType: RULE_TYPE_ENUM;
  /**
   * 请求方法集合
   *
   * @type {REQUEST_METHOD_ENUM[]}
   * @memberof HeaderRuleItem
   */
  requestMethods: REQUEST_METHOD_ENUM[];
  /**
   * 匹配规则
   *
   * - 在匹配类型为 `regular` 或 `url-prefix` 或 `domain` 时生效
   *
   * @type {string}
   * @memberof HeaderRuleItem
   */
  includeConfig?: string;
  /**
   * 匹配类型
   *
   * @type {string}
   * @memberof HeaderRuleItem
   */
  matchType: MATCH_TYPE_ENUM;
  /**
   * 重定向的地址
   *
   * - 在规则类型为 `redirect-request` 时生效
   *
   * @type {string}
   * @memberof HeaderRuleItem
   */
  redirectUrl?: string;
  /**
   * 请求头、响应头的键值对配比
   *
   * - 在规则类型为 `modify-request-header` 或 `modify-response-header` 时生效
   * @type {HeadersConfigItem[]}
   * @memberof HeaderRuleItem
   */
  headersConfig?: HeadersConfigItem[];
  /**
   * 执行类型
   *
   * @type {EXECUTE_TYPE_ENUM}
   * @memberof HeaderRuleItem
   */
  executeType: EXECUTE_TYPE_ENUM;
  /**
   * 执行函数
   *
   * @type {string}
   * @memberof HeaderRuleItem
   */
  executeFunction?: string;
}

/**
 * 匹配 HTTP 请求方法
 *
 * @export
 * @enum {number}
 */
export enum REQUEST_METHOD_ENUM {
  'GET' = 'get',
  'POST' = 'post',
  'DELETE' = 'delete',
  'PUT' = 'put',
  'PATCH' = 'patch'
}

/**
 * 规则类型
 *
 * @export
 * @enum {number}
 */
export enum RULE_TYPE_ENUM {
  '阻止请求' = 'block-request',
  '重定向请求' = 'redirect-request',
  '修改请求头' = 'modify-request-header',
  '修改响应头' = 'modify-response-header'
  // '修改响应体' = 'modify-response-body'
}

/**
 * 匹配类型
 *
 * @export
 * @enum {number}
 */
export enum MATCH_TYPE_ENUM {
  '全部' = 'all',
  '正则表达式' = 'regular',
  '网址前缀' = 'url-prefix',
  '域名' = 'domain',
  '网址' = 'url'
}

/**
 * 执行类型
 *
 * @export
 * @enum {number}
 */
export enum EXECUTE_TYPE_ENUM {
  '常规' = 'normal',
  '函数' = 'functional'
}

/**
 * 规则状态
 *
 * @export
 * @enum {number}
 */
export enum RULE_STATE_ENUM {
  '启用' = 'enabled',
  '禁用' = 'disabled'
}

/**
 * 拦截配置头部操作枚举
 *
 * @export
 * @enum {number}
 */
export enum HEADER_INTERCEPT_APP_HEADER_OPERATE_ENUM {
  '添加分组' = 'CREATE_GROUP'
}
