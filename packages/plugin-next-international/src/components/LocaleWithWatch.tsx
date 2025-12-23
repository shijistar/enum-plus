'use client';

import type { FC } from 'react';
import { useContext, useMemo } from 'react';
import PatchedContext from '../PatchedContext';

export interface LocaleWithWatchProps {
  /**
   * - **EN:** The key to be translated.
   * - **CN:** 要翻译的key。
   */
  i18nKey?: string;
}
/**
 * - **EN:** A React component for rendering internationalized text using i18next. It listens for
 *   language changes and updates the displayed text accordingly.
 * - **CN:** 一个用于渲染国际化文本的React组件，它监听语言变化并相应地更新显示的文本。
 */
const LocaleWithWatch: FC<LocaleWithWatchProps> = (props) => {
  const { i18nKey = '' } = props;
  const { I18n } = useContext(PatchedContext);

  const t = I18n.useI18n();

  return useMemo(() => t(i18nKey, undefined!), [t, i18nKey]);
};

export default LocaleWithWatch;
