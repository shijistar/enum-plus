import type { EnumInitOptions } from './enum';
import type { EnumItemInterface, EnumItemOptions } from './enum-item';
import { internalConfig } from './global-config';
import type { EnumInit, EnumItemInit, EnumKey, EnumValue, ValueTypeFromSingleInit } from './types';

/**
 * - **EN:** The context for the localization template, including the type and options.
 * - **CN:** 国际化模板的上下文，包括类型和选项。
 */
export type LocalizeTemplateContext<
  TYPE extends 'name' | 'item',
  ET extends EnumInit<K, V>,
  T extends EnumItemInit<V>,
  K extends EnumKey<ET> = EnumKey<ET>,
  V extends EnumValue = ValueTypeFromSingleInit<T, K>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  LP = any,
  OPTIONS extends EnumItemOptions<ET, T, K, V, LP> = EnumItemOptions<ET, T, K, V, LP>,
> = {
  /**
   * - **EN:** The type of the localization template, including `name` and `item`.
   * - **CN:** 国际化模板的类型，包括 `name` 和 `item`
   */
  type: TYPE;
  /**
   * - **EN:** The options for the localization template, including enum initialization options
   * - **CN:** 国际化模板的选项，包括枚举初始化选项
   */
  options?: EnumInitOptions<ET, K, V, LP>;
} & (TYPE extends 'name'
  ? unknown
  : {
      /**
       * - **EN:** The current meta field name of the enum item
       * - **CN:** 当前处理的元字段名
       */
      metaField: string;
      /**
       * - **EN:** The current enum item
       * - **CN:** 当前枚举项
       */
      item: EnumItemInterface<ET, T, K, V, LP, OPTIONS>;
    });

export type LocalizeTemplate<
  TYPE extends 'name' | 'item',
  ET extends EnumInit<K, V>,
  T extends EnumItemInit<V>,
  K extends EnumKey<ET> = EnumKey<ET>,
  V extends EnumValue = ValueTypeFromSingleInit<T, K>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  LP = any,
  OPTIONS extends EnumItemOptions<ET, T, K, V, LP> = EnumItemOptions<ET, T, K, V, LP>,
> = string | ((context: LocalizeTemplateContext<TYPE, ET, T, K, V, LP, OPTIONS>) => string | undefined);

export interface LocalizeTemplatesConfig<
  ET extends EnumInit<K, V>,
  T extends EnumItemInit<V>,
  K extends EnumKey<ET> = EnumKey<ET>,
  V extends EnumValue = ValueTypeFromSingleInit<T, K>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  LP = any,
  OPTIONS extends EnumItemOptions<ET, T, K, V, LP> = EnumItemOptions<ET, T, K, V, LP>,
> {
  /**
   * - **EN:** Internationalization templates configuration for enum names. it supports both `string`
   *   and `function` forms.
   *
   *   - `string` - can use the `{name}` placeholder which represents the enum's `options.name` value
   *   - `function` - receives the context `{ options }` and returns the localization key
   *
   * > ⚠️ Note: The `name` template takes precedence over the `options.name` option. To reference the
   * > value of `options.name` in the template, you need to explicitly use the `{name}` placeholder.
   *
   * - **CN:** 枚举名称的国际化模板配置，支持 `string` 和 `function` 两种配置形式。
   *
   *   - `string` - 可以使用 `{name}` 占位符，表示枚举的 `options.name` 值
   *   - `function` - 接收上下文 `{ options }` 并返回本地化 key
   *
   * > ⚠️ 注意：`name` 模板的优先级高于 `options.name` 选项，如果要在模板中引用 `options.name` 的值，需要显式地使用 `{name}` 占位符。
   */
  name?: LocalizeTemplate<'name', ET, T, K, V, LP, OPTIONS>;
  /**
   * - **EN:** Internationalization templates configuration for enum items. it supports both `string`
   *   and `function` forms.
   *
   *   - `string` - the localization template string, supporting multiple placeholders:
   *
   *       - `{name}` - represents the enum's `options.name` value
   *       - `{key}` - represents the enum item's `key` value
   *       - `{value}` - represents the enum item's `value` value
   *       - `{raw}` - represents the raw value of the meta field
   *   - `function` - receives the context `{ item, options }` and returns the localization key
   *
   * > ⚠️ Note: The `items` template takes precedence over the raw meta field value. To reference the
   * > raw meta field value in the template, you need to explicitly use the `{raw}` placeholder.
   *
   * - **CN:** 枚举项的国际化模板配置，支持 `string` 和 `function` 两种配置形式。
   *
   *   - `string` - 国际化模板字符串，支持使用多个占位符：
   *
   *       - `{name}` - 表示枚举的 `options.name` 值
   *       - `{key}` - 表示枚举项的 `key` 值
   *       - `{value}` - 表示枚举项的 `value` 值
   *       - `{raw}` - 表示该meta字段的原始值
   *   - `function` - 接收上下文 `{ item, options }` 并返回本地化 key
   *
   * > ⚠️ 注意：`items` 模板的优先级高于元数据字段值，如果要在模板中引用元数据字段的值，需要显式地使用 `{raw}` 占位符。
   */
  items?: Record<string, LocalizeTemplate<'item', ET, T, K, V, LP, OPTIONS>>;
}

export type LiteralStringKeys<T> = string extends keyof T ? never : Extract<keyof T, string>;

export type AutoLocalizeItemTemplateFields<Options> = Options extends {
  templates?: { items?: infer ItemTemplates };
}
  ? Exclude<LiteralStringKeys<NonNullable<ItemTemplates>>, 'label'>
  : never;

export function resolveLocalizeTemplate<
  TYPE extends 'name' | 'item',
  ET extends EnumInit<K, V>,
  T extends EnumItemInit<V>,
  K extends EnumKey<ET> = EnumKey<ET>,
  V extends EnumValue = ValueTypeFromSingleInit<T, K>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  LP = any,
  OPTIONS extends EnumItemOptions<ET, T, K, V, LP> = EnumItemOptions<ET, T, K, V, LP>,
>(
  template: LocalizeTemplate<TYPE, ET, T, K, V, LP, OPTIONS>,
  context: LocalizeTemplateContext<TYPE, ET, T, K, V, LP, OPTIONS>,
): string | undefined {
  if (typeof template === 'function') {
    return template(context);
  }
  // always replace {name} placeholder
  const name = context.options?.name;
  if (typeof name === 'string') {
    template = template.replace(/{name}/g, name);
  }
  // replace item placeholders
  if (context.type === 'item') {
    const itemContext = context as unknown as LocalizeTemplateContext<'item', ET, T, K, V, LP, OPTIONS>;
    template = template
      .replace(/{key}/g, itemContext.item.key as string)
      .replace(/{value}/g, itemContext.item.value as string)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .replace(/{raw}/g, (itemContext.item.raw as any)?.[itemContext.metaField] ?? '');
  }
  return template;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getTemplateFields(options?: EnumItemOptions<any, any, any, any, any>) {
  return Object.keys({ ...internalConfig.templates?.items, ...options?.templates?.items });
}

export function isAutoLocalizeMetaField<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
>(
  field: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options?: EnumItemOptions<any, any, any, any, any>,
) {
  if (options?.templates?.items && Object.keys(options.templates.items).includes(field)) {
    return true;
  }
  if (internalConfig.templates?.items && Object.keys(internalConfig.templates.items).includes(field)) {
    return true;
  }
  if (options?.autoLocalizeMeta === true) {
    return true;
  }
  if (Array.isArray(options?.autoLocalizeMeta) && options.autoLocalizeMeta.includes(field)) {
    return true;
  }
  return false;
}
