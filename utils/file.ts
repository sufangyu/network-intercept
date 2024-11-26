import { version } from '../package.json';

/**
 * 导出数据
 *
 * @param {(string | object)} [data=''] 传入导出json文件的数据, 格式为json对象或者json字符串
 * @param {string} filename 导出json文件的文件名称
 * @param {boolean} [withVersion=true] 是否包含版本信息
 */
export const exportFile = (data: string | object = '', filename: string, withVersion = true) => {
  if (withVersion) {
    data = { version, data };
  }

  let exportData = data as string;
  if (typeof data === 'object') {
    exportData = JSON.stringify(data, null, 4);
  }

  const blob = new Blob([exportData], { type: 'text/json' });
  const ev = new MouseEvent('click');
  const link = document.createElement('a');

  link.download = filename;
  link.href = window.URL.createObjectURL(blob);
  link.dataset.downloadurl = ['text/json', link.download, link.href].join(':');
  link.dispatchEvent(ev);
};

/**
 * 读取文件内容
 *
 * @param {File} file 文件对象
 * @return {*}  {Promise<string>}
 */
export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      resolve(event.target?.result as string);
    };

    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };
    ``;
    reader.readAsText(file);
  });
};
