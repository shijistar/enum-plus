import type { PluginFunc } from 'enum-plus';
import type { ClientLocalizePluginOptions } from './clientLocalize';
import clientLocalizePlugin from './clientLocalize';
import serverLocalizePlugin, { type ServerLocalizePluginOptions } from './serverLocalize';

export * from './clientLocalize';
export * from './serverLocalize';
export * from './PatchedI18nProviderClient';
export { default as PatchedI18nProviderClient } from './PatchedI18nProviderClient';

/**
 * - **EN:** An internationalization plugin for `enum-plus`, built on top of the `next-international`
 *   library.
 * - **CN:** `enum-plus` 国际化插件，底层适配 `next-international` 库。
 *
 * @example
 *   import clientI18nPlugin from '@enum-plus/plugin-next-international';
 *   import Enum from 'enum-plus';
 *
 *   Enum.install(clientI18nPlugin);
 */
export const clientI18nPlugin: PluginFunc<{
  localize?: ClientLocalizePluginOptions;
}> = (options, Enum) => {
  clientLocalizePlugin(options?.localize, Enum);
};

/**
 * - **EN:** An internationalization plugin for `enum-plus`, built on top of the `next-international`
 *   library.
 * - **CN:** `enum-plus` 国际化插件，底层适配 `next-international` 库。
 *
 * @example
 *   import serverI18nPlugin from '@enum-plus/plugin-next-international';
 *   import Enum from 'enum-plus';
 *   import { getI18n } from './path/to/server';
 *
 *   Enum.install(serverI18nPlugin, { getI18n });
 */
export const serverI18nPlugin: PluginFunc<{
  localize?: ServerLocalizePluginOptions;
}> = (options, Enum) => {
  serverLocalizePlugin(options?.localize, Enum);
};
