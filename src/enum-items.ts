import { getAutoLocalizeTemplateFields, isAutoLocalizeMetaField } from './auto-localize';
import { EnumItemClass, type EnumItemInterface, type EnumItemOptions } from './enum-item';
import type {
  EnumInit,
  EnumItemInit,
  EnumItemLabel,
  EnumKey,
  EnumValue,
  ExactEqual,
  FindEnumKeyByValue,
  FindKeyByMeta,
  FindLabelByValue,
  FindValueByKey,
  FindValueByMeta,
  ListItem,
  PrimitiveOf,
  StandardEnumItemInit,
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
 * @extends {EnumItemInterface<T, K, V>[]}
 *
 * @implements {IEnumItems<T, K, V>}
 */
export class EnumItemsArray<
  const T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LP = any,
>
  extends Array<EnumItemInterface<T[K], K, V, LP>>
  implements IEnumItems<T, K, V, LP>
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
  readonly named!: {
    [key in keyof T]: EnumItemInterface<
      // @ts-expect-error: because the first type parameter T is a union type, T[key] cannot satisfy each one of T.
      T[key],
      key,
      ValueTypeFromSingleInit<T[key], key, T[key] extends number | undefined ? number : key>,
      LP
    >;
  };
  readonly meta!: IEnumItems<T, K, V, LP>['meta'];
  private _runtimeError: (name: string) => string;

  /**
   * Instantiate an enum items array
   *
   * @memberof EnumItemsArray
   *
   * @param {T} raw Original initialization data object
   * @param {EnumItemOptions<T[K], K, V, LP> | undefined} options Enum item options
   */
  constructor(raw: T, options: EnumItemOptions<T[K], K, V, LP> | undefined) {
    super();

    const define = Object.defineProperty;
    const freeze = Object.freeze;
    // Generate keys array
    // exclude number keys with a "reverse mapping" value, it means those "reverse mapping" keys of number enums
    const keys = parseKeys<T, K, V>(raw);
    const parsed = keys.map((key) => parseEnumItem<EnumItemInit<V>, K, V>(raw[key], key));
    // this[KEYS] = keys;
    define(this, KEYS, { value: keys });
    freeze(keys);

    const items: EnumItemInterface<T[K], K, V, LP>[] = [];
    const named = {} as Record<K, EnumItemInterface<T[K], K, V, LP>>;
    this.named = named as unknown as typeof this.named;
    const meta = {} as { [K in Exclude<keyof T[keyof T], 'value' | 'label'>]: T[keyof T][K][] };
    this.meta = meta as IEnumItems<T, K, V, LP>['meta'];
    keys.forEach((key, index) => {
      const { value, label } = parsed[index];
      const item: EnumItemInterface<T[K], K, V, LP> = new EnumItemClass<T[K], K, V, LP>(
        key,
        value,
        label,
        raw[key],
        options,
      ) as EnumItemInterface<T[K], K, V, LP>;
      items.push(item);
      this.push(item);
      named[key] = item;

      // Collect custom meta fields, including fields declared by autoLocalize.itemTemplate.
      const itemRaw = raw[key];
      const rawMetaKeys =
        itemRaw && typeof itemRaw === 'object' && Object.prototype.toString.call(itemRaw) === '[object Object]'
          ? Object.keys(itemRaw).filter((k) => !['value', 'label'].includes(k))
          : [];
      const templateMetaKeys = getAutoLocalizeTemplateFields(options).filter((k) => k !== 'label');
      Array.from(new Set([...rawMetaKeys, ...templateMetaKeys])).forEach((k) => {
        const metaKey = k as Exclude<keyof T[keyof T], 'value' | 'label'>;
        if (meta[metaKey] == null) {
          meta[metaKey] = [];
        }
        const metaValue = item[k as never];
        if (metaValue != null) {
          meta[metaKey].push(metaValue);
        }
      });
    });

    const autoLocalizeMeta = options?.autoLocalizeMeta;
    // Freeze meta arrays
    Object.keys(meta).forEach((k) => {
      const autoLocalize = isAutoLocalizeMetaField(k, options);
      if (autoLocalize) {
        const descriptor = {
          get: function get(): unknown[] {
            return (
              // @ts-expect-error: because we attach items array to the getter function
              Array.from(this._items)
                // @ts-expect-error: because we attach items array to the getter function
                .map((item: EnumItemInterface<T[K], K, V, LP>) => item[get._key as never])
                .filter((v: unknown) => v != null)
            );
          },
          enumerable: true,
          configurable: false,
        };
        // @ts-expect-error: because we attach items array to the getter function
        descriptor.get._key = k;
        define(meta, k, descriptor);
      } else {
        freeze(meta[k as keyof typeof meta]);
      }
    });
    if (autoLocalizeMeta || getAutoLocalizeTemplateFields(options).some((k) => k !== 'label')) {
      define(meta, '_items', { value: this });
    }

    // Generate values array
    const values = parsed.map((item) => item.value);
    // Do not use class field here, because don't want print this field in Node.js
    define(this, VALUES, { value: values });
    Object.freeze(values);

    // Generate labels array
    define(this, 'labels', {
      get: function (this: EnumItemsArray<T, K, V, LP>) {
        // Cannot save to static array because labels may be localized contents
        // Should not use `items` in the closure because the getter function cannot be fully serialized
        return Array.from(this).map((item) => item.label);
      },
      enumerable: true,
    });

    // Do not use class field here, because don't want print this field in Node.js
    define(this, '__raw__', { value: raw });
    this._runtimeError = undefined!;
    define(this, '_runtimeError', {
      value: function (this: EnumItemsArray<T, K, V, LP>, name: string) {
        return `The ${name} property of the enumeration is only allowed to be used to declare the ts type, and cannot be accessed at runtime! Please use the typeof operator in the ts type, for example: typeof Week.${name}`;
      },
      enumerable: false,
    });

    freeze(EnumItemsArray.prototype);
    // Do not freeze in constructor. See the enum-collection.
    // freeze(this);
  }

  [Symbol.hasInstance]<T>(instance: T): instance is Extract<T, K | V> {
    // intentionally use == to support both number and string format value
    return this.some(
      // eslint-disable-next-line eqeqeq
      (i) => (instance as unknown as V) == i.value || (instance as unknown as K) === i.key,
    );
  }

  label<KV extends V | K | NonNullable<PrimitiveOf<V>> | NonNullable<PrimitiveOf<K>> | undefined>(
    keyOrValue: KV,
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

  item<KV extends V | K | NonNullable<PrimitiveOf<V>> | NonNullable<PrimitiveOf<K>> | undefined>(
    keyOrValue: KV,
  ):
    | (undefined extends KV ? undefined : never)
    | (KV extends undefined
        ? undefined
        : NonNullable<KV> extends K
          ? // @ts-expect-error: because the type infer is not clever enough, KV here should be one of K
            EnumItemInterface<T[NonNullable<KV>], NonNullable<KV>, FindValueByKey<T, NonNullable<KV>>>
          : NonNullable<KV> extends V
            ? EnumItemInterface<
                // @ts-expect-error: because the type infer is not clever enough, KV here should be one of V
                T[FindEnumKeyByValue<T, NonNullable<KV>>],
                FindEnumKeyByValue<T, NonNullable<KV>>,
                NonNullable<KV>
              >
            : PrimitiveOf<K> extends KV
              ? EnumItemInterface<T[K], K, V> | undefined
              : PrimitiveOf<V> extends KV
                ? EnumItemInterface<T[K], K, V> | undefined
                : undefined) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (this.find((i) => i.value === keyOrValue) ?? this.find((i) => i.key === keyOrValue)) as any;
  }

  key<IV extends V | NonNullable<PrimitiveOf<V>> | undefined>(
    value?: IV,
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
    keyOrValue: IK,
  ): IK extends K ? T[IK] : IK extends V ? T[FindEnumKeyByValue<T, IK>] : T[K] | undefined;
  raw<IK extends EnumValue>(keyOrValue?: IK | unknown): T | T[K] | T[FindEnumKeyByValue<T, IK>] | undefined {
    if (keyOrValue == null) {
      // Return the original initialization object
      return this.__raw__;
    } else {
      // Find by key
      if (Object.keys(this.__raw__).some((k) => k === keyOrValue)) {
        return this.__raw__[keyOrValue as K];
      }
      // Find by value
      const itemByValue = this.find((i) => i.value === keyOrValue);
      if (itemByValue) {
        return itemByValue.raw;
      }
      return undefined;
    }
  }

  has<KV>(keyOrValue?: KV): keyOrValue is Extract<KV, K | V> extends never ? typeof keyOrValue : Extract<KV, K | V> {
    return this.some((i) => i.value === (keyOrValue as unknown as V) || i.key === (keyOrValue as unknown as K));
  }

  findBy<FK extends 'key' | 'value' | 'label' | Exclude<keyof T[keyof T], 'key' | 'value' | 'label'>, FV>(
    field: FK,
    value: FV,
  ): FK extends 'key'
    ? FV extends K
      ? // @ts-expect-error: because the type infer is not clever enough, FV here should be one of K
        EnumItemInterface<T[FV], FV, FindValueByKey<T, FV>>
      : EnumItemInterface<T[K], K, V, LP> | undefined
    : FK extends 'value'
      ? FV extends V
        ? // @ts-expect-error: because the type infer is not clever enough, FV here should be one of V
          EnumItemInterface<T[FindEnumKeyByValue<T, FV>], FindEnumKeyByValue<T, FV>, FV>
        : EnumItemInterface<T[K], K, V, LP> | undefined
      : FK extends 'label'
        ? EnumItemInterface<T[K], K, V, LP> | undefined
        : // @ts-expect-error: because the type infer is not clever enough, FK here should be one of keyof Raw
          FV extends T[keyof T][FK]
          ? // @ts-expect-error: because the type infer is not clever enough, FV here should be one of T[keyof T][FK]
            EnumItemInterface<T[FindKeyByMeta<T, FK, FV>], FindKeyByMeta<T, FK, FV>, FindValueByMeta<T, FK, FV>>
          : EnumItemInterface<T[K], K, V, LP> | undefined {
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
    FOV extends string | ((item: EnumItemInterface<T[K], K, V, LP>) => string),
    FOL extends string | ((item: EnumItemInterface<T[K], K, V, LP>) => string),
    R extends Record<string, unknown> = never,
  >(
    config: ToListConfig<T, FOV, FOL, K, V, R, LP>,
  ): ListItem<
    V,
    FOV extends (item: EnumItemInterface<T[K], K, V, LP>) => infer R ? R : FOV,
    FOL extends (item: EnumItemInterface<T[K], K, V, LP>) => infer R ? R : FOL,
    R
  >[];
  toList<
    FOV extends string | ((item: EnumItemInterface<T[K], K, V, LP>) => string),
    FOL extends string | ((item: EnumItemInterface<T[K], K, V, LP>) => string),
    R extends Record<string, unknown> = never,
  >(
    config?: ToListConfig<T, FOV, FOL, K, V, R, LP>,
  ):
    | ListItem<V, 'value', 'label'>[]
    | ListItem<
        V,
        FOV extends (item: EnumItemInterface<T[K], K, V, LP>) => infer R ? R : FOV,
        FOL extends (item: EnumItemInterface<T[K], K, V, LP>) => infer R ? R : FOL,
        R
      >[] {
    const { valueField = 'value' as FOV, labelField = 'label' as FOL, extra } = config ?? {};
    return Array.from(this).map((item) => {
      const valueFieldName = typeof valueField === 'function' ? valueField(item) : (valueField as string);
      const labelFieldName = typeof labelField === 'function' ? labelField(item) : (labelField as string);
      const extraData = extra ? (extra(item) as R) : ({} as R);
      const listItem = {
        [valueFieldName]: item.value,
        [labelFieldName]: item.label,
        ...extraData,
      } as ListItem<
        V,
        FOV extends (item: EnumItemInterface<T[K], K, V, LP>) => infer R ? R : FOV,
        FOL extends (item: EnumItemInterface<T[K], K, V, LP>) => infer R ? R : FOL,
        R
      >;
      return listItem;
    });
  }

  toMap(): MapResult<T, 'value', 'label', K, V, LP>;
  toMap<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    KS extends EnumItemFields | ((item: EnumItemInterface<T[K], K, V, LP>) => any),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    VS extends EnumItemFields | ((item: EnumItemInterface<T[K], K, V, LP>) => any),
  >(config: ToMapConfig<T, KS, VS, K, V, LP>): MapResult<T, KS, VS, K, V, LP>;
  toMap<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    KS extends EnumItemFields | ((item: EnumItemInterface<T[K], K, V, LP>) => any),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    VS extends EnumItemFields | ((item: EnumItemInterface<T[K], K, V, LP>) => any),
  >(config?: ToMapConfig<T, KS, VS, K, V, LP>): MapResult<T, KS, VS, K, V, LP> {
    if (!config) {
      return this.reduce(
        (prev, cur) => {
          prev[cur.value] = cur.label;
          return prev;
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {} as any,
      ) as unknown as MapResult<T, KS, VS, K, V, LP>;
    }
    const { keySelector = 'value', valueSelector = 'label' } = config;
    return this.reduce(
      (prev, cur) => {
        let key: string | symbol;
        if (typeof keySelector === 'function') {
          key = keySelector(cur);
        } else {
          key = cur[keySelector as keyof EnumItemInterface<T[K], K, V, LP>] as string | symbol;
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let value: any;
        if (typeof valueSelector === 'function') {
          value = valueSelector(cur);
        } else {
          value = cur[valueSelector as keyof EnumItemInterface<T[K], K, V, LP>] as unknown;
        }
        prev[key as keyof MapResult<T, KS, VS, K, V, LP>] = value;
        return prev;
      },
      {} as MapResult<T, KS, VS, K, V, LP>,
    ) as unknown as MapResult<T, KS, VS, K, V, LP>;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  LP = any,
> extends InheritableEnumItems<T, K, V, LP> {
  /**
   * - **EN:** A boolean value indicates that this is an enum items array.
   * - **CN:** 布尔值，表示这是一个枚举项数组
   */
  [IS_ENUM_ITEMS]: true;
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

  /**
   * - **EN:** A mapping of enum keys to their corresponding enum item classes. This is useful for
   *   quick access to specific enum items.
   * - **CN:** 枚举键到其对应的枚举项类的映射，对于快速访问枚举项非常有用
   */
  named: {
    [key in keyof T]: EnumItemInterface<
      // @ts-expect-error: because the first type parameter T is a union type, T[key] cannot satisfy each one of T.
      T[key],
      key,
      ValueTypeFromSingleInit<T[key], key, T[key] extends number | undefined ? number : key>,
      LP
    >;
  };

  /**
   * - **EN:** Get all custom meta fields of the enumeration items as an object, where the keys are
   *   the field names, and values are the raw values of each field
   * - **CN:** 获取枚举项的全部自定义元字段，返回一个对象，其中key为字段名，value为每个字段的原始值数组
   */
  readonly meta: T extends object
    ? { [K in Exclude<keyof T[keyof T], 'key' | 'value' | 'label'>]: T[keyof T][K][] }
    : // eslint-disable-next-line @typescript-eslint/ban-types
      {};
}

// typeof IS_ENUM_ITEMS | typeof ITEMS | typeof KEYS | typeof VALUES | 'labels' | 'meta' | 'named'
export interface InheritableEnumItems<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  LP = any,
> {
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
   *   set | 枚举集合的本地化名称，如果未设置则为 undefined
   */
  readonly name?: string;
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
    keyOrValue: KV,
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
    value: IV,
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
   * - **EN:** Get the label (also known as display name) of the enumeration item, supports getting by
   *   value or key
   * - **CN:** 获取枚举项的标签（亦称显示名称），支持通过枚举项的 value 或 key 获取
   *
   * @param keyOrValue - The value or key of the enumeration item | 枚举项的 value 或 key
   *
   * @returns The label of the enumeration item or the key if the label is not defined | 枚举项的标签或
   *   key（如果标签未定义）
   */
  item<KV extends V | K | NonNullable<PrimitiveOf<V>> | NonNullable<PrimitiveOf<K>> | undefined>(
    keyOrValue: KV,
  ):
    | (undefined extends KV ? undefined : never)
    | (KV extends undefined
        ? undefined
        : NonNullable<KV> extends K
          ? // @ts-expect-error: because the type infer is not clever enough, KV here should be one of K
            EnumItemInterface<T[NonNullable<KV>], NonNullable<KV>, FindValueByKey<T, NonNullable<KV>>>
          : NonNullable<KV> extends V
            ? EnumItemInterface<
                // @ts-expect-error: because the type infer is not clever enough, KV here should be one of V
                T[FindEnumKeyByValue<T, NonNullable<KV>>],
                FindEnumKeyByValue<T, NonNullable<KV>>,
                NonNullable<KV>
              >
            : PrimitiveOf<K> extends KV
              ? EnumItemInterface<T[K], K, V> | undefined
              : PrimitiveOf<V> extends KV
                ? EnumItemInterface<T[K], K, V> | undefined
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
    keyOrValue: KV,
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
  has<KV>(keyOrValue?: KV): keyOrValue is Extract<KV, K | V> extends never ? typeof keyOrValue : Extract<KV, K | V>;

  /**
   * **EN:** Find an enumeration item by key or value, or by custom meta fields
   *
   * **CN:** 通过key或value查找枚举项，或通过自定义元字段查找
   *
   * @param field The field to search by | 要查找的字段
   * @param value The value to search | 要查找的值
   *
   * @returns The found enumeration item or `undefined` if not found | 找到的枚举项，如果未找到则返回 `undefined`
   */
  findBy<FK extends 'key' | 'value' | 'label' | Exclude<keyof T[keyof T], 'key' | 'value' | 'label'>, const FV>(
    field: FK,
    value: FV,
  ): FK extends 'key'
    ? FV extends K
      ? // @ts-expect-error: because the type infer is not clever enough, FV here should be one of K
        EnumItemInterface<T[FV], FV, FindValueByKey<T, FV>>
      : EnumItemInterface<T[K], K, V, LP> | undefined
    : FK extends 'value'
      ? FV extends V
        ? // @ts-expect-error: because the type infer is not clever enough, FV here should be one of V
          EnumItemInterface<T[FindEnumKeyByValue<T, FV>], FindEnumKeyByValue<T, FV>, FV>
        : EnumItemInterface<T[K], K, V, LP> | undefined
      : FK extends 'label'
        ? EnumItemInterface<T[K], K, V, LP> | undefined
        : // @ts-expect-error: because the type infer is not clever enough, FK here should be one of keyof Raw
          FV extends T[keyof T][FK]
          ? // @ts-expect-error: because the type infer is not clever enough, FV here should be one of T[keyof T][FK]
            EnumItemInterface<T[FindKeyByMeta<T, FK, FV>], FindKeyByMeta<T, FK, FV>, FindValueByMeta<T, FK, FV>, LP>
          : EnumItemInterface<T[K], K, V, LP> | undefined;

  /**
   * - **EN:** Generate an object array containing all enumeration items
   * - **CN:** 生成一个对象数组，包含所有的枚举项
   *
   * @example
   *   [
   *     { value: 0, label: 'Sunday' },
   *     { value: 1, label: 'Monday' },
   *   ];
   *
   * @returns An object array of all enumeration items | 所有枚举项的对象数组
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
   *   // [
   *   //   { id: 0, name: 'Sunday' },
   *   //   { id: 1, name: 'Monday' },
   *   // ];
   *
   * @param config Custom options, supports customizing value and label field names |
   *   自定义选项，支持自定义值和标签字段名
   *
   * @returns An object array of all enumeration items in the specified value and label fields |
   *   所有枚举项的对象数组，按照指定的值和标签字段格式
   */
  toList<
    FOV extends string | ((item: EnumItemInterface<T[K], K, V, LP>) => string),
    FOL extends string | ((item: EnumItemInterface<T[K], K, V, LP>) => string),
    R extends Record<string, unknown> = never,
  >(
    config: ToListConfig<T, FOV, FOL, K, V, R, LP>,
  ): ListItem<
    V,
    FOV extends (item: EnumItemInterface<T[K], K, V, LP>) => infer R ? R : FOV,
    FOL extends (item: EnumItemInterface<T[K], K, V, LP>) => infer R ? R : FOL,
    R
  >[];

  /**
   * - **EN:** Generate a mapping object of all enum items, where the keys are the values of the enum
   *   and the values are the labels of the enum
   * - **CN:** 生成一个映射对象，包含所有的枚举项，key为枚举值，value为枚举标签
   *
   * @example
   *   { "0": "Sunday", "1": "Monday" }
   *
   * @returns A mapping object of all enum items | 所有枚举项的映射对象
   */
  toMap(): MapResult<T, 'value', 'label', K, V, LP>;
  /**
   * - **EN:** Generate a mapping object of all enum items, with customizable key and value fields
   * - **CN:** 生成一个映射对象，包含所有的枚举项，可自定义键和值字段
   *
   * @example
   *   Week.toMap({ key: 'value', value: 'label' });
   *
   *   // ({ '0': 'Sunday', '1': 'Monday' });
   *
   *   // Allow custom function, and meta fields can be used
   *   Week.toMap({
   *     key: 'key',
   *     value: (item) => ({ id: item.value, name: item.label, foo: item.raw.foo }),
   *   });
   *
   *   // ({
   *   //   Sunday: { id: 0, name: 'Sunday', foo: 'bar' },
   *   //   Monday: { id: 1, name: 'Monday', foo: 'b' },
   *   // });
   *
   * @param config Custom options, supports customizing key and value fields | 自定义选项，支持自定义键和值字段
   *
   * @returns A mapping object of all enum items in the specified key and value fields |
   *   所有枚举项的映射对象，按照指定的键和值字段格式
   */
  toMap<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FOK extends EnumItemFields | ((item: EnumItemInterface<T[K], K, V, LP>) => any),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    FOV extends EnumItemFields | ((item: EnumItemInterface<T[K], K, V, LP>) => any),
  >(
    config: ToMapConfig<T, FOK, FOV, K, V, LP>,
  ): MapResult<T, FOK, FOV, K, V, LP>;

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
  FOV extends string | ((item: EnumItemInterface<T[K], K, V, LP>) => string),
  FOL extends string | ((item: EnumItemInterface<T[K], K, V, LP>) => string),
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
  R extends Record<string, unknown> = never,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  LP = any,
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
  /**
   * - **EN:** A function to add extra fields to each item in the output object
   * - **CN:** 一个函数，用于为输出对象中的每个项添加额外的字段
   */
  extra?: (item: EnumItemInterface<T[K], K, V, LP>) => R;
}

export interface ToMapConfig<
  T extends EnumInit<K, V>,
  KS extends
    | EnumItemFields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    | ((item: EnumItemInterface<T[K], K, V, LP>) => any),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  VS extends EnumItemFields | ((item: EnumItemInterface<T[K], K, V, LP>) => any),
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  LP = any,
> {
  /**
   * - **EN:** A field of `EnumItem` as the key of the output object, or a function to get the key of
   *   items, default is `key`
   * - **CN:** 作为输出对象key的`EnumItem`字段名，或者获取输出对象key的函数，默认为 `key`
   */
  keySelector?: KS;
  /**
   * - **EN:** A field of `EnumItem` as the value of the output object, or a function to get the value
   *   of items, default is `value`
   * - **CN:** 作为输出对象value的`EnumItem`字段名，或者获取输出对象value的函数，默认为 `value`
   */
  valueSelector?: VS;
}

export type MapResult<
  T extends EnumInit<K, V>,
  KS extends EnumItemFields | ((item: EnumItemInterface<T[K], K, V, LP>) => string | symbol),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  VS extends EnumItemFields | ((item: EnumItemInterface<T[K], K, V, LP>) => any),
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  LP = any,
> = {
  [key in ExactEqual<KS, EnumItemFields | ((item: EnumItemInterface<T[K], K, V, LP>) => string | symbol)> extends true
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      EnumItemInterface<T[K], K, V, LP>['value'] & keyof any
    : KS extends EnumItemFields
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        EnumItemInterface<T[K], K, V, LP>[KS] & keyof any
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        KS extends (item: any) => infer R
        ? R
        : never]: ExactEqual<VS, EnumItemFields | ((item: EnumItemInterface<T[K], K, V, LP>) => unknown)> extends true
    ? ExactEqual<KS, EnumItemFields | ((item: EnumItemInterface<T[K], K, V, LP>) => string | symbol)> extends true
      ? FindLabelByValue<T, key>
      : EnumItemInterface<T[K], K, V, LP>['label']
    : VS extends EnumItemFields
      ? EnumItemInterface<T[K], K, V, LP>[VS]
      : // eslint-disable-next-line @typescript-eslint/no-explicit-any
        VS extends (item?: any) => infer R
        ? R
        : never;
};

export type EnumItemFields = Exclude<
  {
    [key in keyof EnumItemInterface<StandardEnumItemInit<string>>]: EnumItemInterface<
      StandardEnumItemInit<string>
    >[key] extends (...args: any[]) => unknown
      ? never
      : key;
  }[keyof EnumItemInterface<StandardEnumItemInit<string>>] &
    string,
  'raw'
>;

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
  let label: EnumItemLabel;
  if (init != null) {
    if (typeof init === 'number' || typeof init === 'string' || typeof init === 'symbol') {
      value = init as V;
      label = key as EnumItemLabel;
    } else if (typeof init === 'object') {
      // Initialize using object
      if (Object.prototype.toString.call(init) === '[object Object]') {
        if ('value' in init && Object.keys(init).some((k) => k === 'value')) {
          // type of {value, label}
          value = (init.value ?? key) as V;
          if ('label' in init && Object.keys(init).some((k) => k === 'label')) {
            label = init.label!;
          } else {
            label = key as EnumItemLabel;
          }
        } else if ('label' in init && Object.keys(init).some((k) => k === 'label')) {
          // typeof {label}
          value = key as unknown as V;
          label = init.label ?? (key as EnumItemLabel);
        } else {
          // {} empty object
          value = key as unknown as V;
          label = key as EnumItemLabel;
        }
      } else {
        // Probably Date, RegExp and other primitive types
        value = init as V;
        label = key as EnumItemLabel;
      }
    } else {
      throw new Error(`Invalid enum item: ${JSON.stringify(init)}`);
    }
  } else {
    value = key as unknown as V;
    label = key as EnumItemLabel;
  }
  return { value, label };
}
