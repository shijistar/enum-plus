import type { EnumInit, EnumKey, EnumValue, IEnum, PluginFunc, ValueTypeFromSingleInit } from 'enum-plus';
import type { StandardEnumInit } from 'enum-plus/types';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ToValueMapPluginOptions {}

const toValueMapPlugin: PluginFunc<ToValueMapPluginOptions> = (options, Enum) => {
  Enum.extends({
    toValueMap(this: IEnum<StandardEnumInit<string, EnumValue>, string, EnumValue>) {
      const itemsMap = {} as ValueMap;
      this.items.forEach((item) => {
        itemsMap[item.value as keyof typeof itemsMap] = { text: item.label };
      });
      return itemsMap;
    },
  });
};
export default toValueMapPlugin;

declare module 'enum-plus/extension' {
  interface EnumExtension<
    T extends EnumInit<K, V>,
    K extends EnumKey<T> = EnumKey<T>,
    V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
  > {
    /**
     * - **EN:** Generate a mapping object that can be used to bind Select, Checkbox and other form
     *   components, following the data specification of AntDesignPro library
     * - **CN:** 生成一个映射对象，可以用来绑定Select、Checkbox等表单组件，遵循 AntDesignPro 的数据规范
     *
     * @example
     *   {
     *     "0": { "text": "Sunday" },
     *     "1": { "text": "Monday" }
     *   }
     *
     * @see https://procomponents.ant.design/components/schema#valueenum-1
     * @see https://procomponents.ant.design/components/field-set#proformselect
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toValueMap(): ValueMap;
  }
}
export type ValueMap = Record<
  string,
  {
    /**
     * - **EN:** The display text
     * - **CN:** 显示文本
     */
    text: string;
  }
>;
