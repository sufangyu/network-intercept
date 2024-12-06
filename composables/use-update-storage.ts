import { cloneDeep } from 'lodash-es';
import { ElMessage } from 'element-plus';
import { STORAGE_KEY_AUTO_GOTO_URL } from '@/modules/auto-goto-url/const/storage';

/**
 * 更新本地存储数据
 *
 * @export
 * @template T 数据类型
 * @param {typeof STORAGE_KEY_AUTO_GOTO_URL} storageKey 存储key
 * @return {*}
 */
export function useUpdateStorage<T = Record<string, any>>(
  storageKey: typeof STORAGE_KEY_AUTO_GOTO_URL
) {
  /**
   * 更新本地存储数据
   *
   * @param {({
   *     data: T;
   *     resultMessage?: {
   *       silent?: boolean;
   *       message?: string;
   *       type?: 'success' | 'error';
   *     };
   *   })} options
   */
  const updateStorage = async (options: {
    data: T;
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
    await storage.setItem(storageKey, dataStr);

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
