import { GLOBALS_UPDATED, SET_GLOBALS, UPDATE_GLOBALS } from 'storybook/internal/core-events';
import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';
import { getGlobalValueFromUrl } from './utils/global';
import { dark, light } from './utils/themes';

const globalTheme = getGlobalValueFromUrl('theme');
const isPreferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

function createManagerTheme(theme: 'light' | 'dark') {
  if (theme === 'dark') {
    return create(dark);
  }
  return create(light);
}

function applyManagerTheme(theme: 'light' | 'dark') {
  document.documentElement.dataset.theme = theme;
  addons.setConfig({
    theme: createManagerTheme(theme),
  });
}

applyManagerTheme((!globalTheme && isPreferDark) || globalTheme === 'dark' ? 'dark' : 'light');

addons.getChannel().on(GLOBALS_UPDATED, ({ globals }) => {
  const isDark = (!globals?.theme && isPreferDark) || globals?.theme === 'dark';
  applyManagerTheme(isDark ? 'dark' : 'light');
});
