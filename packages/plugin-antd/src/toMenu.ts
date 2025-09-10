import type { EnumInit, EnumKey, EnumValue, IEnum, PluginFunc, ValueTypeFromSingleInit } from '@enum-plus';
import type { StandardEnumInit } from '@enum-plus/types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ToMenuPluginOptions {}

const toMenuPlugin: PluginFunc<ToMenuPluginOptions> = (options, Enum) => {
  Enum.extends({
    toMenu(this: IEnum<StandardEnumInit<string, EnumValue>, string, EnumValue>): MenuItemOption<EnumValue>[] {
      return Array.from(this.items.map(({ value, label }) => ({ key: value, label })));
    },
  });
};
export default toMenuPlugin;

declare module 'enum-plus/extension' {
  interface EnumExtension<
    T extends EnumInit<K, V>,
    K extends EnumKey<T> = EnumKey<T>,
    V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
  > {
    /**
     * - **EN:** Generate an object array that can be bound to the data source of components such as
     *   Menu and Dropdown, following the data specification of ant-design
     * - **CN:** 生成一个对象数组，可以绑定到 Menu、Dropdown 等组件的数据源，遵循 ant-design 的数据规范
     *
     * @example
     *   [
     *     { key: 0, label: 'Sunday' },
     *     { key: 1, label: 'Monday' },
     *   ];
     *
     * @see https://ant.design/components/menu-cn#itemtype
     */
    toMenu(): MenuItemOption<V>[];
  }
}

/**
 * - **EN:** Data structure of menu items of ant-design Menu component
 * - **CN:** ant-design Menu 组件的菜单项数据结构
 */
export interface MenuItemOption<V> {
  /**
   * - **EN:** Unique key of the menu item, usually corresponds to the value of the enum item
   * - **CN:** 菜单项的唯一键，通常对应枚举项的值
   */
  key: V;
  /**
   * - **EN:** Display label of the menu item
   * - **CN:** 菜单项的显示标签
   */
  label: string;
}
