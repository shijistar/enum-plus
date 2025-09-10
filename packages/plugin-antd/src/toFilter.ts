import type { EnumInit, EnumKey, EnumValue, IEnum, PluginFunc, ValueTypeFromSingleInit } from '@enum-plus';
import type { StandardEnumInit } from '@enum-plus/types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ToFilterPluginOptions {}

const toFilterPlugin: PluginFunc<ToFilterPluginOptions> = (options, Enum) => {
  Enum.extends({
    toFilter(this: IEnum<StandardEnumInit<string, EnumValue>, string, EnumValue>): ColumnFilterItem<EnumValue>[] {
      return Array.from(this.items.map(({ value, label }) => ({ text: label, value })));
    },
  });
};
export default toFilterPlugin;

declare module 'enum-plus/extension' {
  interface EnumExtension<
    T extends EnumInit<K, V>,
    K extends EnumKey<T> = EnumKey<T>,
    V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
  > {
    /**
     * - **EN:** Generate an object array that can add filtering function to table columns, following
     *   the data specification of ant-design Table component
     * - **CN:** 生成一个对象数组，可以给表格列增加筛选功能，遵循 ant-design Table 组件的数据规范
     *
     * @example
     *   [
     *     { text: 'Sunday', value: 0 },
     *     { text: 'Monday', value: 1 },
     *   ];
     *
     * @see https://ant.design/components/table-cn#components-table-demo-head
     * @see https://ant.design/components/table-cn#column
     */
    toFilter(): ColumnFilterItem<V>[];
  }
}

/**
 * - **EN:** Data structure of column filter items of ant-design Table
 * - **CN:** ant-design 表格列筛选项的数据结构
 */
export interface ColumnFilterItem<V> {
  /**
   * - **EN:** The display name of the filter item
   * - **CN:** 筛选项的显示名称
   */
  text: string;
  /**
   * - **EN:** The value of the filter item
   * - **CN:** 筛选项的值
   */
  value: V;
}
