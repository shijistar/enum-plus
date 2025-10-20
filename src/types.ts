import type { EnumLocaleExtends } from 'enum-plus/extension';

export type { LocalizeInterface } from './localize-interface';

// @ts-expect-error: because LocaleKeys is a user-defined type, so ignore the error here
export type EnumItemLabel = EnumLocaleExtends['LocaleKeys'] & NonNullable<string>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EnumInit<K extends keyof any = string, V extends EnumValue = EnumValue> =
  | NumberEnumInit<K>
  | StringEnumInit<K>
  | StringNumberEnumInit<K>
  | BooleanEnumInit<K>
  | DateEnumInit<K>
  | RegExpEnumInit<K>
  | StandardEnumInit<K, V>
  | ValueOnlyEnumInit<K, V>
  | LabelOnlyEnumInit<K>
  | CompactEnumInit<K>
  | OmitEnumInit<K>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NumberEnumInit<K extends keyof any> = Record<K, number>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StringEnumInit<K extends keyof any> = Record<K, string>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StringNumberEnumInit<K extends keyof any> = Record<K, string | number>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BooleanEnumInit<K extends keyof any> = Record<K, boolean>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DateEnumInit<K extends keyof any> = Record<K, Date>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RegExpEnumInit<K extends keyof any> = Record<K, RegExp>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StandardEnumInit<K extends keyof any, V extends EnumValue> = Record<K, StandardEnumItemInit<V>>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ValueOnlyEnumInit<K extends keyof any, V extends EnumValue> = Record<K, ValueOnlyEnumItemInit<V>>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LabelOnlyEnumInit<K extends keyof any> = Record<K, LabelOnlyEnumItemInit>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CompactEnumInit<K extends keyof any> = Record<K, CompactEnumItemInit>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type OmitEnumInit<K extends keyof any> = Record<K, undefined>;

export type EnumItemInit<V extends EnumValue = EnumValue> =
  | EnumValue
  | StandardEnumItemInit<V>
  | ValueOnlyEnumItemInit<V>
  | LabelOnlyEnumItemInit
  | CompactEnumItemInit
  | undefined;
export interface StandardEnumItemInit<V extends EnumValue> {
  value: V;
  label: EnumItemLabel;
}
export interface ValueOnlyEnumItemInit<V extends EnumValue> {
  value: V;
  label?: never;
}
export interface LabelOnlyEnumItemInit {
  label: EnumItemLabel;
  value?: never;
}
export type CompactEnumItemInit = Record<string, never>; // equivalent to {}

/**
 * - **EN:** Data structure of enumeration item options, used in `toList` method
 * - **CN:** 枚举项选项的数据结构，用于`toList`方法
 *
 * @template V Value type of the enumeration item | 枚举项的值类型
 * @template FOL Field name of the label, default is `label` | 标签字段名，默认为 `label`
 * @template FOV Field name of the value, default is `value` | 值字段名，默认为 `value`
 */
export type ListItem<
  V extends EnumValue = EnumValue,
  FOV extends string = 'value',
  FOL extends string = 'label',
  R extends Record<string, unknown> = never,
  // eslint-disable-next-line @typescript-eslint/ban-types
> = Record<FOV, V> & Record<FOL, string> & (IsNever<R> extends true ? {} : R);

/** Enum value type, support number, string, symbol */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EnumValue = keyof any | bigint | boolean | Date | RegExp;

/** Enum key collection */
export type EnumKey<T> = keyof T;

/** Infer the value type from the initialization object of the enumeration item */
export type ValueTypeFromSingleInit<T, Key = string, Fallback = Key> = T extends EnumValue // literal类型
  ? T
  : T extends StandardEnumItemInit<infer V> // typeof {value, label}
    ? V
    : T extends ValueOnlyEnumItemInit<infer V> // typeof {value}
      ? V
      : T extends LabelOnlyEnumItemInit // typeof {label}
        ? Key
        : T extends CompactEnumItemInit // typeof {}
          ? Key
          : T extends undefined // typeof undefined
            ? Fallback
            : never;

/** Infer the value type from the initialization object of the enumeration collection */
export type ValueTypeFromEnumInit<T, K extends EnumKey<T> = EnumKey<T>> =
  T extends NumberEnumInit<K> // format: { foo:1, bar:2 }
    ? number
    : T extends StringEnumInit<K> // format: { foo:'foo', bar:'bar' }
      ? string
      : T extends BooleanEnumInit<K> // format: { foo:true, bar:false }
        ? string
        : T extends StringNumberEnumInit<K> // format: { foo:'foo', bar:2 }
          ? string | number
          : T extends StandardEnumInit<K, infer V> // format: { foo:{ value:1, label:'foo'}, bar:{value:2, label:'bar'} }
            ? V
            : T extends ValueOnlyEnumInit<K, infer V> // format: { foo:{value:1}, bar:{value:2} }
              ? V
              : T extends LabelOnlyEnumInit<K> // format: { foo:{label:'foo'}, bar:{label:'bar'} }
                ? K
                : T extends CompactEnumInit<K> // format: { foo:{}, bar:{} }
                  ? K
                  : T extends OmitEnumInit<K> // format: {foo: undefined, bar: undefined}
                    ? K
                    : K; // Unknown format, use key as value

/**
 * - **EN:** Find the key of the enumeration item by value
 * - **CN:** 通过值查找枚举项的key
 *
 * @template T Enum collection initialization data type | 枚举集合初始化数据的类型
 * @template V Enum value type | 枚举值的类型
 */
export type FindEnumKeyByValue<T, V extends EnumValue> = {
  // ValueOnly: { foo:1, bar:2 }
  [K in keyof T]: T[K] extends V
    ? K
    : // @ts-expect-error: because need to force check T[K]['value'], event value field does not exist
      // Standard: { foo:{ value:1 }, bar:{ value:2 } }
      T[K]['value'] extends V
      ? K
      : // LabelOnly: { foo:{ label: 'foo' }, bar:{ label: 'bar' } }
        object extends T[K]
        ? K extends V
          ? K
          : never
        : // KeyOnly: { foo: undefined, bar: undefined }
          undefined extends T[K]
          ? K extends V
            ? K
            : never
          : never;
}[keyof T];

/**
 * - **EN:** Find the label of the enumeration item by value
 * - **CN:** 通过值查找枚举项的label显示名称
 *
 * @template T Enum collection initialization data type | 枚举集合初始化数据的类型
 * @template V Enum value type | 枚举值的类型
 */
export type FindLabelByValue<T, V extends EnumValue, RAW = T[FindEnumKeyByValue<T, V>]> = RAW extends { label: unknown }
  ? string
  : FindEnumKeyByValue<T, V>;

/**
 * - **EN:** Find the value of the enumeration item by key
 * - **CN:** 通过key查找枚举项的值
 *
 * @template T Enum collection initialization data type | 枚举集合初始化数据的类型
 * @template K Enum key type | 枚举key的类型
 */
export type FindValueByKey<T, K extends EnumKey<T>> = T[K] extends EnumValue
  ? T[K]
  : T[K] extends StandardEnumItemInit<infer V>
    ? V
    : T[K] extends ValueOnlyEnumItemInit<infer V>
      ? V
      : T[K] extends LabelOnlyEnumItemInit
        ? K
        : T[K] extends CompactEnumItemInit
          ? K
          : T[K] extends undefined
            ? K
            : never;

export type FindKeyByMeta<T, MK extends keyof T[keyof T], MV> = {
  [K in keyof T]: T[K] extends Record<MK, MV> ? K : never;
}[keyof T];

export type FindValueByMeta<T, MK extends keyof T[keyof T], MV> = {
  [K in keyof T]: T[K] extends Record<MK, MV> ? T[K][MK] : never;
}[keyof T];

export type PrimitiveOf<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends bigint
        ? bigint
        : T extends symbol
          ? symbol
          : T extends undefined
            ? undefined
            : T extends null
              ? null
              : never;

/**
 * - **EN:** Convert an array of objects to a Map-like object, where the key is the `key` field of the
 *   object, and the value is the `value` field of the object
 * - **CN:** 将对象数组转换为类似Map的对象，其中key为对象的`key`字段，value为对象的`value`字段
 *
 * @template A Array type | 数组类型
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ArrayToMap<A extends Record<string, any>[] | readonly Record<string, any>[]> = {
  [K in A[number]['key']]: Extract<A[number], { key?: K }>;
};

export type ExactEqual<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;

export type IsNever<T> = [T] extends [never] ? true : false;
