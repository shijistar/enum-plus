<!-- markdownlint-disable MD001 MD009 MD033 MD041 -->

[English](./README.md) | [中文](./README.zh-CN.md) | [CHANGELOG](./CHANGELOG.md)

# enum-plus for React

## Introduction

`@enum-plus/react` is a plugin for `enum-plus` that can be considered an advanced version of `@enum-plus/i18next`. It provides integration with [i18next](https://www.i18next.com/) and [react-i18next](https://react.i18next.com/getting-started). The plugin allows you to use i18next localization keys in enum definitions and dynamically display the translated text for the current language, making it easier and more efficient to use i18next in React applications.

It differs from the `@enum-plus/i18next` plugin in the following ways:

#### **@enum-plus/i18next**

- Suitable for any JavaScript project, returning labels as string types, making it suitable for use in various mainstream frameworks.
- Can be used directly for text search and other scenarios, such as using the `Array.includes` method to check if a label contains a certain substring, or binding to UI components like Select, where the search function works as expected.
- Does not listen for language changes; when the language changes, you need to manually re-render components.

#### **@enum-plus/react**

- Designed specifically for React applications, returning labels as React components that can be used directly in JSX.
- Listens for language changes; when the language changes, components automatically re-render without needing to refresh the page or manual intervention.
- Since the return value is not a string type, it cannot be directly used for text search and other scenarios. For example, the `Array.includes` method cannot be used to check if a label contains a certain substring, or when bound to UI components like Select, the search function may fail. To solve this problem, it is recommended to use the `filterItem` and `filterItemCaseSensitive` methods provided in `@enum-plus/i18next`.

## Installation

```bash
npm install @enum-plus/react
```

Import the `@enum-plus/react` plugin and install it in the entry file of your application:

- If you are using `i18next`:

```js
import { i18nextPlugin } from '@enum-plus/react';
import { Enum } from 'enum-plus';

Enum.install(i18nextPlugin);
```

- If you are using `react-i18next`:

```js
import { reactI18nextPlugin } from '@enum-plus/react';
import { Enum } from 'enum-plus';

Enum.install(reactI18nextPlugin);
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

WeekEnum.label(1); // Monday - ReactElement
WeekEnum.name; // Week - ReactElement

i18next.changeLanguage('zh-CN');
WeekEnum.label(1); // 星期一 - ReactElement
WeekEnum.name; // 星期 - ReactElement
```

Binding to UI components:

```tsx
import { Button, Select } from 'antd';
import { changeLanguage } from 'i18next';

<Select options={WeekEnum.items} defaultValue={WeekEnum.Monday} />;
// Selected and displayed: Monday

<Button onClick={() => changeLanguage('zh-CN')}>Switch Language</Button>;

// After switching languages, the selected item's text will automatically update to: 星期一
```
