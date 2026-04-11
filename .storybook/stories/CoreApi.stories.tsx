import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, Descriptions, Input, Select, Space, Table, Tag, Typography } from 'antd';
import { Enum, ITEMS, KEYS, LABELS, META, NAMED, VALUES } from '../../src';
import { JsonPreview, StoryPage, StorySection, TagGroup, TwoColumn } from './shared/demo';

const { Text } = Typography;

const WorkflowStatusEnum = Enum(
  {
    Draft: { value: 'draft', label: '草稿', tone: 'default', slug: 'draft', phase: '编辑' },
    Review: { value: 'review', label: '审核中', tone: 'processing', slug: 'review', phase: '编辑' },
    Published: { value: 'published', label: '已发布', tone: 'success', slug: 'published', phase: '线上' },
    Archived: { value: 'archived', label: '已归档', tone: 'warning', slug: 'archived', phase: '归档' },
  },
  { name: '工作流状态' },
);

const ConflictEnum = Enum({
  items: { value: 'items', label: '字段 items' },
  values: { value: 'values', label: '字段 values' },
  meta: { value: 'meta', label: '字段 meta' },
});

const meta: Meta = {
  title: '核心能力/查询与转换 API',
  parameters: {
    docs: {
      description: {
        component:
          '这一组故事集中展示 README 里的高频 API：label、key、raw、findBy、toList、toMap、items、meta，以及命名冲突时的回退符号常量。',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function ApiExplorer() {
  const [selectedValue, setSelectedValue] = useState<string>('review');
  const [searchSlug, setSearchSlug] = useState<string>('published');
  const currentItem = useMemo(() => WorkflowStatusEnum.findBy('value', selectedValue), [selectedValue]);
  const foundBySlug = useMemo(() => WorkflowStatusEnum.findBy('slug', searchSlug), [searchSlug]);

  return (
    <StoryPage
      title="把 enum 当成真正的业务查询层"
      description="相比原生 enum，enum-plus 的价值并不只在定义阶段，而在于它把查询、回显、映射和元数据读取都统一到了一个稳定对象上。"
      highlights={['label()', 'findBy()', 'toList()', 'toMap()', 'meta']}
    >
      <StorySection title="集合总览" description="items、values、labels、meta、named 都可以直接用于页面或业务逻辑。">
        <TwoColumn
          left={
            <Card size="small" title="基础信息">
              <Descriptions
                size="small"
                column={1}
                items={[
                  { key: 'name', label: 'name', children: WorkflowStatusEnum.name || '未设置' },
                  { key: 'isEnum', label: 'Enum.isEnum', children: String(Enum.isEnum(WorkflowStatusEnum)) },
                  { key: 'named', label: 'named.Review.label', children: WorkflowStatusEnum.named.Review.label },
                  { key: 'meta', label: 'meta.phase', children: WorkflowStatusEnum.meta.phase.join(' / ') },
                ]}
              />
            </Card>
          }
          right={
            <Card size="small" title="常用数组属性">
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <div>
                  <Text type="secondary">keys</Text>
                  <TagGroup items={WorkflowStatusEnum.keys} />
                </div>
                <div>
                  <Text type="secondary">values</Text>
                  <TagGroup items={WorkflowStatusEnum.values} />
                </div>
                <div>
                  <Text type="secondary">labels</Text>
                  <TagGroup items={WorkflowStatusEnum.labels} />
                </div>
              </Space>
            </Card>
          }
        />
      </StorySection>

      <StorySection title="查询 API" description="label / key / raw / has / findBy 是最常见的业务读操作。">
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Select
            value={selectedValue}
            style={{ width: 320 }}
            options={WorkflowStatusEnum.items.map((item) => ({
              value: item.value,
              label: `${item.label} (${item.key})`,
            }))}
            onChange={(value) => setSelectedValue(value)}
          />

          <Descriptions
            bordered
            size="small"
            column={1}
            items={[
              { key: 'label', label: 'label(value)', children: WorkflowStatusEnum.label(selectedValue) },
              { key: 'key', label: 'key(value)', children: WorkflowStatusEnum.key(selectedValue) },
              { key: 'has', label: 'has(value)', children: String(WorkflowStatusEnum.has(selectedValue)) },
              {
                key: 'raw',
                label: 'raw(value)',
                children: <Text code>{JSON.stringify(WorkflowStatusEnum.raw(selectedValue))}</Text>,
              },
              { key: 'current', label: '当前 item', children: <Text code>{JSON.stringify(currentItem?.raw)}</Text> },
            ]}
          />

          <Input
            addonBefore="findBy('slug', ...)"
            value={searchSlug}
            style={{ maxWidth: 420 }}
            onChange={(event) => setSearchSlug(event.target.value)}
          />

          <Card size="small" title="findBy 结果">
            <Text code>{JSON.stringify(foundBySlug?.raw ?? null)}</Text>
          </Card>
        </Space>
      </StorySection>

      <StorySection
        title="转换 API"
        description="toList 和 toMap 是最常见的数据转换出口，用于下拉、配置映射和静态数据字典。"
      >
        <TwoColumn
          left={
            <JsonPreview
              title="toList({ valueField, labelField, extra })"
              value={WorkflowStatusEnum.toList({
                valueField: 'id',
                labelField: 'name',
                extra: (item) => ({ phase: item.raw.phase, tone: item.raw.tone }),
              })}
            />
          }
          right={
            <JsonPreview
              title="toMap({ key, value })"
              value={WorkflowStatusEnum.toMap({
                key: 'key',
                value: (item) => ({ value: item.value, label: item.label, tone: item.raw.tone }),
              })}
            />
          }
        />
      </StorySection>

      <StorySection title="items 明细表" description="如果你的 UI 没有安装插件，items 依然是最稳定的基础数据源。">
        <Table
          className="ep-table"
          rowKey="key"
          pagination={false}
          columns={[
            { title: 'key', dataIndex: 'key', width: 120 },
            { title: 'value', dataIndex: 'value', width: 140 },
            { title: 'label', dataIndex: 'label', width: 160 },
            { title: 'phase', render: (_, row) => row.raw.phase, width: 120 },
            {
              title: 'tone',
              render: (_, row) => (
                <Tag color={row.raw.tone === 'success' ? 'green' : row.raw.tone === 'warning' ? 'orange' : 'blue'}>
                  {row.raw.tone}
                </Tag>
              ),
              width: 120,
            },
            { title: 'raw', render: (_, row) => <Text code>{JSON.stringify(row.raw)}</Text> },
          ]}
          dataSource={WorkflowStatusEnum.items}
        />
      </StorySection>
    </StoryPage>
  );
}

function NamingConflictDemo() {
  const enumWithSymbols = ConflictEnum as typeof ConflictEnum & Record<symbol, unknown>;

  return (
    <StoryPage
      title="命名冲突处理"
      description="README 专门为 items、values、meta 等命名冲突留了章节。enum-plus 会在冲突时保留用户字段，同时把真正的枚举能力放到符号常量上。"
      highlights={['ITEMS', 'KEYS', 'VALUES', 'LABELS', 'META', 'NAMED']}
    >
      <StorySection title="冲突结果一览" description="左边是与 API 重名的业务字段，右边是实际枚举能力所在的符号字段。">
        <TwoColumn
          left={
            <Descriptions
              bordered
              size="small"
              column={1}
              items={[
                {
                  key: 'items',
                  label: 'ConflictEnum.items',
                  children: String((ConflictEnum as Record<string, unknown>).items),
                },
                {
                  key: 'values',
                  label: 'ConflictEnum.values',
                  children: String((ConflictEnum as Record<string, unknown>).values),
                },
                {
                  key: 'meta',
                  label: 'ConflictEnum.meta',
                  children: String((ConflictEnum as Record<string, unknown>).meta),
                },
              ]}
            />
          }
          right={
            <Descriptions
              bordered
              size="small"
              column={1}
              items={[
                {
                  key: 'itemsSymbol',
                  label: 'ConflictEnum[ITEMS].length',
                  children: String((enumWithSymbols[ITEMS] as { length: number } | undefined)?.length ?? 0),
                },
                {
                  key: 'keysSymbol',
                  label: 'ConflictEnum[KEYS]',
                  children: <Text code>{JSON.stringify(enumWithSymbols[KEYS])}</Text>,
                },
                {
                  key: 'valuesSymbol',
                  label: 'ConflictEnum[VALUES]',
                  children: <Text code>{JSON.stringify(enumWithSymbols[VALUES])}</Text>,
                },
                {
                  key: 'labelsSymbol',
                  label: 'ConflictEnum[LABELS]',
                  children: <Text code>{JSON.stringify(enumWithSymbols[LABELS])}</Text>,
                },
                {
                  key: 'metaSymbol',
                  label: 'ConflictEnum[META]',
                  children: <Text code>{JSON.stringify(enumWithSymbols[META])}</Text>,
                },
                {
                  key: 'namedSymbol',
                  label: 'ConflictEnum[NAMED].items.label',
                  children: String(
                    (enumWithSymbols[NAMED] as { items?: { label?: string } } | undefined)?.items?.label ?? '-',
                  ),
                },
              ]}
            />
          }
        />
      </StorySection>
    </StoryPage>
  );
}

export const Explorer: Story = {
  render: function Render() {
    return <ApiExplorer />;
  },
};

export const NamingConflicts: Story = {
  render: function Render() {
    return <NamingConflictDemo />;
  },
};
