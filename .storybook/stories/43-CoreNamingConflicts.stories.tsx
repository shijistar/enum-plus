import { useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Descriptions, Space, Typography } from 'antd';
import { Enum, ITEMS, KEYS, LABELS, META, NAMED, VALUES } from '../../src';
import { storyT, useStoryT } from '../locales';
import { CodePreview, JsonPreview, StoryPage, StorySection } from './shared/demo';
import type { EnumItemInterface } from '../../lib';

const { Text } = Typography;
type Story = StoryObj;

const meta: Meta = {
  title: 'Core/Naming conflicts handling',
  // @ts-expect-error: because titleCN is an extension field
  titleCN: '核心/命名冲突处理',
  parameters: {
    docs: {
      description: {
        component: storyT('storybook.stories.CoreApi.conflict.metaDescription'),
      },
    },
  },
};

export default meta;

export const NamingConflicts: Story = {
  name: 'Naming conflicts handling',
  // @ts-expect-error: because nameCN is an extension field
  nameCN: '命名冲突处理',
  render: function Render() {
    return <NamingConflictDemo />;
  },
};

function NamingConflictDemo() {
  const t = useStoryT();
  const conflictEnum = useMemo(() => createConflictEnum(t), [t]);

  return (
    <StoryPage
      title={t('storybook.stories.CoreApi.conflict.page.title')}
      description={t('storybook.stories.CoreApi.conflict.page.description')}
      highlights={['ITEMS', 'KEYS', 'VALUES', 'LABELS', 'META', 'NAMED']}
    >
      <StorySection title={t('storybook.stories.CoreApi.sample.createConflictingEnum')}>
        <Space orientation="vertical" size={16} style={{ width: '100%' }}>
          <CodePreview
            title=""
            code={`
import { Enum, ITEMS, KEYS, LABELS, META, NAMED, VALUES } from 'enum-plus';

const ConflictEnum = Enum({
  values: { value: 1, label: "${t('storybook.stories.CoreApi.sample.conflict.fieldName', { name: 'values' })}" },
  keys: { value: 2, label: "${t('storybook.stories.CoreApi.sample.conflict.fieldName', { name: 'keys' })}" },
  labels: { value: 3, label: "${t('storybook.stories.CoreApi.sample.conflict.fieldName', { name: 'labels' })}" },
  items: { value: 4, label: "${t('storybook.stories.CoreApi.sample.conflict.fieldName', { name: 'items' })}" },
  meta: { value: 5, label: "${t('storybook.stories.CoreApi.sample.conflict.fieldName', { name: 'meta' })}" },
  named: { value: 6, label: "${t('storybook.stories.CoreApi.sample.conflict.fieldName', { name: 'named' })}" },
});`}
          />
        </Space>
      </StorySection>
      <StorySection
        title={t('storybook.stories.CoreApi.conflict.section.title')}
        description={t('storybook.stories.CoreApi.conflict.section.description')}
      >
        <Descriptions
          bordered
          size="small"
          column={2}
          items={[
            {
              key: 'values',
              label: 'ConflictEnum.values',
              children: String(conflictEnum.values),
            },
            {
              key: 'valuesSymbol',
              label: 'ConflictEnum[VALUES]',
              children: <Text code>{JSON.stringify(conflictEnum[VALUES])}</Text>,
            },
            {
              key: 'keys',
              label: 'ConflictEnum.keys',
              children: String(conflictEnum.keys),
            },
            {
              key: 'keysSymbol',
              label: 'ConflictEnum[KEYS]',
              children: <Text code>{JSON.stringify(conflictEnum[KEYS])}</Text>,
            },
            {
              key: 'labels',
              label: 'ConflictEnum.labels',
              children: String(conflictEnum.labels),
            },
            {
              key: 'labelsSymbol',
              label: 'ConflictEnum[LABELS]',
              children: (
                <JsonPreview
                  forceEnumText
                  value={conflictEnum[LABELS]}
                  ellipsis={{ rows: 8, expandable: 'collapsible' }}
                />
              ),
            },
            {
              key: 'items',
              label: 'ConflictEnum.items',
              children: String(conflictEnum.items),
            },
            {
              key: 'itemsSymbol',
              label: 'ConflictEnum[ITEMS]',
              children: (
                <JsonPreview
                  forceEnumText
                  value={conflictEnum[ITEMS].map((item) => ({ value: item.value, label: item.label }))}
                  ellipsis={{ rows: 8, expandable: 'collapsible' }}
                />
              ),
            },
            {
              key: 'meta',
              label: 'ConflictEnum.meta',
              children: String(conflictEnum.meta),
            },
            {
              key: 'metaSymbol',
              label: 'ConflictEnum[META]',
              children: (
                <JsonPreview
                  forceEnumText
                  value={conflictEnum[META]}
                  ellipsis={{ rows: 8, expandable: 'collapsible' }}
                />
              ),
            },
            {
              key: 'named',
              label: 'ConflictEnum.named',
              children: String(conflictEnum.named),
            },
            {
              key: 'namedSymbol',
              label: 'ConflictEnum[NAMED]',
              children: (
                <JsonPreview
                  forceEnumText
                  value={Object.keys(conflictEnum[NAMED]).reduce(
                    (acc, key) => {
                      const item = conflictEnum[NAMED][key as never] as EnumItemInterface<any, any>;
                      acc[key] = {
                        key: item.key,
                        value: item.value,
                        label: item.label,
                      };
                      return acc;
                    },
                    {} as Record<string, unknown>,
                  )}
                  ellipsis={{ rows: 8, expandable: 'collapsible' }}
                />
              ),
            },
          ]}
        />
      </StorySection>
    </StoryPage>
  );
}

function createConflictEnum(t: ReturnType<typeof useStoryT>) {
  return Enum({
    values: { value: 1, label: t('storybook.stories.CoreApi.sample.conflict.fieldName', { name: 'values' }) },
    keys: { value: 2, label: t('storybook.stories.CoreApi.sample.conflict.fieldName', { name: 'keys' }) },
    labels: { value: 3, label: t('storybook.stories.CoreApi.sample.conflict.fieldName', { name: 'labels' }) },
    items: { value: 4, label: t('storybook.stories.CoreApi.sample.conflict.fieldName', { name: 'items' }) },
    meta: { value: 5, label: t('storybook.stories.CoreApi.sample.conflict.fieldName', { name: 'meta' }) },
    named: { value: 6, label: t('storybook.stories.CoreApi.sample.conflict.fieldName', { name: 'named' }) },
  });
}
