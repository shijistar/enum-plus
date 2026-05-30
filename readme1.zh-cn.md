<!-- markdownlint-disable MD001 MD009 MD033 MD041 -->

[English](./README.md) | [中文](./README.zh-CN.md) | [CHANGELOG](./CHANGELOG.md)

<p align="center">
  <a href="https://github.com/shijistar/enum-plus" target="blank">
    <img src="./public/enum-plus.svg" width="240" alt="enum-plus" />
  </a>
</p>

<p align="center">
  <strong>面向 TypeScript / JavaScript 的运行时友好枚举方案。</strong>
</p>
<br/>

[![npm latest version](https://img.shields.io/npm/v/enum-plus.svg?cacheSeconds=86400)](https://www.npmjs.com/package/enum-plus)
[![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/enum-plus?logo=javascript&label=Minzipped&color=44cc11&cacheSeconds=86400)](https://www.npmjs.com/package/enum-plus?activeTab=code)
[![npm downloads](https://img.shields.io/npm/dm/enum-plus.svg?logo=rolldown&logoColor=fd7b24&label=Downloads&color=007ec6&cacheSeconds=86400)](https://www.npmjs.com/package/enum-plus)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/shijistar/enum-plus)
![GitHub License](https://img.shields.io/github/license/shijistar/enum-plus?label=License&color=ff8000&cacheSeconds=86400)

> README 现在主要承担 GitHub 落地页角色。完整的双语说明、API 导览和可交互演示已经迁移到 GitHub Pages。

## 文档与演示

- **English Pages:** [Introduce](https://shijistar.github.io/enum-plus/?path=/docs/introduce--docs)
- **中文 Pages：** [介绍](https://shijistar.github.io/enum-plus/?path=/docs/introduce--docs&globals=locale:zh-CN)
- **API Guide：** [Pages / API Guide](https://shijistar.github.io/enum-plus/?path=/docs/api-guide--docs&globals=locale:zh-CN)
- **Recipes：** [Pages / Recipes](https://shijistar.github.io/enum-plus/?path=/docs/recipes--docs&globals=locale:zh-CN)
- **FAQ：** [Pages / FAQ](https://shijistar.github.io/enum-plus/?path=/docs/faq--docs&globals=locale:zh-CN)
- **发布说明：** [docs/release-v3.zh-CN.md](./docs/release-v3.zh-CN.md)
- **迁移指南：** [docs/migration-guide-v2-to-v3.zh-CN.md](./docs/migration-guide-v2-to-v3.zh-CN.md)

## 为什么用 enum-plus

原生 enum 很适合表达常量，但真实业务的运行时需求往往更多：

- 面向用户的显示名称
- 颜色、图标、权限等元数据
- `label(value)`、`findBy(...)` 这样的查询助手
- 直接生成 Select、Menu、Table filters 等 UI 所需结构
- 能接入国际化体系，减少重复映射逻辑

`enum-plus` 保留了直观的枚举式使用体验，并把这些运行时能力收敛到同一个对象里。

## 快速示例

```ts
import { Enum } from 'enum-plus';

const StatusEnum = Enum({
  Draft: { value: 'draft', label: '草稿', color: 'default' },
  Review: { value: 'review', label: '审核中', color: 'processing' },
  Published: { value: 'published', label: '已发布', color: 'success' },
});

StatusEnum.Draft; // 'draft'
StatusEnum.label('review'); // '审核中'
StatusEnum.findBy('color', 'success')?.key; // 'Published'
StatusEnum.toList();
```

## 特别适合的场景

当你希望一份 enum 定义同时服务于这些事情时，`enum-plus` 会很合适：

- 业务逻辑判断
- UI 回显
- 国际化
- 元数据读取
- 通过插件与具体框架集成

## 插件生态

- [@enum-plus/plugin-antd](./packages/plugin-antd/README.zh-CN.md)
- [@enum-plus/plugin-react](./packages/plugin-react/README.zh-CN.md)
- [@enum-plus/plugin-i18next](./packages/plugin-i18next/README.zh-CN.md)
- [@enum-plus/plugin-react-i18next](./packages/plugin-react-i18next/README.zh-CN.md)
- [@enum-plus/plugin-vue-i18n](./packages/plugin-vue-i18n/README.zh-CN.md)
- [@enum-plus/plugin-next-international](./packages/plugin-next-international/README.zh-CN.md)

## 本地开发

```bash
npm install
npm run storybook
npm run build-storybook
```

## 支持

如果这个项目对你有帮助，欢迎给它一个 [GitHub Star](https://github.com/shijistar/enum-plus) ⭐️
