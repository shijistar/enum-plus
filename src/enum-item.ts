import { internalConfig, localizer } from './global-config';
import type { EnumItemInit, EnumKey, EnumValue, LocalizeInterface, ValueTypeFromSingleInit } from './types';
import { IS_ENUM_ITEM } from './utils';

/**
 * - **EN:** Represents a single item in an enumeration collection.
 * - **CN:** 表示枚举集合中的单个枚举项
 *
 * @template T Represents the type of the enum item's initialization object | 表示枚举项初始化对象的类型
 * @template V Represents the type of the enum item's value (usually string or number) |
 *   表示枚举项值的类型（通常是字符串或数字）
 * @template K Represents the type of the enum item's key | 表示枚举项键的类型
 */
export class EnumItemClass<
  const T extends EnumItemInit<V>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  K extends EnumKey<any> = string,
  V extends EnumValue = ValueTypeFromSingleInit<T, K>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const P = any,
> {
  private _options: EnumItemOptions<T, K, V, P> | undefined;
  private _label: string | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _localize: (content: string | undefined) => any;

  /**
   * - **EN:** Creates an instance of EnumItemClass.
   * - **CN:** 创建 EnumItemClass 的实例
   *
   * @param key The key of the enum item | 枚举项键
   * @param value The value of the enum item | 枚举项值
   * @param label The display name of the enum item | 枚举项显示名称
   * @param raw The original initialization object | 原始初始化对象
   * @param options Optional settings for the enum item | 枚举项的可选设置
   */
  constructor(key: K, value: V, label: string, raw: T, options?: EnumItemOptions<T, K, V, P>) {
    this.key = key;
    this.value = value;
    this.label = label;
    this.raw = raw;

    // Should use _label instead of label closure, to make sure it can be serialized correctly
    Object.defineProperty(this, '_label', {
      value: label,
      writable: false,
      enumerable: false,
      configurable: false,
    });
    // Use defineProperties instead of direct field, to:
    // 1. Make fields readonly
    // 2. Preserve getters after serialized/deserialized
    Object.defineProperties(this, {
      value: {
        value,
        writable: false,
        enumerable: true,
        configurable: false,
      },
      label: {
        get: function (this: EnumItemClass<T, K, V, P>) {
          const labelPrefix = this._options?.labelPrefix;
          const autoLabel = this._options?.autoLabel ?? internalConfig.autoLabel;
          let localeKey = this._label;
          if (autoLabel && labelPrefix != null) {
            if (typeof autoLabel === 'function') {
              localeKey = autoLabel({
                item: this,
                labelPrefix: labelPrefix as P,
              });
            } else {
              localeKey = `${labelPrefix as string}${this._label}`;
            }
          }
          return this._localize(localeKey) ?? localeKey;
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
      value: function (this: EnumItemClass<T, K, V, P>, content: string | undefined) {
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
   * - **EN:** Auto convert to a correct primitive type. This method is called when the object is used
   *   in a context that requires a primitive value.
   *
   * > The priority of this method is higher than both `valueOf` and `toString` methods.
   *
   * - **CN:** 自动转换为正确的原始类型。当对象被用在需要原始值的上下文中时会调用此方法。
   *
   * > 此方法的优先级高于 `valueOf` 和 `toString` 方法。
   *
   * @param hint {'number' | 'string' | 'default'} - A string indicating the preferred type of the
   *   result | 指示结果的首选类型
   *
   * @returns The primitive value of the enum item, either its value or label based on the hint |
   *   枚举项的原始值，根据提示返回其值或标签
   */
  // @ts-expect-error: because don't want show `Symbol` in vscode's intellisense, it should work in background
  private [Symbol.toPrimitive](this: EnumItemClass<T, K, V>, hint: 'number' | 'string' | 'default'): V | string {
    if (hint === 'number') {
      // for the cases like Number(value) or +value
      return this.valueOf();
    } else if (hint === 'string') {
      // for the cases like String(value), `${value}`
      return this.toString();
    }
    // for the cases like '' + value, value == 1
    return this.valueOf();
  }

  /**
   * - **EN:** Returns the string representation of the enum item, which is its label. This method is
   *   called when the object is used in a context that requires a string value, such as string
   *   concatenation or template literals.
   *
   * > The priority of this method is lower than the `valueOf` method
   *
   * - **CN:** 返回枚举项的字符串表示形式，即其显示名称。当对象被用在需要字符串值的上下文中时会调用此方法，例如字符串连接或模板字面量。
   *
   * > 此方法的优先级低于 `valueOf` 方法
   *
   * @returns The display name of the enum item | 枚举项的显示名称
   */
  toString() {
    return this.label;
  }
  /**
   * - **EN:** Returns the localized string representation of the enum item, which is its label. This
   *   method is called when the object is used in a context that requires a localized string value,
   *   such as `toLocaleString` method.
   * - **CN:** 返回枚举项的本地化字符串表示形式，即其显示名称。当对象被用在需要本地化字符串值的上下文中时会调用此方法，例如 `toLocaleString` 方法。
   *
   * @returns The localized display name of the enum item | 枚举项的本地化显示名称
   */
  toLocaleString() {
    return this.toString();
  }
  /**
   * - **EN:** Returns the primitive value of the enum item, which is its value. This method is called
   *   when the object is used in a context that requires a primitive value, such as mathematical
   *   operations.
   *
   * > The priority of this method is higher than the `toString` method
   *
   * - **CN:** 返回枚举项的原始值，即其值。当对象被用在需要原始值的上下文中时会调用此方法，例如数学运算。
   *
   * > 此方法的优先级高于 `toString` 方法
   *
   * @returns The value of the enum item | 枚举项的值
   */
  valueOf() {
    return this.value;
  }
}

export interface EnumItemOptions<
  T extends EnumItemInit<V>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  K extends EnumKey<any> = string,
  V extends EnumValue = ValueTypeFromSingleInit<T, K>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  P = any,
> {
  /**
   * - **EN:** Localization function, used to convert the text of the enumeration item to localized
   *   text
   * - **CN:** 本地化函数，用于把枚举项文本转换为本地化文本
   */
  localize?: LocalizeInterface;
  /**
   * - **EN:** The label prefix for each enum item, which can be a string or an object. This option
   *   can simplify or even omit the label definition of enum items, and is only effective when
   *   internationalization is enabled.
   * - **CN:** 每个枚举项的label前缀，可以是字符串，也可以是一个对象。此选项可以简化甚至省略枚举项的label定义，只有当开启国际化时才需要此选项。
   */
  labelPrefix?: P;

  /**
   * - **EN:** Allow setting a label prefix for enum items, simplifying or even omitting the label
   *   definition of enum items. This option is only needed when internationalization is enabled.
   *   The prefix is set through `options.labelPrefix` when creating the Enum, which can be a string
   *   or an object.
   *
   *   - `true` - Default value. Enable automatic concatenation of enum item localeKey in
   *       `options.labelPrefix` + `label` format. `labelPrefix` only supports string in this case.
   *   - `Function` - Dynamically generate the localeKey for enum items. `labelPrefix` supports any type
   *       in this case.
   *   - `false` - Disable automatic label generation, completely relying on the `label` field defined
   *       in the enum item.
   *
   * > This option has the same effect as `Enum.config.autoLabel`, but has a higher priority than the
   * > global configuration, and only takes effect for the current enum instance.
   *
   * - **CN:** 允许为枚举项设置label前缀，简化甚至可以省略枚举项的label定义，只有当开启国际化时才需要此选项。创建Enum时通过 `options.labelPrefix`
   *   设置前缀，可以是字符串，也可以是一个对象。
   *
   *   - `true` - 默认值，启用自动拼接，`options.labelPrefix` + `label` 自动拼接生成标签，这种情况下 `labelPrefix` 只支持字符串形式
   *   - `Function` - 动态生成枚举项localeKey，这种情况下 `labelPrefix` 支持任意类型
   *   - `false` - 禁用自动生成标签，完全依赖枚举项中定义的 `label` 字段
   *
   * > 此选项与 `Enum.config.autoLabel` 作用相同，但优先级高于全局配置，仅对当前枚举实例生效。
   */
  autoLabel?: boolean | ((options: { item: EnumItemClass<T, K, V, P>; labelPrefix: P }) => string);
}
