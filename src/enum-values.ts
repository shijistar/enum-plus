import type { EnumItemClass } from './enum-item';
import { localizer } from './localize';
import type { LocalizeInterface } from './localize-interface';
import type {
  BooleanFirstOptionConfig,
  BuiltInLocaleKeys,
  ColumnFilterItem,
  EnumInit,
  EnumItemOptionData,
  EnumItemOptions,
  EnumKey,
  EnumValue,
  FindEnumKeyByValue,
  FindLabelByValue,
  IEnumItems,
  MenuItemOption,
  ObjectFirstOptionConfig,
  PrimitiveOf,
  ToSelectConfig,
  ValueMap,
  ValueTypeFromSingleInit,
} from './types';
import { ENUM_ITEMS } from './utils';

/**
 * Enum items array, mostly are simple wrappers for EnumCollectionClass
 *
 * @template T Type of the initialization data of the enum collection
 *
 * @class EnumValuesArray
 *
 * @extends {EnumItemClass<T, K, V>[]}
 *
 * @export
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
  #raw: T;
  #localize: LocalizeInterface;
  #optionsConfigDefaults: ToSelectConfig & BooleanFirstOptionConfig<V> = { firstOption: false };

  /**
   * Instantiate an enum items array
   *
   * @memberof EnumValuesArray
   *
   * @param {T} raw Original initialization data object
   * @param {...EnumItemClass<T[K], K, V>[]} items Enum item instance array
   */
  constructor(raw: T, options: EnumItemOptions | undefined, ...items: EnumItemClass<T[K], K, V>[]) {
    super(...items);
    this.#raw = raw;
    this.#localize = (content: string | undefined) => {
      const localize = options?.localize ?? localizer.localize;
      if (typeof localize === 'function') {
        return localize(content);
      }
      return content;
    };
  }
  /**
   * **EN:** A boolean value indicates that this is an enum items array.
   *
   * **CN:** 布尔值，表示这是一个枚举项数组
   */
  readonly [ENUM_ITEMS] = true;

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
      return this.#raw;
    } else {
      if (Object.keys(this.#raw).some((k) => k === (value as string))) {
        // Find by key
        return this.#raw[value as K];
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

  toSelect(): EnumItemOptionData<K, V>[];
  toSelect(config?: ToSelectConfig & BooleanFirstOptionConfig<V>): EnumItemOptionData<K | '', V | ''>[];
  toSelect<FK = never, FV = never>(
    config?: ToSelectConfig & ObjectFirstOptionConfig<FK, FV>
  ): EnumItemOptionData<K | (FK extends never ? FV : FK), V | (FV extends never ? V : FV)>[];
  toSelect<FK = never, FV = never>(
    config: ToSelectConfig & (BooleanFirstOptionConfig<V> | ObjectFirstOptionConfig<FK, FV>) = this
      .#optionsConfigDefaults
  ): EnumItemOptionData<K | FK, V | FV>[] {
    const { firstOption = this.#optionsConfigDefaults.firstOption } = config;
    if (firstOption) {
      if (firstOption === true) {
        // 默认选项
        const value = ('firstOptionValue' in config ? config.firstOptionValue : undefined) ?? ('' as V);
        const label =
          ('firstOptionLabel' in config ? config.firstOptionLabel : undefined) ??
          ('enum-plus.options.all' as BuiltInLocaleKeys);
        return [{ key: '' as K, value, label: this.#localize(label) as string }, ...this];
      } else {
        return [
          {
            ...firstOption,
            key: firstOption.key ?? (firstOption.value as unknown as K),
            label: this.#localize(firstOption.label) as string,
          },
          ...this,
        ];
      }
    } else {
      return this;
    }
  }

  toValueMap() {
    const itemsMap = {} as ValueMap;
    for (let i = 0; i < this.length; i++) {
      const { value, label } = this[i];
      itemsMap[value as keyof typeof itemsMap] = { text: label };
    }
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
    throw new Error(
      'The valueType property of the enumeration is only allowed to be used to declare the ts type, and cannot be accessed at runtime! Please use the `typeof` operator in the ts type, for example: typeof Week.valueType'
    );
  }
  /** Stub method, only for typing usages, not for runtime calling */
  get keyType(): K {
    throw new Error(
      'The keyType property of the enumeration is only allowed to be used to declare the ts type, and cannot be accessed at runtime! Please use the `typeof` operator in the ts type, for example: typeof Week.keyType'
    );
  }

  /** Stub method, only for typing usages, not for runtime calling */
  get rawType(): T[K] {
    throw new Error(
      'The rawType property of the enumeration is only allowed to be used to declare the ts type, and cannot be accessed at runtime! Please use the `typeof` operator in the ts type, for example: typeof Week.rawType'
    );
  }
}

/** @deprecated Use `EnumItemsArray` instead */
export class EnumValuesArray<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
> extends EnumItemsArray<T, K, V> {}
