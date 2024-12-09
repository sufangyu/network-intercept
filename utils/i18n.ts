import { createI18n } from 'vue-i18n';
import type schema from '~/assets/locales/zh-CN.json';
import messages from '@intlify/unplugin-vue-i18n/messages';

export type I18nSchema = typeof schema;
export type I18nLocales = 'zh-CN' | 'en-US';

export default createI18n<[I18nSchema], I18nLocales>({
  locale: 'zh-CN', // 默认语言
  fallbackLocale: 'zh-CN', // 回退语言
  messages: messages as any
});
