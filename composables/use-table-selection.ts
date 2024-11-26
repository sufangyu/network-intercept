import { ElTable } from 'element-plus';
import { Ref } from 'vue';

/**
 * 表格多选
 *
 * - multipleTableRef: 表格实例
 * - multipleSelection: 选中的数据
 * - handleSelectionChange: 表格选中事件
 * @template T
 * @return {*}
 */
export function useTableSelection<T = any>() {
  const multipleTableRef = ref<InstanceType<typeof ElTable>>();
  const multipleSelection = ref<T[]>([]) as Ref<T[]>;

  const handleSelectionChange = (val: T[]) => {
    multipleSelection.value = val ?? [];
  };

  return {
    multipleTableRef,
    multipleSelection,
    handleSelectionChange
  };
}
