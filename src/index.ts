import { EnumCollectionClass } from './enum-collection';
import type {
  EnumInit,
  EnumKey,
  EnumValue,
  IEnum,
  LabelOnlyEnumItemInit,
  StandardEnumInit,
  ValueTypeFromSingleInit,
} from './types';

export * from './types';

/**
 * 枚举values集合的访问Symbol，一般情况下使用不到
 *
 * 如果枚举项中包含 `values` 保留字的话，会把枚举值集合字段给冲掉，可以通过此Symbol来访问
 */
export const VALUES = Symbol('[values]');

/**
 * 枚举keys集合的访问Symbol，一般情况下使用不到
 *
 * 如果枚举项中包含 `keys` 保留字的话，会把枚举值集合字段给冲掉，可以通过此Symbol来访问
 */
export const KEYS = Symbol('[keys]');

/**
 * 生成一个枚举集合，枚举值仅支持 `number` 和 `string` 两种类型。
 *
 * @example
 * // 示例1：number类型
 * const Week = Enum({
 *   Sunday: 0,
 *   Monday: 1
 * } as const);
 *
 * // 示例2：string类型
 * const Week = Enum({
 *   Sunday: "Sunday",
 *   Monday: "Monday"
 * } as const);
 *
 * // 示例3（标准写法，推荐）：扩展label显示文本
 * const Week = Enum({
 *   Sunday: { value: 0, label: '星期日' },
 *   Monday: { value: 1, label: '星期一' }
 * } as const);
 *
 * // 示例4（推荐）：省略label，value的默认值为key
 * const Week = Enum({
 *   Sunday: { label: '星期日' }, // 等价于 { value: "Sunday", label: '星期日' }
 *   Monday: { label: '星期一' } // 等价于 { value: "Monday", label: '星期一' }
 * } as const);
 *
 * // 示例5：与示例2等价，value的默认值为key
 * const Week = Enum({
 *   Sunday: undefined, // 等价于 { value: "Sunday" }
 *   Monday: undefined // 等价于 { value: "Sunday" }
 * } as const);
 *
 *
 * // 示例6：扩展自定义字段
 * const Week = Enum({
 *   Sunday: { value: 0, label: '星期日', active: true, disabled: false },
 *   Monday: { value: 0, label: '星期日', active: false, disabled: true }
 * } as const);
 * // Week.raw('Sunday').active // true
 * // Week.raw('Monday').disabled // true
 *
 * // Usage:
 *
 * // 直接作为Select的数据源
 * <Select options={Week.values} />
 * // 在头部增加默认选项（默认文本为'全部'，value为''）
 * <Select options={Week.options({ firstOption: true })} />
 * // 在头部增加自定义选项
 * <Select options={Week.options({ firstOption: { value: 0, label: '不限' } as const })} />
 *
 * // 使用AntDesignPro
 * <ProFormSelect valueEnum={Week.valuesEnum()} />
 *
 * // 支持所有数组遍历，但不支持任何形式的修改
 * Week.values.length; // 2
 * Week.values.map((item) => item.value); // [0, 1]，可遍历
 * Week.values.forEach(item => { }); // 可遍历
 * for (let item of Week.values) { } // 可遍历
 * Week.values.push({ value: 2, label: '星期二' }); // ❌ 不可修改
 * Week.values[0].label = "foo"; // ❌ 不可修改
 *
 * // 获取第一个枚举项的值
 * Week.values[0].value // 0
 *
 * // 判断某个值是否有效？
 * Week.values.some(item => item.value === 1); // true
 * if(1 instance of Week) // true，更简单的用法
 *
 * // instanceof 判断
 * 1 instance of Week // true
 * "1" instance of Week // true
 * "Monday" instance of Week // true
 *
 * // 获取某个值的显示文本
 * Week.label(1); // 星期一，
 * Week.label(Week.Monday); // 星期一
 * Week.label('Monday'); // 星期一
 *
 * // 获取某个枚举项的key
 * Week.key(1); // 'Monday'
 * Week.key(Week.Monday); // 'Monday'
 * Week.key(9); // undefined
 *
 * // 两个枚举合并（或者扩展某个枚举）
 * const myWeek = Enum({
 *  ...Week.raw(),
 *  Friday: 5,
 *  Saturday: 6,
 * };
 *
 * // 给枚举字段声明类型，【强烈建议】
 * type Props = {
 *   week: typeof Week.valueType // 0 | 1
 *   weekName: typeof Week.keyType // 'Sunday' | 'Monday'
 * };
 * // 使用valueType类型可以更准确的限定取值范围，比使用number、string这种宽泛的数据类型更好
 *
 * // 😟命名冲突？
 * // 如果Week的key、label、options方法与某个枚举的key重名了，则这些方法会被覆盖掉，
 * // 不用担心，在 `Week.values` 下仍然可以访问到这些方法
 *
 * @param init 枚举项对象，传值方式参见使用示例
 * @returns 枚举集合
 */
export function Enum<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>
  // eslint-disable-next-line @typescript-eslint/ban-types
>(init: T): IEnum<T, K, V> & Object;
/**
 * 从数组构造枚举集合
 * @param init 枚举项数组
 * @param getValue 枚举项的value字段名，或者获取key值的函数
 * @param getLabel 枚举项的label字段名，或者获取key值的函数
 * @param getKey 枚举项的key字段名，或者获取key值的函数
 */
export function Enum<
  T extends Record<string, any>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>
>(
  init: T[],
  getValue?: keyof T | ((item: T) => V),
  getLabel?: keyof T | ((item: T) => string),
  getKey?: keyof T | ((item: T) => string)
): IEnum<StandardEnumInit<string, V>, string, V>;
export function Enum<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>
>(
  init: T | T[],
  getValue: keyof T | ((item: T) => V) = 'value' as keyof T,
  getLabel: keyof T | ((item: T) => string) = 'label' as keyof T,
  getKey: keyof T | ((item: T) => K) = 'key' as keyof T
): IEnum<T, K, V> {
  if (Array.isArray(init)) {
    const initMap = init.reduce((acc, item) => {
      const value = typeof getValue === 'function' ? (getValue(item) as V) : (item[getValue] as V);
      const label = typeof getLabel === 'function' ? getLabel(item) : item[getLabel];
      const key = getKey
        ? typeof getKey === 'function'
          ? (getKey(item) as K)
          : (item[getKey] as K)
        : undefined;
      acc[(key || value) as unknown as K] = {
        label: label || key || (value != null ? value.toString() : value),
        value,
      } as LabelOnlyEnumItemInit as T[K];
      return acc;
    }, {} as T);
    return new EnumCollectionClass<T, K, V>(initMap) as unknown as IEnum<T, K, V>;
  } else {
    return new EnumCollectionClass<T, K, V>(init) as unknown as IEnum<T, K, V>;
  }
}
