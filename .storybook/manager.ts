import type { API_ComponentEntry } from 'storybook/internal/types';
import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';
import docTitles from './docs/titles.json';
import storyTitles from './stories/titles.json';
import { getGlobalValueFromUrl } from './utils/global';
import { dark, light } from './utils/themes';
import './global-styles.css';

/**
 * - todo: react-i18next的demo说返回了组件，而且也不应该自动刷新？
 * - todo: why use enum-plus的demo说的太简单了
 * - todo: Localization 和 composition 应该分开
 * - todo: antd的组件类型不够
 * - todo: vue-i18n不能自动切换刷新
 * - todo: 两种vue的组件 output里都写着[ReactElement]？
 * - todo: 能否通过mock模块让next-international跑起来，或者仅在示例代码或文案中使用此插件，但底层还是基于react插件
 * - todo: FullDemo继续优化，重点说明页面都是由枚举驱动，底部展示一下几个枚举的代码；切换语言改成下拉框，挪到下面的卡片中去；
 * - todo: enum-plus添加到awesome仓库中
 */

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
