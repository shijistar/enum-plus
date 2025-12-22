import type { PluginFunc } from 'enum-plus';
import { runtime } from './internal';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ClientLocalizePluginOptions {}

const clientLocalizePlugin: PluginFunc<ClientLocalizePluginOptions> = (pluginOptions, Enum) => {
  Enum.localize = (key: string | undefined) => {
    const { t } = runtime;
    if (!t) {
      throw new Error(
        '[enum-plus][plugin-next-international] is not initialized properly. Please make sure to use `PatchedI18nProviderClient` to wrap your application.'
      );
    }
    return t(key as string, undefined!);
  };
};

export default clientLocalizePlugin;
