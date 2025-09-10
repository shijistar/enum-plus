import type { PluginFunc } from '@enum-plus';
import type { ToFilterPluginOptions } from './toFilter';
import toFilterPlugin from './toFilter';
import type { ToMenuPluginOptions } from './toMenu';
import toMenuPlugin from './toMenu';
import type { ToSelectPluginOptions } from './toSelect';
import toSelectPlugin from './toSelect';
import type { ToValueMapPluginOptions } from './toValueMap';
import toValueMapPlugin from './toValueMap';

/* istanbul ignore next */
const antdPlugins: PluginFunc<{
  toSelect?: ToSelectPluginOptions;
  toMenu?: ToMenuPluginOptions;
  toFilter?: ToFilterPluginOptions;
  toValueMap?: ToValueMapPluginOptions;
}> = (options, Enum) => {
  toSelectPlugin(options?.toSelect, Enum);
  toMenuPlugin(options?.toMenu, Enum);
  toFilterPlugin(options?.toFilter, Enum);
  toValueMapPlugin(options?.toValueMap, Enum);
};

export default antdPlugins;
