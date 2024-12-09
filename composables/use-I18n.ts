import { I18nLocales, I18nSchema } from '@/utils/i18n';
import { useI18n } from 'vue-i18n';

/**
 * Use i18n
 *
 * @export
 * @return {*}
 */
export default function () {
  return useI18n<[I18nSchema], I18nLocales>();
}
