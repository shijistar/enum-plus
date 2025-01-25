import type { KEYS, VALUES } from './index';
import type { EnumItemClass } from './enum-item';

/**
 * EN: Enum initialization options
 *
 * CN: 枚举初始化选项
 */
export type EnumInitOptions<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>
> = {
  /**
   * EN: The name of the field in the enumeration item that stores the value, or the function to get the key value, default is `value`
   *
   * CN: 枚举项的value字段名，或者获取key值的函数，默认为 `value`
   */
  getValue?: keyof T | ((item: T) => V);
  /**
   * EN: The name of the field in the enumeration item that stores the label, or the function to get the key value, default is `label`
   *
   * CN: 枚举项的label字段名，或者获取key值的函数，默认为 `label`
   */
  getLabel?: keyof T | ((item: T) => string);
  /**
   * EN: The name of the field in the enumeration item that stores the key, or the function to get the key value, default is `key`
   *
   * CN: 枚举项的key字段名，或者获取key值的函数，默认为 `key`
   */
  getKey?: keyof T | ((item: T) => K);
} & EnumItemOptions;

export type EnumItemOptions = {
  /**
   * EN: Localization function, used to convert the text of the enumeration item to localized text
   *
   * CN: 本地化函数，用于把枚举项文本转换为本地化文本
   *
   * @param content Original text | 原始文本
   * @returns Localized text | 本地化文本
   */
  localize?: <T extends string>(content: T | undefined) => T | string | undefined;
};
/**
 * EN: Enum collection interface
 *
 * EN: Should directly use `EnumClass`, but TS does not allow custom index accessors in `class`, so you can only use `type`
 *
 * CN: 数组的类型声明
 *
 * CN: 本来可以直接使用`EnumClass`, 但是TS不允许`class`中自定义索引访问器，只能使用`type`
 */
export type IEnum<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>
> = IEnumValues<T, K, V> & {
  // 初始化对象里的枚举字段
  [key in K]: ValueTypeFromSingleInit<T[key], key, T[K] extends number | undefined ? number : key>;
} & (T extends { values: unknown }
    ? {
        // 防止values名称冲突
        [VALUES]: EnumItemClass<T[K], K, V>[] & IEnumValues<T, K, V>;
      }
    : {
        /**
         * EN: All enumeration items in the array, can be used directly as the data source of the AntDesign component
         *
         * EN: Only supports read-only methods in ReadonlyArray<T>, does not support push, pop, and any modification methods
         *
         * CN: 所有枚举项的数组，可以直接作为AntDesign组件的数据源
         *
         * CN: 仅支持 ReadonlyArray<T> 中的只读方法，不支持push、pop等任何修改的方法
         */
        values: EnumItemClass<T[K], K, V>[] & IEnumValues<T, K, V>;
      }) &
  (T extends { keys: any }
    ? {
        // 防止keys名称冲突
        [KEYS]: K[];
      }
    : {
        /**
         * EN: Get the key list of the enumeration item
         *
         * EN: Only supports read-only methods in ReadonlyArray<T>, does not support push, pop, and any modification methods
         *
         * CN: 获取枚举项的key列表
         *
         * CN: 常在typescript作为类型声明使用，例如： `type Props = { week: typeof Week['keys'] }`
         */
        keys: K[];
      });
/**
 * EN: Enum item collection interface, excluding members inherited from the array
 *
 * CN: 枚举项集合接口，不包含从数组集成的成员
 *
 * @export
 * @interface IEnumValues
 * @template T Enum collection initialization data type | 枚举集合初始化数据的类型
 */
export interface IEnumValues<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>
> {
  /**
   * EN: Get the enumeration item by key or value
   *
   * CN: 获取某个枚举项的label显示名称
   *
   * @param value Enum item value or key | 枚举项的value或key
   * @returns {string | undefined} Display name of the enumeration item | 枚举项的label显示名称
   */
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  label(keyOrValue?: string | number): string | undefined;

  /**
   * EN: Get the key corresponding to a certain enumeration item
   *
   * CN: 获取某个枚举项对应的key
   */
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  key(value?: string | number): K | undefined;

  /**
   * EN: Get the value corresponding to a certain enumeration item
   *
   * CN: 判断某个枚举项是否存在
   *
   * @param keyOrValue Enum item key or value | 枚举项的key或value
   */
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  has(keyOrValue?: string | number): boolean;

  /**
   * EN: Generate an array of data sources that meet the AntDesign specification, which can be directly passed to the `options` of components such as Select, Radio, and Checkbox
   *
   * EN: The data format is: `[{ value: 0, label: 'Sunday' }, { value: 1, label: 'Monday' }]`
   *
   * CN: 生成符合AntDesign规范的下拉数据源数组，可以直接传给Select、Radio、Checkbox等组件的`options`
   *
   * CN: 数据格式为：`[{ value: 0, label: 'Sunday' }, { value: 1, label: 'Monday' }]`
   */
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  options(): EnumOption<K, V>[];
  /**
   * EN: Generate an array of data sources that meet the AntDesign specification, which can be directly passed to the `options` of components such as Select, Radio, and Checkbox
   *
   * CN: 生成符合AntDesign规范的下拉数据源数组，可以直接传给Select、Radio、Checkbox等组件的`options`
   *
   * @param config Custom options | 自定义选项
   */
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  options(config: OptionsConfig & BooleanFirstOptionConfig<V>): EnumOption<K | '', V | ''>[];
  /**
   * EN: Generate an array of data sources that meet the AntDesign specification, which can be directly passed to the `options` of components such as Select, Radio, and Checkbox
   *
   * CN: 生成符合AntDesign规范的下拉数据源数组，可以直接传给Select、Radio、Checkbox等组件的`options`
   *
   * @param config Custom options | 自定义选项
   */
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  options<FK, FV>(
    config: OptionsConfig & ObjectFirstOptionConfig<FK, FV>
  ): EnumOption<K | (FK extends never ? FV : FK), V | (FV extends never ? V : FV)>[];

  /**
   * EN: Generate an object that meets the AntDesignPro specification for the enumeration set
   *
   * EN: The data structure is: `{ 0: { text: "Sunday" }, 1: { text: "Monday" } }`
   *
   * CN: 生成一个符合AntDesignPro规范的枚举集合对象。
   *
   * CN: 数据结构为：`{ 0: { text: "Sunday" }, 1: { text: "Monday" } }`
   *
   * @see https://procomponents.ant.design/components/schema#valueenum-1
   * @see https://procomponents.ant.design/components/field-set#proformselect
   */
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  valuesEnum(): Record<V, { text: string }>;

  /**
   * EN: Generate a data source that meets the specification of the column filter function of the AntDesign Table component
   *
   * EN: The data structure is: `[{ text: "Sunday", value: 0 }, { text: "Monday", value: 1 }]`
   *
   * CN: 为AntDesign Table组件的列筛选功能生成符合规范的数据源
   *
   * CN: 数据结构为：`[{ text: "Sunday", value: 0 }, { text: "Monday", value: 1 }]`
   *
   * @see https://ant.design/components/table-cn#components-table-demo-head
   * @see https://ant.design/components/table-cn#column
   */
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  filters(): ColumnFilterItem<V>[];

  /**
   * EN: Generate a data source that meets the specification of the AntDesign Menu, Dropdown and other components
   *
   * EN: The data structure is: `[{ key: 0, label: "Sunday" }, { key: 1, label: "Monday" }]`
   *
   * CN: 为 AntDesign Menu、Dropdown 等组件生成符合规范的数据源
   *
   * CN: 数据结构为：`[{ key: 0, label: "Sunday" }, { key: 1, label: "Monday" }]`
   */
  menus(): MenuItemOption<V>[];

  /**
   * EN: Get the enumeration item by key or value
   *
   * CN: 获取枚举集合的初始化对象
   *
   * @return {T} Enum collection initialization object | 初始化对象集合
   * @memberof IEnumValues
   */
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  raw(): T;
  /**
   * EN: Get the original initialization object of a certain enumeration item. If custom fields are added to the enumeration item, you can use this method to get them.
   *
   * CN: 获取某个枚举项的原始初始化对象。如果在枚举项上增加了自定义字段的话，可以用这种方式获取到。
   *
   * @param keyOrValue Enum key or value | 枚举key或value
   */
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  raw(keyOrValue: V | K): T[K];
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  raw(value: unknown): T[K] | undefined;

  /**
   * EN: The data type of all enumeration values
   *
   * EN: 📣 Note: Can only be used as a type declaration, cannot be called at runtime
   *
   * CN: 所有枚举值的数据类型
   *
   * CN: 📣 注意：仅可作为类型声明使用，不可在运行时调用
   *
   * @example
   *
   * // Declare the type of the variable | 声明变量的类型
   * const week: typeof Week.valueType = Week.Monday; // 0
   *
   * // Declare type field | 声明类型字段
   * type Props = {
   *   week: typeof Week.valueType // 0 | 1
   * };
   */
  valueType: V;

  /**
   * EN: The data type of all enumeration keys
   *
   * EN: 📣 Note: Can only be used as a type declaration, cannot be called at runtime
   *
   * CN: 所有枚举key的数据类型
   *
   * CN: 📣 注意：仅可作为类型声明使用，不可在运行时调用
   *
   * @example
   *
   * // Declare the type of the variable | 声明变量的类型
   * const weekName: typeof Week.keyType = "Sunday"; // "Sunday" | "Monday"
   *
   * // Declare type field | 声明类型字段
   * type Props = {
   *   weekName: typeof Week.keyType // "Sunday" | "Monday"
   * };
   */
  keyType: K;

  /**
   * EN: The type of the original initialization object of the enumeration item. If custom fields are added to the enumeration item, you can use this method to get them.
   *
   * CN: 枚举项原始初始化对象的类型，如果在枚举项上增加了自定义字段的话，可以用这种方式获取到。
   */
  rawType: T[K];
}

export type EnumInit<K extends keyof any = string, V extends EnumValue = EnumValue> =
  | NumberEnumInit<K>
  | StringEnumInit<K>
  | StandardEnumInit<K, V>
  | ValueOnlyEnumInit<K, V>
  | LabelOnlyEnumInit<K>
  | CompactEnumInit<K>
  | AutoIncrementedEnumInit<K>;
export type NumberEnumInit<K extends keyof any> = Record<K, number>;
export type StringEnumInit<K extends keyof any> = Record<K, string>;
export type StandardEnumInit<K extends keyof any, V extends EnumValue> = Record<
  K,
  StandardEnumItemInit<V>
>;
export type ValueOnlyEnumInit<K extends keyof any, V extends EnumValue> = Record<
  K,
  ValueOnlyEnumItemInit<V>
>;
export type LabelOnlyEnumInit<K extends keyof any> = Record<K, LabelOnlyEnumItemInit>;
export type CompactEnumInit<K extends keyof any> = Record<K, CompactEnumItemInit>;
export type AutoIncrementedEnumInit<K extends keyof any> = Record<K, undefined>;
/** @deprecated Use `AutoIncrementedEnumInit` instead */
export type OmitEnumInit<K extends keyof any> = AutoIncrementedEnumInit<K>;

export type EnumItemInit<V extends EnumValue = EnumValue> =
  | EnumValue
  | StandardEnumItemInit<V>
  | ValueOnlyEnumItemInit<V>
  | LabelOnlyEnumItemInit
  | CompactEnumItemInit
  | undefined;
export type StandardEnumItemInit<V extends EnumValue> = {
  value: V;
  label: string;
};
export type ValueOnlyEnumItemInit<V extends EnumValue> = {
  value: V;
};
export type LabelOnlyEnumItemInit = {
  label: string;
};
export type CompactEnumItemInit = Record<string, never>; // 等价于{}

/** 由枚举项生成的作为Select组件数据源的数据结构 */
export type EnumOption<K, V> = {
  /** 选项的值 */
  value: V;
  /**  选项的显示文本 */
  label: string;
  /** 选项的key，默认使用`value` */
  key: K;
};

/** Table列筛选项的数据结构 */
export type ColumnFilterItem<V> = {
  /** 显示文本 */
  text: string;
  /** 值 */
  value: V;
};

/** 用于生成菜单的数据结构 */
export type MenuItemOption<V> = {
  /** 枚举值 */
  key: V;
  /** 显示文本 */
  label: string;
};

/** 枚举值的类型，支持number、string、symbol */
export type EnumValue = keyof any;

/** 获取枚举初始化对象中key的类型 */
export type EnumKey<T> = keyof T;

/** options方法的更多选项 */
export type OptionsConfig = object;

export type BooleanFirstOptionConfig<V> = {
  /**
   * 在头部添加一个默认选项。
   *
   * 如果为`true`，则选项使用默认值，`value`为`''`，`label`为`'全部'`；
   * 如果为`false`，则不添加默认选项；
   *
   * @default false
   */
  firstOption: boolean;
  /** 默认选项的值，默认为`''` */
  firstOptionValue?: V;
  /** 默认选项的显示文本，默认为`'All'`。如果设置了本地化方法，则会自动调用本地化方法 */
  firstOptionLabel?: string;
};

export type ObjectFirstOptionConfig<K, V> = {
  /** 首行选项的配置 */
  firstOption?: EnumOptionConfig<K, V>;
  /** 默认选项的值，默认为`''` */
  firstOptionValue?: never;
  /** 默认选项的显示文本，默认为`'All'`。如果设置了本地化方法，则会自动调用本地化方法 */
  firstOptionLabel?: never;
};

export type EnumOptionConfig<K, V> = Omit<EnumOption<K, V>, 'key'> &
  Partial<Pick<EnumOption<K, V>, 'key'>>;

/** 从枚举集合或枚举项的初始化对象推断value类型 */
// export type ValueType<T> = ValueTypeFromSingleInit<T> extends never
//   ? ValueTypeFromEnumInit<T>
//   : ValueTypeFromSingleInit<T>;

/** 从枚举项的初始化对象推断value类型 */
export type ValueTypeFromSingleInit<T, Key = string, Fallback = Key> = T extends EnumValue // literal类型
  ? T
  : T extends StandardEnumItemInit<infer V> // {value, label}类型
  ? V
  : T extends ValueOnlyEnumItemInit<infer V> // {value}类型
  ? V
  : T extends LabelOnlyEnumItemInit // {label}类型
  ? Key
  : T extends CompactEnumItemInit // {}类型
  ? Key
  : T extends undefined // undefined类型
  ? Fallback // todo: 最好实现enum的行为，无初始化值时使用自增值，但暂时没有完美的办法，只能临时使用number
  : never;

/** 从枚举集合初始化对象推断value类型 */
export type ValueTypeFromEnumInit<
  T,
  K extends EnumKey<T> = EnumKey<T>
> = T extends NumberEnumInit<K> // 格式：{ foo:1, bar:2 }
  ? number
  : T extends StringEnumInit<K> // 格式：{ foo:'foo', bar:'bar' }
  ? string
  : T extends StandardEnumInit<K, infer V> // 格式：{ foo:{value:1, label:'foo'}, bar:{value:2, label:'bar'} }
  ? V
  : T extends ValueOnlyEnumInit<K, infer V> // 格式：{ foo:{value:1}, bar:{value:2} }
  ? V
  : T extends LabelOnlyEnumInit<K> // 格式：{ foo:{label:'foo'}, bar:{label:'bar'} }
  ? K
  : T extends CompactEnumInit<K> // 格式：{ foo:{}, bar:{} }
  ? K
  : T extends AutoIncrementedEnumInit<K> // 格式：{foo: undefined, bar: undefined}
  ? K
  : K; // 未知格式
// eslint-disable-next-line @typescript-eslint/ban-types
