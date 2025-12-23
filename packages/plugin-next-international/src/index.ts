import type { PluginFunc } from 'enum-plus';
import type { ClientLocalizePluginOptions } from './clientLocalize';
import clientLocalizePlugin from './clientLocalize';

export * from './clientLocalize';
export * from './serverLocalize';
export * from './PatchedI18nProviderClient';
export { default as PatchedI18nProviderClient } from './PatchedI18nProviderClient';
export * from './serverI18nPlugin';

/**
 * - **EN:** An internationalization plugin for `enum-plus`, built on top of the `next-international`
 *   library.
 * - **CN:** `enum-plus` 国际化插件，底层适配 `next-international` 库。
 *
 * @example
 *   import { clientI18nPlugin } from '@enum-plus/plugin-next-international';
 *   import Enum from 'enum-plus';
 *
 *   Enum.install(clientI18nPlugin, { localize: { mode: 'text' } });
 */
export const clientI18nPlugin: PluginFunc<ClientLocalizePluginOptions> = (options, Enum) => {
  clientLocalizePlugin(options, Enum);
};
