import { nanoid } from 'nanoid';
import { headerInterceptConfig } from '../data';
import { HeaderInterceptGroupItem } from '../types';
import { useUpdateStorage } from './use-update-storage';

const { updateStorage } = useUpdateStorage();

/** 当前激活的分组ID */
const activeGroupId = ref('');

/**
 * 请求头拦截 分组
 *
 * @export
 * @return {*}
 */
export function useHeaderInterceptGroup() {
  const setActiveGroupId = (id: string) => {
    activeGroupId.value = id;
  };

  /**
   * 创建分组
   *
   * @param {string} groupName
   */
  const createGroup = (groupName: string) => {
    const curGroupId = nanoid();
    const curGroup: HeaderInterceptGroupItem = {
      id: curGroupId,
      groupName,
      rules: []
    };

    activeGroupId.value = curGroupId;
    headerInterceptConfig.value.data.push(curGroup);

    updateStorage({
      data: headerInterceptConfig.value,
      resultMessage: { message: '添加成功' }
    });
  };

  /**
   * 编辑分组
   *
   * @param {HeaderInterceptGroupItem} item
   */
  const editGroup = (item: HeaderInterceptGroupItem) => {
    const index = headerInterceptConfig.value.data.findIndex((it) => it.id === item.id);
    headerInterceptConfig.value.data[index] = { ...item };

    updateStorage({
      data: headerInterceptConfig.value,
      resultMessage: { message: '编辑成功' }
    });
  };

  /**
   * 删除分组
   *
   * @param {HeaderInterceptGroupItem} item
   */
  const deleteGroup = (item: HeaderInterceptGroupItem) => {
    const index = headerInterceptConfig.value.data.findIndex((it) => it.id === item.id);
    headerInterceptConfig.value.data.splice(index, 1);

    // 删除当前激活的分组, 则默认选中第一个
    if (item.id === activeGroupId.value) {
      setActiveGroupId(headerInterceptConfig.value.data?.[0]?.id ?? '');
    }

    updateStorage({
      data: headerInterceptConfig.value,
      resultMessage: { message: '删除成功' }
    });
  };

  return {
    activeGroupId,
    setActiveGroupId,
    //
    createGroup,
    editGroup,
    deleteGroup
  };
}
