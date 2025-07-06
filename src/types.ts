import type { LocalizeInterface } from './localize-interface';

export * from './localize-interface';
/**
 * **EN:** Enum initialization options
 *
 * **CN:** 枚举初始化选项
 */
export type EnumInitOptions<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
> = {
  /**
   * **EN:** The name of the field in the enumeration item that stores the value, or the function to
   * get the key value, default is `value`
   *
   * **CN:** 枚举项的value字段名，或者获取key值的函数，默认为 `value`
   */
  getValue?: keyof T | ((item: T) => V);
  /**
   * **EN:** The name of the field in the enumeration item that stores the label, or the function to
   * get the key value, default is `label`
   *
   * **CN:** 枚举项的label字段名，或者获取key值的函数，默认为 `label`
   */
  getLabel?: keyof T | ((item: T) => string);
  /**
   * **EN:** The name of the field in the enumeration item that stores the key, or the function to
   * get the key value, default is `key`
   *
   * **CN:** 枚举项的key字段名，或者获取key值的函数，默认为 `key`
   */
  getKey?: keyof T | ((item: T) => string);
} & EnumItemOptions;

export interface EnumItemOptions {
  /**
   * **EN:** Localization function, used to convert the text of the enumeration item to localized
   * text
   *
   * **CN:** 本地化函数，用于把枚举项文本转换为本地化文本
   *
   * @param content Original text | 原始文本
   *
   * @returns Localized text, can return any type | 本地化文本，可以返回任意类型
   */
  localize?: LocalizeInterface;
  /**
   * **EN:** Set the display name of the enum collection, supports string or localized resource key
   *
   * **CN:** 设置枚举集合的显示名称，支持字符串或本地化资源的键名
   */
  name?: string;
}

/**
 * **EN:** Enum item collection interface, excluding members inherited from the array
 *
 * **CN:** 枚举项集合接口，不包含从数组集成的成员
 *
 * @template T Enum collection initialization data type | 枚举集合初始化数据的类型
 *
 * @interface IEnumItems
 */
export interface IEnumItems<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
> {
  /**
   * The enum collection name, supports localization. Note that it usually returns a string, but if
   * a custom `localize` function is set, the return value may vary depending on the implementation
   * of the method.
   *
   * **CN:** 枚举集合显示名称，支持本地化。注意，通常情况下返回的是字符串，但如果设置了自定义的 `localize` 函数，则返回值可能有所不同，取决于方法的实现
   *
   * @returns {string | undefined} The localized name of the enum collection, or undefined if not
   *   set.
   */
  readonly name?: string;
  /**
   * **EN:** Get the label (also known as display name) of the enumeration item, supports getting by
   * value or key
   *
   * **CN:** 获取枚举项的标签（亦称显示名称），支持通过枚举项的 value 或 key 获取
   *
   * @param keyOrValue - The value or key of the enumeration item | 枚举项的 value 或 key
   *
   * @returns The label of the enumeration item or the key if the label is not defined | 枚举项的标签或
   *   key（如果标签未定义）
   */
  label<KV extends V | K | NonNullable<PrimitiveOf<V>> | NonNullable<PrimitiveOf<K>> | undefined>(
    keyOrValue: KV
  ):
    | (undefined extends KV ? undefined : never)
    | (KV extends undefined
        ? undefined
        : NonNullable<KV> extends K
          ? T[NonNullable<KV>] extends { label: unknown }
            ? T[NonNullable<KV>]['label'] extends undefined
              ? NonNullable<KV>
              : string
            : NonNullable<KV>
          : NonNullable<KV> extends V
            ? FindLabelByValue<T, NonNullable<KV>>
            : PrimitiveOf<K> extends KV
              ? string | undefined
              : PrimitiveOf<V> extends KV
                ? string | undefined
                : undefined);

  /**
   * **EN:** Get the key of the enumeration item by its value
   *
   * **CN:** 根据枚举项的 value 获取其 key
   *
   * @param value The value of the enumeration item | 枚举项的 value
   *
   * @returns The key of the enumeration item, or undefined if not found | 枚举项的 key，如果未找到则返回
   *   undefined
   */
  key<IV extends V | NonNullable<PrimitiveOf<V>> | undefined>(
    value: IV
  ):
    | (undefined extends IV ? undefined : never)
    | (IV extends undefined
        ? undefined
        : NonNullable<IV> extends V
          ? FindEnumKeyByValue<T, NonNullable<IV>>
          : PrimitiveOf<V> extends NonNullable<IV>
            ? K | undefined
            : undefined);

  /**
   * **EN:** Get the enumeration item by key or value
   *
   * **CN:** 获取枚举集合的初始化对象
   *
   * @returns {T} Enum collection initialization object | 初始化对象集合
   */
  raw(): T;
  /**
   * **EN:** Get the original initialization object of a certain enumeration item. If custom fields
   * are added to the enumeration item, you can use this method to get them.
   *
   * **CN:** 获取某个枚举项的原始初始化对象。如果在枚举项上增加了自定义字段的话，可以用这种方式获取到。
   *
   * @param keyOrValue Enum key or value | 枚举key或value
   *
   * @returns The original initialization object of the enumeration item, or undefined if not found
   *   | 枚举项的原始初始化对象，如果未找到则返回 undefined
   */
  raw<KV extends V | K | NonNullable<PrimitiveOf<V>> | NonNullable<PrimitiveOf<K>> | undefined>(
    keyOrValue: KV
  ):
    | (undefined extends KV ? undefined : never)
    | (KV extends undefined
        ? undefined
        : NonNullable<KV> extends K
          ? T[NonNullable<KV>]
          : NonNullable<KV> extends V
            ? T[FindEnumKeyByValue<T, NonNullable<KV>>]
            : PrimitiveOf<K> extends KV
              ? T[K] | undefined
              : PrimitiveOf<V> extends KV
                ? T[K] | undefined
                : undefined);
  /**
   * **EN:** Get the value corresponding to a certain enumeration item
   *
   * **CN:** 判断某个枚举项是否存在
   *
   * @param keyOrValue Enum item key or value | 枚举项的key或value
   *
   * @returns {boolean} Whether the enumeration item exists | 枚举项是否存在
   */
  has(keyOrValue?: string | V): boolean;

  /**
   * **EN:** Generate an array of objects that can be bound to those `options like` of components
   * such as Select, Radio, and Checkbox, following the data specification of ant-design
   *
   * **CN:** 生成一个对象数组，可以绑定到 Select、Radio、Checkbox 等组件的`options`，遵循 ant-design 的数据规范
   *
   * @example
   *   [
   *     { value: 0, label: 'Sunday' },
   *     { value: 1, label: 'Monday' },
   *   ];
   *
   * @see https://ant.design/components/checkbox-cn#option
   */
  toSelect(): EnumItemOptionData<K, V>[];
  /**
   * **EN:** Generate an array of objects that can be bound to those `options like` of components
   * such as Select, Radio, and Checkbox, following the data specification of ant-design
   *
   * **CN:** 生成一个对象数组，可以绑定到 Select、Radio、Checkbox 等组件的`options`，遵循 ant-design 的数据规范
   *
   * @example
   *   [
   *     { value: 0, label: 'Sunday' },
   *     { value: 1, label: 'Monday' },
   *   ];
   *
   * @param config Custom options | 自定义选项
   *
   * @see https://ant.design/components/checkbox-cn#option
   */
  toSelect(config: ToSelectConfig & BooleanFirstOptionConfig<V>): EnumItemOptionData<K | '', V | ''>[];
  /**
   * **EN:** Generate an array of objects that can be bound to those `options like` of components
   * such as Select, Radio, and Checkbox, following the data specification of ant-design
   *
   * **CN:** 生成一个对象数组，可以绑定到 Select、Radio、Checkbox 等组件的`options`，遵循 ant-design 的数据规范
   *
   * @example
   *   [
   *     { value: 0, label: 'Sunday' },
   *     { value: 1, label: 'Monday' },
   *   ];
   *
   * @param config Custom options | 自定义选项
   *
   * @see https://ant.design/components/checkbox-cn#option
   */
  toSelect<FK, FV>(
    config: ToSelectConfig & ObjectFirstOptionConfig<FK, FV>
  ): EnumItemOptionData<K | (FK extends never ? FV : FK), V | (FV extends never ? V : FV)>[];

  /** @deprecated Use `toSelect` instead */
  options(): EnumItemOptionData<K, V>[];
  /** @deprecated Use `toSelect` instead */
  options(config: ToSelectConfig & BooleanFirstOptionConfig<V>): EnumItemOptionData<K | '', V | ''>[];
  /** @deprecated Use `toSelect` instead */
  options<FK, FV>(
    config: ToSelectConfig & ObjectFirstOptionConfig<FK, FV>
  ): EnumItemOptionData<K | (FK extends never ? FV : FK), V | (FV extends never ? V : FV)>[];

  /**
   * **EN:** Generate an object array that can be bound to the data source of components such as
   * Menu and Dropdown, following the data specification of ant-design
   *
   * **CN:** 生成一个对象数组，可以绑定到 Menu、Dropdown 等组件的数据源，遵循 ant-design 的数据规范
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

  /** @deprecated Use `toMenu` instead */
  menus(): MenuItemOption<V>[];

  /**
   * **EN:** Generate an object array that can add filtering function to table columns, following
   * the data specification of ant-design Table component
   *
   * **CN:** 生成一个对象数组，可以给表格列增加筛选功能，遵循 ant-design Table 组件的数据规范
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

  /** @deprecated Use `toFilter` instead */
  filters(): ColumnFilterItem<V>[];

  /**
   * **EN:** Generate a Map object that can be used to bind Select, Checkbox and other form
   * components, following the data specification of ant-design-pro
   *
   * **CN:** 生成一个Map对象，可以用来绑定Select、Checkbox等表单组件，遵循 ant-design-pro 的数据规范
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

  /** @deprecated Use `toValueMap` instead */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  valuesEnum(): ValueMap;

  /**
   * **EN:** The data type of all enumeration values
   *
   * 📣 Note: Can only be used as a type declaration, cannot be called at runtime
   *
   * **CN:** 所有枚举值的数据类型
   *
   * 📣 注意：仅可作为类型声明使用，不可在运行时调用
   *
   * @example
   *   // Declare the type of the variable | 声明变量的类型
   *   const week: typeof Week.valueType = Week.Monday; // 0
   *
   *   // Declare type field | 声明类型字段
   *   type Props = {
   *     week: typeof Week.valueType; // 0 | 1
   *   };
   */
  valueType: V;

  /**
   * **EN:** The data type of all enumeration keys
   *
   * 📣 Note: Can only be used as a type declaration, cannot be called at runtime
   *
   * **CN:** 所有枚举key的数据类型
   *
   * 📣 注意：仅可作为类型声明使用，不可在运行时调用
   *
   * @example
   *   // Declare the type of the variable | 声明变量的类型
   *   const weekName: typeof Week.keyType = 'Sunday'; // "Sunday" | "Monday"
   *
   *   // Declare type field | 声明类型字段
   *   type Props = {
   *     weekName: typeof Week.keyType; // "Sunday" | "Monday"
   *   };
   */
  keyType: K;

  /**
   * **EN:** The type of the original initialization object of the enumeration item. If custom
   * fields are added to the enumeration item, you can use this method to get them.
   *
   * **CN:** 枚举项原始初始化对象的类型，如果在枚举项上增加了自定义字段的话，可以用这种方式获取到。
   */
  rawType: T[K];
}

/** @deprecated use `IEnumItems` instead */
export type IEnumValues<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
> = IEnumItems<T, K, V>;

export type EnumItemLabel = EnumLocaleExtends['LocaleKeys'] | NonNullable<string>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EnumInit<K extends keyof any = string, V extends EnumValue = EnumValue> =
  | NumberEnumInit<K>
  | StringEnumInit<K>
  | StringNumberEnumInit<K>
  | BooleanEnumInit<K>
  | DateEnumInit<K>
  | RegExpEnumInit<K>
  | StandardEnumInit<K, V>
  | ValueOnlyEnumInit<K, V>
  | LabelOnlyEnumInit<K>
  | CompactEnumInit<K>
  | OmitEnumInit<K>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NumberEnumInit<K extends keyof any> = Record<K, number>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StringEnumInit<K extends keyof any> = Record<K, string>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StringNumberEnumInit<K extends keyof any> = Record<K, string | number>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BooleanEnumInit<K extends keyof any> = Record<K, boolean>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DateEnumInit<K extends keyof any> = Record<K, Date>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RegExpEnumInit<K extends keyof any> = Record<K, RegExp>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StandardEnumInit<K extends keyof any, V extends EnumValue> = Record<K, StandardEnumItemInit<V>>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ValueOnlyEnumInit<K extends keyof any, V extends EnumValue> = Record<K, ValueOnlyEnumItemInit<V>>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LabelOnlyEnumInit<K extends keyof any> = Record<K, LabelOnlyEnumItemInit>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CompactEnumInit<K extends keyof any> = Record<K, CompactEnumItemInit>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OmitEnumInit<K extends keyof any> = Record<K, undefined>;

export type EnumItemInit<V extends EnumValue = EnumValue> =
  | EnumValue
  | StandardEnumItemInit<V>
  | ValueOnlyEnumItemInit<V>
  | LabelOnlyEnumItemInit
  | CompactEnumItemInit
  | undefined;
export interface StandardEnumItemInit<V extends EnumValue> {
  value: V;
  label: EnumItemLabel;
}
export interface ValueOnlyEnumItemInit<V extends EnumValue> {
  value: V;
}
export interface LabelOnlyEnumItemInit {
  label: EnumItemLabel;
}
export type CompactEnumItemInit = Record<string, never>; // 等价于{}

/** Data structure of ant-design Select options */
export interface EnumItemOptionData<K, V> {
  /** Option value */
  value: V;
  /** Option label */
  label: string;
  /** Option key, default is `value` */
  key: K;
}

/** Data structure of column filter items of ant-design Table */
export interface ColumnFilterItem<V> {
  /** Display name */
  text: string;
  /** Value */
  value: V;
}

/** Data structure of ant-design Menu items */
export interface MenuItemOption<V> {
  /** Key of menu item */
  key: V;
  /** Menu item text */
  label: string;
}

export type ValueMap = Record<string, { text: string }>;

/** Enum value type, support number, string, symbol */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EnumValue = keyof any | bigint | boolean | Date | RegExp;

/** Enum key collection */
export type EnumKey<T> = keyof T;

/** More options for the options method */
export type ToSelectConfig = object;

export interface BooleanFirstOptionConfig<V> {
  /**
   * **EN:** Add a default option at the top
   *
   * - `true`: the option uses the default value, `value` is `''`, `label` is `'All'`;
   * - `false`: the default option is not added;
   *
   * **CN:** 在头部添加一个默认选项
   *
   * - `true`：选项使用默认值，`value`为`''`，`label`为`'全部'`
   * - `false`：不添加默认选项
   *
   * @default false
   */
  firstOption: boolean;
  /**
   * **EN:** Default option value, default is `''`
   *
   * **CN:** 默认选项的值，默认为`''`
   *
   * @default ''
   */
  firstOptionValue?: V;
  /**
   * **EN:** Default option label, default is `'All'`. If a localization method is set, the
   * localization method will be automatically called
   *
   * **CN:** 默认选项的显示文本，默认为`'All'`。如果设置了本地化方法，则会自动调用本地化方法
   */
  firstOptionLabel?: string;
}

export interface ObjectFirstOptionConfig<K, V> {
  /**
   * **EN:** Configuration of the first option
   *
   * **CN:** 首行选项的配置
   */
  firstOption?: EnumOptionConfig<K, V>;
  /**
   * **EN:** Add a default option at the top
   *
   * **CN:** 默认选项的值，默认为`''`
   */
  firstOptionValue?: never;
  /**
   * **EN:** Default option label, default is `'All'`. If a localization method is set, the
   * localization method will be automatically called
   *
   * **CN:** 默认选项的显示文本，默认为`'All'`。如果设置了本地化方法，则会自动调用本地化方法
   */
  firstOptionLabel?: never;
}

/** Built-in resources */
export type BuiltInLocaleKeys = 'enum-plus.options.all';

export type EnumOptionConfig<K, V> = Omit<EnumItemOptionData<K, V>, 'key'> &
  Partial<Pick<EnumItemOptionData<K, V>, 'key'>>;

/** Infer the value type from the initialization object of the enumeration item */
export type ValueTypeFromSingleInit<T, Key = string, Fallback = Key> = T extends EnumValue // literal类型
  ? T
  : T extends StandardEnumItemInit<infer V> // typeof {value, label}
    ? V
    : T extends ValueOnlyEnumItemInit<infer V> // typeof {value}
      ? V
      : T extends LabelOnlyEnumItemInit // typeof {label}
        ? Key
        : T extends CompactEnumItemInit // typeof {}
          ? Key
          : T extends undefined // typeof undefined
            ? Fallback
            : never;

/** Infer the value type from the initialization object of the enumeration collection */
export type ValueTypeFromEnumInit<T, K extends EnumKey<T> = EnumKey<T>> =
  T extends NumberEnumInit<K> // format: { foo:1, bar:2 }
    ? number
    : T extends StringEnumInit<K> // format: { foo:'foo', bar:'bar' }
      ? string
      : T extends BooleanEnumInit<K> // format: { foo:true, bar:false }
        ? string
        : T extends StringNumberEnumInit<K> // format: { foo:'foo', bar:2 }
          ? string | number
          : T extends StandardEnumInit<K, infer V> // format: { foo:{ value:1, label:'foo'}, bar:{value:2, label:'bar'} }
            ? V
            : T extends ValueOnlyEnumInit<K, infer V> // format: { foo:{value:1}, bar:{value:2} }
              ? V
              : T extends LabelOnlyEnumInit<K> // format: { foo:{label:'foo'}, bar:{label:'bar'} }
                ? K
                : T extends CompactEnumInit<K> // format: { foo:{}, bar:{} }
                  ? K
                  : T extends OmitEnumInit<K> // format: {foo: undefined, bar: undefined}
                    ? K
                    : K; // Unknown format, use key as value

/**
 * **EN:** Find the key of the enumeration item by value
 *
 * **CN:** 通过值查找枚举项的key
 *
 * @template T Enum collection initialization data type | 枚举集合初始化数据的类型
 * @template V Enum value type | 枚举值的类型
 */
export type FindEnumKeyByValue<T, V extends EnumValue> = {
  // ValueOnly: { foo:1, bar:2 }
  [K in keyof T]: T[K] extends V
    ? K
    : // @ts-expect-error: because need to force check T[K]['value'], event value field does not exist
      // Standard: { foo:{ value:1 }, bar:{ value:2 } }
      T[K]['value'] extends V
      ? K
      : // LabelOnly: { foo:{ label: 'foo' }, bar:{ label: 'bar' } }
        object extends T[K]
        ? K extends V
          ? K
          : never
        : // KeyOnly: { foo: undefined, bar: undefined }
          undefined extends T[K]
          ? K extends V
            ? K
            : never
          : never;
}[keyof T];

/**
 * **EN:** Find the label of the enumeration item by value
 *
 * **CN:** 通过值查找枚举项的label显示名称
 *
 * @template T Enum collection initialization data type | 枚举集合初始化数据的类型
 * @template V Enum value type | 枚举值的类型
 */
export type FindLabelByValue<T, V extends EnumValue, RAW = T[FindEnumKeyByValue<T, V>]> = RAW extends { label: unknown }
  ? string
  : FindEnumKeyByValue<T, V>;

export type PrimitiveOf<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends bigint
        ? bigint
        : T extends symbol
          ? symbol
          : T extends undefined
            ? undefined
            : T extends null
              ? null
              : never;

/**
 * **EN:** Convert an array of objects to a Map-like object, where the key is the `key` field of the
 * object, and the value is the `value` field of the object
 *
 * **CN:** 将对象数组转换为类似Map的对象，其中key为对象的`key`字段，value为对象的`value`字段
 *
 * @template A Array type | 数组类型
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ArrayToMap<A extends Record<string, any>[] | readonly Record<string, any>[]> = {
  [K in A[number]['key']]: Extract<A[number], { key?: K }>;
};
