import type { EnumInit, EnumKey, EnumValue, PluginFunc, ValueTypeFromSingleInit } from 'enum-plus';
import type { I18nextLocaleProps } from '../components/I18nLocale';
import I18nextLocale, { translate as translateI18n } from '../components/I18nLocale';
import type { IsMatchOptions } from '../isMatch';
import { isMatchCore } from '../isMatch';
import '../isMatch/typing';

export type I18nextPluginOptions = Pick<I18nextLocaleProps, 'instance' | 'tOptions'> & IsMatchOptions;
const i18nextPlugin: PluginFunc<I18nextPluginOptions> = (options = {}, Enum) => {
  const { instance, tOptions, defaultSearchField } = options;
  Enum.localize = (key: string | undefined) =>
    (<I18nextLocale key={key} i18nKey={key} instance={instance} tOptions={tOptions} />) as unknown as string;

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
      const { translate = (key: string | undefined) => translateI18n({ i18nKey: key, instance, tOptions }) } =
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
      item: any
    ): boolean => {
      const { translate = (key: string | undefined) => translateI18n({ i18nKey: key, instance, tOptions }) } = {};
      // console.log(search, item, translate(item?.raw?.label));
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

export default i18nextPlugin;
