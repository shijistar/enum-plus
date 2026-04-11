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
  Draft: { value: 'draft', label: '${t('storybook.stories.CoreInitialization.sample.status.draft')}', tone: 'default' },
  Review: { value: 'review', label: '${t('storybook.stories.CoreInitialization.sample.status.review')}', tone: 'processing' },
  Published: { value: 'published', label: '${t('storybook.stories.CoreInitialization.sample.status.published')}', tone: 'success' },
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
  };
}

const meta: Meta = {
  title: 'Core/Enum Initialization',
  parameters: {
    docs: {
      description: {
        component: storyT('storybook.stories.CoreInitialization.metaDescription'),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

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
    raw: JSON.stringify(item.raw),
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
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Segmented block options={presetOptions} value={preset} onChange={(value) => setPreset(value as PresetKey)} />
          <CodePreview
            title={t('storybook.stories.CoreInitialization.card.currentCode')}
            code={initPresets[preset].code}
          />
        </Space>
      </StorySection>

      <StorySection
        title={t('storybook.stories.CoreInitialization.section.interaction.title')}
        description={t('storybook.stories.CoreInitialization.section.interaction.description')}
      >
        <TwoColumn
          left={
            <Card size="small" title={t('storybook.stories.CoreInitialization.card.currentState')}>
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
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
                    { key: 'has', label: 'has(value)', children: String(enumInstance.has(selectedValue)) },
                    {
                      key: 'raw',
                      label: t('storybook.stories.CoreInitialization.field.rawValue'),
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
                  { label: t('storybook.stories.CoreInitialization.kpi.items'), value: enumInstance.items.length },
                  { label: t('storybook.stories.CoreInitialization.kpi.values'), value: enumInstance.values.length },
                  { label: t('storybook.stories.CoreInitialization.kpi.labels'), value: enumInstance.labels.length },
                ]}
              />
              <JsonPreview
                title={t('storybook.stories.CoreInitialization.card.listResult')}
                value={enumInstance.toList()}
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

      <StorySection
        title={t('storybook.stories.CoreInitialization.section.derived.title')}
        description={t('storybook.stories.CoreInitialization.section.derived.description')}
      >
        <TwoColumn
          left={
            <JsonPreview
              title={t('storybook.stories.CoreInitialization.card.derived')}
              value={{ keys: enumInstance.keys, values: enumInstance.values, labels: enumInstance.labels }}
            />
          }
          right={
            <JsonPreview title={t('storybook.stories.CoreInitialization.card.map')} value={enumInstance.toMap()} />
          }
        />
      </StorySection>
    </StoryPage>
  );
}

function ArrayFieldMappingDemo() {
  const t = useStoryT();
  const sourceRows = [
    {
      id: 101,
      code: 'draft',
      title: t('storybook.stories.CoreInitialization.array.sample.title.draft'),
      group: t('storybook.stories.CoreInitialization.array.sample.group.editing'),
    },
    // {
    //   id: 102,
    //   code: 'review',
    //   title: t('storybook.stories.CoreInitialization.array.sample.title.review'),
    //   group: t('storybook.stories.CoreInitialization.array.sample.group.editing'),
    // },
    // {
    //   id: 103,
    //   code: 'published',
    //   title: t('storybook.stories.CoreInitialization.array.sample.title.published'),
    //   group: t('storybook.stories.CoreInitialization.array.sample.group.online'),
    // },
  ] as const;

  const mappedEnum = useMemo(() => {
    const s = Enum(sourceRows, {
      getValue: 'id',
      getKey: 'code',
      getLabel: 'title',
      name: t('storybook.stories.CoreInitialization.array.sample.enumName'),
    });
    return s;
  }, [sourceRows, t]);
  const [selectedValue, setSelectedValue] = useState<number>(101);

  return (
    <StoryPage
      title={t('storybook.stories.CoreInitialization.array.title')}
      description={t('storybook.stories.CoreInitialization.array.description')}
      highlights={[
        t('storybook.stories.CoreInitialization.array.highlights.dynamicData'),
        t('storybook.stories.CoreInitialization.array.highlights.fieldMapping'),
        t('storybook.stories.CoreInitialization.array.highlights.selectBinding'),
      ]}
    >
      <StorySection
        title={t('storybook.stories.CoreInitialization.array.section.source.title')}
        description={t('storybook.stories.CoreInitialization.array.section.source.description')}
      >
        <TwoColumn
          left={
            <CodePreview
              title={t('storybook.stories.CoreInitialization.array.card.mappingCode')}
              code={`const FlowEnum = Enum(sourceRows, {
  getValue: 'id',
  getKey: 'code',
  getLabel: 'title',
});`}
            />
          }
          right={<JsonPreview title={t('storybook.stories.CoreInitialization.array.card.apiRaw')} value={sourceRows} />}
        />
      </StorySection>

      <StorySection
        title={t('storybook.stories.CoreInitialization.array.section.result.title')}
        description={t('storybook.stories.CoreInitialization.array.section.result.description')}
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Select
            value={selectedValue}
            style={{ width: 320 }}
            fieldNames={{ value: 'id', label: 'name' }}
            options={mappedEnum.toList({
              valueField: 'id',
              labelField: 'name',
              extra: (item) => ({ group: (item.raw as any)?.group }),
            })}
            onChange={(value) => setSelectedValue(value)}
          />

          <Descriptions
            bordered
            size="small"
            column={1}
            items={[
              { key: 'label', label: 'label(value)', children: mappedEnum.label(selectedValue) },
              { key: 'key', label: 'key(value)', children: mappedEnum.key(selectedValue as any) as string },
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
