import { EnumCollectionClass, EnumExtensionClass } from './enum-collection';
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

export type {
  EnumInit,
  EnumItemInit,
  EnumKey,
  EnumValue,
  ValueTypeFromSingleInit,
  EnumOptionConfig,
  BuiltInResources,
  EnumItemOptionData,
  MenuItemOption,
  ColumnFilterItem,
  EnumInitOptions,
} from './types';

/**
 * **EN:** Alias of `values`. If the enum contains a field with the same name as `values`, you can
 * access it by this Symbol as the field name
 *
 * **CN:** 枚举`values`集合的别名。如果枚举中包含了`values`的同名字段，可以通过此Symbol作为字段名来访问
 */
export const VALUES = Symbol('[values]');

/**
 * **EN:** Alias of `items`. If the enum contains a field with the same name as `items`, you can
 * access it by this Symbol as the field name
 *
 * **CN:** 枚举`items`集合的别名。如果枚举中包含了`items`的同名字段，可以通过此Symbol作为字段名来访问
 */
export const ITEMS = Symbol('[items]');

/**
 * **EN:** Alias of `keys`. If the enum contains a field with the same name as `keys`, you can
 * access it by this Symbol as the field name
 *
 * **CN:** 枚举keys集合的别名。如果枚举中包含了`keys`的同名字段，可以通过此Symbol作为字段名来访问
 */
export const KEYS = Symbol('[keys]');

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
 *   ]);
 *
 * @param init Init objects array | 初始化对象数组
 * @param options Generate options | 生成选项
 *
 * @returns Enum collection | 枚举集合
 */
export function Enum<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, any>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
>(
  init: T[],
  options?: EnumInitOptions<T, K, V>
): IEnum<StandardEnumInit<string, V>, string, V> & EnumExtension<T, K, V>;
export function Enum<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
>(init: T | T[], options?: EnumInitOptions<T, K, V>): IEnum<T, K, V> & EnumExtension<T, K, V> {
  if (Array.isArray(init)) {
    const initMap = getInitMapFromArray<T, K, V>(init, options);
    return new EnumCollectionClass<T, K, V>(initMap, options) as unknown as IEnum<T, K, V>;
  } else {
    return new EnumCollectionClass<T, K, V>(init, options) as unknown as IEnum<T, K, V>;
  }
}

/**
 * **EN:** Default global localization function, only used to resolve built-in resources into
 * English, does not provide actual localization functions
 *
 * **CN:** 默认的全局本地化函数，仅用于将内置资源解析为英文，并不提供实际的本地化功能
 *
 * @summary
 *
 * - `enum-plus.options.all` => `All`
 */
export const defaultLocalize: NonNullable<EnumItemOptions['localize']> = (content) => {
  if (content === 'enum-plus.options.all') {
    return 'All';
  }
  return content;
};
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

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface EnumExtension<
    T extends EnumInit<K, V>,
    K extends EnumKey<T> = EnumKey<T>,
    V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
  > {}
}

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
