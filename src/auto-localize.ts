import type { EnumInitOptions } from './enum';
import type { EnumItemInterface, EnumItemOptions } from './enum-item';
import { internalConfig } from './global-config';
import type { EnumInit, EnumKey, EnumValue, ValueTypeFromSingleInit } from './types';

export type LocalizeContext<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
> =
  | {
      type: 'name';
      options?: EnumInitOptions<T, K, V>;
    }
  | {
      type: 'item';
      item: EnumItemInterface<T, T[K], K, V, unknown, EnumItemOptions<T, T[K], K, V>>;
      options?: EnumInitOptions<T, K, V>;
    };

export type LocalizeTemplate<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
> = string | ((context: LocalizeContext<T, K, V>) => string | undefined);

export interface LocalizeTemplatesConfig<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
> {
  name?: LocalizeTemplate<T, K, V>;
  items?: Record<Exclude<keyof T[keyof T], 'key' | 'value' | 'label'>, LocalizeTemplate<T, K, V>>;
}

export type LiteralStringKeys<T> = string extends keyof T ? never : Extract<keyof T, string>;

export type AutoLocalizeItemTemplateFields<Options> = Options extends {
  templates?: { items?: infer ItemTemplates };
}
  ? Exclude<LiteralStringKeys<NonNullable<ItemTemplates>>, 'label'>
  : never;

export function mergeLocalizeTemplatesConfig<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
>(local?: LocalizeTemplatesConfig<T, K, V>) {
  const globalConfig = internalConfig.templates;
  const localConfig = local;
  if (!globalConfig) {
    return localConfig;
  }
  if (!localConfig) {
    return globalConfig as unknown as LocalizeTemplatesConfig<T, K, V>;
  }
  return {
    name: localConfig.name ?? globalConfig.name,
    items: {
      ...(globalConfig.items ?? ({} as never)),
      ...(localConfig.items ?? ({} as never)),
    },
  } as LocalizeTemplatesConfig<T, K, V>;
}

export function resolveLocalizeTemplate<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
>(template: LocalizeTemplate<T, K, V> | undefined, context: LocalizeContext<T, K, V>): string | undefined {
  if (!template) {
    return undefined;
  }
  if (typeof template === 'function') {
    return template(context);
  }
  const name = context.options?.name;
  if (typeof name === 'string') {
    template = template.replace(/{name}/g, name);
  }
  if (context.type === 'item') {
    template = template.replace(/{key}/g, context.item.key as string);
  }
  return template;
}

export function getAutoLocalizeTemplateFields<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
>(options?: { autoLocalize?: LocalizeTemplatesConfig<T, K, V> } | unknown) {
  const resolvedOptions = options as { autoLocalize?: LocalizeTemplatesConfig<T, K, V> } | undefined;
  const config = mergeLocalizeTemplatesConfig(resolvedOptions?.autoLocalize);
  return Object.keys(config?.items ?? {});
}

export function isAutoLocalizeMetaField<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
>(
  field: string,
  options?:
    | {
        autoLocalizeMeta?: boolean | readonly (string | number | symbol)[];
        autoLocalize?: LocalizeTemplatesConfig<T, K, V>;
      }
    | unknown,
) {
  const resolvedOptions = options as
    | {
        autoLocalizeMeta?: boolean | readonly (string | number | symbol)[];
        autoLocalize?: LocalizeTemplatesConfig<T, K, V>;
      }
    | undefined;
  if (field === 'label') {
    return true;
  }
  if (resolvedOptions?.autoLocalizeMeta === true) {
    return true;
  }
  if (Array.isArray(resolvedOptions?.autoLocalizeMeta) && resolvedOptions.autoLocalizeMeta.includes(field)) {
    return true;
  }
  const config = mergeLocalizeTemplatesConfig(resolvedOptions?.autoLocalize);
  return field in (config?.items ?? {});
}
