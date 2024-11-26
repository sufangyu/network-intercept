import { nanoid } from 'nanoid';
import { headerInterceptConfig } from '../data';
import { HeaderInterceptGroupItem, type HeaderRuleItem } from '../types';
import { useUpdateStorage } from './use-update-storage';

const { updateStorage } = useUpdateStorage();

export function useHeaderInterceptRule() {
  /**
   * 创建规则
   *
   * @param {string} groupId 分组 ID
   * @param {HeaderRuleItem} ruleItem 规则
   * @param {boolean} [silent=false] 是否静默添加
   */
  const createRule = (groupId: string, ruleItem: HeaderRuleItem, silent = false) => {
    const curRuleItem: HeaderRuleItem = {
      ...ruleItem,
      id: nanoid()
    };
    const curGroup = headerInterceptConfig.value.data.find((it) => it.id === groupId);
    curGroup?.rules?.unshift(curRuleItem);

    updateStorage({
      data: headerInterceptConfig.value,
      resultMessage: { message: '添加成功', silent }
    });
  };

  /**
   * 编辑规则
   *
   * @param {string} groupId
   * @param {HeaderRuleItem} ruleItem
   */
  const editRule = (groupId: string, ruleItem: HeaderRuleItem) => {
    const curGroup = headerInterceptConfig.value.data.find((it) => it.id === groupId);
    const curRuleIndex = curGroup?.rules.findIndex((it) => it.id === ruleItem.id);

    if (curGroup && curRuleIndex !== undefined && curRuleIndex !== -1) {
      curGroup.rules[curRuleIndex] = {
        ...ruleItem
      };

      updateStorage({
        data: headerInterceptConfig.value,
        resultMessage: { message: '编辑成功' }
      });
    }
  };

  /**
   * 删除规则
   *
   * @param {string} groupId
   * @param {HeaderRuleItem} ruleItem
   */
  const deleteRule = (groupId: string, ruleItem: HeaderRuleItem) => {
    const curGroup = headerInterceptConfig.value.data.find((it) => it.id === groupId);
    const curRuleIndex = curGroup?.rules.findIndex((it) => it.id === ruleItem.id);

    if (curGroup && curRuleIndex !== undefined && curRuleIndex !== -1) {
      curGroup.rules.splice(curRuleIndex, 1);

      updateStorage({
        data: headerInterceptConfig.value,
        resultMessage: { message: '删除成功' }
      });
    }
  };

  /**
   * 删除所有规则
   *
   * @param {HeaderInterceptGroupItem} group
   */
  const deleteAllHeaderRule = (group: HeaderInterceptGroupItem) => {
    group.rules = [];

    updateStorage({
      data: headerInterceptConfig.value,
      resultMessage: { message: '重置成功' }
    });
  };

  /**
   * 移动分组
   * @param oldGroupId 当前分组 ID
   * @param nextGroupId 下一个分组 ID
   * @param ruleItem 规则数据
   * @returns
   */
  const moveRule = (oldGroupId: string, nextGroupId: string, ruleItem: HeaderRuleItem) => {
    // 1. 在新分组添加当前规则
    const newGroup = headerInterceptConfig.value.data.find((it) => it.id === nextGroupId);
    newGroup?.rules.unshift(ruleItem!);

    // 2. 在旧分组中删除当前规则
    const oldGroup = headerInterceptConfig.value.data.find((it) => it.id === oldGroupId);
    oldGroup!.rules = oldGroup?.rules?.filter((it) => it.id !== ruleItem?.id) ?? [];

    // 3. 更新存储
    updateStorage({
      data: headerInterceptConfig.value,
      resultMessage: { message: '移动成功' }
    });
  };

  /**
   * 获取规则
   *
   * @param {string} groupId
   * @param {string} ruleId
   * @return {*}
   */
  const getRule = (groupId: string, ruleId: string) => {
    const curGroup = headerInterceptConfig.value.data.find((it) => it.id === groupId);
    return curGroup?.rules.find((it) => it.id === ruleId);
  };

  /**
   * 获取规则（根据名称）
   *
   * @param {string} groupId
   * @param {HeaderRuleItem} rule
   * @return {*}
   */
  const getRuleByName = (groupId: string, rule: HeaderRuleItem) => {
    const curGroup = headerInterceptConfig.value.data.find((it) => it.id === groupId);
    return curGroup?.rules.find((it) => it.name === rule.name);
  };

  return {
    createRule,
    editRule,
    deleteRule,
    deleteAllHeaderRule,
    moveRule,
    getRule,
    getRuleByName
  };
}
