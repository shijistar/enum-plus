import type { EnumItemClass } from './enum-item';
import type {
  BooleanFirstOptionConfig,
  ColumnFilterItem,
  EnumInit,
  EnumKey,
  EnumItemOptionData,
  EnumValue,
  IEnumValues,
  MenuItemOption,
  ObjectFirstOptionConfig,
  OptionsConfig,
  ValueTypeFromSingleInit,
} from './types';

/**
 * Enum items array, mostly are simple wrappers for EnumCollectionClass
 *
 * @export
 * @class EnumValuesArray
 * @extends {Array<EnumItemClass<T, K, V>>}
 * @implements {IEnumValues<T, K, V>}
 * @template T Type of the initialization data of the enum collection
 */
export class EnumValuesArray<
    T extends EnumInit<K, V>,
    K extends EnumKey<T> = EnumKey<T>,
    V extends EnumValue = ValueTypeFromSingleInit<T[K], K>
  >
  extends Array<EnumItemClass<T[K], K, V>>
  implements IEnumValues<T, K, V>
{
  #raw: T;

  /**
   * Instantiate an enum items array
   *
   * @param {T} raw Original initialization data object
   * @param {...EnumItemClass<T[K], K, V>[]} items Enum item instance array
   * @memberof EnumValuesArray
   */
  constructor(raw: T, ...items: EnumItemClass<T[K], K, V>[]) {
    super(...items);
    this.#raw = raw;
  }

  label(keyOrValue?: string | number): string | undefined {
    //  First find by value, then find by key
    return (this.find((i) => i.value === keyOrValue) ?? this.find((i) => i.key === keyOrValue))
      ?.label;
  }

  key(value?: string | number): K | undefined {
    return this.find((i) => i.value === value)?.key;
  }

  has(keyOrValue?: string | number): boolean {
    return this.some((i) => i.value === keyOrValue || i.key === keyOrValue);
  }

  options(): EnumItemOptionData<K, V>[];
  options(
    config?: OptionsConfig & BooleanFirstOptionConfig<V>
  ): EnumItemOptionData<K | '', V | ''>[];
  options<FK = never, FV = never>(
    config?: OptionsConfig & ObjectFirstOptionConfig<FK, FV>
  ): EnumItemOptionData<K | (FK extends never ? FV : FK), V | (FV extends never ? V : FV)>[];
  options<FK = never, FV = never>(
    config: OptionsConfig & (BooleanFirstOptionConfig<V> | ObjectFirstOptionConfig<FK, FV>) = this
      .#optionsConfigDefaults as any
  ): EnumItemOptionData<K | FK, V | FV>[] {
    const { firstOption = this.#optionsConfigDefaults.firstOption } = config;
    if (firstOption) {
      if (firstOption === true) {
        // 默认选项
        const value =
          ('firstOptionValue' in config ? config.firstOptionValue : undefined) ?? ('' as V);
        const label = ('firstOptionLabel' in config ? config.firstOptionLabel : undefined) ?? 'All';
        return [{ key: '' as K, value, label }, ...this];
      } else {
        return [
          { ...firstOption, key: firstOption.key ?? (firstOption.value as unknown as K) },
          ...this,
        ];
      }
    } else {
      return this;
    }
  }
  #optionsConfigDefaults: OptionsConfig & BooleanFirstOptionConfig<V> = {
    firstOption: false,
  };

  valuesEnum() {
    const itemsMap = {} as Record<V, { text: string }>;
    for (let i = 0; i < this.length; i++) {
      const { value, label } = this[i];
      itemsMap[value] = { text: label };
    }
    return itemsMap;
  }

  menus(): MenuItemOption<V>[] {
    return this.map(({ value, label }) => ({ key: value, label }));
  }

  filters(): ColumnFilterItem<V>[] {
    return this.map(({ value, label }) => ({ text: label, value }));
  }

  raw(): T;
  raw(keyOrValue: V | K): T[K];
  raw(value: unknown): T[K] | undefined;
  raw(value?: V | K): T | T[K] | undefined {
    if (value == null) {
      // Return the original initialization object
      return this.#raw;
    } else {
      if (Object.keys(this.#raw).includes(value as string)) {
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

  /**
   * @deprecated Stub method, only for typing usages, not for runtime calling
   */
  get valueType(): V {
    throw new Error(
      'The valueType property of the enumeration is only allowed to be used to declare the ts type, and cannot be accessed at runtime! Please use the `typeof` operator in the ts type, for example: typeof Week.valueType'
    );
  }
  /**
   * @deprecated Stub method, only for typing usages, not for runtime calling
   */
  get keyType(): K {
    throw new Error(
      'The keyType property of the enumeration is only allowed to be used to declare the ts type, and cannot be accessed at runtime! Please use the `typeof` operator in the ts type, for example: typeof Week.keyType'
    );
  }

  /**
   * @deprecated Stub method, only for typing usages, not for runtime calling
   */
  get rawType(): T[K] {
    throw new Error(
      'The rawType property of the enumeration is only allowed to be used to declare the ts type, and cannot be accessed at runtime! Please use the `typeof` operator in the ts type, for example: typeof Week.rawType'
    );
  }
}
