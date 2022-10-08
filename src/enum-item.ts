import type { EnumItemInit, EnumKey, EnumValue, ValueTypeFromSingleInit } from './types';

export class EnumItemClass<
  T extends EnumItemInit<V>,
  K extends EnumKey<any> = string,
  V extends EnumValue = ValueTypeFromSingleInit<T, K>
> {
  /**
   * 枚举项的值
   */
  readonly value: V;

  /**
   * 枚举项的显示名称
   */
  readonly label: string;

  /**
   * 枚举项的Key
   */
  readonly key: K;

  /**
   * 原始初始化对象
   */
  readonly raw: T;

  constructor(key: K, value: V, label: string, raw: T) {
    this.key = key;
    this.value = value;
    this.label = label;
    this.raw = raw;

    // 重写一些系统方法，不写在class声明上是因为会在ts中多一个Symbol的字段，开发时没必要看到
    // @ts-ignore: 重写Object.toString方法，显示类型更友好
    this[Symbol.toStringTag] = 'EnumItem';
    // @ts-ignore: 重写Object.toPrimitive方法，返回枚举值
    this[Symbol.toPrimitive] = (hint: 'number' | 'string' | 'default'): V | string => {
      if (hint === 'number') {
        // +value
        return this.value;
      } else if (hint === 'string') {
        // `${value}`
        return this.label;
      }
      // value + ''
      return this.label;
    };

    Object.freeze(this);
  }

  toString() {
    return this.label;
  }

  toLocaleString() {
    return this.toString();
  }

  valueOf() {
    return this.value;
  }
}
