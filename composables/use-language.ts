import { StorageItemKey } from 'wxt/storage';
import { useI18n } from 'vue-i18n';

const STORAGE_KEY_LANGUAGE: StorageItemKey = 'local:language';
const languageList: { code: I18nLocales; label: string }[] = [
  { code: 'zh-CN', label: '简体中文' },
  { code: 'en-US', label: 'English' }
] as const;

/**
 * 多语言切换
 *
 * @export
 * @return {*}
 */
export function useLanguage() {
  const { locale } = useI18n();

  // 默认值可以考虑根据浏览器语言设置
  const curLanguage = ref<I18nLocales>('zh-CN');

  const initLanguage = () => {
    try {
      const lang = localStorage.getItem(STORAGE_KEY_LANGUAGE);
      lang && changeLanguage(lang as I18nLocales);
    } catch (_err) {}
  };

  const changeLanguage = (lang: I18nLocales) => {
    locale.value = lang;
    curLanguage.value = lang;

    try {
      localStorage.setItem(STORAGE_KEY_LANGUAGE, lang);
    } catch (_err) {}
  };

  onMounted(() => {
    initLanguage();
  });

  return {
    languageList,
    curLanguage,
    changeLanguage
  };
}
