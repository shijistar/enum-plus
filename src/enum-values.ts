import { Enum } from './enum';
import type { EnumItemClass } from './enum-item';
import type {
  BooleanFirstOptionConfig,
  BuiltInLocaleKeys,
  ColumnFilterItem,
  EnumInit,
  EnumItemOptionData,
  EnumItemOptions,
  EnumKey,
  EnumValue,
  IEnumValues,
  MenuItemOption,
  ObjectFirstOptionConfig,
  ToSelectConfig,
  ValueMap,
  ValueTypeFromSingleInit,
} from './types';

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
export class EnumValuesArray<
    T extends EnumInit<K, V>,
    K extends EnumKey<T> = EnumKey<T>,
    V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
  >
  extends Array<EnumItemClass<T[K], K, V>>
  implements IEnumValues<T, K, V>
{
  #raw: T;
  #localize: NonNullable<EnumItemOptions['localize']>;
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
      const localize = options?.localize ?? Enum.localize;
      if (typeof localize === 'function') {
        return localize(content);
      }
      return content;
    };
  }

  label(keyOrValue?: string | number): string | undefined {
    //  First find by value, then find by key
    return (this.find((i) => i.value === keyOrValue) ?? this.find((i) => i.key === keyOrValue))?.label;
  }

  key(value?: string | number): K | undefined {
    return this.find((i) => i.value === value)?.key;
  }

  has(keyOrValue?: string | number): boolean {
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
  /** @deprecated Use `toSelect` instead */
  options(): EnumItemOptionData<K, V>[];
  /** @deprecated Use `toSelect` instead */
  options(config?: ToSelectConfig & BooleanFirstOptionConfig<V>): EnumItemOptionData<K | '', V | ''>[];
  /** @deprecated Use `toSelect` instead */
  options<FK = never, FV = never>(
    config?: ToSelectConfig & ObjectFirstOptionConfig<FK, FV>
  ): EnumItemOptionData<K | (FK extends never ? FV : FK), V | (FV extends never ? V : FV)>[];
  /** @deprecated Use `toSelect` instead */
  options<FK = never, FV = never>(
    config?: ToSelectConfig & (BooleanFirstOptionConfig<V> | ObjectFirstOptionConfig<FK, FV>)
  ): EnumItemOptionData<K | FK, V | FV>[] {
    return this.toSelect(config as ToSelectConfig & BooleanFirstOptionConfig<V>) as EnumItemOptionData<
      K | FK,
      V | FV
    >[];
  }

  toValueMap() {
    const itemsMap = {} as ValueMap<V>;
    for (let i = 0; i < this.length; i++) {
      const { value, label } = this[i];
      itemsMap[value as keyof typeof itemsMap] = { text: label };
    }
    return itemsMap;
  }
  /** @deprecated Use `toValueMap` instead */
  valuesEnum() {
    return this.toValueMap();
  }

  toMenu(): MenuItemOption<V>[] {
    return this.map(({ value, label }) => ({ key: value, label }));
  }
  /** @deprecated Use `toMenu` instead */
  menus() {
    return this.toMenu();
  }

  toFilter(): ColumnFilterItem<V>[] {
    return this.map(({ value, label }) => ({ text: label, value }));
  }
  /** @deprecated Use `toFilter` instead */
  filters() {
    return this.toFilter();
  }

  raw(): T;
  raw(keyOrValue: V | K): T[K];
  raw(value: unknown): T[K] | undefined;
  raw(value?: V | K): T | T[K] | undefined {
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

  /** @deprecated Stub method, only for typing usages, not for runtime calling */
  get valueType(): V {
    throw new Error(
      'The valueType property of the enumeration is only allowed to be used to declare the ts type, and cannot be accessed at runtime! Please use the `typeof` operator in the ts type, for example: typeof Week.valueType'
    );
  }
  /** @deprecated Stub method, only for typing usages, not for runtime calling */
  get keyType(): K {
    throw new Error(
      'The keyType property of the enumeration is only allowed to be used to declare the ts type, and cannot be accessed at runtime! Please use the `typeof` operator in the ts type, for example: typeof Week.keyType'
    );
  }

  /** @deprecated Stub method, only for typing usages, not for runtime calling */
  get rawType(): T[K] {
    throw new Error(
      'The rawType property of the enumeration is only allowed to be used to declare the ts type, and cannot be accessed at runtime! Please use the `typeof` operator in the ts type, for example: typeof Week.rawType'
    );
  }
}
