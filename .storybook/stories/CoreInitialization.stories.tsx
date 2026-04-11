import { useEffect, useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, Descriptions, Segmented, Select, Space, Table, Typography } from 'antd';
import { Enum } from '../../src';
import { CodePreview, JsonPreview, KpiRow, StoryPage, StorySection, TwoColumn } from './shared/demo';

const { Text } = Typography;

enum ReleaseChannelNative {
  Stable = 1,
  Beta,
  Canary,
}

const initPresets = {
  'Key-Value': {
    code: `const PriorityEnum = Enum({
  Low: 1,
  Medium: 2,
  High: 3,
});`,
    create: () =>
      Enum(
        {
          Low: 1,
          Medium: 2,
          High: 3,
        },
        { name: '优先级' },
      ),
  },
  标准格式: {
    code: `const StatusEnum = Enum({
  Draft: { value: 'draft', label: '草稿', tone: 'default' },
  Review: { value: 'review', label: '审核中', tone: 'processing' },
  Published: { value: 'published', label: '已发布', tone: 'success' },
});`,
    create: () =>
      Enum(
        {
          Draft: { value: 'draft', label: '草稿', tone: 'default' },
          Review: { value: 'review', label: '审核中', tone: 'processing' },
          Published: { value: 'published', label: '已发布', tone: 'success' },
        },
        { name: '文章状态' },
      ),
  },
  仅标签格式: {
    code: `const LocaleEnum = Enum({
  zhCN: { label: '简体中文' },
  enUS: { label: 'English' },
  jaJP: { label: '日本語' },
});`,
    create: () =>
      Enum(
        {
          zhCN: { label: '简体中文' },
          enUS: { label: 'English' },
          jaJP: { label: '日本語' },
        },
        { name: '站点语言' },
      ),
  },
  数组格式: {
    code: `const PipelineEnum = Enum([
  { value: 11, key: 'Backlog', label: '待处理' },
  { value: 12, key: 'Doing', label: '进行中' },
  { value: 13, key: 'Done', label: '已完成' },
]);`,
    create: () =>
      Enum(
        [
          { value: 11, key: 'Backlog', label: '待处理' },
          { value: 12, key: 'Doing', label: '进行中' },
          { value: 13, key: 'Done', label: '已完成' },
        ],
        { name: '任务泳道' },
      ),
  },
  原生枚举: {
    code: `enum ReleaseChannelNative {
  Stable = 1,
  Beta,
  Canary,
}

const ChannelEnum = Enum(ReleaseChannelNative);`,
    create: () => Enum(ReleaseChannelNative, { name: '发布通道' }),
  },
} as const;

type PresetKey = keyof typeof initPresets;

const presetOptions = Object.keys(initPresets) as PresetKey[];

const meta: Meta = {
  title: '核心能力/枚举初始化',
  parameters: {
    docs: {
      description: {
        component:
          '按照 README 中的初始化章节，把最常用的五种定义方式变成同一套可比较的可视化面板，方便观察 values、labels、items 和原始数据结构的差异。',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function InitializationPlayground() {
  const [preset, setPreset] = useState<PresetKey>('标准格式');
  const enumInstance = useMemo(() => initPresets[preset].create(), [preset]);
  const [selectedValue, setSelectedValue] = useState<string | number | undefined>(() => enumInstance.values[0]);

  useEffect(() => {
    setSelectedValue(enumInstance.values[0]);
  }, [enumInstance, preset]);

  const currentItem = enumInstance.findBy('value', selectedValue);
  const rows = enumInstance.items.map((item) => ({
    key: item.key,
    value: item.value,
    label: item.label,
    raw: JSON.stringify(item.raw),
  }));

  return (
    <StoryPage
      title="把初始化格式变成可观察的运行结果"
      description="README 中的各种枚举定义方式在语法上不同，但都指向同一个目标：建立稳定、可查询、可映射到 UI 的枚举集合。这个故事页把五种格式放到同一套面板里对比。"
      highlights={['Key-Value', '标准格式', '数组格式', '原生 enum', '运行时可视化']}
    >
      <StorySection
        title="切换初始化方式"
        description="不同写法会影响原始数据结构，但不会改变枚举查询和转换 API 的基本体验。"
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Segmented block options={presetOptions} value={preset} onChange={(value) => setPreset(value as PresetKey)} />
          <CodePreview title="当前示例代码" code={initPresets[preset].code} />
        </Space>
      </StorySection>

      <StorySection title="交互预览" description="选中一个值后，可以直接观察 label、key、raw 和基础统计信息。">
        <TwoColumn
          left={
            <Card size="small" title="当前枚举状态">
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Select
                  value={selectedValue}
                  style={{ width: '100%' }}
                  options={enumInstance.items.map((item) => ({ value: item.value, label: item.label }))}
                  onChange={(value) => setSelectedValue(value)}
                />

                <Descriptions
                  size="small"
                  column={1}
                  items={[
                    { key: 'name', label: '枚举名', children: enumInstance.name || '未设置' },
                    { key: 'value', label: '当前值', children: String(selectedValue) },
                    { key: 'label', label: '显示文本', children: currentItem?.label || '-' },
                    { key: 'key', label: '枚举键', children: enumInstance.key(selectedValue) || '-' },
                    { key: 'has', label: 'has(value)', children: String(enumInstance.has(selectedValue)) },
                    {
                      key: 'raw',
                      label: 'raw(value)',
                      children: <Text code>{JSON.stringify(enumInstance.raw(selectedValue))}</Text>,
                    },
                  ]}
                />
              </Space>
            </Card>
          }
          right={
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <KpiRow
                items={[
                  { label: 'items', value: enumInstance.items.length },
                  { label: 'values', value: enumInstance.values.length },
                  { label: 'labels', value: enumInstance.labels.length },
                ]}
              />
              <JsonPreview title="toList() 结果" value={enumInstance.toList()} />
            </Space>
          }
        />
      </StorySection>

      <StorySection title="枚举项明细" description="对于 UI 绑定来说，items 往往是最关键的运行时数据结构。">
        <Table
          className="ep-table"
          rowKey="key"
          pagination={false}
          columns={[
            { title: 'key', dataIndex: 'key', width: 180 },
            { title: 'value', dataIndex: 'value', width: 160 },
            { title: 'label', dataIndex: 'label', width: 200 },
            { title: 'raw', dataIndex: 'raw' },
          ]}
          dataSource={rows}
        />
      </StorySection>

      <StorySection title="派生属性对比" description="这些属性会在后续 API、插件和 UI 组件绑定中频繁使用。">
        <TwoColumn
          left={
            <JsonPreview
              title="keys / values / labels"
              value={{ keys: enumInstance.keys, values: enumInstance.values, labels: enumInstance.labels }}
            />
          }
          right={<JsonPreview title="toMap()" value={enumInstance.toMap()} />}
        />
      </StorySection>
    </StoryPage>
  );
}

function ArrayFieldMappingDemo() {
  const sourceRows = [
    { id: 101, code: 'draft', title: '草稿', group: '编辑阶段' },
    { id: 102, code: 'review', title: '审核中', group: '编辑阶段' },
    { id: 103, code: 'published', title: '已发布', group: '线上阶段' },
  ] as const;

  const mappedEnum = useMemo(
    () =>
      Enum(sourceRows, {
        getValue: 'id',
        getKey: 'code',
        getLabel: 'title',
        name: '流程状态',
      }),
    [],
  );
  const [selectedValue, setSelectedValue] = useState<number>(101);

  return (
    <StoryPage
      title="数组格式的字段映射"
      description="README 里特别强调数组初始化适合 API 数据。本故事把后端返回结构映射成 enum，再反向生成给 Select 使用的字段，形成完整闭环。"
      highlights={['动态数据', '字段映射', 'Select 绑定']}
    >
      <StorySection
        title="源数据与映射规则"
        description="通过 getValue / getKey / getLabel，可以适配任意后端字段命名。"
      >
        <TwoColumn
          left={
            <CodePreview
              title="映射代码"
              code={`const FlowEnum = Enum(sourceRows, {
  getValue: 'id',
  getKey: 'code',
  getLabel: 'title',
});`}
            />
          }
          right={<JsonPreview title="API 原始数据" value={sourceRows} />}
        />
      </StorySection>

      <StorySection
        title="映射后的交互结果"
        description="同一份 enum 数据既可以做业务查询，也可以定制成 antd 所需的字段名。"
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Select
            value={selectedValue}
            style={{ width: 320 }}
            fieldNames={{ value: 'id', label: 'name' }}
            options={mappedEnum.toList({
              valueField: 'id',
              labelField: 'name',
              extra: (item) => ({ group: item.raw.group }),
            })}
            onChange={(value) => setSelectedValue(value)}
          />

          <Descriptions
            bordered
            size="small"
            column={1}
            items={[
              { key: 'label', label: 'label(value)', children: mappedEnum.label(selectedValue) },
              { key: 'key', label: 'key(value)', children: mappedEnum.key(selectedValue) },
              {
                key: 'raw',
                label: 'raw(value)',
                children: <Text code>{JSON.stringify(mappedEnum.raw(selectedValue))}</Text>,
              },
            ]}
          />
        </Space>
      </StorySection>
    </StoryPage>
  );
}

export const Playground: Story = {
  render: function Render() {
    return <InitializationPlayground />;
  },
};

export const ArrayFieldMapping: Story = {
  render: function Render() {
    return <ArrayFieldMappingDemo />;
  },
};
