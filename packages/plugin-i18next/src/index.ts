import type { PluginFunc } from '@enum-plus';
import type { FilterItemPluginOptions } from './filterItem';
import filterItemPlugin from './filterItem';

/* istanbul ignore next */
const antdPlugins: PluginFunc<{
  filterItem?: FilterItemPluginOptions;
}> = (options, Enum) => {
  filterItemPlugin(options?.filterItem, Enum);
};

export default antdPlugins;
