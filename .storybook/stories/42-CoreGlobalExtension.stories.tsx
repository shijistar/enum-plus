import type { Meta, StoryObj } from '@storybook/react-vite';
import { Enum, EnumInit, GenericAnyEnum, type AnyEnum } from '../../src';
import { storyT, useStoryT } from '../locales';
import { CodePreview, JsonPreview, StoryPage, StorySection, TwoColumn } from './shared/demo';
import { useMemo } from 'react';
import type { EnumValue } from '../../lib';

let extensionInstalled = false;
const meta: Meta = {
  title: 'Core/Global extension',
  // @ts-expect-error: because titleCN is an extension field
  titleCN: '核心/全局扩展',
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
  name: 'Global extension',
  // @ts-expect-error: because nameCN is an extension field
  nameCN: '全局扩展',
  render: function Render() {
    return <CompositionDemo />;
  },
};

function ensureCustomExtension() {
  if (extensionInstalled) {
    return;
  }

  Enum.extends({
    toBadgeMap(this: AnyEnum) {
      return this.toMap({
        keySelector: 'value',
        valueSelector: (item) => ({
          label: item.label,
          color: (item.raw as { color?: string }).color,
        }),
      });
    },
  });

  extensionInstalled = true;
}

const extensionRegistrationCode = `Enum.extends({
  toBadgeMap(this: AnyEnum) {
    return this.toMap({
      keySelector: 'value',
      valueSelector: (item) => ({
        label: item.label,
        color: item.raw.color,
      }),
    });
  },
});`;

function CompositionDemo() {
  ensureCustomExtension();
  const t = useStoryT();

  const statusEnum = useMemo(
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

  return (
    <StoryPage
      title={t('storybook.stories.CoreCompositionAndExtension.title')}
      description={t('storybook.stories.CoreCompositionAndExtension.description')}
      highlights={[
        t('storybook.stories.CoreCompositionAndExtension.highlights.extends'),
        t('storybook.stories.CoreCompositionAndExtension.highlights.readonly'),
      ]}
    >
      <StorySection title={t('storybook.stories.enumInitialization')}>
        <CodePreview
          title=""
          code={`
const StatusEnum = Enum({
  Draft: { value: 'draft', label: ${t('storybook.stories.CoreCompositionAndExtension.sample.draft')}, color: 'default' },
  Review: { value: 'review', label: ${t('storybook.stories.CoreCompositionAndExtension.sample.review')}, color: 'processing' },
  Published: { value: 'published', label: ${t('storybook.stories.CoreCompositionAndExtension.sample.published')}, color: 'success' },
  Archived: { value: 'archived', label: ${t('storybook.stories.CoreCompositionAndExtension.sample.archived')}, color: 'warning' },
});
`}
        />
      </StorySection>
      <StorySection
        title={t('storybook.stories.CoreCompositionAndExtension.section.extension.title')}
        description={t('storybook.stories.CoreCompositionAndExtension.section.extension.description')}
      >
        <CodePreview
          title={t('storybook.stories.CoreCompositionAndExtension.section.extension.codeTitle')}
          code={extensionRegistrationCode}
        />
      </StorySection>
      <StorySection title={t('storybook.stories.CoreCompositionAndExtension.extension.result.title')}>
        <JsonPreview forceEnumText title="StatusEnum.toBadgeMap()" value={statusEnum.toBadgeMap()} />
      </StorySection>
    </StoryPage>
  );
}

declare module 'enum-plus/extension' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface EnumExtension<T, K, V> {
    toBadgeMap(): Record<string, { label: string; color: string }>;
  }
}
