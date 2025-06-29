import type {
  BuiltInLocaleKeys,
  EnumInit,
  EnumItemClass,
  EnumKey,
  EnumValue,
  IEnum,
  PluginFunc,
  ValueTypeFromSingleInit,
} from 'enum-plus';
import type { StandardEnumInit } from 'lib/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PluginOptions = Pick<ToSelectConfig<any>, 'labelField' | 'valueField'>;

const toSelectPlugin: PluginFunc<PluginOptions> = (options, Enum) => {
  const { labelField: globalLabelField, valueField: globalValueField } = options ?? {};
  Enum.extends({
    toList<FL extends string = string, FV extends string = string>(
      this: IEnum<StandardEnumInit<string, EnumValue>, string, EnumValue>,
      config: ToSelectConfig<StandardEnumInit<string, EnumValue>, FL, FV, string, EnumValue> &
        FirstOptionConfig<FL, FV, EnumValue> = {}
    ): SelectItem<FL, FV, EnumValue>[] {
      const {
        firstOption = false,
        labelField = globalLabelField ?? 'label',
        valueField = globalValueField ?? 'value',
      } = config;
      const selectItems = this.items.map(
        (item) =>
          ({
            [valueField]: item.value,
            [labelField]: item.label,
          }) as SelectItem<FL, FV, EnumValue>
      );
      if (firstOption) {
        if (firstOption === true) {
          // the first option
          const value = '' as EnumValue;
          const label = Enum.localize
            ? Enum.localize('enum-plus.options.all' as BuiltInLocaleKeys)
            : 'enum-plus.options.all';
          return [{ [valueField]: value, [labelField]: label } as SelectItem<FL, FV, EnumValue>, ...selectItems];
        } else {
          return [
            {
              ...firstOption,
              [labelField]: Enum.localize
                ? Enum.localize(firstOption[labelField as FL])
                : firstOption[labelField as FL],
            },
            ...selectItems,
          ];
        }
      } else {
        return selectItems;
      }
    },
  });
};

/** More options for the options method */
export interface ToSelectConfig<
  T extends EnumInit<K, V>,
  OV extends string | ((item: EnumItemClass<T[K], K, V>) => string) = string,
  OL extends string | ((item: EnumItemClass<T[K], K, V>) => string) = string,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
> {
  /**
   * **EN:** The name of the value field in the output object, or a function to get the field name,
   * default is `value`
   *
   * **CN:** 输出对象的value字段名，或者获取字段名的函数，默认为 `value`
   */
  valueField?: OV;
  /**
   * **EN:** The name of the label field in the output object, or a function to get the field name,
   * default is `label`
   *
   * **CN:** 输出对象的label字段名，或者获取字段名的函数，默认为 `label`
   */
  labelField?: OL;
}

export interface FirstOptionConfig<FL extends string = string, FV extends string = string, V = EnumValue> {
  /**
   * **EN:** Add a default option at the top
   *
   * - `true`: the option uses the default value, `value` is `''`, `label` is `'All'`;
   * - `false`: the default option is not added;
   * - `object`: custom default option, must be an object with `key`, `value`, and `label` properties
   *
   * **CN:** 在头部添加一个默认选项
   *
   * - `true`: 选项使用默认值，`value`为`''`，`label`为`'全部'`
   * - `false`: 不添加默认选项
   * - `object`: 自定义默认选项
   *
   * @default false
   */
  firstOption?: boolean | SelectItem<FL, FV, V>;
}

/** Data structure of ant-design Select options */
export type SelectItem<FL extends string = string, FV extends string = string, V = EnumValue> = Record<FV, V> &
  Record<FL, string>;

export default toSelectPlugin;

declare module 'enum-plus-extend' {
  interface EnumExtension<
    T extends EnumInit<K, V>,
    K extends EnumKey<T> = EnumKey<T>,
    V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
  > {
    toList(this: IEnum<T, K, V> & EnumExtension<T, K, V>): SelectItem<'label', 'value', V>[];
    toList<
      OV extends string | ((item: EnumItemClass<T[K], K, V>) => string) = string,
      OL extends string | ((item: EnumItemClass<T[K], K, V>) => string) = string,
    >(
      this: IEnum<T, K, V> & EnumExtension<T, K, V>,
      config: ToSelectConfig<T, OV, OL, K, V> &
        FirstOptionConfig<
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          OL extends (...args: any) => any ? ReturnType<OL> : OL,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          OV extends (...args: any) => any ? ReturnType<OV> : OV,
          V
        >
    ): SelectItem<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      OL extends (...args: any) => any ? ReturnType<OL> : OL,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      OV extends (...args: any) => any ? ReturnType<OV> : OV,
      V
    >[];
  }
}
