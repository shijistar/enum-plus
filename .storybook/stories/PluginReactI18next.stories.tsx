import { useEffect, useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Card, Descriptions, Space, Tag, Typography } from 'antd';
import reactI18nextPlugin from '../../packages/plugin-react-i18next/src';
import { Enum } from '../../src';
import { storyT, useStoryLocale } from '../locales';
import { CodePreview, JsonPreview, StoryPage, StorySection, TwoColumn } from './shared/demo';
import { ensureStoryI18n } from './shared/i18n';

const { Paragraph } = Typography;

const meta: Meta = {
  title: 'Plugins/04 react-i18next',
  parameters: {
    docs: {
      description: {
        component: storyT('storybook.stories.PluginReactI18next.metaDescription'),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function useCopy() {
  const locale = useStoryLocale();

  return locale === 'zh-CN'
    ? {
        pageTitle: 'react-i18next：共享 React i18n 实例，但不自动刷新界面',
        pageDescription:
          '@enum-plus/plugin-react-i18next 适合已经使用 react-i18next 的项目，它会直接读取当前 React i18n 实例进行翻译。但 README 也明确写了：这个包本身不负责切换语言后的自动 UI 更新，如果你需要真正的“界面跟着变”，应使用 plugin-react。',
        highlights: ['react-i18next', '读取 getI18n()', '不自动刷新 UI', '适合轻量接入'],
        comparisonTitle: '它解决的是“取翻译”，不是“推刷新”',
        comparisonDescription: '下面的 demo 和 i18next 版很像：语言已经变了，但界面要等 React 重新渲染后才会更新。',
        currentLanguage: 'i18n.language',
        enumName: 'enum.name',
        currentLabel: 'enum.label(value)',
        rerenderTick: 'render tick',
        switchZh: '只切到中文（不强制刷新）',
        switchEn: '只切到英文（不强制刷新）',
        rerender: '手动触发 React 重渲染',
        note: '如果你希望下拉 options、当前已选值、甚至搜索匹配都能在切换语言后自动刷新，那应该看 Plugins/03 React。',
        codeTitle: '轻量安装方式',
        listTitle: 'toList() 输出',
        mapTitle: 'toMap() 输出',
        code: `import reactI18nextPlugin from '@enum-plus/plugin-react-i18next';\nimport { Enum } from 'enum-plus';\n\nEnum.install(reactI18nextPlugin, {\n  localize: {\n    tOptions: { ns: 'translation' },\n  },\n});`,
        derivedTitle: '依然可以产出稳定结构',
        derivedDescription: '它同样适合作为 enum 标签翻译层，然后把结果喂给普通组件。',
      }
    : {
        pageTitle: 'react-i18next: shared React i18n instance, but no automatic UI refresh',
        pageDescription:
          '@enum-plus/plugin-react-i18next fits projects that already use react-i18next. It reads translations from the current React i18n instance. But the README is explicit: this package alone does not auto-refresh the UI after language changes. For that, use plugin-react.',
        highlights: ['react-i18next', 'Reads getI18n()', 'No auto UI refresh', 'Lightweight integration'],
        comparisonTitle: 'It solves translation lookup, not refresh propagation',
        comparisonDescription:
          'This behaves similarly to the plain i18next story: the language changes immediately, but visible labels wait for the next React rerender.',
        currentLanguage: 'i18n.language',
        enumName: 'enum.name',
        currentLabel: 'enum.label(value)',
        rerenderTick: 'render tick',
        switchZh: 'Switch to Chinese only (no forced refresh)',
        switchEn: 'Switch to English only (no forced refresh)',
        rerender: 'Force one React rerender',
        note: 'If you want select options, selected labels, and search helpers to refresh automatically on language changes, see Plugins/03 React.',
        codeTitle: 'Lightweight installation',
        listTitle: 'toList() output',
        mapTitle: 'toMap() output',
        code: `import reactI18nextPlugin from '@enum-plus/plugin-react-i18next';\nimport { Enum } from 'enum-plus';\n\nEnum.install(reactI18nextPlugin, {\n  localize: {\n    tOptions: { ns: 'translation' },\n  },\n});`,
        derivedTitle: 'Stable outputs still matter',
        derivedDescription:
          'It still works well as the translation layer for enum labels before feeding regular UI components.',
      };
}

function ReactI18nextStory() {
  const copy = useCopy();
  const storyLocale = useStoryLocale();
  const instance = ensureStoryI18n();
  const [renderTick, setRenderTick] = useState(0);

  useEffect(() => {
    void instance.changeLanguage(storyLocale);
  }, [instance, storyLocale]);

  useEffect(() => {
    const previousLocalize = Enum.localize;
    reactI18nextPlugin({ localize: { tOptions: { ns: 'translation' } } }, Enum as never);
    return () => {
      Enum.localize = previousLocalize;
    };
  }, []);

  const statusEnum = useMemo(
    () =>
      Enum(
        {
          Draft: { value: 'draft', label: 'story.status.draft', tone: 'default' },
          Review: { value: 'review', label: 'story.status.review', tone: 'processing' },
          Published: { value: 'published', label: 'story.status.published', tone: 'success' },
          Archived: { value: 'archived', label: 'story.status.archived', tone: 'default' },
        },
        {
          name: 'story.status.enumName',
        },
      ),
    [renderTick],
  );

  return (
    <StoryPage title={copy.pageTitle} description={copy.pageDescription} highlights={copy.highlights}>
      <StorySection title={copy.comparisonTitle} description={copy.comparisonDescription}>
        <TwoColumn
          left={
            <Card size="small">
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Space wrap>
                  <Button onClick={() => void instance.changeLanguage('zh-CN')}>{copy.switchZh}</Button>
                  <Button onClick={() => void instance.changeLanguage('en-US')}>{copy.switchEn}</Button>
                  <Button type="primary" onClick={() => setRenderTick((value) => value + 1)}>
                    {copy.rerender}
                  </Button>
                </Space>
                <Descriptions
                  size="small"
                  column={1}
                  items={[
                    { key: 'lang', label: copy.currentLanguage, children: instance.language },
                    { key: 'name', label: copy.enumName, children: statusEnum.name },
                    { key: 'label', label: copy.currentLabel, children: statusEnum.label('review') },
                    { key: 'tick', label: copy.rerenderTick, children: renderTick },
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

      <StorySection title={copy.derivedTitle} description={copy.derivedDescription}>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Space wrap>
            {statusEnum.items.map((item) => {
              const raw = item.raw as { tone?: string };
              return (
                <Tag key={item.key} color={raw.tone}>
                  {item.label}
                </Tag>
              );
            })}
          </Space>
          <TwoColumn
            left={<JsonPreview title={copy.listTitle} value={statusEnum.toList()} />}
            right={<JsonPreview title={copy.mapTitle} value={statusEnum.toMap()} />}
          />
        </Space>
      </StorySection>
    </StoryPage>
  );
}

export const Playground: Story = {
  render: function Render() {
    return <ReactI18nextStory />;
  },
};
