import { HeaderInterceptConfig } from '../types';

/**
 * 请求头配置项默认值
 */
export const headerInterceptConfig = ref<HeaderInterceptConfig>({
  toggle: true,
  data: []
});
