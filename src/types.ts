import type { KEYS, VALUES } from './index';
import type { EnumItemClass } from './enum-item';

/**
 * 数组的类型声明
 *
 * 本来可以直接使用`EnumClass`, 但是TS不允许`class`中自定义索引访问器，只能使用`type`
 */
export type IEnum<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>
> = IEnumValues<T, K, V> & {
  // 初始化对象里的枚举字段
  [key in K]: ValueTypeFromSingleInit<T[key], key>;
} & (T extends { values: unknown }
    ? {
        // 防止values名称冲突
        [VALUES]: EnumItemClass<T[K], K, V>[] & IEnumValues<T, K, V>;
      }
    : {
        /**
         * 所有枚举项的数组，可以直接作为AntDesign组件的数据源
         *
         * 仅支持 ReadonlyArray<T> 中的只读方法，不支持push、pop等任何修改的方法
         */
        values: EnumItemClass<T[K], K, V>[] & IEnumValues<T, K, V>;
      }) &
  (T extends { keys: any }
    ? {
        // 防止keys名称冲突
        [KEYS]: K[];
      }
    : {
        /**
         * 获取枚举项的key列表
         *
         * 常在typescript作为类型声明使用，例如： `type Props = { week: typeof Week['keys'] }`
         */
        keys: K[];
      });
/**
 * 枚举项集合接口，不包含从数组集成的成员
 *
 * @export
 * @interface IEnumValues
 * @template T 枚举集合初始化数据的类型
 */
export interface IEnumValues<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>
> {
  /**
   * 获取某个枚举项的label显示名称
   * @param value 枚举项的value或key
   * @returns {string | undefined} 枚举项的label显示名称
   */
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  label(keyOrValue?: string | number): string | undefined;

  /**
   * 获取某个枚举项对应的key
   */
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  key(value?: string | number): K | undefined;

  /**
   * 判断某个枚举项是否存在
   * @param keyOrValue 枚举项的key或value
   */
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  has(keyOrValue?: string | number): boolean;

  /**
   * 生成符合antd规范的下拉数据源数组，可以直接传给Select、Radio、Checkbox等组件的`options`
   */
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  options(): EnumOption<K, V>[];
  /**
   * 生成符合antd规范的下拉数据源数组，可以直接传给Select、Radio、Checkbox等组件的`options`
   *
   * @param config 自定义选项
   */
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  options<B extends boolean>(
    config: OptionsConfig & BooleanFirstOptionConfig<B>
  ): EnumOption<K | '', V | ''>[];
  /**
   * 生成符合antd规范的下拉数据源数组，可以直接传给Select、Radio、Checkbox等组件的`options`
   *
   * @param config 自定义选项
   */
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  options<FK = never, FV = never>(
    config: OptionsConfig & ObjectFirstOptionConfig<FK, FV>
    // todo: (FK extends never ? FV : FK) 这里FV不起作用。
    /*
      测试用例：
      directoryTypes.options({
        firstOption: { value: 1, label: '目录类型' },
      } as const)
     */
  ): EnumOption<K | (FK extends never ? FV : FK), V | (FV extends never ? V : FV)>[];

  /**
   * 生成一个符合AntDesignPro规范的枚举集合对象。
   *
   * 数据结构为：
   *
   * @example
   * // 对象的`key`为枚举项的值，`value`为枚举项的label名称
   * {
   *   0: { text: "星期日" },
   *   1: { text: "星期一" },
   * };
   *
   * @see https://procomponents.ant.design/components/schema#valueenum-1
   * @see https://procomponents.ant.design/components/field-set#proformselect
   */
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  valuesEnum(): Record<V, { text: string }>;

  /**
   * 生成一个filters数组，可以直接传递给AntDesign Table组件Column的filters属性，作为列的筛选项
   *
   * 数据结构为：
   *
   * @example
   * [
   *  { value: 0, text: "星期日" },
   *  { value: 1, text: "星期一" },
   * ]
   *
   * @see https://ant.design/components/table-cn#components-table-demo-head
   * @see https://ant.design/components/table-cn#column
   */
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  filters(): ColumnFilterItem<V>[];

  /**
   * 获取枚举集合的初始化对象
   * @return {T} 初始化对象集合
   * @memberof IEnumValues
   */
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  raw(): T;
  /**
   * 获取某个枚举项的原始初始化对象。如果在枚举项上增加了自定义字段的话，可以用这种方式获取到。
   * @param keyOrValue 枚举key或value
   */
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  raw(keyOrValue: V | K): T[K];
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  raw(value: unknown): T[K] | undefined;

  /**
   * 所有枚举值的数据类型
   *
   * 📣 注意：仅可作为类型声明使用，不可在运行时调用
   *
   * @example
   *
   * // 声明变量的类型
   * const week: typeof Week.valueType = Week.Monday; // 0
   *
   * // 声明类型字段
   * type Props = {
   *   week: typeof Week.valueType // 0 | 1
   * };
   * // 使用valueType类型可以更准确的限定取值范围，比使用number、string这种宽泛的数据类型更好
   */
  valueType: V;

  /**
   * 所有枚举key的数据类型
   *
   * 📣 注意：仅可作为类型声明使用，不可在运行时调用
   *
   * @example
   *
   * // 声明变量的类型
   * const weekName: typeof Week.keyType = "Sunday"; // "Sunday" | "Monday"
   *
   * // 声明类型字段
   * type Props = {
   *   weekName: typeof Week.keyType // "Sunday" | "Monday"
   * };
   * // 使用keyType类型可以更准确的限定取值范围，比使用string这种宽泛的数据类型更好
   */
  keyType: K;
}

export type EnumInit<K extends keyof any = string, V extends EnumValue = EnumValue> =
  | NumberEnumInit<K>
  | StringEnumInit<K>
  | StandardEnumInit<K, V>
  | ValueOnlyEnumInit<K, V>
  | LabelOnlyEnumInit<K>
  | CompactEnumInit<K>
  | OmitEnumInit<K>;
export type NumberEnumInit<K extends keyof any> = Record<K, number>;
export type StringEnumInit<K extends keyof any> = Record<K, string>;
export type StandardEnumInit<K extends keyof any, V extends EnumValue> = Record<
  K,
  StandardEnumItemInit<V>
>;
export type ValueOnlyEnumInit<K extends keyof any, V extends EnumValue> = Record<
  K,
  ValueOnlyEnumItemInit<V>
>;
export type LabelOnlyEnumInit<K extends keyof any> = Record<K, LabelOnlyEnumItemInit>;
export type CompactEnumInit<K extends keyof any> = Record<K, CompactEnumItemInit>;
export type OmitEnumInit<K extends keyof any> = Record<K, undefined>;

export type EnumItemInit<V extends EnumValue = EnumValue> =
  | EnumValue
  | StandardEnumItemInit<V>
  | ValueOnlyEnumItemInit<V>
  | LabelOnlyEnumItemInit
  | CompactEnumItemInit
  | undefined;
export type StandardEnumItemInit<V extends EnumValue> = {
  value: V;
  label: string;
};
export type ValueOnlyEnumItemInit<V extends EnumValue> = {
  value: V;
};
export type LabelOnlyEnumItemInit = {
  label: string;
};
export type CompactEnumItemInit = Record<string, never>; // 等价于{}

/**
 * 由枚举项生成的作为Select组件数据源的数据结构
 */
export type EnumOption<K, V> = {
  /**
   * 选项的值
   */
  value: V;
  /**
   * 选项的显示文本
   */
  label: string;
  /**
   * 选项的key，默认使用`value`
   */
  key: K;
};

/**
 * Table列筛选项的数据结构
 */
export type ColumnFilterItem<V> = {
  /**
   * 显示文本
   */
  text: string;
  /**
   * 值
   */
  value: V;
};

/**
 * 枚举值的类型，支持number、string、symbol
 */
export type EnumValue = keyof any;

/**
 * 获取枚举初始化对象中key的类型
 */
export type EnumKey<T> = keyof T;

/**
 * options方法的更多选项
 */
export type OptionsConfig = object;

export type BooleanFirstOptionConfig<B extends boolean> = {
  /**
   * 在头部添加一个默认选项。
   *
   * 如果为`true`，则选项使用默认值，`value`为`''`，`label`为`'全部'`；
   * 如果为`false`，则不添加默认选项；
   *
   * @default false
   */
  firstOption?: B;
};

export type ObjectFirstOptionConfig<K, V> = {
  /**
   * 首行选项的配置
   */
  firstOption?: EnumOptionConfig<K, V>;
};

export type EnumOptionConfig<K, V> = Omit<EnumOption<K, V>, 'key'> &
  Partial<Pick<EnumOption<K, V>, 'key'>>;

/**
 * 从枚举集合或枚举项的初始化对象推断value类型
 */
// export type ValueType<T> = ValueTypeFromSingleInit<T> extends never
//   ? ValueTypeFromEnumInit<T>
//   : ValueTypeFromSingleInit<T>;

/**
 * 从枚举项的初始化对象推断value类型
 */
export type ValueTypeFromSingleInit<T, FB = string> = T extends EnumValue // literal类型
  ? T
  : T extends StandardEnumItemInit<infer V> // {value, label}类型
  ? V
  : T extends ValueOnlyEnumItemInit<infer V> // {value}类型
  ? V
  : T extends LabelOnlyEnumItemInit // {label}类型
  ? FB
  : T extends CompactEnumItemInit // {}类型
  ? FB
  : T extends undefined // undefined类型
  ? FB
  : never;

/**
 * 从枚举集合初始化对象推断value类型
 */
export type ValueTypeFromEnumInit<
  T,
  K extends EnumKey<T> = EnumKey<T>
> = T extends NumberEnumInit<K> // 格式：{ foo:1, bar:2 }
  ? number
  : T extends StringEnumInit<K> // 格式：{ foo:'foo', bar:'bar' }
  ? string
  : T extends StandardEnumInit<K, infer V> // 格式：{ foo:{value:1, label:'foo'}, bar:{value:2, label:'bar'} }
  ? V
  : T extends ValueOnlyEnumInit<K, infer V> // 格式：{ foo:{value:1}, bar:{value:2} }
  ? V
  : T extends LabelOnlyEnumInit<K> // 格式：{ foo:{label:'foo'}, bar:{label:'bar'} }
  ? K
  : T extends CompactEnumInit<K> // 格式：{ foo:{}, bar:{} }
  ? K
  : T extends OmitEnumInit<K> // 格式：{foo: undefined, bar: undefined}
  ? K
  : K; // 未知格式
