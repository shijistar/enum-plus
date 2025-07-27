import type { EnumItemOptions } from './enum-item';
import { EnumItemClass } from './enum-item';
import type {
  ColumnFilterItem,
  EnumInit,
  EnumItemInit,
  EnumKey,
  EnumValue,
  FindEnumKeyByValue,
  FindKeyByMeta,
  FindLabelByValue,
  FindValueByKey,
  FindValueByMeta,
  ListItem,
  MenuItemOption,
  PrimitiveOf,
  StandardEnumInit,
  StandardEnumItemInit,
  ValueMap,
  ValueTypeFromSingleInit,
} from './types';
import { IS_ENUM_ITEMS, KEYS, VALUES } from './utils';

/**
 * Enum items array, mostly are simple wrappers for EnumCollectionClass
 *
 * @template T Type of the initialization data of the enum collection
 *
 * @class EnumItemsArray
 *
 * @extends {EnumItemClass<T, K, V>[]}
 *
 * @implements {IEnumItems<T, K, V>}
 */
export class EnumItemsArray<
    const T extends EnumInit<K, V>,
    K extends EnumKey<T> = EnumKey<T>,
    V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
  >
  extends Array<EnumItemClass<T[K], K, V>>
  implements IEnumItems<T, K, V>
{
  private __raw__!: T;
  /**
   * - **EN:** A boolean value indicates that this is an enum items array.
   * - **CN:** 布尔值，表示这是一个枚举项数组
   */
  // Do not use readonly field here, because don't want print this field in Node.js
  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  get [IS_ENUM_ITEMS](): true {
    return true;
  }
  readonly [KEYS]!: K[];
  readonly [VALUES]!: V[];
  readonly labels!: string[];
  readonly meta!: IEnumItems<T, K, V>['meta'];
  private _runtimeError: (name: string) => string;

  /**
   * Instantiate an enum items array
   *
   * @memberof EnumItemsArray
   *
   * @param {T} raw Original initialization data object
   * @param {...EnumItemClass<T[K], K, V>[]} items Enum item instance array
   */
  constructor(raw: T, options: EnumItemOptions | undefined) {
    super();
    // Do not use class field here, because don't want print this field in Node.js
    Object.defineProperty(this, '__raw__', {
      value: raw,
      enumerable: false,
      writable: false,
      configurable: false,
    });

    // Generate keys array
    // exclude number keys with a "reverse mapping" value, it means those "reverse mapping" keys of number enums
    const keys = parseKeys<T, K, V>(raw);
    const parsed = keys.map((key) => parseEnumItem<EnumItemInit<V>, K, V>(raw[key], key));
    this[KEYS] = keys;
    Object.freeze(keys);

    const items: EnumItemClass<T[K], K, V>[] = [];
    const meta = {} as { [K in Exclude<keyof T[keyof T], 'key' | 'value' | 'label'>]: T[keyof T][K][] };
    this.meta = meta as IEnumItems<T, K, V>['meta'];
    keys.forEach((key, index) => {
      const { value, label } = parsed[index];
      const item = new EnumItemClass<T[K], K, V>(key, value, label, raw[key], options);
      items.push(item);
      this.push(item);

      // Collect custom meta fields
      const itemRaw = raw[key];
      if (itemRaw && typeof itemRaw === 'object' && 'value' in itemRaw) {
        Object.keys(itemRaw).forEach((k) => {
          const metaKey = k as Exclude<keyof T[keyof T], 'key' | 'value' | 'label'>;
          if (metaKey !== 'key' && metaKey !== 'value' && metaKey !== 'label') {
            if (!meta[metaKey]) {
              meta[metaKey] = [];
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const metaValue = (itemRaw as any)[metaKey];
            if (metaValue != null) {
              meta[metaKey].push(metaValue);
            }
          }
        });
      }
    });

    // Generate values array
    const values = parsed.map((item) => item.value);
    this[VALUES] = values;
    Object.freeze(values);

    // Generate labels array
    Object.defineProperty(this, 'labels', {
      get: function (this: EnumItemsArray<T, K, V>) {
        // Cannot save to static array because labels may be localized contents
        // Should not use `items` in the closure because the getter function cannot be fully serialized
        return Array.from(this).map((item) => item.label);
      },
      enumerable: true,
      configurable: false,
    });

    this._runtimeError = undefined!;
    Object.defineProperty(this, '_runtimeError', {
      value: function (this: EnumItemsArray<T, K, V>, name: string) {
        return `The ${name} property of the enumeration is only allowed to be used to declare the ts type, and cannot be accessed at runtime! Please use the typeof operator in the ts type, for example: typeof Week.${name}`;
      },
      writable: false,
      enumerable: false,
      configurable: false,
    });
  }
  [Symbol.hasInstance]<T>(instance: T): instance is Extract<T, K | V> {
    // intentionally use == to support both number and string format value
    return this.some(
      // eslint-disable-next-line eqeqeq
      (i) => (instance as unknown as V) == i.value || (instance as unknown as K) === i.key
    );
  }

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
                : undefined) {
    // Find by value, then try key
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.find((i) => i.value === keyOrValue) ?? this.find((i) => i.key === keyOrValue))?.label as any;
  }

  key<IV extends V | NonNullable<PrimitiveOf<V>> | undefined>(
    value?: IV
  ):
    | (undefined extends IV ? undefined : never)
    | (IV extends undefined
        ? undefined
        : NonNullable<IV> extends V
          ? FindEnumKeyByValue<T, NonNullable<IV>>
          : PrimitiveOf<V> extends NonNullable<IV>
            ? K | undefined
            : undefined) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.find((i) => i.value === value)?.key as any;
  }

  raw(): T;
  raw<IK extends V | K | Exclude<EnumValue, string> | NonNullable<string>>(
    keyOrValue: IK
  ): IK extends K ? T[IK] : IK extends V ? T[FindEnumKeyByValue<T, IK>] : T[K] | undefined;
  raw<IK extends EnumValue>(value?: IK | unknown): T | T[K] | T[FindEnumKeyByValue<T, IK>] | undefined {
    if (value == null) {
      // Return the original initialization object
      return this.__raw__;
    } else {
      if (Object.keys(this.__raw__).some((k) => k === (value as string))) {
        // Find by key
        return this.__raw__[value as K];
      }
      // Find by value
      const itemByValue = this.find((i) => i.value === value);
      if (itemByValue) {
        return itemByValue.raw;
      } else {
        return undefined;
      }
    }
  }

  has(keyOrValue?: string | V): boolean {
    return this.some((i) => i.value === keyOrValue || i.key === keyOrValue);
  }

  findBy<FK extends 'key' | 'value' | 'label' | Exclude<keyof T[keyof T], 'key' | 'value' | 'label'>, FV>(
    field: FK,
    value: FV
  ): FK extends 'key'
    ? FV extends K
      ? // @ts-expect-error: because the type infer is not clever enough, FV here should be one of K
        EnumItemClass<T[FV], FV, FindValueByKey<T, FV>>
      : EnumItemClass<T[K], K, V> | undefined
    : FK extends 'value'
      ? FV extends V
        ? // @ts-expect-error: because the type infer is not clever enough, FV here should be one of V
          EnumItemClass<T[FindEnumKeyByValue<T, FV>], FindEnumKeyByValue<T, FV>, FV>
        : EnumItemClass<T[K], K, V> | undefined
      : FK extends 'label'
        ? EnumItemClass<T[K], K, V> | undefined
        : // @ts-expect-error: because the type infer is not clever enough, FK here should be one of keyof Raw
          FV extends T[keyof T][FK]
          ? // @ts-expect-error: because the type infer is not clever enough, FV here should be one of T[keyof T][FK]
            EnumItemClass<T[FindKeyByMeta<T, FK, FV>], FindKeyByMeta<T, FK, FV>, FindValueByMeta<T, FK, FV>>
          : EnumItemClass<T[K], K, V> | undefined {
    return this.find((item) => {
      if (field === 'key' || field === 'value') {
        return item[field as keyof typeof item] === value;
      } else if (field === 'label') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (item.raw as any)?.label === value || item.label === value;
      } else {
        // For other fields, use the raw object to find
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (item.raw as any)?.[field] === value;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any;
  }

  toList(): ListItem<V, 'value', 'label'>[];
  toList<
    FOV extends string | ((item: EnumItemClass<T[K], K, V>) => string),
    FOL extends string | ((item: EnumItemClass<T[K], K, V>) => string),
  >(
    config: ToListConfig<T, FOV, FOL, K, V>
  ): ListItem<
    V,
    FOV extends (item: EnumItemClass<T[K], K, V>) => infer R ? R : FOV,
    FOL extends (item: EnumItemClass<T[K], K, V>) => infer R ? R : FOL
  >[];
  toList<
    FOV extends string | ((item: EnumItemClass<T[K], K, V>) => string),
    FOL extends string | ((item: EnumItemClass<T[K], K, V>) => string),
  >(
    config?: ToListConfig<T, FOV, FOL, K, V>
  ):
    | ListItem<V, 'value', 'label'>[]
    | ListItem<
        V,
        FOV extends (item: EnumItemClass<T[K], K, V>) => infer R ? R : FOV,
        FOL extends (item: EnumItemClass<T[K], K, V>) => infer R ? R : FOL
      >[] {
    const { valueField = 'value' as FOV, labelField = 'label' as FOL } = config ?? {};
    if (valueField === 'value' && labelField === 'label') {
      return Array.from(this);
    } else {
      return Array.from(this).map((item) => {
        const valueFieldName = typeof valueField === 'function' ? valueField(item) : (valueField as string);
        const labelFieldName = typeof labelField === 'function' ? labelField(item) : (labelField as string);
        const listItem = {
          [valueFieldName]: item.value,
        } as ListItem<
          V,
          FOV extends (item: EnumItemClass<T[K], K, V>) => infer R ? R : FOV,
          FOL extends (item: EnumItemClass<T[K], K, V>) => infer R ? R : FOL
        >;
        // used for e2e serialization
        Object.defineProperty(listItem, '__enumItem__', {
          value: item,
          writable: false,
          enumerable: false,
          configurable: false,
        });
        // should use getter to preserve the localized label, as it may be dynamic content
        Object.defineProperty(listItem, labelFieldName, {
          get: function () {
            return this.__enumItem__.label;
          },
          enumerable: true,
          configurable: true,
        });
        return listItem;
      });
    }
  }

  toValueMap() {
    const itemsMap = {} as ValueMap;
    this.forEach((item) => {
      itemsMap[item.value as keyof typeof itemsMap] = { text: item.label };
    });
    return itemsMap;
  }

  toMenu(): MenuItemOption<V>[] {
    return Array.from(this).map(({ value, label }) => ({ key: value, label }));
  }

  toFilter(): ColumnFilterItem<V>[] {
    return Array.from(this).map(({ value, label }) => ({ text: label, value }));
  }

  /** Stub method, only for typing usages, not for runtime calling */
  get valueType(): V {
    throw new Error(this._runtimeError('valueType'));
  }

  /** Stub method, only for typing usages, not for runtime calling */
  get keyType(): K {
    throw new Error(this._runtimeError('keyType'));
  }

  /** Stub method, only for typing usages, not for runtime calling */
  get rawType(): T[K] {
    throw new Error(this._runtimeError('rawType'));
  }
}

/**
 * - **EN:** Enum item collection interface, excluding members inherited from the array
 * - **CN:** 枚举项集合接口，不包含从数组集成的成员
 *
 * @template T The type of enum initialization | 枚举初始化的类型
 * @template K The type of enum keys | 枚举键的类型
 * @template V The type of enum values | 枚举值的类型
 *
 * @interface IEnumItems
 */
export interface IEnumItems<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
> {
  /**
   * - **EN:** A boolean value indicates that this is an enum items array.
   * - **CN:** 布尔值，表示这是一个枚举项数组
   */
  [IS_ENUM_ITEMS]: true;
  /**
   * - **EN:** A method that determines if a constructor object recognizes an object as one of the
   *   constructor’s instances. Called by the semantics of the `instanceof` operator.
   * - **CN:** 一个方法，用于确定构造函数对象是否将对象识别为构造函数的实例之一。由 `instanceof` 运算符的语义调用。
   */
  [Symbol.hasInstance]<T>(instance: T): instance is Extract<T, K | V>;
  /**
   * - **EN:** The enum collection name, supports localization.
   *
   * > Note that it usually returns a string, but if a custom `localize` function is set, the return
   * > value may vary depending on the implementation of the method.
   *
   * - **CN:** 枚举集合显示名称，支持本地化。
   *
   * > 注意，通常情况下返回的是字符串，但如果设置了自定义的 `localize` 函数，则返回值可能有所不同，取决于方法的实现
   *
   * @returns {string | undefined} The localized name of the enum collection, or undefined if not
   *   set.
   */
  readonly name?: string;
  /**
   * - **EN:** Get all keys of the enumeration items as an array
   *
   * > Only supports read-only methods in `ReadonlyArray<T>`, does not support push, pop, and any
   * > modification methods
   *
   * - **CN:** 获取枚举项的全部keys列表
   *
   * > 仅支持 `ReadonlyArray<T>` 中的只读方法，不支持push、pop等任何修改的方法
   */
  readonly [KEYS]: K[];
  /**
   * - **EN:** Get all values of the enumeration items as an array
   *
   * > Only supports read-only methods in `ReadonlyArray<T>`, does not support push, pop, and any
   * > modification methods
   *
   * - **CN:** 获取枚举项的全部values列表
   *
   * > 仅支持 `ReadonlyArray<T>` 中的只读方法，不支持push、pop等任何修改的方法
   */
  readonly [VALUES]: V[];
  /**
   * - **EN:** Get all labels of the enumeration items as an array
   *
   * > Only supports read-only methods in `ReadonlyArray<T>`, does not support push, pop, and any
   * > modification methods
   *
   * - **CN:** 获取枚举项的全部labels列表
   *
   * > 仅支持 `ReadonlyArray<T>` 中的只读方法，不支持push、pop等任何修改的方法
   */
  readonly labels: string[];

  meta: T extends StandardEnumInit<K, V>
    ? { [K in Exclude<keyof T[keyof T], 'key' | 'value' | 'label'>]: T[keyof T][K][] }
    : // eslint-disable-next-line @typescript-eslint/ban-types
      {};
  /**
   * - **EN:** Get the label (also known as display name) of the enumeration item, supports getting by
   *   value or key
   * - **CN:** 获取枚举项的标签（亦称显示名称），支持通过枚举项的 value 或 key 获取
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
   * - **EN:** Get the key of the enumeration item by its value
   * - **CN:** 根据枚举项的 value 获取其 key
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
   * - **EN:** Get the enumeration item by key or value
   * - **CN:** 获取枚举集合的初始化对象
   *
   * @returns {T} Enum collection initialization object | 初始化对象集合
   */
  raw(): T;
  /**
   * - **EN:** Get the original initialization object of a certain enumeration item. If custom fields
   *   are added to the enumeration item, you can use this method to get them.
   * - **CN:** 获取某个枚举项的原始初始化对象。如果在枚举项上增加了自定义字段的话，可以用这种方式获取到。
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
   * - **EN:** Get the value corresponding to a certain enumeration item
   * - **CN:** 判断某个枚举项是否存在
   *
   * @param keyOrValue Enum item key or value | 枚举项的key或value
   *
   * @returns {boolean} Whether the enumeration item exists | 枚举项是否存在
   */
  has(keyOrValue?: string | V): boolean;

  /**
   * **EN:** Find an enumeration item by key or value, or by custom meta fields
   *
   * **CN:** 通过key或value查找枚举项，或通过自定义元字段查找
   *
   * @param field The field to search by | 要查找的字段
   * @param value The value to search | 要查找的值
   *
   * @returns The found enumeration item or undefined if not found | 找到的枚举项，如果未找到则返回 undefined
   */
  findBy<FK extends 'key' | 'value' | 'label' | Exclude<keyof T[keyof T], 'key' | 'value' | 'label'>, const FV>(
    field: FK,
    value: FV
  ): FK extends 'key'
    ? FV extends K
      ? // @ts-expect-error: because the type infer is not clever enough, FV here should be one of K
        EnumItemClass<T[FV], FV, FindValueByKey<T, FV>>
      : EnumItemClass<T[K], K, V> | undefined
    : FK extends 'value'
      ? FV extends V
        ? // @ts-expect-error: because the type infer is not clever enough, FV here should be one of V
          EnumItemClass<T[FindEnumKeyByValue<T, FV>], FindEnumKeyByValue<T, FV>, FV>
        : EnumItemClass<T[K], K, V> | undefined
      : FK extends 'label'
        ? EnumItemClass<T[K], K, V> | undefined
        : // @ts-expect-error: because the type infer is not clever enough, FK here should be one of keyof Raw
          FV extends T[keyof T][FK]
          ? // @ts-expect-error: because the type infer is not clever enough, FV here should be one of T[keyof T][FK]
            EnumItemClass<T[FindKeyByMeta<T, FK, FV>], FindKeyByMeta<T, FK, FV>, FindValueByMeta<T, FK, FV>>
          : EnumItemClass<T[K], K, V> | undefined;

  /**
   * - **EN:** Generate an object array containing all enumeration items
   * - **CN:** 生成一个对象数组，包含所有的枚举项
   *
   * @example
   *   [
   *     { value: 0, label: 'Sunday' },
   *     { value: 1, label: 'Monday' },
   *   ];
   */
  toList(): ListItem<V, 'value', 'label'>[];
  /**
   * - **EN:** Generate an object array containing all enumeration items, with customizable value and
   *   label field names
   * - **CN:** 生成一个对象数组，包含所有的枚举项，可自定义值和标签字段名
   *
   * @example
   *   Week.toList({
   *     valueField: 'id',
   *     labelField: 'name',
   *   });
   *
   *   [
   *     { id: 0, name: 'Sunday' },
   *     { id: 1, name: 'Monday' },
   *   ];
   *
   * @param config Custom options, supports customizing value and label field names |
   *   自定义选项，支持自定义值和标签字段名
   */
  toList<
    FOV extends string | ((item: EnumItemClass<T[K], K, V>) => string),
    FOL extends string | ((item: EnumItemClass<T[K], K, V>) => string),
  >(
    config: ToListConfig<T, FOV, FOL, K, V>
  ): ListItem<
    V,
    FOV extends (item: EnumItemClass<T[K], K, V>) => infer R ? R : FOV,
    FOL extends (item: EnumItemClass<T[K], K, V>) => infer R ? R : FOL
  >[];

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

  /**
   * - **EN:** Generate a Map object that can be used to bind Select, Checkbox and other form
   *   components, following the data specification of ant-design-pro
   * - **CN:** 生成一个Map对象，可以用来绑定Select、Checkbox等表单组件，遵循 ant-design-pro 的数据规范
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

  /**
   * - **EN:** The data type of all enumeration values
   *
   * > 📣 Note: Can only be used as a type declaration, cannot be called at runtime
   *
   * - **CN:** 所有枚举值的数据类型
   *
   * > 📣 注意：仅可作为类型声明使用，不可在运行时调用
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
   * - **EN:** The data type of all enumeration keys
   *
   * > 📣 Note: Can only be used as a type declaration, cannot be called at runtime
   *
   * - **CN:** 所有枚举key的数据类型
   *
   * > 📣 注意：仅可作为类型声明使用，不可在运行时调用
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
   * - **EN:** The type of the original initialization object of the enumeration item. If custom
   *   fields are added to the enumeration item, you can use this method to get them.
   *
   * > 📣 Note: Can only be used as a type declaration, cannot be called at runtime
   *
   * - **CN:** 枚举项原始初始化对象的类型，如果在枚举项上增加了自定义字段的话，可以用这种方式获取到。
   *
   * > 📣 注意：仅可作为类型声明使用，不可在运行时调用
   */
  rawType: T[K];
}

/** More options for the options method */
export interface ToListConfig<
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

export function parseKeys<
  const T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
>(raw: EnumInit<K, V>) {
  return Object.keys(raw).filter((k) => !(/^-?\d+$/.test(k) && k === `${raw[raw[k as K] as K] ?? ''}`)) as K[];
}

function parseEnumItem<
  T extends EnumItemInit<V>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  K extends EnumKey<any>,
  V extends EnumValue,
>(init: T, key: K): StandardEnumItemInit<V> {
  let value: V;
  let label: string;
  if (init != null) {
    if (typeof init === 'number' || typeof init === 'string' || typeof init === 'symbol') {
      value = init as V;
      label = key as string;
    } else if (typeof init === 'object') {
      // Initialize using object
      if (Object.prototype.toString.call(init) === '[object Object]') {
        if ('value' in init && Object.keys(init).some((k) => k === 'value')) {
          // type of {value, label}
          value = init.value ?? key;
          if ('label' in init && Object.keys(init).some((k) => k === 'label')) {
            label = init.label;
          } else {
            label = key as string;
          }
        } else if ('label' in init && Object.keys(init).some((k) => k === 'label')) {
          // typeof {label}
          value = key as unknown as V;
          label = init.label ?? key;
        } else {
          // {} empty object
          value = key as unknown as V;
          label = key as string;
        }
      } else {
        // Probably Date, RegExp and other primitive types
        value = init as V;
        label = key as string;
      }
    } else {
      throw new Error(`Invalid enum item: ${JSON.stringify(init)}`);
    }
  } else {
    value = key as unknown as V;
    label = key as string;
  }
  return { value, label };
}
