import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Card, Descriptions, Space, Typography } from 'antd';
import samplePlugin from '../../packages/plugin-sample/src';
import { Enum } from '../../src';
import { storyT, useStoryT } from '../locales';
import { CodePreview, JsonPreview, StoryPage, StorySection, TwoColumn } from './shared/demo';

const { Paragraph } = Typography;

const meta: Meta = {
  title: 'Plugins/08 Sample Plugin',
  parameters: {
    docs: {
      description: {
        component: storyT('storybook.stories.PluginSample.metaDescription'),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const INSTALL_CODE = `import samplePlugin from '@enum-plus/plugin-sample';\nimport { Enum } from 'enum-plus';\n\nEnum.install(samplePlugin, { foo: 'storybook-demo' });\n\nconst Status = Enum({ Draft: 'draft' });\nStatus.sample();`;

type SampleEnum = ReturnType<typeof Enum> & {
  sample(): void;
};

let samplePluginInstalled = false;

function ensureSamplePlugin() {
  if (samplePluginInstalled) {
    return;
  }

  Enum.install(samplePlugin as unknown as Parameters<typeof Enum.install>[0], { foo: 'storybook-demo' });
  samplePluginInstalled = true;
}

function SamplePluginStory() {
  ensureSamplePlugin();
  const t = useStoryT();
  const [lastOutput, setLastOutput] = useState('-');

  const statusEnum = useMemo(
    () =>
      Enum(
        {
          Draft: { value: 'draft', label: t('storybook.stories.PluginSample.draft') },
          Review: { value: 'review', label: t('storybook.stories.PluginSample.review') },
        },
        { name: t('storybook.stories.PluginSample.statusName') },
      ) as SampleEnum,
    [t],
  );

  const runSample = () => {
    const original = console.log;
    const buffer: string[] = [];

    console.log = (...args: unknown[]) => {
      buffer.push(args.map((item) => String(item)).join(' '));
      original(...args);
    };

    try {
      statusEnum.sample();
    } finally {
      console.log = original;
      setLastOutput(buffer.join('\n') || '-');
    }
  };

  return (
    <StoryPage
      title={t('storybook.stories.PluginSample.pageTitle')}
      description={t('storybook.stories.PluginSample.pageDescription')}
      highlights={[
        t('storybook.stories.PluginSample.highlights.extends'),
        t('storybook.stories.PluginSample.highlights.customMethod'),
        t('storybook.stories.PluginSample.highlights.authoring'),
        t('storybook.stories.PluginSample.highlights.minimalLoop'),
      ]}
    >
      <StorySection
        title={t('storybook.stories.PluginSample.runtimeTitle')}
        description={t('storybook.stories.PluginSample.runtimeDescription')}
      >
        <TwoColumn
          left={
            <Card size="small">
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Button type="primary" onClick={runSample}>
                  {t('storybook.stories.PluginSample.run')}
                </Button>
                <Descriptions
                  size="small"
                  column={1}
                  items={[
                    { key: 'name', label: t('storybook.stories.PluginSample.enumName'), children: statusEnum.name },
                    { key: 'method', label: t('storybook.stories.PluginSample.methodName'), children: 'sample()' },
                    { key: 'foo', label: t('storybook.stories.PluginSample.optionFoo'), children: 'storybook-demo' },
                    { key: 'output', label: t('storybook.stories.PluginSample.lastOutput'), children: lastOutput },
                  ]}
                />
                <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  {t('storybook.stories.PluginSample.note')}
                </Paragraph>
              </Space>
            </Card>
          }
          right={<CodePreview title={t('storybook.stories.PluginSample.codeTitle')} code={INSTALL_CODE} />}
        />
      </StorySection>

      <StorySection title={t('storybook.stories.PluginSample.snapshotTitle')}>
        <JsonPreview
          title={t('storybook.stories.PluginSample.rawTitle')}
          value={{
            raw: statusEnum.raw(),
            items: statusEnum.items,
          }}
        />
      </StorySection>
    </StoryPage>
  );
}

export const Playground: Story = {
  render: function Render() {
    return <SamplePluginStory />;
  },
};
