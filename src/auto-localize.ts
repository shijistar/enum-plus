import { internalConfig } from './global-config';

export interface AutoLocalizeTemplateContext<Item = unknown, Options = unknown> {
  field: string;
  item?: Item;
  options?: Options;
  resource?: unknown;
}

export type AutoLocalizeTemplate<Item = unknown, Options = unknown> =
  | string
  | ((context: AutoLocalizeTemplateContext<Item, Options>) => string | undefined);

export interface AutoLocalizeConfig<Item = unknown, Options = unknown> {
  nameTemplate?: AutoLocalizeTemplate<Item, Options>;
  itemTemplate?: Record<string, AutoLocalizeTemplate<Item, Options>>;
}

export type AutoLocalizeOption<Item = unknown, Options = unknown> =
  | AutoLocalizeConfig<Item, Options>
  | ((context: AutoLocalizeTemplateContext<Item, Options>) => string | undefined);

export type LiteralStringKeys<T> = string extends keyof T ? never : Extract<keyof T, string>;

export type AutoLocalizeItemTemplateFields<Options> = Options extends { autoLocalize?: infer AutoLocalize }
  ? AutoLocalize extends (...args: never[]) => unknown
    ? never
    : AutoLocalize extends { itemTemplate?: infer ItemTemplate }
      ? Exclude<LiteralStringKeys<NonNullable<ItemTemplate>>, 'label'>
      : never
  : never;

export type AutoLocalizeMetaRecord<Options> = {
  readonly [Key in AutoLocalizeItemTemplateFields<Options>]: string;
};

export function mergeAutoLocalizeConfig<Item, Options>(
  local?: AutoLocalizeOption<Item, Options>,
): AutoLocalizeConfig<Item, Options> | undefined {
  const global = internalConfig.autoLocalize as AutoLocalizeOption<Item, Options> | undefined;
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

export function normalizeAutoLocalizeConfig<Item, Options>(
  config?: AutoLocalizeOption<Item, Options>,
): AutoLocalizeConfig<Item, Options> | undefined {
  if (!config) {
    return undefined;
  }
  if (typeof config === 'function') {
    return { itemTemplate: { label: config } };
  }
  return config;
}

export function resolveAutoLocalizeTemplate<Item, Options>(
  template: AutoLocalizeTemplate<Item, Options> | undefined,
  context: AutoLocalizeTemplateContext<Item, Options>,
): string | undefined {
  if (!template) {
    return undefined;
  }
  if (typeof template === 'function') {
    return template(context);
  }
  return template
    .split('{name}')
    .join(String((context.options as { name?: unknown } | undefined)?.name ?? ''))
    .split('{item}')
    .join(String((context.item as { key?: unknown } | undefined)?.key ?? ''))
    .split('{field}')
    .join(context.field);
}

export function getAutoLocalizeTemplateFields(
  options?: { autoLocalize?: AutoLocalizeOption<unknown, unknown> } | unknown,
) {
  const resolvedOptions = options as { autoLocalize?: AutoLocalizeOption<unknown, unknown> } | undefined;
  const config = mergeAutoLocalizeConfig(resolvedOptions?.autoLocalize);
  return Object.keys(config?.itemTemplate ?? {});
}

export function isAutoLocalizeMetaField(
  field: string,
  options?:
    | {
        autoLocalizeMeta?: boolean | readonly (string | number | symbol)[];
        autoLocalize?: AutoLocalizeOption<unknown, unknown>;
      }
    | unknown,
) {
  const resolvedOptions = options as
    | {
        autoLocalizeMeta?: boolean | readonly (string | number | symbol)[];
        autoLocalize?: AutoLocalizeOption<unknown, unknown>;
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
