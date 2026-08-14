import { lazy, Suspense, useEffect, useState } from 'react';
import type { ReactRenderer } from '@storybook/react-vite';
import type { StoryContext } from 'storybook/internal/csf';
import darkAlgorithm from 'antd/es/theme/themes/dark';
import defaultAlgorithm from 'antd/es/theme/themes/default';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import storyI18n from '../locales';
import { dark, getThemeKey, light } from '../utils/themes';

// @ts-expect-error
const AppLazy = lazy(() => import('antd/es/app'));
// @ts-expect-error
const ConfigProviderLazy = lazy(() => import('antd/es/config-provider'));

function useStorybookDecorator(Story: React.ComponentType, context: StoryContext<ReactRenderer>) {
  const localeKey = context.globals.locale === 'zh-CN' ? 'zh-CN' : 'en-US';
  const locale = localeKey === 'zh-CN' ? zhCN : enUS;
  const themeKey = getThemeKey(context.globals.theme);
  const isDark = themeKey === 'dark';
  const themeName = isDark ? 'dark' : 'light';
  const [prevTheme, setPrevTheme] = useState(themeName);

  // Reload the page if the theme changes.
  useEffect(() => {
    if (themeName && themeName !== prevTheme) {
      setPrevTheme(themeName);
      (window.top ?? window.parent ?? window).location.reload();
    }
  }, [themeName, prevTheme]);

  useEffect(() => {
    if (localeKey && storyI18n.language !== localeKey) {
      void storyI18n.changeLanguage(localeKey).then(() => {
        (window.top ?? window.parent ?? window).location.reload();
      });
    }
  }, [localeKey]);

  return (
    <Suspense fallback={null}>
      <ConfigProviderLazy
        locale={locale}
        theme={{
          algorithm: isDark ? darkAlgorithm : defaultAlgorithm,
          token: {
            colorPrimary: isDark ? dark.colorPrimary : light.colorPrimary,
            fontSize: 16,
            fontFamily: 'SF Pro Display, Segoe UI, PingFang SC, Helvetica Neue, Arial, sans-serif',
          },
        }}
      >
        <Suspense fallback={null}>
          <AppLazy>
            <div className={`enum-story-shell enum-story-shell-${themeName}`} data-theme={themeName}>
              <Story />
            </div>
          </AppLazy>
        </Suspense>
      </ConfigProviderLazy>
    </Suspense>
  );
}

export default useStorybookDecorator;
