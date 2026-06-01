import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import antdPlugin from '../../packages/plugin-antd/src';
import { Card, Descriptions, Menu, Select, Space, Table, Typography } from 'antd';
import { Enum } from '../../src';
import { storyT, useStoryT } from '../locales';
import { JsonPreview, StoryPage, StorySection, TwoColumn } from './shared/demo';

const { Text } = Typography;

let antdPluginInstalled = false;

function ensureAntdPlugin() {
  if (antdPluginInstalled) {
    return;
  }
  Enum.install(antdPlugin as any);
  antdPluginInstalled = true;
}

const meta: Meta = {
  title: 'Plugins/01 Ant Design',
  parameters: {
    docs: {
      description: {
        component: storyT('storybook.stories.PluginAntd.metaDescription'),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function AntdBindingDemo() {
  ensureAntdPlugin();
  const t = useStoryT();

  const shiftEnum = useMemo(
    () =>
      Enum(
        {
          Morning: { value: 'morning', label: t('storybook.stories.PluginAntd.sample.morning') },
          Afternoon: { value: 'afternoon', label: t('storybook.stories.PluginAntd.sample.afternoon') },
          Night: { value: 'night', label: t('storybook.stories.PluginAntd.sample.night') },
        },
        { name: t('storybook.stories.PluginAntd.sample.shiftName') },
      ),
    [t],
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
      title={t('storybook.stories.PluginAntd.page.title')}
      description={t('storybook.stories.PluginAntd.page.description')}
      highlights={[
        t('storybook.stories.PluginAntd.highlights.select'),
        t('storybook.stories.PluginAntd.highlights.menu'),
        t('storybook.stories.PluginAntd.highlights.filter'),
        t('storybook.stories.PluginAntd.highlights.valueMap'),
        t('storybook.stories.PluginAntd.highlights.stack'),
      ]}
    >
      <StorySection
        title={t('storybook.stories.PluginAntd.section.binding.title')}
        description={t('storybook.stories.PluginAntd.section.binding.description')}
      >
        <TwoColumn
          left={
            <Card size="small" title={t('storybook.stories.PluginAntd.card.select')}>
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Select
                  value={selectedShift}
                  style={{ width: '100%' }}
                  options={
                    shiftEnum.toSelect({
                      firstOption: { value: '', label: t('storybook.stories.PluginAntd.allShifts') },
                    }) as {
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
                    {
                      key: 'value',
                      label: t('storybook.stories.PluginAntd.field.currentValue'),
                      children: selectedShift || t('storybook.stories.PluginAntd.all'),
                    },
                    {
                      key: 'label',
                      label: t('storybook.stories.PluginAntd.field.labelValue'),
                      children: selectedShift
                        ? shiftEnum.label(selectedShift)
                        : t('storybook.stories.PluginAntd.allShifts'),
                    },
                  ]}
                />
              </Space>
            </Card>
          }
          right={
            <Card size="small" title={t('storybook.stories.PluginAntd.card.menu')}>
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
        title={t('storybook.stories.PluginAntd.section.table.title')}
        description={t('storybook.stories.PluginAntd.section.table.description')}
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Table
            className="ep-table"
            rowKey="id"
            pagination={false}
            columns={[
              { title: t('storybook.stories.PluginAntd.table.employee'), dataIndex: 'employee' },
              {
                title: t('storybook.stories.PluginAntd.table.shift'),
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
                note={t('storybook.stories.PluginAntd.card.valueMapNote')}
              />
            }
          />
        </Space>
      </StorySection>

      <StorySection
        title={t('storybook.stories.PluginAntd.section.structure.title')}
        description={t('storybook.stories.PluginAntd.section.structure.description')}
      >
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
