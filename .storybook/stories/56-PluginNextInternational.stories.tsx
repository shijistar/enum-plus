'use client';

import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { PathnameContext, PathParamsContext } from 'next/dist/shared/lib/hooks-client-context.shared-runtime';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { createI18nClient } from 'next-international/client';
import { Button, Card, Descriptions, Input, Select, Space, Tag, Typography } from 'antd';
import { clientI18nPlugin, PatchedI18nProviderClient } from '../../packages/plugin-next-international/src';
import { Enum } from '../../src';
import { storyT, useStoryLocale, useStoryT } from '../locales';
import { CodePreview, StoryPage, StorySection, TwoColumn } from './shared/demo';

const { Paragraph, Text } = Typography;

const meta: Meta = {
  title: 'Plugins/next-international',
  // @ts-expect-error: because titleCN is an extension field
  titleCN: '插件/next-international',
  parameters: {
    docs: {
      description: {
        component: storyT('storybook.stories.PluginNextInternational.metaDescription'),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

const INSTALL_CODE = `import { clientI18nPlugin, PatchedI18nProviderClient } from '@enum-plus/plugin-next-international';\nimport { Enum } from 'enum-plus';\n\nEnum.install(clientI18nPlugin, {\n  localize: { mode: 'component' },\n  isMatch: { defaultSearchField: 'label' },\n});\n\n<PatchedI18nProviderClient locale={locale} I18n={I18n}>...</PatchedI18nProviderClient>`;

type NextLocalizedEnum = ReturnType<typeof Enum> & {
  isMatch(search: string | undefined, item: unknown): boolean;
};

type LocalizedOption = {
  key: string;
  value: string;
  label: ReactNode;
  raw?: {
    tone?: string;
    label?: string;
  };
};

let nextIntlPluginInstalled = false;

function ensureNextIntlPlugin() {
  if (nextIntlPluginInstalled) {
    return;
  }

  Enum.install(clientI18nPlugin as unknown as Parameters<typeof Enum.install>[0], {
    localize: { mode: 'component' },
    isMatch: { defaultSearchField: 'label' },
  });
  nextIntlPluginInstalled = true;
}

function NextIntlProviderShell(props: {
  locale: 'en-US' | 'zh-CN';
  I18n: ReturnType<typeof createI18nClient>;
  children: ReactNode;
}) {
  const { locale, I18n, children } = props;

  return (
    <AppRouterContext
      value={{
        bfcacheId: '',
        push: async () => undefined,
        replace: async () => undefined,
        prefetch: async () => undefined,
        back: () => undefined,
        forward: () => undefined,
        refresh: () => undefined,
      }}
    >
      <PathParamsContext value={{ locale }}>
        <PathnameContext value="/">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          <PatchedI18nProviderClient locale={locale} I18n={I18n as any}>
            {children}
          </PatchedI18nProviderClient>
        </PathnameContext>
      </PathParamsContext>
    </AppRouterContext>
  );
}

function NextIntlRuntimeBootstrap(props: { onReady: () => void }) {
  const { onReady } = props;
  const t = useStoryT();

  useEffect(() => {
    onReady();
  }, [onReady]);

  return (
    <Card size="small">
      <Text type="secondary">{t('storybook.stories.PluginNextInternational.bootstrapText')}</Text>
    </Card>
  );
}

function NextIntlLocalizedContent(props: {
  locale: 'en-US' | 'zh-CN';
  selectedValue: string;
  searchText: string;
  onSelect: (value: string) => void;
}) {
  const { locale, selectedValue, searchText, onSelect } = props;
  const t = useStoryT();

  const deliveryEnum = useMemo(
    () =>
      Enum(
        {
          Pending: { value: 'pending', label: 'delivery.pending', tone: 'default' },
          Review: { value: 'review', label: 'delivery.review', tone: 'processing' },
          Published: { value: 'published', label: 'delivery.published', tone: 'success' },
        },
        { name: 'delivery.enumName' },
      ) as NextLocalizedEnum,
    [],
  );

  const options = deliveryEnum.items.map((item: LocalizedOption) => ({
    key: item.key,
    value: item.value,
    label: item.label,
    raw: item.raw as { tone?: string; label?: string } | undefined,
  })) as LocalizedOption[];

  const selectedItem = deliveryEnum.getByValue(selectedValue);
  const matchedItems = options.filter((item) => deliveryEnum.isMatch(searchText, item));

  return (
    <>
      <TwoColumn
        left={
          <Card size="small">
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <Select
                value={selectedValue}
                showSearch
                style={{ width: '100%' }}
                options={options}
                filterOption={(input, option) => deliveryEnum.isMatch(input, option)}
                onChange={(value) => onSelect(value)}
              />

              <Descriptions
                size="small"
                column={1}
                items={[
                  {
                    key: 'locale',
                    label: t('storybook.stories.PluginNextInternational.currentLocale'),
                    children: locale,
                  },
                  {
                    key: 'name',
                    label: t('storybook.stories.PluginNextInternational.enumName'),
                    children: deliveryEnum.name,
                  },
                  {
                    key: 'label',
                    label: t('storybook.stories.PluginNextInternational.selectedLabel'),
                    children: selectedItem?.label,
                  },
                ]}
              />

              <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                {t('storybook.stories.PluginNextInternational.searchNote')}
              </Paragraph>
              <Text type="secondary">{t('storybook.stories.PluginNextInternational.note')}</Text>
            </Space>
          </Card>
        }
        right={<CodePreview title={t('storybook.stories.PluginNextInternational.codeTitle')} code={INSTALL_CODE} />}
      />

      <StorySection title={t('storybook.stories.PluginNextInternational.matchedTitle')}>
        <Space wrap>
          {matchedItems.map((item) => (
            <Tag key={item.key} color={item.raw?.tone}>
              {item.label}
            </Tag>
          ))}
        </Space>
      </StorySection>
    </>
  );
}

function NextInternationalStory() {
  ensureNextIntlPlugin();
  const storyLocale = useStoryLocale();
  const t = useStoryT();
  const [locale, setLocale] = useState<'en-US' | 'zh-CN'>(storyLocale);
  const [selectedValue, setSelectedValue] = useState('review');
  const [searchText, setSearchText] = useState(storyLocale === 'zh-CN' ? '已' : 're');
  const [runtimeReady, setRuntimeReady] = useState(false);

  useEffect(() => {
    setLocale(storyLocale);
    setSearchText(storyLocale === 'zh-CN' ? '已' : 're');
    setRuntimeReady(false);
  }, [storyLocale]);

  const I18n = useMemo(
    () =>
      createI18nClient({
        'en-US': async () => ({
          default: {
            'delivery.enumName': 'Delivery Status',
            'delivery.pending': 'Pending',
            'delivery.review': 'Ready for Review',
            'delivery.published': 'Published',
          },
        }),
        'zh-CN': async () => ({
          default: {
            'delivery.enumName': '交付状态',
            'delivery.pending': '待处理',
            'delivery.review': '待审核',
            'delivery.published': '已发布',
          },
        }),
      }),
    [],
  );

  return (
    <StoryPage
      title={t('storybook.stories.PluginNextInternational.pageTitle')}
      description={t('storybook.stories.PluginNextInternational.pageDescription')}
      highlights={[
        t('storybook.stories.PluginNextInternational.highlights.provider'),
        t('storybook.stories.PluginNextInternational.highlights.clientPlugin'),
        t('storybook.stories.PluginNextInternational.highlights.appRouter'),
        t('storybook.stories.PluginNextInternational.highlights.autoRefresh'),
      ]}
    >
      <StorySection
        title={t('storybook.stories.PluginNextInternational.runtimeTitle')}
        description={t('storybook.stories.PluginNextInternational.runtimeDescription')}
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Space wrap>
            <Button type={locale === 'zh-CN' ? 'primary' : 'default'} onClick={() => setLocale('zh-CN')}>
              {t('storybook.stories.PluginNextInternational.switchZh')}
            </Button>
            <Button type={locale === 'en-US' ? 'primary' : 'default'} onClick={() => setLocale('en-US')}>
              {t('storybook.stories.PluginNextInternational.switchEn')}
            </Button>
          </Space>

          <Input
            value={searchText}
            addonBefore={t('storybook.stories.PluginNextInternational.search')}
            onChange={(event) => setSearchText(event.target.value)}
          />

          <NextIntlProviderShell locale={locale} I18n={I18n}>
            {runtimeReady ? (
              <NextIntlLocalizedContent
                locale={locale}
                selectedValue={selectedValue}
                searchText={searchText}
                onSelect={setSelectedValue}
              />
            ) : (
              <NextIntlRuntimeBootstrap onReady={() => setRuntimeReady(true)} />
            )}
          </NextIntlProviderShell>
        </Space>
      </StorySection>
    </StoryPage>
  );
}

export const Playground: Story = {
  render: function Render() {
    return <NextInternationalStory />;
  },
};
