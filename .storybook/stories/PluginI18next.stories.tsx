import { useEffect, useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { createInstance, type i18n } from 'i18next';
import { Button, Card, Descriptions, Space, Tag, Typography } from 'antd';
import i18nextPlugin from '../../packages/plugin-i18next/src';
import { Enum } from '../../src';
import { storyT, useStoryLocale } from '../locales';
import { CodePreview, JsonPreview, StoryPage, StorySection, TwoColumn } from './shared/demo';

const { Paragraph, Text } = Typography;

const meta: Meta = {
  title: 'Plugins/02 i18next',
  parameters: {
    docs: {
      description: {
        component: storyT('storybook.stories.PluginI18next.metaDescription'),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

function createStoryI18next(locale: 'en-US' | 'zh-CN') {
  const instance = createInstance();
  void instance.init({
    lng: locale,
    fallbackLng: 'en-US',
    initImmediate: false,
    resources: {
      'en-US': {
        translation: {
          'status.enumName': 'Publishing Status',
          'status.draft': 'Draft',
          'status.review': 'In Review',
          'status.published': 'Published',
        },
      },
      'zh-CN': {
        translation: {
          'status.enumName': '发布状态',
          'status.draft': '草稿',
          'status.review': '审核中',
          'status.published': '已发布',
        },
      },
    },
  });
  return instance;
}

function useCopy() {
  const locale = useStoryLocale();

  return locale === 'zh-CN'
    ? {
        pageTitle: 'i18next：能本地化 enum，但不会替你驱动 UI 刷新',
        pageDescription:
          '@enum-plus/plugin-i18next 适合“先把枚举 label 接进 i18next”的场景。它解决的是翻译查找，不是 React/Vue 的响应式刷新。因此如果宿主界面没有重新渲染，页面上的 label 不会自动变化。',
        highlights: ['i18next', '字符串本地化', '宿主控制刷新', '低耦合'],
        runtimeTitle: '切换语言后，需要宿主界面自己触发重渲染',
        runtimeDescription:
          '下面这个 demo 故意只修改 i18next 的语言，不主动 setState。这样可以直观看到：翻译源已变，但 UI 要等下一次渲染才会更新。',
        currentI18n: 'instance.language',
        enumName: 'enum.name',
        enumLabel: 'enum.label(value)',
        rerenderTick: 'render tick',
        switchZh: '只切到中文（不触发重渲染）',
        switchEn: '只切到英文（不触发重渲染）',
        rerender: '手动触发一次重渲染',
        note: '这不是插件失效，而是它本来就只负责把 localize 接到 i18next。真正的 UI 自动刷新，应交给 React/Vue 专用插件。',
        structureTitle: '派生结果仍然可用',
        structureDescription: '即使不用 UI 专用插件，enum 依然可以输出 toList / toMap / raw 等稳定结构。',
        listTitle: 'toList() 输出',
        mapTitle: 'toMap() 输出',
        codeTitle: '推荐安装方式',
        code: `import i18nextPlugin from '@enum-plus/plugin-i18next';\nimport { Enum } from 'enum-plus';\n\nEnum.install(i18nextPlugin, {\n  localize: {\n    instance: i18next,\n    tOptions: { ns: 'translation' },\n  },\n});`,
      }
    : {
        pageTitle: 'i18next: localize enum labels without owning UI refresh',
        pageDescription:
          '@enum-plus/plugin-i18next is useful when you want plain enum label localization through i18next. It solves translation lookup, not React/Vue reactivity. If the host UI does not rerender, the screen will not refresh automatically.',
        highlights: ['i18next', 'String localization', 'Host-controlled refresh', 'Low coupling'],
        runtimeTitle: 'After language changes, the host UI must rerender',
        runtimeDescription:
          'This demo intentionally changes the i18next language without calling setState. The translation source changes immediately, but the visible UI waits for the next rerender.',
        currentI18n: 'instance.language',
        enumName: 'enum.name',
        enumLabel: 'enum.label(value)',
        rerenderTick: 'render tick',
        switchZh: 'Switch to Chinese only (no rerender)',
        switchEn: 'Switch to English only (no rerender)',
        rerender: 'Force one rerender',
        note: 'This is not a bug. The plugin only connects localize to i18next. Automatic UI refresh should be handled by a React/Vue specific plugin.',
        structureTitle: 'Derived outputs still work well',
        structureDescription:
          'Even without a UI-specific plugin, the enum can still expose stable outputs like toList, toMap, and raw.',
        listTitle: 'toList() output',
        mapTitle: 'toMap() output',
        codeTitle: 'Recommended installation',
        code: `import i18nextPlugin from '@enum-plus/plugin-i18next';\nimport { Enum } from 'enum-plus';\n\nEnum.install(i18nextPlugin, {\n  localize: {\n    instance: i18next,\n    tOptions: { ns: 'translation' },\n  },\n});`,
      };
}

function I18nextStory() {
  const storyLocale = useStoryLocale();
  const copy = useCopy();
  const [renderTick, setRenderTick] = useState(0);
  const instance = useMemo(() => createStoryI18next(storyLocale), [storyLocale]);

  useEffect(() => {
    const previousLocalize = Enum.localize;
    i18nextPlugin({ localize: { instance } }, Enum as never);
    return () => {
      Enum.localize = previousLocalize;
    };
  }, [instance]);

  const publishingStatus = useMemo(
    () =>
      Enum(
        {
          Draft: { value: 'draft', label: 'status.draft', tone: 'default' },
          Review: { value: 'review', label: 'status.review', tone: 'processing' },
          Published: { value: 'published', label: 'status.published', tone: 'success' },
        },
        { name: 'status.enumName' },
      ),
    [renderTick],
  );

  return (
    <StoryPage title={copy.pageTitle} description={copy.pageDescription} highlights={copy.highlights}>
      <StorySection title={copy.runtimeTitle} description={copy.runtimeDescription}>
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
                    { key: 'language', label: copy.currentI18n, children: instance.language },
                    { key: 'name', label: copy.enumName, children: publishingStatus.name },
                    { key: 'label', label: copy.enumLabel, children: publishingStatus.label('review') },
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

      <StorySection title={copy.structureTitle} description={copy.structureDescription}>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Space wrap>
            {publishingStatus.items.map((item) => {
              const raw = item.raw as { tone?: string };
              return (
                <Tag key={item.key} color={raw.tone}>
                  {item.label}
                </Tag>
              );
            })}
          </Space>
          <TwoColumn
            left={<JsonPreview title={copy.listTitle} value={publishingStatus.toList()} />}
            right={<JsonPreview title={copy.mapTitle} value={publishingStatus.toMap()} />}
          />
          <Card size="small">
            <Text type="secondary">{`renderTick = ${renderTick}`}</Text>
          </Card>
        </Space>
      </StorySection>
    </StoryPage>
  );
}

export const Playground: Story = {
  render: function Render() {
    return <I18nextStory />;
  },
};
