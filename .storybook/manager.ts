import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'enum-plus Storybook',
    brandUrl: 'https://github.com/shijistar/enum-plus',
    colorPrimary: '#0f766e',
    colorSecondary: '#c2410c',
    appBg: '#f6f1e8',
    appContentBg: '#fffdf8',
    appBorderColor: '#e6dccd',
    appBorderRadius: 16,
  }),
});
