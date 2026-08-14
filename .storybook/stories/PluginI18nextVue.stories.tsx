import { useEffect, useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import i18next from 'i18next';
import { Button, Card, Descriptions, Space, Tag, Typography } from 'antd';
import i18nextVuePlugin from '../../packages/plugin-i18next-vue/src';
import { Enum } from '../../src';
import { storyT, useStoryLocale, useStoryT } from '../locales';
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

const INSTALL_CODE = `import i18nextVuePlugin from '@enum-plus/plugin-i18next-vue';\nimport { Enum } from 'enum-plus';\n\nEnum.install(i18nextVuePlugin, {\n  localize: {\n    useTranslationOptions: { keyPrefix: 'delivery' },\n  },\n});`;

function I18nextVueStory() {
  const storyLocale = useStoryLocale();
  const t = useStoryT();
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
    <StoryPage
      title={t('storybook.stories.PluginI18nextVue.pageTitle')}
      description={t('storybook.stories.PluginI18nextVue.pageDescription')}
      highlights={[
        t('storybook.stories.PluginI18nextVue.highlights.i18nextVue'),
        t('storybook.stories.PluginI18nextVue.highlights.fallbackPath'),
        t('storybook.stories.PluginI18nextVue.highlights.keyPrefix'),
        t('storybook.stories.PluginI18nextVue.highlights.hostRefresh'),
      ]}
    >
      <StorySection
        title={t('storybook.stories.PluginI18nextVue.runtimeTitle')}
        description={t('storybook.stories.PluginI18nextVue.runtimeDescription')}
      >
        <TwoColumn
          left={
            <Card size="small">
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Space wrap>
                  <Button onClick={() => setActiveLocale('zh-CN')}>
                    {t('storybook.stories.PluginI18nextVue.switchZh')}
                  </Button>
                  <Button onClick={() => setActiveLocale('en-US')}>
                    {t('storybook.stories.PluginI18nextVue.switchEn')}
                  </Button>
                  <Button type="primary" onClick={() => setRenderTick((value) => value + 1)}>
                    {t('storybook.stories.PluginI18nextVue.rerender')}
                  </Button>
                </Space>
                <Descriptions
                  size="small"
                  column={1}
                  items={[
                    {
                      key: 'lang',
                      label: t('storybook.stories.PluginI18nextVue.currentLanguage'),
                      children: activeLocale,
                    },
                    {
                      key: 'name',
                      label: t('storybook.stories.PluginI18nextVue.enumName'),
                      children: deliveryEnum.name,
                    },
                    {
                      key: 'label',
                      label: t('storybook.stories.PluginI18nextVue.currentLabel'),
                      children: deliveryEnum.label('review'),
                    },
                    { key: 'tick', label: t('storybook.stories.PluginI18nextVue.rerenderTick'), children: renderTick },
                  ]}
                />
                <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  {t('storybook.stories.PluginI18nextVue.note')}
                </Paragraph>
              </Space>
            </Card>
          }
          right={<CodePreview title={t('storybook.stories.PluginI18nextVue.codeTitle')} code={INSTALL_CODE} />}
        />
      </StorySection>

      <StorySection
        title={t('storybook.stories.PluginI18nextVue.derivedTitle')}
        description={t('storybook.stories.PluginI18nextVue.derivedDescription')}
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
            left={
              <JsonPreview title={t('storybook.stories.PluginI18nextVue.listTitle')} value={deliveryEnum.toList()} />
            }
            right={
              <JsonPreview title={t('storybook.stories.PluginI18nextVue.mapTitle')} value={deliveryEnum.toMap()} />
            }
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
