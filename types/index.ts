/**
 * 状态枚举
 *
 * @export
 * @enum {number}
 */
export enum STATUS_GLOBAL_ENUM {
  '停用' = 'disabled',
  '启用' = 'enabled'
}

/**
 * 请求头配置项
 *
 * @export
 * @interface HeadersConfigItem
 */
export interface HeadersConfigItem {
  /**
   * key
   *
   * @type {string}
   * @memberof HeadersConfigItem
   */
  key: string;
  /**
   * value
   *
   * @type {string}
   * @memberof HeadersConfigItem
   */
  value: string;
  /**
   * 描述
   *
   * @type {string}
   * @memberof HeadersConfigItem
   */
  description?: string;
  /**
   * 状态
   *
   * @type {STATUS_GLOBAL_ENUM}
   * @memberof HeadersConfigItem
   */
  status: STATUS_GLOBAL_ENUM;
}

/**
 * 导入文件带版本内容
 *
 * @export
 * @interface ImportFileWithVersion
 * @template T
 */
export interface ImportFileWithVersion<T = any> {
  version: string;
  data: T;
}
