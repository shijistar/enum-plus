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
  EnumOption,
  EnumValue,
  StandardEnumItemInit,
  ValueTypeFromSingleInit,
  ColumnFilterItem,
  EnumItemOptions,
  MenuItemOption,
} from './types';
import { EnumValuesArray } from './enum-values';

/**
 * 枚举类型
 *
 * @example
 *
 * const Week = new EnumCollectionClass({
 *   Sunday: 0,
 *   Monday: 1
 * } as const);
 *
 * const Week = new EnumCollectionClass({
 *   Sunday: { value: 0, label: "星期日" },
 *   Monday: { value: 1, label: "星期一" },
 * } as const);
 *
 * // Usage:
 *
 * import('./index.ts')
 *
 * 更多用法请参考 `Enum` 静态方法
 *
 * @export
 * @class EnumCollectionClass
 * @implements {IEnumValues<T, K, V>}
 * @template T 枚举集合初始化数据的类型
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
      // @ts-expect-error: 动态定义属性
      this[key] = value;
    });
    // @ts-expect-error: 如果init包含keys，则使用 KEYS 来避免命名冲突
    this[Object.keys(init).includes('keys') ? KEYS : 'keys'] = keys;

    // 构建枚举项数据
    const values = new EnumValuesArray<T, K, V>(
      init,
      ...keys.map((key, index) => {
        const { value, label } = parsed[index];
        return new EnumItemClass<T[K], K, V>(key, value, label, init[key], options).readonly();
      })
    );
    // @ts-expect-error: 如果init包含values，则使用 VALUES 来避免命名冲突
    this[Object.keys(init).includes('values') ? VALUES : 'values'] = values;

    // 重写一些系统方法，不写在type声明上是因为会在ts中多一个Symbol的字段，在开发时没必要看到
    // @ts-expect-error: 重写Object.toString方法，显示类型更友好
    this[Symbol.toStringTag] = 'EnumCollection';
    // 重写 `instanceof` 操作符规则
    // @ts-expect-error: 重写 instanceof 操作符，以识别枚举类型
    this[Symbol.hasInstance] = (instance: any): boolean => {
      // value故意使用 ==，支持数字和字符创格式的value
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

  options(): EnumOption<K, V>[];
  options(config: OptionsConfig & BooleanFirstOptionConfig<V>): EnumOption<K | '', V | ''>[];
  options<FK = never, FV = never>(
    config: OptionsConfig & ObjectFirstOptionConfig<FK, FV>
  ): EnumOption<K | (FK extends never ? FV : FK), V | (FV extends never ? V : FV)>[];
  options<FK = never, FV = never>(
    config?: OptionsConfig & (BooleanFirstOptionConfig<V> | ObjectFirstOptionConfig<FK, FV>)
  ): EnumOption<K | FK, V | FV>[] {
    // @ts-ignore: 调用values的options方法
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
      // EnumValue类型
      value = init as V;
      label = key as string;
    } else if (typeof init === 'object') {
      // 使用对象初始化
      if (Object.prototype.toString.call(init) === '[object Object]') {
        if ('value' in init /*TS assertion*/ && Object.keys(init).includes('value')) {
          // {value, label}类型
          value = init.value ?? key;
          if ('label' in init /*TS assertion*/ && Object.keys(init).includes('label')) {
            label = init.label;
          } else {
            label = key as string;
          }
        } else if ('label' in init /*TS assertion*/ && Object.keys(init).includes('label')) {
          // {label}类型
          value = key as unknown as V;
          label = init.label ?? key;
        } else {
          // {} 空对象
          value = key as unknown as V;
          label = key as string;
        }
      } else {
        // 可能是Date、RegExp等原始类型
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
  // 如果value是空，则先优先检查数字自增枚举，否则使用key作为value
  const index = keys.indexOf(key);
  const prev = typeInit[keys[index - 1]];
  // 只有纯数字和空的枚举才会自增
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
      if (typeof val === 'number') {
        seed = val;
        count++;
        break;
      } else {
        // only nulls
        count++;
        continue;
      }
    }
    value = (seed + count) as V;
  }
  return { value, label };
}
