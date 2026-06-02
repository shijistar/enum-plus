import { useEffect, useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { createI18n } from 'vue-i18n';
import { Button, Card, Descriptions, Space, Tag, Typography } from 'antd';
import vueI18nPlugin from '../../packages/plugin-vue-i18n/src';
import { Enum } from '../../src';
import { storyT, useStoryLocale } from '../locales';
import { CodePreview, JsonPreview, StoryPage, StorySection, TwoColumn } from './shared/demo';

const { Paragraph } = Typography;

const meta: Meta = {
  title: 'Plugins/06 Vue I18n',
  parameters: {
    docs: {
      description: {
        component: storyT('storybook.stories.PluginVueI18n.metaDescription'),
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
        pageTitle: 'Vue I18n：在非 Vue 容器里也能用实例回退路径验证输出',
        pageDescription:
          'plugin-vue-i18n 的设计目标是给 Vue 组件环境用；但它也提供了 instance 回退能力。因此即使当前 Storybook 是 React 壳子，我们仍然可以验证：枚举 label 会通过 vue-i18n 实例翻译，UI 更新则由宿主重渲染负责。',
        highlights: ['vue-i18n', 'instance fallback', '非 Vue 容器验证', '本地化输出'],
        runtimeTitle: 'React 壳中的最小回退闭环',
        runtimeDescription:
          '这里故意不进入 Vue 组件上下文，而是直接把 vue-i18n instance 传给插件，验证 fallback 输出路径。',
        currentLocale: 'i18n.locale',
        enumName: 'enum.name',
        currentLabel: 'enum.label(value)',
        rerenderTick: 'render tick',
        switchZh: '切到中文',
        switchEn: '切到英文',
        rerender: '手动重渲染',
        derivedTitle: '派生输出依然稳定可用',
        derivedDescription:
          '即使这里主要验证的是本地化回退路径，toList / toMap / items 这些 UI 输出结构仍然可以继续复用。',
        listTitle: 'toList() 输出',
        mapTitle: 'toMap() 输出',
        note: '在真实 Vue 组件里，plugin-vue-i18n 可以配合 useI18n 工作；这里展示的是独立于 Vue UI 的最小功能闭环。',
        codeTitle: '推荐安装方式',
        code: `import vueI18nPlugin from '@enum-plus/plugin-vue-i18n';\nimport { Enum } from 'enum-plus';\n\nEnum.install(vueI18nPlugin, {\n  localize: {\n    instance: i18n,\n  },\n});`,
      }
    : {
        pageTitle: 'Vue I18n: validate the instance fallback path outside a Vue shell',
        pageDescription:
          'plugin-vue-i18n is designed for Vue component environments, but it also exposes an instance fallback. That lets this React-based Storybook still validate the core contract: enum labels resolve through a vue-i18n instance, while visible UI refresh depends on the host rerender.',
        highlights: ['vue-i18n', 'Instance fallback', 'Non-Vue validation', 'Localized output'],
        runtimeTitle: 'A minimal fallback loop inside a React shell',
        runtimeDescription:
          'This intentionally avoids a Vue component context and passes a vue-i18n instance directly to the plugin so the fallback behavior becomes visible.',
        currentLocale: 'i18n.locale',
        enumName: 'enum.name',
        currentLabel: 'enum.label(value)',
        rerenderTick: 'render tick',
        switchZh: 'Switch to Chinese',
        switchEn: 'Switch to English',
        rerender: 'Manual rerender',
        derivedTitle: 'Derived outputs still stay stable',
        derivedDescription:
          'Even though this story focuses on the localization fallback path, UI-friendly structures like toList, toMap, and items remain reusable.',
        listTitle: 'toList() output',
        mapTitle: 'toMap() output',
        note: 'Inside real Vue components, plugin-vue-i18n can work with useI18n. This story focuses on the smallest framework-independent functional loop.',
        codeTitle: 'Recommended installation',
        code: `import vueI18nPlugin from '@enum-plus/plugin-vue-i18n';\nimport { Enum } from 'enum-plus';\n\nEnum.install(vueI18nPlugin, {\n  localize: {\n    instance: i18n,\n  },\n});`,
      };
}

function VueI18nStory() {
  const storyLocale = useStoryLocale();
  const copy = useCopy();
  const [renderTick, setRenderTick] = useState(0);

  const instance = useMemo(
    () =>
      createI18n({
        legacy: false,
        locale: storyLocale,
        fallbackLocale: 'en-US',
        messages: {
          'en-US': {
            'delivery.enumName': 'Delivery Status',
            'delivery.pending': 'Pending',
            'delivery.review': 'In Review',
            'delivery.shipped': 'Shipped',
          },
          'zh-CN': {
            'delivery.enumName': '交付状态',
            'delivery.pending': '待处理',
            'delivery.review': '审核中',
            'delivery.shipped': '已发出',
          },
        },
      }),
    [],
  );

  useEffect(() => {
    instance.global.locale.value = storyLocale;
  }, [instance, storyLocale]);

  useEffect(() => {
    const previousLocalize = Enum.localize;
    vueI18nPlugin({ localize: { instance } }, Enum as never);
    return () => {
      Enum.localize = previousLocalize;
    };
  }, [instance]);

  const deliveryEnum = useMemo(
    () =>
      Enum(
        {
          Pending: { value: 'pending', label: 'delivery.pending', tone: 'default' },
          Review: { value: 'review', label: 'delivery.review', tone: 'processing' },
          Shipped: { value: 'shipped', label: 'delivery.shipped', tone: 'success' },
        },
        { name: 'delivery.enumName' },
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
                  <Button onClick={() => void (instance.global.locale.value = 'zh-CN')}>{copy.switchZh}</Button>
                  <Button onClick={() => void (instance.global.locale.value = 'en-US')}>{copy.switchEn}</Button>
                  <Button type="primary" onClick={() => setRenderTick((value) => value + 1)}>
                    {copy.rerender}
                  </Button>
                </Space>
                <Descriptions
                  size="small"
                  column={1}
                  items={[
                    { key: 'locale', label: copy.currentLocale, children: instance.global.locale.value },
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
    return <VueI18nStory />;
  },
};
