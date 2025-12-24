<!-- markdownlint-disable MD001 MD009 MD033 MD041 -->

[English](./README.md) | [中文](./README.zh-CN.md) | [CHANGELOG](./CHANGELOG.md)

# @enum-plus/plugin-next-international

[![npm version](https://img.shields.io/npm/v/@enum-plus/plugin-next-international.svg)](https://www.npmjs.com/package/@enum-plus/plugin-next-international)
[![license](https://img.shields.io/npm/l/@enum-plus/plugin-next-international.svg)](https://www.npmjs.com/package/@enum-plus/plugin-next-international)

> Integrates [next-international](https://next-international.vercel.app) to achieve internationalization of enum labels

## Introduction

`@enum-plus/plugin-next-international` is a plugin for [enum-plus](https://github.com/shijistar/enum-plus) that automatically integrates with [next-international](https://next-international.vercel.app) to achieve internationalization of enum labels. It allows you to use next-international localization keys in your enum definitions, which are dynamically displayed as translated text for the current language.

> ⚠️ Please note that this plugin only supports client-side environments. It does not support server-side rendering, as next-international's server-side API only supports asynchronous internationalization resolution.

## Installation

```bash
npm install @enum-plus/plugin-next-international
```

Import the `@enum-plus/plugin-next-international` plugin and install it in the entry file of your application:

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

Wrap your application with `PatchedI18nProviderClient` from the plugin to ensure proper initialization of the plugin.

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

## Plugin Options

When installing the plugin, you can pass a configuration object to set global options for the plugin:

```ts
Enum.install(clientI18nPlugin, {
  localize: {
    /**
     * Localized output result, default is 'text'
     *
     * - `text`: Returns a plain text string that does not change with language
     * - `component`: Returns a React component instance that automatically updates the displayed
     *   content when the language is switched
     */
    mode: 'text',
  },
  isMatch: {
    defaultSearchField: 'label', // Default search field for isMatch method, default is 'label'
  },
});
```

## Basic Usage

### Enum Labels Respond to Language Changes

You can achieve internationalization of enum labels by using localization keys in the enum definition.

- **Using Text Mode (Default)**

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
const WeekEnum = Enum(
  {
    Monday: { value: 1, label: 'week.monday' },
    Tuesday: { value: 2, label: 'week.tuesday' },
  },
  {
    name: 'weekDays.name', // Optional enum type name
  }
);
WeekEnum.label(1); // Monday
WeekEnum.name; // Week

i18next.changeLanguage('zh-CN');
WeekEnum.label(1); // 星期一
WeekEnum.name; // 周
```

- **Using Component Mode**

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
    name: 'weekDays.name', // Optional enum type name
  }
);

WeekEnum.label(1); // A ReactElement, displaying "Monday", that updates on language change
WeekEnum.name; // A ReactElement, displaying "Week", that updates on language change

changeLanguage('zh-CN');
WeekEnum.label(1); // A ReactElement, displaying "星期一", that updates on language change
WeekEnum.name; // A ReactElement, displaying "周", that updates on language change
```

From the generated enum UI components, when the language changes, the labels will automatically update:

```tsx
import { Button, Select } from 'antd';
import { useChangeLocale } from './path/to/client';

const changeLanguage = useChangeLocale();

<Select options={WeekEnum.items} defaultValue={WeekEnum.Monday} />;
// Selected and displayed: Monday

<Button onClick={() => changeLanguage('zh-CN')}>切换到中文</Button>;

// When the button is clicked, the Select component will automatically update to display "星期一"
```

### Dropdown Search

In `component` mode, since the enum's `label` has become a component instance rather than a string type, it cannot be directly used for text search. You can use the `isMatch` or `isMatchCaseSensitive` methods to filter enum items.

```tsx
import { Select } from 'antd';

<Select options={WeekEnum.items} filterOption={WeekEnum.isMatch} />;
```

## Other API

### isMatch

The `isMatch` method is used to filter enum items based on a search text, supporting fuzzy matching of the enum item's `label`, ignoring case sensitivity.

<sup>**_[Method]_**</sup> &nbsp; `isMatch(searchText: string, item: EnumItem): boolean`

- Dropdown Search

```tsx
import { Select } from 'antd';

<Select options={WeekEnum.items} filterOption={WeekEnum.isMatch} />;
```

- Regular filtering

```ts
const results = WeekEnum.filter((item) => WeekEnum.isMatch('mon', item)); // Filters enum items whose label contains 'mon', ignoring case
```

### isMatchCaseSensitive

The `isMatchCaseSensitive` method is used to filter enum items based on a search text, supporting fuzzy matching of the enum item's `label`, with case sensitivity.

<sup>**_[Method]_**</sup> &nbsp; `isMatchCaseSensitive(searchText: string, item: EnumItem): boolean`

- Dropdown Search

```tsx
import { Select } from 'antd';

<Select options={WeekEnum.items} filterOption={WeekEnum.isMatchCaseSensitive} />;
```

- Regular filtering

```ts
const results = WeekEnum.filter((item) => WeekEnum.isMatchCaseSensitive('Mon', item)); // Filters enum items whose label contains 'Mon', with case sensitivity
```
