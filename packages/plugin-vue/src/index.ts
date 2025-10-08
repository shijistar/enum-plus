import type { PluginFunc } from 'enum-plus';
import type { I18nextPluginOptions } from './localize/i18next';
import I18nextPlugin from './localize/i18next';
import type { ReactI18nextPluginOptions } from './localize/react-i18next';
import ReactI18nextPlugin from './localize/react-i18next';

export * from './localize/i18next';
export * from './localize/react-i18next';

/**
 * - **EN:** A plugin for `i18next` to provide internationalization support for enums.
 * - **CN:** 适用于`i18next`的插件，用于提供枚举的国际化支持
 */
export const i18nextPlugin: PluginFunc<I18nextPluginOptions> = (options, Enum) => {
  I18nextPlugin(options, Enum);
};

/**
 * - **EN:** A plugin for `react-i18next` to provide internationalization support for enums in React
 *   projects.
 * - **CN:** 适用于`react-i18next`的插件，用于在React项目中提供枚举的国际化支持
 */
export const reactI18nextPlugin: PluginFunc<ReactI18nextPluginOptions> = (options, Enum) => {
  ReactI18nextPlugin(options, Enum);
};
