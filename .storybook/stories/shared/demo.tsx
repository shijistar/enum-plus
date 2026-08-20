import type { PropsWithChildren, ReactNode } from 'react';
import { Card, Col, ConfigProvider, Row, Space, Tag, theme, Typography } from 'antd';
import storyI18n from '../../locales/index';
import type { i18n } from 'i18next';
import type { EllipsisConfig } from 'antd/es/typography/Base';

const { Paragraph, Text, Title } = Typography;

export function StoryPage(props: {
  eyebrow?: ReactNode;
  title: string;
  description: ReactNode;
  size?: 'normal' | 'large';
  highlights?: string[];
  children: ReactNode;
}) {
  const { eyebrow = 'enum-plus', title, description, size = 'normal', highlights = [], children } = props;

  return (
    <div className={`ep-page ep-page-${size}`}>
      <section className="ep-hero">
        <div className="ep-hero-copy">
          <div className="ep-eyebrow">{eyebrow}</div>
          <Title level={2} className="ep-title">
            {title}
          </Title>
          <Paragraph className="ep-subtitle">{description}</Paragraph>
        </div>

        {highlights.length > 0 ? (
          <div className="ep-meta">
            {highlights.map((item) => (
              <Tag key={item} color="gold">
                {item}
              </Tag>
            ))}
          </div>
        ) : null}
      </section>

      {children}
    </div>
  );
}

export function StorySection(
  props: PropsWithChildren<{ title: ReactNode; description?: ReactNode; extra?: ReactNode }>,
) {
  const { title, description, extra, children } = props;

  return (
    <Card
      className="ep-section"
      title={
        <div className="ep-section-title">
          <Text strong>{title}</Text>
          {description ? (
            <Paragraph type="secondary" style={{ fontWeight: 400 }}>
              {description}
            </Paragraph>
          ) : null}
        </div>
      }
      styles={{ title: { whiteSpace: 'normal' } }}
      extra={extra}
    >
      {children}
    </Card>
  );
}

export function JsonPreview(props: {
  title?: ReactNode;
  description?: ReactNode;
  value: unknown;
  note?: ReactNode;
  forceEnumText?: boolean;
  i18n?: i18n;
  indent?: number;
  ellipsis?: EllipsisConfig;
}) {
  const { title, description, value, note, forceEnumText = false, i18n = storyI18n, indent, ellipsis } = props;

  return (
    <Card
      size="small"
      title={
        description ? (
          <Space orientation="vertical" style={{ width: '100%' }}>
            {title}
            <Paragraph type="secondary" style={{ fontSize: 12, fontWeight: 400 }}>
              {description}
            </Paragraph>
          </Space>
        ) : (
          title
        )
      }
    >
      <pre className="ep-pre">
        <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
          <Typography.Paragraph ellipsis={ellipsis}>
            {stringifyPreview(value, { forceText: forceEnumText, i18n, indent })}
          </Typography.Paragraph>
        </ConfigProvider>
      </pre>
      {note ? <div className="ep-note">{note}</div> : null}
    </Card>
  );
}

export function CodePreview(props: { title?: string; code: string; fullHeight?: boolean }) {
  const { title, code, fullHeight = false } = props;

  return (
    <Card
      size="small"
      title={title}
      style={fullHeight ? { height: '100%', display: 'flex', flexDirection: 'column' } : undefined}
      styles={{ body: fullHeight ? { flex: 1, minHeight: 0, overflow: 'auto' } : undefined }}
    >
      <pre className="ep-pre" style={fullHeight ? { height: '100%' } : undefined}>
        {code.trim()}
      </pre>
    </Card>
  );
}

export function KpiRow(props: { items: { label: string; value: ReactNode }[] }) {
  return (
    <div className="ep-inline-list">
      {props.items.map((item) => (
        <div key={item.label} className="ep-kpi">
          <span className="ep-kpi-label">{item.label}</span>
          <span className="ep-kpi-value">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export function TwoColumn(props: PropsWithChildren<{ left: ReactNode; right: ReactNode }>) {
  return (
    <Row gutter={[16, 16]} className="ep-grid-gap">
      <Col xs={24} lg={12}>
        {props.left}
      </Col>
      <Col xs={24} lg={12}>
        {props.right}
      </Col>
    </Row>
  );
}

export function stringifyPreview(
  value: unknown,
  options?: {
    forceText?: boolean;
    i18n?: i18n;
    indent?: number;
  },
) {
  const { forceText = false, i18n = storyI18n, indent = 2 } = options ?? {};
  return JSON.stringify(
    value,
    (_key, currentValue) => {
      if (typeof currentValue === 'function') {
        return '[Function]';
      }
      if (typeof currentValue === 'symbol') {
        return currentValue.toString();
      }
      if (currentValue instanceof Map) {
        return Object.fromEntries(currentValue.entries());
      }
      if (currentValue instanceof Set) {
        return Array.from(currentValue.values());
      }
      if (currentValue && typeof currentValue === 'object' && '$$typeof' in currentValue) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const localeKey = (currentValue as any).props?.i18nKey;
        if (forceText && localeKey) {
          return i18n.t(localeKey);
        }
        return '[ReactElement]';
      }
      return currentValue;
    },
    indent,
  );
}

export function TagGroup(props: { items: ReactNode[] }) {
  return (
    <Space wrap>
      {props.items.map((item, index) => (
        <Tag key={`${index}-${String(item)}`}>{item}</Tag>
      ))}
    </Space>
  );
}
