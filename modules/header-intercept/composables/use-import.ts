import { cloneDeep } from 'lodash-es';
import { ElMessage } from 'element-plus';
import { ImportFileWithVersion } from '@/types';
import { HeaderInterceptGroupItem } from '../types';
import { headerInterceptGroupItemSchema } from '../scheme/group';
import { useHeaderInterceptRule } from './use-rule';

const { createRule, getRuleByName } = useHeaderInterceptRule();

export function useHeaderInterceptImport() {
  /** 导入触发的`input`元素 */
  const fileInputRef = ref<HTMLInputElement | null>(null);

  /**
   * 导入请求头拦截配置
   *
   * @param {Event} event 事件对象
   * @param {(HeaderInterceptGroupItem | null)} gruop 当前分组
   * @return {*}
   */
  const handleHeaderInterceptRule = async (event: Event, gruop: HeaderInterceptGroupItem) => {
    const file = getFile(event);
    if (!file) {
      return;
    }

    // 1. 读取文件内容格式化为 json
    let fileContentJson: ImportFileWithVersion<HeaderInterceptGroupItem> | null = null;
    let parseErrorMsg = '';
    try {
      const fileContent = await readFileAsText(file);
      fileContentJson = JSON.parse(fileContent) as ImportFileWithVersion<HeaderInterceptGroupItem>;
    } catch (error) {
      console.error('文件解析失败', error);
      parseErrorMsg = '文件解析失败';
    }
    if (parseErrorMsg) {
      ElMessage.error({ message: '文件解析失败', grouping: true });
      return;
    }

    // 2. 校验数据格式是否正确
    const result = headerInterceptGroupItemSchema.safeParse(fileContentJson?.data);

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

    // 3. 遍历规则并导入, 发现同名的修改名称为 xxx(1) 再导入（创建）
    const importRules = result.data.rules ?? [];
    for (let i = importRules.length - 1; i >= 0; i--) {
      const ruleItem = cloneDeep(importRules[i]);
      const existRule = getRuleByName(gruop.id, ruleItem);

      if (!!existRule) {
        ruleItem.name = `${ruleItem.name}-${Date.now()}(1)`;
      }

      createRule(gruop.id, ruleItem, true);
    }

    // 4. 提示导入成功
    ElMessage.success({ message: '导入成功', grouping: true });
  };

  return {
    fileInputRef,
    handleHeaderInterceptRule
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
