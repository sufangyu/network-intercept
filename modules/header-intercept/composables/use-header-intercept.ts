import { STORAGE_KEY_HEADER_INTERCEPT } from '../const';
import { headerInterceptConfig } from '../data';
import { HeaderInterceptConfig } from '../types';
import { useHeaderInterceptGroup } from './use-group';

const { updateStorage } = useUpdateStorage<HeaderInterceptConfig>(STORAGE_KEY_HEADER_INTERCEPT);
const { setActiveGroupId } = useHeaderInterceptGroup();

export function useHeaderIntercept() {
  /**
   * 初始化请求头拦截配置数据
   *
   */
  const initHeaderInterceptConfig = async () => {
    const res = await storage.getItem<string>(STORAGE_KEY_HEADER_INTERCEPT);

    if (res) {
      headerInterceptConfig.value = JSON.parse(res);
      setActiveGroupId(headerInterceptConfig.value?.data[0]?.id || '');
    }
    // console.log('initHeaderProxyConfig =>>', headerInterceptConfig.value);
  };

  const toggleHeaderIntercept = () => {
    const message = headerInterceptConfig.value?.toggle ? '已启用' : '已停用';
    updateStorage({
      data: headerInterceptConfig.value,
      resultMessage: {
        message,
        type: 'success'
      }
    });
  };

  return {
    headerInterceptConfig,
    initHeaderInterceptConfig,
    toggleHeaderIntercept
  };
}
