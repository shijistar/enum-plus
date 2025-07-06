import { localizer } from './localize';
import type { LocalizeInterface } from './localize-interface';
import type { EnumItemInit, EnumItemOptions, EnumKey, EnumValue, ValueTypeFromSingleInit } from './types';
import { ENUM_ITEM } from './utils';

/**
 * Enum item class
 *
 * @template V General type for item value
 * @template K General type for item key
 * @template T General type for item initialization object
 */
export class EnumItemClass<
  T extends EnumItemInit<V>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  K extends EnumKey<any> = string,
  V extends EnumValue = ValueTypeFromSingleInit<T, K>,
> {
  /**
   * **EN:** The value of the enum item
   *
   * **CN:** 枚举项的值
   */
  readonly value: V;

  /**
   * **EN:** The label of the enum item (also known as display name)
   *
   * **CN:** 枚举项的标签（亦称显示名称）
   */
  readonly label: string;

  /**
   * **EN:** The key of the enum item, which is the key in the initialization object when creating
   * the enum collection.
   *
   * **CN:** 枚举项的键，即创建枚举集合时初始化对象中的键
   */
  readonly key: K;

  /**
   * **EN:** The original initialization object of the enum item, which is the sub-object of a
   * single enum item when creating the enum collection.
   *
   * **CN:** 枚举项的原始初始化对象，即创建枚举集合时单个枚举项的子对象
   */
  readonly raw: T;
  /**
   * **EN:** A boolean value indicates that this is an enum item instance.
   *
   * **CN:** 布尔值，表示这是一个枚举项实例
   */
  readonly [ENUM_ITEM] = true;

  #localize: LocalizeInterface;
  #localizedProxy = new Proxy(this, {
    get: (target, prop) => {
      const origin = target[prop as keyof typeof this];
      if (prop === 'label') {
        return target.toString();
      } else if (typeof origin === 'function') {
        return origin.bind(target);
      }
      return origin;
    },
    // Not allowed to edit
    set: (_, prop) => {
      /* istanbul ignore if */
      if (!process.env.JEST_WORKER_ID) {
        console.warn(
          `Cannot modify property "${String(prop)}" on EnumItem. EnumItem instances are readonly and should not be mutated.`
        );
      }
      return true;
    },
    defineProperty: (_, prop) => {
      /* istanbul ignore if */
      if (!process.env.JEST_WORKER_ID) {
        console.warn(
          `Cannot modify property "${String(prop)}" on EnumItem. EnumItem instances are readonly and should not be mutated.`
        );
      }
      return true;
    },
    deleteProperty: (_, prop) => {
      /* istanbul ignore if */
      if (!process.env.JEST_WORKER_ID) {
        console.warn(
          `Cannot modify property "${String(prop)}" on EnumItem. EnumItem instances are readonly and should not be mutated.`
        );
      }
      return true;
    },
    setPrototypeOf: () => {
      /* istanbul ignore if */
      if (!process.env.JEST_WORKER_ID) {
        console.warn('Cannot change prototype of EnumItem. EnumItem instances are immutable.');
      }
      return true;
    },
  });

  /**
   * Instantiate an enum item
   *
   * @param key Enum item key
   * @param value Enum item value
   * @param label Enum item display name
   * @param raw Original initialization object
   * @param options Construction options
   */
  constructor(key: K, value: V, label: string, raw: T, options?: EnumItemOptions) {
    this.key = key;
    this.value = value;
    this.label = label;
    this.raw = raw;
    this.#localize = (content: string | undefined) => {
      const localize = options?.localize ?? localizer.localize;
      if (typeof localize === 'function') {
        return localize(content);
      }
      return content;
    };

    // @ts-expect-error: because override Object.toPrimitive method to return enum value
    this[Symbol.toPrimitive] = (hint: 'number' | 'string' | 'default'): V | string => {
      if (hint === 'number') {
        // for cases like Number(value) or +value
        return this.valueOf();
      } else if (hint === 'string') {
        // for cases like String(value), `${value}`
        return this.toString();
      }
      // for cases like '' + value, value == 1
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
