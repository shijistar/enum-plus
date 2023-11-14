import type { EnumItemClass } from './enum-item';
import type {
  BooleanFirstOptionConfig,
  ColumnFilterItem,
  EnumInit,
  EnumKey,
  EnumOption,
  EnumValue,
  IEnumValues,
  ObjectFirstOptionConfig,
  OptionsConfig,
  ValueTypeFromSingleInit,
} from './types';

/**
 * 枚举项集合数组
 *
 * @export
 * @class EnumValuesArray
 * @extends {Array<EnumItemClass<T, K, V>>}
 * @implements {IEnumValues<T, K, V>}
 * @template T 枚举集合初始化数据的类型
 */
export class EnumValuesArray<
    T extends EnumInit<K, V>,
    K extends EnumKey<T> = EnumKey<T>,
    V extends EnumValue = ValueTypeFromSingleInit<T[K], K>
  >
  extends Array<EnumItemClass<T[K], K, V>>
  implements IEnumValues<T, K, V>
{
  #raw: T;

  /**
   * 构造函数
   *
   * @param {T} raw 原始初始化数据对象
   * @param {...EnumItemClass<T[K], K, V>[]} items 生成后的枚举项数组
   * @memberof EnumValuesArray
   */
  constructor(raw: T, ...items: EnumItemClass<T[K], K, V>[]) {
    super(...items);
    this.#raw = raw;
  }

  label(keyOrValue?: string | number): string | undefined {
    // 先查value，再查key
    return (this.find((i) => i.value === keyOrValue) ?? this.find((i) => i.key === keyOrValue))
      ?.label;
  }

  key(value?: string | number): K | undefined {
    return this.find((i) => i.value === value)?.key;
  }

  has(keyOrValue?: string | number): boolean {
    return this.some((i) => i.value === keyOrValue || i.key === keyOrValue);
  }

  options(): EnumOption<K, V>[];
  options<B extends boolean>(
    config: OptionsConfig & BooleanFirstOptionConfig<B>
  ): EnumOption<K | '', V | ''>[];
  options<FK = never, FV = never>(
    config: OptionsConfig & ObjectFirstOptionConfig<FK, FV>
  ): EnumOption<K | (FK extends never ? FV : FK), V | (FV extends never ? V : FV)>[];
  options<B extends boolean, FK = never, FV = never>(
    config: OptionsConfig & (BooleanFirstOptionConfig<B> | ObjectFirstOptionConfig<FK, FV>) = this
      .#optionsConfigDefaults as any
  ): EnumOption<K | FK, V | FV>[] {
    const { firstOption = this.#optionsConfigDefaults.firstOption } = config;
    if (firstOption) {
      if (firstOption === true) {
        // 默认选项
        return [{ key: '' as K, value: '' as V, label: '全部' }, ...this];
      } else {
        return [
          { ...firstOption, key: firstOption.key ?? (firstOption.value as unknown as K) },
          ...this,
        ];
      }
    } else {
      return this;
    }
  }
  #optionsConfigDefaults: OptionsConfig & BooleanFirstOptionConfig<false> = {
    firstOption: false,
  };

  valuesEnum() {
    const itemsMap = {} as Record<V, { text: string }>;
    for (let i = 0; i < this.length; i++) {
      const { value, label } = this[i];
      itemsMap[value] = { text: label };
    }
    return itemsMap;
  }

  filters(): ColumnFilterItem<V>[] {
    return this.map(({ value, label }) => ({ text: label, value }));
  }

  raw(): T;
  raw(keyOrValue: V | K): T[K];
  raw(value: unknown): T[K] | undefined;
  raw(value?: V | K): T | T[K] | undefined {
    if (value == null) {
      // 返回整个对象
      return this.#raw;
    } else {
      if (Object.keys(this.#raw).includes(value as string)) {
        // 当做key查找
        return this.#raw[value as K];
      }
      // 当做value查找
      const itemByValue = this.find((i) => i.value === value);
      if (itemByValue) {
        return itemByValue.raw;
      } else {
        return undefined;
      }
    }
  }

  /**
   * @deprecated Stub方法，不支持直接调用
   */
  get valueType(): V {
    throw new Error(
      '枚举的valueType属性仅允许用来声明ts类型，不能在运行时访问! 在ts类型中请配合`typeof`运算符使用，例如: typeof Week.valueType'
    );
  }
  /**
   * @deprecated Stub方法，不支持直接调用
   */
  get keyType(): K {
    throw new Error(
      '枚举的keyType属性仅允许用来声明ts类型，不能在运行时访问! 在ts类型中请配合`typeof`运算符使用，例如: typeof Week.keyType'
    );
  }

  /**
   * @deprecated Stub方法，不支持直接调用
   */
  get rawType(): T[K] {
    throw new Error(
      '枚举的rawType属性仅允许用来声明ts类型，不能在运行时访问! 在ts类型中请配合`typeof`运算符使用，例如: typeof Week.rawType'
    );
  }
}
