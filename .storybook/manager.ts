import type { API_ComponentEntry } from 'storybook/internal/types';
import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';
import CoreApiStory, * as CoreApiSubStories from './stories/CoreApi.stories';
import CoreInitializationStory, * as CoreInitializationSubStories from './stories/CoreInitialization.stories';
import CorePatternsStory, * as CorePatternsSubStories from './stories/CorePatterns.stories';
import PluginAntdStory, * as PluginAntdSubStories from './stories/PluginAntd.stories';
import PluginReactI18nStory, * as PluginReactI18nSubStories from './stories/PluginReactI18n.stories';
import docTitles from './docs/titles.json';
import { getGlobalValueFromUrl } from './utils/global';
import { dark, light } from './utils/themes';
import './global-styles.css';

const globalTheme = getGlobalValueFromUrl('theme');
const globalLocale = getGlobalValueFromUrl('locale');
const isPreferDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const theme = (!globalTheme && isPreferDark) || globalTheme === 'dark' ? 'dark' : 'light';
const stories: { fileName: string; story: typeof CoreApiStory }[] = [
  { fileName: '.storybook/stories/CoreApi.stories.tsx', story: CoreApiStory },
  { fileName: '.storybook/stories/CoreInitialization.stories.tsx', story: CoreInitializationStory },
  { fileName: '.storybook/stories/CorePatterns.stories.tsx', story: CorePatternsStory },
  { fileName: '.storybook/stories/PluginAntd.stories.tsx', story: PluginAntdStory },
  { fileName: '.storybook/stories/PluginReactI18n.stories.tsx', story: PluginReactI18nStory },
];
const subStories = [
  ...getSubStories(CoreApiSubStories, '.storybook/stories/CoreApi.stories.tsx'),
  ...getSubStories(CoreInitializationSubStories, '.storybook/stories/CoreInitialization.stories.tsx'),
  ...getSubStories(CorePatternsSubStories, '.storybook/stories/CorePatterns.stories.tsx'),
  ...getSubStories(PluginAntdSubStories, '.storybook/stories/PluginAntd.stories.tsx'),
  ...getSubStories(PluginReactI18nSubStories, '.storybook/stories/PluginReactI18n.stories.tsx'),
];

const sidebarTitles: Partial<(typeof docTitles)[number]>[] = [
  ...docTitles,
  ...stories.map(({ fileName, story }) => ({
    fileName,
    title: story.title?.replace(/^[^/]*\//, ''),
    titleCN: (story as any).titleCN?.replace(/^[^/]*\//, ''),
  })),
  ...subStories,
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

function getSubStories(exports: Record<string, any>, fileName: string): Partial<(typeof docTitles)[number]>[] {
  return Object.values(exports)
    .filter((story) => story && story.name)
    .map((story) => ({
      fileName,
      title: story.name,
      titleCN: (story as any).nameCN,
    }));
}
