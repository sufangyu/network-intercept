import { STATUS_GLOBAL_ENUM } from '@/types';
import { ResponseGroupItem } from './group';

export interface ResponseProject {
  /** 是否开启全局 Mock */
  toggle?: boolean;
  /** 是否开启 Toast 提示 */
  toast?: boolean;
  /** 项目列表 */
  list: ResponseProjectItem[];
}

export interface ResponseProjectItem {
  id: string;
  /** 项目名称 */
  name: string;
  /** 项目描述 */
  description?: string;
  /** API响应数据基础结构 */
  responseDataBase: string;
  /** 是否收藏 */
  collected: boolean;
  /** 状态 */
  status: STATUS_GLOBAL_ENUM;
  /** 分组配置 */
  groupList: ResponseGroupItem[];
}

/**
 * 项目头部操作枚举
 *
 * @export
 * @enum {number}
 */
export enum PROJECT_APP_HEADER_OPERATE_ENUM {
  '添加项目' = 'CREATE_PROJECT'
}

/**
 * 分组头部操作枚举
 *
 * @export
 * @enum {number}
 */
export enum GROUP_APP_HEADER_OPERATE_ENUM {
  '添加分组' = 'CREATE_PROJECT_GROUP'
}

/**
 * 导入类型
 *
 * @export
 * @enum {number}
 */
export enum IMPORT_TYPE_ENUM {
  '新建项目' = 'create',
  '已有项目' = 'cover'
}

/**
 * 相同规则处理方式
 *
 * @export
 * @enum {number}
 */
export enum SAME_RULE_HANDLE_ENUM {
  '覆盖已有接口' = 'cover-all',
  '智能合并' = 'intelligence-merge',
  '覆盖指定字段' = 'cover-field',
  '不导入' = 'not-import',
  '保留两者' = 'keep-both'
}
