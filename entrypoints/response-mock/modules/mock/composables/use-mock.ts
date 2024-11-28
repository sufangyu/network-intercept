import { FormInstance } from 'element-plus';
import { nanoid } from 'nanoid';
import { STATUS_GLOBAL_ENUM } from '@/types';
import {
  DELAY_TIME_ENUM,
  MATCH_TYPE_ENUM,
  MOCK_TYPE_ENUM,
  MockRuleItem,
  ResponseGroupItem,
  ResponseProjectItem
} from '../types';
import { responseProject } from '../data';
import { useUpdateStorage } from './use-update-storage';

const { updateStorage } = useUpdateStorage();

export function useResponseMock() {
  const formRef = ref<FormInstance>();
  const mockForm = ref<MockRuleItem>({
    id: '',
    apiUrl: '',
    apiName: '',
    state: STATUS_GLOBAL_ENUM.启用,
    mockType: MOCK_TYPE_ENUM.常规,
    matchType: MATCH_TYPE_ENUM.包含,
    methodType: '',
    responseState: '200',
    delayTime: DELAY_TIME_ENUM['500ms'],
    responseData: ''
  });

  /**
   * 创建/克隆 Mock 规则
   *
   * @param {MockRuleItem} item mock 规则
   * @param {ResponseGroupItem} group 分组
   * @param {project} project 项目
   * @param {boolean} [silent=false] 是否静默创建（不显示提示信息）
   */
  const createMockRule = async (
    item: MockRuleItem,
    group: ResponseGroupItem,
    project: ResponseProjectItem,
    silent = false
  ) => {
    const curItem: MockRuleItem = {
      ...item,
      id: nanoid()
    };
    const curGroup = responseProject.value?.list
      .find((it) => it.id === project.id)
      ?.groupList.find((it) => it.id === group?.id);

    curGroup?.mockRules?.push(curItem);

    await updateStorage({
      data: responseProject.value,
      resultMessage: { message: '创建成功', type: 'success', silent }
    });
  };

  /**
   * 编辑 Mock 规则
   *
   * @param {MockRuleItem} item mock 规则
   * @param {ResponseGroupItem} group 分组
   * @param {ResponseProjectItem} project 项目
   * @param {boolean} [silent=false] 是否静默创建（不显示提示信息）
   */
  const editMockRule = async (
    item: MockRuleItem,
    group: ResponseGroupItem,
    project: ResponseProjectItem,
    silent = false
  ) => {
    const curGroup = responseProject.value?.list
      .find((it) => it.id === project.id)
      ?.groupList.find((it) => it.id === group?.id);
    const curMockRuleIdx = curGroup?.mockRules?.findIndex((it) => it.id === item.id);

    if (curMockRuleIdx !== undefined && curMockRuleIdx > -1 && curGroup) {
      // 更新数组的值
      const curRuleItem = curGroup.mockRules![curMockRuleIdx!];
      curGroup.mockRules![curMockRuleIdx!] = {
        responseHeaders: curRuleItem.responseHeaders ?? [],
        ...item
      };

      await updateStorage({
        data: responseProject.value,
        resultMessage: { message: '编辑成功', type: 'success', silent }
      });
    }
  };

  /**
   * 删除 Mock 规则
   *
   * @param {MockRuleItem} item mock 规则
   * @param {ResponseGroupItem} group 分组
   */
  const deleteMockRule = (item: MockRuleItem, group: ResponseGroupItem) => {
    const newGroupList = group.mockRules?.filter((it) => it.id !== item.id);

    group!.mockRules = newGroupList ?? [];
    updateStorage({
      data: responseProject.value,
      resultMessage: { message: '删除成功', type: 'success' }
    });
  };

  /**
   * 获取 Mock 规则
   *
   * @param {MockRuleItem} item mock 规则
   * @param {ResponseGroupItem} [group] 分组
   * @return {*}
   */
  const getMockRule = (item: MockRuleItem, group?: ResponseGroupItem) => {
    return group?.mockRules?.find((it) => it.id === item.id);
  };

  /**
   * 获取 Mock 规则（根据 API 和 Method）
   *
   * @param {MockRuleItem} item
   * @param {ResponseGroupItem} [group]
   * @return {*}
   */
  const getMockRuleWithApiAndMethod = (item: MockRuleItem, group?: ResponseGroupItem) => {
    const { apiUrl, methodType } = item;
    return group?.mockRules?.find((it) => it.apiUrl === apiUrl && it.methodType === methodType);
  };

  /**
   * 切换 mock 规则状态
   *
   * @param {MockRuleItem} item
   * @param {boolean} needSetValue 是否需要更新状态
   */
  const toggleMockRuleStatus = (item: MockRuleItem, needSetValue = true) => {
    const message = item.state === STATUS_GLOBAL_ENUM.启用 ? '启用成功' : '停用成功';
    updateStorage({ data: responseProject.value, resultMessage: { message, type: 'success' } });
  };

  /**
   * 删除全部 Mock 规则
   *
   * @param {ResponseGroupItem} group
   */
  const deleteAllMockRule = (group: ResponseGroupItem) => {
    group.mockRules = [];
    updateStorage({
      data: responseProject.value,
      resultMessage: { message: '重置成功', type: 'success' }
    });
  };

  return {
    toggleMockRuleStatus,
    deleteMockRule,
    deleteAllMockRule,
    getMockRule,
    getMockRuleWithApiAndMethod,
    //
    formRef,
    mockForm,
    createMockRule,
    editMockRule
  };
}
