import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { PathnameContext, PathParamsContext } from 'next/dist/shared/lib/hooks-client-context.shared-runtime';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { createI18nClient } from 'next-international/client';
import { Button, Card, Descriptions, Input, Select, Space, Tag, Typography } from 'antd';
import { clientI18nPlugin, PatchedI18nProviderClient } from '../../packages/plugin-next-international/src';
import { Enum } from '../../src';
import { storyT, useStoryLocale } from '../locales';
import { CodePreview, StoryPage, StorySection, TwoColumn } from './shared/demo';

const { Paragraph, Text } = Typography;

const meta: Meta = {
  title: 'Plugins/05 Next International',
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

function useCopy() {
  const locale = useStoryLocale();

  return locale === 'zh-CN'
    ? {
        pageTitle: 'Next International：把 Next App Router 的语言上下文接进 enum-plus',
        pageDescription:
          '@enum-plus/plugin-next-international 的重点不只是翻译 label，而是把 next-international 的 client runtime 接到 enum-plus，并通过 PatchedI18nProviderClient 让枚举文本与搜索能力感知当前 locale。',
        highlights: ['PatchedI18nProviderClient', 'clientI18nPlugin', 'App Router context', '自动刷新'],
        runtimeTitle: '最小可运行的 Client Provider 闭环',
        runtimeDescription:
          '这个故事页复用了插件测试中的核心思路：构造 Next router context，再用 PatchedI18nProviderClient 把 runtime.t 注入给 enum-plus。',
        currentLocale: '当前 locale',
        enumName: 'enum.name',
        selectedLabel: 'label(value)',
        switchZh: '切到中文',
        switchEn: '切到英文',
        search: '搜索',
        searchNote: 'isMatch 会基于当前翻译文本匹配，而不是原始 key。',
        codeTitle: '推荐接入方式',
        code: `import { clientI18nPlugin, PatchedI18nProviderClient } from '@enum-plus/plugin-next-international';\nimport { Enum } from 'enum-plus';\n\nEnum.install(clientI18nPlugin, {\n  localize: { mode: 'component' },\n  isMatch: { defaultSearchField: 'label' },\n});\n\n<PatchedI18nProviderClient locale={locale} I18n={I18n}>...</PatchedI18nProviderClient>`,
        matchedTitle: '当前搜索命中项',
        note: '这里的自动更新来自 Next International provider，而不是手动重建 enum。',
      }
    : {
        pageTitle: 'Next International: connect Next App Router locale context to enum-plus',
        pageDescription:
          '@enum-plus/plugin-next-international does more than translate labels. It connects the next-international client runtime to enum-plus, and PatchedI18nProviderClient lets enum text and search follow the active locale.',
        highlights: ['PatchedI18nProviderClient', 'clientI18nPlugin', 'App Router context', 'Auto refresh'],
        runtimeTitle: 'A minimal client-provider loop',
        runtimeDescription:
          'This page follows the same core idea used in the package tests: build a tiny Next router context, then inject runtime.t into enum-plus through PatchedI18nProviderClient.',
        currentLocale: 'Current locale',
        enumName: 'enum.name',
        selectedLabel: 'label(value)',
        switchZh: 'Switch to Chinese',
        switchEn: 'Switch to English',
        search: 'Search',
        searchNote: 'isMatch works against the translated text, not the raw locale key.',
        codeTitle: 'Recommended setup',
        code: `import { clientI18nPlugin, PatchedI18nProviderClient } from '@enum-plus/plugin-next-international';\nimport { Enum } from 'enum-plus';\n\nEnum.install(clientI18nPlugin, {\n  localize: { mode: 'component' },\n  isMatch: { defaultSearchField: 'label' },\n});\n\n<PatchedI18nProviderClient locale={locale} I18n={I18n}>...</PatchedI18nProviderClient>`,
        matchedTitle: 'Current matched items',
        note: 'The automatic update here comes from the Next International provider, not from rebuilding the enum manually.',
      };
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

  useEffect(() => {
    onReady();
  }, [onReady]);

  return (
    <Card size="small">
      <Text type="secondary">Initializing Next International runtime…</Text>
    </Card>
  );
}

function NextIntlLocalizedContent(props: {
  locale: 'en-US' | 'zh-CN';
  selectedValue: string;
  searchText: string;
  copy: ReturnType<typeof useCopy>;
  onSelect: (value: string) => void;
}) {
  const { locale, selectedValue, searchText, copy, onSelect } = props;

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

  const options = deliveryEnum.items.map((item) => ({
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
                  { key: 'locale', label: copy.currentLocale, children: locale },
                  { key: 'name', label: copy.enumName, children: deliveryEnum.name },
                  { key: 'label', label: copy.selectedLabel, children: selectedItem?.label },
                ]}
              />

              <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                {copy.searchNote}
              </Paragraph>
              <Text type="secondary">{copy.note}</Text>
            </Space>
          </Card>
        }
        right={<CodePreview title={copy.codeTitle} code={copy.code} />}
      />

      <StorySection title={copy.matchedTitle}>
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
  const copy = useCopy();
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
    <StoryPage title={copy.pageTitle} description={copy.pageDescription} highlights={copy.highlights}>
      <StorySection title={copy.runtimeTitle} description={copy.runtimeDescription}>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Space wrap>
            <Button type={locale === 'zh-CN' ? 'primary' : 'default'} onClick={() => setLocale('zh-CN')}>
              {copy.switchZh}
            </Button>
            <Button type={locale === 'en-US' ? 'primary' : 'default'} onClick={() => setLocale('en-US')}>
              {copy.switchEn}
            </Button>
          </Space>

          <Input value={searchText} addonBefore={copy.search} onChange={(event) => setSearchText(event.target.value)} />

          <NextIntlProviderShell locale={locale} I18n={I18n}>
            {runtimeReady ? (
              <NextIntlLocalizedContent
                locale={locale}
                selectedValue={selectedValue}
                searchText={searchText}
                copy={copy}
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
