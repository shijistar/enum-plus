import { Enum } from './enum';
import type { EnumItemInit, EnumItemOptions, EnumKey, EnumValue, ValueTypeFromSingleInit } from './types';
import { ENUM_ITEM } from './utils';

/**
 * Enum item class
 *
 * @template V General type of value
 * @template K General type of key
 * @template T Initialize object of enum item
 */
export class EnumItemClass<
  T extends EnumItemInit<V>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  K extends EnumKey<any> = string,
  V extends EnumValue = ValueTypeFromSingleInit<T, K>,
> {
  /** Enum item value */
  readonly value: V;

  /** Enum item label (or called display name) */
  readonly label: string;

  /** Enum item key */
  readonly key: K;

  /** Original initialization object */
  readonly raw: T;
  /**
   * **EN:** A boolean value indicates that this is an enum item instance.
   *
   * **CN:** 布尔值，表示这是一个枚举项实例
   */
  readonly [ENUM_ITEM] = true;
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
  readonly [Symbol.toPrimitive] = function (
    this: EnumItemClass<T, K, V>,
    hint: 'number' | 'string' | 'default'
  ): V | string {
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

  private _options: EnumItemOptions | undefined;
  // should use function here to avoid closure. this is important for the e2e test cases.
  private _localize(content: string | undefined) {
    const localize = this._options?.localize ?? Enum.localize;
    if (typeof localize === 'function') {
      return localize(content);
    }
    return content;
  }
  private _readonlyPropMsg(name: string) {
    return `Cannot modify property "${name}" on EnumItem. EnumItem instances are readonly and should not be mutated.`;
  }
  private _localizedProxy = new Proxy(this, {
    get: (target, prop) => {
      const origin = target[prop as keyof typeof this];
      if (prop === 'label') {
        return target.toString();
      }
      return origin;
    },
    // Not allowed to edit
    set: (_, prop) => {
      console.warn(this._readonlyPropMsg(String(prop)));
      return true;
    },
    defineProperty: (_, prop) => {
      console.warn(this._readonlyPropMsg(String(prop)));
      return true;
    },
    deleteProperty: (_, prop) => {
      console.warn(this._readonlyPropMsg(String(prop)));
      return true;
    },
    setPrototypeOf: () => {
      console.warn('Cannot change prototype of EnumItem. EnumItem instances are immutable.');
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
    this._options = options;
    // Object.freeze(this);
  }
  readonly() {
    return this._localizedProxy;
  }
  // The priority of the toString method is lower than the valueOf method
  toString() {
    return this._localize(this.label) ?? this.label;
  }
  toLocaleString() {
    return this.toString();
  }
  // The priority of the valueOf method is lower than Symbol.toPrimitive method
  valueOf() {
    return this.value;
  }
}
