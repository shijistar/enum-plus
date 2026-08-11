import type { EnumInitOptions } from './enum';
import type { EnumItemInterface, EnumItemOptions } from './enum-item';
import { internalConfig } from './global-config';
import type { EnumInit, EnumKey, EnumValue, ValueTypeFromSingleInit } from './types';

export type LocalizeTemplateContext<
  TYPE extends 'name' | 'item',
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
> = { type: TYPE; options?: EnumInitOptions<T, K, V> } & (TYPE extends 'name'
  ? unknown
  : {
      item: EnumItemInterface<T, T[K], K, V, unknown, EnumItemOptions<T, T[K], K, V>>;
    });

export type LocalizeTemplate<
  TYPE extends 'name' | 'item',
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
> = string | ((context: LocalizeTemplateContext<TYPE, T, K, V>) => string | undefined);

export interface LocalizeTemplatesConfig<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
> {
  name?: LocalizeTemplate<'name', T, K, V>;
  items?: Record<string, LocalizeTemplate<'item', T, K, V>>;
}

export type LiteralStringKeys<T> = string extends keyof T ? never : Extract<keyof T, string>;

export type AutoLocalizeItemTemplateFields<Options> = Options extends {
  templates?: { items?: infer ItemTemplates };
}
  ? Exclude<LiteralStringKeys<NonNullable<ItemTemplates>>, 'label'>
  : never;

export function resolveLocalizeTemplate<
  TYPE extends 'name' | 'item',
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
>(template: LocalizeTemplate<TYPE, T, K, V>, context: LocalizeTemplateContext<TYPE, T, K, V>): string | undefined {
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
      (context as unknown as LocalizeTemplateContext<'item', T, K, V>).item.key as string,
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
