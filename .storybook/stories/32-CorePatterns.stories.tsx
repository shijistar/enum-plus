import { useEffect, useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { createInstance } from 'i18next';
import { Card, Col, Descriptions, Row, Segmented, Select, Space, Tag, Typography } from 'antd';
import { type AnyEnum, Enum } from '../../src';
import { storyT, useStoryLocale, useStoryT } from '../locales';
import { CodePreview, JsonPreview, StoryPage, StorySection, TwoColumn } from './shared/demo';

const { Text } = Typography;

let extensionInstalled = false;
const meta: Meta = {
  title: 'Core/Localization, Composition and Extension',
  // @ts-expect-error: because titleCN is an extension field
  titleCN: '核心/本地化、组合与扩展',
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
export const GlobalTemplates: Story = {
  name: 'Global Templates',
  // @ts-expect-error: because nameCN is an extension field
  nameCN: '全局模板',
  render: function Render() {
    return <TemplatesDemo />;
  },
};

export const LocalizationAndAutoLabel: Story = {
  name: 'Localization and Auto Label',
  // @ts-expect-error: because nameCN is an extension field
  nameCN: '本地化与自动标签',
  render: function Render() {
    return <LocalizationDemo />;
  },
};

export const CompositionAndExtension: Story = {
  name: 'Composition and Extension',
  // @ts-expect-error: because nameCN is an extension field
  nameCN: '组合与扩展',
  render: function Render() {
    return <CompositionDemo />;
  },
};

function ensureCustomExtension() {
  if (extensionInstalled) {
    return;
  }

  Enum.extends({
    toBadgeMap(this: {
      toMap: (config: {
        key: 'value';
        value: (item: { label: string; raw: { color?: string } }) => { label: string; color?: string };
      }) => Record<string, { label: string; color?: string }>;
    }) {
      return this.toMap({
        key: 'value',
        value: (item) => ({
          label: item.label,
          color: item.raw.color,
        }),
      });
    },
  });

  extensionInstalled = true;
}

const extensionRegistrationCode = `Enum.extends({
  toBadgeMap() {
    return this.toMap({
      key: 'value',
      value: (item) => ({
        label: item.label,
        color: item.raw.color,
      }),
    });
  },
});`;

function LocalizationDemo() {
  const t = useStoryT();
  const storyLocale = useStoryLocale();
  const [locale, setLocale] = useState<'zh-CN' | 'en-US'>(storyLocale);

  useEffect(() => {
    setLocale(storyLocale);
  }, [storyLocale]);

  const dictionary: Record<'zh-CN' | 'en-US', Record<string, string>> = {
    'zh-CN': {
      'status.enumName': '发布状态',
      'status.draft': '草稿',
      'status.review': '审核中',
      'status.published': '已发布',
    },
    'en-US': {
      'status.enumName': 'Release Status',
      'status.draft': 'Draft',
      'status.review': 'In Review',
      'status.published': 'Published',
    },
  };

  const statusEnum = useMemo(
    () =>
      Enum(
        {
          Draft: { value: 'draft', label: 'draft', color: 'default' },
          Review: { value: 'review', label: 'review', color: 'processing' },
          Published: { value: 'published', label: 'published', color: 'success' },
        },
        {
          name: 'status.enumName',
          labelPrefix: 'status.',
          autoLabel: true,
          localize: (key) => dictionary[locale][key || ''] ?? key,
        },
      ),
    [locale],
  );
  const [selectedValue, setSelectedValue] = useState<string>('draft');

  return (
    <StoryPage
      title={t('storybook.stories.CorePatterns.localization.title')}
      description={t('storybook.stories.CorePatterns.localization.description')}
      highlights={[
        t('storybook.stories.CorePatterns.localization.highlights.localize'),
        t('storybook.stories.CorePatterns.localization.highlights.labelPrefix'),
        t('storybook.stories.CorePatterns.localization.highlights.autoLabel'),
        t('storybook.stories.CorePatterns.localization.highlights.crossFramework'),
      ]}
    >
      <StorySection
        title={t('storybook.stories.CorePatterns.localization.section.title')}
        description={t('storybook.stories.CorePatterns.localization.section.description')}
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Segmented
            value={locale}
            options={['zh-CN', 'en-US']}
            onChange={(value) => setLocale(value as 'zh-CN' | 'en-US')}
          />

          <TwoColumn
            left={
              <Card size="small" title={t('storybook.stories.CorePatterns.localization.card.current')}>
                <Space direction="vertical" size={16} style={{ width: '100%' }}>
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
                      { key: 'name', label: 'enum.name', children: statusEnum.name || '-' },
                      { key: 'label', label: 'label(value)', children: statusEnum.label(selectedValue) },
                      {
                        key: 'raw',
                        label: 'raw(value)',
                        children: <Text code>{JSON.stringify(statusEnum.raw(selectedValue))}</Text>,
                      },
                    ]}
                  />
                </Space>
              </Card>
            }
            right={
              <JsonPreview
                title={t('storybook.stories.CorePatterns.localization.card.derived')}
                value={{ labels: statusEnum.labels, map: statusEnum.toMap() }}
              />
            }
          />
        </Space>
      </StorySection>
    </StoryPage>
  );
}

function CompositionDemo() {
  ensureCustomExtension();
  const t = useStoryT();

  const baseEnum = useMemo(
    () =>
      Enum({
        Draft: {
          value: 'draft',
          label: t('storybook.stories.CorePatterns.composition.sample.draft'),
          color: 'default',
        },
        Review: {
          value: 'review',
          label: t('storybook.stories.CorePatterns.composition.sample.review'),
          color: 'processing',
        },
      }),
    [t],
  );
  const terminalEnum = useMemo(
    () =>
      Enum({
        Published: {
          value: 'published',
          label: t('storybook.stories.CorePatterns.composition.sample.published'),
          color: 'success',
        },
        Archived: {
          value: 'archived',
          label: t('storybook.stories.CorePatterns.composition.sample.archived'),
          color: 'warning',
        },
      }),
    [t],
  );
  const mergedEnum = useMemo(
    () =>
      Enum(
        {
          ...baseEnum.raw(),
          ...terminalEnum.raw(),
        },
        { name: t('storybook.stories.CorePatterns.composition.sample.fullFlow') },
      ) as unknown as typeof baseEnum & {
        toBadgeMap(): Record<string, { label: string; color?: string }>;
      },
    [baseEnum, t, terminalEnum],
  );

  return (
    <StoryPage
      title={t('storybook.stories.CorePatterns.composition.title')}
      description={t('storybook.stories.CorePatterns.composition.description')}
      highlights={[
        t('storybook.stories.CorePatterns.composition.highlights.extends'),
        t('storybook.stories.CorePatterns.composition.highlights.raw'),
        t('storybook.stories.CorePatterns.composition.highlights.merge'),
        t('storybook.stories.CorePatterns.composition.highlights.readonly'),
      ]}
    >
      <StorySection
        title={t('storybook.stories.CorePatterns.composition.section.result.title')}
        description={t('storybook.stories.CorePatterns.composition.section.result.description')}
      >
        <TwoColumn
          left={
            <Descriptions
              bordered
              size="small"
              column={1}
              items={[
                {
                  key: 'name',
                  label: t('storybook.stories.CorePatterns.composition.field.enumName'),
                  children: mergedEnum.name || '-',
                },
                {
                  key: 'frozenEnum',
                  label: t('storybook.stories.CorePatterns.composition.field.frozenEnum'),
                  children: String(Object.isFrozen(mergedEnum)),
                },
                {
                  key: 'frozenItems',
                  label: t('storybook.stories.CorePatterns.composition.field.frozenItems'),
                  children: String(Object.isFrozen(mergedEnum.items)),
                },
                {
                  key: 'labels',
                  label: t('storybook.stories.CorePatterns.composition.field.allLabels'),
                  children: (
                    <Space wrap>
                      {mergedEnum.labels.map((item) => (
                        <Tag key={item}>{item}</Tag>
                      ))}
                    </Space>
                  ),
                },
              ]}
            />
          }
          right={<JsonPreview title="mergedEnum.raw()" value={mergedEnum.raw()} />}
        />
      </StorySection>

      <StorySection
        title={t('storybook.stories.CorePatterns.composition.section.extension.title')}
        description={t('storybook.stories.CorePatterns.composition.section.extension.description')}
      >
        <TwoColumn
          left={
            <CodePreview
              title={t('storybook.stories.CorePatterns.composition.section.extension.codeTitle')}
              code={extensionRegistrationCode}
            />
          }
          right={<JsonPreview title="mergedEnum.toBadgeMap()" value={mergedEnum.toBadgeMap()} />}
        />
      </StorySection>
    </StoryPage>
  );
}

type TemplateMode = 'flat' | 'nested';

const flatResources: Record<string, string> = {
  'storybook.enums.OrderStatus': 'Order Status',
  'storybook.enums.OrderStatus.Draft': 'Draft',
  'storybook.enums.OrderStatus.Review': 'In Review',
  'storybook.enums.OrderStatus.Published': 'Published',
  'storybook.enums.OrderStatus.Archived': 'Archived',
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

const nestedResources = {
  storybook: {
    enums: {
      OrderStatus: {
        title: 'Order Status',
        Draft: { title: 'Draft' },
        Review: { title: 'In Review' },
        Published: { title: 'Published' },
        Archived: { title: 'Archived' },
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

const minimalInitCode = `const OrderStatus = Enum(
  { Draft: 1, Review: 2, Published: 3, Archived: 4 },
  { name: 'OrderStatus' },
);
const Priority = Enum(
  { Low: 1, Medium: 2, High: 3, Critical: 4 },
  { name: 'Priority' },
);
const Channel = Enum(
  { Web: 1, Mobile: 2, Api: 3 },
  { name: 'Channel' },
);`;

const legacyCode = `// Without global templates: every enum repeats labels and prefixes
const OrderStatus = Enum(
  {
    Draft: { value: 1, label: t('storybook.enums.OrderStatus.Draft') },
    Review: { value: 2, label: t('storybook.enums.OrderStatus.Review') },
    Published: { value: 3, label: t('storybook.enums.OrderStatus.Published') },
    Archived: { value: 4, label: t('storybook.enums.OrderStatus.Archived') },
  },
  { name: t('storybook.enums.OrderStatus') },
);`;

const modernCode = `// With global templates: minimal init
const OrderStatus = Enum(
  { Draft: 1, Review: 2, Published: 3, Archived: 4 },
  { name: 'OrderStatus' },
);`;

function TemplatesDemo() {
  const t = useStoryT();
  const [mode, setMode] = useState<TemplateMode>('flat');
  const [readyVersion, setReadyVersion] = useState(0);

  useEffect(() => {
    const prevTemplates = Enum.config.templates;
    const prevLocalize = Enum.localize;

    const demoI18n = createInstance();
    demoI18n.init({
      lng: 'en',
      fallbackLng: 'en',
      initImmediate: false,
      keySeparator: mode === 'flat' ? false : '.',
      resources: { en: { translation: mode === 'flat' ? flatResources : nestedResources } },
      interpolation: {
        escapeValue: false,
      },
    });

    Enum.config.templates = templatesByMode[mode];
    Enum.localize = (key) => (key == null ? key : demoI18n.t(key as string));

    setReadyVersion((version) => version + 1);

    return () => {
      Enum.config.templates = prevTemplates;
      Enum.localize = prevLocalize;
    };
  }, [mode]);

  const orderStatus = useMemo(
    () => Enum({ Draft: 1, Review: 2, Published: 3, Archived: 4 }, { name: 'OrderStatus' }),
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
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Segmented
            value={mode}
            options={[
              { label: t('storybook.stories.CorePatterns.templates.mode.flat'), value: 'flat' },
              { label: t('storybook.stories.CorePatterns.templates.mode.nested'), value: 'nested' },
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
        <CodePreview
          title={t('storybook.stories.CorePatterns.templates.card.resources.enUS')}
          code={JSON.stringify(mode === 'flat' ? flatResources : nestedResources, null, 2)}
        />
      </StorySection>

      <StorySection
        title={t('storybook.stories.CorePatterns.templates.section.effect.title')}
        description={t('storybook.stories.CorePatterns.templates.section.effect.description')}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12} lg={8}>
            <EnumDemoCard
              enumInstance={orderStatus}
              enumNameLabel={t('storybook.stories.CorePatterns.templates.field.enumName')}
              labelsLabel={t('storybook.stories.CorePatterns.templates.field.labels')}
              keyLabel={t('storybook.stories.CorePatterns.templates.field.itemKey')}
              valueLabel={t('storybook.stories.CorePatterns.templates.field.itemValue')}
              labelLabel={t('storybook.stories.CorePatterns.templates.field.itemLabel')}
            />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <EnumDemoCard
              enumInstance={priority}
              enumNameLabel={t('storybook.stories.CorePatterns.templates.field.enumName')}
              labelsLabel={t('storybook.stories.CorePatterns.templates.field.labels')}
              keyLabel={t('storybook.stories.CorePatterns.templates.field.itemKey')}
              valueLabel={t('storybook.stories.CorePatterns.templates.field.itemValue')}
              labelLabel={t('storybook.stories.CorePatterns.templates.field.itemLabel')}
            />
          </Col>
          <Col xs={24} md={12} lg={8}>
            <EnumDemoCard
              enumInstance={channel}
              enumNameLabel={t('storybook.stories.CorePatterns.templates.field.enumName')}
              labelsLabel={t('storybook.stories.CorePatterns.templates.field.labels')}
              keyLabel={t('storybook.stories.CorePatterns.templates.field.itemKey')}
              valueLabel={t('storybook.stories.CorePatterns.templates.field.itemValue')}
              labelLabel={t('storybook.stories.CorePatterns.templates.field.itemLabel')}
            />
          </Col>
        </Row>
        <div style={{ marginTop: 16 }}>
          <JsonPreview title="OrderStatus.toMap()" value={orderStatus.toMap()} />
        </div>
      </StorySection>

      <StorySection
        title={t('storybook.stories.CorePatterns.templates.section.compare.title')}
        description={t('storybook.stories.CorePatterns.templates.section.compare.description')}
      >
        <TwoColumn
          left={<CodePreview title={t('storybook.stories.CorePatterns.templates.compare.legacy')} code={legacyCode} />}
          right={
            <CodePreview title={t('storybook.stories.CorePatterns.templates.compare.templates')} code={modernCode} />
          }
        />
      </StorySection>
    </StoryPage>
  );
}

function EnumDemoCard(props: {
  enumInstance: AnyEnum;
  enumNameLabel: string;
  labelsLabel: string;
  keyLabel: string;
  valueLabel: string;
  labelLabel: string;
}) {
  const { enumInstance, enumNameLabel, labelsLabel, keyLabel, valueLabel, labelLabel } = props;
  const [selectedValue, setSelectedValue] = useState<unknown>(enumInstance.values[0]);

  useEffect(() => {
    setSelectedValue(enumInstance.values[0]);
  }, [enumInstance]);

  return (
    <Card size="small" title={enumInstance.name || '-'}>
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <Descriptions
          size="small"
          column={1}
          items={[
            {
              key: 'name',
              label: enumNameLabel,
              children: enumInstance.name || '-',
            },
            {
              key: 'labels',
              label: labelsLabel,
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
              label: keyLabel,
              children: String(enumInstance.key(selectedValue)),
            },
            {
              key: 'value',
              label: valueLabel,
              children: String(selectedValue),
            },
            {
              key: 'label',
              label: labelLabel,
              children: enumInstance.label(selectedValue) as string,
            },
          ]}
        />
      </Space>
    </Card>
  );
}
