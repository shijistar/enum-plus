import type { StorybookConfig } from '@storybook/react-vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vite';

const currentDir = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['./docs/**/*.mdx', './stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    defaultName: 'Docs',
  },
  async viteFinal(baseConfig) {
    return mergeConfig(baseConfig, {
      resolve: {
        alias: {
          'enum-plus': resolve(currentDir, '../src/index.ts'),
          'enum-plus/extension': resolve(currentDir, '../src/extension.d.ts'),
          '@enum-plus/plugin-antd': resolve(currentDir, '../packages/plugin-antd/src/index.ts'),
          '@enum-plus/plugin-react': resolve(currentDir, '../packages/plugin-react/src/index.ts'),
        },
      },
    });
  },
};

export default config;
