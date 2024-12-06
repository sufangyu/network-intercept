/**
 * TypeScript To Zod Schema 在线转换
 * https://douni.one/zh/typescript-to-zod
 */

import { STATUS_GLOBAL_ENUM } from '@/types';
import { z } from 'zod';
import {
  RULE_TYPE_ENUM,
  REQUEST_METHOD_ENUM,
  MATCH_TYPE_ENUM,
  EXECUTE_TYPE_ENUM,
  RULE_STATE_ENUM,
  HEADER_INTERCEPT_APP_HEADER_OPERATE_ENUM
} from '../types';

export const statusGlobalEnumSchema = z.nativeEnum(STATUS_GLOBAL_ENUM);

export const ruleTypeEnumSchema = z.nativeEnum(RULE_TYPE_ENUM);

export const requestMethodEnumSchema = z.nativeEnum(REQUEST_METHOD_ENUM);

export const matchTypeEnumSchema = z.nativeEnum(MATCH_TYPE_ENUM);

export const headersConfigItemSchema = z.object({
  key: z.string(),
  value: z.string(),
  description: z.string().optional(),
  status: statusGlobalEnumSchema
});

export const executeTypeEnumSchema = z.nativeEnum(EXECUTE_TYPE_ENUM);

export const ruleStateEnumSchema = z.nativeEnum(RULE_STATE_ENUM);

export const headerInterceptAppHeaderOperateEnumSchema = z.nativeEnum(
  HEADER_INTERCEPT_APP_HEADER_OPERATE_ENUM
);

export const headerRuleItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  state: statusGlobalEnumSchema,
  ruleType: ruleTypeEnumSchema,
  requestMethods: z.array(requestMethodEnumSchema),
  includeConfig: z.string().optional(),
  matchType: matchTypeEnumSchema,
  redirectUrl: z.string().optional(),
  headersConfig: z.array(headersConfigItemSchema).optional(),
  executeType: executeTypeEnumSchema,
  executeFunction: z.string().optional()
});

export const headerInterceptGroupItemSchema = z.object({
  id: z.string(),
  groupName: z.string(),
  rules: z.array(headerRuleItemSchema)
});
