import json5 from 'json5';
export function useCodeMirror() {
  /**
   * 多语言配置项
   */
  const phrasesConfig = {
    Find: '查找内容',
    Replace: '替换内容',
    next: '下一个',
    previous: '上一个',
    all: '全部',
    replace: '替换',
    'replace all': '全部替换',
    'match case': '区分大小写',
    'by word': '匹配整个',
    regexp: '正则'
  };

  /**
   * 使用 json5 校验数据
   *
   * @param {string} value
   * @returns {void} 错误信息 | null
   */
  const validateByJson5 = (value: string) => {
    let error = null;
    try {
      json5.parse(value);
    } catch (err) {
      if (err instanceof Error && typeof err.message === 'string') {
        // 提取错误的行号和列号
        const match = err.message.match(/at (\d+):(\d+)/);
        if (match) {
          const line = match[1];
          const column = match[2];
          error = `第${line}行, 第${column}列附近存在语法错误，请检查！`;
        }
      } else {
        error = '请输入正确的JSON格式';
      }
    }

    return error;
  };

  return {
    phrasesConfig,
    validateByJson5
  };
}
