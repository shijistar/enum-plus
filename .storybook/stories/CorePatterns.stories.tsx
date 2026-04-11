import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, Descriptions, Segmented, Select, Space, Tag, Typography } from 'antd';
import { Enum } from '../../src';
import { JsonPreview, StoryPage, StorySection, TwoColumn } from './shared/demo';

const { Text } = Typography;

let extensionInstalled = false;

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

const meta: Meta = {
  title: '核心能力/本地化、组合与扩展',
  parameters: {
    docs: {
      description: {
        component:
          '这个页面把 README 中较容易被忽略但非常实用的能力放到一起：字符串本地化、autoLabel、枚举组合、只读遍历，以及通过 Enum.extends 增加全局扩展方法。',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function LocalizationDemo() {
  const [locale, setLocale] = useState<'zh-CN' | 'en-US'>('zh-CN');

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
      title="字符串本地化与 autoLabel"
      description="这是一种跨框架也适用的本地化方式。通过 localize + labelPrefix，可以把枚举项 label 变成资源 key，而不是直接写死文本。"
      highlights={['localize', 'labelPrefix', 'autoLabel', '跨框架']}
    >
      <StorySection title="语言切换" description="切换后，枚举名、下拉标签和派生 labels 会同步变化。">
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Segmented
            value={locale}
            options={['zh-CN', 'en-US']}
            onChange={(value) => setLocale(value as 'zh-CN' | 'en-US')}
          />

          <TwoColumn
            left={
              <Card size="small" title="当前枚举">
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
              <JsonPreview title="labels / toMap()" value={{ labels: statusEnum.labels, map: statusEnum.toMap() }} />
            }
          />
        </Space>
      </StorySection>
    </StoryPage>
  );
}

function CompositionDemo() {
  ensureCustomExtension();

  const baseEnum = useMemo(
    () =>
      Enum({
        Draft: { value: 'draft', label: '草稿', color: 'default' },
        Review: { value: 'review', label: '审核中', color: 'processing' },
      }),
    [],
  );
  const terminalEnum = useMemo(
    () =>
      Enum({
        Published: { value: 'published', label: '已发布', color: 'success' },
        Archived: { value: 'archived', label: '已归档', color: 'warning' },
      }),
    [],
  );
  const mergedEnum = useMemo(
    () =>
      Enum(
        {
          ...baseEnum.raw(),
          ...terminalEnum.raw(),
        },
        { name: '完整内容流程' },
      ) as typeof baseEnum & {
        toBadgeMap(): Record<string, { label: string; color?: string }>;
      },
    [baseEnum, terminalEnum],
  );

  return (
    <StoryPage
      title="枚举组合与全局扩展"
      description="把多个枚举合并成一个完整流程后，还可以通过 Enum.extends 把统一的数据变换方法挂到所有 enum 实例上。"
      highlights={['Enum.extends', 'raw()', '合并枚举', '只读结构']}
    >
      <StorySection title="组合结果" description="利用 raw() 回收原始定义，再重新组合成新的 enum。">
        <TwoColumn
          left={
            <Descriptions
              bordered
              size="small"
              column={1}
              items={[
                { key: 'name', label: '枚举名', children: mergedEnum.name || '-' },
                { key: 'frozenEnum', label: 'Object.isFrozen(enum)', children: String(Object.isFrozen(mergedEnum)) },
                {
                  key: 'frozenItems',
                  label: 'Object.isFrozen(items)',
                  children: String(Object.isFrozen(mergedEnum.items)),
                },
                {
                  key: 'labels',
                  label: '所有 label',
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
        title="自定义扩展方法"
        description="这里通过 Enum.extends 增加了 toBadgeMap()，把枚举统一转成适合展示状态徽标的数据结构。"
      >
        <JsonPreview title="mergedEnum.toBadgeMap()" value={mergedEnum.toBadgeMap()} />
      </StorySection>
    </StoryPage>
  );
}

export const LocalizationAndAutoLabel: Story = {
  render: function Render() {
    return <LocalizationDemo />;
  },
};

export const CompositionAndExtension: Story = {
  render: function Render() {
    return <CompositionDemo />;
  },
};
