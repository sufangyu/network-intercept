import { ElMessage, FormInstance } from 'element-plus';
import { responseProject } from '../data';
import type { ResponseGroupItem, ResponseProject, ResponseProjectItem } from '../types';
import { nanoid } from 'nanoid';
import { STORAGE_KEY_RESPONSE_MOCK } from '../const';
import { cloneDeep } from 'lodash-es';

/** 当前激活的分组ID */
const activeGroupId = ref('');

export function useResponseMockGroup() {
  /**
   * 设置当前激活的分组ID
   *
   * @param {string} id
   */
  const setActiveGroupId = (id: string) => {
    activeGroupId.value = id;
  };

  const formRef = ref<FormInstance>();
  /** 分组单项 */
  const groupForm = ref<ResponseGroupItem>({
    id: '',
    name: '',
    requestHeaders: [],
    mockRules: [],
    responseDataBase: ''
  });

  /**
   * 创建分组
   *
   * @param {ResponseGroupItem} item 分组数据
   * @param {ResponseProjectItem} project 项目
   */
  const createGroup = async (
    item: ResponseGroupItem,
    project: ResponseProjectItem,
    silent = false
  ) => {
    const curItem: ResponseGroupItem = {
      ...item,
      mockRules: [],
      id: nanoid()
    };

    const curProject = responseProject.value?.list?.find((it) => it.id === project.id);
    curProject?.groupList?.push(curItem);
    activeGroupId.value = curItem.id;

    await updateStorage({
      data: responseProject.value,
      resultMessage: { message: '创建成功', type: 'success', silent }
    });

    return curItem;
  };

  /**
   * 编辑分组
   *
   * @param {ResponseGroupItem} item 分组数据
   * @param {ResponseProjectItem} project 项目
   * @return {*}
   */
  const editGroup = async (
    item: ResponseGroupItem,
    project: ResponseProjectItem,
    silent = false
  ) => {
    const curProject = responseProject.value?.list?.find((it) => it.id === project.id);
    let curGroupIdx = curProject?.groupList?.findIndex((it) => it.id === item.id);

    if (curGroupIdx !== undefined && curGroupIdx > -1 && curProject) {
      // 更新数组的基础数据
      const curGroup = cloneDeep(curProject!.groupList[curGroupIdx]);
      curProject!.groupList[curGroupIdx] = {
        ...item,
        mockRules: curGroup.mockRules ?? []
      };
      await updateStorage({
        data: responseProject.value,
        resultMessage: { message: '编辑成功', type: 'success', silent }
      });

      return curGroup;
    }
  };

  /**
   * 删除分组
   *
   * @param {ResponseGroupItem} item 分组数据
   * @param {ResponseProjectItem} project 项目
   * @return {*}
   */
  const deleteGroup = (item: ResponseGroupItem, project: ResponseProjectItem) => {
    const curProject = responseProject.value?.list?.find((it) => it.id === project.id);
    const newGroupList = project.groupList?.filter((it) => it.id !== item.id);

    if (!curProject) {
      ElMessage.error('项目不存在');
      return;
    }

    curProject!.groupList = newGroupList ?? [];
    updateStorage({
      data: responseProject.value,
      resultMessage: { message: '删除成功', type: 'success' }
    });
  };

  /**
   * 获取项目分组
   *
   * @param {ResponseGroupItem} item 分组数据
   * @param {ResponseProjectItem} project 项目
   * @return {*}
   */
  const getProjectGroup = (item: ResponseGroupItem, project: ResponseProjectItem) => {
    return responseProject.value?.list
      ?.find((it) => it.id === project.id)
      ?.groupList?.find((it) => it.id === item.id);
  };

  /**
   * 获取同名的项目分组
   *
   * @param {string} name 分组名称
   * @param {ResponseProjectItem} project 项目
   * @return {*}
   */
  const getProjectGroupByName = (item: ResponseGroupItem, project: ResponseProjectItem) => {
    return responseProject.value?.list
      ?.find((it) => it.id === project.id)
      ?.groupList?.find((it) => it.name === item.name);
  };

  return {
    activeGroupId,
    setActiveGroupId,
    getProjectGroup,
    getProjectGroupByName,
    //
    formRef,
    groupForm,
    createGroup,
    editGroup,
    deleteGroup
  };
}

/**
 * 更新项目数据到本地
 *
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