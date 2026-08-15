import { useMemo } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Descriptions, Space, Tag } from 'antd';
import { Enum } from '../../src';
import { storyT, useStoryT } from '../locales';
import { CodePreview, JsonPreview, StoryPage, StorySection, TwoColumn } from './shared/demo';

let extensionInstalled = false;
const meta: Meta = {
  title: 'Core/Composition and Extension',
  // @ts-expect-error: because titleCN is an extension field
  titleCN: '核心/组合与全局扩展',
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
  name: 'Composition and Extension',
  // @ts-expect-error: because nameCN is an extension field
  nameCN: '组合与全局扩展',
  render: function Render() {
    return <CompositionDemo />;
  },
};

function ensureCustomExtension() {
  if (extensionInstalled) {
    return;
  }

  Enum.extends({
    toBadgeMap(this: {
      toMap: (config: {
        key: 'value';
        value: (item: { label: string; raw: { color?: string } }) => { label: string; color?: string };
      }) => Record<string, { label: string; color?: string }>;
    }) {
      return this.toMap({
        key: 'value',
        value: (item) => ({
          label: item.label,
          color: item.raw.color,
        }),
      });
    },
  });

  extensionInstalled = true;
}

const extensionRegistrationCode = `Enum.extends({
  toBadgeMap() {
    return this.toMap({
      key: 'value',
      value: (item) => ({
        label: item.label,
        color: item.raw.color,
      }),
    });
  },
});`;

function CompositionDemo() {
  ensureCustomExtension();
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
      ) as unknown as typeof baseEnum & {
        toBadgeMap(): Record<string, { label: string; color?: string }>;
      },
    [baseEnum, t, terminalEnum],
  );

  return (
    <StoryPage
      title={t('storybook.stories.CoreCompositionAndExtension.title')}
      description={t('storybook.stories.CoreCompositionAndExtension.description')}
      highlights={[
        t('storybook.stories.CoreCompositionAndExtension.highlights.extends'),
        t('storybook.stories.CoreCompositionAndExtension.highlights.raw'),
        t('storybook.stories.CoreCompositionAndExtension.highlights.merge'),
        t('storybook.stories.CoreCompositionAndExtension.highlights.readonly'),
      ]}
    >
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
                  label: t('storybook.stories.CoreCompositionAndExtension.field.enumName'),
                  children: mergedEnum.name || '-',
                },
                {
                  key: 'frozenEnum',
                  label: t('storybook.stories.CoreCompositionAndExtension.field.frozenEnum'),
                  children: String(Object.isFrozen(mergedEnum)),
                },
                {
                  key: 'frozenItems',
                  label: t('storybook.stories.CoreCompositionAndExtension.field.frozenItems'),
                  children: String(Object.isFrozen(mergedEnum.items)),
                },
                {
                  key: 'labels',
                  label: t('storybook.stories.CoreCompositionAndExtension.field.allLabels'),
                  children: (
                    <Space wrap>
                      {mergedEnum.labels.map((item) => (
                        <Tag key={item}>{item}</Tag>
                      ))}
                    </Space>
                  ),
                },
              ]}
            />
          }
          right={<JsonPreview title="mergedEnum.raw()" value={mergedEnum.raw()} />}
        />
      </StorySection>

      <StorySection
        title={t('storybook.stories.CoreCompositionAndExtension.section.extension.title')}
        description={t('storybook.stories.CoreCompositionAndExtension.section.extension.description')}
      >
        <TwoColumn
          left={
            <CodePreview
              title={t('storybook.stories.CoreCompositionAndExtension.section.extension.codeTitle')}
              code={extensionRegistrationCode}
            />
          }
          right={<JsonPreview title="mergedEnum.toBadgeMap()" value={mergedEnum.toBadgeMap()} />}
        />
      </StorySection>
    </StoryPage>
  );
}
