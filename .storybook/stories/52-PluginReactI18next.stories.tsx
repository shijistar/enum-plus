import { useEffect, useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Card, Descriptions, Space, Tag, Typography } from 'antd';
import reactI18nextPlugin from '../../packages/plugin-react-i18next/src';
import { Enum } from '../../src';
import { storyT, useStoryLocale, useStoryT } from '../locales';
import { CodePreview, JsonPreview, StoryPage, StorySection, TwoColumn } from './shared/demo';
import { ensureStoryI18n } from './shared/i18n';

const { Paragraph } = Typography;

const meta: Meta = {
  title: 'Plugins/04 react-i18next',
  parameters: {
    docs: {
      description: {
        component: storyT('storybook.stories.PluginReactI18next.metaDescription'),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const INSTALL_CODE = `import reactI18nextPlugin from '@enum-plus/plugin-react-i18next';\nimport { Enum } from 'enum-plus';\n\nEnum.install(reactI18nextPlugin, {\n  localize: {\n    tOptions: { ns: 'translation' },\n  },\n});`;

function ReactI18nextStory() {
  const t = useStoryT();
  const storyLocale = useStoryLocale();
  const instance = ensureStoryI18n();
  const [renderTick, setRenderTick] = useState(0);

  useEffect(() => {
    void instance.changeLanguage(storyLocale);
  }, [instance, storyLocale]);

  useEffect(() => {
    const previousLocalize = Enum.localize;
    reactI18nextPlugin({ localize: { tOptions: { ns: 'translation' } } }, Enum as never);
    return () => {
      Enum.localize = previousLocalize;
    };
  }, []);

  const statusEnum = useMemo(
    () =>
      Enum(
        {
          Draft: { value: 'draft', label: 'story.status.draft', tone: 'default' },
          Review: { value: 'review', label: 'story.status.review', tone: 'processing' },
          Published: { value: 'published', label: 'story.status.published', tone: 'success' },
          Archived: { value: 'archived', label: 'story.status.archived', tone: 'default' },
        },
        {
          name: 'story.status.enumName',
        },
      ),
    [renderTick],
  );

  return (
    <StoryPage
      title={t('storybook.stories.PluginReactI18next.pageTitle')}
      description={t('storybook.stories.PluginReactI18next.pageDescription')}
      highlights={[
        t('storybook.stories.PluginReactI18next.highlights.reactI18next'),
        t('storybook.stories.PluginReactI18next.highlights.getI18n'),
        t('storybook.stories.PluginReactI18next.highlights.noAutoRefresh'),
        t('storybook.stories.PluginReactI18next.highlights.lightweight'),
      ]}
    >
      <StorySection
        title={t('storybook.stories.PluginReactI18next.comparisonTitle')}
        description={t('storybook.stories.PluginReactI18next.comparisonDescription')}
      >
        <TwoColumn
          left={
            <Card size="small">
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Space wrap>
                  <Button onClick={() => void instance.changeLanguage('zh-CN')}>
                    {t('storybook.stories.PluginReactI18next.switchZh')}
                  </Button>
                  <Button onClick={() => void instance.changeLanguage('en-US')}>
                    {t('storybook.stories.PluginReactI18next.switchEn')}
                  </Button>
                  <Button type="primary" onClick={() => setRenderTick((value) => value + 1)}>
                    {t('storybook.stories.PluginReactI18next.rerender')}
                  </Button>
                </Space>
                <Descriptions
                  size="small"
                  column={1}
                  items={[
                    {
                      key: 'lang',
                      label: t('storybook.stories.PluginReactI18next.currentLanguage'),
                      children: instance.language,
                    },
                    {
                      key: 'name',
                      label: t('storybook.stories.PluginReactI18next.enumName'),
                      children: statusEnum.name,
                    },
                    {
                      key: 'label',
                      label: t('storybook.stories.PluginReactI18next.currentLabel'),
                      children: statusEnum.label('review'),
                    },
                    {
                      key: 'tick',
                      label: t('storybook.stories.PluginReactI18next.rerenderTick'),
                      children: renderTick,
                    },
                  ]}
                />
                <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  {t('storybook.stories.PluginReactI18next.note')}
                </Paragraph>
              </Space>
            </Card>
          }
          right={<CodePreview title={t('storybook.stories.PluginReactI18next.codeTitle')} code={INSTALL_CODE} />}
        />
      </StorySection>

      <StorySection
        title={t('storybook.stories.PluginReactI18next.derivedTitle')}
        description={t('storybook.stories.PluginReactI18next.derivedDescription')}
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Space wrap>
            {statusEnum.items.map((item) => {
              const raw = item.raw as { tone?: string };
              return (
                <Tag key={item.key} color={raw.tone}>
                  {item.label}
                </Tag>
              );
            })}
          </Space>
          <TwoColumn
            left={
              <JsonPreview title={t('storybook.stories.PluginReactI18next.listTitle')} value={statusEnum.toList()} />
            }
            right={
              <JsonPreview title={t('storybook.stories.PluginReactI18next.mapTitle')} value={statusEnum.toMap()} />
            }
          />
        </Space>
      </StorySection>
    </StoryPage>
  );
}

export const Playground: Story = {
  render: function Render() {
    return <ReactI18nextStory />;
  },
};
