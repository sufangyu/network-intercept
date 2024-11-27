import { name } from '../package.json';

/**
 * 获取扩展名
 */
export const getExtensionName = ((): string => {
  return name
    .split('-')
    .map((word, index) => {
      return index === 0
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join('-');
})();

/**
 * 休眠函数
 *
 * @param {number} duraction 秒
 * @return {*}  {Promise<void>}
 */
export const sleep = (duraction: number = 250): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, duraction));
};

/**
 * 获取枚举值对应的 key
 *
 * @template T
 * @param {T} enumObj
 * @param {T[keyof T]} value
 * @return {*}  {(string | undefined)}
 */
export const getEnumKeyByValue = <T extends Record<string, string | number>>(
  enumObj: T,
  value?: T[keyof T]
): string | undefined => {
  if (!value) {
    return undefined;
  }

  for (const key in enumObj) {
    if (enumObj[key] === value) {
      return key;
    }
  }
  return undefined;
};

/**
 * 格式化对象字符串的缩进空格
 *
 * @param {string} data
 * @param {number} [indenTabIndent=2]
 * @return {*}
 */
export const formatObjectTabIndent = (data: string, indenTabIndent = 2) => {
  if (!data) {
    return data;
  }

  const formatData = JSON.parse(data);
  return isObject(formatData) ? JSON.stringify(formatData, null, indenTabIndent) : data;
};

/**
 * 判断是否为对象
 * @param data
 * @returns
 */
export const isObject = (data: any) => {
  return Object.prototype.toString.call(data) === '[object Object]';
};
