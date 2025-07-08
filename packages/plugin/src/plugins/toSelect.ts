import type {
  EnumInit,
  EnumItemClass,
  EnumKey,
  EnumValue,
  IEnum,
  PluginFunc,
  ValueTypeFromSingleInit,
} from 'enum-plus';
import type { StandardEnumInit, StandardEnumItemInit } from 'lib/types';

export type PluginOptions = Pick<ToSelectConfig<EnumInit, string, string>, 'labelField' | 'valueField'>;

const toSelectPlugin: PluginFunc<PluginOptions> = (options, Enum) => {
  const { labelField: globalLabelField, valueField: globalValueField } = options ?? {};
  Enum.extends({
    toSelect<
      FOV extends
        | ((item: EnumItemClass<StandardEnumItemInit<EnumValue>, string, EnumValue> | undefined) => string)
        | string,
      FOL extends
        | ((item: EnumItemClass<StandardEnumItemInit<EnumValue>, string, EnumValue> | undefined) => string)
        | string,
    >(
      this: IEnum<StandardEnumInit<string, EnumValue>, string, EnumValue>,
      config?: ToSelectConfig<StandardEnumInit<string, EnumValue>, FOV, FOL, string, EnumValue> &
        FirstOptionConfig<
          EnumValue,
          FOV extends (item: EnumItemClass<StandardEnumItemInit<EnumValue>, string, EnumValue> | undefined) => infer R
            ? R
            : FOV,
          FOL extends (item: EnumItemClass<StandardEnumItemInit<EnumValue>, string, EnumValue> | undefined) => infer R
            ? R
            : FOL
        >
    ): SelectItem<
      EnumValue,
      FOV extends (item: EnumItemClass<StandardEnumItemInit<EnumValue>, string, EnumValue> | undefined) => infer R
        ? R
        : FOV,
      FOL extends (item: EnumItemClass<StandardEnumItemInit<EnumValue>, string, EnumValue> | undefined) => infer R
        ? R
        : FOL
    >[] {
      const {
        firstOption,
        labelField = globalLabelField ?? 'label',
        valueField = globalValueField ?? 'value',
      } = config ?? {};
      const selectItems = this.items.map((item) => {
        const valueFieldName = typeof valueField === 'function' ? valueField(item) : (valueField as string);
        const labelFieldName = typeof labelField === 'function' ? labelField(item) : (labelField as string);
        return {
          [valueFieldName]: item.value,
          [labelFieldName]: item.label,
        } as SelectItem<
          EnumValue,
          FOV extends (item: EnumItemClass<StandardEnumItemInit<EnumValue>, string, EnumValue> | undefined) => infer R
            ? R
            : FOV,
          FOL extends (item: EnumItemClass<StandardEnumItemInit<EnumValue>, string, EnumValue> | undefined) => infer R
            ? R
            : FOL
        >;
      });
      if (firstOption) {
        return [firstOption, ...selectItems];
      } else {
        return selectItems;
      }
    },
  });
};

/** More options for the options method */
export interface ToSelectConfig<
  T extends EnumInit<K, V>,
  FOV extends string | ((item: EnumItemClass<T[K], K, V>) => string),
  FOL extends string | ((item: EnumItemClass<T[K], K, V>) => string),
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
> {
  /**
   * - **EN:** The name of the value field in the output object, or a function to get the field name,
   *   default is `value`
   * - **CN:** 输出对象的value字段名，或者获取字段名的函数，默认为 `value`
   */
  valueField?: FOV;
  /**
   * - **EN:** The name of the label field in the output object, or a function to get the field name,
   *   default is `label`
   * - **CN:** 输出对象的label字段名，或者获取字段名的函数，默认为 `label`
   */
  labelField?: FOL;
}

export interface FirstOptionConfig<V = EnumValue, FOV extends string = string, FOL extends string = string> {
  /**
   * - **EN:** Add a default option at the top, the data structure is the same as `SelectItem`
   * - **CN:** 在头部添加一个默认选项，数据结构与 `SelectItem` 相同
   */
  firstOption?: SelectItem<V, FOL, FOV>;
}

/** Data structure of ant-design Select options */
export type SelectItem<V = EnumValue, FOV extends string = 'value', FOL extends string = 'label'> = Record<FOV, V> &
  Record<FOL, string>;

export default toSelectPlugin;

declare module 'enum-plus/extension' {
  interface EnumExtension<
    T extends EnumInit<K, V>,
    K extends EnumKey<T> = EnumKey<T>,
    V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
  > {
    toSelect(this: IEnum<T, K, V> & EnumExtension<T, K, V>): SelectItem<V, 'value', 'label'>[];
    toSelect<
      FOV extends string | ((item: EnumItemClass<T[K], K, V> | undefined) => string),
      FOL extends string | ((item: EnumItemClass<T[K], K, V> | undefined) => string),
    >(
      this: IEnum<T, K, V> & EnumExtension<T, K, V>,
      config: ToSelectConfig<T, FOV, FOL, K, V> &
        FirstOptionConfig<
          V,
          FOV extends (item: EnumItemClass<T[K], K, V> | undefined) => infer R ? R : FOV,
          FOL extends (item: EnumItemClass<T[K], K, V> | undefined) => infer R ? R : FOL
        >
    ): SelectItem<
      V,
      FOV extends (item: EnumItemClass<T[K], K, V> | undefined) => infer R ? R : FOV,
      FOL extends (item: EnumItemClass<T[K], K, V> | undefined) => infer R ? R : FOL
    >[];
  }
}
