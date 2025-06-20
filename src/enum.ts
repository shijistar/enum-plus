import { EnumCollectionClass, EnumExtensionClass } from './enum-collection';
import type {
  ArrayToMap,
  EnumInit,
  EnumInitOptions,
  EnumKey,
  EnumValue,
  IEnum,
  LabelOnlyEnumItemInit,
  ValueTypeFromSingleInit,
} from './types';
import { defaultLocalize } from './utils';

let enumExtensions: Record<string, unknown> | undefined;

/**
 * **EN:** Generate an enum collection, the enum value supports `number` and `string` types, and the
 * enum name supports localization solutions
 *
 * **CN:** 生成一个枚举集合，枚举值支持`number`和`string`类型，枚举名称支持本地化方案
 *
 * @example
 *   const Week = Enum({
 *     Sunday: { value: 0, label: 'Sunday' },
 *     Monday: { value: 1, label: 'Monday' },
 *   } as const);
 *
 * @param init the init object, see usage examples for the way to pass values | 初始化对象，传值方式参见使用示例
 *
 * @returns Enum collection | 枚举集合
 */
export function Enum<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
>(init: T, options?: EnumInitOptions<T, K, V>): IEnum<T, K, V> & EnumExtension<T, K, V>;
/**
 * **EN:** Generate an enum based on an object array
 *
 * **CN:** 基于对象数组生成枚举
 *
 * @example
 *   const Week = Enum([
 *     { value: 0, label: 'Sunday', key: 'Sun' },
 *     { value: 1, label: 'Monday', key: 'Mon' },
 *   ] as const);
 *
 * @param init Init objects array | 初始化对象数组
 * @param options Generate options | 生成选项
 *
 * @returns Enum collection | 枚举集合
 */
export function Enum<
  A extends Record<string, unknown>[] | readonly Record<string, unknown>[],
  K extends EnumKey<ArrayToMap<A>> = EnumKey<ArrayToMap<A>>,
  // @ts-expect-error: because no constraint on items of A, so ValueTypeFromSingleInit<ArrayToMap<A>[K], K> does not satisfy EnumValue
  V extends EnumValue = ValueTypeFromSingleInit<ArrayToMap<A>[K], K>,
  // @ts-expect-error: because no constraint on items of A, so ArrayToMap<A> does not satisfy EnumInit<K, V>
>(init: A, options?: EnumInitOptions<A[number], K, V>): IEnum<ArrayToMap<A>, K, V> & EnumExtension<ArrayToMap<A>, K, V>;
export function Enum<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
>(init: T | T[], options?: EnumInitOptions<T, K, V>): IEnum<T, K, V> & EnumExtension<T, K, V> {
  if (Array.isArray(init)) {
    const initMap = getInitMapFromArray<T, K, V>(init, options);
    // @ts-expect-error: because of typing extend in tests
    return new EnumCollectionClass<T, K, V>(initMap, options) as unknown as IEnum<T, K, V>;
  } else {
    // @ts-expect-error: because of typing extend in tests
    return new EnumCollectionClass<T, K, V>(init, options) as unknown as IEnum<T, K, V>;
  }
}

/**
 * **EN:** Global localization function, used to convert enum item text to localized text. Only need
 * to be set once, effective globally. This method need to be set at the project entry, before
 * running any Enum instance
 *
 * If you want to provide a custom localization function, be sure to resolve and localize the
 * following built-in resources:
 *
 * - `enum-plus.options.all` => `All`
 *
 * **CN:** 全局本地化函数，用于把枚举项文本转换为本地化文本。只需要设置一次，全局生效。需要在项目入口处设置，且在运行任何Enum实例之前
 *
 * 如果要提供自定义的本地化函数，请务必解析并本地化以下内置资源：
 *
 * - `enum-plus.options.all` => `All`
 */
Enum.localize = defaultLocalize;
/**
 * **EN:** Add global extension methods to the enum, and all enum instances will have these new
 * extension methods
 *
 * **CN:** 为枚举增加全局扩展方法，所有枚举实例都会具有这些新扩展方法
 *
 * @param obj Extension content, must be an object | 扩展内容，必须是一个对象
 */
Enum.extends = function (obj: Record<string, unknown> | undefined) {
  if (obj !== undefined && Object.prototype.toString.call(obj) !== '[object Object]') {
    throw new Error('The extension of Enum must be an object');
  }
  enumExtensions = obj !== undefined ? obj : {};
  Object.setPrototypeOf(EnumExtensionClass.prototype, enumExtensions);
};
function getInitMapFromArray<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
>(init: T[], options?: EnumInitOptions<T, K, V>) {
  const { getValue = 'value' as keyof T, getLabel = 'label' as keyof T, getKey = 'key' as keyof T } = options ?? {};
  return init.reduce((acc, item) => {
    const value = typeof getValue === 'function' ? getValue(item) : (item[getValue] as V);
    const label = typeof getLabel === 'function' ? getLabel(item) : item[getLabel];
    let key: K | undefined = undefined;
    if (getKey) {
      key = typeof getKey === 'function' ? (getKey(item) as K) : (item[getKey] as K);
    }
    acc[(key ?? value) as unknown as K] = {
      ...item,
      label: label || (key ?? '') || (value != null ? value.toString() : value),
      value,
    } as LabelOnlyEnumItemInit as T[K];
    return acc;
  }, {} as T);
}
