import { ImportFileWithVersion } from '@/types';
import { ElMessage } from 'element-plus';
import { ResponseProjectItem } from '../types';
import ImportProjectDialog from '../components/import-project-dialog/index.vue';
import { responseProjectItemSchema } from '../scheme/project';

export function useResponseMockImport() {
  /** 导入触发的`input`元素 */
  const fileInputRef = ref<HTMLInputElement | null>(null);

  const fileInputListRef = ref<HTMLInputElement[]>([]);

  const importProjectDialogRef = ref<InstanceType<typeof ImportProjectDialog> | null>(null);

  /**
   * 导入项目配置
   *
   * @param {Event} event
   * @param {(ResponseProjectItem | null)} [targetProject=null]
   * @return {*}
   */
  const handleImportProjectConfig = async (
    event: Event,
    targetProject: ResponseProjectItem | null = null
  ) => {
    const file = getFile(event);
    if (!file) {
      return;
    }

    // 1. 读取文件内容格式化为 json
    let fileContentJson: ImportFileWithVersion<ResponseProjectItem> | null = null;
    let parseErrorMsg = '';
    try {
      const fileContent = await readFileAsText(file);
      fileContentJson = JSON.parse(fileContent) as ImportFileWithVersion<ResponseProjectItem>;
    } catch (error) {
      console.error('文件解析失败', error);
      parseErrorMsg = '文件解析失败';
    }
    if (parseErrorMsg) {
      ElMessage.error({ message: '文件解析失败', grouping: true });
      return;
    }

    // 2. 校验数据格式是否正确
    const result = responseProjectItemSchema.safeParse(fileContentJson?.data);

    if (!result.success) {
      // 提取错误信息
      const errorMessages = result.error.errors.map((error) => {
        return `${error.path.join('.')} 校验失败: ${error.message}`
          .replace('Expected', '预期')
          .replace('received', '结果')
          .replace('Required', '必填项');
      });
      // console.log("验证失败:", errorMessages, errorMessages.join("; "));
      ElMessage.error({ message: errorMessages.join(';\n'), grouping: true });
      return;
    }

    // 3. 是否允许选择导入类型
    const importProject = result.data as ResponseProjectItem;
    importProjectDialogRef.value?.open(importProject, targetProject);

    // 4. 后续在导入项目对话框中完成导入操作
  };

  return {
    fileInputRef,
    fileInputListRef,
    importProjectDialogRef,
    handleImportProjectConfig
  };
}

/**
 * 获取文件对象
 *
 * - 校验文件类型
 *
 * @param {Event} event
 * @return {*}  {(File | null)}
 */
const getFile = (event: Event): File | null => {
  const input = event.target as HTMLInputElement;
  if ((input.files ?? [])?.length <= 0) {
    return null;
  }

  const file = input.files?.[0];
  // 重置 input 的值，确保可以再次触发 change 事件
  input.value = '';

  if (file?.type !== 'application/json' || !file?.name.endsWith('.json')) {
    ElMessage.warning({ message: '请选择json格式文件', grouping: true });
    return null;
  }

  return file;
};
