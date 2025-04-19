import type { EnumItemOptions } from './types';

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
