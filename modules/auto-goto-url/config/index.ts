import { AUTO_GOTO_URL_REDIRECT_TYPE_ENUM, AutoGotoUrlConfigItem } from '../types';

export const defaultConfigList: AutoGotoUrlConfigItem[] = [
  {
    name: '掘金',
    match: 'https://link.juejin.cn/?target=',
    enableRegex: false,
    redirectType: AUTO_GOTO_URL_REDIRECT_TYPE_ENUM.目标Key,
    redirect: 'target',
    status: 'enabled'
  },
  {
    name: '简书',
    match: 'https://www.jianshu.com/go-wild?',
    enableRegex: false,
    redirectType: AUTO_GOTO_URL_REDIRECT_TYPE_ENUM.目标Key,
    redirect: 'url',
    status: 'enabled'
  },
  {
    name: '知乎',
    match: 'https://link.zhihu.com/?',
    enableRegex: false,
    redirectType: AUTO_GOTO_URL_REDIRECT_TYPE_ENUM.目标Key,
    redirect: 'target',
    status: 'enabled'
  },
  {
    name: 'CSDN',
    match: 'https://link.csdn.net/?target=',
    redirect: 'target',
    enableRegex: false,
    redirectType: AUTO_GOTO_URL_REDIRECT_TYPE_ENUM.目标Key,
    status: 'enabled'
  },
  {
    name: '开源中国',
    match: 'https://www.oschina.net/action/GoToLink?url=',
    redirect: 'url',
    enableRegex: false,
    redirectType: AUTO_GOTO_URL_REDIRECT_TYPE_ENUM.目标Key,
    status: 'enabled'
  }
];
