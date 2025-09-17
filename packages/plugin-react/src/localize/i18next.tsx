import type { PluginFunc } from 'enum-plus';
import type { I18nextLocaleProps } from '../components/I18nLocale';
import I18nextLocale from '../components/I18nLocale';

export type I18nextPluginOptions = Pick<I18nextLocaleProps, 'instance' | 'tOptions'>;
const i18nextPlugin: PluginFunc<I18nextPluginOptions> = (options = {}, Enum) => {
  const { instance, tOptions } = options;
  Enum.localize = (key: string | undefined) =>
    (<I18nextLocale key={key} i18nKey={key} instance={instance} tOptions={tOptions} />) as unknown as string;
};

export default i18nextPlugin;
