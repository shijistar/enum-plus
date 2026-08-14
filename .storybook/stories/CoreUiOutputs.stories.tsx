import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, Descriptions, Select, Space, Table, Tag, Typography } from 'antd';
import { Enum } from '../../src';
import { storyT, useStoryT } from '../locales';
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

function UiOutputsDemo() {
  const t = useStoryT();
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const statusEnum = useMemo(
    () =>
      Enum(
        {
          Draft: {
            value: 'draft',
            label: t('storybook.stories.CoreUiOutputs.draft'),
            phase: t('storybook.stories.CoreUiOutputs.phaseEditing'),
            tone: 'default',
            count: 3,
          },
          Review: {
            value: 'review',
            label: t('storybook.stories.CoreUiOutputs.review'),
            phase: t('storybook.stories.CoreUiOutputs.phaseEditing'),
            tone: 'processing',
            count: 5,
          },
          Published: {
            value: 'published',
            label: t('storybook.stories.CoreUiOutputs.published'),
            phase: t('storybook.stories.CoreUiOutputs.phaseOnline'),
            tone: 'success',
            count: 8,
          },
          Archived: {
            value: 'archived',
            label: t('storybook.stories.CoreUiOutputs.archived'),
            phase: t('storybook.stories.CoreUiOutputs.phaseArchive'),
            tone: 'default',
            count: 2,
          },
        },
        { name: t('storybook.stories.CoreUiOutputs.statusName') },
      ),
    [t],
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
    <StoryPage
      title={t('storybook.stories.CoreUiOutputs.pageTitle')}
      description={t('storybook.stories.CoreUiOutputs.pageDescription')}
      highlights={[
        t('storybook.stories.CoreUiOutputs.highlights.toList'),
        t('storybook.stories.CoreUiOutputs.highlights.items'),
        t('storybook.stories.CoreUiOutputs.highlights.toMap'),
        t('storybook.stories.CoreUiOutputs.highlights.metaRaw'),
      ]}
    >
      <StorySection
        title={t('storybook.stories.CoreUiOutputs.uiTitle')}
        description={t('storybook.stories.CoreUiOutputs.uiDescription')}
      >
        <TwoColumn
          left={
            <Card size="small">
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Select
                  value={selectedStatus}
                  style={{ width: '100%' }}
                  options={[
                    { value: 'all', label: t('storybook.stories.CoreUiOutputs.allStatuses') },
                    ...(statusEnum.toList() as { value: string; label: string }[]),
                  ]}
                  onChange={(value) => setSelectedStatus(value)}
                />
                <Descriptions
                  size="small"
                  column={1}
                  items={[
                    {
                      key: 'value',
                      label: t('storybook.stories.CoreUiOutputs.currentValue'),
                      children: selectedStatus,
                    },
                    {
                      key: 'label',
                      label: t('storybook.stories.CoreUiOutputs.currentLabel'),
                      children: currentRaw
                        ? statusEnum.label(selectedStatus)
                        : t('storybook.stories.CoreUiOutputs.allStatuses'),
                    },
                    {
                      key: 'tone',
                      label: t('storybook.stories.CoreUiOutputs.currentTone'),
                      children: currentRaw?.tone || '-',
                    },
                    {
                      key: 'phase',
                      label: t('storybook.stories.CoreUiOutputs.currentPhase'),
                      children: currentRaw?.phase || '-',
                    },
                  ]}
                />
              </Space>
            </Card>
          }
          right={
            <CodePreview
              title={t('storybook.stories.CoreUiOutputs.codeTitle')}
              code={`const statusEnum = Enum({
  Draft: { value: 'draft', label: '${t('storybook.stories.CoreUiOutputs.draft')}', phase: '${t('storybook.stories.CoreUiOutputs.phaseEditing')}', tone: 'default' },
  Review: { value: 'review', label: '${t('storybook.stories.CoreUiOutputs.review')}', phase: '${t('storybook.stories.CoreUiOutputs.phaseEditing')}', tone: 'processing' },
  Published: { value: 'published', label: '${t('storybook.stories.CoreUiOutputs.published')}', phase: '${t('storybook.stories.CoreUiOutputs.phaseOnline')}', tone: 'success' },
  Archived: { value: 'archived', label: '${t('storybook.stories.CoreUiOutputs.archived')}', phase: '${t('storybook.stories.CoreUiOutputs.phaseArchive')}', tone: 'default' },
});

const selectOptions = statusEnum.toList();
const statusCards = statusEnum.items;
const badgeMap = statusEnum.toMap({ keySelector: 'value', valueSelector: 'label' });`}
            />
          }
        />
      </StorySection>

      <StorySection
        title={t('storybook.stories.CoreUiOutputs.cardTitle')}
        description={t('storybook.stories.CoreUiOutputs.cardDescription')}
      >
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

      <StorySection
        title={t('storybook.stories.CoreUiOutputs.tableTitle')}
        description={t('storybook.stories.CoreUiOutputs.tableDescription')}
      >
        <Table
          className="ep-table"
          rowKey="id"
          pagination={false}
          columns={[
            { title: t('storybook.stories.CoreUiOutputs.article'), dataIndex: 'title' },
            { title: t('storybook.stories.CoreUiOutputs.visits'), dataIndex: 'visits' },
            {
              title: t('storybook.stories.CoreUiOutputs.status'),
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

      <StorySection
        title={t('storybook.stories.CoreUiOutputs.derivedTitle')}
        description={t('storybook.stories.CoreUiOutputs.derivedDescription')}
      >
        <TwoColumn
          left={
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <JsonPreview title={t('storybook.stories.CoreUiOutputs.toListCard')} value={statusEnum.toList()} />
              <JsonPreview title={t('storybook.stories.CoreUiOutputs.itemsCard')} value={statusEnum.items} />
            </Space>
          }
          right={
            <JsonPreview
              title={t('storybook.stories.CoreUiOutputs.toMapCard')}
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
