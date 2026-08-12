import type { EnumInitOptions } from './enum';
import type { EnumItemInterface, EnumItemOptions } from './enum-item';
import { internalConfig } from './global-config';
import type { EnumInit, EnumItemInit, EnumKey, EnumValue, ValueTypeFromSingleInit } from './types';

export type LocalizeTemplateContext<
  TYPE extends 'name' | 'item',
  ET extends EnumInit<K, V>,
  T extends EnumItemInit<V>,
  K extends EnumKey<ET> = EnumKey<ET>,
  V extends EnumValue = ValueTypeFromSingleInit<T, K>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  LP = any,
  OPTIONS extends EnumItemOptions<ET, T, K, V, LP> = EnumItemOptions<ET, T, K, V, LP>,
> = { type: TYPE; options?: EnumInitOptions<ET, K, V, LP> } & (TYPE extends 'name'
  ? unknown
  : {
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
  name?: LocalizeTemplate<'name', ET, T, K, V, LP, OPTIONS>;
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
  const name = context.options?.name;
  if (typeof name === 'string') {
    template = template.replace(/{name}/g, name);
  }
  if (context.type === 'item') {
    template = template.replace(
      /{key}/g,
      (context as unknown as LocalizeTemplateContext<'item', ET, T, K, V, LP, OPTIONS>).item.key as string,
    );
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
  if (options?.autoLocalizeMeta === true) {
    return true;
  }
  if (Array.isArray(options?.autoLocalizeMeta) && options.autoLocalizeMeta.includes(field)) {
    return true;
  }
  if (options?.templates?.items && Object.keys(options.templates.items).includes(field)) {
    return true;
  }
  if (internalConfig.templates?.items && Object.keys(internalConfig.templates.items).includes(field)) {
    return true;
  }
  return false;
}
