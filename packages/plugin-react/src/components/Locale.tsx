import { type FC, useEffect, useRef, useState } from 'react';
import type { LocalizePluginOptions as UnderlyingPluginOptions } from '@enum-plus/plugin-i18next';
// eslint-disable-next-line import/no-named-as-default
import i18n, { type TOptions } from 'i18next';

export interface LocaleProps {
  /**
   * - **EN:** The key to be translated. It can be a string or an array of strings.
   * - **CN:** 要翻译的key，可以是字符串或字符串数组。
   */
  i18nKey?: string | string[];
  /**
   * - **EN:** The i18next instance to be used, if not provided, the default instance will be used.
   * - **CN:** 要使用的i18next实例，如果不提供，则使用默认实例。
   */
  instance?: UnderlyingPluginOptions['instance'];
  /**
   * - **EN:** Provide options to be passed to the `t` method when generating internationalized text
   *   within the enum, so that parameters can be passed dynamically.
   *
   *   - `TOptions`: Pass an object as options to the `t` method.
   *   - `(key) => TOptions | string`: Pass a function, the parameter of the function is the current
   *       key, and the return value is the option passed to the `t` method.
   *   - `(key) => string`: Customize the translation result, the return value is the final translation
   *       result string.
   * - **CN:** 在枚举内部生成国际化文本时，提供传递给`t`方法的选项，以便可以动态传递参数。
   *
   *   - `TOptions`：传递一个对象，作为`t`方法的选项。
   *   - `(key) => TOptions | string`：传递一个函数，函数的参数是当前的key，返回值是传递给`t`方法的选项。
   *   - `(key) => string`：自定义翻译结果，返回值是最终的翻译结果字符串。
   */
  tOptions?: UnderlyingPluginOptions['tOptions'];
}
/**
 * - **EN:** A React component for rendering internationalized text using i18next. It listens for
 *   language changes and updates the displayed text accordingly.
 * - **CN:** 一个用于渲染国际化文本的React组件，它监听语言变化并相应地更新显示的文本。
 */
const Locale: FC<LocaleProps> = (props) => {
  const { i18nKey = '', instance = i18n, tOptions } = props;

  const getText = () => {
    let options: TOptions | string | undefined;
    if (typeof tOptions === 'function') {
      options = tOptions(i18nKey);
    } else {
      options = tOptions;
    }
    if (typeof options === 'string') {
      return options;
    } else if (options === undefined) {
      // eslint-disable-next-line import/no-named-as-default-member
      return instance.t(i18nKey as string);
    } else {
      // eslint-disable-next-line import/no-named-as-default-member
      return instance.t(i18nKey, options as TOptions);
    }
  };
  const getTextRef = useRef(getText);
  getTextRef.current = getText;
  const [text, setText] = useState<string | null>(() => getText());

  useEffect(() => {
    const handler = () => {
      setText(getTextRef.current());
    };
    instance.on('languageChanged', handler);
    return () => {
      instance.off('languageChanged', handler);
    };
  }, [instance]);

  return text;
};

export default Locale;
