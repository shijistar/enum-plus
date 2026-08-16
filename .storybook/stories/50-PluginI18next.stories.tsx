import { useContext, useEffect, useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { createInstance } from 'i18next';
import { Button, Card, Descriptions, Segmented, Select, Space, Table, Tag, Typography } from 'antd';
import i18nextPlugin from '../../packages/plugin-i18next/src';
import { Enum } from '../../src';
import storyI18n, { storyT, useStoryT } from '../locales';
import { CodePreview, JsonPreview, StoryPage, StorySection, TwoColumn } from './shared/demo';
import RefreshEnumContext from './shared/RefreshEnumContext';

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

const INSTALL_CODE = `import { Enum } from 'enum-plus';\nimport i18nextPlugin from '@enum-plus/plugin-i18next';\n\nEnum.install(i18nextPlugin, {\n  localize: {\n    instance: i18next\n  },\n});`;
const instance = createInstance();
void instance.init({
  lng: storyI18n.language,
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

const PublishingStatus = Enum(
  {
    Draft: { value: 'draft', label: 'status.draft', tone: 'default' },
    Review: { value: 'review', label: 'status.review', tone: 'processing' },
    Published: { value: 'published', label: 'status.published', tone: 'success' },
  },
  { name: 'status.enumName' },
);

function I18nextStory() {
  const t = useStoryT();
  const [renderTick, setRenderTick] = useState(0);
  const { changeLang } = useContext(RefreshEnumContext);
  const [refreshStrategy, setRefreshStrategy] = useState<string>('manual');

  useEffect(() => {
    const previousLocalize = Enum.localize;
    Enum.install(i18nextPlugin as never, { localize: { instance } });
    setRenderTick((tick) => tick + 1);
    return () => {
      Enum.localize = previousLocalize;
    };
  }, [instance]);

  const refreshStrategyItems = useMemo(
    () => [
      {
        key: 'manual',
        value: 'manual',
        label: t('storybook.stories.Plugin.RefreshStrategy.manual'),
        description: t('storybook.stories.Plugin.RefreshStrategy.manual.title'),
      },
      {
        key: 'auto',
        value: 'auto',
        label: t('storybook.stories.Plugin.RefreshStrategy.auto'),
        description: t('storybook.stories.Plugin.RefreshStrategy.auto.title'),
      },
    ],
    [t],
  );

  return (
    <StoryPage
      title={t('storybook.stories.PluginI18next.pageTitle')}
      description={t('storybook.stories.PluginI18next.pageDescription')}
      highlights={[
        t('storybook.stories.PluginI18next.highlights.i18next'),
        t('storybook.stories.PluginI18next.highlights.stringLocalization'),
        t('storybook.stories.PluginI18next.highlights.lowCoupling'),
      ]}
    >
      <StorySection title={t('storybook.stories.PluginI18next.codeTitle')}>
        <CodePreview code={INSTALL_CODE} />
      </StorySection>

      <StorySection
        title={t('storybook.stories.PluginI18next.runtimeTitle')}
        description={t('storybook.stories.PluginI18next.runtimeDescription')}
      >
        <Card size="small">
          <Space orientation="vertical" size={16} style={{ width: '100%' }}>
            <Space orientation="vertical" style={{ width: '100%' }}>
              <Segmented
                size="large"
                value={refreshStrategy}
                options={refreshStrategyItems}
                onChange={(key) => setRefreshStrategy(key)}
              />
              <Typography.Text type="secondary" style={{ fontSize: 14 }}>
                {refreshStrategyItems.find((item) => item.key === refreshStrategy)?.description}
              </Typography.Text>
            </Space>
            <Space wrap size={16}>
              <Select
                value={instance.language}
                options={[
                  { value: 'zh-CN', label: t('storybook.preview.locale.zhCN') },
                  { value: 'en-US', label: t('storybook.preview.locale.enUS') },
                ]}
                onChange={(value) => {
                  void instance.changeLanguage(value);
                  if (refreshStrategy === 'auto') {
                    changeLang(value);
                  }
                }}
              />
              {refreshStrategy === 'manual' && (
                <Button type="primary" onClick={() => setRenderTick((value) => value + 1)}>
                  {t('storybook.stories.PluginI18next.rerender')}
                </Button>
              )}
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
                  children: PublishingStatus.name,
                },
                { key: 'tick', label: t('storybook.stories.PluginI18next.rerenderTick'), children: renderTick },
              ]}
            />

            <Table
              size="small"
              bordered
              tableLayout="fixed"
              columns={[
                {
                  dataIndex: 'key',
                  title: 'key',
                  width: '33%',
                },
                {
                  dataIndex: 'label',
                  title: 'label',
                  width: '34%',
                },
                {
                  dataIndex: 'value',
                  title: 'value',
                  width: '33%',
                },
              ]}
              dataSource={PublishingStatus.items}
              pagination={false}
            />

            {refreshStrategy === 'manual' && (
              <Paragraph type="warning" style={{ marginBottom: 0 }}>
                {t('storybook.stories.PluginI18next.note')}
              </Paragraph>
            )}
          </Space>
        </Card>
      </StorySection>

      <StorySection
        title={t('storybook.stories.PluginI18next.structureTitle')}
        description={t('storybook.stories.PluginI18next.structureDescription')}
      >
        <Space orientation="vertical" size={16} style={{ width: '100%' }}>
          <Space wrap>
            {PublishingStatus.items.map((item) => {
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
                value={PublishingStatus.toList()}
              />
            }
            right={
              <JsonPreview
                forceEnumText
                i18n={instance}
                title={t('storybook.stories.PluginI18next.mapTitle')}
                value={PublishingStatus.toMap()}
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
  name: 'i18next',
  // @ts-expect-error: because nameCN is an extension field
  nameCN: 'i18next',
  render: function Render() {
    return <I18nextStory />;
  },
};
