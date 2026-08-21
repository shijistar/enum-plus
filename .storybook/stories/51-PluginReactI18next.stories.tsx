import { useContext, useEffect, useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Card, Descriptions, Segmented, Select, Space, Table, Tag, Typography } from 'antd';
import reactI18nextPlugin from '../../packages/plugin-react-i18next/src';
import { Enum } from '../../src';
import { storyT, useStoryLocale, useStoryT } from '../locales';
import { CodePreview, JsonPreview, StoryPage, StorySection, TwoColumn } from './shared/demo';
import { ensureStoryI18n } from './shared/i18n';
import RefreshEnumContext from './shared/RefreshEnumContext';

const { Paragraph } = Typography;

const meta: Meta = {
  title: 'Plugins/react-i18next',
  // @ts-expect-error: because titleCN is an extension field
  titleCN: '插件/react-i18next',
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

const INSTALL_CODE = `import { Enum } from 'enum-plus';\nimport reactI18nextPlugin from '@enum-plus/plugin-react-i18next';\n\nEnum.install(reactI18nextPlugin);`;

function ReactI18nextStory() {
  const t = useStoryT();
  const storyLocale = useStoryLocale();
  const instance = ensureStoryI18n();
  const { changeLang } = useContext(RefreshEnumContext);
  const [renderTick, setRenderTick] = useState(0);
  const [refreshStrategy, setRefreshStrategy] = useState<string>('manual');

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

  useEffect(() => {
    void instance.changeLanguage(storyLocale);
  }, [instance, storyLocale]);

  useEffect(() => {
    const previousLocalize = Enum.localize;
    Enum.install(reactI18nextPlugin as never);
    setRenderTick((value) => value + 1);
    return () => {
      Enum.localize = previousLocalize;
    };
  }, []);

  const StatusEnum = useMemo(
    () =>
      Enum(
        {
          Draft: { value: 'draft', label: 'storybook.enums.status.draft', tone: 'default' },
          Review: { value: 'review', label: 'storybook.enums.status.review', tone: 'processing' },
          Published: { value: 'published', label: 'storybook.enums.status.published', tone: 'success' },
        },
        {
          name: 'storybook.enums.status.enumName',
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
        t('storybook.stories.PluginReactI18next.highlights.noAutoRefresh'),
        t('storybook.stories.PluginReactI18next.highlights.lightweight'),
      ]}
    >
      <StorySection
        title={t('storybook.stories.PluginReactI18next.codeTitle')}
        description={t('storybook.stories.PluginReactI18next.comparisonDescription')}
      >
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
                  children: StatusEnum.name,
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
              dataSource={StatusEnum.items}
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
        title={t('storybook.stories.PluginReactI18next.derivedTitle')}
        description={t('storybook.stories.PluginReactI18next.derivedDescription')}
      >
        <Space orientation="vertical" size={16} style={{ width: '100%' }}>
          <Space wrap>
            {StatusEnum.items.map((item) => {
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
                title={t('storybook.stories.PluginReactI18next.listTitle')}
                value={StatusEnum.toList()}
              />
            }
            right={
              <JsonPreview
                forceEnumText
                i18n={instance}
                title={t('storybook.stories.PluginReactI18next.mapTitle')}
                value={StatusEnum.toMap()}
              />
            }
          />
        </Space>
      </StorySection>
    </StoryPage>
  );
}

export const Playground: Story = {
  name: 'react-i18next',
  // @ts-expect-error: because nameCN is an extension field
  nameCN: 'react-i18next',
  render: function Render() {
    return <ReactI18nextStory />;
  },
};
