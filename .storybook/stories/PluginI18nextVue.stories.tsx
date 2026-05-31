import { useEffect, useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import i18next from 'i18next';
import { Button, Card, Descriptions, Space, Tag, Typography } from 'antd';
import i18nextVuePlugin from '../../packages/plugin-i18next-vue/src';
import { Enum } from '../../src';
import { storyT, useStoryLocale } from '../locales';
import { CodePreview, JsonPreview, StoryPage, StorySection, TwoColumn } from './shared/demo';

const { Paragraph } = Typography;
const STORY_NAMESPACE = 'storybook-plugin-i18next-vue';
const STORY_RESOURCES = {
  'en-US': {
    delivery: {
      enumName: 'Delivery Status',
      pending: 'Pending',
      review: 'In Review',
      shipped: 'Shipped',
    },
  },
  'zh-CN': {
    delivery: {
      enumName: '交付状态',
      pending: '待处理',
      review: '审核中',
      shipped: '已发出',
    },
  },
} as const;

const meta: Meta = {
  title: 'Plugins/07 i18next Vue',
  parameters: {
    docs: {
      description: {
        component: storyT('storybook.stories.PluginI18nextVue.metaDescription'),
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
        pageTitle: 'i18next-vue：在 React Storybook 中验证 Vue 侧 fallback 行为',
        pageDescription:
          'plugin-i18next-vue 本来面向 Vue + i18next-vue 组件环境，但它也内置了 fallback 逻辑。这里用 React 容器展示它的最小契约：enum 会走 i18next 翻译，真正的 UI 刷新仍要依赖宿主框架。',
        highlights: ['i18next-vue', 'fallback 路径', 'keyPrefix', '宿主刷新'],
        runtimeTitle: '无需 Vue 组件，也能检查插件输出',
        runtimeDescription:
          '这里通过 keyPrefix 把 label key 映射到 delivery.* 命名空间，并用 useTranslationOptions.lng 控制当前 story 的 locale，避免污染别的 i18next story。',
        currentLanguage: '当前生效 locale',
        enumName: 'enum.name',
        currentLabel: 'enum.label(value)',
        rerenderTick: 'render tick',
        switchZh: '切到中文',
        switchEn: '切到英文',
        rerender: '手动重渲染',
        derivedTitle: '派生输出结构仍然成立',
        derivedDescription:
          '这里虽然重点在 fallback 合同，但对界面层来说，toList / toMap / items 依然是可直接消费的稳定出口。',
        listTitle: 'toList() 输出',
        mapTitle: 'toMap() 输出',
        note: '在真实 Vue 页面中，你会通过 i18next-vue 的 useTranslation 获取响应式更新；这里展示的是 fallback 合同是否成立。',
        codeTitle: '推荐安装方式',
        code: `import i18nextVuePlugin from '@enum-plus/plugin-i18next-vue';\nimport { Enum } from 'enum-plus';\n\nEnum.install(i18nextVuePlugin, {\n  localize: {\n    useTranslationOptions: { keyPrefix: 'delivery' },\n  },\n});`,
      }
    : {
        pageTitle: 'i18next-vue: validate the Vue-side fallback from React Storybook',
        pageDescription:
          'plugin-i18next-vue primarily targets Vue + i18next-vue component environments, but it also includes a fallback path. This story uses a React shell to validate the minimum contract: enum labels resolve through i18next, while visible UI refresh still depends on the host framework.',
        highlights: ['i18next-vue', 'Fallback path', 'keyPrefix', 'Host refresh'],
        runtimeTitle: 'Inspect plugin output without a Vue component shell',
        runtimeDescription:
          'This story maps enum label keys into a delivery.* prefix and drives the locale through useTranslationOptions.lng so it stays isolated from other i18next-based stories.',
        currentLanguage: 'effective locale',
        enumName: 'enum.name',
        currentLabel: 'enum.label(value)',
        rerenderTick: 'render tick',
        switchZh: 'Switch to Chinese',
        switchEn: 'Switch to English',
        rerender: 'Manual rerender',
        derivedTitle: 'Derived outputs still hold up',
        derivedDescription:
          'The fallback contract is the focus here, but UI-facing outputs like toList, toMap, and items are still stable and reusable.',
        listTitle: 'toList() output',
        mapTitle: 'toMap() output',
        note: 'In a real Vue page, you would use i18next-vue useTranslation for reactive updates. This page focuses on proving the fallback contract.',
        codeTitle: 'Recommended installation',
        code: `import i18nextVuePlugin from '@enum-plus/plugin-i18next-vue';\nimport { Enum } from 'enum-plus';\n\nEnum.install(i18nextVuePlugin, {\n  localize: {\n    useTranslationOptions: { keyPrefix: 'delivery' },\n  },\n});`,
      };
}

function I18nextVueStory() {
  const storyLocale = useStoryLocale();
  const copy = useCopy();
  const [renderTick, setRenderTick] = useState(0);
  const [activeLocale, setActiveLocale] = useState<'en-US' | 'zh-CN'>(storyLocale);

  useEffect(() => {
    setActiveLocale(storyLocale);
  }, [storyLocale]);

  useEffect(() => {
    void (async () => {
      if (!i18next.isInitialized) {
        await i18next.init({
          lng: 'en-US',
          fallbackLng: 'en-US',
          initImmediate: false,
          resources: {},
        });
      }

      (Object.entries(STORY_RESOURCES) as Array<['en-US' | 'zh-CN', (typeof STORY_RESOURCES)['en-US']]>).forEach(
        ([locale, resource]) => {
          if (i18next.hasResourceBundle(locale, STORY_NAMESPACE)) {
            i18next.removeResourceBundle(locale, STORY_NAMESPACE);
          }
          i18next.addResourceBundle(locale, STORY_NAMESPACE, resource, true, true);
        },
      );
    })();

    return () => {
      (Object.keys(STORY_RESOURCES) as Array<'en-US' | 'zh-CN'>).forEach((locale) => {
        if (i18next.hasResourceBundle(locale, STORY_NAMESPACE)) {
          i18next.removeResourceBundle(locale, STORY_NAMESPACE);
        }
      });
    };
  }, []);

  useEffect(() => {
    const previousLocalize = Enum.localize;
    i18nextVuePlugin(
      {
        localize: {
          useTranslationOptions: { keyPrefix: 'delivery', lng: activeLocale },
          tOptions: { ns: STORY_NAMESPACE },
        },
      },
      Enum as never,
    );
    return () => {
      Enum.localize = previousLocalize;
    };
  }, [activeLocale]);

  const deliveryEnum = useMemo(
    () =>
      Enum(
        {
          Pending: { value: 'pending', label: 'pending', tone: 'default' },
          Review: { value: 'review', label: 'review', tone: 'processing' },
          Shipped: { value: 'shipped', label: 'shipped', tone: 'success' },
        },
        { name: 'enumName' },
      ),
    [activeLocale, renderTick],
  );

  return (
    <StoryPage title={copy.pageTitle} description={copy.pageDescription} highlights={copy.highlights}>
      <StorySection title={copy.runtimeTitle} description={copy.runtimeDescription}>
        <TwoColumn
          left={
            <Card size="small">
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Space wrap>
                  <Button onClick={() => setActiveLocale('zh-CN')}>{copy.switchZh}</Button>
                  <Button onClick={() => setActiveLocale('en-US')}>{copy.switchEn}</Button>
                  <Button type="primary" onClick={() => setRenderTick((value) => value + 1)}>
                    {copy.rerender}
                  </Button>
                </Space>
                <Descriptions
                  size="small"
                  column={1}
                  items={[
                    { key: 'lang', label: copy.currentLanguage, children: activeLocale },
                    { key: 'name', label: copy.enumName, children: deliveryEnum.name },
                    { key: 'label', label: copy.currentLabel, children: deliveryEnum.label('review') },
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
            {deliveryEnum.items.map((item) => {
              const raw = item.raw as { tone?: string };
              return (
                <Tag key={item.key} color={raw.tone}>
                  {item.label}
                </Tag>
              );
            })}
          </Space>
          <TwoColumn
            left={<JsonPreview title={copy.listTitle} value={deliveryEnum.toList()} />}
            right={<JsonPreview title={copy.mapTitle} value={deliveryEnum.toMap()} />}
          />
        </Space>
      </StorySection>
    </StoryPage>
  );
}

export const Playground: Story = {
  render: function Render() {
    return <I18nextVueStory />;
  },
};
