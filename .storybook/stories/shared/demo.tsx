import type { PropsWithChildren, ReactNode } from 'react';
import { Card, Col, Row, Space, Tag, Typography } from 'antd';

const { Paragraph, Text, Title } = Typography;

export function StoryPage(props: {
  eyebrow?: string;
  title: string;
  description: ReactNode;
  highlights?: string[];
  children: ReactNode;
}) {
  const { eyebrow = 'enum-plus', title, description, highlights = [], children } = props;

  return (
    <div className="ep-page">
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

export function StorySection(props: PropsWithChildren<{ title: string; description?: ReactNode; extra?: ReactNode }>) {
  const { title, description, extra, children } = props;

  return (
    <Card
      className="ep-section"
      title={
        <div className="ep-section-title">
          <Text strong>{title}</Text>
          {description ? <Paragraph>{description}</Paragraph> : null}
        </div>
      }
      extra={extra}
    >
      {children}
    </Card>
  );
}

export function JsonPreview(props: { title: string; value: unknown; note?: ReactNode }) {
  const { title, value, note } = props;

  return (
    <Card size="small" title={title}>
      <pre className="ep-pre">{stringifyPreview(value)}</pre>
      {note ? <div className="ep-note">{note}</div> : null}
    </Card>
  );
}

export function CodePreview(props: { title: string; code: string }) {
  const { title, code } = props;

  return (
    <Card size="small" title={title}>
      <pre className="ep-pre">{code.trim()}</pre>
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

export function stringifyPreview(value: unknown) {
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
        return '[ReactElement]';
      }
      return currentValue;
    },
    2,
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
