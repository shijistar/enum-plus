import type { PluginFunc } from 'enum-plus';
import type { LocalizePluginOptions } from './localize';
import localizePlugin from './localize';

export * from './localize';

export const i18nLocalizePlugin: PluginFunc<{
  localize?: LocalizePluginOptions;
}> = (options, Enum) => {
  localizePlugin(options?.localize, Enum);
};
