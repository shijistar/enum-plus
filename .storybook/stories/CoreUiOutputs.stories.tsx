import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, Descriptions, Select, Space, Table, Tag, Typography } from 'antd';
import { Enum } from '../../src';
import { storyT, useStoryLocale } from '../locales';
import { CodePreview, JsonPreview, StoryPage, StorySection, TwoColumn } from './shared/demo';

const { Text } = Typography;

const meta: Meta = {
  title: 'Core/04 UI Outputs and Derived Data',
  parameters: {
    docs: {
      description: {
        component: storyT('storybook.stories.CoreUiOutputs.metaDescription'),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function useCopy() {
  const locale = useStoryLocale();

  return locale === 'zh-CN'
    ? {
        pageTitle: '把同一份 enum 变成多个 UI 输出',
        pageDescription:
          '如果核心问题是“重复 UI enum plumbing”，那最应该单独展示的就是派生输出层：Select 需要 options，卡片需要 badge，表格需要 label + meta，静态配置又需要 map。这个页面专门演示一份 enum 如何同时喂给这些界面。',
        highlights: ['toList()', 'items', 'toMap()', 'meta/raw'],
        uiTitle: '一个运营面板，多处 UI，共用同一份 enum',
        uiDescription: '筛选器、状态徽标、表格列和统计卡片全部来自同一份 status enum。',
        selectLabel: '筛选状态',
        allStatuses: '全部状态',
        currentValue: '当前值',
        currentLabel: '当前 label',
        currentTone: '当前 tone',
        currentPhase: '当前 phase',
        cardTitle: '状态概览卡片',
        cardDescription: 'items 天然适合驱动自定义卡片或 badge 列表。',
        tableTitle: '表格渲染',
        tableDescription: 'label 和 raw/meta 可以直接进入表格列渲染逻辑。',
        derivedTitle: '派生结构校验',
        derivedDescription: '对 UI 层来说，最常见的出口就是 toList / items / toMap。',
        toListCard: 'toList()',
        itemsCard: 'items',
        toMapCard: 'toMap({ keySelector, valueSelector })',
        codeTitle: '同一份 enum 派生多个 UI 结构',
        article: '文章',
        visits: '访问量',
        status: '状态',
        draft: '草稿',
        review: '审核中',
        published: '已发布',
        archived: '已归档',
        phaseEditing: '编辑中',
        phaseOnline: '线上',
        phaseArchive: '归档',
        statusName: '发布状态',
      }
    : {
        pageTitle: 'Turn one enum into multiple UI outputs',
        pageDescription:
          'If the core frontend pain is duplicated enum plumbing, the derived-output layer deserves its own story. Select needs options, cards need badges, tables need labels plus meta, and config panels need maps. This page shows how one enum can feed all of them at once.',
        highlights: ['toList()', 'items', 'toMap()', 'meta/raw'],
        uiTitle: 'One operations panel, many UI surfaces, one enum source',
        uiDescription:
          'The filter, status badges, table columns, and summary cards all come from the same status enum.',
        selectLabel: 'Filter by status',
        allStatuses: 'All statuses',
        currentValue: 'Current value',
        currentLabel: 'Current label',
        currentTone: 'Current tone',
        currentPhase: 'Current phase',
        cardTitle: 'Status overview cards',
        cardDescription: 'items are a natural data source for custom cards or badge groups.',
        tableTitle: 'Table rendering',
        tableDescription: 'label and raw/meta fields can go straight into table render logic.',
        derivedTitle: 'Derived structure check',
        derivedDescription: 'For UI work, the most common exits are toList, items, and toMap.',
        toListCard: 'toList()',
        itemsCard: 'items',
        toMapCard: 'toMap({ keySelector, valueSelector })',
        codeTitle: 'Derive multiple UI structures from one enum',
        article: 'Article',
        visits: 'Visits',
        status: 'Status',
        draft: 'Draft',
        review: 'In Review',
        published: 'Published',
        archived: 'Archived',
        phaseEditing: 'Editing',
        phaseOnline: 'Online',
        phaseArchive: 'Archive',
        statusName: 'Publish Status',
      };
}

function UiOutputsDemo() {
  const copy = useCopy();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const statusEnum = useMemo(
    () =>
      Enum(
        {
          Draft: { value: 'draft', label: copy.draft, phase: copy.phaseEditing, tone: 'default', count: 3 },
          Review: { value: 'review', label: copy.review, phase: copy.phaseEditing, tone: 'processing', count: 5 },
          Published: { value: 'published', label: copy.published, phase: copy.phaseOnline, tone: 'success', count: 8 },
          Archived: { value: 'archived', label: copy.archived, phase: copy.phaseArchive, tone: 'default', count: 2 },
        },
        { name: copy.statusName },
      ),
    [copy],
  );

  const dataSource = useMemo(
    () => [
      { id: 1, title: 'Enum-plus release notes', visits: 1280, status: 'published' },
      { id: 2, title: 'Migration guide draft', visits: 320, status: 'draft' },
      { id: 3, title: 'Frontend enum audit', visits: 760, status: 'review' },
      { id: 4, title: 'Archived benchmark notes', visits: 210, status: 'archived' },
    ],
    [],
  );

  const filteredRows =
    selectedStatus === 'all' ? dataSource : dataSource.filter((item) => item.status === selectedStatus);
  const currentRaw = selectedStatus === 'all' ? undefined : statusEnum.raw(selectedStatus);

  return (
    <StoryPage title={copy.pageTitle} description={copy.pageDescription} highlights={copy.highlights}>
      <StorySection title={copy.uiTitle} description={copy.uiDescription}>
        <TwoColumn
          left={
            <Card size="small">
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Select
                  value={selectedStatus}
                  style={{ width: '100%' }}
                  options={[
                    { value: 'all', label: copy.allStatuses },
                    ...(statusEnum.toList() as { value: string; label: string }[]),
                  ]}
                  onChange={(value) => setSelectedStatus(value)}
                />
                <Descriptions
                  size="small"
                  column={1}
                  items={[
                    { key: 'value', label: copy.currentValue, children: selectedStatus },
                    {
                      key: 'label',
                      label: copy.currentLabel,
                      children: currentRaw ? statusEnum.label(selectedStatus) : copy.allStatuses,
                    },
                    { key: 'tone', label: copy.currentTone, children: currentRaw?.tone || '-' },
                    { key: 'phase', label: copy.currentPhase, children: currentRaw?.phase || '-' },
                  ]}
                />
              </Space>
            </Card>
          }
          right={
            <CodePreview
              title={copy.codeTitle}
              code={`const statusEnum = Enum({
  Draft: { value: 'draft', label: '${copy.draft}', phase: '${copy.phaseEditing}', tone: 'default' },
  Review: { value: 'review', label: '${copy.review}', phase: '${copy.phaseEditing}', tone: 'processing' },
  Published: { value: 'published', label: '${copy.published}', phase: '${copy.phaseOnline}', tone: 'success' },
  Archived: { value: 'archived', label: '${copy.archived}', phase: '${copy.phaseArchive}', tone: 'default' },
});

const selectOptions = statusEnum.toList();
const statusCards = statusEnum.items;
const badgeMap = statusEnum.toMap({ keySelector: 'value', valueSelector: 'label' });`}
            />
          }
        />
      </StorySection>

      <StorySection title={copy.cardTitle} description={copy.cardDescription}>
        <Space wrap>
          {statusEnum.items.map((item) => {
            const raw = item.raw as { count?: number; tone?: string; phase?: string };
            return (
              <Card key={item.key} size="small" style={{ width: 220 }}>
                <Space direction="vertical" size={8}>
                  <Tag color={raw.tone}>{item.label}</Tag>
                  <Text type="secondary">{raw.phase}</Text>
                  <Text strong>{raw.count ?? 0}</Text>
                </Space>
              </Card>
            );
          })}
        </Space>
      </StorySection>

      <StorySection title={copy.tableTitle} description={copy.tableDescription}>
        <Table
          className="ep-table"
          rowKey="id"
          pagination={false}
          columns={[
            { title: copy.article, dataIndex: 'title' },
            { title: copy.visits, dataIndex: 'visits' },
            {
              title: copy.status,
              dataIndex: 'status',
              render: (value: string) => {
                const raw = statusEnum.raw(value);
                return <Tag color={raw?.tone}>{statusEnum.label(value)}</Tag>;
              },
            },
          ]}
          dataSource={filteredRows}
        />
      </StorySection>

      <StorySection title={copy.derivedTitle} description={copy.derivedDescription}>
        <TwoColumn
          left={
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <JsonPreview title={copy.toListCard} value={statusEnum.toList()} />
              <JsonPreview title={copy.itemsCard} value={statusEnum.items} />
            </Space>
          }
          right={
            <JsonPreview
              title={copy.toMapCard}
              value={statusEnum.toMap({ keySelector: 'value', valueSelector: 'label' })}
            />
          }
        />
      </StorySection>
    </StoryPage>
  );
}

export const Playground: Story = {
  render: function Render() {
    return <UiOutputsDemo />;
  },
};
