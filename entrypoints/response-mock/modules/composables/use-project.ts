import { nanoid } from 'nanoid';
import { ElMessage } from 'element-plus';
import { STATUS_GLOBAL_ENUM } from '@/types';
import { ResponseProject, ResponseProjectItem } from '../types';
import { STORAGE_KEY_RESPONSE_MOCK } from '../const';
import { responseProject } from '../data';

import { useUpdateStorage } from './use-update-storage';

const { updateStorage } = useUpdateStorage();

export function useResponseMockProject() {
  /**
   * 获取项目列表
   *
   */
  const getProjectList = async () => {
    const res = await storage.getItem<string>(STORAGE_KEY_RESPONSE_MOCK);

    if (res) {
      responseProject.value = JSON.parse(res);
    }
  };

  /**
   * 更新项目设置
   * - 开关
   * - Toast 提示
   *
   * @param {('mock' | 'toast')} type 类型
   */
  const toggleProjectMockOrToast = (type: 'mock' | 'toast') => {
    let message = '';
    switch (type) {
      case 'mock':
        message = responseProject.value?.toggle ? 'Mock 已启用' : 'Mock 已停用';
        break;
      case 'toast':
        message = responseProject.value?.toast ? 'Toast 提示已开启' : 'Toast 提示已关闭';
        break;
    }

    updateStorage({ data: responseProject.value, resultMessage: { message, type: 'success' } });
  };

  /**
   * 删除缓存数据
   */
  const removeProjectStorage = async () => {
    await storage.removeItem(STORAGE_KEY_RESPONSE_MOCK);
    const res = (await storage.getItem(STORAGE_KEY_RESPONSE_MOCK)) as ResponseProject | null;
  };

  /**
   * 项目表单项
   */
  const projectForm = ref<ResponseProjectItem>({
    id: '',
    name: '',
    description: '',
    responseDataBase: '',
    collected: false,
    status: STATUS_GLOBAL_ENUM.启用,
    groupList: []
  });

  /**
   * 创建项目
   *
   * @param {ResponseProjectItem} item 项目信息
   */
  const createProject = async (
    item: ResponseProjectItem,
    silent = false
  ): Promise<ResponseProjectItem | null> => {
    const curItem: ResponseProjectItem = {
      ...item,
      id: nanoid()
    };
    responseProject.value?.list?.unshift(curItem);
    await updateStorage({
      data: responseProject.value,
      resultMessage: { message: '创建成功', type: 'success', silent }
    });

    return curItem;
  };

  /**
   * 编辑项目
   *
   */
  const editProject = (item: ResponseProjectItem) => {
    let curProjectIdx = responseProject.value?.list?.findIndex((it) => it.id === item.id);
    if (curProjectIdx === -1) {
      ElMessage.error('项目不存在');
      return;
    }

    // 更新数组的值
    responseProject.value!.list![curProjectIdx!] = {
      ...item
    };
    updateStorage({
      data: responseProject.value,
      resultMessage: { message: '编辑成功', type: 'success' }
    });
  };

  /**
   * 删除项目
   *
   */
  const deleteProject = (item: ResponseProjectItem) => {
    const newProjects = responseProject.value?.list?.filter((it) => it.id !== item.id);

    responseProject.value!.list = newProjects ?? [];
    updateStorage({
      data: responseProject.value,
      resultMessage: { message: '删除成功', type: 'success' }
    });
  };

  /**
   * 切换项目状态
   *
   * @param {ResponseProjectItem} item
   * @param {boolean} needSetValue 是否需要更新状态
   */
  const toggleProjectStatus = (item: ResponseProjectItem, needSetValue = true) => {
    if (needSetValue) {
      const nextStatus =
        item.status === STATUS_GLOBAL_ENUM.启用 ? STATUS_GLOBAL_ENUM.停用 : STATUS_GLOBAL_ENUM.启用;
      item.status = nextStatus;
    }

    const message = item.status === STATUS_GLOBAL_ENUM.启用 ? '启用成功' : '停用成功';

    updateStorage({ data: responseProject.value, resultMessage: { message, type: 'success' } });
  };

  /**
   * 收藏项目
   *
   * @param {ResponseProjectItem} item
   */
  const toggleProjectCollected = (item: ResponseProjectItem) => {
    const nextCollected = !item.collected;
    const message = nextCollected ? '收藏成功' : '取消收藏成功';
    item.collected = nextCollected;

    updateStorage({ data: responseProject.value, resultMessage: { message, type: 'success' } });
  };

  return {
    responseProject,
    toggleProjectMockOrToast,
    removeProjectStorage,
    getProjectList,
    // 项目管理相关
    projectForm,
    createProject,
    editProject,
    deleteProject,
    toggleProjectStatus,
    toggleProjectCollected
  };
}
