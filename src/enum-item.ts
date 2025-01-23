import { Enum } from '.';
import type {
  EnumItemInit,
  EnumItemOptions,
  EnumKey,
  EnumValue,
  ValueTypeFromSingleInit,
} from './types';

/**
 * Enum item class
 * @template V General type of value
 * @template K General type of key
 * @template T Initialize object of enum item
 */
export class EnumItemClass<
  T extends EnumItemInit<V>,
  K extends EnumKey<any> = string,
  V extends EnumValue = ValueTypeFromSingleInit<T, K>
> {
  /** Enum item value */
  readonly value: V;

  /** Enum item label (or called display name) */
  readonly label: string;

  /** Enum item key */
  readonly key: K;

  /** Original initialization object */
  readonly raw: T;

  #localize: NonNullable<EnumItemOptions['localize']>;
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
   * Instantiate an enum item
   * @param key Enum item key
   * @param value Enum item value
   * @param label Enum item display name
   * @param raw Original initialization object
   * @param options Construction options
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

    // Override some system methods
    // @ts-ignore: Override Object.toString method to display type more friendly
    this[Symbol.toStringTag] = 'EnumItem';
    // @ts-ignore: Override Object.toPrimitive method to return enum value
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
