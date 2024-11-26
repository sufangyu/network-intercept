import { cloneDeep } from 'lodash-es';
import { ElMessage } from 'element-plus';
import { updateDynamicRules } from '@/modules/header-intercept/update-rules';
import { STORAGE_KEY_HEADER_INTERCEPT } from '../const';
import { type HeaderInterceptConfig } from '../types';

export function useUpdateStorage() {
  /**
   * 更新数据到本地
   *
   * @param {({
   *     data: HeaderInterceptConfig; // 新数据
   *     resultMessage?: {
   *       silent?: boolean; // 是否静默
   *       message?: string; // 提示信息
   *       type?: 'success' | 'error'; // 提示类型
   *     };
   *   })} options
   */
  const updateStorage = async (options: {
    data: HeaderInterceptConfig;
    resultMessage?: {
      silent?: boolean;
      message?: string;
      type?: 'success' | 'error';
    };
  }) => {
    const { data, resultMessage } = options;
    const silent = resultMessage?.silent || false;

    // 转成字符串在存储, 避免数组类型存储后会转成对象
    const newData = cloneDeep(data);
    const dataStr = JSON.stringify(newData);
    await storage.setItem(STORAGE_KEY_HEADER_INTERCEPT, dataStr);

    // 更新动态规则
    updateDynamicRules();

    if (!silent && resultMessage?.message) {
      ElMessage({
        message: resultMessage?.message,
        type: resultMessage?.type || 'success',
        grouping: true
      });
    }
  };

  return {
    updateStorage
  };
}
