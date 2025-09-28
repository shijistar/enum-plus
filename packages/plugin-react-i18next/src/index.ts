import type { PluginFunc } from 'enum-plus';
import localizePlugin, { type LocalizePluginOptions } from './localize';

export * from './localize';

/* istanbul ignore next */
const i18nPlugins: PluginFunc<{
  localize?: LocalizePluginOptions;
}> = (options, Enum) => {
  localizePlugin(options?.localize, Enum);
};

export default i18nPlugins;
