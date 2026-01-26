import type { EnumExtension } from 'enum-plus/extension';
import type { EnumInitOptions } from './enum';
import type { EnumItemClass, EnumItemOptions } from './enum-item';
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
    const P = any,
  >
  extends EnumExtensionClass<T, K, V>
  implements InheritableEnumItems<T, K, V, P>
{
  private readonly __options__: EnumInitOptions<T, K, V, P> | undefined;
  // used for e2e serialization
  private readonly __items__!: EnumItemsArray<T, K, V, P>;

  constructor(init: T = {} as T, options?: EnumInitOptions<T, K, V, P>) {
    super();
    // Do not use class field here, because don't want print this field in Node.js
    Object.defineProperty(this, '__options__', {
      value: options,
      writable: false,
      enumerable: false,
      configurable: false,
    });

    const keys = Object.keys(init) as K[];
    // Generate enum items array
    const items = new EnumItemsArray<T, K, V, P>(init, options);
    Object.freeze(items);
    // @ts-expect-error: because use ITEMS to avoid naming conflicts in case of 'items' field name is taken
    this[keys.includes('items') ? ITEMS : 'items'] = items;
    Object.defineProperty(this, '__items__', {
      value: items,
      writable: false,
      enumerable: false,
      configurable: false,
    });

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
    Object.defineProperty(this, keys.includes('labels') ? LABELS : 'labels', {
      enumerable: true,
      configurable: false,
      get: function (this: EnumCollectionClass<T, K, V, P>) {
        return this.__items__.labels;
      },
    });

    Object.freeze(this);
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
  get [ENUM_OPTIONS](): EnumItemOptions<T[K], K, V, P> | undefined {
    return this.__options__;
  }
  [Symbol.hasInstance]<T>(instance: T): instance is Extract<T, K | V> {
    return instance instanceof this.__items__;
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
    if (typeof this.__options__?.name === 'function') {
      return this.__options__.name(undefined!);
    }
    const localize = this.__options__?.localize ?? localizer.localize;
    if (typeof localize === 'function') {
      return localize(this.__options__?.name);
    }
    return this.__options__?.name;
  }

  label<KV extends V | K | NonNullable<PrimitiveOf<V>> | NonNullable<PrimitiveOf<K>> | undefined>(keyOrValue: KV) {
    return this.__items__.label(keyOrValue);
  }

  key<IV extends V | NonNullable<PrimitiveOf<V>> | undefined>(value?: IV) {
    return this.__items__.key(value);
  }

  raw(): T;
  raw<IK extends V | K | Exclude<EnumValue, string> | NonNullable<string>>(
    keyOrValue: IK
  ): IK extends K ? T[IK] : IK extends V ? T[FindEnumKeyByValue<T, IK>] : T[K] | undefined;
  raw<IK extends EnumValue>(value?: IK | unknown): T | T[K] | T[FindEnumKeyByValue<T, IK>] | undefined {
    if (value != null) {
      return this.__items__.raw(value as keyof T | EnumValue) as T[K];
    } else {
      return this.__items__.raw();
    }
  }

  has<KV>(keyOrValue?: KV): keyOrValue is Extract<KV, K | V> extends never ? typeof keyOrValue : Extract<KV, K | V> {
    return this.__items__.has(keyOrValue);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  findBy(...rest: Parameters<EnumItemsArray<T, K, V, P>['findBy']>): any {
    return this.__items__.findBy(...rest);
  }

  toList(): ListItem<V, 'value', 'label'>[];
  toList<
    FOV extends string | ((item: EnumItemClass<T[K], K, V, P>) => string),
    FOL extends string | ((item: EnumItemClass<T[K], K, V, P>) => string),
  >(
    config: ToListConfig<T, FOV, FOL, K, V, never, P>
  ): ListItem<
    V,
    FOV extends (item: EnumItemClass<T[K], K, V, P>) => infer R ? R : FOV,
    FOL extends (item: EnumItemClass<T[K], K, V, P>) => infer R ? R : FOL
  >[];
  toList<
    FOV extends string | ((item: EnumItemClass<T[K], K, V, P>) => string),
    FOL extends string | ((item: EnumItemClass<T[K], K, V, P>) => string),
  >(
    config?: ToListConfig<T, FOV, FOL, K, V, never, P>
  ):
    | ListItem<V, 'value', 'label'>[]
    | ListItem<
        V,
        FOV extends (item: EnumItemClass<T[K], K, V, P>) => infer R ? R : FOV,
        FOL extends (item: EnumItemClass<T[K], K, V, P>) => infer R ? R : FOL
      >[] {
    return this.__items__.toList(config as ToListConfig<T, FOV, FOL, K, V, never, P>);
  }

  toMap(): MapResult<T, 'value', 'label', K, V, P>;
  toMap<
    KS extends EnumItemFields | (<R extends string | symbol>(item: EnumItemClass<T[K], K, V, P>) => R),
    VS extends EnumItemFields | (<R>(item: EnumItemClass<T[K], K, V, P>) => R),
  >(config: ToMapConfig<T, KS, VS, K, V, P>): MapResult<T, KS, VS, K, V, P>;
  toMap<
    KS extends EnumItemFields | (<R extends string | symbol>(item: EnumItemClass<T[K], K, V, P>) => R),
    VS extends EnumItemFields | (<R>(item: EnumItemClass<T[K], K, V, P>) => R),
  >(config?: ToMapConfig<T, KS, VS, K, V, P>): MapResult<T, KS, VS, K, V, P> {
    return this.__items__.toMap(config as ToMapConfig<T, KS, VS, K, V, P>);
  }

  get valueType() {
    return this.__items__.valueType;
  }
  get keyType() {
    return this.__items__.keyType;
  }
  get rawType() {
    return this.__items__.rawType;
  }
}
