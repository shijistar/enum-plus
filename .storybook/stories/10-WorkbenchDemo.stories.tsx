import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import i18n from 'i18next';
import {
  Badge,
  Button,
  Card,
  Checkbox,
  Descriptions,
  Divider,
  Flex,
  Form,
  Input,
  Modal,
  Radio,
  Segmented,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { storyT, useStoryLocale } from '../locales';
import { CodePreview, JsonPreview, KpiRow, StoryPage, StorySection, TwoColumn } from './shared/demo';
import { ensureStoryI18n } from './shared/i18n';
import {
  channelOptions,
  createInitialRecords,
  formatNow,
  getNextRequestNumber,
  TableModeEnum,
  TicketChannelEnum,
  TicketFlagEnum,
  TicketFormValues,
  TicketOwnerEnum,
  TicketPriorityEnum,
  TicketRecord,
  TicketRegionEnum,
  TicketSeverityEnum,
  TicketStatusEnum,
} from './shared/workbench';

const { Paragraph, Text } = Typography;

const meta: Meta = {
  title: 'Demo/Full Demo',
  // @ts-expect-error: because titleCN is an extension field
  titleCN: '演示/完整示例',
  parameters: {
    docs: {
      description: {
        component: storyT('storybook.stories.workbenchDemo.metaDescription'),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function WorkbenchDemoBody() {
  const storyLocale = useStoryLocale();
  const instance = ensureStoryI18n();
  const [language, setLanguage] = useState(instance.language);
  const [records, setRecords] = useState<TicketRecord[]>(() => createInitialRecords());
  const [nextRequestNumber, setNextRequestNumber] = useState(() => getNextRequestNumber(createInitialRecords()));
  const [selectedRowKey, setSelectedRowKey] = useState<string>('REQ-1042');
  const [tableMode, setTableMode] = useState<typeof TableModeEnum.valueType>('all');
  const [statusFilter, setStatusFilter] = useState<typeof TicketStatusEnum.valueType | undefined>();
  const [channelFilter, setChannelFilter] = useState<typeof TicketChannelEnum.valueType | undefined>();
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm<TicketFormValues>();

  useEffect(() => {
    if (instance.language !== storyLocale) {
      void instance.changeLanguage(storyLocale);
    }
  }, [instance, storyLocale]);

  useEffect(() => {
    const handleLanguage = (nextLanguage: string) => {
      setLanguage(nextLanguage);
    };

    instance.on('languageChanged', handleLanguage);

    return () => {
      instance.off('languageChanged', handleLanguage);
    };
  }, [instance]);

  const t = useMemo(() => ((key: string) => instance.t(key)) as typeof instance.t, [instance, language]);
  const watchedRegion = Form.useWatch('region', form) || 'cnNorth';

  const ownerOptions = useMemo(() => TicketOwnerEnum.items, [TicketOwnerEnum]);

  const selectedRecord = records.find((item) => item.id === selectedRowKey) ?? records[0];

  const filteredRecords = useMemo(() => {
    const lowerSearch = searchText.trim().toLowerCase();
    return records.filter((record) => {
      if (tableMode === 'myOpen' && !['amy', 'ben'].includes(record.owner)) {
        return false;
      }
      if (tableMode === 'risk' && !(record.flags.includes('slaRisk') || record.severity === 'sev1')) {
        return false;
      }
      if (statusFilter && record.status !== statusFilter) {
        return false;
      }
      if (channelFilter && record.channel !== channelFilter) {
        return false;
      }
      if (!lowerSearch) {
        return true;
      }
      const statusText = String(TicketStatusEnum.findBy('value', record.status)?.label ?? '').toLowerCase();
      const priorityText = String(TicketPriorityEnum.findBy('value', record.priority)?.label ?? '').toLowerCase();
      const channelText = String(TicketChannelEnum.findBy('value', record.channel)?.label ?? '').toLowerCase();
      const ownerText = String(TicketOwnerEnum.findBy('value', record.owner)?.label ?? '').toLowerCase();
      const tenantText = record.tenant.toLowerCase();
      const titleText = record.title.toLowerCase();
      return [titleText, tenantText, statusText, priorityText, channelText, ownerText, record.id.toLowerCase()].some(
        (text) => text.includes(lowerSearch),
      );
    });
  }, [
    channelFilter,
    TicketChannelEnum,
    TicketOwnerEnum,
    TicketPriorityEnum,
    records,
    searchText,
    TicketStatusEnum,
    statusFilter,
    tableMode,
  ]);

  const kpis = useMemo(() => {
    const openCount = records.filter((item) => item.status !== 'resolved').length;
    const sev1Count = records.filter((item) => item.severity === 'sev1').length;
    const riskCount = records.filter((item) => item.flags.includes('slaRisk')).length;
    const escalatedCount = records.filter((item) => item.flags.includes('customerEscalated')).length;
    return [
      { label: t('storybook.stories.workbenchDemo.kpi.total'), value: records.length },
      { label: t('storybook.stories.workbenchDemo.kpi.open'), value: openCount },
      { label: t('storybook.stories.workbenchDemo.kpi.sev1'), value: sev1Count },
      {
        label: t('storybook.stories.workbenchDemo.kpi.escalated'),
        value: escalatedCount + ' / ' + riskCount,
      },
    ];
  }, [records, t]);

  const openCreateModal = () => {
    setEditingId(null);
    form.setFieldsValue({
      title: '',
      status: 'draft',
      priority: 'medium',
      channel: 'productBoard',
      owner: 'amy',
      region: 'cnNorth',
      severity: 'sev3',
      preferredView: tableMode,
      flags: [],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (record: TicketRecord) => {
    setEditingId(record.id);
    form.setFieldsValue({
      title: record.title,
      status: record.status,
      priority: record.priority,
      channel: record.channel,
      owner: record.owner,
      region: record.region,
      severity: record.severity,
      preferredView: record.preferredView,
      flags: record.flags,
    });
    setIsModalOpen(true);
  };

  const removeRecord = (id: string) => {
    setRecords((current) => {
      const next = current.filter((item) => item.id !== id);
      const fallback = next[0]?.id;
      if (selectedRowKey === id && fallback) {
        setSelectedRowKey(fallback);
      }
      return next;
    });
  };

  const saveRecord = async () => {
    try {
      const values = await form.validateFields();
      const timestamp = formatNow();

      if (editingId) {
        setRecords((current) =>
          current.map((item) =>
            item.id === editingId
              ? {
                  ...item,
                  ...values,
                  updatedAt: timestamp,
                }
              : item,
          ),
        );
        setSelectedRowKey(editingId);
      } else {
        const nextId = `REQ-${nextRequestNumber}`;
        const newRecord: TicketRecord = {
          id: nextId,
          key: nextId,
          createdAt: timestamp,
          updatedAt: timestamp,
          noteCount: 1,
          tenant:
            values.region === 'cnNorth'
              ? 'New APAC Tenant'
              : values.region === 'euWest'
                ? 'New EMEA Tenant'
                : 'New US Tenant',
          ...values,
        };
        setRecords((current) => [newRecord, ...current]);
        setSelectedRowKey(nextId);
        setTableMode(values.preferredView);
        setNextRequestNumber((value) => value + 1);
      }

      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      if (error && typeof error === 'object' && 'errorFields' in error) {
        return;
      }
      throw error;
    }
  };

  const flagTagNodes = (flags: (typeof TicketFlagEnum.valueType)[]) =>
    flags.length > 0 ? (
      <Space wrap>
        {flags.map((flag) => {
          const raw = TicketFlagEnum.raw(flag);
          return (
            <Tag key={flag} color={raw?.color || 'default'}>
              {TicketFlagEnum.label(flag)}
            </Tag>
          );
        })}
      </Space>
    ) : (
      <Text type="secondary">{t('storybook.stories.workbenchDemo.emptyFlags')}</Text>
    );

  const columns: ColumnsType<TicketRecord> = [
    {
      title: t('storybook.stories.workbenchDemo.table.id'),
      dataIndex: 'id',
      width: 120,
      fixed: 'left',
      render: (value: string) => <Text strong>{value}</Text>,
    },
    {
      title: t('storybook.stories.workbenchDemo.table.request'),
      dataIndex: 'title',
      width: 320,
      render: (_value, record) => (
        <Space direction="vertical" size={0}>
          <Text strong>{record.title}</Text>
          <Text type="secondary">{record.tenant}</Text>
        </Space>
      ),
    },
    {
      title: t('storybook.stories.workbenchDemo.table.status'),
      dataIndex: 'status',
      width: 160,
      filters: TicketStatusEnum.toFilter(),
      onFilter: (value, record) => record.status === value,
      render: (value: typeof TicketStatusEnum.valueType) => {
        const raw = TicketStatusEnum.raw(value);
        return <Badge status={raw?.badgeStatus} text={TicketStatusEnum.label(value)} />;
      },
    },
    {
      title: t('storybook.stories.workbenchDemo.table.channel'),
      dataIndex: 'channel',
      width: 160,
      filters: TicketChannelEnum.toFilter(),
      onFilter: (value, record) => record.channel === value,
      render: (value: typeof TicketChannelEnum.valueType) => TicketChannelEnum.label(value),
    },
    {
      title: t('storybook.stories.workbenchDemo.table.priority'),
      dataIndex: 'priority',
      width: 150,
      render: (value: typeof TicketPriorityEnum.valueType) => {
        const raw = TicketPriorityEnum.raw(value);
        return <Tag color={raw?.color || 'default'}>{TicketPriorityEnum.label(value)}</Tag>;
      },
    },
    {
      title: t('storybook.stories.workbenchDemo.table.channel'),
      dataIndex: 'channel',
      width: 170,
      filters: TicketChannelEnum.toFilter(),
      onFilter: (value, record) => record.channel === value,
      render: (value: typeof TicketChannelEnum.valueType) => {
        const raw = TicketChannelEnum.raw(value);
        return <Tag color={raw?.color || 'default'}>{TicketChannelEnum.label(value)}</Tag>;
      },
    },
    {
      title: t('storybook.stories.workbenchDemo.table.owner'),
      dataIndex: 'owner',
      width: 150,
      render: (value: typeof TicketOwnerEnum.valueType) => TicketOwnerEnum.label(value),
    },
    {
      title: t('storybook.stories.workbenchDemo.table.flags'),
      dataIndex: 'flags',
      width: 250,
      render: (value: (typeof TicketFlagEnum.valueType)[]) => flagTagNodes(value),
    },
    {
      title: t('storybook.stories.workbenchDemo.table.updatedAt'),
      dataIndex: 'updatedAt',
      width: 150,
    },
    {
      title: t('storybook.stories.workbenchDemo.table.actions'),
      key: 'actions',
      width: 160,
      fixed: 'right',
      render: (_value, record) => (
        <Space>
          <Button size="small" onClick={() => openEditModal(record)}>
            {t('storybook.stories.workbenchDemo.action.edit')}
          </Button>
          <Button size="small" danger onClick={() => removeRecord(record.id)}>
            {t('storybook.stories.workbenchDemo.action.delete')}
          </Button>
        </Space>
      ),
    },
  ];

  const sourcePreview = useMemo(
    () => ({
      statusSelect: TicketStatusEnum.toSelect(),
      statusFilter: TicketStatusEnum.toFilter(),
      statusValueMap: TicketStatusEnum.toValueMap(),
      channelTabs: TicketChannelEnum.toMenu(),
      flagRaw: TicketFlagEnum.raw('slaRisk'),
    }),
    [TicketChannelEnum, TicketFlagEnum, TicketStatusEnum],
  );

  const codeSample = `const statusEnum = Enum({
  Draft: { value: 'draft', label: 'ticket.status.draft', badgeStatus: 'default', color: 'default' },
  Triage: { value: 'triage', label: 'ticket.status.triage', badgeStatus: 'processing', color: 'blue' },
  Blocked: { value: 'blocked', label: 'ticket.status.blocked', badgeStatus: 'error', color: 'red' },
}, { name: 'ticket.status.enumName' });

<Select options={statusEnum.toSelect()} />
<Table columns={[{ dataIndex: 'status', filters: statusEnum.toFilter() }]} />
const statusMeta = statusEnum.raw('blocked'); // color / badge / hint
`;

  return (
    <StoryPage
      size="large"
      eyebrow={t('storybook.stories.workbenchDemo.eyebrow')}
      title={t('storybook.stories.workbenchDemo.page.title')}
      description={t('storybook.stories.workbenchDemo.page.description')}
    >
      <StorySection
        title={t('storybook.stories.workbenchDemo.section.overview.title')}
        description={t('storybook.stories.workbenchDemo.section.overview.description')}
        extra={
          <Space wrap>
            <Button
              type={language === 'zh-CN' ? 'primary' : 'default'}
              onClick={() => void i18n.changeLanguage('zh-CN')}
            >
              {storyT('storybook.preview.locale.zhCN')}
            </Button>
            <Button
              type={language === 'en-US' ? 'primary' : 'default'}
              onClick={() => void i18n.changeLanguage('en-US')}
            >
              {storyT('storybook.preview.locale.enUS')}
            </Button>
            <Button type="primary" onClick={openCreateModal}>
              {t('storybook.stories.workbenchDemo.action.newRecord')}
            </Button>
          </Space>
        }
      >
        <KpiRow items={kpis} />
        <Paragraph>{t('storybook.stories.workbenchDemo.overview.note')}</Paragraph>
      </StorySection>

      <StorySection
        title={t('storybook.stories.workbenchDemo.section.workspace.title')}
        description={t('storybook.stories.workbenchDemo.section.workspace.description')}
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Tabs
            defaultActiveKey={tableMode}
            items={TableModeEnum.items.map((item) => ({
              key: String(item.value),
              label: item.label,
              children: null,
            }))}
            onChange={(value) => {
              console.log(value);
              setTableMode(value as typeof TableModeEnum.valueType);
            }}
          />
          <Flex gap={12} wrap>
            <Select
              allowClear
              showSearch
              style={{ minWidth: 220 }}
              placeholder={t('storybook.stories.workbenchDemo.filter.statusPlaceholder')}
              options={TicketStatusEnum.items}
              value={statusFilter}
              filterOption={(input, option) => TicketStatusEnum.isMatch(input, option)}
              onChange={(value) => setStatusFilter(value as typeof TicketStatusEnum.valueType | undefined)}
            />
            <Select
              allowClear
              showSearch
              style={{ minWidth: 240 }}
              placeholder={t('storybook.stories.workbenchDemo.filter.channelPlaceholder')}
              options={channelOptions as { value: string; label: ReactNode; searchText: string }[]}
              value={channelFilter}
              filterOption={(input, option) =>
                TicketChannelEnum.isMatch(input, option) ||
                String(option?.searchText ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              onChange={(value) => setChannelFilter(value as typeof TicketChannelEnum.valueType | undefined)}
            />
            <Input.Search
              allowClear
              style={{ minWidth: 280 }}
              placeholder={t('storybook.stories.workbenchDemo.filter.searchPlaceholder')}
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
          </Flex>

          <Table
            className="ep-table"
            rowKey="id"
            scroll={{ x: 1600 }}
            pagination={false}
            columns={columns}
            dataSource={filteredRecords}
            rowSelection={{
              type: 'radio',
              selectedRowKeys: selectedRecord ? [selectedRecord.id] : [],
              onChange: (keys) => setSelectedRowKey(String(keys[0])),
            }}
          />
        </Space>
      </StorySection>

      <StorySection
        title={t('storybook.stories.workbenchDemo.section.detail.title')}
        description={t('storybook.stories.workbenchDemo.section.detail.description')}
      >
        <TwoColumn
          left={
            <Card size="small" title={t('storybook.stories.workbenchDemo.card.recordSummary')}>
              {selectedRecord ? (
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
                  <Descriptions
                    size="small"
                    column={1}
                    items={[
                      {
                        key: 'title',
                        label: t('storybook.stories.workbenchDemo.detail.title'),
                        children: selectedRecord.title,
                      },
                      {
                        key: 'tenant',
                        label: t('storybook.stories.workbenchDemo.detail.tenant'),
                        children: selectedRecord.tenant,
                      },
                      {
                        key: 'status',
                        label: t('storybook.stories.workbenchDemo.detail.status'),
                        children: (
                          <Badge
                            status={TicketStatusEnum.raw(selectedRecord.status)?.badgeStatus}
                            text={TicketStatusEnum.label(selectedRecord.status)}
                          />
                        ),
                      },
                      {
                        key: 'priority',
                        label: t('storybook.stories.workbenchDemo.detail.priority'),
                        children: (
                          <Tag color={TicketPriorityEnum.raw(selectedRecord.priority)?.color || 'default'}>
                            {TicketPriorityEnum.label(selectedRecord.priority)}
                          </Tag>
                        ),
                      },
                      {
                        key: 'owner',
                        label: t('storybook.stories.workbenchDemo.detail.owner'),
                        children: TicketOwnerEnum.label(selectedRecord.owner),
                      },
                      {
                        key: 'region',
                        label: t('storybook.stories.workbenchDemo.detail.region'),
                        children: TicketRegionEnum.label(selectedRecord.region),
                      },
                      {
                        key: 'severity',
                        label: t('storybook.stories.workbenchDemo.detail.severity'),
                        children: TicketSeverityEnum.label(selectedRecord.severity),
                      },
                      {
                        key: 'updated',
                        label: t('storybook.stories.workbenchDemo.detail.updatedAt'),
                        children: selectedRecord.updatedAt,
                      },
                    ]}
                  />
                  <Divider style={{ margin: 0 }} />
                  <div>
                    <Text strong>{t('storybook.stories.workbenchDemo.detail.flags')}</Text>
                    <div style={{ marginTop: 8 }}>{flagTagNodes(selectedRecord.flags)}</div>
                  </div>
                </Space>
              ) : null}
            </Card>
          }
          right={
            <Card size="small" title={t('storybook.stories.workbenchDemo.card.enumMetadata')}>
              {selectedRecord ? (
                <Descriptions
                  size="small"
                  column={1}
                  items={[
                    {
                      key: 'statusMeta',
                      label: 'status.raw()',
                      children: <Text code>{JSON.stringify(TicketStatusEnum.raw(selectedRecord.status))}</Text>,
                    },
                    {
                      key: 'priorityMeta',
                      label: 'priority.raw()',
                      children: <Text code>{JSON.stringify(TicketPriorityEnum.raw(selectedRecord.priority))}</Text>,
                    },
                    {
                      key: 'flagMeta',
                      label: 'flag.findBy()',
                      children: (
                        <Text code>
                          {JSON.stringify(TicketFlagEnum.findBy('value', selectedRecord.flags[0] || 'slaRisk')?.raw)}
                        </Text>
                      ),
                    },
                    {
                      key: 'channelMeta',
                      label: 'channel.raw()',
                      children: <Text code>{JSON.stringify(TicketChannelEnum.raw(selectedRecord.channel))}</Text>,
                    },
                  ]}
                />
              ) : null}
            </Card>
          }
        />
      </StorySection>

      <StorySection
        title={t('storybook.stories.workbenchDemo.section.source.title')}
        description={t('storybook.stories.workbenchDemo.section.source.description')}
      >
        <TwoColumn
          left={
            <JsonPreview title={t('storybook.stories.workbenchDemo.preview.pluginOutputs')} value={sourcePreview} />
          }
          right={<CodePreview title={t('storybook.stories.workbenchDemo.preview.codeSample')} code={codeSample} />}
        />
      </StorySection>

      <Modal
        open={isModalOpen}
        width={960}
        title={
          editingId
            ? t('storybook.stories.workbenchDemo.modal.editTitle')
            : t('storybook.stories.workbenchDemo.modal.createTitle')
        }
        okText={t('storybook.stories.workbenchDemo.modal.save')}
        cancelText={t('storybook.stories.workbenchDemo.modal.cancel')}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => void saveRecord()}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="title" label={t('storybook.stories.workbenchDemo.form.title')} rules={[{ required: true }]}>
            <Input placeholder={t('storybook.stories.workbenchDemo.form.titlePlaceholder')} />
          </Form.Item>

          <TwoColumn
            left={
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <Form.Item
                  name="status"
                  label={t('storybook.stories.workbenchDemo.form.status')}
                  rules={[{ required: true }]}
                >
                  <Radio.Group options={TicketStatusEnum.items} optionType="button" buttonStyle="solid" />
                </Form.Item>
                <Form.Item
                  name="priority"
                  label={t('storybook.stories.workbenchDemo.form.priority')}
                  rules={[{ required: true }]}
                >
                  <Segmented block options={TicketPriorityEnum.items} />
                </Form.Item>
                <Form.Item
                  name="channel"
                  label={t('storybook.stories.workbenchDemo.form.channel')}
                  rules={[{ required: true }]}
                >
                  <Select
                    showSearch
                    options={channelOptions as { value: string; label: ReactNode; searchText: string }[]}
                    filterOption={(input, option) =>
                      TicketChannelEnum.isMatch(input, option) ||
                      String(option?.searchText ?? '')
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  />
                </Form.Item>
                <Form.Item
                  name="owner"
                  label={t('storybook.stories.workbenchDemo.form.owner')}
                  rules={[{ required: true }]}
                >
                  <Select
                    showSearch
                    options={ownerOptions as { value: string; label: ReactNode }[]}
                    filterOption={(input, option) => TicketOwnerEnum.isMatch(input, option)}
                  />
                </Form.Item>
              </Space>
            }
            right={
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <Form.Item
                  name="region"
                  label={t('storybook.stories.workbenchDemo.form.region')}
                  rules={[{ required: true }]}
                >
                  <Tabs
                    items={TicketRegionEnum.toMenu()}
                    activeKey={watchedRegion}
                    onChange={(key) => form.setFieldValue('region', key)}
                  />
                </Form.Item>
                <Form.Item
                  name="severity"
                  label={t('storybook.stories.workbenchDemo.form.severity')}
                  rules={[{ required: true }]}
                >
                  <Radio.Group options={TicketSeverityEnum.items} />
                </Form.Item>
                <Form.Item
                  name="preferredView"
                  label={t('storybook.stories.workbenchDemo.form.preferredView')}
                  rules={[{ required: true }]}
                >
                  <Segmented block options={TableModeEnum.items} />
                </Form.Item>
                <Form.Item name="flags" label={t('storybook.stories.workbenchDemo.form.flags')}>
                  <Checkbox.Group options={TicketFlagEnum.items} />
                </Form.Item>
              </Space>
            }
          />
        </Form>
      </Modal>
    </StoryPage>
  );
}

export const Playground: Story = {
  name: 'Demo',
  // @ts-expect-error: because nameCN is an extension field
  nameCN: 'Demo',
  render: function Render() {
    return <WorkbenchDemoBody />;
  },
};
