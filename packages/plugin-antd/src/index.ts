import type { PluginFunc } from 'enum-plus';
import type { ToFilterPluginOptions } from './toFilter';
import toFilterPlugin from './toFilter';
import type { ToMenuPluginOptions } from './toMenu';
import toMenuPlugin from './toMenu';
import type { ToSelectPluginOptions } from './toSelect';
import toSelectPlugin from './toSelect';
import type { ToValueMapPluginOptions } from './toValueMap';
import toValueMapPlugin from './toValueMap';

export * from './toFilter';
export * from './toMenu';
export * from './toSelect';
export * from './toValueMap';

/**
 * - **EN:** An `enum-plus` plugin that includes Ant Design related feature plugins
 * - **CN:** 一个 `enum-plus` 插件，包含 Ant Design 相关的功能插件集合
 *
 * @example
 *   import antdPlugins from '@enum-plus/plugin-antd';
 *   import Enum from 'enum-plus';
 *
 *   Enum.install(antdPlugins);
 */
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
