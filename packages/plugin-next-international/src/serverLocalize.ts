import type { PluginFunc } from 'enum-plus';
import type { ImportedLocales } from 'international-types';
import type { createI18nServer } from 'next-international/server';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export type ServerLocalizePluginOptions = Pick<ReturnType<typeof createI18nServer<ImportedLocales>>, 'getI18n'>;

const serverLocalizePlugin: PluginFunc<ServerLocalizePluginOptions> = (pluginOptions, Enum) => {
  Enum.localize = async (key: string | undefined) => {
    const { getI18n } = pluginOptions ?? {};
    if (!getI18n) {
      throw new Error('[enum-plus][plugin-next-international] is not initialized properly. ');
    }
    const t = await getI18n();
    return t(key as string, undefined!);
  };
};

export default serverLocalizePlugin;
