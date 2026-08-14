import { type PropsWithChildren, useEffect } from 'react';
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import type { ReactRenderer } from '@storybook/react-vite';
import storyI18n from '../locales';
import { getGlobalValueFromUrl } from '../utils/global';
import { dark, getThemeKey, light } from '../utils/themes';

let currentTheme: string | undefined = undefined;

function StorybookDocsContainer(props: PropsWithChildren<DocsContainerProps<ReactRenderer>>) {
  const globalTheme = getGlobalValueFromUrl('theme');
  const themeKey = getThemeKey(globalTheme);
  // @ts-expect-error: because store is an internal api
  const localeKey = props.context.store?.userGlobals.globals.locale;
  // @ts-expect-error: because store is an internal api
  const themeName = props.context.store?.userGlobals.globals.theme;

  // Reload the page if the theme changes.
  useEffect(() => {
    if (!currentTheme) {
      currentTheme = themeName;
    }
    if (themeName !== currentTheme) {
      currentTheme = themeName;
      (window.top ?? window.parent ?? window).location.reload();
    }
  }, [themeName]);

  useEffect(() => {
    if (localeKey && storyI18n.language !== localeKey) {
      void storyI18n.changeLanguage(localeKey).then(() => {
        (window.top ?? window.parent ?? window).location.reload();
      });
    }
  }, [localeKey]);

  return (
    <div className={`enum-story-shell enum-story-shell-${themeKey} enum-story-docs`} data-theme={themeKey}>
      <DocsContainer {...props} theme={themeKey === 'dark' ? dark : light} />
    </div>
  );
}

export default StorybookDocsContainer;
