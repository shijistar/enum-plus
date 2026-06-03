import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, Descriptions, Input, Select, Space, Table, Tag, Typography } from 'antd';
import { Enum, ITEMS, KEYS, LABELS, META, NAMED, VALUES } from '../../src';
import { storyT, useStoryT } from '../locales';
import { JsonPreview, StoryPage, StorySection, TagGroup, TwoColumn } from './shared/demo';

const { Text } = Typography;
type Story = StoryObj;

const meta: Meta = {
  title: 'Core/Query and Transform API',
  // @ts-expect-error: because titleCN is an extension field
  titleCN: '核心/查询与转换 API',
  parameters: {
    docs: {
      description: {
        component: storyT('storybook.stories.CoreApi.metaDescription'),
      },
    },
  },
};

export default meta;

export const Explorer: Story = {
  name: 'Explorer',
  // @ts-expect-error: because nameCN is an extension field
  nameCN: '探索',
  render: function Render() {
    return <ApiExplorer />;
  },
};

export const NamingConflicts: Story = {
  name: 'Naming Conflicts',
  // @ts-expect-error: because nameCN is an extension field
  nameCN: '命名冲突',
  render: function Render() {
    return <NamingConflictDemo />;
  },
};

function createWorkflowStatusEnum(t: ReturnType<typeof useStoryT>) {
  return Enum(
    {
      Draft: {
        value: 'draft',
        label: t('storybook.stories.CoreApi.sample.status.draft'),
        tone: 'default',
        slug: 'draft',
        phase: t('storybook.stories.CoreApi.sample.phase.editing'),
      },
      Review: {
        value: 'review',
        label: t('storybook.stories.CoreApi.sample.status.review'),
        tone: 'processing',
        slug: 'review',
        phase: t('storybook.stories.CoreApi.sample.phase.editing'),
      },
      Published: {
        value: 'published',
        label: t('storybook.stories.CoreApi.sample.status.published'),
        tone: 'success',
        slug: 'published',
        phase: t('storybook.stories.CoreApi.sample.phase.online'),
      },
      Archived: {
        value: 'archived',
        label: t('storybook.stories.CoreApi.sample.status.archived'),
        tone: 'warning',
        slug: 'archived',
        phase: t('storybook.stories.CoreApi.sample.phase.archive'),
      },
    },
    { name: t('storybook.stories.CoreApi.sample.statusName') },
  );
}

function createConflictEnum(t: ReturnType<typeof useStoryT>) {
  return Enum({
    items: { value: 'items', label: t('storybook.stories.CoreApi.sample.conflict.items') },
    values: { value: 'values', label: t('storybook.stories.CoreApi.sample.conflict.values') },
    meta: { value: 'meta', label: t('storybook.stories.CoreApi.sample.conflict.meta') },
  });
}

function ApiExplorer() {
  const t = useStoryT();
  const workflowStatusEnum = useMemo(() => createWorkflowStatusEnum(t), [t]);
  const [selectedValue, setSelectedValue] = useState<string>('review');
  const [searchSlug, setSearchSlug] = useState<string>('published');
  const currentItem = useMemo(
    () => workflowStatusEnum.findBy('value', selectedValue),
    [selectedValue, workflowStatusEnum],
  );
  const foundBySlug = useMemo(() => workflowStatusEnum.findBy('slug', searchSlug), [searchSlug, workflowStatusEnum]);

  return (
    <StoryPage
      title={t('storybook.stories.CoreApi.page.title')}
      description={t('storybook.stories.CoreApi.page.description')}
      highlights={['label()', 'findBy()', 'toList()', 'toMap()', 'meta']}
    >
      <StorySection
        title={t('storybook.stories.CoreApi.section.overview.title')}
        description={t('storybook.stories.CoreApi.section.overview.description')}
      >
        <TwoColumn
          left={
            <Card size="small" title={t('storybook.stories.CoreApi.card.basicInfo')}>
              <Descriptions
                size="small"
                column={1}
                items={[
                  { key: 'name', label: 'name', children: workflowStatusEnum.name || '-' },
                  { key: 'isEnum', label: 'Enum.isEnum', children: String(Enum.isEnum(workflowStatusEnum)) },
                  {
                    key: 'named',
                    label: t('storybook.stories.CoreApi.field.namedReviewLabel'),
                    children: workflowStatusEnum.named.Review.label,
                  },
                  {
                    key: 'meta',
                    label: t('storybook.stories.CoreApi.field.metaPhase'),
                    children: workflowStatusEnum.meta.phase.join(' / '),
                  },
                ]}
              />
            </Card>
          }
          right={
            <Card size="small" title={t('storybook.stories.CoreApi.card.arrays')}>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <div>
                  <Text type="secondary">keys</Text>
                  <TagGroup items={workflowStatusEnum.keys} />
                </div>
                <div>
                  <Text type="secondary">values</Text>
                  <TagGroup items={workflowStatusEnum.values} />
                </div>
                <div>
                  <Text type="secondary">labels</Text>
                  <TagGroup items={workflowStatusEnum.labels} />
                </div>
              </Space>
            </Card>
          }
        />
      </StorySection>

      <StorySection
        title={t('storybook.stories.CoreApi.section.query.title')}
        description={t('storybook.stories.CoreApi.section.query.description')}
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Select
            value={selectedValue}
            style={{ width: 320 }}
            options={workflowStatusEnum.items.map((item) => ({
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
              { key: 'label', label: 'label(value)', children: workflowStatusEnum.label(selectedValue) },
              { key: 'key', label: 'key(value)', children: workflowStatusEnum.key(selectedValue) },
              { key: 'has', label: 'has(value)', children: String(workflowStatusEnum.has(selectedValue)) },
              {
                key: 'raw',
                label: 'raw(value)',
                children: <Text code>{JSON.stringify(workflowStatusEnum.raw(selectedValue))}</Text>,
              },
              {
                key: 'current',
                label: t('storybook.stories.CoreApi.field.currentItem'),
                children: <Text code>{JSON.stringify(currentItem?.raw)}</Text>,
              },
            ]}
          />

          <Input
            addonBefore={t('storybook.stories.CoreApi.input.findBySlug')}
            value={searchSlug}
            style={{ maxWidth: 420 }}
            onChange={(event) => setSearchSlug(event.target.value)}
          />

          <Card size="small" title={t('storybook.stories.CoreApi.card.findByResult')}>
            <Text code>{JSON.stringify(foundBySlug?.raw ?? null)}</Text>
          </Card>
        </Space>
      </StorySection>

      <StorySection
        title={t('storybook.stories.CoreApi.section.transform.title')}
        description={t('storybook.stories.CoreApi.section.transform.description')}
      >
        <TwoColumn
          left={
            <JsonPreview
              title={t('storybook.stories.CoreApi.card.toList')}
              value={workflowStatusEnum.toList({
                valueField: 'id',
                labelField: 'name',
                extra: (item) => ({ phase: item.raw.phase, tone: item.raw.tone }),
              })}
            />
          }
          right={
            <JsonPreview
              title={t('storybook.stories.CoreApi.card.toMap')}
              value={workflowStatusEnum.toMap({
                keySelector: 'key',
                valueSelector: (item) => ({ value: item.value, label: item.label, tone: item.raw.tone }),
              })}
            />
          }
        />
      </StorySection>

      <StorySection
        title={t('storybook.stories.CoreApi.section.items.title')}
        description={t('storybook.stories.CoreApi.section.items.description')}
      >
        <Table
          className="ep-table"
          rowKey="key"
          pagination={false}
          columns={[
            { title: 'key', dataIndex: 'key', width: 120 },
            { title: 'value', dataIndex: 'value', width: 140 },
            { title: 'label', dataIndex: 'label', width: 160 },
            { title: t('storybook.stories.CoreApi.table.phase'), render: (_, row) => row.raw.phase, width: 120 },
            {
              title: t('storybook.stories.CoreApi.table.tone'),
              render: (_, row) => (
                <Tag color={row.raw.tone === 'success' ? 'green' : row.raw.tone === 'warning' ? 'orange' : 'blue'}>
                  {row.raw.tone}
                </Tag>
              ),
              width: 120,
            },
            { title: 'raw', render: (_, row) => <Text code>{JSON.stringify(row.raw)}</Text> },
          ]}
          dataSource={workflowStatusEnum.items}
        />
      </StorySection>
    </StoryPage>
  );
}

function NamingConflictDemo() {
  const t = useStoryT();
  const conflictEnum = useMemo(() => createConflictEnum(t), [t]);
  const enumWithSymbols = conflictEnum as typeof conflictEnum & Record<symbol, unknown>;

  return (
    <StoryPage
      title={t('storybook.stories.CoreApi.conflict.page.title')}
      description={t('storybook.stories.CoreApi.conflict.page.description')}
      highlights={['ITEMS', 'KEYS', 'VALUES', 'LABELS', 'META', 'NAMED']}
    >
      <StorySection
        title={t('storybook.stories.CoreApi.conflict.section.title')}
        description={t('storybook.stories.CoreApi.conflict.section.description')}
      >
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
                  children: String(conflictEnum.items),
                },
                {
                  key: 'values',
                  label: 'ConflictEnum.values',
                  children: String(conflictEnum.values),
                },
                {
                  key: 'meta',
                  label: 'ConflictEnum.meta',
                  children: String(conflictEnum.meta),
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
