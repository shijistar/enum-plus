import { useMemo } from 'react';
import { useStoryLocale } from '../locales';

export interface LocalizedDocProps {
  docEn: React.ComponentType;
  docCn: React.ComponentType;
}

type DocsNavItem = {
  slug: string;
  title: string;
  titleCN: string;
};

const DOCS_NAV_ITEMS: DocsNavItem[] = [
  { slug: 'introduce', title: 'Introduce', titleCN: '介绍' },
  { slug: 'install', title: 'Install', titleCN: '安装' },
  { slug: 'get-started', title: 'Get Started', titleCN: '快速上手' },
  { slug: 'api-reference', title: 'API Reference', titleCN: 'API文档' },
  { slug: 'global-configuration', title: 'Global Configuration', titleCN: '全局配置' },
  { slug: 'user-stories', title: 'User Stories', titleCN: '典型用法' },
  { slug: 'best-practices', title: 'Best Practices', titleCN: '最佳实践' },
  { slug: 'plugin-system', title: 'Plugin System', titleCN: '插件系统' },
  { slug: 'extensibility', title: 'Extensibility', titleCN: '全局扩展' },
  { slug: 'localization', title: 'Localization', titleCN: '本地化' },
  { slug: 'naming-conflicts', title: 'Naming Conflicts', titleCN: '命名冲突' },
  { slug: 'compatibility', title: 'Compatibility', titleCN: '兼容性' },
  { slug: 'faq', title: 'FAQ', titleCN: '常见问题' },
  { slug: 'security', title: 'Security', titleCN: '安全' },
  { slug: 'support', title: 'Support', titleCN: '支持' },
];

function getPathFromUrl() {
  return new URLSearchParams(window.location.search).get('path') ?? '';
}

function getGlobalsFromUrl() {
  const globals = new URLSearchParams(window.location.search).get('globals');
  return globals ? `&globals=${globals}` : '';
}

function getCurrentDocSlug() {
  const searchParams = new URLSearchParams(window.location.search);
  const path = searchParams.get('path') ?? '';
  const pathMatch = path.match(/^\/docs\/([a-z0-9-]+)--docs$/i);
  if (pathMatch?.[1]) {
    return pathMatch[1];
  }

  const storyId = searchParams.get('id') ?? '';
  const idMatch = storyId.match(/^([a-z0-9-]+)--docs$/i);
  return idMatch?.[1] ?? '';
}

function getLabel(item: DocsNavItem, locale: string) {
  return locale === 'zh-CN' ? item.titleCN : item.title;
}

function getDocHref(slug: string) {
  return `?path=/docs/${slug}--docs${getGlobalsFromUrl()}`;
}

function LocalizedDoc(props: LocalizedDocProps) {
  const locale = useStoryLocale();
  const Doc = locale === 'en-US' ? props.docEn : props.docCn;
  const currentDocSlug = getCurrentDocSlug();

  const { previousItem, nextItem } = useMemo(() => {
    const currentIndex = DOCS_NAV_ITEMS.findIndex((item) => item.slug === currentDocSlug);
    return {
      previousItem: currentIndex > 0 ? DOCS_NAV_ITEMS[currentIndex - 1] : undefined,
      nextItem: currentIndex >= 0 && currentIndex < DOCS_NAV_ITEMS.length - 1 ? DOCS_NAV_ITEMS[currentIndex + 1] : undefined,
    };
  }, [currentDocSlug]);

  const previousLabel = locale === 'zh-CN' ? '前一步' : 'Previous';
  const nextLabel = locale === 'zh-CN' ? '后一步' : 'Next';

  return (
    <>
      <Doc />
      {(previousItem || nextItem) && (
        <nav className="ep-docs-pagination" aria-label={locale === 'zh-CN' ? '文档分页导航' : 'Docs pagination'}>
          {previousItem ? (
            <a className="ep-docs-pagination-link ep-docs-pagination-link-prev" href={getDocHref(previousItem.slug)}>
              <span className="ep-docs-pagination-label">← {previousLabel}</span>
              <strong className="ep-docs-pagination-title">{getLabel(previousItem, locale)}</strong>
            </a>
          ) : (
            <span className="ep-docs-pagination-placeholder" aria-hidden="true" />
          )}
          {nextItem ? (
            <a className="ep-docs-pagination-link ep-docs-pagination-link-next" href={getDocHref(nextItem.slug)}>
              <span className="ep-docs-pagination-label">{nextLabel} →</span>
              <strong className="ep-docs-pagination-title">{getLabel(nextItem, locale)}</strong>
            </a>
          ) : (
            <span className="ep-docs-pagination-placeholder" aria-hidden="true" />
          )}
        </nav>
      )}
    </>
  );
}

export default LocalizedDoc;
