import { Enum } from './enum';
import type { EnumItemInit, EnumItemOptions, EnumKey, EnumValue, ValueTypeFromSingleInit } from './types';

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
  /** This property is used to customize the default string description of an object. */
  [Symbol.toStringTag] = 'EnumItem';
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
  [Symbol.toPrimitive] = (hint: 'number' | 'string' | 'default'): V | string => {
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
  private _localize: NonNullable<EnumItemOptions['localize']>;
  private _localizedProxy = new Proxy(this, {
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
    this._options = options;
    // should use function here to avoid closure. this is important for the e2e test cases.
    this._localize = function (content: string | undefined) {
      const localize = this._options?.localize ?? Enum.localize;
      if (typeof localize === 'function') {
        return localize(content);
      }
      return content;
    };
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
