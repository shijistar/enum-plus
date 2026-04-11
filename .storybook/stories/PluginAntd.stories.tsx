import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import antdPlugin from '../../packages/plugin-antd/src';
import { Card, Descriptions, Menu, Select, Space, Table, Typography } from 'antd';
import { Enum } from '../../src';
import { JsonPreview, StoryPage, StorySection, TwoColumn } from './shared/demo';

const { Text } = Typography;

let antdPluginInstalled = false;

function ensureAntdPlugin() {
  if (antdPluginInstalled) {
    return;
  }
  Enum.install(antdPlugin);
  antdPluginInstalled = true;
}

const meta: Meta = {
  title: '插件/Ant Design 绑定',
  parameters: {
    docs: {
      description: {
        component:
          '参考 packages/plugin-antd/README，把 toSelect、toMenu、toFilter、toValueMap 直接接到 Ant Design 控件上，验证 enum-plus 与 antd 的 UI 绑定体验。',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

type AntdEnhancedEnum = ReturnType<typeof Enum> & {
  toSelect(config?: unknown): Record<string, unknown>[];
  toMenu(): { key: string; label: string }[];
  toFilter(): { text: string; value: string }[];
  toValueMap(): Record<string, { text: string }>;
};

function AntdBindingDemo() {
  ensureAntdPlugin();

  const shiftEnum = useMemo(
    () =>
      Enum(
        {
          Morning: { value: 'morning', label: '早班' },
          Afternoon: { value: 'afternoon', label: '中班' },
          Night: { value: 'night', label: '晚班' },
        },
        { name: '排班类型' },
      ) as AntdEnhancedEnum,
    [],
  );
  const [selectedShift, setSelectedShift] = useState<string>('morning');
  const [menuKey, setMenuKey] = useState<string>('morning');

  const dataSource = [
    { id: 1, employee: 'Alice', shift: 'morning' },
    { id: 2, employee: 'Bob', shift: 'afternoon' },
    { id: 3, employee: 'Cindy', shift: 'night' },
    { id: 4, employee: 'David', shift: 'morning' },
  ];

  return (
    <StoryPage
      title="把 enum 直接变成 antd 数据源"
      description="@enum-plus/plugin-antd 的核心价值在于减少重复的数据转换代码。定义一次 enum，就能同时生成 Select、Menu、Table filters 等多种 UI 所需结构。"
      highlights={['toSelect()', 'toMenu()', 'toFilter()', 'toValueMap()', 'React + antd']}
    >
      <StorySection title="Select 与 Menu" description="同一份 enum 即可生成多个控件的数据源，不需要在组件层手写映射。">
        <TwoColumn
          left={
            <Card size="small" title="Select 绑定">
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Select
                  value={selectedShift}
                  style={{ width: '100%' }}
                  options={
                    shiftEnum.toSelect({ firstOption: { value: '', label: '全部班次' } }) as {
                      value: string;
                      label: string;
                    }[]
                  }
                  onChange={(value) => setSelectedShift(value)}
                />
                <Descriptions
                  size="small"
                  column={1}
                  items={[
                    { key: 'value', label: '当前值', children: selectedShift || '全部' },
                    {
                      key: 'label',
                      label: 'label(value)',
                      children: selectedShift ? shiftEnum.label(selectedShift) : '全部班次',
                    },
                  ]}
                />
              </Space>
            </Card>
          }
          right={
            <Card size="small" title="Menu 绑定">
              <Menu
                selectedKeys={[menuKey]}
                items={shiftEnum.toMenu()}
                onClick={(info) => setMenuKey(String(info.key))}
              />
            </Card>
          }
        />
      </StorySection>

      <StorySection
        title="Table filters 与 ValueMap"
        description="toFilter 直接适配 antd Table，toValueMap 适合与 Ant Design Pro 等场景对接。"
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Table
            className="ep-table"
            rowKey="id"
            pagination={false}
            columns={[
              { title: '员工', dataIndex: 'employee' },
              {
                title: '班次',
                dataIndex: 'shift',
                filters: shiftEnum.toFilter(),
                onFilter: (value, record) => record.shift === value,
                render: (value: string) => shiftEnum.label(value),
              },
            ]}
            dataSource={dataSource}
          />

          <TwoColumn
            left={<JsonPreview title="toFilter()" value={shiftEnum.toFilter()} />}
            right={
              <JsonPreview
                title="toValueMap()"
                value={shiftEnum.toValueMap()}
                note="该结果特别适合 Ant Design Pro 的 valueEnum 场景。"
              />
            }
          />
        </Space>
      </StorySection>

      <StorySection title="数据结构校验" description="如果你想接到自定义组件层，仍然可以直接检查插件生成的对象结构。">
        <Descriptions
          bordered
          size="small"
          column={1}
          items={[
            {
              key: 'select',
              label: 'toSelect()[0]',
              children: <Text code>{JSON.stringify(shiftEnum.toSelect()[0])}</Text>,
            },
            { key: 'menu', label: 'toMenu()[0]', children: <Text code>{JSON.stringify(shiftEnum.toMenu()[0])}</Text> },
            {
              key: 'filter',
              label: 'toFilter()[0]',
              children: <Text code>{JSON.stringify(shiftEnum.toFilter()[0])}</Text>,
            },
          ]}
        />
      </StorySection>
    </StoryPage>
  );
}

export const Playground: Story = {
  render: function Render() {
    return <AntdBindingDemo />;
  },
};
