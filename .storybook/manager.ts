import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';
import { getGlobalValueFromUrl } from './utils/global';
import { dark, light } from './utils/themes';
import './global-styles.css';

const globalTheme = getGlobalValueFromUrl('theme');
const isPreferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

applyManagerTheme((!globalTheme && isPreferDark) || globalTheme === 'dark' ? 'dark' : 'light');
monitorTitleChanges();
applyCustomTitleSuffix();

function applyManagerTheme(theme: 'light' | 'dark') {
  document.documentElement.dataset.theme = theme;
  addons.setConfig({
    theme: createManagerTheme(theme),
  });
}

function createManagerTheme(theme: 'light' | 'dark') {
  if (theme === 'dark') {
    return create(dark);
  }
  return create(light);
}

function monitorTitleChanges() {
  const titleElement = document.querySelector('title');
  if (titleElement) {
    new MutationObserver(() => {
      applyCustomTitleSuffix();
    }).observe(titleElement, {
      childList: true,
    });
  }
}

function applyCustomTitleSuffix() {
  if (document.title.endsWith('⋅ Storybook')) {
    document.title = document.title.replace(/⋅\s*Storybook$/, `⋅ ${light.brandTitle}`);
  }
}
