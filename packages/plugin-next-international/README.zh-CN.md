<!-- markdownlint-disable MD001 MD009 MD033 MD041 -->

[English](./README.md) | [中文](./README.zh-CN.md) | [CHANGELOG](./CHANGELOG.md)

# @enum-plus/plugin-next-international

[![npm version](https://img.shields.io/npm/v/@enum-plus/plugin-next-international.svg)](https://www.npmjs.com/package/@enum-plus/plugin-next-international)
[![license](https://img.shields.io/npm/l/@enum-plus/plugin-next-international.svg)](https://www.npmjs.com/package/@enum-plus/plugin-next-international)

> 集成 [next-international](https://next-international.vercel.app) 并实现枚举标签的国际化

## 简介

`@enum-plus/plugin-next-international` 是 [enum-plus](https://github.com/shijistar/enum-plus) 的一个插件，自动集成 [next-international](https://next-international.vercel.app) 实现枚举标签的国际化。它允许你在枚举定义中使用 next-international 的本地化键，并动态显示为当前语言的翻译文本。

> ⚠️ 请注意，该插件仅支持在客户端环境。不支持在服务端渲染，因为 next-international 的服务端 API 仅支持异步解析国际化。

## 安装

```bash
npm install @enum-plus/plugin-next-international
```

在应用程序的入口文件中，导入 `@enum-plus/plugin-next-international` 插件并安装：

_index.js_

```js
import { clientI18nPlugin } from '@enum-plus/plugin-next-international';
import { Enum } from 'enum-plus';

Enum.install(clientI18nPlugin);
```

_i18n/client.ts_

```js
'use client';

import { createI18nClient } from 'next-international/client';

export const i18nClient = createI18nClient({
  'en-US': () => import('./locales/en-US.json'),
  'zh-CN': () => import('./locales/zh-CN.json'),
});

export const { useI18n, useScopedI18n, I18nProviderClient } = i18nClient;
```

_app.tsx_

将应用程序包裹在来自插件的 `PatchedI18nProviderClient` 中，以确保正确初始化插件。

```tsx
import { PatchedI18nProviderClient } from '@enum-plus/plugin-next-international';
import { i18nClient } from './i18n/client';

export default function App() {
  return (
    <PatchedI18nProviderClient locale="en-US" I18n={i18nClient}>
      Hello enum-plus!
    </PatchedI18nProviderClient>
  );
}
```

## 插件选项

安装插件时，可以传入一个配置对象，用于设置插件的全局选项：

```ts
Enum.install(clientI18nPlugin, {
  localize: {
    /**
     * 本地化输出结果，默认为 'text'
     *
     * - `text`: 返回纯文本字符串，不会随语言变化而变化
     * - `component`: 返回 React 组件实例，切换语言后会自动更新显示内容
     */
    mode: 'text',
  },
  isMatch: {
    defaultSearchField: 'label', // isMatch 方法的默认搜索字段，默认为 'label'
  },
});
```

## 用法

### 枚举标签响应语言的变化

可以通过在枚举定义中使用本地化键，来实现枚举标签的国际化。

- **使用文本模式（默认）**

```js
import { clientI18nPlugin } from '@enum-plus/plugin-next-international';
import { Enum } from 'enum-plus';
import { useChangeLocale } from './path/to/client';

// index.js
Enum.install(clientI18nPlugin, {
  localize: {
    mode: 'text',
  },
});

// SomeComponent.js
const changeLanguage = useChangeLocale();
const WeekEnum = Enum(
  {
    Monday: { value: 1, label: 'week.monday' },
    Tuesday: { value: 2, label: 'week.tuesday' },
  },
  {
    name: 'weekDays.name', // 枚举类型名称，可选
  }
);

WeekEnum.label(1); // Monday
WeekEnum.name; // Week

changeLanguage('zh-CN');
WeekEnum.label(1); // 星期一
WeekEnum.name; // 周
```

- **使用组件模式**

```js
import { clientI18nPlugin } from '@enum-plus/plugin-next-international';
import { Enum } from 'enum-plus';
import { useChangeLocale } from './path/to/client';

// index.js
Enum.install(clientI18nPlugin, {
  localize: {
    mode: 'component',
  },
});

// SomeComponent.js
const changeLanguage = useChangeLocale();
const WeekEnum = Enum(
  {
    Monday: { value: 1, label: 'week.monday' },
    Tuesday: { value: 2, label: 'week.tuesday' },
  },
  {
    name: 'weekDays.name', // 枚举类型名称，可选
  }
);

WeekEnum.label(1); // React组件，显示为 Monday，可自动响应语言变化
WeekEnum.name; // React组件，显示为 Week，可自动响应语言变化

changeLanguage('zh-CN');
WeekEnum.label(1); // React组件，显示为 星期一，可自动响应语言变化
WeekEnum.name; // React组件，显示为 周，可自动响应语言变化
```

从枚举生成的UI组件，当语言变化时，标签会自动更新：

```tsx
import { Button, Select } from 'antd';
import { useChangeLocale } from './path/to/client';

const changeLanguage = useChangeLocale();

<Select options={WeekEnum.items} defaultValue={WeekEnum.Monday} />;
// 选中并显示: Monday

<Button onClick={() => changeLanguage('zh-CN')}>切换语言</Button>;

// 切换语言后，选中项的文本会自动更新为: 星期一
```

### 下拉框搜索

在 `组件` 模式下，由于枚举的 `label` 已经变成了组件实例，而不是字符串类型，故无法直接用于文本搜索。可以使用 `isMatch` 或 `isMatchCaseSensitive` 方法来实现对枚举项的过滤。

```tsx
import { Select } from 'antd';

<Select options={WeekEnum.items} filterOption={WeekEnum.isMatch} />;
```

## 其它API

### 💎 isMatch

<sup>**_\[方法]_**</sup> &nbsp; `isMatch(searchText: string, item: EnumItem): boolean`

`isMatch` 方法用于根据搜索文本过滤枚举项，支持对枚举项的 `label` 进行模糊匹配，且忽略大小写。

- 下拉框搜索

```tsx
import { Select } from 'antd';

<Select options={WeekEnum.items} filterOption={WeekEnum.isMatch} />;
```

- 常规过滤的用法

```js
WeekEnum.items.filter((item) => WeekEnum.isMatch('Mon', item)); // 过滤出 label 中包含 'Mon' 的枚举项
```

### 💎 isMatchCaseSensitive

<sup>**_\[方法]_**</sup> &nbsp; `isMatchCaseSensitive(searchText: string, item: EnumItem): boolean`

`isMatchCaseSensitive` 方法用于根据搜索文本过滤枚举项，支持对枚举项的 `label` 进行模糊匹配，且区分大小写。

- 下拉框搜索

```tsx
import { Select } from 'antd';

<Select options={WeekEnum.items} filterOption={WeekEnum.isMatchCaseSensitive} />;
```

- 常规过滤用法

```js
WeekEnum.items.filter((item) => WeekEnum.isMatch('mon', item)); // 过滤出 label 中包含 'mon' 的枚举项 (区分大小写)
```
