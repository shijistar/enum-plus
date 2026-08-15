import { useEffect, useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { createI18n } from 'vue-i18n';
import { Button, Card, Descriptions, Space, Tag, Typography } from 'antd';
import vueI18nPlugin from '../../packages/plugin-vue-i18n/src';
import { Enum } from '../../src';
import { storyT, useStoryLocale, useStoryT } from '../locales';
import { CodePreview, JsonPreview, StoryPage, StorySection, TwoColumn } from './shared/demo';

const { Paragraph } = Typography;

const meta: Meta = {
  title: 'Plugins/vue-i18n',
  // @ts-expect-error: because titleCN is an extension field
  titleCN: '插件/vue-i18n',
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

const INSTALL_CODE = `import vueI18nPlugin from '@enum-plus/plugin-vue-i18n';\nimport { Enum } from 'enum-plus';\n\nEnum.install(vueI18nPlugin, {\n  localize: {\n    instance: i18n,\n  },\n});`;

function VueI18nStory() {
  const storyLocale = useStoryLocale();
  const t = useStoryT();
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
    setRenderTick((value) => value + 1);
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
    <StoryPage
      title={t('storybook.stories.PluginVueI18n.pageTitle')}
      description={t('storybook.stories.PluginVueI18n.pageDescription')}
      highlights={[
        t('storybook.stories.PluginVueI18n.highlights.vueI18n'),
        t('storybook.stories.PluginVueI18n.highlights.instanceFallback'),
        t('storybook.stories.PluginVueI18n.highlights.nonVue'),
        t('storybook.stories.PluginVueI18n.highlights.localizedOutput'),
      ]}
    >
      <StorySection
        title={t('storybook.stories.PluginVueI18n.runtimeTitle')}
        description={t('storybook.stories.PluginVueI18n.runtimeDescription')}
      >
        <TwoColumn
          left={
            <Card size="small">
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Space wrap>
                  <Button
                    onClick={() => {
                      instance.global.locale.value = 'zh-CN';
                      setRenderTick((value) => value + 1);
                    }}
                  >
                    {t('storybook.stories.PluginVueI18n.switchZh')}
                  </Button>
                  <Button
                    onClick={() => {
                      instance.global.locale.value = 'en-US';
                      setRenderTick((value) => value + 1);
                    }}
                  >
                    {t('storybook.stories.PluginVueI18n.switchEn')}
                  </Button>
                </Space>
                <Descriptions
                  size="small"
                  column={1}
                  items={[
                    {
                      key: 'locale',
                      label: t('storybook.stories.PluginVueI18n.currentLocale'),
                      children: instance.global.locale.value,
                    },
                    { key: 'name', label: t('storybook.stories.PluginVueI18n.enumName'), children: deliveryEnum.name },
                    {
                      key: 'label',
                      label: t('storybook.stories.PluginVueI18n.currentLabel'),
                      children: deliveryEnum.label('review'),
                    },
                    { key: 'tick', label: t('storybook.stories.PluginVueI18n.rerenderTick'), children: renderTick },
                  ]}
                />
                <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  {t('storybook.stories.PluginVueI18n.note')}
                </Paragraph>
              </Space>
            </Card>
          }
          right={<CodePreview title={t('storybook.stories.PluginVueI18n.codeTitle')} code={INSTALL_CODE} />}
        />
      </StorySection>

      <StorySection
        title={t('storybook.stories.PluginVueI18n.derivedTitle')}
        description={t('storybook.stories.PluginVueI18n.derivedDescription')}
      >
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
            left={<JsonPreview title={t('storybook.stories.PluginVueI18n.listTitle')} value={deliveryEnum.toList()} />}
            right={<JsonPreview title={t('storybook.stories.PluginVueI18n.mapTitle')} value={deliveryEnum.toMap()} />}
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
