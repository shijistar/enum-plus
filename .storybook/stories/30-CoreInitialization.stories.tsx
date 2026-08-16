import { useEffect, useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, Descriptions, Segmented, Select, Space, Table, Typography } from 'antd';
import { type AnyEnum, Enum, type EnumValue } from '../../src';
import { storyT, useStoryT } from '../locales';
import { CodePreview, JsonPreview, KpiRow, StoryPage, StorySection, TwoColumn } from './shared/demo';

const { Text } = Typography;

enum ReleaseChannelNative {
  Stable = 1,
  Beta,
  Canary,
}

type PresetKey = 'keyValue' | 'standard' | 'labelOnly' | 'array' | 'native';
type Story = StoryObj;

const meta: Meta = {
  title: 'Core/Enum Initialization',
  // @ts-expect-error: because titleCN is an extension field
  titleCN: '核心/枚举初始化',
  parameters: {
    docs: {
      description: {
        component: storyT('storybook.stories.CoreInitialization.metaDescription'),
      },
    },
  },
};
export default meta;

export const Playground: Story = {
  name: 'Enum Initialization',
  // @ts-expect-error: because nameCN is an extension field
  nameCN: '枚举初始化',
  render: function Render() {
    return <InitializationPlayground />;
  },
};

function getInitPresets(t: ReturnType<typeof useStoryT>): Record<
  PresetKey,
  {
    label: string;
    code: string;
    create: () => AnyEnum;
  }
> {
  return {
    keyValue: {
      label: t('storybook.stories.CoreInitialization.preset.keyValue'),
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
          { name: t('storybook.stories.CoreInitialization.sample.priorityName') },
        ),
    },
    standard: {
      label: t('storybook.stories.CoreInitialization.preset.standard'),
      code: `const StatusEnum = Enum({
  Draft: { value: 'draft', label: '${t('storybook.stories.CoreInitialization.sample.status.draft')}' },
  Review: { value: 'review', label: '${t('storybook.stories.CoreInitialization.sample.status.review')}' },
  Published: { value: 'published', label: '${t('storybook.stories.CoreInitialization.sample.status.published')}' },
});`,
      create: () =>
        Enum(
          {
            Draft: {
              value: 'draft',
              label: t('storybook.stories.CoreInitialization.sample.status.draft'),
              tone: 'default',
            },
            Review: {
              value: 'review',
              label: t('storybook.stories.CoreInitialization.sample.status.review'),
              tone: 'processing',
            },
            Published: {
              value: 'published',
              label: t('storybook.stories.CoreInitialization.sample.status.published'),
              tone: 'success',
            },
          },
          { name: t('storybook.stories.CoreInitialization.sample.statusName') },
        ),
    },
    labelOnly: {
      label: t('storybook.stories.CoreInitialization.preset.labelOnly'),
      code: `const LocaleEnum = Enum({
  zhCN: { label: '${t('storybook.stories.CoreInitialization.sample.locale.zhCN')}' },
  enUS: { label: '${t('storybook.stories.CoreInitialization.sample.locale.enUS')}' },
  jaJP: { label: '${t('storybook.stories.CoreInitialization.sample.locale.jaJP')}' },
});`,
      create: () =>
        Enum(
          {
            zhCN: { label: t('storybook.stories.CoreInitialization.sample.locale.zhCN') },
            enUS: { label: t('storybook.stories.CoreInitialization.sample.locale.enUS') },
            jaJP: { label: t('storybook.stories.CoreInitialization.sample.locale.jaJP') },
          },
          { name: t('storybook.stories.CoreInitialization.sample.localeName') },
        ),
    },
    native: {
      label: t('storybook.stories.CoreInitialization.preset.native'),
      code: `enum ReleaseChannelNative {
  Stable = 1,
  Beta,
  Canary,
}

const ChannelEnum = Enum(ReleaseChannelNative);`,
      create: () =>
        Enum(ReleaseChannelNative, { name: t('storybook.stories.CoreInitialization.sample.channelName') }) as AnyEnum,
    },
    array: {
      label: t('storybook.stories.CoreInitialization.preset.array'),
      code: `const PipelineEnum = Enum([
  { value: 11, key: 'Backlog', label: '${t('storybook.stories.CoreInitialization.sample.pipeline.backlog')}' },
  { value: 12, key: 'Doing', label: '${t('storybook.stories.CoreInitialization.sample.pipeline.doing')}' },
  { value: 13, key: 'Done', label: '${t('storybook.stories.CoreInitialization.sample.pipeline.done')}' },
]);`,
      create: () =>
        Enum(
          [
            { value: 11, key: 'Backlog', label: t('storybook.stories.CoreInitialization.sample.pipeline.backlog') },
            { value: 12, key: 'Doing', label: t('storybook.stories.CoreInitialization.sample.pipeline.doing') },
            { value: 13, key: 'Done', label: t('storybook.stories.CoreInitialization.sample.pipeline.done') },
          ],
          { name: t('storybook.stories.CoreInitialization.sample.pipelineName') },
        ) as AnyEnum,
    },
  };
}

function InitializationPlayground() {
  const t = useStoryT();
  const initPresets = useMemo(() => getInitPresets(t), [t]);
  const presetOptions = useMemo(
    () =>
      (Object.keys(initPresets) as PresetKey[]).map((key) => ({
        label: initPresets[key].label,
        value: key,
      })),
    [initPresets],
  );
  const [preset, setPreset] = useState<PresetKey>('standard');
  const enumInstance = useMemo(() => initPresets[preset].create(), [initPresets, preset]);
  const [selectedValue, setSelectedValue] = useState<EnumValue>(() => enumInstance.values[0]);

  useEffect(() => {
    setSelectedValue(enumInstance.values[0]);
  }, [enumInstance, preset]);

  const currentItem = enumInstance.findBy('value', selectedValue);
  const rows = enumInstance.items.map((item) => ({
    key: item.key,
    value: item.value,
    label: item.label,
    raw: <Typography.Text code>{JSON.stringify(item.raw)}</Typography.Text>,
  }));

  return (
    <StoryPage
      title={t('storybook.stories.CoreInitialization.page.title')}
      description={t('storybook.stories.CoreInitialization.page.description')}
      highlights={[
        t('storybook.stories.CoreInitialization.highlights.keyValue'),
        t('storybook.stories.CoreInitialization.highlights.standard'),
        t('storybook.stories.CoreInitialization.highlights.array'),
        t('storybook.stories.CoreInitialization.highlights.nativeEnum'),
        t('storybook.stories.CoreInitialization.highlights.runtime'),
      ]}
    >
      <StorySection
        title={t('storybook.stories.CoreInitialization.section.switch.title')}
        description={t('storybook.stories.CoreInitialization.section.switch.description')}
      >
        <Space orientation="vertical" size={16} style={{ width: '100%' }}>
          <Segmented block options={presetOptions} value={preset} onChange={(value) => setPreset(value as PresetKey)} />
          <CodePreview
            title={t('storybook.stories.CoreInitialization.card.currentCode')}
            code={initPresets[preset].code}
          />
          {preset === 'array' && (
            <CodePreview
              title={t('storybook.stories.CoreInitialization.array.card.mappingCode')}
              code={`const dataRows = [
  { id: 11, code: 'Backlog', title: '${t('storybook.stories.CoreInitialization.sample.pipeline.backlog')}' },
  { id: 12, code: 'Doing', title: '${t('storybook.stories.CoreInitialization.sample.pipeline.doing')}' },
  { id: 13, code: 'Done', title: '${t('storybook.stories.CoreInitialization.sample.pipeline.done')}' },
];
const FlowEnum = Enum(dataRows, {
  getValue: 'id',
  getKey: 'code',
  getLabel: 'title',
});`}
            />
          )}
        </Space>
      </StorySection>

      <StorySection
        title={t('storybook.stories.CoreInitialization.section.interaction.title')}
        description={t('storybook.stories.CoreInitialization.section.interaction.description')}
      >
        <TwoColumn
          left={
            <Card size="small" title={t('storybook.stories.CoreInitialization.card.currentState')}>
              <Space orientation="vertical" size={16} style={{ width: '100%' }}>
                <Select
                  value={selectedValue}
                  style={{ width: '100%' }}
                  options={enumInstance.items.map((item) => ({ value: item.value, label: item.label }))}
                  onChange={(value) => setSelectedValue(value as string | number)}
                />

                <Descriptions
                  size="small"
                  column={1}
                  items={[
                    {
                      key: 'name',
                      label: t('storybook.stories.CoreInitialization.field.enumName'),
                      children: enumInstance.name || '-',
                    },
                    {
                      key: 'value',
                      label: t('storybook.stories.CoreInitialization.field.currentValue'),
                      children: String(selectedValue),
                    },
                    {
                      key: 'label',
                      label: t('storybook.stories.CoreInitialization.field.displayText'),
                      children: currentItem?.label || '-',
                    },
                    {
                      key: 'key',
                      label: t('storybook.stories.CoreInitialization.field.enumKey'),
                      children: enumInstance.key(selectedValue) || '-',
                    },
                    {
                      key: 'has',
                      label: `has("${String(selectedValue)}")`,
                      children: <Text code>{String(enumInstance.has(selectedValue))}</Text>,
                    },
                    {
                      key: 'raw',
                      label: `raw("${String(selectedValue)}")`,
                      children: <Text code>{JSON.stringify(enumInstance.raw(selectedValue))}</Text>,
                    },
                  ]}
                />
              </Space>
            </Card>
          }
          right={
            <Space orientation="vertical" size={16} style={{ width: '100%' }}>
              <KpiRow
                items={[
                  { label: t('storybook.stories.CoreInitialization.kpi.items'), value: enumInstance.items.length },
                  { label: t('storybook.stories.CoreInitialization.kpi.values'), value: enumInstance.values.length },
                  { label: t('storybook.stories.CoreInitialization.kpi.labels'), value: enumInstance.labels.length },
                ]}
              />
              <JsonPreview
                forceEnumText
                title={t('storybook.stories.CoreInitialization.kpi.items')}
                value={enumInstance.items.map((item) => ({
                  key: item.key,
                  value: item.value,
                  label: item.label,
                }))}
              />
            </Space>
          }
        />
      </StorySection>

      <StorySection
        title={t('storybook.stories.CoreInitialization.section.derived.title')}
        description={t('storybook.stories.CoreInitialization.section.derived.description')}
      >
        <TwoColumn
          left={
            <Space orientation="vertical" size={16} style={{ width: '100%' }}>
              <JsonPreview forceEnumText title="values" value={enumInstance.values} />
              <JsonPreview forceEnumText title="labels" value={enumInstance.labels} />
              <JsonPreview forceEnumText title="keys" value={enumInstance.keys} />
            </Space>
          }
          right={
            <Space orientation="vertical" size={16} style={{ width: '100%' }}>
              <JsonPreview
                forceEnumText
                title={t('storybook.stories.CoreInitialization.card.listResult')}
                value={enumInstance.toList()}
              />
              <JsonPreview
                forceEnumText
                title={t('storybook.stories.CoreInitialization.card.map')}
                value={enumInstance.toMap()}
              />
            </Space>
          }
        />
      </StorySection>

      <StorySection
        title={t('storybook.stories.CoreInitialization.section.items.title')}
        description={t('storybook.stories.CoreInitialization.section.items.description')}
      >
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
    </StoryPage>
  );
}
