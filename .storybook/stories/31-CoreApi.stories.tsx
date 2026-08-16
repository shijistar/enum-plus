import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, Descriptions, Input, Select, Space, Table, Tag, Typography } from 'antd';
import { Enum } from '../../src';
import { storyT, useStoryT } from '../locales';
import { JsonPreview, StoryPage, StorySection, stringifyPreview, TagGroup, TwoColumn } from './shared/demo';

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
  name: 'Query and Transform API',
  // @ts-expect-error: because nameCN is an extension field
  nameCN: '查询与转换 API',
  render: function Render() {
    return <ApiExplorer />;
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

function ApiExplorer() {
  const t = useStoryT();
  const workflowStatusEnum = useMemo(() => createWorkflowStatusEnum(t), [t]);
  const [selectedValue, setSelectedValue] = useState<string>('review');
  const [searchSlug, setSearchSlug] = useState<string>('published');
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
              <Space orientation="vertical" size={12} style={{ width: '100%' }}>
                <Space>
                  <Text type="secondary">keys</Text>
                  <TagGroup items={workflowStatusEnum.keys} />
                </Space>
                <Space>
                  <Text type="secondary">values</Text>
                  <TagGroup items={workflowStatusEnum.values} />
                </Space>
                <Space>
                  <Text type="secondary">labels</Text>
                  <TagGroup items={workflowStatusEnum.labels} />
                </Space>
              </Space>
            </Card>
          }
        />
      </StorySection>

      <StorySection
        title={t('storybook.stories.CoreApi.section.query.title')}
        description={t('storybook.stories.CoreApi.section.query.description')}
      >
        <Space orientation="vertical" size={16} style={{ width: '100%' }}>
          <Select
            value={selectedValue}
            style={{ width: 320 }}
            options={workflowStatusEnum.items.map((item) => ({
              value: item.value,
              label: (
                <>
                  {item.label} ({item.key})
                </>
              ),
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
                key: 'item',
                label: 'item(value)',
                children: (
                  <Text code>{stringifyPreview(workflowStatusEnum.item(selectedValue), { forceText: true })}</Text>
                ),
              },
              {
                key: 'raw',
                label: 'raw(value)',
                children: <Text code>{JSON.stringify(workflowStatusEnum.raw(selectedValue))}</Text>,
              },
            ]}
          />
        </Space>
      </StorySection>
      <StorySection title="findBy">
        <Space orientation="vertical" style={{ width: '100%' }}>
          <Space>
            {t('storybook.stories.CoreApi.input.findBySlug') + ':'}
            <Input
              value={searchSlug}
              style={{ maxWidth: 420 }}
              onChange={(event) => setSearchSlug(event.target.value)}
            />
          </Space>
          <Card size="small" title={t('storybook.stories.CoreApi.card.findByResult')}>
            {foundBySlug ? <JsonPreview forceEnumText value={{ ...foundBySlug, raw: undefined }} /> : 'undefined'}
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
