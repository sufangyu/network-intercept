import { nanoid } from 'nanoid';
import { ElMessage } from 'element-plus';
import { STORAGE_KEY_AUTO_GOTO_URL } from '../const';
import { autoGotoUrl } from '../data';
import { AutoGotoUrl, AutoGotoUrlConfigItem } from '../types';

const { updateStorage } = useUpdateStorage<AutoGotoUrl>(STORAGE_KEY_AUTO_GOTO_URL);

export function useAutoGotoUrlConfig() {
  /**
   * 获取自动跳转配置
   *
   */
  const getAutoGotoUrl = async () => {
    const res = await storage.getItem<string>(STORAGE_KEY_AUTO_GOTO_URL);
    if (res) {
      autoGotoUrl.value = JSON.parse(res);
    }
  };

  const toggleAutoGotoUrl = async () => {
    const curToggle = autoGotoUrl.value.toggle;
    const message = curToggle ? '已启用' : '已停用';

    await updateStorage({
      data: autoGotoUrl.value,
      resultMessage: { message, type: 'success' }
    });
  };

  /**
   * 创建配置
   *
   * @param {AutoGotoUrlConfigItem} config 配置项
   * @param {boolean} [silent=false] 是否静默创建
   */
  const createConfig = async (config: AutoGotoUrlConfigItem, silent = false) => {
    const curRule: AutoGotoUrlConfigItem = {
      ...config,
      id: nanoid()
    };

    autoGotoUrl.value.configList.unshift(curRule);

    await updateStorage({
      data: autoGotoUrl.value,
      resultMessage: { message: '创建成功', type: 'success', silent }
    });
  };

  /**
   * 编辑配置
   *
   * @param {AutoGotoUrlConfigItem} config 配置项
   * @param {boolean} [silent=false] 是否静默创建
   */
  const editConfig = async (config: AutoGotoUrlConfigItem, silent = false) => {
    const curConfigIdx = autoGotoUrl.value.configList.findIndex((item) => item.id === config.id);

    if (curConfigIdx > -1) {
      // 更新数据
      autoGotoUrl.value.configList[curConfigIdx] = {
        ...config
      };

      await updateStorage({
        data: autoGotoUrl.value,
        resultMessage: { message: '编辑成功', type: 'success', silent }
      });
    }
  };

  /**
   * 删除配置
   *
   * @param {AutoGotoUrlConfigItem} config
   * @return {*}
   */
  const deleteConfig = async (config: AutoGotoUrlConfigItem) => {
    const curConfigIdx = autoGotoUrl.value.configList.findIndex((item) => item.id === config.id);
    if (curConfigIdx <= -1) {
      ElMessage.error('配置不存在');
      return;
    }

    autoGotoUrl.value.configList.splice(curConfigIdx, 1);
    await updateStorage({
      data: autoGotoUrl.value,
      resultMessage: { message: '删除成功', type: 'success' }
    });
  };

  /**
   * 更新配置
   *
   * @param {AutoGotoUrlConfigItem} config
   * @param {boolean} [needUpdate=false]
   * @return {*}
   */
  const updateConfig = async (newConfig: AutoGotoUrlConfigItem, needUpdate = false) => {
    if (needUpdate) {
      const curConfigIdx = autoGotoUrl.value.configList.findIndex(
        (item) => item.id === newConfig.id
      );
      if (curConfigIdx <= -1) {
        ElMessage.error('配置不存在');
        return;
      }

      autoGotoUrl.value.configList[curConfigIdx] = {
        ...newConfig
      };
    }

    await updateStorage({
      data: autoGotoUrl.value,
      resultMessage: { message: '更新成功', type: 'success' }
    });
  };

  return {
    getAutoGotoUrl,
    toggleAutoGotoUrl,
    createConfig,
    editConfig,
    deleteConfig,
    updateConfig
  };
}
