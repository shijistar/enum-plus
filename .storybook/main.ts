import type { StorybookConfig } from '@storybook/react-vite';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vite';

//@ts-expect-error
const currentDir = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['./docs/**/*.mdx', './stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  staticDirs: ['../public'],
  managerHead: (head) => `
    ${head}
    <link rel="icon" type="image/svg+xml" href="/logo/enum-plus2.svg" />
  `,
  docs: {
    defaultName: 'Docs',
  },
  async viteFinal(baseConfig) {
    return mergeConfig(baseConfig, {});
  },
};

export default config;
