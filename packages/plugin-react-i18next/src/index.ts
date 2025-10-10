import type { PluginFunc } from 'enum-plus';
import localizePlugin, { type LocalizePluginOptions } from './localize';

export * from './localize';

/**
 * - **EN:** An internationalization plugin for `enum-plus`, built on top of the `react-i18next`
 *   library.
 * - **CN:** `enum-plus` 国际化插件，底层适配 `react-i18next` 类库
 *
 * @example
 *   import i18nPlugins from '@enum-plus/plugin-i18next';
 *   import Enum from 'enum-plus';
 *
 *   Enum.install(i18nPlugins);
 */
const i18nPlugins: PluginFunc<{
  localize?: LocalizePluginOptions;
}> = (options, Enum) => {
  localizePlugin(options?.localize, Enum);
};

export default i18nPlugins;
