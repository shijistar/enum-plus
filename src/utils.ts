import type { EnumItemOptions } from './types';

/**
 * **EN:** Alias of `items`. If the enum contains a field with the same name as `items`, you can
 * access it by this Symbol as the field name
 *
 * **CN:** 枚举`items`集合的别名。如果枚举中包含了`items`的同名字段，可以通过此Symbol作为字段名来访问
 */
export const ITEMS = Symbol.for('[items]');

/**
 * **EN:** Alias of `keys`. If the enum contains a field with the same name as `keys`, you can
 * access it by this Symbol as the field name
 *
 * **CN:** 枚举keys集合的别名。如果枚举中包含了`keys`的同名字段，可以通过此Symbol作为字段名来访问
 */
export const KEYS = Symbol.for('[keys]');

/**
 * **EN:** Check whether the object is an instance of `EnumItem`. If the object has this field and
 * its value is `true`, it is an `EnumItem` instance.
 *
 * **CN:** 判断对象是否 `EnumItem` 实例，如果对象存在此字段且值为`true`，则是 `EnumItem` 实例
 */
export const ENUM_ITEM = Symbol.for('[EnumItem]');

/**
 * **EN:** Check whether the object is an instance of `EnumCollection`. If the object has this field
 * and its value is `true`, it is an `EnumCollection` instance.
 *
 * **CN:** 判断对象是否 `EnumCollection` 实例，如果对象存在此字段且值为`true`，则是 `EnumCollection` 实例
 */
export const ENUM_COLLECTION = Symbol.for('[EnumCollection]');

/**
 * **EN:** Check whether the object is an instance of `EnumItems`. If the object has this field and
 * its value is `true`, it is an `EnumItems` instance.
 *
 * **CN:** 判断对象是否 `EnumItems` 实例，如果对象存在此字段且值为`true`，则是 `EnumItems` 实例
 */
export const ENUM_ITEMS = Symbol.for('[EnumItems]');

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
