import { KEYS, VALUES } from './index';
import { EnumItemClass } from './enum-item';
import type {
  BooleanFirstOptionConfig,
  IEnumValues,
  ObjectFirstOptionConfig,
  OptionsConfig,
  EnumInit,
  EnumItemInit,
  EnumKey,
  EnumItemOptionData,
  EnumValue,
  StandardEnumItemInit,
  ValueTypeFromSingleInit,
  ColumnFilterItem,
  EnumItemOptions,
  MenuItemOption,
} from './types';
import { EnumValuesArray } from './enum-values';

/**
 * EN: Enum collection
 * CN: 枚举项集合
 */
export class EnumCollectionClass<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>
> implements IEnumValues<T, K, V>
{
  readonly values!: EnumValuesArray<T, K, V>;
  readonly keys!: K[];

  constructor(init: T = {} as T, options?: EnumItemOptions) {
    const keys = Object.keys(init) as K[];
    const parsed = keys.map((key) =>
      parseEnumItem<EnumItemInit<V>, K, V, T>(init[key], key, { typeInit: init, keys })
    );
    keys.forEach((key, index) => {
      const { value } = parsed[index];
      // @ts-expect-error: dynamically define property
      this[key] = value;
    });
    // @ts-expect-error: if init contains keys, use KEYS to avoid naming conflicts
    this[Object.keys(init).some((k) => k === 'keys') ? KEYS : 'keys'] = keys;

    // Build enum item data
    const values = new EnumValuesArray<T, K, V>(
      init,
      options,
      ...keys.map((key, index) => {
        const { value, label } = parsed[index];
        return new EnumItemClass<T[K], K, V>(key, value, label, init[key], options).readonly();
      })
    );
    // @ts-expect-error: if init contains values, use VALUES to avoid naming conflicts
    this[Object.keys(init).some((k) => k === 'values') ? VALUES : 'values'] = values;

    // Override some system methods
    // @ts-expect-error: Override Object.toString method for better type display
    this[Symbol.toStringTag] = 'EnumCollection';
    // Override the `instanceof` operator rule
    // @ts-expect-error: Override the instanceof operator
    this[Symbol.hasInstance] = (instance: any): boolean => {
      // intentionally use == to support both number and string format value
      return this.values.some(
        // eslint-disable-next-line eqeqeq
        (i) => instance == i.value || instance === i.key
      );
    };

    Object.freeze(this);
    Object.freeze(this.values);
    Object.freeze(this.keys);
  }

  key(value?: string | number) {
    return this.values.key(value);
  }
  label(keyOrValue?: string | number): string | undefined {
    return this.values.label(keyOrValue);
  }
  has(keyOrValue?: string | number) {
    return this.values.has(keyOrValue);
  }

  options(): EnumItemOptionData<K, V>[];
  options(
    config: OptionsConfig & BooleanFirstOptionConfig<V>
  ): EnumItemOptionData<K | '', V | ''>[];
  options<FK = never, FV = never>(
    config: OptionsConfig & ObjectFirstOptionConfig<FK, FV>
  ): EnumItemOptionData<K | (FK extends never ? FV : FK), V | (FV extends never ? V : FV)>[];
  options<FK = never, FV = never>(
    config?: OptionsConfig & (BooleanFirstOptionConfig<V> | ObjectFirstOptionConfig<FK, FV>)
  ): EnumItemOptionData<K | FK, V | FV>[] {
    // @ts-ignore: call the options method of values
    return this.values.options(config);
  }

  valuesEnum() {
    return this.values.valuesEnum();
  }

  menus(): MenuItemOption<V>[] {
    return this.values.menus();
  }

  filters(): ColumnFilterItem<V>[] {
    return this.values.filters();
  }

  raw(): T;
  raw(keyOrValue: V | K): T[K];
  raw(value: unknown): T[K] | undefined;
  raw(value?: any): T | T[K] | undefined {
    if (value !== undefined) {
      return this.values.raw(value);
    } else {
      return this.values.raw();
    }
  }

  get valueType() {
    return this.values.valueType;
  }
  get keyType() {
    return this.values.keyType;
  }
  get rawType() {
    return this.values.rawType;
  }
}

function parseEnumItem<
  T extends EnumItemInit<V>,
  K extends EnumKey<any>,
  V extends EnumValue,
  TT extends EnumInit<K, V>
>(
  init: T,
  key: K,
  options: {
    typeInit: TT;
    keys: (keyof TT)[];
  }
): StandardEnumItemInit<V> {
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
    return inferFromNull(key, options);
  }
  return { value, label };
}

function inferFromNull<K extends EnumKey<any>, V extends EnumValue, TT extends EnumInit<K, V>>(
  key: K,
  options: {
    typeInit: TT;
    keys: (keyof TT)[];
  }
) {
  const { typeInit, keys } = options;
  let value: V;
  const label: string = key as string;
  // If the value is empty, first check the number incrementing enumeration, otherwise use the key as the value
  const index = keys.indexOf(key);
  const prev = typeInit[keys[index - 1]];
  // Only pure number and empty enumeration will be incremented
  if (keys.some((k) => typeInit[k] != null && typeof typeInit[k] !== 'number')) {
    value = key as unknown as V;
  } else if (index === 0) {
    value = 0 as V;
  } else if (typeof prev === 'number') {
    value = (prev + 1) as V;
  } else {
    // only nulls
    let seed: number = 0;
    let count = 0;
    // find seed
    for (let i = index - 1; i >= 0; i--) {
      const val = typeInit[keys[i]];
      count++;
      if (typeof val === 'number') {
        seed = val;
        break;
      } else {
        // only nulls
        continue;
      }
    }
    value = (seed + count) as V;
  }
  return { value, label };
}
