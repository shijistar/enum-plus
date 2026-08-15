import { useEffect, useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { createInstance } from 'i18next';
import { Button, Card, Descriptions, Space, Tag, Typography } from 'antd';
import i18nextPlugin from '../../packages/plugin-i18next/src';
import { Enum } from '../../src';
import { storyT, useStoryLocale, useStoryT } from '../locales';
import { CodePreview, JsonPreview, StoryPage, StorySection, TwoColumn } from './shared/demo';

const { Paragraph, Text } = Typography;

const meta: Meta = {
  title: 'Plugins/i18next',
  // @ts-expect-error: because titleCN is an extension field
  titleCN: '插件/i18next',
  parameters: {
    docs: {
      description: {
        component: storyT('storybook.stories.PluginI18next.metaDescription'),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const INSTALL_CODE = `import i18nextPlugin from '@enum-plus/plugin-i18next';\nimport { Enum } from 'enum-plus';\n\nEnum.install(i18nextPlugin, {\n  localize: {\n    instance: i18next,\n    tOptions: { ns: 'translation' },\n  },\n});`;

function createStoryI18next(locale: 'en-US' | 'zh-CN') {
  const instance = createInstance();
  void instance.init({
    lng: locale,
    fallbackLng: 'en-US',
    initImmediate: false,
    resources: {
      'en-US': {
        translation: {
          'status.enumName': 'Publishing Status',
          'status.draft': 'Draft',
          'status.review': 'In Review',
          'status.published': 'Published',
        },
      },
      'zh-CN': {
        translation: {
          'status.enumName': '发布状态',
          'status.draft': '草稿',
          'status.review': '审核中',
          'status.published': '已发布',
        },
      },
    },
  });
  return instance;
}

function I18nextStory() {
  const storyLocale = useStoryLocale();
  const t = useStoryT();
  const [renderTick, setRenderTick] = useState(0);
  const instance = useMemo(() => createStoryI18next(storyLocale), [storyLocale]);

  useEffect(() => {
    const previousLocalize = Enum.localize;
    i18nextPlugin({ localize: { instance } }, Enum as never);
    return () => {
      Enum.localize = previousLocalize;
    };
  }, [instance]);

  const publishingStatus = useMemo(
    () =>
      Enum(
        {
          Draft: { value: 'draft', label: 'status.draft', tone: 'default' },
          Review: { value: 'review', label: 'status.review', tone: 'processing' },
          Published: { value: 'published', label: 'status.published', tone: 'success' },
        },
        { name: 'status.enumName' },
      ),
    [renderTick],
  );

  return (
    <StoryPage
      title={t('storybook.stories.PluginI18next.pageTitle')}
      description={t('storybook.stories.PluginI18next.pageDescription')}
      highlights={[
        t('storybook.stories.PluginI18next.highlights.i18next'),
        t('storybook.stories.PluginI18next.highlights.stringLocalization'),
        t('storybook.stories.PluginI18next.highlights.hostRefresh'),
        t('storybook.stories.PluginI18next.highlights.lowCoupling'),
      ]}
    >
      <StorySection
        title={t('storybook.stories.PluginI18next.runtimeTitle')}
        description={t('storybook.stories.PluginI18next.runtimeDescription')}
      >
        <TwoColumn
          left={
            <Card size="small">
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Space wrap>
                  <Button onClick={() => void instance.changeLanguage('zh-CN')}>
                    {t('storybook.stories.PluginI18next.switchZh')}
                  </Button>
                  <Button onClick={() => void instance.changeLanguage('en-US')}>
                    {t('storybook.stories.PluginI18next.switchEn')}
                  </Button>
                  <Button type="primary" onClick={() => setRenderTick((value) => value + 1)}>
                    {t('storybook.stories.PluginI18next.rerender')}
                  </Button>
                </Space>

                <Descriptions
                  size="small"
                  column={1}
                  items={[
                    {
                      key: 'language',
                      label: t('storybook.stories.PluginI18next.currentI18n'),
                      children: instance.language,
                    },
                    {
                      key: 'name',
                      label: t('storybook.stories.PluginI18next.enumName'),
                      children: publishingStatus.name,
                    },
                    {
                      key: 'label',
                      label: t('storybook.stories.PluginI18next.enumLabel'),
                      children: publishingStatus.label('review'),
                    },
                    { key: 'tick', label: t('storybook.stories.PluginI18next.rerenderTick'), children: renderTick },
                  ]}
                />

                <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  {t('storybook.stories.PluginI18next.note')}
                </Paragraph>
              </Space>
            </Card>
          }
          right={<CodePreview title={t('storybook.stories.PluginI18next.codeTitle')} code={INSTALL_CODE} />}
        />
      </StorySection>

      <StorySection
        title={t('storybook.stories.PluginI18next.structureTitle')}
        description={t('storybook.stories.PluginI18next.structureDescription')}
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Space wrap>
            {publishingStatus.items.map((item) => {
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
              <JsonPreview
                forceEnumText
                i18n={instance}
                title={t('storybook.stories.PluginI18next.listTitle')}
                value={publishingStatus.toList()}
              />
            }
            right={
              <JsonPreview
                forceEnumText
                i18n={instance}
                title={t('storybook.stories.PluginI18next.mapTitle')}
                value={publishingStatus.toMap()}
              />
            }
          />
          <Card size="small">
            <Text type="secondary">{`renderTick = ${renderTick}`}</Text>
          </Card>
        </Space>
      </StorySection>
    </StoryPage>
  );
}

export const Playground: Story = {
  render: function Render() {
    return <I18nextStory />;
  },
};
