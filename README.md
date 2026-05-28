<!-- markdownlint-disable MD001 MD009 MD033 MD041 -->

[English](./README.md) | [中文](./README.zh-CN.md) | [CHANGELOG](./CHANGELOG.md)

<p align="center">
  <a href="https://github.com/shijistar/enum-plus" target="blank">
    <img src="./public/enum-plus.svg" width="240" alt="enum-plus" />
  </a>
</p>

<p align="center">
  <strong>Runtime-friendly enums for TypeScript and JavaScript.</strong>
</p>
<br/>

[![npm latest version](https://img.shields.io/npm/v/enum-plus.svg?cacheSeconds=86400)](https://www.npmjs.com/package/enum-plus)
[![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/enum-plus?logo=javascript&label=Minzipped&color=44cc11&cacheSeconds=86400)](https://www.npmjs.com/package/enum-plus?activeTab=code)
[![npm downloads](https://img.shields.io/npm/dm/enum-plus.svg?logo=rolldown&logoColor=fd7b24&label=Downloads&color=007ec6&cacheSeconds=86400)](https://www.npmjs.com/package/enum-plus)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/shijistar/enum-plus)
![GitHub License](https://img.shields.io/github/license/shijistar/enum-plus?label=License&color=ff8000&cacheSeconds=86400)

> The README is now the GitHub landing page. The full bilingual guide, API reference map, and interactive demos live on GitHub Pages.

## Docs & demos

- **English Pages:** [Introduce](https://shijistar.github.io/enum-plus/?path=/docs/introduce--docs)
- **中文 Pages：** [介绍](https://shijistar.github.io/enum-plus/?path=/docs/introduce--docs&globals=locale:zh-CN)
- **API Guide:** [Pages / API Guide](https://shijistar.github.io/enum-plus/?path=/docs/api-guide--docs)
- **Recipes:** [Pages / Recipes](https://shijistar.github.io/enum-plus/?path=/docs/recipes--docs)
- **FAQ:** [Pages / FAQ](https://shijistar.github.io/enum-plus/?path=/docs/faq--docs)
- **Release Notes:** [docs/release-v3.md](./docs/release-v3.md)
- **Migration Guide:** [docs/migration-guide-v2-to-v3.md](./docs/migration-guide-v2-to-v3.md)

## Why enum-plus

Native enums are great for constants, but product code usually needs more at runtime:

- user-facing labels
- metadata such as color, icon, or permission
- lookup helpers like `label(value)` and `findBy(...)`
- UI-ready structures for Select, Menu, Table filters, and more
- localization support across real applications

`enum-plus` keeps the direct enum-style experience, then adds those runtime capabilities in one place.

## Quick example

```ts
import { Enum } from 'enum-plus';

const StatusEnum = Enum({
  Draft: { value: 'draft', label: 'Draft', color: 'default' },
  Review: { value: 'review', label: 'In Review', color: 'processing' },
  Published: { value: 'published', label: 'Published', color: 'success' },
});

StatusEnum.Draft; // 'draft'
StatusEnum.label('review'); // 'In Review'
StatusEnum.findBy('color', 'success')?.key; // 'Published'
StatusEnum.toList();
```

## Best fit

`enum-plus` is especially useful when you want one enum definition to power:

- business logic
- UI rendering
- localization
- metadata lookup
- framework-specific bindings through plugins

## Ecosystem

- [@enum-plus/plugin-antd](./packages/plugin-antd/README.md)
- [@enum-plus/plugin-react](./packages/plugin-react/README.md)
- [@enum-plus/plugin-i18next](./packages/plugin-i18next/README.md)
- [@enum-plus/plugin-react-i18next](./packages/plugin-react-i18next/README.md)
- [@enum-plus/plugin-vue-i18n](./packages/plugin-vue-i18n/README.md)
- [@enum-plus/plugin-next-international](./packages/plugin-next-international/README.md)

## Local development

```bash
npm install
npm run storybook
npm run build-storybook
```

## Support

If this project helps you, please consider giving it a [star on GitHub](https://github.com/shijistar/enum-plus) ⭐️
