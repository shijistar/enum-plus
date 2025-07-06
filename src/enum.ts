import { EnumCollectionClass, EnumExtensionClass } from './enum-collection';
import type { EnumItemClass } from './enum-item';
import { localizer } from './localize';
import type { LocalizeInterface } from './localize-interface';
import type {
  ArrayToMap,
  EnumInit,
  EnumInitOptions,
  EnumKey,
  EnumValue,
  IEnumItems,
  LabelOnlyEnumItemInit,
  ValueTypeFromSingleInit,
} from './types';
import type { ITEMS, KEYS, VALUES } from './utils';

let enumExtensions: Record<string, unknown> | undefined;

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
   *   } as const);
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
  <T extends EnumInit<K, V>, K extends EnumKey<T> = EnumKey<T>, V extends EnumValue = ValueTypeFromSingleInit<T[K], K>>(
    raw: T,
    options?: EnumInitOptions<T, K, V>
  ): IEnum<T, K, V>;

  /**
   * - **EN:** Generate an enum based on an array
   * - **CN:** 基于数组生成枚举
   *
   * @example
   *   const Week = Enum([
   *     { value: 0, label: 'Sunday', key: 'Sun' },
   *     { value: 1, label: 'Monday', key: 'Mon' },
   *   ] as const);
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
    A extends Record<string, unknown>[] | readonly Record<string, unknown>[],
    K extends EnumKey<ArrayToMap<A>> = EnumKey<ArrayToMap<A>>,
    // @ts-expect-error: because no constraint on items of A, so ValueTypeFromSingleInit<ArrayToMap<A>[K], K> does not satisfy EnumValue
    V extends EnumValue = ValueTypeFromSingleInit<ArrayToMap<A>[K], K>,
  >(
    init: A,
    // @ts-expect-error: because no constraint on items of A, so ArrayToMap<A> does not satisfy EnumInit<K, V>
    options?: EnumInitOptions<A[number], K, V>
    // @ts-expect-error: because no constraint on items of A, so ArrayToMap<A> does not satisfy EnumInit<K, V>
  ): IEnum<ArrayToMap<A>, K, V>;

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
   * **EN:** Add global extension methods to the enum, and all enum instances will have these new
   * extension methods
   *
   * **CN:** 为枚举增加全局扩展方法，所有枚举实例都会具有这些新扩展方法
   *
   * @param obj Extension content, must be an object | 扩展内容，必须是一个对象
   */
  extends: (obj: Record<string, unknown> | undefined) => void;
}

/**
 * **EN:** Enum collection interface
 *
 * Should directly use `EnumClass`, but TS does not allow custom index accessors in `class`, so you
 * can only use `type`
 *
 * **CN:** 数组的类型声明
 *
 * 本来可以直接使用`EnumClass`, 但是TS不允许`class`中自定义索引访问器，只能使用`type`
 */
export type IEnum<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
> = IEnumItems<T, K, V> &
  EnumExtension<T, K, V> & {
    // Add enum item values, just like native enums
    [key in K]: ValueTypeFromSingleInit<T[key], key, T[K] extends number | undefined ? number : key>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } & (T extends { items: any }
    ? {
        // Prevent conflict with `values` name
        readonly [ITEMS]: EnumItemClass<T[K], K, V>[] & IEnumItems<T, K, V>;
      }
    : {
        /**
         * **EN:** All enumeration items in the array, can be used directly as the data source of
         * the AntDesign component
         *
         * Only supports read-only methods in ReadonlyArray<T>, does not support push, pop, and any
         * modification methods
         *
         * **CN:** 所有枚举项的数组，可以直接作为AntDesign组件的数据源
         *
         * 仅支持 ReadonlyArray<T> 中的只读方法，不支持push、pop等任何修改的方法
         */
        readonly items: EnumItemClass<T[K], K, V>[] & IEnumItems<T, K, V>;
      }) &
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (T extends { values: any }
    ? {
        // Prevent conflict with `items` name
        readonly [VALUES]: EnumItemClass<T[K], K, V>[] & IEnumItems<T, K, V>;
      }
    : {
        /** @deprecated Use `items` instead */
        readonly values: EnumItemClass<T[K], K, V>[] & IEnumItems<T, K, V>;
      }) &
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (T extends { keys: any }
    ? {
        // 防止keys名称冲突
        readonly [KEYS]: K[];
      }
    : {
        /**
         * **EN:** Get the key list of the enumeration item
         *
         * Only supports read-only methods in ReadonlyArray<T>, does not support push, pop, and any
         * modification methods
         *
         * **CN:** 获取枚举项的key列表
         *
         * 常在typescript作为类型声明使用，例如： `type Props = { week: typeof Week['keys'] }`
         */
        readonly keys: K[];
      });

export const Enum = (<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
>(
  init: T | T[],
  options?: EnumInitOptions<T, K, V>
): IEnum<T, K, V> & EnumExtension<T, K, V> => {
  if (Array.isArray(init)) {
    const initMap = getInitMapFromArray<T, K, V>(init, options);
    return new EnumCollectionClass<T, K, V>(initMap, options) as unknown as IEnum<T, K, V>;
  } else {
    return new EnumCollectionClass<T, K, V>(init, options) as unknown as IEnum<T, K, V>;
  }
}) as EnumInterface;

/* 
  Get or set the global localization function.
  Use defineProperty here to prevent circular dependencies.
*/
Object.defineProperty(Enum, 'localize', {
  get: () => localizer.localize,
  set: (localize: LocalizeInterface) => {
    localizer.localize = localize;
  },
});

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
