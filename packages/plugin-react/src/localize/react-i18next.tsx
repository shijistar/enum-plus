import type { PluginFunc } from 'enum-plus';
import type { ReactI18nextLocaleProps } from '../components/ReactI18nLocale';
import ReactI18nLocale from '../components/ReactI18nLocale';

export type ReactI18nextPluginOptions = Pick<ReactI18nextLocaleProps, 'useTranslationOptions' | 'tOptions'>;

const reactI18nextPlugin: PluginFunc<ReactI18nextPluginOptions> = (options = {}, Enum) => {
  const { useTranslationOptions, tOptions } = options;
  Enum.localize = (key: string | undefined) =>
    (
      <ReactI18nLocale key={key} i18nKey={key} useTranslationOptions={useTranslationOptions} tOptions={tOptions} />
    ) as unknown as string;
};

export default reactI18nextPlugin;
