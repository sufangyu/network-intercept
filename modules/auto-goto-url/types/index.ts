import { STATUS_GLOBAL_ENUM } from '@/types';

export interface AutoGotoUrl {
  /**
   * 是否启用
   *
   * @type {boolean}
   * @memberof AutoGotoUrl
   */
  toggle: boolean;
  /**
   * 配置列表
   *
   * @type {AutoGotoUrlConfigItem[]}
   * @memberof AutoGotoUrl
   */
  configList: AutoGotoUrlConfigItem[];
}

export interface AutoGotoUrlConfigItem {
  id?: string;
  /**
   * 名称
   *
   * @type {string}
   * @memberof AutoGotoUrlConfigItem
   */
  name: string;
  /**
   * 匹配规则
   *
   * @type {string}
   * @memberof AutoGotoUrlConfigItem
   */
  match: string;
  /**
   * 是否是正则表达式
   *
   * @type {boolean}
   * @memberof AutoGotoUrlConfigItem
   */
  enableRegex: boolean;
  /**
   * 跳转类型
   *
   * @type {AUTO_GOTO_URL_REDIRECT_TYPE_ENUM}
   * @memberof AutoGotoUrlConfigItem
   */
  redirectType: AUTO_GOTO_URL_REDIRECT_TYPE_ENUM;
  /**
   * 跳转地址
   *
   * @type {string}
   * @memberof AutoGotoUrlConfigItem
   */
  redirect: string;
  /**
   * 状态
   *
   * @type {STATUS_GLOBAL_ENUM}
   * @memberof AutoGotoUrlConfigItem
   */
  status: STATUS_GLOBAL_ENUM | string;
}

export enum AUTO_GOTO_URL_REDIRECT_TYPE_ENUM {
  '目标Key' = 'TAEGET_PARAM_KEY',
  '执行程序' = 'CODE_SNIPPET'
}
