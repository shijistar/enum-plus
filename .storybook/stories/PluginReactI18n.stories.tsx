import { type ReactNode, useEffect, useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import i18next from 'i18next';
import { Button, Card, Descriptions, Input, Select, Space, Table, Tag, Typography } from 'antd';
import { reactI18nextPlugin } from '../../packages/plugin-react/src';
import { Enum } from '../../src';
import { storyT, useStoryLocale, useStoryT } from '../locales';
import { StoryPage, StorySection, TwoColumn } from './shared/demo';
import { ensureStoryI18n } from './shared/i18n';

let reactI18nextPluginInstalled = false;

function ensureReactI18nextPlugin() {
  if (reactI18nextPluginInstalled) {
    return;
  }

  Enum.install(reactI18nextPlugin as unknown as Parameters<typeof Enum.install>[0], {
    useTranslationOptions: { ns: 'translation' },
    defaultSearchField: 'label',
  });

  reactI18nextPluginInstalled = true;
}

const { Text } = Typography;
const activeI18n = i18next;

const meta: Meta = {
  title: 'Plugins/React I18n',
  parameters: {
    docs: {
      description: {
        component: storyT('storybook.stories.PluginReactI18n.metaDescription'),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

type ReactLocalizedEnum = ReturnType<typeof Enum> & {
  isMatch(search: string | undefined, item: unknown): boolean;
  isMatchCaseSensitive(search: string | undefined, item: unknown): boolean;
};

interface LocalizedStatusItem {
  key: string;
  value: string;
  label: ReactNode;
}

function ReactI18nDemo() {
  ensureReactI18nextPlugin();
  const t = useStoryT();
  const storyLocale = useStoryLocale();
  const instance = ensureStoryI18n();
  const [readyVersion, setReadyVersion] = useState(0);
  const [selectedValue, setSelectedValue] = useState<string>('draft');
  const [searchText, setSearchText] = useState(
    storyLocale === 'en-US'
      ? t('storybook.stories.PluginReactI18n.defaultSearch.enUS')
      : t('storybook.stories.PluginReactI18n.defaultSearch.zhCN'),
  );
  const [language, setLanguage] = useState(instance.language);

  useEffect(() => {
    if (instance.language !== storyLocale) {
      void instance.changeLanguage(storyLocale);
    }
  }, [instance, storyLocale]);

  useEffect(() => {
    const previousLocalize = Enum.localize;

    setReadyVersion((value) => value + 1);

    const handleLanguage = (nextLanguage: string) => {
      setLanguage(nextLanguage);
      setSearchText(
        nextLanguage === 'en-US'
          ? t('storybook.stories.PluginReactI18n.defaultSearch.enUS')
          : t('storybook.stories.PluginReactI18n.defaultSearch.zhCN'),
      );
    };
    instance.on('languageChanged', handleLanguage);

    return () => {
      instance.off('languageChanged', handleLanguage);
      Enum.localize = previousLocalize;
    };
  }, [instance, t]);

  const localizedStatusEnum = useMemo(
    () =>
      Enum(
        {
          Draft: { value: 'draft', label: 'story.status.draft' },
          Review: { value: 'review', label: 'story.status.review' },
          Published: { value: 'published', label: 'story.status.published' },
          Archived: { value: 'archived', label: 'story.status.archived' },
        },
        {
          name: 'story.status.enumName',
        },
      ) as ReactLocalizedEnum,
    [readyVersion],
  );
  const localizedItems = localizedStatusEnum.items as unknown as LocalizedStatusItem[];

  const fuzzyRows = localizedItems.filter((item) => localizedStatusEnum.isMatch(searchText, item));
  const strictRows = localizedItems.filter((item) => localizedStatusEnum.isMatchCaseSensitive(searchText, item));

  return (
    <StoryPage
      title={t('storybook.stories.PluginReactI18n.page.title')}
      description={t('storybook.stories.PluginReactI18n.page.description')}
      highlights={[
        t('storybook.stories.PluginReactI18n.highlights.reactI18next'),
        t('storybook.stories.PluginReactI18n.highlights.refresh'),
        t('storybook.stories.PluginReactI18n.highlights.isMatch'),
        t('storybook.stories.PluginReactI18n.highlights.selectSearch'),
      ]}
    >
      <StorySection
        title={t('storybook.stories.PluginReactI18n.section.language.title')}
        description={t('storybook.stories.PluginReactI18n.section.language.description')}
      >
        <TwoColumn
          left={
            <Card size="small" title={t('storybook.stories.PluginReactI18n.card.interaction')}>
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Space wrap>
                  <Button
                    type={language === 'zh-CN' ? 'primary' : 'default'}
                    onClick={() => void activeI18n.changeLanguage('zh-CN')}
                  >
                    {storyT('storybook.preview.locale.zhCN')}
                  </Button>
                  <Button
                    type={language === 'en-US' ? 'primary' : 'default'}
                    onClick={() => void activeI18n.changeLanguage('en-US')}
                  >
                    {storyT('storybook.preview.locale.enUS')}
                  </Button>
                </Space>

                <Select
                  value={selectedValue}
                  showSearch
                  style={{ width: '100%' }}
                  options={localizedItems}
                  filterOption={(input, option) => localizedStatusEnum.isMatch(input, option)}
                  onChange={(value) => setSelectedValue(value)}
                />

                <Descriptions
                  size="small"
                  column={1}
                  items={[
                    {
                      key: 'lang',
                      label: t('storybook.stories.PluginReactI18n.field.currentLanguage'),
                      children: language,
                    },
                    {
                      key: 'name',
                      label: t('storybook.stories.PluginReactI18n.field.enumName'),
                      children: localizedStatusEnum.name || '-',
                    },
                    {
                      key: 'label',
                      label: t('storybook.stories.PluginReactI18n.field.labelValue'),
                      children: localizedStatusEnum.label(selectedValue),
                    },
                  ]}
                />
              </Space>
            </Card>
          }
          right={
            <Card size="small" title={t('storybook.stories.PluginReactI18n.card.options')}>
              <Space wrap>
                {localizedItems.map((item) => (
                  <Tag key={item.key} color="blue">
                    {item.label}
                  </Tag>
                ))}
              </Space>
            </Card>
          }
        />
      </StorySection>

      <StorySection
        title={t('storybook.stories.PluginReactI18n.section.search.title')}
        description={t('storybook.stories.PluginReactI18n.section.search.description')}
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Input
            value={searchText}
            style={{ maxWidth: 320 }}
            addonBefore={t('storybook.stories.PluginReactI18n.input.search')}
            onChange={(event) => setSearchText(event.target.value)}
          />

          <Table
            className="ep-table"
            rowKey="mode"
            pagination={false}
            columns={[
              { title: t('storybook.stories.PluginReactI18n.table.matchMode'), dataIndex: 'mode', width: 180 },
              {
                title: t('storybook.stories.PluginReactI18n.table.matchedItems'),
                dataIndex: 'items',
                render: (items: LocalizedStatusItem[]) => (
                  <Space wrap>
                    {items.length > 0 ? (
                      items.map((item) => <Tag key={item.key}>{item.label}</Tag>)
                    ) : (
                      <Text type="secondary">{t('storybook.stories.PluginReactI18n.noResult')}</Text>
                    )}
                  </Space>
                ),
              },
            ]}
            dataSource={[
              { mode: t('storybook.stories.PluginReactI18n.mode.match'), items: fuzzyRows },
              { mode: t('storybook.stories.PluginReactI18n.mode.matchCaseSensitive'), items: strictRows },
            ]}
          />
        </Space>
      </StorySection>
    </StoryPage>
  );
}

export const Playground: Story = {
  render: function Render() {
    return <ReactI18nDemo />;
  },
};
