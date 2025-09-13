import type { PluginFunc } from 'enum-plus';
import type { FilterItemPluginOptions } from './filterItem';
import filterItemPlugin from './filterItem';
import localizePlugin, { type LocalizePluginOptions } from './localize';

/* istanbul ignore next */
const i18nPlugins: PluginFunc<{
  localize?: LocalizePluginOptions;
  filterItem?: FilterItemPluginOptions;
}> = (options, Enum) => {
  localizePlugin(options?.localize, Enum);
  filterItemPlugin(options?.filterItem, Enum);
};

export default i18nPlugins;
