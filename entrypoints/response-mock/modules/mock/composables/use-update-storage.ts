import { cloneDeep } from 'lodash-es';
import { ElMessage } from 'element-plus';
import { STORAGE_KEY_RESPONSE_MOCK } from '../const';
import { type ResponseProject } from '../types';

export function useUpdateStorage() {
  /**
   * 更新本地存储数据
   *
   * @param {({
   *     data: ResponseProject;
   *     resultMessage?: {
   *       silent?: boolean;
   *       message?: string;
   *       type?: 'success' | 'error';
   *     };
   *   })} options
   */
  const updateStorage = async (options: {
    data: ResponseProject;
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
    await storage.setItem(STORAGE_KEY_RESPONSE_MOCK, dataStr);

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
