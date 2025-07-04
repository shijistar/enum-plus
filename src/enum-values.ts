import type { EnumItemClass } from './enum-item';
import type {
  ColumnFilterItem,
  EnumInit,
  EnumItemOptions,
  EnumKey,
  EnumValue,
  FindEnumKeyByValue,
  FindLabelByValue,
  IEnumItems,
  ListItem,
  MenuItemOption,
  PrimitiveOf,
  ToListConfig,
  ValueMap,
  ValueTypeFromSingleInit,
} from './types';
import { ENUM_ITEMS } from './utils';

/**
 * Enum items array, mostly are simple wrappers for EnumCollectionClass
 *
 * @template T Type of the initialization data of the enum collection
 *
 * @class EnumItemsArray
 *
 * @extends {EnumItemClass<T, K, V>[]}
 *
 * @implements {IEnumValues<T, K, V>}
 */
export class EnumItemsArray<
    T extends EnumInit<K, V>,
    K extends EnumKey<T> = EnumKey<T>,
    V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
  >
  extends Array<EnumItemClass<T[K], K, V>>
  implements IEnumItems<T, K, V>
{
  private _raw: T;
  /**
   * - **EN:** A boolean value indicates that this is an enum items array.
   * - **CN:** 布尔值，表示这是一个枚举项数组
   */
  readonly [ENUM_ITEMS] = true;

  /**
   * Instantiate an enum items array
   *
   * @memberof EnumItemsArray
   *
   * @param {T} raw Original initialization data object
   * @param {...EnumItemClass<T[K], K, V>[]} items Enum item instance array
   */
  constructor(raw: T, options: EnumItemOptions | undefined, ...items: EnumItemClass<T[K], K, V>[]) {
    super(...items);
    this._raw = raw;
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
      return this._raw;
    } else {
      if (Object.keys(this._raw).some((k) => k === (value as string))) {
        // Find by key
        return this._raw[value as K];
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
      return this;
    } else {
      return this.map((item) => {
        const valueFieldName = typeof valueField === 'function' ? valueField(item) : (valueField as string);
        const labelFieldName = typeof labelField === 'function' ? labelField(item) : (labelField as string);
        return {
          [valueFieldName]: item.value,
          // should use getter to preserve the localized label, as it may be dynamic content
          get [labelFieldName]() {
            return item.label;
          },
        } as ListItem<
          V,
          FOV extends (item: EnumItemClass<T[K], K, V>) => infer R ? R : FOV,
          FOL extends (item: EnumItemClass<T[K], K, V>) => infer R ? R : FOL
        >;
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
    return this.map(({ value, label }) => ({ key: value, label }));
  }

  toFilter(): ColumnFilterItem<V>[] {
    return this.map(({ value, label }) => ({ text: label, value }));
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

  private _runtimeError(name: string) {
    return `The ${name} property of the enumeration is only allowed to be used to declare the ts type, and cannot be accessed at runtime! Please use the typeof operator in the ts type, for example: typeof Week.${name}`;
  }
}
