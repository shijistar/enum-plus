import { localizer } from './localizer';
import type { EnumItemInit, EnumKey, EnumValue, LocalizeInterface, ValueTypeFromSingleInit } from './types';
import { IS_ENUM_ITEM } from './utils';

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
  private _options: EnumItemOptions | undefined;
  private _label: string | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _localize: (content: string | undefined) => any;

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

    Object.defineProperty(this, '_label', {
      value: label,
      writable: false,
      enumerable: false,
      configurable: false,
    });
    Object.defineProperties(this, {
      value: {
        value,
        writable: false,
        enumerable: true,
        configurable: false,
      },
      label: {
        get: function (this: EnumItemClass<T, K, V>) {
          return this._localize(this._label) ?? this._label;
        },
        enumerable: true,
        configurable: false,
      },
      key: {
        value: key,
        writable: false,
        enumerable: true,
        configurable: false,
      },
      raw: {
        value: raw,
        writable: false,
        enumerable: true,
        configurable: false,
      },
    });
    // Do not use class field here, because don't want print this field in Node.js
    Object.defineProperty(this, '_options', {
      value: options,
      writable: false,
      enumerable: false,
      configurable: false,
    });
    this._localize = undefined!;
    Object.defineProperty(this, '_localize', {
      value: function (this: EnumItemClass<T, K, V>, content: string | undefined) {
        const localize = this._options?.localize ?? localizer.localize;
        if (typeof localize === 'function') {
          return localize(content);
        }
        return content;
      },
      writable: false,
      enumerable: false,
      configurable: false,
    });

    Object.freeze(this);
  }

  /**
   * - **EN:** The value of the enum item
   * - **CN:** 枚举项的值
   */
  readonly value: V;

  /**
   * - **EN:** The label of the enum item (also known as display name)
   * - **CN:** 枚举项的标签（亦称显示名称）
   */
  readonly label: string;

  /**
   * - **EN:** The key of the enum item, which is the key in the initialization object when creating
   *   the enum collection.
   * - **CN:** 枚举项的键，即创建枚举集合时初始化对象中的键
   */
  readonly key: K;

  /**
   * - **EN:** The original initialization object of the enum item, which is the sub-object of a
   *   single enum item when creating the enum collection.
   * - **CN:** 枚举项的原始初始化对象，即创建枚举集合时单个枚举项的子对象
   */
  readonly raw: T;
  /**
   * - **EN:** A boolean value indicates that this is an enum item instance.
   * - **CN:** 布尔值，表示这是一个枚举项实例
   */
  // Do not use readonly field here, because don't want print this field in Node.js
  // eslint-disable-next-line @typescript-eslint/class-literal-property-style
  get [IS_ENUM_ITEM](): true {
    return true;
  }
  /**
   * Auto convert to a correct primitive type. This method is called when the object is used in a
   * context that requires a primitive value.
   *
   * The priority of this method is higher than both `valueOf` and `toString` methods.
   *
   * @param hint 'number' | 'string' | 'default'
   *
   * @returns V | string
   */
  // @ts-expect-error: because don't want show `Symbol` in vscode's intellisense, it should work in background
  private [Symbol.toPrimitive](this: EnumItemClass<T, K, V>, hint: 'number' | 'string' | 'default'): V | string {
    if (hint === 'number') {
      // for cases like Number(value) or +value
      return this.valueOf();
    } else if (hint === 'string') {
      // for cases like String(value), `${value}`
      return this.toString();
    }
    // for cases like '' + value, value == 1
    return this.valueOf();
  }

  // The priority of the toString method is lower than the valueOf method
  toString() {
    return this.label;
  }
  toLocaleString() {
    return this.toString();
  }
  // The priority of the valueOf method is lower than Symbol.toPrimitive method
  valueOf() {
    return this.value;
  }
}

export interface EnumItemOptions {
  /**
   * - **EN:** Localization function, used to convert the text of the enumeration item to localized
   *   text
   * - **CN:** 本地化函数，用于把枚举项文本转换为本地化文本
   *
   * @param content Original text | 原始文本
   *
   * @returns Localized text, can return any type | 本地化文本，可以返回任意类型
   */
  localize?: LocalizeInterface;
  /**
   * - **EN:** Set the display name of the enum collection, supports string or localized resource key
   * - **CN:** 设置枚举集合的显示名称，支持字符串或本地化资源的键名
   */
  name?: string;
}
