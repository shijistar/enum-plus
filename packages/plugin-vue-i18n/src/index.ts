import type { PluginFunc } from 'enum-plus';
import type { LocalizePluginOptions } from './localize';
import localizePlugin from './localize';

export * from './localize';

const i18nPlugins: PluginFunc<{
  localize?: LocalizePluginOptions;
}> = (options, Enum) => {
  localizePlugin(options?.localize, Enum);
};

export default i18nPlugins;
