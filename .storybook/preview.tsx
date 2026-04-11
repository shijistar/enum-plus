import type { PropsWithChildren } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { DocsContainer, type DocsContainerProps } from '@storybook/addon-docs/blocks';
import type { Preview, ReactRenderer } from '@storybook/react-vite';
import type { StoryContext } from 'storybook/internal/csf';
import { themes } from 'storybook/theming';
import { App as AntdApp, ConfigProvider as AntdConfigProvider, theme as antTheme } from 'antd';
import 'antd/dist/reset.css';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import storyI18n, { storyT } from './locales';
import { getGlobalValueFromUrl } from './utils/global';
import { dark, light } from './utils/themes';
import './styles.css';

const isPreferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

function getThemeKey(theme: unknown) {
  return (!theme && isPreferDark) || theme === 'dark' ? 'dark' : 'light';
}

function StorybookDocsContainer(props: PropsWithChildren<DocsContainerProps<ReactRenderer>>) {
  const globalTheme = getGlobalValueFromUrl('theme');
  const themeKey = getThemeKey(globalTheme);

  return (
    <div className={`enum-story-shell enum-story-shell-${themeKey} enum-story-docs`} data-theme={themeKey}>
      <DocsContainer {...props} theme={themeKey === 'dark' ? dark : light} />
    </div>
  );
}

function StorybookDecorator({ Story, context }: { Story: React.ComponentType; context: StoryContext<ReactRenderer> }) {
  const localeKey = context.globals.locale === 'zh-CN' ? 'zh-CN' : 'en-US';
  const locale = localeKey === 'zh-CN' ? zhCN : enUS;
  const themeKey = getThemeKey(context.globals.theme);
  const isDark = themeKey === 'dark';
  const themeName = isDark ? 'dark' : 'light';
  const [prevTheme, setPrevTheme] = useState(themeName);

  // Reload the page if the theme changes.
  useMemo(() => {
    if (themeName !== prevTheme) {
      setPrevTheme(themeName);
      (window.top ?? window.parent ?? window).location.reload();
    }
  }, [themeName, prevTheme]);

  useEffect(() => {
    if (storyI18n.language !== localeKey) {
      void storyI18n.changeLanguage(localeKey).then(() => {
        (window.top ?? window.parent ?? window).location.reload();
      });
    }
  }, [localeKey]);

  return (
    <AntdConfigProvider
      locale={locale}
      theme={{
        algorithm: isDark ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
          colorPrimary: isDark ? dark.colorPrimary : light.colorPrimary,
          borderRadius: 16,
          fontFamily: 'SF Pro Display, Segoe UI, PingFang SC, Helvetica Neue, Arial, sans-serif',
        },
      }}
    >
      <AntdApp>
        <div className={`enum-story-shell enum-story-shell-${themeName}`} data-theme={themeName}>
          <Story />
        </div>
      </AntdApp>
    </AntdConfigProvider>
  );
}

const preview: Preview = {
  initialGlobals: {
    locale: 'en-US',
    theme: isPreferDark ? 'dark' : 'light',
  },
  globalTypes: {
    locale: {
      description: storyT('storybook.preview.localeDescription'),
      toolbar: {
        icon: 'globe',
        items: [
          {
            value: 'en-US',
            title: storyT('storybook.preview.locale.enUS'),
            right: '🇺🇸',
          },
          {
            value: 'zh-CN',
            title: storyT('storybook.preview.locale.zhCN'),
            right: '🇨🇳',
          },
        ],
      },
    },
    theme: {
      description: storyT('storybook.preview.themeDescription'),
      toolbar: {
        icon: 'mirror',
        items: [
          {
            value: 'light',
            title: storyT('storybook.preview.theme.light'),
            right: '☀',
          },
          {
            value: 'dark',
            title: storyT('storybook.preview.theme.dark'),
            right: '☾',
          },
        ],
      },
    },
  },
  parameters: {
    layout: 'fullscreen',
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
    docs: {
      container: (props: PropsWithChildren<DocsContainerProps<ReactRenderer>>) => {
        return <StorybookDocsContainer {...props} />;
      },
    },
    options: {
      storySort: {
        order: ['Introduce', 'Install', 'Get Started', 'Core', 'Plugins'],
      },
    },
  },
  decorators: [
    (Story, context) => {
      return <StorybookDecorator Story={Story} context={context} />;
    },
  ],
};

export default preview;
