import type { PropsWithChildren } from 'react';
import { lazy, Suspense } from 'react';
import { type DocsContainerProps } from '@storybook/addon-docs/blocks';
import type { Preview, ReactRenderer } from '@storybook/react-vite';
import antdPlugin from '../packages/plugin-antd/src';
import 'antd/dist/reset.css';
import { reactI18nextPlugin } from '../packages/plugin-react/src';
import { Enum } from '../src';
import useStorybookDecorator from './components/useStorybookDecorator';
import { storyT } from './locales';
import { ensureStoryI18n } from './stories/shared/i18n';
import './story-styles.css';

Enum.install(reactI18nextPlugin as unknown as Parameters<typeof Enum.install>[0]);
Enum.install(antdPlugin as unknown as Parameters<typeof Enum.install>[0]);
ensureStoryI18n();

// @ts-expect-error
const ThemedDocsContainer = lazy(() => import('./components/StorybookDocsContainer.js'));

const preview: Preview = {
  initialGlobals: {
    locale: '',
    theme: '',
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
        return (
          <Suspense fallback={null}>
            <ThemedDocsContainer {...props} />
          </Suspense>
        );
      },
    },
  },
  decorators: [
    (Story, context) => {
      return useStorybookDecorator(Story, context);
    },
  ],
};

export default preview;
