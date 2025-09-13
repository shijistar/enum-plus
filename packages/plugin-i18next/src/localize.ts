import type { PluginFunc } from 'enum-plus';
import type { TOptionsBase } from 'i18next';
// eslint-disable-next-line import/no-named-as-default
import i18n from 'i18next';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LocalizePluginOptions {
  /**
   * - **EN:** Provide options to be passed to the `t` method when generating internationalized text
   *   within the enum, so that parameters can be passed dynamically.
   *
   *   You can pass an object or a function, the parameter of the function is the current key, and the
   *   return value is the option passed to the `t` method, or even a string directly as the final
   *   translation result.
   * - **CN:** 在枚举内部生成国际化文本时，提供传递给`t`方法的选项，以便可以动态传递参数。
   *
   *   可以传递一个对象，也可以传递一个函数，函数的参数是当前的key，返回值是传递给`t`方法的选项，甚至可以直接返回一个字符串作为最终的翻译结果。
   */
  tOptions?:
    | (TOptionsBase & Record<string, unknown>)
    | ((key: string) => (TOptionsBase & Record<string, unknown>) | string);
}

const localizePlugin: PluginFunc<LocalizePluginOptions> = (pluginOptions, Enum) => {
  Enum.localize = (key: string | undefined) => {
    let options: (TOptionsBase & Record<string, unknown>) | string | undefined;
    if (pluginOptions?.tOptions) {
      if (typeof pluginOptions.tOptions === 'function') {
        options = pluginOptions.tOptions(key as string);
      } else {
        options = pluginOptions.tOptions;
      }
    }
    if (typeof options === 'string') {
      return options;
    }
    // eslint-disable-next-line import/no-named-as-default-member
    return i18n.t(key as string, options);
  };
};
export default localizePlugin;
