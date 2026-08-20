import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  Descriptions,
  Dropdown,
  List,
  Menu,
  Progress,
  Radio,
  Row,
  Segmented,
  Select,
  Space,
  Steps,
  Statistic,
  Table,
  Tag,
  Tabs,
  Timeline,
  Tooltip,
  Typography,
} from 'antd';
import { Enum } from '../../src';
import { storyT, useStoryT } from '../locales';
import { CodePreview, JsonPreview, StoryPage, StorySection, stringifyPreview, TwoColumn } from './shared/demo';

const { Text } = Typography;

type StatusKey = 1 | 2 | 3 | 4;

const toneColorMap: Record<string, 'default' | 'processing' | 'success' | 'warning'> = {
  default: 'default',
  processing: 'processing',
  success: 'success',
  warning: 'warning',
};

const meta: Meta = {
  title: 'Core/UI Outputs and Derived Data',
  // @ts-expect-error: because titleCN is an extension field
  titleCN: '核心/UI 输出与派生数据',
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
  const [selectedStatus, setSelectedStatus] = useState<StatusKey | 0>(1);

  const StatusEnum = useMemo(
    () =>
      Enum(
        {
          Draft: {
            value: 1,
            label: t('storybook.stories.CoreUiOutputs.draft'),
            phase: t('storybook.stories.CoreUiOutputs.phaseEditing'),
            tone: 'default',
            count: 3,
          },
          Review: {
            value: 2,
            label: t('storybook.stories.CoreUiOutputs.review'),
            phase: t('storybook.stories.CoreUiOutputs.phaseEditing'),
            tone: 'processing',
            count: 5,
          },
          Published: {
            value: 3,
            label: t('storybook.stories.CoreUiOutputs.published'),
            phase: t('storybook.stories.CoreUiOutputs.phaseOnline'),
            tone: 'success',
            count: 8,
          },
          Archived: {
            value: 4,
            label: t('storybook.stories.CoreUiOutputs.archived'),
            phase: t('storybook.stories.CoreUiOutputs.phaseArchive'),
            tone: 'warning',
            count: 2,
          },
        },
        { name: t('storybook.stories.CoreUiOutputs.statusName') },
      ),
    [t],
  );

  const selectOptions = useMemo(() => StatusEnum.toList(), [StatusEnum]);
  const allOption = { value: 0, label: t('storybook.stories.CoreUiOutputs.allStatuses') };
  const checkboxValue = selectedStatus === 0 ? [] : [selectedStatus];
  const menuItems = useMemo(
    () => [allOption, ...StatusEnum.items].map((item) => ({ key: String(item.value), label: item.label })),
    [StatusEnum.items, allOption],
  );
  const timelineItems = useMemo(
    () =>
      StatusEnum.items.map((item) => {
        const raw = item.raw as { tone?: string; phase?: string; count?: number };
        return {
          color: toneColorMap[raw.tone as string],
          children: (
            // eslint-disable-next-line @typescript-eslint/no-use-before-define
            <Button type="text" onClick={() => onFilterChange(item.value as StatusKey)}>
              {item.label} · {raw.phase}
            </Button>
          ),
        };
      }),
    [StatusEnum.items],
  );
  const totalCount = useMemo(
    () => StatusEnum.items.reduce((sum, item) => sum + ((item.raw as { count?: number }).count ?? 0), 0),
    [StatusEnum],
  );

  const dataSource = useMemo(
    () => [
      { id: 1, title: 'Enum-plus release notes', visits: 1280, status: 3 },
      { id: 2, title: 'Migration guide draft', visits: 320, status: 1 },
      { id: 3, title: 'Frontend enum audit', visits: 760, status: 2 },
      { id: 4, title: 'Archived benchmark notes', visits: 210, status: 4 },
    ],
    [],
  );

  const filteredRows = selectedStatus === 0 ? dataSource : dataSource.filter((item) => item.status === selectedStatus);
  const currentRaw = selectedStatus === 0 ? undefined : StatusEnum.raw(selectedStatus);
  const activeStatus = selectedStatus === 0 ? 1 : selectedStatus;
  const activeStepIndex = StatusEnum.items.findIndex((item) => item.value === activeStatus);
  const activeProgressPercent = currentRaw
    ? Math.round((((currentRaw as { count?: number }).count ?? 0) / totalCount) * 100)
    : 100;

  const onFilterChange = (value: StatusKey | 0) => setSelectedStatus(value);

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
      <StorySection title={t('storybook.stories.enumInitialization')}>
        <CodePreview
          title=""
          code={`
const StatusEnum = Enum({
  Draft: { value: 1, label: '${t('storybook.stories.CoreUiOutputs.draft')}', phase: '${t('storybook.stories.CoreUiOutputs.phaseEditing')}', tone: 'default', count: 3 },
  Review: { value: 2, label: '${t('storybook.stories.CoreUiOutputs.review')}', phase: '${t('storybook.stories.CoreUiOutputs.phaseEditing')}', tone: 'processing', count: 5 },
  Published: { value: 3, label: '${t('storybook.stories.CoreUiOutputs.published')}', phase: '${t('storybook.stories.CoreUiOutputs.phaseOnline')}', tone: 'success', count: 8 },
  Archived: { value: 4, label: '${t('storybook.stories.CoreUiOutputs.archived')}', phase: '${t('storybook.stories.CoreUiOutputs.phaseArchive')}', tone: 'warning', count: 2 },
});
`}
        />
      </StorySection>
      <StorySection
        title={t('storybook.stories.CoreUiOutputs.filtersTitle')}
        description={t('storybook.stories.CoreUiOutputs.filtersDescription')}
      >
        <Space orientation="vertical" size={16} style={{ width: '100%' }}>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card size="small" title={t('storybook.stories.CoreUiOutputs.segmentedLabel')}>
                <Segmented
                  block
                  value={selectedStatus}
                  options={[allOption, ...StatusEnum.items]}
                  onChange={(value) => onFilterChange(value as StatusKey | 0)}
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card size="small" title={t('storybook.stories.CoreUiOutputs.selectLabel')}>
                <Select
                  value={selectedStatus}
                  style={{ width: '100%' }}
                  options={[allOption, ...selectOptions]}
                  onChange={(value) => onFilterChange(value as StatusKey | 0)}
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card size="small" title={t('storybook.stories.CoreUiOutputs.radioLabel')}>
                <Radio.Group
                  value={selectedStatus}
                  onChange={(event) => onFilterChange(event.target.value)}
                  options={[allOption, ...StatusEnum.items]}
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card size="small" title={t('storybook.stories.CoreUiOutputs.dropdownLabel')}>
                <Dropdown
                  menu={{
                    items: menuItems,
                    selectable: true,
                    selectedKeys: [String(selectedStatus)],
                    onClick: ({ key }) => onFilterChange(Number(key) as StatusKey | 0),
                  }}
                  trigger={['click']}
                >
                  <Button block>
                    {currentRaw ? StatusEnum.label(selectedStatus) : t('storybook.stories.CoreUiOutputs.allStatuses')}
                  </Button>
                </Dropdown>
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card size="small" title={t('storybook.stories.CoreUiOutputs.checkboxLabel')}>
                <Checkbox.Group
                  value={checkboxValue}
                  options={StatusEnum.items.map((item) => ({ label: item.label, value: item.value }))}
                  onChange={(values) => {
                    const nextValue = values[values.length - 1] as StatusKey | undefined;
                    onFilterChange(nextValue ?? 0);
                  }}
                />
              </Card>
            </Col>
            <Col xs={24} md={12}>
              <Card size="small" title={t('storybook.stories.CoreUiOutputs.menuLabel')}>
                <Menu
                  selectedKeys={[String(selectedStatus)]}
                  mode="inline"
                  items={menuItems}
                  onClick={({ key }) => onFilterChange(Number(key) as StatusKey | 0)}
                />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card size="small" title={t('storybook.stories.CoreUiOutputs.timelineLabel')}>
                <Timeline items={timelineItems} />
              </Card>
            </Col>
            <Col span={24}>
              <Card size="small" title={t('storybook.stories.CoreUiOutputs.tagLabel')}>
                <Space size={24} wrap>
                  <Badge count={totalCount} color="blue">
                    <Tag
                      color={selectedStatus === 0 ? 'blue' : 'default'}
                      style={{ cursor: 'pointer', marginInlineEnd: 0 }}
                      onClick={() => onFilterChange(0)}
                    >
                      {t('storybook.stories.CoreUiOutputs.allStatuses')}
                    </Tag>
                  </Badge>
                  {StatusEnum.items.map((item) => {
                    const raw = item.raw as { tone?: string; count?: number };
                    const active = selectedStatus === item.value;
                    return (
                      <Badge key={item.key} count={raw.count ?? 0}>
                        <Tag
                          color={active ? 'blue' : 'default'}
                          style={{
                            cursor: 'pointer',
                            marginInlineEnd: 0,
                          }}
                          onClick={() => onFilterChange(active ? 0 : (item.value as StatusKey))}
                        >
                          {item.label}
                        </Tag>
                      </Badge>
                    );
                  })}
                </Space>
              </Card>
            </Col>
            <Col span={24}>
              <Card size="small" title={t('storybook.stories.CoreUiOutputs.tabsLabel')}>
                <Tabs
                  activeKey={String(selectedStatus)}
                  items={menuItems.map((item) => ({ key: item.key, label: item.label }))}
                  onChange={(key) => onFilterChange(Number(key) as StatusKey | 0)}
                />
              </Card>
            </Col>
            <Col span={24}>
              <Card size="small" title={t('storybook.stories.CoreUiOutputs.stepsLabel')}>
                <Space orientation="vertical" size={16} style={{ width: '100%' }}>
                  <Steps
                    current={Math.max(activeStepIndex, 0)}
                    items={StatusEnum.items.map((item) => {
                      const raw = item.raw as { phase?: string };
                      return {
                        title: item.label,
                        description: raw.phase,
                      };
                    })}
                  />
                  <Progress
                    percent={activeProgressPercent}
                    status="active"
                    strokeColor={
                      currentRaw ? toneColorMap[(currentRaw as { tone?: string }).tone as string] : undefined
                    }
                  />
                </Space>
              </Card>
            </Col>
            <Col span={24}>
              <Button block type={selectedStatus === 0 ? 'default' : 'primary'} onClick={() => onFilterChange(0)}>
                {t('storybook.stories.CoreUiOutputs.resetFilter')}
              </Button>
            </Col>

            <Alert
              type="info"
              showIcon
              title={t('storybook.stories.CoreUiOutputs.filtersAlertTitle')}
              description={t('storybook.stories.CoreUiOutputs.filtersAlertDescription')}
            />
          </Row>
        </Space>
      </StorySection>

      <StorySection
        title={t('storybook.stories.CoreUiOutputs.overviewTitle')}
        description={t('storybook.stories.CoreUiOutputs.overviewDescription')}
      >
        <Space orientation="vertical" size={16} style={{ width: '100%' }}>
          <Row gutter={[16, 16]}>
            {StatusEnum.items.map((item) => {
              const raw = item.raw as { count?: number; tone?: string };
              const percent = totalCount ? Math.round(((raw.count ?? 0) / totalCount) * 100) : 0;
              return (
                <Col xs={24} md={12} lg={6} key={item.key}>
                  <Card size="small">
                    <Statistic
                      title={
                        <Space>
                          <Avatar size="small" style={{ background: toneColorMap[raw.tone as string] }}>
                            {stringifyPreview(item.label, { forceText: true }).slice(1, 2)}
                          </Avatar>
                          <span>{item.label}</span>
                        </Space>
                      }
                      value={raw.count ?? 0}
                      prefix={<Badge status={toneColorMap[raw.tone as string]} />}
                    />
                    <Progress percent={percent} strokeColor={toneColorMap[raw.tone as string]} size="small" />
                  </Card>
                </Col>
              );
            })}
          </Row>

          <Card size="small" title={t('storybook.stories.CoreUiOutputs.currentCardTitle')}>
            <Space orientation="vertical" size={12} style={{ width: '100%' }}>
              <Space wrap>
                {StatusEnum.items.map((item) => {
                  const raw = item.raw as { tone?: string };
                  return (
                    <Tooltip key={item.key} title={t('storybook.stories.CoreUiOutputs.overviewBadgeHint')}>
                      <Badge
                        status={toneColorMap[raw.tone as string]}
                        text={
                          <Space>
                            <Tag color={raw.tone}>{item.label}</Tag>
                          </Space>
                        }
                      />
                    </Tooltip>
                  );
                })}
              </Space>
              <Descriptions
                size="small"
                column={{ xs: 1, sm: 2, md: 3 }}
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
                      ? StatusEnum.label(selectedStatus)
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
                  {
                    key: 'count',
                    label: t('storybook.stories.CoreUiOutputs.currentCount'),
                    children: currentRaw?.count ?? '-',
                  },
                ]}
              />
            </Space>
          </Card>
        </Space>
      </StorySection>

      <StorySection
        title={t('storybook.stories.CoreUiOutputs.cardTitle')}
        description={t('storybook.stories.CoreUiOutputs.cardDescription')}
      >
        <List
          grid={{ gutter: 16, column: 4, xs: 1, sm: 2 }}
          dataSource={StatusEnum.items}
          renderItem={(item) => {
            const raw = item.raw as { count?: number; tone?: string; phase?: string };
            return (
              <List.Item>
                <Card size="small" style={{ width: '100%' }}>
                  <Space orientation="vertical" size={8}>
                    <Tag color={raw.tone}>{item.label}</Tag>
                    <Text type="secondary">{raw.phase}</Text>
                    <Text strong>{raw.count ?? 0}</Text>
                  </Space>
                </Card>
              </List.Item>
            );
          }}
        />
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
                const raw = StatusEnum.raw(value);
                return <Tag color={raw?.tone}>{StatusEnum.label(value)}</Tag>;
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
            <Space orientation="vertical" size={16} style={{ width: '100%' }}>
              <JsonPreview
                forceEnumText
                title={t('storybook.stories.CoreUiOutputs.itemsCard')}
                description={t('storybook.stories.CoreUiOutputs.itemsCard.items.usage')}
                value={StatusEnum.items.map((item) => ({ ...item, raw: undefined }))}
              />
              <JsonPreview
                forceEnumText
                title="toFilter"
                description={t('storybook.stories.CoreUiOutputs.itemsCard.toFilter.usage')}
                value={StatusEnum.toFilter()}
              />
              <JsonPreview
                forceEnumText
                title="toValueMap"
                description={t('storybook.stories.CoreUiOutputs.itemsCard.toValueMap.usage')}
                value={StatusEnum.toValueMap()}
              />
            </Space>
          }
          right={
            <Space orientation="vertical" size={16} style={{ width: '100%' }}>
              <JsonPreview
                forceEnumText
                title={t('storybook.stories.CoreUiOutputs.toListCard')}
                description={t('storybook.stories.CoreUiOutputs.itemsCard.toList.usage')}
                value={StatusEnum.toList()}
              />
              <JsonPreview
                forceEnumText
                title={t('storybook.stories.CoreUiOutputs.toMapCard')}
                value={StatusEnum.toMap({ keySelector: 'value', valueSelector: 'label' })}
              />
              <JsonPreview
                forceEnumText
                title="toSelect"
                description={t('storybook.stories.CoreUiOutputs.itemsCard.toSelect.usage')}
                value={StatusEnum.toSelect()}
              />
              <JsonPreview
                forceEnumText
                title="toMenu"
                description={t('storybook.stories.CoreUiOutputs.itemsCard.toMenu.usage')}
                value={StatusEnum.toMenu()}
              />
            </Space>
          }
        />
      </StorySection>
    </StoryPage>
  );
}

export const Playground: Story = {
  name: 'UI Outputs and Derived Data',
  // @ts-expect-error: because nameCN is an extension field
  nameCN: 'UI 输出与派生数据',
  render: function Render() {
    return <UiOutputsDemo />;
  },
};
