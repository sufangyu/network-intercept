/**
 * TypeScript To Zod Schema 在线转换
 * https://douni.one/zh/typescript-to-zod
 */

import { z } from 'zod';
import { STATUS_GLOBAL_ENUM } from '@/types';
import { responseGroupItemSchema } from './group';

export const statusGlobalEnumSchema = z.nativeEnum(STATUS_GLOBAL_ENUM);

export const responseProjectItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  responseDataBase: z
    .union([z.number(), z.string(), z.boolean(), z.record(z.any()), z.array(z.any())])
    .nullable(),
  collected: z.boolean(),
  status: statusGlobalEnumSchema,
  groupList: z.array(responseGroupItemSchema)
});

export const responseProjectSchema = z.object({
  toggle: z.boolean().optional(),
  toast: z.boolean().optional(),
  list: z.array(responseProjectItemSchema)
});
