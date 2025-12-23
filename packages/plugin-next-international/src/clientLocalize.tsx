'use client';

import type { EnumInit, EnumKey, EnumValue, PluginFunc, ValueTypeFromSingleInit } from 'enum-plus';
import LocaleWithWatch from './components/LocaleWithWatch';
import { runtime } from './internal';
import { isMatchCore } from './isMatch';
import './isMatch/typing';

export interface IsMatchOptions {
  /**
   * - **EN:** The field used for searching in the `isMatch` function, default is `label`.
   * - **CN:** 用于设置 `isMatch` 函数搜索的字段，默认为 `label`。
   */
  defaultSearchField?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ClientLocalizePluginOptions {
  localize?: {
    /**
     * - **EN:** Localization mode, `text` means returning plain text without automatic UI updates on
     *   language change, `component` means returning a component instance that supports automatic
     *   UI updates on language change.
     * - **CN:** 本地化模式，`text` 表示返回纯文本，不支持切换语言后自动更新文本，`component` 表示返回一个组件实例，支持切换语言后自动更新UI。
     */
    mode?: 'text' | 'component';
  };
  isMatch?: IsMatchOptions;
}

const clientLocalizePlugin: PluginFunc<ClientLocalizePluginOptions> = (pluginOptions, Enum) => {
  Enum.localize = (key: string | undefined) => {
    const { mode = 'text' } = pluginOptions?.localize ?? {};
    const { t } = runtime;
    if (!t) {
      throw new Error(
        '[enum-plus][plugin-next-international] is not initialized properly. Please make sure to use `PatchedI18nProviderClient` to wrap your application.'
      );
    }
    if (mode === 'component') {
      return <LocaleWithWatch i18nKey={key} />;
    } else {
      return t(key as string, undefined!);
    }
  };

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
      const { defaultSearchField } = pluginOptions?.isMatch ?? {};
      const { translate = (key: string | undefined) => translateI18n(key!) } = options || {};
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
      const { defaultSearchField } = pluginOptions?.isMatch ?? {};
      const { translate = (key: string | undefined) => translateI18n(key!) } = options || {};
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

function translateI18n(key: string) {
  const { t } = runtime;
  if (!t) {
    throw new Error(
      '[enum-plus][plugin-next-international] is not initialized properly. Please make sure to use `PatchedI18nProviderClient` to wrap your application.'
    );
  }
  return t(key, undefined!);
}

export default clientLocalizePlugin;
