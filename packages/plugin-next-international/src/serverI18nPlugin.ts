import type { PluginFunc } from '@enum-plus/enum';
import type { ServerLocalizePluginOptions } from './serverLocalize';
import serverLocalizePlugin from './serverLocalize';

/**
 * - **EN:** An internationalization plugin for `enum-plus`, built on top of the `next-international`
 *   library.
 * - **CN:** `enum-plus` 国际化插件，底层适配 `next-international` 库。
 *
 * @example
 *   import { serverI18nPlugin } from '@enum-plus/plugin-next-international';
 *   import Enum from 'enum-plus';
 *   import { getI18n } from './path/to/server';
 *
 *   Enum.install(serverI18nPlugin, { localize: { getI18n } });
 */
export const serverI18nPlugin: PluginFunc<{
  localize?: ServerLocalizePluginOptions;
}> = (options, Enum) => {
  serverLocalizePlugin(options?.localize, Enum);
};
