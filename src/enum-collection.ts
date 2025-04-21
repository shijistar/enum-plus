import type { EnumExtension } from 'enum-plus-extend';
import { EnumItemClass } from './enum-item';
import { EnumItemsArray } from './enum-values';
import type {
  BooleanFirstOptionConfig,
  ColumnFilterItem,
  EnumInit,
  EnumItemInit,
  EnumItemOptionData,
  EnumItemOptions,
  EnumKey,
  EnumValue,
  FindEnumKeyByValue,
  IEnumItems,
  MenuItemOption,
  ObjectFirstOptionConfig,
  StandardEnumItemInit,
  ToSelectConfig,
  ValueTypeFromSingleInit,
} from './types';
import { ENUM_COLLECTION, ITEMS, KEYS } from './utils';

/**
 * **EN:** Enum collection extension base class, used to extend the Enums
 *
 * **CN:** 枚举集合扩展基类，用于扩展枚举
 */
// @ts-expect-error: because don't know which methods are added
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class EnumExtensionClass<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
> implements EnumExtension<T, K, V> {}
/**
 * **EN:** Enum collection
 *
 * **CN:** 枚举项集合
 */
export class EnumCollectionClass<
    T extends EnumInit<K, V>,
    K extends EnumKey<T> = EnumKey<T>,
    V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
  >
  extends EnumExtensionClass<T, K, V>
  implements IEnumItems<T, K, V>
{
  readonly items!: EnumItemsArray<T, K, V>;
  readonly keys!: K[];
  /**
   * **EN:** A boolean value indicates that this is an enum collection instance.
   *
   * **CN:** 布尔值，表示这是一个枚举集合实例
   */
  readonly [ENUM_COLLECTION] = true;

  constructor(init: T = {} as T, options?: EnumItemOptions) {
    super();
    // exclude number keys with a "reverse mapping" value, it means those "reverse mapping" keys of number enums
    const keys = Object.keys(init).filter(
      (k) => !(/^-?\d+$/.test(k) && k === `${init[init[k as K] as K] ?? ''}`)
    ) as K[];
    const parsed = keys.map((key) => parseEnumItem<EnumItemInit<V>, K, V>(init[key], key));
    keys.forEach((key, index) => {
      const { value } = parsed[index];
      // @ts-expect-error: because of dynamically define property
      this[key] = value;
    });
    Object.freeze(keys);
    // @ts-expect-error: because use KEYS to avoid naming conflicts in case of 'keys' field name is taken
    this[Object.keys(init).some((k) => k === 'keys') ? KEYS : 'keys'] = keys;

    // Build enum item data
    const items = new EnumItemsArray<T, K, V>(
      init,
      options,
      ...keys.map((key, index) => {
        const { value, label } = parsed[index];
        return new EnumItemClass<T[K], K, V>(key, value, label, init[key], options).readonly();
      })
    );
    // @ts-expect-error: because use ITEMS to avoid naming conflicts in case of 'items' field name is taken
    this[Object.keys(init).some((k) => k === 'items') ? ITEMS : 'items'] = items;

    // Override the `instanceof` operator rule
    // @ts-expect-error: because override the instanceof operator
    this[Symbol.hasInstance] = (instance: unknown): boolean => {
      // intentionally use == to support both number and string format value
      return this.items.some(
        // eslint-disable-next-line eqeqeq
        (i) => instance == i.value || instance === i.key
      );
    };

    Object.freeze(this);
    Object.freeze(this.items);
    Object.freeze(this.keys);
  }

  key(value?: string | number) {
    return this.items.key(value);
  }
  label(keyOrValue?: string | number): string | undefined {
    return this.items.label(keyOrValue);
  }
  has(keyOrValue?: string | number) {
    return this.items.has(keyOrValue);
  }

  toSelect(): EnumItemOptionData<K, V>[];
  toSelect(config: ToSelectConfig & BooleanFirstOptionConfig<V>): EnumItemOptionData<K | '', V | ''>[];
  toSelect<FK = never, FV = never>(
    config: ToSelectConfig & ObjectFirstOptionConfig<FK, FV>
  ): EnumItemOptionData<K | (FK extends never ? FV : FK), V | (FV extends never ? V : FV)>[];
  toSelect<FK = never, FV = never>(
    config?: ToSelectConfig & (BooleanFirstOptionConfig<V> | ObjectFirstOptionConfig<FK, FV>)
  ): EnumItemOptionData<K | FK, V | FV>[] {
    return this.items.toSelect(config as ToSelectConfig & BooleanFirstOptionConfig<V>) as EnumItemOptionData<
      K | FK,
      V | FV
    >[];
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

  raw(): T;
  // eslint-disable-next-line @typescript-eslint/ban-types
  raw<IK extends V | K | Exclude<EnumValue, string> | (string & {})>(
    keyOrValue: IK
  ): IK extends K ? T[IK] : IK extends V ? T[FindEnumKeyByValue<T, IK>] : T[K] | undefined;
  raw<IK extends EnumValue>(value?: IK | unknown): T | T[K] | T[FindEnumKeyByValue<T, IK>] | undefined {
    if (value != null) {
      return this.items.raw(value as keyof T | EnumValue) as T[K];
    } else {
      return this.items.raw();
    }
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
