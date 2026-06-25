import type { EnumExtension } from 'enum-plus/extension';
import type { EnumInitOptions } from './enum';
import type { EnumItemInterface, EnumItemOptions } from './enum-item';
import type { EnumItemFields, InheritableEnumItems, MapResult, ToListConfig, ToMapConfig } from './enum-items';
import { EnumItemsArray } from './enum-items';
import { localizer } from './global-config';
import type {
  EnumInit,
  EnumKey,
  EnumValue,
  FindEnumKeyByValue,
  ListItem,
  PrimitiveOf,
  ValueTypeFromSingleInit,
} from './types';
import { ENUM_OPTIONS, IS_ENUM, ITEMS, KEYS, LABELS, META, NAMED, VALUES } from './utils';

/**
 * - **EN:** Enum collection extension base class, used to extend the Enums
 * - **CN:** 枚举集合扩展基类，用于扩展枚举
 */
// @ts-expect-error: because don't know which methods are added
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class EnumExtensionClass<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
> implements EnumExtension<T, K, V> {}

/**
 * - **EN:** Enum collection
 * - **CN:** 枚举项集合
 */
export class EnumCollectionClass<
  const T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LP = any,
>
  extends EnumExtensionClass<T, K, V>
  implements InheritableEnumItems<T, K, V, LP>
{
  private readonly __options__: EnumInitOptions<T, K, V, LP> | undefined;
  // used for e2e serialization
  private readonly _ds!: EnumItemsArray<T, K, V, LP>;

  constructor(init: T = {} as T, options?: EnumInitOptions<T, K, V, LP>) {
    super();

    const define = Object.defineProperty;
    const freeze = Object.freeze;
    // Do not use class field here, because don't want print this field in Node.js
    define(this, '__options__', { value: options });

    const keys = Object.keys(init) as K[];
    // Generate enum items array
    const items = new EnumItemsArray<T, K, V, LP>(init, options);
    freeze(items);
    // @ts-expect-error: because use ITEMS to avoid naming conflicts in case of 'items' field name is taken
    this[keys.includes('items') ? ITEMS : 'items'] = items;
    define(this, '_ds', { value: items });

    // @ts-expect-error: because use KEYS to avoid naming conflicts in case of 'keys' field name is taken
    this[keys.includes('keys') ? KEYS : 'keys'] = items[KEYS];

    // @ts-expect-error: because use VALUES to avoid naming conflicts in case of 'values' field name is taken
    this[keys.includes('values') ? VALUES : 'values'] = items[VALUES];

    // @ts-expect-error: because use NAMED to avoid naming conflicts in case of 'named' field name is taken
    this[keys.includes('named') ? NAMED : 'named'] = items.named;

    // @ts-expect-error: because use META to avoid naming conflicts in case of 'meta' field name is taken
    this[keys.includes('meta') ? META : 'meta'] = items.meta;

    // Add keys to the instance, allows picking enum values by keys
    items.forEach((item) => {
      // @ts-expect-error: because of dynamic property
      this[item.key] = item.value;
    });

    // @ts-expect-error: because use LABELS to avoid naming conflicts in case of 'labels' field name is taken
    define(this, keys.includes('labels') ? LABELS : 'labels', {
      get: function (this: EnumCollectionClass<T, K, V, LP>) {
        return this._ds.labels;
      },
      enumerable: true,
    });

    freeze(this);
  }
  /**
   * - **EN:** A boolean value indicates that this is an enum collection instance.
   * - **CN:** 布尔值，表示这是一个枚举集合实例
   */
  // Do not use readonly field here, because don't want print this field in Node.js
  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  get [IS_ENUM](): true {
    return true;
  }
  /**
   * - **EN:** Get the options to initialize the enum.
   * - **CN:** 获取初始化枚举时的选项
   */
  get [ENUM_OPTIONS](): EnumItemOptions<T[K], K, V, LP> | undefined {
    return this.__options__;
  }
  [Symbol.hasInstance]<T>(instance: T): instance is Extract<T, K | V> {
    return instance instanceof this._ds;
  }
  /**
   * The enum collection name, supports localization. Note that it usually returns a string, but if
   * a custom `localize` function is set, the return value may vary depending on the implementation
   * of the method.
   *
   * - **CN:** 枚举集合显示名称，支持本地化。注意，通常情况下返回的是字符串，但如果设置了自定义的 `localize` 函数，则返回值可能有所不同，取决于方法的实现
   *
   * @returns {string | undefined} The localized name of the enum collection, or undefined if not
   *   set.
   */
  get name(): string | undefined {
    const opts = this.__options__;
    const enumName = opts?.name;
    if (typeof enumName === 'function') {
      return enumName(undefined!);
    }
    // todo: 拼接 labelPrefix，和enumItem类似逻辑复用代码
    const localize = opts?.localize ?? localizer.localize;
    if (typeof localize === 'function') {
      return localize(enumName);
    }
    return enumName;
  }

  label<KV extends V | K | NonNullable<PrimitiveOf<V>> | NonNullable<PrimitiveOf<K>> | undefined>(keyOrValue: KV) {
    return this._ds.label(keyOrValue);
  }

  key<IV extends V | NonNullable<PrimitiveOf<V>> | undefined>(value?: IV) {
    return this._ds.key(value);
  }

  item<KV extends K | V | NonNullable<PrimitiveOf<V>> | NonNullable<PrimitiveOf<K>> | undefined>(keyOrValue: KV) {
    return this._ds.item(keyOrValue);
  }

  raw(): T;
  raw<IK extends V | K | Exclude<EnumValue, string> | NonNullable<string>>(
    keyOrValue: IK,
  ): IK extends K ? T[IK] : IK extends V ? T[FindEnumKeyByValue<T, IK>] : T[K] | undefined;
  raw<IK extends EnumValue>(value?: IK | unknown): T | T[K] | T[FindEnumKeyByValue<T, IK>] | undefined {
    if (value != null) {
      return this._ds.raw(value as keyof T | EnumValue) as T[K];
    } else {
      return this._ds.raw();
    }
  }

  has<KV>(keyOrValue?: KV): keyOrValue is Extract<KV, K | V> extends never ? typeof keyOrValue : Extract<KV, K | V> {
    return this._ds.has(keyOrValue);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  findBy(...rest: Parameters<EnumItemsArray<T, K, V, LP>['findBy']>): any {
    return this._ds.findBy(...rest);
  }

  toList(): ListItem<V, 'value', 'label'>[];
  toList<
    FOV extends string | ((item: EnumItemInterface<T[K], K, V, LP>) => string),
    FOL extends string | ((item: EnumItemInterface<T[K], K, V, LP>) => string),
  >(
    config: ToListConfig<T, FOV, FOL, K, V, never, LP>,
  ): ListItem<
    V,
    FOV extends (item: EnumItemInterface<T[K], K, V, LP>) => infer R ? R : FOV,
    FOL extends (item: EnumItemInterface<T[K], K, V, LP>) => infer R ? R : FOL
  >[];
  toList<
    FOV extends string | ((item: EnumItemInterface<T[K], K, V, LP>) => string),
    FOL extends string | ((item: EnumItemInterface<T[K], K, V, LP>) => string),
  >(
    config?: ToListConfig<T, FOV, FOL, K, V, never, LP>,
  ):
    | ListItem<V, 'value', 'label'>[]
    | ListItem<
        V,
        FOV extends (item: EnumItemInterface<T[K], K, V, LP>) => infer R ? R : FOV,
        FOL extends (item: EnumItemInterface<T[K], K, V, LP>) => infer R ? R : FOL
      >[] {
    return this._ds.toList(config as ToListConfig<T, FOV, FOL, K, V, never, LP>);
  }

  toMap(): MapResult<T, 'value', 'label', K, V, LP>;
  toMap<
    KS extends EnumItemFields | (<R extends string | symbol>(item: EnumItemInterface<T[K], K, V, LP>) => R),
    VS extends EnumItemFields | (<R>(item: EnumItemInterface<T[K], K, V, LP>) => R),
  >(config: ToMapConfig<T, KS, VS, K, V, LP>): MapResult<T, KS, VS, K, V, LP>;
  toMap<
    KS extends EnumItemFields | (<R extends string | symbol>(item: EnumItemInterface<T[K], K, V, LP>) => R),
    VS extends EnumItemFields | (<R>(item: EnumItemInterface<T[K], K, V, LP>) => R),
  >(config?: ToMapConfig<T, KS, VS, K, V, LP>): MapResult<T, KS, VS, K, V, LP> {
    return this._ds.toMap(config as ToMapConfig<T, KS, VS, K, V, LP>);
  }

  get valueType() {
    return this._ds.valueType;
  }
  get keyType() {
    return this._ds.keyType;
  }
  get rawType() {
    return this._ds.rawType;
  }
}
