import type { LocalizeInterface } from './localize-interface';

/**
 * - **EN:** Alias of `items`. If the enum contains a field with the same name as `items`, you can
 *   access it by this Symbol as the field name
 * - **CN:** 枚举`items`集合的别名。如果枚举中包含了`items`的同名字段，可以通过此Symbol作为字段名来访问
 */
export const ITEMS = Symbol.for('[items]');

/**
 * - **EN:** Alias of `keys`. If the enum contains a field with the same name as `keys`, you can
 *   access it by this Symbol as the field name
 * - **CN:** 枚举keys集合的别名。如果枚举中包含了`keys`的同名字段，可以通过此Symbol作为字段名来访问
 */
export const KEYS = Symbol.for('[keys]');

/**
 * - **EN:** Alias of `values`. If the enum contains a field with the same name as `values`, you can
 *   access it by this Symbol as the field name
 * - **CN:** 枚举values集合的别名。如果枚举中包含了`values`的同名字段，可以通过此Symbol作为字段名来访问
 */
export const VALUES = Symbol.for('[values]');

/**
 * - **EN:** Alias of `labels`. If the enum contains a field with the same name as `labels`, you can
 *   access it by this Symbol as the field name
 * - **CN:** 枚举labels集合的别名。如果枚举中包含了`labels`的同名字段，可以通过此Symbol作为字段名来访问
 */
export const LABELS = Symbol.for('[labels]');

/**
 * - **EN:** Alias of `raw`. If the enum contains a field with the same name as `raw`, you can access
 *   it by this Symbol as the field name
 * - **CN:** 枚举raw集合的别名。如果枚举中包含了`raw`的同名字段，可以通过此Symbol作为字段名来访问
 */
export const RAW = Symbol.for('[raw]');

export const ENUM_OPTIONS = Symbol.for('[EnumOptions]');

/**
 * - **EN:** Alias of `meta`. If the enum contains a field with the same name as `meta`, you can
 *   access it by this Symbol as the field name
 * - **CN:** 枚举`meta`集合的别名。如果枚举中包含了`meta`的同名字段，可以通过此Symbol作为字段名来访问
 */
export const META = Symbol.for('[meta]');

/**
 * - **EN:** Alias of `named`. If the enum contains a field with the same name as `named`, you can
 *   access it by this Symbol as the field name
 * - **CN:** 枚举`named`集合的别名。如果枚举中包含了`named`的同名字段，可以通过此Symbol作为字段名来访问
 */
export const NAMED = Symbol.for('[named]');

/**
 * - **CN:** 判断对象是否 `EnumItem` 实例
 * - **EN:** Check whether the object is an `EnumItem` instance
 */
export const IS_ENUM_ITEM = Symbol.for('[IsEnumItem]');

/**
 * - **EN:** Check whether the object is an enum type
 * - **CN:** 判断对象是否枚举类型
 */
export const IS_ENUM = Symbol.for('[IsEnum]');

/**
 * - **EN:** Check whether the object is an `EnumItems` collection array
 * - **CN:** 判断对象是否 `EnumItems` 集合数组
 */
export const IS_ENUM_ITEMS = Symbol.for('[IsEnumItems]');

/**
 * - **EN:** Default global localization function, only used to resolve built-in resources into
 *   English, does not provide actual localization functions
 * - **CN:** 默认的全局本地化函数，仅用于将内置资源解析为英文，并不提供实际的本地化功能
 */
export const defaultLocalize: LocalizeInterface = (content) => {
  return content;
};
