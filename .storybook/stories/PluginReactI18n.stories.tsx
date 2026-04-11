import { useEffect, useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import i18next from 'i18next';
import { Button, Card, Descriptions, Input, Select, Space, Table, Tag, Typography } from 'antd';
import { reactI18nextPlugin } from '../../packages/plugin-react/src';
import { Enum } from '../../src';
import { StoryPage, StorySection, TwoColumn } from './shared/demo';
import { ensureStoryI18n } from './shared/i18n';

Enum.install(reactI18nextPlugin, {
  useTranslationOptions: { ns: 'translation' },
  defaultSearchField: 'label',
});

const { Text } = Typography;
const activeI18n = i18next;

const meta: Meta = {
  title: '插件/React 国际化',
  parameters: {
    docs: {
      description: {
        component:
          '参考 packages/plugin-react/README，用 react-i18next 驱动枚举 label，把语言切换、Select 自动刷新，以及 isMatch 搜索能力都放进一个可互动面板。',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

type ReactLocalizedEnum = ReturnType<typeof Enum> & {
  isMatch(search: string | undefined, item: unknown): boolean;
  isMatchCaseSensitive(search: string | undefined, item: unknown): boolean;
};

function ReactI18nDemo() {
  const instance = ensureStoryI18n();
  const [readyVersion, setReadyVersion] = useState(0);
  const [selectedValue, setSelectedValue] = useState<string>('draft');
  const [searchText, setSearchText] = useState('re');
  const [language, setLanguage] = useState(instance.language);

  useEffect(() => {
    const previousLocalize = Enum.localize;

    setReadyVersion((value) => value + 1);

    const handleLanguage = (nextLanguage: string) => {
      setLanguage(nextLanguage);
    };
    instance.on('languageChanged', handleLanguage);

    return () => {
      instance.off('languageChanged', handleLanguage);
      Enum.localize = previousLocalize;
    };
  }, [instance]);

  const localizedStatusEnum = useMemo(
    () =>
      Enum(
        {
          Draft: { value: 'draft', label: 'story.status.draft' },
          Review: { value: 'review', label: 'story.status.review' },
          Published: { value: 'published', label: 'story.status.published' },
          Archived: { value: 'archived', label: 'story.status.archived' },
        },
        {
          name: 'story.status.enumName',
        },
      ) as ReactLocalizedEnum,
    [readyVersion],
  );

  const fuzzyRows = localizedStatusEnum.items.filter((item) => localizedStatusEnum.isMatch(searchText, item));
  const strictRows = localizedStatusEnum.items.filter((item) =>
    localizedStatusEnum.isMatchCaseSensitive(searchText, item),
  );

  return (
    <StoryPage
      title="React 场景下的动态国际化枚举"
      description="@enum-plus/plugin-react 会把 label 变成 React 可渲染内容，并监听 react-i18next 的语言切换，让已选项、下拉列表和枚举名自动刷新。"
      highlights={['react-i18next', '自动刷新', 'isMatch()', 'Select 搜索']}
    >
      <StorySection title="语言切换与自动刷新" description="切换语言后，不需要重建组件，选中的标签和枚举名会自动更新。">
        <TwoColumn
          left={
            <Card size="small" title="交互区">
              <Space direction="vertical" size={16} style={{ width: '100%' }}>
                <Space wrap>
                  <Button
                    type={language === 'zh-CN' ? 'primary' : 'default'}
                    onClick={() => void activeI18n.changeLanguage('zh-CN')}
                  >
                    中文
                  </Button>
                  <Button
                    type={language === 'en-US' ? 'primary' : 'default'}
                    onClick={() => void activeI18n.changeLanguage('en-US')}
                  >
                    English
                  </Button>
                </Space>

                <Select
                  value={selectedValue}
                  showSearch
                  style={{ width: '100%' }}
                  options={localizedStatusEnum.items as unknown as { value: string; label: string }[]}
                  filterOption={(input, option) => localizedStatusEnum.isMatch(input, option)}
                  onChange={(value) => setSelectedValue(value)}
                />

                <Descriptions
                  size="small"
                  column={1}
                  items={[
                    { key: 'lang', label: '当前语言', children: language },
                    { key: 'name', label: 'enum.name', children: localizedStatusEnum.name || '-' },
                    { key: 'label', label: 'label(value)', children: localizedStatusEnum.label(selectedValue) },
                  ]}
                />
              </Space>
            </Card>
          }
          right={
            <Card size="small" title="当前 options 预览">
              <Space wrap>
                {localizedStatusEnum.items.map((item) => (
                  <Tag key={item.key} color="blue">
                    {item.label}
                  </Tag>
                ))}
              </Space>
            </Card>
          }
        />
      </StorySection>

      <StorySection
        title="搜索能力：isMatch / isMatchCaseSensitive"
        description="当 label 不再是纯字符串时，建议使用插件附带的匹配函数来恢复可搜索性。"
      >
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Input
            value={searchText}
            style={{ maxWidth: 320 }}
            addonBefore="搜索词"
            onChange={(event) => setSearchText(event.target.value)}
          />

          <Table
            className="ep-table"
            rowKey="mode"
            pagination={false}
            columns={[
              { title: '匹配模式', dataIndex: 'mode', width: 180 },
              {
                title: '命中项',
                dataIndex: 'items',
                render: (items: typeof localizedStatusEnum.items) => (
                  <Space wrap>
                    {items.length > 0 ? (
                      items.map((item) => <Tag key={item.key}>{item.label}</Tag>)
                    ) : (
                      <Text type="secondary">无结果</Text>
                    )}
                  </Space>
                ),
              },
            ]}
            dataSource={[
              { mode: 'isMatch', items: fuzzyRows },
              { mode: 'isMatchCaseSensitive', items: strictRows },
            ]}
          />
        </Space>
      </StorySection>
    </StoryPage>
  );
}

export const Playground: Story = {
  render: function Render() {
    return <ReactI18nDemo />;
  },
};
