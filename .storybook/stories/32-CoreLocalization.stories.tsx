import { useEffect, useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { createInstance, type i18n } from 'i18next';
import { Card, Col, Descriptions, Row, Segmented, Select, Space, Tag, Tooltip, Typography } from 'antd';
import { type AnyEnum, Enum } from '../../src';
import { storyT, useStoryLocale, useStoryT } from '../locales';
import { CodePreview, JsonPreview, StoryPage, StorySection, TwoColumn } from './shared/demo';

const { Text } = Typography;

const meta: Meta = {
  title: 'Core/Localization',
  // @ts-expect-error: because titleCN is an extension field
  titleCN: '核心/本地化',
  parameters: {
    docs: {
      description: {
        component: storyT('storybook.stories.CorePatterns.metaDescription'),
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Localization: Story = {
  name: 'Localization',
  // @ts-expect-error: because nameCN is an extension field
  nameCN: '本地化',
  render: function Render() {
    return <LocalizationDemo />;
  },
};

export const GlobalTemplates: Story = {
  name: 'Global Templates',
  // @ts-expect-error: because nameCN is an extension field
  nameCN: '全局模板',
  render: function Render() {
    return <TemplatesDemo />;
  },
};

function LocalizationDemo() {
  const t = useStoryT();
  const storyLocale = useStoryLocale();
  const [locale, setLocale] = useState<'zh-CN' | 'en-US'>(storyLocale);

  useEffect(() => {
    setLocale(storyLocale);
  }, [storyLocale]);

  const dictionary: Record<'zh-CN' | 'en-US', Record<string, string>> = {
    'zh-CN': {
      'enums.status.enumName': '发布状态',
      'enums.status.draft': '草稿',
      'enums.status.review': '审核中',
      'enums.status.published': '已发布',
    },
    'en-US': {
      'enums.status.enumName': 'Release Status',
      'enums.status.draft': 'Draft',
      'enums.status.review': 'In Review',
      'enums.status.published': 'Published',
    },
  };

  const statusEnum = useMemo(
    () =>
      Enum(
        {
          Draft: { value: 1, label: 'enums.status.draft' },
          Review: { value: 2, label: 'enums.status.review' },
          Published: { value: 3, label: 'enums.status.published' },
        },
        {
          name: 'enums.status.enumName',
          localize: (key) => dictionary[locale][key || ''] ?? key,
        },
      ),
    [locale],
  );
  const [selectedValue, setSelectedValue] = useState<number>(1);

  return (
    <StoryPage
      title={t('storybook.stories.CorePatterns.localization.title')}
      description={t('storybook.stories.CorePatterns.localization.description')}
      highlights={[
        t('storybook.stories.CorePatterns.localization.highlights.localize'),
        t('storybook.stories.CorePatterns.localization.highlights.crossFramework'),
      ]}
    >
      <StorySection title={t('storybook.stories.enumInitialization')}>
        <CodePreview
          title=""
          code={`
const StatusEnum = Enum({
  Draft: { value: 1, label: 'enums.status.draft' },
  Review: { value: 2, label: 'enums.status.review' },
  Published: { value: 3, label: 'enums.status.published' },
});`}
        />
      </StorySection>
      <StorySection
        title={t('storybook.stories.CorePatterns.localization.registration')}
        description={t('storybook.stories.CorePatterns.localization.registration.description')}
      >
        <CodePreview
          title=""
          code={`
const dictionary = {
  'zh-CN': {
    'enums.status.enumName': '发布状态',
    'enums.status.draft': '草稿',
    'enums.status.review': '审核中',
    'enums.status.published': '已发布',
  },
  'en-US': {
    'enums.status.enumName': 'Release Status',
    'enums.status.draft': 'Draft',
    'enums.status.review': 'In Review',
    'enums.status.published': 'Published',
  },
};

Enum.localize = (key: string) => dictionary[locale][key] ?? key;`}
        />
      </StorySection>
      <StorySection
        title={t('storybook.stories.CorePatterns.localization.section.title')}
        description={t('storybook.stories.CorePatterns.localization.section.description')}
      >
        <Space orientation="vertical" size={16} style={{ width: '100%' }}>
          <Segmented
            value={locale}
            options={['zh-CN', 'en-US']}
            onChange={(value) => setLocale(value as 'zh-CN' | 'en-US')}
          />

          <TwoColumn
            left={
              <Card size="small" title={t('storybook.stories.CorePatterns.localization.card.current')}>
                <Space orientation="vertical" size={16} style={{ width: '100%' }}>
                  <Select
                    value={selectedValue}
                    style={{ width: '100%' }}
                    options={statusEnum.items.map((item) => ({ value: item.value, label: item.label }))}
                    onChange={(value) => setSelectedValue(value)}
                  />
                  <Descriptions
                    size="small"
                    column={1}
                    items={[
                      { key: 'name', label: 'Enum name', children: statusEnum.name || '-' },
                      {
                        key: 'value',
                        label: 'value',
                        children: <Typography.Text code>{selectedValue}</Typography.Text>,
                      },
                      {
                        key: 'label',
                        label: 'label',
                        children: <Typography.Text code>{statusEnum.label(selectedValue)}</Typography.Text>,
                      },
                      {
                        key: 'raw',
                        label: 'raw',
                        children: (
                          <Typography.Text code>{JSON.stringify(statusEnum.raw(selectedValue))}</Typography.Text>
                        ),
                      },
                      {
                        key: 'labels',
                        label: 'labels',
                        children: (
                          <Space wrap>
                            {statusEnum.labels.map((v) => (
                              <Tag key={v}>{v}</Tag>
                            ))}
                          </Space>
                        ),
                      },
                    ]}
                  />
                </Space>
              </Card>
            }
            right={
              <JsonPreview
                forceEnumText
                title={t('storybook.stories.CorePatterns.localization.card.derived')}
                value={{
                  labels: statusEnum.labels,
                  toList: statusEnum.toList(),
                  toMap: statusEnum.toMap(),
                }}
              />
            }
          />
        </Space>
      </StorySection>
    </StoryPage>
  );
}

type TemplateMode = 'flat' | 'nested';
type DemoLang = 'en-US' | 'zh-CN';

const flatResourcesEn: Record<string, string> = {
  'storybook.enums.OrderStatus': 'Order Status',
  'storybook.enums.OrderStatus.Draft': 'Draft',
  'storybook.enums.OrderStatus.Review': 'In Review',
  'storybook.enums.OrderStatus.Published': 'Published',
  'storybook.enums.Priority': 'Priority',
  'storybook.enums.Priority.Low': 'Low',
  'storybook.enums.Priority.Medium': 'Medium',
  'storybook.enums.Priority.High': 'High',
  'storybook.enums.Priority.Critical': 'Critical',
  'storybook.enums.Channel': 'Channel',
  'storybook.enums.Channel.Web': 'Web',
  'storybook.enums.Channel.Mobile': 'Mobile',
  'storybook.enums.Channel.Api': 'API',
};

const flatResourcesZh: Record<string, string> = {
  'storybook.enums.OrderStatus': '订单状态',
  'storybook.enums.OrderStatus.Draft': '草稿',
  'storybook.enums.OrderStatus.Review': '审核中',
  'storybook.enums.OrderStatus.Published': '已发布',
  'storybook.enums.Priority': '优先级',
  'storybook.enums.Priority.Low': '低',
  'storybook.enums.Priority.Medium': '中',
  'storybook.enums.Priority.High': '高',
  'storybook.enums.Priority.Critical': '严重',
  'storybook.enums.Channel': '渠道',
  'storybook.enums.Channel.Web': '网页',
  'storybook.enums.Channel.Mobile': '移动端',
  'storybook.enums.Channel.Api': 'API',
};

const fieldTitleEn: Record<string, string> = {
  'storybook.stories.CorePatterns.templates.field.enumName': 'Enum name',
  'storybook.stories.CorePatterns.templates.field.labels': 'Labels',
  'storybook.stories.CorePatterns.templates.field.itemKey': 'Key',
  'storybook.stories.CorePatterns.templates.field.itemValue': 'Value',
  'storybook.stories.CorePatterns.templates.field.itemLabel': 'Label',
};

const fieldTitleZh: Record<string, string> = {
  'storybook.stories.CorePatterns.templates.field.enumName': '枚举名',
  'storybook.stories.CorePatterns.templates.field.labels': '标签',
  'storybook.stories.CorePatterns.templates.field.itemKey': '键',
  'storybook.stories.CorePatterns.templates.field.itemValue': '值',
  'storybook.stories.CorePatterns.templates.field.itemLabel': '标签',
};

const flatResourcesEnFull: Record<string, string> = { ...flatResourcesEn, ...fieldTitleEn };
const flatResourcesZhFull: Record<string, string> = { ...flatResourcesZh, ...fieldTitleZh };

const nestedResourcesEn = {
  storybook: {
    enums: {
      OrderStatus: {
        title: 'Order Status',
        Draft: { title: 'Draft' },
        Review: { title: 'In Review' },
        Published: { title: 'Published' },
      },
      Priority: {
        title: 'Priority',
        Low: { title: 'Low' },
        Medium: { title: 'Medium' },
        High: { title: 'High' },
        Critical: { title: 'Critical' },
      },
      Channel: {
        title: 'Channel',
        Web: { title: 'Web' },
        Mobile: { title: 'Mobile' },
        Api: { title: 'API' },
      },
    },
  },
};

const nestedResourcesZh = {
  storybook: {
    enums: {
      OrderStatus: {
        title: '订单状态',
        Draft: { title: '草稿' },
        Review: { title: '审核中' },
        Published: { title: '已发布' },
      },
      Priority: {
        title: '优先级',
        Low: { title: '低' },
        Medium: { title: '中' },
        High: { title: '高' },
        Critical: { title: '严重' },
      },
      Channel: {
        title: '渠道',
        Web: { title: '网页' },
        Mobile: { title: '移动端' },
        Api: { title: 'API' },
      },
    },
  },
};

const nestedResourcesEnFull = {
  storybook: {
    ...nestedResourcesEn.storybook,
    stories: {
      CorePatterns: {
        templates: {
          field: {
            enumName: 'Enum name',
            labels: 'Labels',
            itemKey: 'Key',
            itemValue: 'Value',
            itemLabel: 'Label',
          },
        },
      },
    },
  },
};

const nestedResourcesZhFull = {
  storybook: {
    ...nestedResourcesZh.storybook,
    stories: {
      CorePatterns: {
        templates: {
          field: {
            enumName: '枚举名',
            labels: '标签',
            itemKey: '键',
            itemValue: '值',
            itemLabel: '标签',
          },
        },
      },
    },
  },
};

const templatesByMode = {
  flat: {
    name: 'storybook.enums.{name}',
    items: {
      label: 'storybook.enums.{name}.{key}',
    },
  },
  nested: {
    name: 'storybook.enums.{name}.title',
    items: {
      label: 'storybook.enums.{name}.{key}.title',
    },
  },
} as const;

const globalConfigCode = {
  flat: `Enum.config.templates = {
  name: 'storybook.enums.{name}',
  items: {
    label: 'storybook.enums.{name}.{key}',
  },
};`,
  nested: `Enum.config.templates = {
  name: 'storybook.enums.{name}.title',
  items: {
    label: 'storybook.enums.{name}.{key}.title',
  },
};`,
};

const minimalInitCode = `const OrderStatusEnum = Enum(
  { Draft: 1, Review: 2, Published: 3 },
  { name: 'OrderStatus' },
);
const PriorityEnum = Enum(
  { Low: 1, Medium: 2, High: 3, Critical: 4 },
  { name: 'Priority' },
);
const ChannelEnum = Enum(
  { Web: 1, Mobile: 2, Api: 3 },
  { name: 'Channel' },
);`;

const legacyCode = `// Without global templates: every enum repeats labels and prefixes
const OrderStatusEnum = Enum(
  {
    Draft: { value: 1, label: 'storybook.enums.OrderStatus.Draft' },
    Review: { value: 2, label: 'storybook.enums.OrderStatus.Review' },
    Published: { value: 3, label: 'storybook.enums.OrderStatus.Published' },
  },
  { name: 'storybook.enums.OrderStatus' },
);`;

const modernCode = `// With global templates: minimal init
const OrderStatusEnum = Enum(
  { Draft: 1, Review: 2, Published: 3 },
  { name: 'OrderStatus' },
);`;

function TemplatesDemo() {
  const t = useStoryT();
  const storyLocale = useStoryLocale();
  const [mode, setMode] = useState<TemplateMode>('flat');
  const [demoLang, setDemoLang] = useState<DemoLang>(storyLocale);
  const [readyVersion, setReadyVersion] = useState(0);

  const demoI18n = useMemo(() => {
    const instance = createInstance();
    instance.init({
      lng: demoLang,
      fallbackLng: 'en-US',
      initImmediate: false,
      keySeparator: mode === 'flat' ? false : '.',
      resources:
        mode === 'flat'
          ? {
              'en-US': { translation: flatResourcesEnFull },
              'zh-CN': { translation: flatResourcesZhFull },
            }
          : {
              'en-US': { translation: nestedResourcesEnFull },
              'zh-CN': { translation: nestedResourcesZhFull },
            },
      interpolation: {
        escapeValue: false,
      },
    });
    return instance;
  }, [mode, demoLang]);

  const demoT = demoI18n.t;

  useEffect(() => {
    const prevTemplates = Enum.config.templates;
    const prevLocalize = Enum.localize;

    Enum.config.templates = templatesByMode[mode];
    Enum.localize = (key) => (key == null ? key : demoT(key as string));

    setReadyVersion((version) => version + 1);

    return () => {
      Enum.config.templates = prevTemplates;
      Enum.localize = prevLocalize;
    };
  }, [mode, demoLang, demoT]);

  const orderStatus = useMemo(
    () => Enum({ Draft: 1, Review: 2, Published: 3 }, { name: 'OrderStatus' }),
    [mode, readyVersion],
  );
  const priority = useMemo(
    () => Enum({ Low: 1, Medium: 2, High: 3, Critical: 4 }, { name: 'Priority' }),
    [mode, readyVersion],
  );
  const channel = useMemo(() => Enum({ Web: 1, Mobile: 2, Api: 3 }, { name: 'Channel' }), [mode, readyVersion]);

  return (
    <StoryPage
      title={t('storybook.stories.CorePatterns.templates.page.title')}
      description={t('storybook.stories.CorePatterns.templates.page.description')}
      highlights={[
        t('storybook.stories.CorePatterns.templates.highlights.globalConfig'),
        t('storybook.stories.CorePatterns.templates.highlights.minimalInit'),
        t('storybook.stories.CorePatterns.templates.highlights.flatNested'),
        t('storybook.stories.CorePatterns.templates.highlights.saveCode'),
      ]}
    >
      <StorySection
        title={t('storybook.stories.CorePatterns.templates.section.config.title')}
        description={t('storybook.stories.CorePatterns.templates.section.config.description')}
      >
        <Space orientation="vertical" size={16} style={{ width: '100%' }}>
          <Segmented
            value={mode}
            options={[
              {
                label: (
                  <Tooltip title={t('storybook.stories.CorePatterns.templates.mode.flat.tooltip')}>
                    <span>{t('storybook.stories.CorePatterns.templates.mode.flat')}</span>
                  </Tooltip>
                ),
                value: 'flat',
              },
              {
                label: (
                  <Tooltip title={t('storybook.stories.CorePatterns.templates.mode.nested.tooltip')}>
                    <span>{t('storybook.stories.CorePatterns.templates.mode.nested')}</span>
                  </Tooltip>
                ),
                value: 'nested',
              },
            ]}
            onChange={(value) => setMode(value as TemplateMode)}
          />
          <CodePreview
            title={t('storybook.stories.CorePatterns.templates.card.globalConfig')}
            code={globalConfigCode[mode]}
          />
          <CodePreview title={t('storybook.stories.CorePatterns.templates.card.minimalInit')} code={minimalInitCode} />
        </Space>
      </StorySection>

      <StorySection title={t('storybook.stories.CorePatterns.templates.section.resources.title')}>
        <TwoColumn
          left={
            <CodePreview
              title={t('storybook.stories.CorePatterns.templates.card.resources.enUS')}
              code={JSON.stringify(mode === 'flat' ? flatResourcesEn : nestedResourcesEn, null, 2)}
            />
          }
          right={
            <CodePreview
              title={t('storybook.stories.CorePatterns.templates.card.resources.zhCN')}
              code={JSON.stringify(mode === 'flat' ? flatResourcesZh : nestedResourcesZh, null, 2)}
            />
          }
        />
      </StorySection>

      <StorySection
        title={t('storybook.stories.CorePatterns.templates.section.effect.title')}
        description={t('storybook.stories.CorePatterns.templates.section.effect.description')}
        extra={
          <Select
            value={demoLang}
            style={{ width: 120 }}
            options={[
              { value: 'en-US', label: 'English' },
              { value: 'zh-CN', label: '中文' },
            ]}
            onChange={(value) => setDemoLang(value as DemoLang)}
          />
        }
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12} lg={8}>
            <EnumDemoCard fullHeight enumInstance={orderStatus} demoT={demoT} />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <EnumDemoCard fullHeight enumInstance={priority} demoT={demoT} />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <EnumDemoCard fullHeight enumInstance={channel} demoT={demoT} />
          </Col>
        </Row>
      </StorySection>

      <StorySection
        title={t('storybook.stories.CorePatterns.templates.section.compare.title')}
        description={t('storybook.stories.CorePatterns.templates.section.compare.description')}
      >
        <TwoColumn
          left={
            <CodePreview
              fullHeight
              title={t('storybook.stories.CorePatterns.templates.compare.legacy')}
              code={legacyCode}
            />
          }
          right={
            <CodePreview
              fullHeight
              title={t('storybook.stories.CorePatterns.templates.compare.templates')}
              code={modernCode}
            />
          }
        />
      </StorySection>
    </StoryPage>
  );
}

function EnumDemoCard(props: { enumInstance: AnyEnum; demoT: i18n['t']; fullHeight?: boolean }) {
  const { enumInstance, demoT, fullHeight } = props;
  const [selectedValue, setSelectedValue] = useState<unknown>(enumInstance.values[0]);

  useEffect(() => {
    setSelectedValue(enumInstance.values[0]);
  }, [enumInstance]);

  return (
    <Card size="small" title={enumInstance.name || '-'} style={{ height: fullHeight ? '100%' : 'auto' }}>
      <Space orientation="vertical" size={12} style={{ width: '100%' }}>
        <Descriptions
          size="small"
          column={1}
          items={[
            {
              key: 'name',
              label: demoT('storybook.stories.CorePatterns.templates.field.enumName'),
              children: enumInstance.name || '-',
            },
            {
              key: 'labels',
              label: demoT('storybook.stories.CorePatterns.templates.field.labels'),
              children: (
                <Space wrap>
                  {enumInstance.toList().map((item) => (
                    <Tag key={String(item.value)}>{item.label as string}</Tag>
                  ))}
                </Space>
              ),
            },
          ]}
        />
        <Select
          value={selectedValue as never}
          style={{ width: '100%' }}
          options={enumInstance.toList().map((item) => ({ value: item.value, label: item.label }))}
          onChange={(value) => setSelectedValue(value)}
        />
        <Descriptions
          size="small"
          column={1}
          items={[
            {
              key: 'key',
              label: demoT('storybook.stories.CorePatterns.templates.field.itemKey'),
              children: String(enumInstance.key(selectedValue)),
            },
            {
              key: 'value',
              label: demoT('storybook.stories.CorePatterns.templates.field.itemValue'),
              children: String(selectedValue),
            },
            {
              key: 'label',
              label: demoT('storybook.stories.CorePatterns.templates.field.itemLabel'),
              children: enumInstance.label(selectedValue) as string,
            },
          ]}
        />
      </Space>
    </Card>
  );
}
