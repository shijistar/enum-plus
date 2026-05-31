import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Card, Descriptions, Space, Typography } from 'antd';
import samplePlugin from '../../packages/plugin-sample/src';
import { Enum } from '../../src';
import { storyT, useStoryLocale } from '../locales';
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

function useCopy() {
  const locale = useStoryLocale();

  return locale === 'zh-CN'
    ? {
        pageTitle: 'Sample Plugin：用最小例子解释 enum-plus 的插件机制',
        pageDescription:
          '这个插件并不解决业务问题，而是用来说明“插件到底怎么扩展 enum-plus”。它通过 Enum.extends 给每个 enum 实例新增了一个 sample() 方法，是理解自定义插件最直观的入口。',
        highlights: ['Enum.extends', '自定义扩展方法', '插件 authoring', '最小闭环'],
        runtimeTitle: '点击按钮，调用插件新增的实例方法',
        runtimeDescription:
          'sample() 的实现很简单：读取安装时的 foo 选项，并把结果输出到 console。这里我们额外把日志捕获到了页面上。',
        run: '运行 sample()',
        enumName: 'enum.name',
        methodName: '新增方法',
        optionFoo: '安装参数 foo',
        lastOutput: '最近一次输出',
        statusName: '示例状态',
        draft: '草稿',
        review: '待审核',
        snapshotTitle: '枚举原始快照',
        rawTitle: 'enum.raw()',
        note: '如果你要做的是 toBadgeMap、toStatCard、业务搜索帮助器，本质上也是同一套插件扩展机制。',
        codeTitle: '插件安装方式',
        code: `import samplePlugin from '@enum-plus/plugin-sample';\nimport { Enum } from 'enum-plus';\n\nEnum.install(samplePlugin, { foo: 'storybook-demo' });\n\nconst Status = Enum({ Draft: 'draft' });\nStatus.sample();`,
      }
    : {
        pageTitle: 'Sample Plugin: explain enum-plus plugin authoring with the smallest example',
        pageDescription:
          'This plugin is not about business features. It exists to show how plugin authoring works in enum-plus. It uses Enum.extends to add one sample() method to every enum instance, making it the clearest entry point for custom plugin design.',
        highlights: ['Enum.extends', 'Custom instance method', 'Plugin authoring', 'Smallest loop'],
        runtimeTitle: 'Click the button to call the plugin-added instance method',
        runtimeDescription:
          'sample() is intentionally simple: it reads the foo option provided at installation time and prints a log message. This story also captures that output back into the page.',
        run: 'Run sample()',
        enumName: 'enum.name',
        methodName: 'Added method',
        optionFoo: 'Install option foo',
        lastOutput: 'Latest output',
        statusName: 'Sample Status',
        draft: 'Draft',
        review: 'Review',
        snapshotTitle: 'Enum snapshot',
        rawTitle: 'enum.raw()',
        note: 'If you later build helpers like toBadgeMap, toStatCard, or business search adapters, they follow the same extension mechanism.',
        codeTitle: 'Plugin installation',
        code: `import samplePlugin from '@enum-plus/plugin-sample';\nimport { Enum } from 'enum-plus';\n\nEnum.install(samplePlugin, { foo: 'storybook-demo' });\n\nconst Status = Enum({ Draft: 'draft' });\nStatus.sample();`,
      };
}

function SamplePluginStory() {
  ensureSamplePlugin();
  const copy = useCopy();
  const [lastOutput, setLastOutput] = useState('-');

  const statusEnum = useMemo(
    () =>
      Enum(
        {
          Draft: { value: 'draft', label: copy.draft },
          Review: { value: 'review', label: copy.review },
        },
        { name: copy.statusName },
      ) as SampleEnum,
    [copy.draft, copy.review, copy.statusName],
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
    <StoryPage title={copy.pageTitle} description={copy.pageDescription} highlights={copy.highlights}>
      <StorySection title={copy.runtimeTitle} description={copy.runtimeDescription}>
        <TwoColumn
          left={
            <Card size="small">
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Button type="primary" onClick={runSample}>
                  {copy.run}
                </Button>
                <Descriptions
                  size="small"
                  column={1}
                  items={[
                    { key: 'name', label: copy.enumName, children: statusEnum.name },
                    { key: 'method', label: copy.methodName, children: 'sample()' },
                    { key: 'foo', label: copy.optionFoo, children: 'storybook-demo' },
                    { key: 'output', label: copy.lastOutput, children: lastOutput },
                  ]}
                />
                <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  {copy.note}
                </Paragraph>
              </Space>
            </Card>
          }
          right={<CodePreview title={copy.codeTitle} code={copy.code} />}
        />
      </StorySection>

      <StorySection title={copy.snapshotTitle}>
        <JsonPreview
          title={copy.rawTitle}
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
