import { useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge, Descriptions, Space, Tag } from 'antd';
import { Enum } from '../../src';
import { storyT, useStoryT } from '../locales';
import { CodePreview, JsonPreview, StoryPage, StorySection, TwoColumn } from './shared/demo';

const meta: Meta = {
  title: 'Core/Enums merge',
  // @ts-expect-error: because titleCN is an extension field
  titleCN: '核心/枚举合并',
  parameters: {
    docs: {
      description: {
        component: storyT('storybook.stories.CoreCompositionAndExtension.metaDescription'),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const CompositionAndExtension: Story = {
  name: 'Enums merge',
  // @ts-expect-error: because nameCN is an extension field
  nameCN: '枚举合并',
  render: function Render() {
    return <CompositionDemo />;
  },
};

function CompositionDemo() {
  const t = useStoryT();

  const baseEnum = useMemo(
    () =>
      Enum({
        Draft: {
          value: 'draft',
          label: t('storybook.stories.CoreCompositionAndExtension.sample.draft'),
          color: 'default',
        },
        Review: {
          value: 'review',
          label: t('storybook.stories.CoreCompositionAndExtension.sample.review'),
          color: 'processing',
        },
      }),
    [t],
  );
  const terminalEnum = useMemo(
    () =>
      Enum({
        Published: {
          value: 'published',
          label: t('storybook.stories.CoreCompositionAndExtension.sample.published'),
          color: 'success',
        },
        Archived: {
          value: 'archived',
          label: t('storybook.stories.CoreCompositionAndExtension.sample.archived'),
          color: 'warning',
        },
      }),
    [t],
  );
  const mergedEnum = useMemo(
    () =>
      Enum(
        {
          ...baseEnum.raw(),
          ...terminalEnum.raw(),
        },
        { name: t('storybook.stories.CoreCompositionAndExtension.sample.fullFlow') },
      ),
    [baseEnum, t, terminalEnum],
  );

  return (
    <StoryPage
      title={t('storybook.stories.CoreCompositionAndExtension.title')}
      description={t('storybook.stories.CoreCompositionAndExtension.description')}
      highlights={[
        t('storybook.stories.CoreCompositionAndExtension.highlights.merge'),
        t('storybook.stories.CoreCompositionAndExtension.highlights.raw'),
        t('storybook.stories.CoreCompositionAndExtension.highlights.readonly'),
      ]}
    >
      <StorySection
        title={t('storybook.stories.CoreCompositionAndExtension.section.setup.title')}
        description={t('storybook.stories.CoreCompositionAndExtension.section.setup.description')}
      >
        <CodePreview
          title=""
          code={`
const BaseEnum = Enum({
  Draft: { value: 'draft', label: ${t('storybook.stories.CoreCompositionAndExtension.sample.draft')}, color: 'default' },
  Review: { value: 'review', label: ${t('storybook.stories.CoreCompositionAndExtension.sample.review')}, color: 'processing' }
});
const TerminalEnum = Enum({
  Published: { value: 'published', label: ${t('storybook.stories.CoreCompositionAndExtension.sample.published')}, color: 'success' },
  Archived: { value: 'archived', label: ${t('storybook.stories.CoreCompositionAndExtension.sample.archived')}, color: 'warning' }
});

// Merge baseEnum and terminalEnum into a new enum
const MergedEnum = Enum({ ...BaseEnum.raw(), ...TerminalEnum.raw() });
`}
        />
      </StorySection>
      <StorySection
        title={t('storybook.stories.CoreCompositionAndExtension.section.result.title')}
        description={t('storybook.stories.CoreCompositionAndExtension.section.result.description')}
      >
        <TwoColumn
          left={
            <Descriptions
              bordered
              size="small"
              column={1}
              items={[
                {
                  key: 'name',
                  label: t('storybook.stories.CoreCompositionAndExtension.field.enumItemCount'),
                  children: <Badge color="processing" count={mergedEnum.items.length || 0} />,
                },
                {
                  key: 'keys',
                  label: 'keys',
                  children: (
                    <Space wrap>
                      {mergedEnum.keys.map((v) => (
                        <Tag key={v}>{v}</Tag>
                      ))}
                    </Space>
                  ),
                },
                {
                  key: 'values',
                  label: 'values',
                  children: (
                    <Space wrap>
                      {mergedEnum.values.map((v) => (
                        <Tag key={v}>{v}</Tag>
                      ))}
                    </Space>
                  ),
                },
                {
                  key: 'labels',
                  label: t('storybook.stories.CoreCompositionAndExtension.field.allLabels'),
                  children: (
                    <Space wrap>
                      {mergedEnum.labels.map((v) => (
                        <Tag key={v}>{v}</Tag>
                      ))}
                    </Space>
                  ),
                },
                {
                  key: 'meta',
                  label: 'meta',
                  children: Object.keys(mergedEnum.meta).map((key) => {
                    const item = mergedEnum.meta[key as keyof typeof mergedEnum.meta];
                    return <JsonPreview forceEnumText title={key} value={item} />;
                  }),
                },
                {
                  key: 'named',
                  label: 'named',
                  children: Object.keys(mergedEnum.named).map((key) => {
                    const item = mergedEnum.named[key as keyof typeof mergedEnum.named];
                    return <JsonPreview forceEnumText title={key} value={item} />;
                  }),
                },
              ]}
            />
          }
          right={
            <JsonPreview
              forceEnumText
              title="mergedEnum"
              value={{
                ...mergedEnum,
                items: mergedEnum.items.map((item) => ({ ...item, raw: undefined })),
                named: Object.keys(mergedEnum.named).reduce(
                  (acc, key) => {
                    acc[key as typeof mergedEnum.keyType] = {
                      ...mergedEnum.named[key as keyof typeof mergedEnum.named],
                      raw: undefined!,
                    };
                    return acc;
                  },
                  {} as Record<typeof mergedEnum.keyType, unknown>,
                ),
              }}
              indent={4}
            />
          }
        />
      </StorySection>
    </StoryPage>
  );
}
