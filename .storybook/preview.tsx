import type { Preview } from '@storybook/react-vite';
import { App as AntdApp, ConfigProvider as AntdConfigProvider, theme as antTheme } from 'antd';
import 'antd/dist/reset.css';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import './styles.css';

const preview: Preview = {
  initialGlobals: {
    locale: 'zh-CN',
    backgrounds: {
      value: 'canvas',
      grid: false,
    },
  },
  globalTypes: {
    locale: {
      description: '文档语言',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'zh-CN', title: '中文', right: 'CN' },
          { value: 'en-US', title: 'English', right: 'EN' },
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
        canvas: { name: 'Warm Canvas', value: '#f6f1e8' },
        slate: { name: 'Slate', value: '#18222a' },
      },
    },
    options: {
      storySort: {
        order: ['文档', ['概览', '安装', '快速开始'], '核心能力', '插件'],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const locale = context.globals.locale === 'en-US' ? enUS : zhCN;
      const isDark = context.globals.backgrounds?.value === 'slate';

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
    },
  ],
};

export default preview;
