<!-- markdownlint-disable MD001 MD009 MD033 MD041 -->

[English](./README.md) | [中文](./README.zh-CN.md) | [CHANGELOG](./CHANGELOG.md)

# enum-plus for Globalization with i18next

## Introduction

`@enum-plus/i18next` is a plugin for `enum-plus` that automatically integrates with [i18next](https://www.i18next.com/) to achieve internationalization of enum labels. It allows you to use i18next localization keys in your enum definitions, which are dynamically displayed as translated text for the current language.

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

## Plugin Options

When installing the plugin, you can pass a configuration object to set global options for the plugin:

```ts
Enum.use(i18nextPlugin, {
  localize: {
    // Set the i18next instance, defaults to the global i18next instance if necessary
    instance: i18next,
    // Options to pass to the i18next.t method
    tOptions: {
      // Set the namespace
      ns: 'my-namespace',
      // Set the default value for the return value
      defaultValue: '-',
      // Other options supported by the i18next.t method
      // Please refer to https://www.i18next.com/translation-function/essentials#overview-options
    },
  },
});
```

`tOptions` also supports a function form to dynamically generate options, and can even directly return the final translated text.

```ts
// Use function form to dynamically generate tOptions
Enum.use(i18nextPlugin, {
  localize: {
    tOptions: (key) => {
      if (key === 'week.sunday') {
        return { ns: 'my-namespace' };
      }
      return { ns: 'translation' }; // Default namespace
    },
  },
});

// Directly return translated text
Enum.use(i18nextPlugin, {
  localize: {
    tOptions: (key, instance) => {
      if (key === 'week.sunday') {
        return '周日'; // Directly return the custom translated text
      }
      return instance.t(key); // Use i18next instance to translate other keys
    },
  },
});
```

## Basic Usage

You can achieve internationalization of enum labels by using localization keys in the enum definition.

```js
import { Enum } from 'enum-plus';

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
