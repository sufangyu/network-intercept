import { Help, Money, Position } from '@element-plus/icons-vue';

export const MenuList: MenuItem[] = [
  {
    label: '自动跳转',
    pageName: 'AutoGotoUrl',
    icon: Money
  }
  // {
  //   label: '关于 Tools',
  //   pageName: 'AutoGotoUrl2',
  //   icon: Position,
  //   divider: true
  // }
];

interface MenuItem {
  /**
   * 菜单名称
   *
   * @type {string}
   * @memberof MenuItem
   */
  label: string;
  /**
   * 菜单对应的页面路由名称
   *
   * @type {string}
   * @memberof MenuItem
   */
  pageName: string;
  /**
   * 菜单对应的图标
   *
   * @type {*}
   * @memberof MenuItem
   */
  icon?: any;
  /**
   * 菜单分割线
   *
   * @type {boolean}
   * @memberof MenuItem
   */
  divider?: boolean;
  /**
   * 菜单是否禁用
   *
   * @type {boolean}
   * @memberof MenuItem
   */
  disabled?: boolean;
}
