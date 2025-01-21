import { Enum } from '.';
import type {
  EnumItemInit,
  EnumItemOptions,
  EnumKey,
  EnumValue,
  ValueTypeFromSingleInit,
} from './types';

/**
 * 枚举项类
 * @template V 枚举值的类型
 * @template K 枚举项的Key
 * @template T 枚举项的初始化对象
 */
export class EnumItemClass<
  T extends EnumItemInit<V>,
  K extends EnumKey<any> = string,
  V extends EnumValue = ValueTypeFromSingleInit<T, K>
> {
  /** 枚举项的值 */
  readonly value: V;

  /** 枚举项的显示名称 */
  readonly label: string;

  /** 枚举项的Key */
  readonly key: K;

  /** 原始初始化对象 */
  readonly raw: T;

  #localize: NonNullable<EnumItemOptions['localize']>;
  #localizedProxy = new Proxy(this, {
    get: (target, prop) => {
      const origin = target[prop as keyof typeof this];
      if (prop === 'label') {
        return target.#localize(target.label);
      } else if (typeof origin === 'function') {
        return origin.bind(target);
      }
      return origin;
    },
    // Not allowed to edit
    set: () => {
      return true;
    },
    defineProperty: () => {
      return true;
    },
    deleteProperty: () => {
      return true;
    },
    setPrototypeOf: () => {
      return true;
    },
  });

  /**
   * 实例化一个枚举项
   * @param key 枚举项的Key
   * @param value 枚举值
   * @param label 枚举项的显示名称
   * @param raw 原始初始化对象
   * @param options 构建选项
   */
  constructor(key: K, value: V, label: string, raw: T, options?: EnumItemOptions) {
    const { localize = Enum.localize } = options ?? {};
    this.key = key;
    this.value = value;
    this.label = label;
    this.raw = raw;
    this.#localize = (content: string | undefined) => {
      if (typeof localize === 'function') {
        return localize(content);
      }
      return content;
    };

    // 重写一些系统方法，不写在class声明上是因为会在ts中多一个Symbol的字段，开发时没必要看到
    // @ts-ignore: 重写Object.toString方法，显示类型更友好
    this[Symbol.toStringTag] = 'EnumItem';
    // @ts-ignore: 重写Object.toPrimitive方法，返回枚举值
    this[Symbol.toPrimitive] = (hint: 'number' | 'string' | 'default'): V | string => {
      if (hint === 'number') {
        // Number(value), +value
        return this.valueOf();
      } else if (hint === 'string') {
        // String(value), `${value}`
        return this.toString();
      }
      // '' + value, value == 1
      return this.valueOf();
    };
    // Object.freeze(this);
  }

  readonly() {
    return this.#localizedProxy;
  }

  toString() {
    return this.#localize(this.label) ?? this.label;
  }

  toLocaleString() {
    return this.toString();
  }

  valueOf() {
    return this.value;
  }
}
