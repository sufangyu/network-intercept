const windowsMap: Map<string, Window | null> = new Map();

export const windowHelper = {
  /**
   * 打开窗口
   *
   * @param {string} url
   * @param {string} uniqueId
   */
  open(url: string, uniqueId: string) {
    const curWindow = windowsMap.get(uniqueId);

    if (!curWindow || curWindow.closed) {
      const newWindow = window.open(url, uniqueId);
      windowsMap.set(uniqueId, newWindow);
    } else {
      curWindow.focus();
    }
  },
  /**
   * 关闭窗口
   */
  close(): void {
    window?.close();
  }
};
