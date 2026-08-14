import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, Descriptions, Select, Space, Table, Tag, Typography } from 'antd';
import { Enum } from '../../src';
import { storyT, useStoryT } from '../locales';
import { CodePreview, JsonPreview, KpiRow, StoryPage, StorySection, TwoColumn } from './shared/demo';

const { Text } = Typography;

const meta: Meta = {
  title: 'Core/From Duplicate Maps to One Enum Source',
  // @ts-expect-error: because titleCN is an extension field
  titleCN: '核心/从重复映射到枚举源',
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

function DuplicateMapsStory() {
  const t = useStoryT();
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
        draft: t('storybook.stories.CoreWhyEnumPlus.draft'),
        review: t('storybook.stories.CoreWhyEnumPlus.review'),
        published: t('storybook.stories.CoreWhyEnumPlus.published'),
        archived: t('storybook.stories.CoreWhyEnumPlus.archived'),
      },
      statusSelectOptions: [
        { value: 'draft', label: t('storybook.stories.CoreWhyEnumPlus.draft') },
        { value: 'review', label: t('storybook.stories.CoreWhyEnumPlus.review') },
        { value: 'published', label: t('storybook.stories.CoreWhyEnumPlus.published') },
        { value: 'archived', label: t('storybook.stories.CoreWhyEnumPlus.archived') },
      ],
      statusFilterOptions: [
        { text: t('storybook.stories.CoreWhyEnumPlus.draft'), value: 'draft' },
        { text: t('storybook.stories.CoreWhyEnumPlus.review'), value: 'review' },
        { text: t('storybook.stories.CoreWhyEnumPlus.published'), value: 'published' },
        { text: t('storybook.stories.CoreWhyEnumPlus.archived'), value: 'archived' },
      ],
      badgeColorMap: {
        draft: 'default',
        review: 'processing',
        published: 'success',
        archived: 'default',
      },
    }),
    [t],
  );

  const statusEnum = useMemo(
    () =>
      Enum(
        {
          Draft: {
            value: 'draft',
            label: t('storybook.stories.CoreWhyEnumPlus.draft'),
            phase: t('storybook.stories.CoreWhyEnumPlus.phaseEditing'),
            tone: 'default',
          },
          Review: {
            value: 'review',
            label: t('storybook.stories.CoreWhyEnumPlus.review'),
            phase: t('storybook.stories.CoreWhyEnumPlus.phaseEditing'),
            tone: 'processing',
          },
          Published: {
            value: 'published',
            label: t('storybook.stories.CoreWhyEnumPlus.published'),
            phase: t('storybook.stories.CoreWhyEnumPlus.phaseOnline'),
            tone: 'success',
          },
          Archived: {
            value: 'archived',
            label: t('storybook.stories.CoreWhyEnumPlus.archived'),
            phase: t('storybook.stories.CoreWhyEnumPlus.phaseArchive'),
            tone: 'default',
          },
        },
        { name: t('storybook.stories.CoreWhyEnumPlus.statusEnumName') },
      ),
    [t],
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
    <StoryPage
      title={t('storybook.stories.CoreWhyEnumPlus.pageTitle')}
      description={t('storybook.stories.CoreWhyEnumPlus.pageDescription')}
      highlights={[
        t('storybook.stories.CoreWhyEnumPlus.highlights.duplicatedMaps'),
        t('storybook.stories.CoreWhyEnumPlus.highlights.oneSource'),
        t('storybook.stories.CoreWhyEnumPlus.highlights.uiDerived'),
        t('storybook.stories.CoreWhyEnumPlus.highlights.businessLookup'),
      ]}
    >
      <StorySection
        title={t('storybook.stories.CoreWhyEnumPlus.compareTitle')}
        description={t('storybook.stories.CoreWhyEnumPlus.compareDescription')}
      >
        <TwoColumn
          left={
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <CodePreview
                title={t('storybook.stories.CoreWhyEnumPlus.legacyCode')}
                code={`const STATUS = { Draft: 'draft', Review: 'review', Published: 'published', Archived: 'archived' };
const statusLabelMap = { draft: '${t('storybook.stories.CoreWhyEnumPlus.draft')}', review: '${t('storybook.stories.CoreWhyEnumPlus.review')}', published: '${t('storybook.stories.CoreWhyEnumPlus.published')}', archived: '${t('storybook.stories.CoreWhyEnumPlus.archived')}' };
const statusSelectOptions = Object.entries(statusLabelMap).map(([value, label]) => ({ value, label }));
const badgeColorMap = { draft: 'default', review: 'processing', published: 'success', archived: 'default' };`}
              />
              <JsonPreview title={t('storybook.stories.CoreWhyEnumPlus.legacyData')} value={legacyBundle} />
            </Space>
          }
          right={
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <CodePreview
                title={t('storybook.stories.CoreWhyEnumPlus.enumCode')}
                code={`const statusEnum = Enum({
  Draft: { value: 'draft', label: '${t('storybook.stories.CoreWhyEnumPlus.draft')}', phase: '${t('storybook.stories.CoreWhyEnumPlus.phaseEditing')}', tone: 'default' },
  Review: { value: 'review', label: '${t('storybook.stories.CoreWhyEnumPlus.review')}', phase: '${t('storybook.stories.CoreWhyEnumPlus.phaseEditing')}', tone: 'processing' },
  Published: { value: 'published', label: '${t('storybook.stories.CoreWhyEnumPlus.published')}', phase: '${t('storybook.stories.CoreWhyEnumPlus.phaseOnline')}', tone: 'success' },
  Archived: { value: 'archived', label: '${t('storybook.stories.CoreWhyEnumPlus.archived')}', phase: '${t('storybook.stories.CoreWhyEnumPlus.phaseArchive')}', tone: 'default' },
}, { name: 'ContentStatus' });`}
              />
              <JsonPreview
                title={t('storybook.stories.CoreWhyEnumPlus.enumData')}
                value={{
                  label: statusEnum.label(selectedValue),
                  items: statusEnum.items.map((item) => ({
                    value: item.value,
                    label: item.label,
                    key: item.key,
                    phase: item.phase,
                    tone: item.tone,
                  })),
                  toList: statusEnum.toList(),
                  toMap: statusEnum.toMap(),
                }}
              />
            </Space>
          }
        />
      </StorySection>

      <StorySection
        title={t('storybook.stories.CoreWhyEnumPlus.interactionTitle')}
        description={t('storybook.stories.CoreWhyEnumPlus.interactionDescription')}
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Card size="small">
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <Select
                value={selectedValue}
                style={{ width: 320 }}
                options={statusEnum.toList() as { value: string; label: string }[]}
                placeholder={t('storybook.stories.CoreWhyEnumPlus.selectPlaceholder')}
                onChange={(value) => setSelectedValue(value)}
              />
              <Descriptions
                size="small"
                column={2}
                items={[
                  {
                    key: 'currentValue',
                    label: t('storybook.stories.CoreWhyEnumPlus.currentValue'),
                    children: selectedValue,
                  },
                  {
                    key: 'legacyLabel',
                    label: t('storybook.stories.CoreWhyEnumPlus.legacyLabel'),
                    children: legacyBundle.statusLabelMap[selectedValue as keyof typeof legacyBundle.statusLabelMap],
                  },
                  {
                    key: 'enumLabel',
                    label: t('storybook.stories.CoreWhyEnumPlus.enumLabel'),
                    children: statusEnum.label(selectedValue),
                  },
                  {
                    key: 'enumKey',
                    label: t('storybook.stories.CoreWhyEnumPlus.enumKey'),
                    children: statusEnum.key(selectedValue),
                  },
                  {
                    key: 'enumPhase',
                    label: t('storybook.stories.CoreWhyEnumPlus.enumPhase'),
                    children: currentRaw?.phase,
                  },
                ]}
              />
            </Space>
          </Card>

          <KpiRow
            items={[
              { label: t('storybook.stories.CoreWhyEnumPlus.duplicatedStructures'), value: 5 },
              { label: t('storybook.stories.CoreWhyEnumPlus.enumSources'), value: 1 },
              { label: t('storybook.stories.CoreWhyEnumPlus.derivedOutputs'), value: 4 },
            ]}
          />
        </Space>
      </StorySection>

      <StorySection
        title={t('storybook.stories.CoreWhyEnumPlus.tableTitle')}
        description={t('storybook.stories.CoreWhyEnumPlus.tableDescription')}
      >
        <Table
          className="ep-table"
          rowKey="id"
          pagination={false}
          columns={[
            { title: t('storybook.stories.CoreWhyEnumPlus.article'), dataIndex: 'title' },
            {
              title: t('storybook.stories.CoreWhyEnumPlus.status'),
              dataIndex: 'status',
              render: (value: string) => {
                const raw = statusEnum.raw(value);
                return <Tag color={raw?.tone}>{statusEnum.label(value)}</Tag>;
              },
            },
            {
              title: t('storybook.stories.CoreWhyEnumPlus.phase'),
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
