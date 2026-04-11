import { useEffect } from 'react';
import type { Preview, ReactRenderer } from '@storybook/react-vite';
import type { StoryContext } from 'storybook/internal/csf';
import { App as AntdApp, ConfigProvider as AntdConfigProvider, theme as antTheme } from 'antd';
import 'antd/dist/reset.css';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import storyI18n, { storyT } from './locales';
import './styles.css';

function StorybookDecorator({ Story, context }: { Story: React.ComponentType; context: StoryContext<ReactRenderer> }) {
  const localeKey = context.globals.locale === 'zh-CN' ? 'zh-CN' : 'en-US';
  const locale = localeKey === 'zh-CN' ? zhCN : enUS;
  const isDark = context.globals.backgrounds?.value === 'slate';

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
          colorPrimary: '#0f766e',
          borderRadius: 16,
          fontFamily: 'SF Pro Display, Segoe UI, PingFang SC, Helvetica Neue, Arial, sans-serif',
        },
      }}
    >
      <AntdApp>
        <div className="enum-story-shell">
          <Story />
        </div>
      </AntdApp>
    </AntdConfigProvider>
  );
}

const preview: Preview = {
  initialGlobals: {
    locale: 'en-US',
    backgrounds: {
      value: 'canvas',
      grid: false,
    },
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
    backgrounds: {
      options: {
        canvas: { name: storyT('storybook.preview.background.canvas'), value: '#f6f1e8' },
        slate: { name: storyT('storybook.preview.background.slate'), value: '#18222a' },
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
