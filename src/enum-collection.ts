import type { EnumExtension } from 'enum-plus/extension';
import type { EnumItemOptions } from './enum-item';
import { EnumItemClass } from './enum-item';
import type { IEnumItems, ToListConfig } from './enum-items';
import { EnumItemsArray } from './enum-items';
import { localizer } from './localize';
import type {
  ColumnFilterItem,
  EnumInit,
  EnumItemInit,
  EnumKey,
  EnumValue,
  FindEnumKeyByValue,
  ListItem,
  MenuItemOption,
  PrimitiveOf,
  StandardEnumItemInit,
  ValueTypeFromSingleInit,
} from './types';
import type { IS_ENUM_ITEMS } from './utils';
import { IS_ENUM, ITEMS, KEYS, LABELS, VALUES } from './utils';

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
    T extends EnumInit<K, V>,
    K extends EnumKey<T> = EnumKey<T>,
    V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
  >
  extends EnumExtensionClass<T, K, V>
  implements Omit<IEnumItems<T, K, V>, typeof IS_ENUM_ITEMS>
{
  private __options__: EnumItemOptions | undefined;
  readonly items!: EnumItemsArray<T, K, V>;
  readonly keys!: K[];
  /**
   * - **EN:** A boolean value indicates that this is an enum collection instance.
   * - **CN:** 布尔值，表示这是一个枚举集合实例
   */
  // Do not use readonly field here, because don't want print this field in Node.js
  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  get [IS_ENUM](): true {
    return true;
  }
  [Symbol.hasInstance]<T>(instance: T): instance is Extract<T, K | V> {
    return instance instanceof this.items;
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
    const localize = this.__options__?.localize ?? localizer.localize;
    if (typeof localize === 'function') {
      return localize(this.__options__?.name);
    }
    return this.__options__?.name;
  }

  constructor(init: T = {} as T, options?: EnumItemOptions) {
    super();
    // Do not use class field here, because don't want print this field in Node.js
    Object.defineProperty(this, '__options__', {
      value: options,
      writable: false,
      enumerable: false,
      configurable: false,
    });

    // Generate keys array
    // exclude number keys with a "reverse mapping" value, it means those "reverse mapping" keys of number enums
    const keys = Object.keys(init).filter(
      (k) => !(/^-?\d+$/.test(k) && k === `${init[init[k as K] as K] ?? ''}`)
    ) as K[];
    const parsed = keys.map((key) => parseEnumItem<EnumItemInit<V>, K, V>(init[key], key));
    keys.forEach((key, index) => {
      const { value } = parsed[index];
      // @ts-expect-error: because of dynamic property
      this[key] = value;
    });
    Object.freeze(keys);
    // @ts-expect-error: because use KEYS to avoid naming conflicts in case of 'keys' field name is taken
    this[Object.keys(init).some((k) => k === 'keys') ? KEYS : 'keys'] = keys;

    // Generate values array
    const values = parsed.map((item) => item.value);
    Object.freeze(values);
    // @ts-expect-error: because use VALUES to avoid naming conflicts in case of 'values' field name is taken
    this[Object.keys(init).some((k) => k === 'values') ? VALUES : 'values'] = values;

    // Generate enum items array
    const items = new EnumItemsArray<T, K, V>(
      init,
      this.__options__,
      ...keys.map((key, index) => {
        const { value, label } = parsed[index];
        return new EnumItemClass<T[K], K, V>(key, value, label, init[key], this.__options__);
      })
    );
    Object.freeze(items);
    // @ts-expect-error: because use ITEMS to avoid naming conflicts in case of 'items' field name is taken
    this[Object.keys(init).some((k) => k === 'items') ? ITEMS : 'items'] = items;

    // Generate labels array
    Object.defineProperty(this, Object.keys(init).some((k) => k === 'labels') ? LABELS : 'labels', {
      enumerable: true,
      configurable: false,
      get: () => {
        // Cannot save to static array because labels may be localized contents
        // Should not use `items` in the closure because the getter function cannot be fully serialized
        return ((this as unknown as { [ITEMS]: EnumItemsArray<T, K, V> })[ITEMS] ?? this.items).map(
          (item) => item.label
        );
      },
    });

    Object.freeze(this);
  }

  label<KV extends V | K | NonNullable<PrimitiveOf<V>> | NonNullable<PrimitiveOf<K>> | undefined>(keyOrValue: KV) {
    return this.items.label(keyOrValue);
  }

  key<IV extends V | NonNullable<PrimitiveOf<V>> | undefined>(value?: IV) {
    return this.items.key(value);
  }

  raw(): T;
  raw<IK extends V | K | Exclude<EnumValue, string> | NonNullable<string>>(
    keyOrValue: IK
  ): IK extends K ? T[IK] : IK extends V ? T[FindEnumKeyByValue<T, IK>] : T[K] | undefined;
  raw<IK extends EnumValue>(value?: IK | unknown): T | T[K] | T[FindEnumKeyByValue<T, IK>] | undefined {
    if (value != null) {
      return this.items.raw(value as keyof T | EnumValue) as T[K];
    } else {
      return this.items.raw();
    }
  }

  has(keyOrValue?: string | V) {
    return this.items.has(keyOrValue);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  findBy(...rest: Parameters<EnumItemsArray<T, K, V>['findBy']>): any {
    return this.items.findBy(...rest);
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
    return this.items.toList(config as ToListConfig<T, FOV, FOL, K, V>);
  }

  toMenu(): MenuItemOption<V>[] {
    return this.items.toMenu();
  }

  toFilter(): ColumnFilterItem<V>[] {
    return this.items.toFilter();
  }

  toValueMap() {
    return this.items.toValueMap();
  }

  get valueType() {
    return this.items.valueType;
  }
  get keyType() {
    return this.items.keyType;
  }
  get rawType() {
    return this.items.rawType;
  }
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
