import type { EnumValue } from '../lib';
import type { EnumInitOptions } from './enum';
import type { EnumItemInterface } from './enum-item';
import { internalConfig } from './global-config';
import type { EnumInit, EnumKey, ValueTypeFromSingleInit } from './types';

export type AutoLocalizeContext<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
  Options extends EnumInitOptions<T, K, V> = EnumInitOptions<T, K, V>,
> =
  | {
      type: 'name';
      options?: Options;
    }
  | {
      type: 'item';
      item: EnumItemInterface<T, K, V, Options>;
      options?: Options;
    };

export type AutoLocalizeTemplate<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
  Options extends EnumInitOptions<T, K, V> = EnumInitOptions<T, K, V>,
> = string | ((context: AutoLocalizeContext<T, K, V, Options>) => string | undefined);

export interface AutoLocalizeConfig<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
  Options extends EnumInitOptions<T, K, V> = EnumInitOptions<T, K, V>,
> {
  nameTemplate?: AutoLocalizeTemplate<T, K, V, Options>;
  itemTemplate?: Record<Exclude<keyof T[keyof T], 'key' | 'value' | 'label'>, AutoLocalizeTemplate<T, K, V, Options>>;
}

export type AutoLocalizeOption<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
  Options extends EnumInitOptions<T, K, V> = EnumInitOptions<T, K, V>,
> = AutoLocalizeConfig<T, K, V, Options> | ((context: AutoLocalizeContext<T, K, V, Options>) => string | undefined);

export type LiteralStringKeys<T> = string extends keyof T ? never : Extract<keyof T, string>;

export type AutoLocalizeItemTemplateFields<Options> = Options extends { autoLocalize?: infer AutoLocalize }
  ? AutoLocalize extends (...args: never[]) => unknown
    ? never
    : AutoLocalize extends { itemTemplate?: infer ItemTemplate }
      ? Exclude<LiteralStringKeys<NonNullable<ItemTemplate>>, 'label'>
      : never
  : never;

export function mergeAutoLocalizeConfig<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
  Options extends EnumInitOptions<T, K, V> = EnumInitOptions<T, K, V>,
>(local?: AutoLocalizeOption<T, K, V, Options>): AutoLocalizeConfig<T, K, V, Options> | undefined {
  const global = internalConfig.autoLocalize as AutoLocalizeOption<T, K, V, Options> | undefined;
  const normalizedGlobal = normalizeAutoLocalizeConfig(global);
  const normalizedLocal = normalizeAutoLocalizeConfig(local);
  if (!normalizedGlobal) {
    return normalizedLocal;
  }
  if (!normalizedLocal) {
    return normalizedGlobal;
  }
  return {
    nameTemplate: normalizedLocal.nameTemplate ?? normalizedGlobal.nameTemplate,
    itemTemplate: {
      ...(normalizedGlobal.itemTemplate ?? {}),
      ...(normalizedLocal.itemTemplate ?? {}),
    },
  };
}

export function normalizeAutoLocalizeConfig<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
  Options extends EnumInitOptions<T, K, V> = EnumInitOptions<T, K, V>,
>(config?: AutoLocalizeOption<T, K, V, Options>): AutoLocalizeConfig<T, K, V, Options> | undefined {
  if (!config) {
    return undefined;
  }
  if (typeof config === 'function') {
    return { itemTemplate: { label: config } };
  }
  return config;
}

export function resolveAutoLocalizeTemplate<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
  Options extends EnumInitOptions<T, K, V> = EnumInitOptions<T, K, V>,
>(
  template: AutoLocalizeTemplate<T, K, V, Options> | undefined,
  context: AutoLocalizeContext<T, K, V, Options>,
): string | undefined {
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
  Options extends EnumInitOptions<T, K, V> = EnumInitOptions<T, K, V>,
>(options?: { autoLocalize?: AutoLocalizeOption<T, K, V, Options> } | unknown) {
  const resolvedOptions = options as { autoLocalize?: AutoLocalizeOption<T, K, V, Options> } | undefined;
  const config = mergeAutoLocalizeConfig(resolvedOptions?.autoLocalize);
  return Object.keys(config?.itemTemplate ?? {});
}

export function isAutoLocalizeMetaField<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
  Options extends EnumInitOptions<T, K, V> = EnumInitOptions<T, K, V>,
>(
  field: string,
  options?:
    | {
        autoLocalizeMeta?: boolean | readonly (string | number | symbol)[];
        autoLocalize?: AutoLocalizeOption<T, K, V, Options>;
      }
    | unknown,
) {
  const resolvedOptions = options as
    | {
        autoLocalizeMeta?: boolean | readonly (string | number | symbol)[];
        autoLocalize?: AutoLocalizeOption<T, K, V, Options>;
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
  const config = mergeAutoLocalizeConfig(resolvedOptions?.autoLocalize);
  return field in (config?.itemTemplate ?? {});
}
