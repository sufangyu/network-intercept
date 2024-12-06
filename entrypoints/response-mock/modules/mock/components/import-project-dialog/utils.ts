import { cloneDeep } from 'lodash-es';
import {
  useResponseMockGroup,
  useResponseMock,
  useResponseMockProject
} from '@/modules/response-mock/composables';
import {
  ConvertFileds,
  MockRuleItem,
  ResponseGroupItem,
  ResponseProjectItem,
  SAME_RULE_HANDLE_ENUM
} from '@/modules/response-mock/types';

const { createProject } = useResponseMockProject();
const { createGroup, editGroup, getProjectGroup, getProjectGroupByName } = useResponseMockGroup();
const { createMockRule, editMockRule, getMockRuleWithApiAndMethod } = useResponseMock();

/**
 * 新建项目方式导入
 *
 * @param {ResponseGroupItem[]} projectData
 */
export const handleImportByNewProject = async (
  targetProject: ResponseProjectItem,
  groupList: ResponseGroupItem[]
) => {
  const projectItem: ResponseProjectItem = {
    ...targetProject,
    id: '',
    groupList: []
  };

  // 1. 创建项目
  const newProject = await createProject(projectItem, true);
  if (!newProject) {
    return;
  }

  // 2. 遍历创建分组 及 分组下的规则
  groupList.forEach(async (groupItem) => {
    const newGroupItem = cloneDeep(groupItem);
    const newGroup = await createGroup(newGroupItem, newProject, true);

    (groupItem.mockRules ?? []).forEach((ruleItem) => {
      const newRuleItem = cloneDeep(ruleItem);
      createMockRule(newRuleItem, newGroup, newProject, true);
    });
  });
};

/**
 * 处理根据指定 key 的导入
 *
 * @param {ResponseGroupItem} groupItem 分组
 * @param {ResponseProjectItem} targetProject 目标项目
 * @param {string[]} groupKeys 分组 keys
 * @param {[]} ruleKeys 规则 keys
 */
const convertByKeys = async (
  groupItem: ResponseGroupItem,
  targetProject: ResponseProjectItem,
  groupKeys: (keyof ResponseGroupItem)[],
  ruleKeys: (keyof MockRuleItem)[]
) => {
  const newGroupItem = cloneDeep(groupItem);
  let existGroup = getProjectGroup(newGroupItem, targetProject);

  // 已存在分组时, 编辑分组(保留原名称、说明等); 否则新建分组
  if (existGroup) {
    groupKeys.forEach((k) => {
      existGroup?.[k] && ((existGroup as any)[k] = (newGroupItem as any)[k]);
    });
    existGroup = await editGroup(newGroupItem, targetProject, true);
  } else {
    existGroup = await createGroup(newGroupItem, targetProject, true);
  }

  // 规则请求路径和请求方法存在相同时, 编辑规则(保留原名称、说明等); 否则新建分组
  for (const ruleItem of groupItem.mockRules ?? []) {
    const newRuleItem = cloneDeep(ruleItem);
    const existRule = getMockRuleWithApiAndMethod(newRuleItem, existGroup);

    if (existRule) {
      ruleKeys.forEach((k) => {
        newRuleItem?.[k] && ((existRule as any)[k] = (newRuleItem as any)[k]);
      });
      editMockRule(newRuleItem, existGroup!, targetProject, true);
    } else {
      createMockRule(newRuleItem, existGroup!, targetProject, true);
    }
  }
};

/**
 * 处理不同导入类型下规则的导入
 */
const sameRuleHandleFunc: Record<
  SAME_RULE_HANDLE_ENUM,
  (
    groupItem: ResponseGroupItem,
    targetProject: ResponseProjectItem,
    coverFields: ConvertFileds
  ) => Promise<void>
> = {
  [SAME_RULE_HANDLE_ENUM['覆盖已有接口']]: async (groupItem, targetProject): Promise<void> => {
    const newGroupItem = cloneDeep(groupItem);
    let existGroup = getProjectGroup(newGroupItem, targetProject);

    // 已存在分组时, 编辑分组; 否则新建分组
    existGroup = existGroup
      ? await editGroup(newGroupItem, targetProject, true)
      : await createGroup(newGroupItem, targetProject, true);

    // 遍历规则: 已存在规则时, 编辑规则; 否则新建规则
    for (const ruleItem of groupItem.mockRules ?? []) {
      const newRuleItem = cloneDeep(ruleItem);
      const existRule = getMockRuleWithApiAndMethod(newRuleItem, existGroup!);
      existRule
        ? await editMockRule(newRuleItem, groupItem, targetProject, true)
        : await createMockRule(newRuleItem, groupItem, targetProject, true);
    }
  },
  [SAME_RULE_HANDLE_ENUM['智能合并']]: async (groupItem, targetProject): Promise<void> => {
    // 已存在的分组、规则保留已经修改分组和规则的 名称、说明等
    // 规则要传 id 的健, 否则因无法根据原来 id 找不到对应规则导致合并（编辑）无效
    convertByKeys(groupItem, targetProject, ['name'], ['id', 'apiName']);
  },
  [SAME_RULE_HANDLE_ENUM['覆盖指定字段']]: async (
    groupItem,
    targetProject,
    coverFields
  ): Promise<void> => {
    const groupKeys = coverFields.group;
    const ruleKeys = coverFields.rule;

    groupKeys.push('id');
    ruleKeys.push('id');
    convertByKeys(groupItem, targetProject, groupKeys, ruleKeys);
  },
  [SAME_RULE_HANDLE_ENUM['不导入']]: async (groupItem, targetProject): Promise<void> => {
    const newGroupItem = cloneDeep(groupItem);
    let existGroup = getProjectGroup(newGroupItem, targetProject);
    let existGroupSameName = getProjectGroupByName(newGroupItem, targetProject);

    // 已存在分组同名(ID不同)时, 导入的分组名在新建时增加括号后缀, 例如: xxxx(1)
    if (!existGroup) {
      existGroupSameName && (newGroupItem.name = newGroupItem.name + '(1)');
      existGroup = await createGroup(newGroupItem, targetProject, true);
    }

    // 导入相同分组 & 规则请求路径和请求方法存在相同时, 不处理
    for (const ruleItem of groupItem.mockRules ?? []) {
      const newRuleItem = cloneDeep(ruleItem);
      const existRule = getMockRuleWithApiAndMethod(newRuleItem, existGroup);
      if (existRule) {
        continue;
      }

      createMockRule(newRuleItem, existGroup, targetProject, true);
    }
  },
  [SAME_RULE_HANDLE_ENUM['保留两者']]: async (groupItem, targetProject): Promise<void> => {
    const newGroupItem = cloneDeep(groupItem);
    let existGroup = getProjectGroup(newGroupItem, targetProject);
    let existGroupSameName = getProjectGroupByName(newGroupItem, targetProject);

    // 已存在分组同名(ID不同)时, 导入的分组名在新建时增加括号后缀, 例如: xxxx(1)
    if (!existGroup) {
      existGroupSameName && (newGroupItem.name = newGroupItem.name + '(1)');
      existGroup = await createGroup(newGroupItem, targetProject, true);
    }

    // 导入相同分组 & 规则请求路径和请求方法存在相同时, 导入规则名在新增时增加括号后缀, 例如: xxxx(1)
    for (const ruleItem of groupItem.mockRules ?? []) {
      const newRuleItem = cloneDeep(ruleItem);
      const existRule = getMockRuleWithApiAndMethod(newRuleItem, existGroup);
      if (existRule) {
        newRuleItem.apiName = newRuleItem.apiName + '(1)';
      }
      createMockRule(newRuleItem, existGroup, targetProject, true);
    }
  }
};

/**
 * 已有项目方式导入
 *
 * 相同规则处理方式：
 * - 智能合并
 * - 覆盖指定字段：编辑（指定字段）
 *
 * @param {ResponseProjectItem} targetProject
 * @param {ResponseGroupItem[]} projectData
 * @param {SAME_RULE_HANDLE_ENUM} sameRuleHandle
 * @param {ConvertFileds} coverFields
 */
export const handleImportByExitProject = async (
  targetProject: ResponseProjectItem,
  groupList: ResponseGroupItem[],
  sameRuleHandle: SAME_RULE_HANDLE_ENUM,
  coverFields: ConvertFileds
) => {
  // 遍历创建分组 及 分组下的规则
  groupList.forEach(async (groupItem) => {
    await sameRuleHandleFunc[sameRuleHandle]?.(groupItem, targetProject, coverFields);
  });
};

/**
 * 递归获取所有节点的 ID
 *
 * @param {(ResponseGroupItem[] | MockRuleItem[])} nodes
 * @return {*}
 */
export const getAllNodeKeys = (nodes: ResponseGroupItem[] | MockRuleItem[]) => {
  let keys: string[] = [];
  nodes.forEach((node) => {
    keys.push(node.id);

    if (((node as ResponseGroupItem)?.mockRules ?? []).length > 0) {
      keys = keys.concat(getAllNodeKeys((node as ResponseGroupItem).mockRules ?? []));
    }
  });
  return keys;
};

/**
 *  根据节点 ID 获取树结构数据
 * @param nodes 原树结构数据
 * @param checkedKeys 树节点 ID
 */
export const filterTreeData = (nodes: any[], checkedKeys: string[], isRoot = false): any[] => {
  return nodes
    .map((node) => {
      const newNode = { ...node };

      // 如果节点未被勾选，则返回 null
      if (!checkedKeys.includes(newNode.id)) {
        return null;
      }

      let mockRules = (newNode as ResponseGroupItem).mockRules;
      if (mockRules) {
        (newNode as ResponseGroupItem).mockRules = filterTreeData(mockRules, checkedKeys);
      }

      return checkedKeys.includes(newNode.id) || (mockRules && mockRules.length) ? newNode : null;
    })
    .filter((node) => node !== null);
};
