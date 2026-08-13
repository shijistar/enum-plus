import { useEffect, useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, Descriptions, Segmented, Select, Space, Tag, Typography } from 'antd';
import { Enum } from '../../src';
import { storyT, useStoryLocale, useStoryT } from '../locales';
import { JsonPreview, StoryPage, StorySection, TwoColumn } from './shared/demo';

const { Text } = Typography;

let extensionInstalled = false;
const meta: Meta = {
  title: 'Core/Localization, Composition and Extension',
  // @ts-expect-error: because titleCN is an extension field
  titleCN: '核心/本地化、组合与扩展',
  parameters: {
    docs: {
      description: {
        component: storyT('storybook.stories.CorePatterns.metaDescription'),
      },
    },
  },
};

export default meta;
type Story = StoryObj;
export const LocalizationAndAutoLabel: Story = {
  name: 'Localization and Auto Label',
  // @ts-expect-error: because nameCN is an extension field
  nameCN: '本地化与自动标签',
  render: function Render() {
    return <LocalizationDemo />;
  },
};

export const CompositionAndExtension: Story = {
  name: 'Composition and Extension',
  // @ts-expect-error: because nameCN is an extension field
  nameCN: '组合与扩展',
  render: function Render() {
    return <CompositionDemo />;
  },
};

function ensureCustomExtension() {
  if (extensionInstalled) {
    return;
  }

  Enum.extends({
    toBadgeMap(this: {
      toMap: (config: {
        key: 'value';
        value: (item: { label: string; raw: { color?: string } }) => { label: string; color?: string };
      }) => Record<string, { label: string; color?: string }>;
    }) {
      return this.toMap({
        key: 'value',
        value: (item) => ({
          label: item.label,
          color: item.raw.color,
        }),
      });
    },
  });

  extensionInstalled = true;
}

function LocalizationDemo() {
  const t = useStoryT();
  const storyLocale = useStoryLocale();
  const [locale, setLocale] = useState<'zh-CN' | 'en-US'>(storyLocale);

  useEffect(() => {
    setLocale(storyLocale);
  }, [storyLocale]);

  const dictionary: Record<'zh-CN' | 'en-US', Record<string, string>> = {
    'zh-CN': {
      'status.enumName': '发布状态',
      'status.draft': '草稿',
      'status.review': '审核中',
      'status.published': '已发布',
    },
    'en-US': {
      'status.enumName': 'Release Status',
      'status.draft': 'Draft',
      'status.review': 'In Review',
      'status.published': 'Published',
    },
  };

  const statusEnum = useMemo(
    () =>
      Enum(
        {
          Draft: { value: 'draft', label: 'draft', color: 'default' },
          Review: { value: 'review', label: 'review', color: 'processing' },
          Published: { value: 'published', label: 'published', color: 'success' },
        },
        {
          name: 'status.enumName',
          labelPrefix: 'status.',
          autoLabel: true,
          localize: (key) => dictionary[locale][key || ''] ?? key,
        },
      ),
    [locale],
  );
  const [selectedValue, setSelectedValue] = useState<string>('draft');

  return (
    <StoryPage
      title={t('storybook.stories.CorePatterns.localization.title')}
      description={t('storybook.stories.CorePatterns.localization.description')}
      highlights={[
        t('storybook.stories.CorePatterns.localization.highlights.localize'),
        t('storybook.stories.CorePatterns.localization.highlights.labelPrefix'),
        t('storybook.stories.CorePatterns.localization.highlights.autoLabel'),
        t('storybook.stories.CorePatterns.localization.highlights.crossFramework'),
      ]}
    >
      <StorySection
        title={t('storybook.stories.CorePatterns.localization.section.title')}
        description={t('storybook.stories.CorePatterns.localization.section.description')}
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Segmented
            value={locale}
            options={['zh-CN', 'en-US']}
            onChange={(value) => setLocale(value as 'zh-CN' | 'en-US')}
          />

          <TwoColumn
            left={
              <Card size="small" title={t('storybook.stories.CorePatterns.localization.card.current')}>
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                  <Select
                    value={selectedValue}
                    style={{ width: '100%' }}
                    options={statusEnum.items.map((item) => ({ value: item.value, label: item.label }))}
                    onChange={(value) => setSelectedValue(value)}
                  />
                  <Descriptions
                    size="small"
                    column={1}
                    items={[
                      { key: 'name', label: 'enum.name', children: statusEnum.name || '-' },
                      { key: 'label', label: 'label(value)', children: statusEnum.label(selectedValue) },
                      {
                        key: 'raw',
                        label: 'raw(value)',
                        children: <Text code>{JSON.stringify(statusEnum.raw(selectedValue))}</Text>,
                      },
                    ]}
                  />
                </Space>
              </Card>
            }
            right={
              <JsonPreview
                title={t('storybook.stories.CorePatterns.localization.card.derived')}
                value={{ labels: statusEnum.labels, map: statusEnum.toMap() }}
              />
            }
          />
        </Space>
      </StorySection>
    </StoryPage>
  );
}

function CompositionDemo() {
  ensureCustomExtension();
  const t = useStoryT();

  const baseEnum = useMemo(
    () =>
      Enum({
        Draft: {
          value: 'draft',
          label: t('storybook.stories.CorePatterns.composition.sample.draft'),
          color: 'default',
        },
        Review: {
          value: 'review',
          label: t('storybook.stories.CorePatterns.composition.sample.review'),
          color: 'processing',
        },
      }),
    [t],
  );
  const terminalEnum = useMemo(
    () =>
      Enum({
        Published: {
          value: 'published',
          label: t('storybook.stories.CorePatterns.composition.sample.published'),
          color: 'success',
        },
        Archived: {
          value: 'archived',
          label: t('storybook.stories.CorePatterns.composition.sample.archived'),
          color: 'warning',
        },
      }),
    [t],
  );
  const mergedEnum = useMemo(
    () =>
      Enum(
        {
          ...baseEnum.raw(),
          ...terminalEnum.raw(),
        },
        { name: t('storybook.stories.CorePatterns.composition.sample.fullFlow') },
      ) as unknown as typeof baseEnum & {
        toBadgeMap(): Record<string, { label: string; color?: string }>;
      },
    [baseEnum, t, terminalEnum],
  );

  return (
    <StoryPage
      title={t('storybook.stories.CorePatterns.composition.title')}
      description={t('storybook.stories.CorePatterns.composition.description')}
      highlights={[
        t('storybook.stories.CorePatterns.composition.highlights.extends'),
        t('storybook.stories.CorePatterns.composition.highlights.raw'),
        t('storybook.stories.CorePatterns.composition.highlights.merge'),
        t('storybook.stories.CorePatterns.composition.highlights.readonly'),
      ]}
    >
      <StorySection
        title={t('storybook.stories.CorePatterns.composition.section.result.title')}
        description={t('storybook.stories.CorePatterns.composition.section.result.description')}
      >
        <TwoColumn
          left={
            <Descriptions
              bordered
              size="small"
              column={1}
              items={[
                {
                  key: 'name',
                  label: t('storybook.stories.CorePatterns.composition.field.enumName'),
                  children: mergedEnum.name || '-',
                },
                {
                  key: 'frozenEnum',
                  label: t('storybook.stories.CorePatterns.composition.field.frozenEnum'),
                  children: String(Object.isFrozen(mergedEnum)),
                },
                {
                  key: 'frozenItems',
                  label: t('storybook.stories.CorePatterns.composition.field.frozenItems'),
                  children: String(Object.isFrozen(mergedEnum.items)),
                },
                {
                  key: 'labels',
                  label: t('storybook.stories.CorePatterns.composition.field.allLabels'),
                  children: (
                    <Space wrap>
                      {mergedEnum.labels.map((item) => (
                        <Tag key={item}>{item}</Tag>
                      ))}
                    </Space>
                  ),
                },
              ]}
            />
          }
          right={<JsonPreview title="mergedEnum.raw()" value={mergedEnum.raw()} />}
        />
      </StorySection>

      <StorySection
        title={t('storybook.stories.CorePatterns.composition.section.extension.title')}
        description={t('storybook.stories.CorePatterns.composition.section.extension.description')}
      >
        <JsonPreview title="mergedEnum.toBadgeMap()" value={mergedEnum.toBadgeMap()} />
      </StorySection>
    </StoryPage>
  );
}
