import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

let initialized = false;
const storyI18n = i18next;

export function ensureStoryI18n() {
  if (initialized) {
    return storyI18n;
  }

  storyI18n.use(initReactI18next).init({
    lng: 'zh-CN',
    fallbackLng: 'zh-CN',
    initImmediate: false,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      'zh-CN': {
        translation: {
          'story.status.enumName': '内容状态',
          'story.status.draft': '草稿',
          'story.status.review': '审核中',
          'story.status.published': '已发布',
          'story.status.archived': '已归档',
        },
      },
      'en-US': {
        translation: {
          'story.status.enumName': 'Content Status',
          'story.status.draft': 'Draft',
          'story.status.review': 'In Review',
          'story.status.published': 'Published',
          'story.status.archived': 'Archived',
        },
      },
    },
  });

  initialized = true;
  return storyI18n;
}
