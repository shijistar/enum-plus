<!-- markdownlint-disable MD001 MD009 MD033 MD041 -->

[English](./README.md) | [中文](./README.zh-CN.md) | [CHANGELOG](./CHANGELOG.md)

# enum-plus For Ant Design

## Introduction

`@enum-plus/i18next` is a plugin for `enum-plus` that supports internationalization of enums through [i18next](https://www.i18next.com/). It allows you to easily convert enums into multi-language supported text, enhancing the internationalization capabilities of your application.

## Installation

```bash
npm install @enum-plus/i18next
```

Import the `@enum-plus/i18next` plugin and install it in the entry file of your application:

```js
import i18nextPlugin from '@enum-plus/i18next';
import { Enum } from 'enum-plus';

Enum.use(i18nextPlugin);
```

## Basic Usage

You can achieve internationalization of enum labels by using localization keys in the enum definition.

```js
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
WeekEnum.name; // 星期
```

## Other APIs

### 💎 &nbsp; filterItem

<sup>**_\[F]_**</sup> &nbsp; `filterItem(searchText: string, item: EnumItem): boolean`

The `filterItem` method is used to filter enum items based on search text, supporting fuzzy matching of the `label` of enum items, and ignoring case sensitivity.

> This method is only applicable when `Enum.localize` returns a non-string value. For example, in the React framework, `Enum.localize` returns a component to enable real-time UI updates when switching languages. In this case, string matching of the `label` of enum items is not possible, and you can consider using this method to filter enum items.

- Regular filtering method

```js
WeekEnum.items.filter((item) => WeekEnum.filterItem('Mon', item)); // Filters enum items whose label contains 'Mon'
```

- Dropdown search

```tsx
import { Select } from 'antd';

<Select options={WeekEnum.items} filterOption={WeekEnum.filterItem} />;
```

### 💎 &nbsp; filterItemCaseSensitive

<sup>**_\[F]_**</sup> &nbsp; `filterItemCaseSensitive(searchText: string, item: EnumItem): boolean`

The `filterItemCaseSensitive` method is similar to `filterItem`, but it performs case-sensitive matching.

> This method is only applicable when `Enum.localize` returns a non-string value. For example, in the React framework, `Enum.localize` returns a component to enable real-time UI updates when switching languages. In this case, string matching of the `label` of enum items is not possible, and you can consider using this method to filter enum items.

- Regular filtering method

```js
WeekEnum.items.filter((item) => WeekEnum.filterItemCaseSensitive('Mon', item)); // Filters enum items whose label contains 'Mon' (case-sensitive)
```

- Dropdown search

```tsx
import { Select } from 'antd';

<Select options={WeekEnum.items} filterOption={WeekEnum.filterItemCaseSensitive} />;
```
