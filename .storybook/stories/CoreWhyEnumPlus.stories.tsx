import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, Descriptions, Select, Space, Table, Tag, Typography } from 'antd';
import { Enum } from '../../src';
import { storyT, useStoryLocale } from '../locales';
import { CodePreview, JsonPreview, KpiRow, StoryPage, StorySection, TwoColumn } from './shared/demo';

const { Text } = Typography;

const meta: Meta = {
  title: 'Core/01 From Duplicate Maps to One Enum Source',
  parameters: {
    docs: {
      description: {
        component: storyT('storybook.stories.CoreWhyEnumPlus.metaDescription'),
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
        pageTitle: '先解决重复 UI plumbing，再谈 API 细节',
        pageDescription:
          '很多前端项目里，真正的痛点不是“有没有 enum”，而是同一份状态字典要在 labelMap、Select options、Table filters、Badge color map 里反复抄写。这个页面先把问题摊开，再展示 enum-plus 如何把这些重复结构收束成一个单一数据源。',
        highlights: ['重复映射', '单一数据源', 'UI 派生输出', '业务查询'],
        compareTitle: '左边是传统重复结构，右边是一份 enum 定义',
        compareDescription: '同一个内容状态场景里，看看“多份 map 并存”和“一份 enum 派生输出”的差别。',
        legacyCode: '传统实现（多个并行结构）',
        enumCode: 'enum-plus 实现（一个来源）',
        legacyData: '传统并行结构',
        enumData: 'enum-plus 派生结果',
        interactionTitle: '同一份数据同时驱动查询、下拉和表格展示',
        interactionDescription: '当状态发生变化时，只需要更新一处定义，而不是同步维护 4~5 份 UI plumbing。',
        currentValue: '当前值',
        legacyLabel: 'legacy labelMap',
        enumLabel: 'enum.label(value)',
        enumKey: 'enum.key(value)',
        enumPhase: 'enum.raw(value).phase',
        duplicatedStructures: '重复结构数',
        enumSources: 'enum 数据源',
        derivedOutputs: '常用派生输出',
        tableTitle: '同一份 enum 支撑页面渲染',
        tableDescription: '表格中的 badge 文案和颜色，都从同一份 enum 的 raw / label 里派生。',
        article: '文章',
        status: '状态',
        phase: '阶段',
        selectPlaceholder: '选择一个状态',
        statusEnumName: '内容状态',
        draft: '草稿',
        review: '审核中',
        published: '已发布',
        archived: '已归档',
        phaseEditing: '编辑中',
        phaseOnline: '线上',
        phaseArchive: '归档',
      }
    : {
        pageTitle: 'Solve duplicated UI plumbing before talking about API details',
        pageDescription:
          'In many frontend apps, the real problem is not whether enums exist — it is that the same status dictionary gets copied into label maps, Select options, table filters, and badge maps. This page makes that duplication visible first, then shows how enum-plus compresses it into one source of truth.',
        highlights: ['Duplicated maps', 'One source of truth', 'UI derived data', 'Business lookup'],
        compareTitle: 'Legacy parallel maps on the left, one enum source on the right',
        compareDescription:
          'Use the same content-status scenario to compare duplicated structures with enum-derived outputs.',
        legacyCode: 'Legacy approach (parallel structures)',
        enumCode: 'enum-plus approach (one source)',
        legacyData: 'Legacy parallel data',
        enumData: 'enum-plus derived outputs',
        interactionTitle: 'One enum can power lookup, select binding, and table rendering',
        interactionDescription:
          'When status rules change, you update one definition instead of synchronizing four or five separate UI maps.',
        currentValue: 'Current value',
        legacyLabel: 'legacy labelMap',
        enumLabel: 'enum.label(value)',
        enumKey: 'enum.key(value)',
        enumPhase: 'enum.raw(value).phase',
        duplicatedStructures: 'Duplicated structures',
        enumSources: 'Enum sources',
        derivedOutputs: 'Common derived outputs',
        tableTitle: 'The same enum drives actual page rendering',
        tableDescription: 'Both badge text and badge color are derived from the same enum raw/meta data.',
        article: 'Article',
        status: 'Status',
        phase: 'Phase',
        selectPlaceholder: 'Pick a status',
        statusEnumName: 'Content Status',
        draft: 'Draft',
        review: 'In Review',
        published: 'Published',
        archived: 'Archived',
        phaseEditing: 'Editing',
        phaseOnline: 'Online',
        phaseArchive: 'Archive',
      };
}

function DuplicateMapsStory() {
  const copy = useCopy();
  const [selectedValue, setSelectedValue] = useState('review');

  const legacyBundle = useMemo(
    () => ({
      statusConst: {
        Draft: 'draft',
        Review: 'review',
        Published: 'published',
        Archived: 'archived',
      },
      statusLabelMap: {
        draft: copy.draft,
        review: copy.review,
        published: copy.published,
        archived: copy.archived,
      },
      statusSelectOptions: [
        { value: 'draft', label: copy.draft },
        { value: 'review', label: copy.review },
        { value: 'published', label: copy.published },
        { value: 'archived', label: copy.archived },
      ],
      statusFilterOptions: [
        { text: copy.draft, value: 'draft' },
        { text: copy.review, value: 'review' },
        { text: copy.published, value: 'published' },
        { text: copy.archived, value: 'archived' },
      ],
      badgeColorMap: {
        draft: 'default',
        review: 'processing',
        published: 'success',
        archived: 'default',
      },
    }),
    [copy],
  );

  const statusEnum = useMemo(
    () =>
      Enum(
        {
          Draft: { value: 'draft', label: copy.draft, phase: copy.phaseEditing, tone: 'default' },
          Review: { value: 'review', label: copy.review, phase: copy.phaseEditing, tone: 'processing' },
          Published: { value: 'published', label: copy.published, phase: copy.phaseOnline, tone: 'success' },
          Archived: { value: 'archived', label: copy.archived, phase: copy.phaseArchive, tone: 'default' },
        },
        { name: copy.statusEnumName },
      ),
    [copy],
  );

  const articles = useMemo(
    () => [
      { id: 1, title: 'Stop rebuilding label maps', status: 'review' },
      { id: 2, title: 'One source of truth for enum UI', status: 'published' },
      { id: 3, title: 'Gradual migration guide', status: 'draft' },
    ],
    [],
  );

  const currentRaw = statusEnum.raw(selectedValue);

  return (
    <StoryPage title={copy.pageTitle} description={copy.pageDescription} highlights={copy.highlights}>
      <StorySection title={copy.compareTitle} description={copy.compareDescription}>
        <TwoColumn
          left={
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <CodePreview
                title={copy.legacyCode}
                code={`const STATUS = { Draft: 'draft', Review: 'review', Published: 'published', Archived: 'archived' };
const statusLabelMap = { draft: '${copy.draft}', review: '${copy.review}', published: '${copy.published}', archived: '${copy.archived}' };
const statusSelectOptions = Object.entries(statusLabelMap).map(([value, label]) => ({ value, label }));
const badgeColorMap = { draft: 'default', review: 'processing', published: 'success', archived: 'default' };`}
              />
              <JsonPreview title={copy.legacyData} value={legacyBundle} />
            </Space>
          }
          right={
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <CodePreview
                title={copy.enumCode}
                code={`const statusEnum = Enum({
  Draft: { value: 'draft', label: '${copy.draft}', phase: '${copy.phaseEditing}', tone: 'default' },
  Review: { value: 'review', label: '${copy.review}', phase: '${copy.phaseEditing}', tone: 'processing' },
  Published: { value: 'published', label: '${copy.published}', phase: '${copy.phaseOnline}', tone: 'success' },
  Archived: { value: 'archived', label: '${copy.archived}', phase: '${copy.phaseArchive}', tone: 'default' },
}, { name: '${copy.statusEnumName}' });`}
              />
              <JsonPreview
                title={copy.enumData}
                value={{
                  label: statusEnum.label(selectedValue),
                  items: statusEnum.items,
                  toList: statusEnum.toList(),
                  toMap: statusEnum.toMap(),
                }}
              />
            </Space>
          }
        />
      </StorySection>

      <StorySection title={copy.interactionTitle} description={copy.interactionDescription}>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Card size="small">
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <Select
                value={selectedValue}
                style={{ width: 320 }}
                options={statusEnum.toList() as { value: string; label: string }[]}
                placeholder={copy.selectPlaceholder}
                onChange={(value) => setSelectedValue(value)}
              />
              <Descriptions
                size="small"
                column={2}
                items={[
                  { key: 'currentValue', label: copy.currentValue, children: selectedValue },
                  {
                    key: 'legacyLabel',
                    label: copy.legacyLabel,
                    children: legacyBundle.statusLabelMap[selectedValue as keyof typeof legacyBundle.statusLabelMap],
                  },
                  { key: 'enumLabel', label: copy.enumLabel, children: statusEnum.label(selectedValue) },
                  { key: 'enumKey', label: copy.enumKey, children: statusEnum.key(selectedValue) },
                  { key: 'enumPhase', label: copy.enumPhase, children: currentRaw?.phase },
                ]}
              />
            </Space>
          </Card>

          <KpiRow
            items={[
              { label: copy.duplicatedStructures, value: 5 },
              { label: copy.enumSources, value: 1 },
              { label: copy.derivedOutputs, value: 4 },
            ]}
          />
        </Space>
      </StorySection>

      <StorySection title={copy.tableTitle} description={copy.tableDescription}>
        <Table
          className="ep-table"
          rowKey="id"
          pagination={false}
          columns={[
            { title: copy.article, dataIndex: 'title' },
            {
              title: copy.status,
              dataIndex: 'status',
              render: (value: string) => {
                const raw = statusEnum.raw(value);
                return <Tag color={raw?.tone}>{statusEnum.label(value)}</Tag>;
              },
            },
            {
              title: copy.phase,
              dataIndex: 'status',
              render: (value: string) => <Text type="secondary">{statusEnum.raw(value)?.phase}</Text>,
            },
          ]}
          dataSource={articles}
        />
      </StorySection>
    </StoryPage>
  );
}

export const Playground: Story = {
  render: function Render() {
    return <DuplicateMapsStory />;
  },
};
