/**
 * TypeScript To Zod Schema 在线转换
 * https://douni.one/zh/typescript-to-zod
 */

import { z } from 'zod';
import { STATUS_GLOBAL_ENUM } from '@/types';
import { MOCK_TYPE_ENUM, MATCH_TYPE_ENUM, METHOD_TYPE_ENUM, DELAY_TIME_ENUM } from '../types';

export const statusGlobalEnumSchema = z.nativeEnum(STATUS_GLOBAL_ENUM);

export const mockTypeEnumSchema = z.nativeEnum(MOCK_TYPE_ENUM);

export const matchTypeEnumSchema = z.nativeEnum(MATCH_TYPE_ENUM);

export const methodTypeEnumSchema = z.nativeEnum(METHOD_TYPE_ENUM);

export const delayTimeEnumSchema = z.nativeEnum(DELAY_TIME_ENUM);

export const headersConfigItemSchema = z.object({
  key: z.string(),
  value: z.string(),
  description: z.string().optional(),
  status: statusGlobalEnumSchema
});

export const mockRuleItemSchema = z.object({
  id: z.string(),
  apiUrl: z.string(),
  apiName: z.string().optional(),
  state: statusGlobalEnumSchema,
  mockType: mockTypeEnumSchema,
  matchType: matchTypeEnumSchema,
  methodType: z.union([methodTypeEnumSchema, z.literal('')]),
  redirectUrl: z.string().optional(),
  responseState: z.string().optional(),
  responseStateText: z.string().optional(),
  delayTime: delayTimeEnumSchema.optional(),
  responseData: z.string().optional(),
  responseHeaders: z.array(headersConfigItemSchema).optional(),
  responseDataBase: z.string().optional()
});

export const responseGroupItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  requestHeaders: z.array(headersConfigItemSchema).optional(),
  responseDataBase: z.string().optional(),
  mockRules: z.array(mockRuleItemSchema).optional()
});
