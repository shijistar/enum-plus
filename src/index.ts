import { EnumCollectionClass } from './enum-collection';
import type {
  EnumInit,
  EnumInitOptions,
  EnumItemOptions,
  EnumKey,
  EnumValue,
  IEnum,
  LabelOnlyEnumItemInit,
  StandardEnumInit,
  ValueTypeFromSingleInit,
} from './types';

export * from './types';

/**
 * EN: Alias of `values`. If the enum contains a field with the same name as `values`, you can access it by this Symbol as the field name
 *
 * CN: 枚举`values`集合的别名。如果枚举中包含了`values`的同名字段，可以通过此Symbol作为字段名来访问
 */
export const VALUES = Symbol('[values]');

/**
 * EN: Alias of `keys`. If the enum contains a field with the same name as `keys`, you can access it by this Symbol as the field name
 *
 * CN: 枚举keys集合的别名。如果枚举中包含了`keys`的同名字段，可以通过此Symbol作为字段名来访问
 */
export const KEYS = Symbol('[keys]');

/**
 * EN: Generate an enum collection, the enum value supports `number` and `string` types, and the enum name supports localization solutions
 *
 * CN: 生成一个枚举集合，枚举值支持`number`和`string`类型，枚举名称支持本地化方案
 *
 * @example
 * const Week = Enum({
 *   Sunday: { value: 0, label: 'Sunday' },
 *   Monday: { value: 1, label: 'Monday' }
 * } as const);
 *
 * @param init Enum item object, see usage examples for the way to pass values | 枚举项对象，传值方式参见使用示例
 * @returns Enum collection | 枚举集合
 */
export function Enum<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>
>(init: T): IEnum<T, K, V>;
/**
 * EN: Generate an enum based on the Map object
 *
 * CN: 基于Map对象生成枚举
 *
 * @param init map object, see usage examples for the way to pass values | map对象，传值方式参见使用示例
 * @returns Enum collection | 枚举集合
 */
export function Enum<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>
>(init: T, options: EnumInitOptions<T, K, V>): IEnum<T, K, V>;
/**
 * EN: Generate an enum based on an object array
 *
 * CN: 基于对象数组生成枚举
 *
 * @param init Enum item array | 枚举项数组
 */
export function Enum<
  T extends Record<string, any>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>
>(init: T[]): IEnum<StandardEnumInit<string, V>, string, V>;
/**
 * EN: Generate an enum based on an object array
 *
 * CN: 基于对象数组生成枚举
 *
 * @param init Enum item array | 枚举项数组
 * @param options Generate options | 生成选项
 */
export function Enum<
  T extends Record<string, any>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>
>(init: T[], options: EnumInitOptions<T, K, V>): IEnum<StandardEnumInit<string, V>, string, V>;
export function Enum<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>
>(init: T | T[], options?: EnumInitOptions<T, K, V>): IEnum<T, K, V> {
  if (Array.isArray(init)) {
    const initMap = getInitMapFromArray<T, K, V>(init, options);
    return new EnumCollectionClass<T, K, V>(initMap, options) as unknown as IEnum<T, K, V>;
  } else {
    return new EnumCollectionClass<T, K, V>(init, options) as unknown as IEnum<T, K, V>;
  }
}

/**
 * EN: Global localization function, used to convert enum item text to localized text. Only need to be set once, effective globally, need to be set at the project entry, before running any Enum instance
 *
 * CN: 全局本地化函数，用于把枚举项文本转换为本地化文本。只需要设置一次，全局生效，需要在项目入口处设置，在运行任何Enum实例之前
 * @param content Original text | 原始文本
 * @returns Localized text | 本地化文本
 */
Enum.localize = undefined as EnumItemOptions['localize'];

function getInitMapFromArray<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>
>(init: T[], options?: EnumInitOptions<T, K, V>) {
  const {
    getValue = 'value' as keyof T,
    getLabel = 'label' as keyof T,
    getKey = 'key' as keyof T,
  } = options ?? {};
  return init.reduce((acc, item) => {
    const value = typeof getValue === 'function' ? getValue(item) : (item[getValue] as V);
    const label = typeof getLabel === 'function' ? getLabel(item) : item[getLabel];
    let key: K | undefined = undefined;
    if (getKey) {
      key = typeof getKey === 'function' ? getKey(item) : (item[getKey] as K);
    }
    acc[(key ?? value) as unknown as K] = {
      ...item,
      label: label || (key ?? '') || (value != null ? value.toString() : value),
      value,
    } as LabelOnlyEnumItemInit as T[K];
    return acc;
  }, {} as T);
}
