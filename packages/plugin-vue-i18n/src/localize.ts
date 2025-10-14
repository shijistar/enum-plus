import type { PluginFunc } from 'enum-plus';
import type { Composer, ComposerTranslation, I18n, TranslateOptions, UseI18nOptions } from 'vue-i18n';
import { useI18n } from 'vue-i18n';

export interface LocalizePluginOptions {
  /**
   * - **EN:** Set the default i18n instance. If you want to support using the enum's
   *   internationalization features in a non-component environment, you must pass in this
   *   instance.
   * - **CN:** 设置默认的i18n实例。如果要支持在非组件环境下使用枚举的国际化功能，必须传入该实例。
   */
  instance?: I18n;
  /**
   * - **EN:** Options to be passed to the `useI18n` function.
   * - **CN:** 传递给`useI18n`函数的选项。
   */
  useI18nOptions?: UseI18nOptions;
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
  tOptions?: TranslateOptions | ((key: string | undefined | (string | undefined)[]) => TranslateOptions | string);
}

const localizePlugin: PluginFunc<LocalizePluginOptions> = (pluginOptions, Enum) => {
  const { instance, useI18nOptions, tOptions } = pluginOptions || {};
  Enum.localize = (key: string | undefined) => {
    let t: ComposerTranslation<Record<string, unknown>, string>;
    try {
      const { t: translate } = useI18n(useI18nOptions);
      t = translate;
    } catch (error) {
      console.warn(`An error occurred in useI18n! Fallback to instance.t if instance is provided.`);
      console.warn(`The error is:`, error);
      t = ((localeKey: string, named: Record<string, unknown>, options: TranslateOptions) => {
        if (instance) {
          return (instance.global as Composer).t(localeKey, named, options);
        }
        return localeKey;
      }) as unknown as ComposerTranslation<Record<string, unknown>, string>;
    }
    let options: TranslateOptions | string | undefined;

    if (tOptions) {
      if (typeof tOptions === 'function') {
        options = tOptions(key);
      } else {
        options = tOptions;
      }
    }
    if (typeof options === 'string') {
      return options;
    }
    return t(key as string, {}, options!);
  };
};
export default localizePlugin;
