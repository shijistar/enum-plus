import type { ReactNode } from 'react';
import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { orderBy } from 'lodash-es';
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
  Popconfirm,
  Radio,
  Segmented,
  Select,
  Space,
  Switch,
  Table,
  Tabs,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { changeLanguage, storyT, useStoryLocale, useStoryT } from '../locales';
import { CodePreview, JsonPreview, KpiRow, StoryPage, StorySection, TwoColumn } from './shared/demo';
import type { TicketFormValues, TicketRecord } from './shared/workbench';
import {
  channelOptions,
  createInitialRecords,
  formatNow,
  getNextRequestNumber,
  TableModeEnum,
  TicketChannelEnum,
  TicketFlagEnum,
  TicketOwnerEnum,
  TicketPriorityEnum,
  TicketRegionEnum,
  TicketSeverityEnum,
  TicketStatusEnum,
} from './shared/workbench';
import { ENUM_OPTIONS } from '../../src';

const { Text } = Typography;

const meta: Meta = {
  title: 'Demo/Kanban',
  // @ts-expect-error: because titleCN is an extension field
  titleCN: 'Demo/看板',
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
  const t = useStoryT();
  const [language, setLanguage] = useState(storyLocale);
  const [records, setRecords] = useState<TicketRecord[]>(() => createInitialRecords());
  const [nextRequestNumber, setNextRequestNumber] = useState(() => getNextRequestNumber(createInitialRecords()));
  const [selectedRowKey, setSelectedRowKey] = useState<string>('REQ-1042');
  const [tableMode, setTableMode] = useState<typeof TableModeEnum.valueType>('all');
  const [statusFilter, setStatusFilter] = useState<typeof TicketStatusEnum.valueType | undefined>();
  const [channelFilter, setChannelFilter] = useState<typeof TicketChannelEnum.valueType | undefined>();
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [parseI18n, setParseI18n] = useState(true);
  const codeMap = useMemo(
    () => ({
      TableModeEnum,
      TicketChannelEnum,
      TicketFlagEnum,
      TicketOwnerEnum,
      TicketPriorityEnum,
      TicketRegionEnum,
      TicketSeverityEnum,
      TicketStatusEnum,
    }),
    [],
  );
  const [form] = Form.useForm<TicketFormValues>();
  const watchedRegion = Form.useWatch('region', form) || 'cnNorth';
  const ownerOptions = useMemo(() => TicketOwnerEnum.items, [TicketOwnerEnum]);
  const selectedRecord = records.find((item) => item.id === selectedRowKey) ?? records[0];

  const filteredRecords = useMemo(() => {
    const lowerSearch = searchText.trim().toLowerCase();
    return orderBy(
      records.filter((record) => {
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
      }),
      ['createdAt'],
      ['desc'],
    );
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
      render: (value: string) => <Text strong>{value}</Text>,
    },
    {
      title: t('storybook.stories.workbenchDemo.table.request'),
      dataIndex: 'title',
      width: 320,
      render: (_value, record) => (
        <Space orientation="vertical" size={0}>
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
      width: 170,
      filters: TicketChannelEnum.toFilter(),
      onFilter: (value, record) => record.channel === value,
      render: (value: typeof TicketChannelEnum.valueType) => {
        const raw = TicketChannelEnum.raw(value);
        return <Tag color={raw?.color || 'default'}>{TicketChannelEnum.label(value)}</Tag>;
      },
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
      width: 190,
    },
    {
      title: t('storybook.stories.workbenchDemo.table.createdAt'),
      dataIndex: 'createdAt',
      width: 190,
    },
    {
      title: t('storybook.stories.workbenchDemo.table.actions'),
      key: 'actions',
      width: 90,
      fixed: 'right',
      render: (_value, record) => (
        <Space>
          <Button size="small" type="text" icon={<EditOutlined />} onClick={() => openEditModal(record)} />
          <Popconfirm
            title={t('storybook.stories.workbenchDemo.action.confirmDelete')}
            onConfirm={() => removeRecord(record.id)}
          >
            <Button size="small" danger type="text" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <StoryPage
      size="large"
      eyebrow={<Flex justify="space-between">{t('storybook.stories.workbenchDemo.eyebrow')} </Flex>}
      title={t('storybook.stories.workbenchDemo.page.title')}
      description={
        <>
          <div>
            {t('storybook.stories.workbenchDemo.metaDescription')}{' '}
            {t('storybook.stories.workbenchDemo.section.workspace.description')}
          </div>
          <div>
            {t('storybook.stories.workbenchDemo.page.description') + ' '}
            {t('storybook.stories.workbenchDemo.page.showCode')}
          </div>
        </>
      }
    >
      <StorySection
        title={t('storybook.stories.workbenchDemo.section.workspace.title')}
        extra={
          <Space>
            {t('storybook.stories.workbenchDemo.language') + ':'}
            <Select
              options={[
                { value: 'zh-CN', label: t('storybook.preview.locale.zhCN') },
                { value: 'en-US', label: t('storybook.preview.locale.enUS') },
              ]}
              value={language}
              style={{ minWidth: 120 }}
              onChange={(value) => {
                setLanguage(value);
                changeLanguage(value);
              }}
            />
          </Space>
        }
      >
        <Space orientation="vertical" size={16} style={{ width: '100%' }}>
          <KpiRow items={kpis} />
          <Tabs
            defaultActiveKey={tableMode}
            items={TableModeEnum.items.map((item) => ({
              key: String(item.value),
              label: item.label,
              children: null,
            }))}
            onChange={(value) => {
              setTableMode(value as typeof TableModeEnum.valueType);
            }}
            tabBarExtraContent={
              <Button icon={<PlusOutlined />} onClick={openCreateModal}>
                {t('storybook.stories.workbenchDemo.action.newRecord')}
              </Button>
            }
          />
          <Flex gap={12} wrap>
            <Select
              allowClear
              style={{ minWidth: 220 }}
              placeholder={t('storybook.stories.workbenchDemo.filter.statusPlaceholder')}
              options={TicketStatusEnum.items}
              value={statusFilter}
              showSearch={{
                filterOption: (input, option) => TicketStatusEnum.isMatch(input, option),
              }}
              onChange={(value) => setStatusFilter(value as typeof TicketStatusEnum.valueType | undefined)}
            />
            <Select
              allowClear
              style={{ minWidth: 240 }}
              placeholder={t('storybook.stories.workbenchDemo.filter.channelPlaceholder')}
              options={channelOptions as { value: string; label: ReactNode; searchText: string }[]}
              value={channelFilter}
              showSearch={{
                filterOption: (input, option) =>
                  TicketChannelEnum.isMatch(input, option) ||
                  String(option?.searchText ?? '')
                    .toLowerCase()
                    .includes(input.toLowerCase()),
              }}
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
            pagination={filteredRecords.length > 10 ? { pageSize: 10 } : false}
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

      <StorySection title={t('storybook.stories.workbenchDemo.section.detail.title')}>
        <TwoColumn
          left={
            <Card
              size="small"
              title={t('storybook.stories.workbenchDemo.card.recordSummary')}
              style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
              styles={{
                body: { flex: 1, minHeight: 0 },
              }}
            >
              {selectedRecord ? (
                <Flex orientation="vertical" gap={16} style={{ width: '100%', height: '100%' }}>
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
                        key: 'channel',
                        label: t('storybook.stories.workbenchDemo.table.channel'),
                        children: (
                          <Tag color={TicketChannelEnum.raw(selectedRecord.channel)?.color || 'default'}>
                            {TicketChannelEnum.label(selectedRecord.channel)}
                          </Tag>
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
                    style={{ flex: 1, minHeight: 0 }}
                  />
                  <Divider style={{ margin: 0 }} />
                  <div>
                    <Text strong>{t('storybook.stories.workbenchDemo.detail.flags')}</Text>
                    <div style={{ marginTop: 8 }}>{flagTagNodes(selectedRecord.flags)}</div>
                  </div>
                </Flex>
              ) : null}
            </Card>
          }
          right={
            <JsonPreview
              title={t('storybook.stories.workbenchDemo.card.selectedRecord')}
              value={[
                'title',
                'tenant',
                'owner',
                'status',
                'channel',
                'priority',
                'region',
                'severity',
                'updatedAt',
                'flags',
              ].reduce((acc, key) => {
                acc[key as keyof TicketRecord] = selectedRecord[key as keyof TicketRecord] as never;
                return acc;
              }, {} as TicketRecord)}
              style={{ height: '100%' }}
            />
          }
        />
      </StorySection>

      <StorySection
        title={t('storybook.stories.workbenchDemo.section.source.title')}
        description={t('storybook.stories.workbenchDemo.section.source.description')}
      >
        <Tabs
          defaultActiveKey={tableMode}
          items={Object.keys(codeMap).map((key) => ({
            key,
            label: codeMap[key as keyof typeof codeMap].name,
            children: (
              <CodePreview
                code={`
const ${key} = Enum(
  ${JSON.stringify(codeMap[key as keyof typeof codeMap].raw(), parseI18n ? i18nReplacer : undefined, 2)
    .split('\n')
    .join('\n  ')},
  { name: '${parseI18n ? i18nReplacer('name', codeMap[key as keyof typeof codeMap][ENUM_OPTIONS]?.name) : codeMap[key as keyof typeof codeMap][ENUM_OPTIONS]?.name}' }
);`}
              />
            ),
          }))}
          onChange={(value) => {
            setTableMode(value as typeof TableModeEnum.valueType);
          }}
          tabBarExtraContent={
            <Switch
              checked={parseI18n}
              onChange={(checked) => setParseI18n(checked)}
              checkedChildren={t('storybook.stories.workbenchDemo.section.source.parseI18n')}
              unCheckedChildren={t('storybook.stories.workbenchDemo.section.source.parseI18n')}
            />
          }
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
              <Space orientation="vertical" size={12} style={{ width: '100%' }}>
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
                    options={channelOptions as { value: string; label: ReactNode; searchText: string }[]}
                    showSearch={{
                      filterOption: (input, option) =>
                        TicketChannelEnum.isMatch(input, option) ||
                        String(option?.searchText ?? '')
                          .toLowerCase()
                          .includes(input.toLowerCase()),
                    }}
                  />
                </Form.Item>
                <Form.Item
                  name="owner"
                  label={t('storybook.stories.workbenchDemo.form.owner')}
                  rules={[{ required: true }]}
                >
                  <Select
                    options={ownerOptions as { value: string; label: ReactNode }[]}
                    showSearch={{
                      filterOption: (input, option) => TicketOwnerEnum.isMatch(input, option),
                    }}
                  />
                </Form.Item>
              </Space>
            }
            right={
              <Space orientation="vertical" size={12} style={{ width: '100%' }}>
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

function i18nReplacer(key: string, value: unknown) {
  if (typeof value === 'string' && /^storybook\.enums\./.test(value)) {
    // Replace this with your actual i18n logic
    return storyT(value);
  }
  return value;
}

export const Playground: Story = {
  name: 'Kanban',
  // @ts-expect-error: because nameCN is an extension field
  nameCN: '看板',
  render: function Render() {
    return <WorkbenchDemoBody />;
  },
};
