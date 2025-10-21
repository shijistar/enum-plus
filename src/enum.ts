import type { EnumExtension } from 'enum-plus/extension';
import { EnumCollectionClass, EnumExtensionClass } from './enum-collection';
import type { EnumItemClass, EnumItemOptions } from './enum-item';
import type { IEnumItems, InheritableEnumItems } from './enum-items';
import { internalConfig, localizer } from './global-config';
import type {
  ArrayToMap,
  EnumInit,
  EnumItemLabel,
  EnumKey,
  EnumValue,
  LocalizeInterface,
  ValueTypeFromSingleInit,
} from './types';
import type { ENUM_OPTIONS, ITEMS, KEYS, LABELS, META, NAMED, VALUES } from './utils';
import { IS_ENUM } from './utils';

/**
 * - **EN:** Create an enum collection
 * - **CN:** 创建一个枚举集合
 */
export const Enum = (<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const P = any,
  OP extends EnumInitOptions<T, K, V, P> = EnumInitOptions<T, K, V, P>,
>(
  init: T | T[],
  options?: OP
): IEnum<T, K, V, P, OP> & NativeEnumMembers<T, K, V> => {
  if (Array.isArray(init)) {
    const initMap = getInitMapFromArray<T, K, V, P>(init, options);
    return new EnumCollectionClass<T, K, V, P>(initMap, options) as unknown as NativeEnumMembers<T, K, V> &
      IEnum<T, K, V, P, OP>;
  } else {
    return new EnumCollectionClass<T, K, V, P>(init, options) as unknown as NativeEnumMembers<T, K, V> &
      IEnum<T, K, V, P, OP>;
  }
}) as EnumInterface;

/*
 * Get or set the global localization function.
 * Use defineProperty here to prevent circular dependencies.
 */
// Enum.config = {};
Object.defineProperty(Enum, 'config', {
  get: function () {
    return internalConfig;
  },
  enumerable: true,
  configurable: false,
});
Object.defineProperty(Enum, 'localize', {
  get: function () {
    return localizer.localize;
  },
  set: function (localize: LocalizeInterface) {
    localizer.localize = localize;
  },
  enumerable: true,
  configurable: false,
});

Enum.extends = function (obj: Record<string, unknown> | undefined) {
  if (obj !== undefined && Object.prototype.toString.call(obj) !== '[object Object]') {
    throw new Error('The extension of Enum must be an object');
  }
  Object.assign(EnumExtensionClass.prototype, obj);
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Enum.install = <T extends PluginFunc<any>>(plugin: T, options?: Parameters<T>[0]) => {
  plugin(options, Enum);
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Enum.isEnum = (value: unknown): value is IEnum<any, any, any, any> & NativeEnumMembers<any, any, any> => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Boolean(value && typeof value === 'object' && (value as any)[IS_ENUM] === true);
};

function getInitMapFromArray<
  const T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const P = any,
>(init: T[], options?: EnumInitOptions<T, K, V, P>) {
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
    } as unknown as T[K];
    return acc;
  }, {} as T);
}

export interface EnumInterface {
  /**
   * - **EN:** Generate an enum collection, the enum value supports `number` and `string` types. Enum
   *   names support localization schemes.
   * - **CN:** 生成一个枚举集合，枚举值支持`number`和`string`类型，枚举名称支持本地化方案
   *
   * @example
   *   const Week = Enum({
   *     Sunday: { value: 0, label: 'Sunday' },
   *     Monday: { value: 1, label: 'Monday' },
   *   });
   *
   * @template T The type of enum initialization | 枚举初始化的类型
   * @template K The type of enum keys | 枚举键的类型
   * @template V The type of enum values | 枚举值的类型
   *
   * @param raw the raw initialization object for the enum collection | 枚举集合的原始初始化对象
   * @param options the options for generating the enum collection | 生成枚举集合的选项
   *
   * @returns Enum collection | 枚举集合
   */
  // eslint-disable-next-line @typescript-eslint/prefer-function-type
  <
    const T extends EnumInit<K, V>,
    K extends EnumKey<T> = EnumKey<T>,
    V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const P = any,
    OP extends EnumInitOptions<T, K, V, P> = EnumInitOptions<T, K, V, P>,
  >(
    raw: T,
    options?: EnumInitOptions<T, K, V, P>
  ): IEnum<T, K, V, P, OP> & NativeEnumMembers<T, K, V>;

  /**
   * - **EN:** Generate an enum based on an array
   * - **CN:** 基于数组生成枚举
   *
   * @example
   *   const Week = Enum([
   *     { value: 0, label: 'Sunday', key: 'Sun' },
   *     { value: 1, label: 'Monday', key: 'Mon' },
   *   ]);
   *
   * @template A The type of the initialization object array | 初始化对象数组的类型
   * @template K The type of enum keys | 枚举键的类型
   * @template V The type of enum values | 枚举值的类型
   *
   * @param raw The initialization object array for the enum collection | 初始化对象数组
   * @param options The options for generating the enum collection | 生成枚举集合的选项
   *
   * @returns Enum collection | 枚举集合
   */
  <
    const A extends Record<string, unknown>[] | readonly Record<string, unknown>[],
    K extends EnumKey<ArrayToMap<A>> = EnumKey<ArrayToMap<A>>,
    // @ts-expect-error: because no constraint on items of A, so ValueTypeFromSingleInit<ArrayToMap<A>[K], K> does not satisfy EnumValue
    V extends EnumValue = ValueTypeFromSingleInit<ArrayToMap<A>[K], K>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const P = any,
    // @ts-expect-error: because no constraint on items of A, so ArrayToMap<A> does not satisfy EnumInit<K, V>
    OP extends EnumInitOptions<A[number], K, V, P> = EnumInitOptions<A[number], K, V, P>,
  >(
    init: A,
    options?: OP
    // @ts-expect-error: because no constraint on items of A, so ArrayToMap<A> does not satisfy EnumInit<K, V>
  ): IEnum<ArrayToMap<A>, K, V, OP> & NativeEnumMembers<A, K, V>;

  /**
   * - **EN:** Global configuration for Enum
   * - **CN:** 枚举的全局配置
   */
  config: {
    /**
     * - **EN:** Allow setting a label prefix for enum items, simplifying or even omitting the label
     *   definition of enum items. This option is only needed when internationalization is enabled.
     *   The prefix is set through `options.labelPrefix` when creating the Enum, which can be a
     *   string or an object.
     *
     *   - `true` - Enable automatic concatenation of enum item localeKey in `options.labelPrefix` +
     *       `label` format. `labelPrefix` only supports string in this case.
     *   - `Function` - Dynamically generate the localeKey for enum items. `labelPrefix` supports any
     *       type in this case.
     *   - `false` - Disable automatic label generation, completely relying on the `label` field defined
     *       in the enum item.
     * - **CN:** 允许为枚举项设置label前缀，简化甚至可以省略枚举项的label定义，只有当开启国际化时才需要此选项。创建Enum时通过 `options.labelPrefix`
     *   设置前缀，可以是字符串，也可以是一个对象。
     *
     *   - `true` - 启用自动拼接，`options.labelPrefix` + `label` 自动拼接生成标签，这种情况下 `labelPrefix` 只支持字符串形式
     *   - `Function` - 动态生成枚举项localeKey，这种情况下 `labelPrefix` 支持任意类型
     *   - `false` - 禁用自动生成标签，完全依赖枚举项中定义的 `label` 字段
     */
    autoLabel?:
      | boolean
      | ((options: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          item: EnumItemClass<any, string, any, any>;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          labelPrefix: any;
        }) => string);
  };

  /**
   * - **EN:** Convert resource key to localized text
   *
   * > Depending on different environments or technology frameworks, the return value may be of a type
   * > other than a string, such as a component to support dynamic language switching, and the `label`
   * > of the enum item will change accordingly.
   *
   * - **CN:** 把资源键值转化为本地化文本。
   *
   * > 根据不同的环境或技术框架，返回值可能是字符串以外类型，例如可能是一个组件以支持动态语言切换，而枚举项的`label`也会随之变化。
   */
  localize: LocalizeInterface | undefined;

  /**
   * - **EN:** Check if the value is an Enum collection
   * - **CN:** 检查值是否是枚举集合的实例
   *
   * @param value -
   *
   *   - **EN:** Check if the value is an instance of the Enum collection
   *   - **CN:** 检查值是否是枚举集合的实例
   *
   * @returns `true` if the value is an Enum collection, otherwise `false` |
   *   如果值是枚举集合，则返回`true`，否则返回`false`
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isEnum(value: unknown): value is IEnum<any, any, any, any, any> & NativeEnumMembers<any, any, any>;
  /**
   * - **EN:** Add global extension methods to the enum, and all enum instances will have these new
   *   extension methods
   * - **CN:** 为枚举增加全局扩展方法，所有枚举实例都会具有这些新扩展方法
   *
   * @param obj Extension content, must be an object | 扩展内容，必须是一个对象
   */
  extends: (
    obj: Record<string, (this: ReturnType<EnumInterface>, ...args: any[]) => unknown> | Record<string, unknown>
  ) => void;
  /**
   * - **EN:** Install a plugin that enhances the functionality of the Enum class by adding new
   *   methods or properties.
   * - **CN:** 安装一个插件，通过添加新的方法或属性来增强Enum类的功能
   *
   * @param plugin The plugin to install | 要安装的插件
   * @param options The options for the plugin | 插件的选项
   */
  install: <T = unknown>(plugin: PluginFunc<T>, options?: T) => void;
}

/**
 * - **EN:** Represents an enumeration collection, which includes all the items in the enumeration and
 *   provides methods to access them.
 * - **CN:** 表示一个枚举集合，包含了枚举中的所有项，并提供访问它们的方法。
 */
export interface IEnum<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  P = any,
  OP extends EnumInitOptions<T, K, V, P> = EnumInitOptions<T, K, V, P>,
> extends InheritableEnumItems<T, K, V, P>,
    EnumExtension<T, K, V> {
  /**
   * - **EN:** A boolean value indicates that this is an Enum.
   * - **CN:** 布尔值，表示这是一个枚举类
   */
  // this flag exists but is removed from interface, as it's replaced with isEnum method
  // [IS_ENUM]: true;
  /** - */
  [ENUM_OPTIONS]?: OP;
  /**
   * - **EN:** Alias for the `items` array, when any enum key conflicts with `items`, you can access
   *   all enum items through this alias
   * - **CN:** `items`数组的别名，当任何枚举的key与`items`冲突时，可以通过此别名访问所有枚举项
   */
  readonly [ITEMS]: T extends { items: unknown } ? EnumItemClass<T[K], K, V, P>[] & IEnumItems<T, K, V, P> : never;
  /**
   * - **EN:** All items in the enumeration as an array
   *
   * > Only supports read-only methods in `ReadonlyArray<T>`, does not support push, pop, and any
   * > modification methods
   *
   * - **CN:** 所有枚举项的数组
   *
   * > 仅支持 `ReadonlyArray<T>` 中的只读方法，不支持push、pop等任何修改的方法
   */
  readonly items: T extends { items: unknown }
    ? ValueTypeFromSingleInit<T['items'], 'items', T[K] extends number | undefined ? number : 'items'>
    : EnumItemClass<T[K], K, V, P>[] & IEnumItems<T, K, V, P>;
  /**
   * - **EN:** Alias for the `keys` array, when any enum key conflicts with `keys`, you can access all
   *   enum keys through this alias
   * - **CN:** `keys`数组的别名，当任何枚举的key与`keys`冲突时，可以通过此别名访问所有枚举项的keys
   */
  readonly [KEYS]: T extends { keys: unknown } ? K[] : never;
  /**
   * - **EN:** Get all keys of the enumeration items as an array
   *
   * > Only supports read-only methods in `ReadonlyArray<T>`, does not support push, pop, and any
   * > modification methods
   *
   * - **CN:** 获取枚举项的全部keys列表
   *
   * > 仅支持 `ReadonlyArray<T>` 中的只读方法，不支持push、pop等任何修改的方法
   */
  readonly keys: T extends { keys: unknown }
    ? ValueTypeFromSingleInit<T['keys'], 'keys', T[K] extends number | undefined ? number : 'keys'>
    : K[];
  /**
   * - **EN:** Alias for the `values` array, when any enum key conflicts with `values`, you can access
   *   all enum values through this alias
   * - **CN:** `values`数组的别名，当任何枚举的key与`values`冲突时，可以通过此别名访问所有枚举项的values
   */
  readonly [VALUES]: T extends { values: unknown } ? V[] : never;
  /**
   * - **EN:** Get all values of the enumeration items as an array
   *
   * > Only supports read-only methods in `ReadonlyArray<T>`, does not support push, pop, and any
   * > modification methods
   *
   * - **CN:** 获取枚举项的全部values列表
   *
   * > 仅支持 `ReadonlyArray<T>` 中的只读方法，不支持push、pop等任何修改的方法
   */
  readonly values: T extends { values: unknown }
    ? ValueTypeFromSingleInit<T['values'], 'values', T[K] extends number | undefined ? number : 'values'>
    : V[];
  /**
   * - **EN:** Alias for the `labels` array, when any enum key conflicts with `labels`, you can access
   *   all enum labels through this alias
   * - **CN:** `labels`数组的别名，当任何枚举的key与`labels`冲突时，可以通过此别名访问所有枚举项的labels
   */
  readonly [LABELS]: T extends { labels: unknown } ? string[] : never;
  /**
   * - **EN:** Get all labels of the enumeration items as an array
   *
   * > Only supports read-only methods in `ReadonlyArray<T>`, does not support push, pop, and any
   * > modification methods
   *
   * - **CN:** 获取枚举项的全部labels列表
   *
   * > 仅支持 `ReadonlyArray<T>` 中的只读方法，不支持push、pop等任何修改的方法
   */
  readonly labels: T extends { labels: unknown }
    ? ValueTypeFromSingleInit<T['labels'], 'labels', T[K] extends number | undefined ? number : 'labels'>
    : string[];
  /**
   * - **EN:** Alias for the `named` array, when any enum key conflicts with `named`, you can access
   *   all enum names through this alias
   * - **CN:** `named`数组的别名，当任何枚举的key与`named`冲突时，可以通过此别名访问所有枚举项的names
   */
  readonly [NAMED]: T extends { named: unknown } ? IEnumItems<T, K, V, P>['named'] : never;
  /**
   * - **EN:** Get all names of the enumeration items as an array
   *
   * > Only supports read-only methods in `ReadonlyArray<T>`, does not support push, pop, and any
   * > modification methods
   */
  readonly named: T extends { named: unknown }
    ? ValueTypeFromSingleInit<T['named'], 'named', T[K] extends number | undefined ? number : 'named'>
    : IEnumItems<T, K, V, P>['named'];
  /**
   * - **EN:** Alias for the `meta` array, when any enum key conflicts with `meta`, you can access all
   *   enum meta information through this alias
   * - **CN:** `meta`数组的别名，当任何枚举的key与`meta`冲突时，可以通过此别名访问所有枚举项的meta信息
   */
  readonly [META]: T extends { meta: unknown } ? IEnumItems<T, K, V, P>['meta'] : never;
  /**
   * - **EN:** Get all meta information of the enumeration items as an array
   *
   * > Only supports read-only methods in `ReadonlyArray<T>`, does not support push, pop, and any
   * > modification methods
   *
   * - **CN:** 获取枚举项的全部meta信息列表
   *
   * > 仅支持 `ReadonlyArray<T>` 中的只读方法，不支持push、pop等任何修改的方法
   */
  readonly meta: T extends { meta: unknown }
    ? ValueTypeFromSingleInit<T['meta'], 'meta', T[K] extends number | undefined ? number : 'meta'>
    : IEnumItems<T, K, V, P>['meta'];
}

export type NativeEnumMembers<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
> = {
  // Add enum item values, just like native enums
  [key in K]: ValueTypeFromSingleInit<T[key], key, T[K] extends number | undefined ? number : key>;
};

/**
 * - **EN:** Enum initialization options
 * - **CN:** 枚举初始化选项
 */
export interface EnumInitOptions<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  P = any,
> extends EnumItemOptions<T[K], K, V, P> {
  /**
   * - **EN:** Set the display name of the enum collection, supports string or localized resource key
   * - **CN:** 设置枚举集合的显示名称，支持字符串或本地化资源的键名
   */
  name?: EnumItemLabel;
  /**
   * - **EN:** The name of the field in the enumeration item that stores the value, or the function to
   *   get the key value, default is `value`. This option is only effective when initializing the
   *   enum through an array.
   * - **CN:** 枚举项的value字段名，或者获取key值的函数，默认为 `value`。此选项只有在通过数组初始化枚举时才有效。
   */
  getValue?: keyof T | ((item: T) => V);
  /**
   * - **EN:** The name of the field in the enumeration item that stores the label, or the function to
   *   get the key value, default is `label`. This option is only effective when initializing the
   *   enum through an array.
   * - **CN:** 枚举项的label字段名，或者获取key值的函数，默认为 `label`。此选项只有在通过数组初始化枚举时才有效。
   */
  getLabel?: keyof T | ((item: T) => string);
  /**
   * - **EN:** The name of the field in the enumeration item that stores the key, or the function to
   *   get the key value, default is `key`. This option is only effective when initializing the enum
   *   through an array.
   * - **CN:** 枚举项的key字段名，或者获取key值的函数，默认为 `key`。此选项只有在通过数组初始化枚举时才有效。
   */
  getKey?: keyof T | ((item: T) => string);
}

/**
 * - **EN:** Represent the Enum plugin that enhances the functionality of the global Enum by adding
 *   new methods or properties.
 * - **CN:** 表示增强Enum类功能的插件，通过添加新方法或属性
 *
 * @param options The options for the plugin | 插件的选项
 * @param Enum The Enum global method | Enum全局方法
 */
export type PluginFunc<T = unknown> = (option: T | undefined, Enum: EnumInterface) => void;
