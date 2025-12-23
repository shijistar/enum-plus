import type { EnumInit, EnumKey, EnumValue, PluginFunc, ValueTypeFromSingleInit } from 'enum-plus';
import { getI18n } from 'react-i18next';
import type { ReactI18nextLocaleProps } from '../components/ReactI18nLocale';
import ReactI18nLocale, { translate as translateI18n } from '../components/ReactI18nLocale';
import type { IsMatchOptions } from '../isMatch';
import { isMatchCore } from '../isMatch';
import '../isMatch/typing';

export type ReactI18nextPluginOptions = Pick<ReactI18nextLocaleProps, 'useTranslationOptions' | 'tOptions'> &
  IsMatchOptions;

const reactI18nextPlugin: PluginFunc<ReactI18nextPluginOptions> = (options = {}, Enum) => {
  const { useTranslationOptions, tOptions, defaultSearchField } = options;
  Enum.localize = (key: string | undefined) =>
    (
      <ReactI18nLocale key={key} i18nKey={key} useTranslationOptions={useTranslationOptions} tOptions={tOptions} />
    ) as unknown as string;

  Enum.extends({
    isMatch: <
      T extends EnumInit<K, V>,
      K extends EnumKey<T> = EnumKey<T>,
      V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
    >(
      search: string | undefined,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      item: any,
      options?: { translate?: (key: string | undefined) => string | undefined }
    ): boolean => {
      const { translate = (key: string | undefined) => translateI18n({ i18nKey: key, t: getI18n().t, tOptions }) } =
        options || {};
      return isMatchCore({
        search,
        item,
        searchField: defaultSearchField,
        ignoreCase: true,
        translate,
      });
    },
    isMatchCaseSensitive: <
      T extends EnumInit<K, V>,
      K extends EnumKey<T> = EnumKey<T>,
      V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
    >(
      search: string | undefined,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      item: any,
      options?: { translate?: (key: string | undefined) => string | undefined }
    ): boolean => {
      const { translate = (key: string | undefined) => translateI18n({ i18nKey: key, t: getI18n().t, tOptions }) } =
        options || {};
      return isMatchCore({
        search,
        item,
        searchField: defaultSearchField,
        ignoreCase: false,
        translate,
      });
    },
  });
};

export default reactI18nextPlugin;
