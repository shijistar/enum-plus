import type { API_ComponentEntry } from 'storybook/internal/types';
import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';
import docTitles from './docs/titles.json';
import storyTitles from './stories/titles.json';
import { getGlobalValueFromUrl } from './utils/global';
import { dark, light } from './utils/themes';
import './global-styles.css';

/** - todo: FullDemo继续优化，重点说明页面都是由枚举驱动，底部展示一下几个枚举的代码；切换语言改成下拉框，挪到下面的卡片中去； */

const globalTheme = getGlobalValueFromUrl('theme');
const globalLocale = getGlobalValueFromUrl('locale');
const isPreferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const theme = (!globalTheme && isPreferDark) || globalTheme === 'dark' ? 'dark' : 'light';

const sidebarTitles: Partial<(typeof docTitles)[number]>[] = [
  ...docTitles,
  ...(storyTitles as Array<{ fileName: string; title?: string; titleCN?: string }>).map((story) => ({
    fileName: story.fileName,
    title: story.title?.replace(/^[^/]*\//, ''),
    titleCN: story.titleCN?.replace(/^[^/]*\//, ''),
  })),
];

document.documentElement.dataset.theme = theme;
addons.setConfig({
  layoutCustomisations: {
    showPanel: () => false,
  },
  sidebar: {
    renderLabel: (options) => {
      if (globalLocale === 'zh-CN') {
        const matchItem = sidebarTitles.find(
          (item) => `./${item.fileName}` === (options as API_ComponentEntry).importPath && item.title === options.name,
        );
        if (matchItem) {
          return matchItem.titleCN || options.name;
        }
      }
      return options.name;
    },
  },
  theme: createManagerTheme(theme),
});
monitorTitleChanges();
applyCustomTitleSuffix();

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
