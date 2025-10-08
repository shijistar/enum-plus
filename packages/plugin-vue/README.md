<!-- markdownlint-disable MD001 MD009 MD033 MD041 -->

[English](./README.md) | [中文](./README.zh-CN.md) | [CHANGELOG](./CHANGELOG.md)

# enum-plus for Vue

## Introduction

`@enum-plus/plugin-vue` is a plugin for [enum-plus](https://github.com/shijistar/enum-plus) that can be considered an advanced version of [@enum-plus/plugin-i18next](https://github.com/shijistar/enum-plus/tree/main/packages/plugin-i18next). It provides integration with [i18next-vue](https://i18next.github.io/i18next-vue) and [vue-i18n](https://vue-i18n.intlify.dev). The plugin allows you to use i18next localization keys in enum definitions and dynamically display the translated text for the current language, making it easier and more efficient to use i18next in Vue applications. It automatically updates the UI after switching languages without need of refreshing the page.

It differs from the `@enum-plus/plugin-i18next` plugin in the following ways:

#### **@enum-plus/plugin-i18next**

- Suitable for any JavaScript project, returning labels as string types, making it suitable for use in various mainstream frameworks.
- Can be used directly for text search and other scenarios, such as using the `Array.includes` method to check if a label contains a certain substring, or binding to UI components like Select, where the search function works as expected.
- Does not listen for language changes; when the language changes, you need to manually re-render components.

#### **@enum-plus/plugin-vue**

- Designed specifically for Vue applications, returning labels as Vue components that can be used directly in templates.
- Listens for language changes; when the language changes, components automatically re-render without needing to refresh the page or manual intervention.
- Since the return value is not a string type, it cannot be directly used for text search and other scenarios. For example, the `Array.includes` method cannot be used to check if a label contains a certain substring, or when bound to UI components like Select, the search function may fail. To solve this problem, it is recommended to use the [isMatch](#-ismatch) or [isMatchCaseSensitive](#-ismatchcasesensitive) method.

## Installation

```bash
npm install @enum-plus/plugin-vue
```

Import the `@enum-plus/plugin-vue` plugin and install it in the entry file of your application:

- If you are using `i18next-vue`:

```js
import { i18nextVuePlugin } from '@enum-plus/plugin-vue';
import { Enum } from 'enum-plus';

Enum.install(i18nextVuePlugin);
```

- If you are using `vue-i18n`:

```js
import { vueI18nPlugin } from '@enum-plus/plugin-vue';
import { Enum } from 'enum-plus';

Enum.install(vueI18nPlugin);
```

## Plugin Options

When installing the plugin, you can pass a configuration object to set global options for the plugin:

- **i18nextVuePlugin**

```ts
Enum.install(i18nextVuePlugin, {
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
    defaultSearchField: 'label', // Set the field used for searching in isMatch and isMatchCaseSensitive methods, defaults to 'label'
  },
});
```

- **vueI18nPlugin**

```ts
Enum.install(vueI18nPlugin, {
  localize: {
    // Set the useTranslation hook, defaults to the global useTranslation hook if necessary
    useTranslation: useTranslation,
    // Options to pass to the useTranslation hook
    useTranslationOptions: {
      // Set the namespace
      ns: 'my-namespace',
      // Other options supported by the useTranslation hook
      // Please refer to https://www.i18next.com/translation-function/essentials#overview-options
    },
    // Options to pass to the i18next.t method
    tOptions: {
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
Enum.install(i18nextPlugin, {
  localize: {
    tOptions: (key) => {
      if (key === 'week.sunday') {
        return { ns: 'my-namespace' };
      }
      return { ns: 'translation' }; // Default namespace
    },
  },
});
```

You can even return a string directly in `tOptions` as the final translated text to have full control over the behavior of the `localize` method.

```ts
Enum.install(i18nextPlugin, {
  localize: {
    tOptions: (key) => {
      if (key === 'week.sunday') {
        return '周日'; // Directly return the translated text
      }
      return instance.t(key); // Return the default translation in other cases
    },
  },
});
```

## Usage

### Enum Labels Respond to Language Changes

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

WeekEnum.label(1); // Monday - VueComponent
WeekEnum.name; // Week - VueComponent

i18next.changeLanguage('zh-CN');
WeekEnum.label(1); // 星期一 - VueComponent
WeekEnum.name; // 星期 - VueComponent
```

For the UI components generated from the enum, the labels will automatically update when the language changes:

```tsx
import { Button, Select } from 'antd';
import { changeLanguage } from 'i18next';

<Select options={WeekEnum.items} defaultValue={WeekEnum.Monday} />;
// Selected and displayed: Monday

<Button onClick={() => changeLanguage('zh-CN')}>Switch Language</Button>;

// After switching languages, the selected item's text will automatically update to: 星期一
```

### Dropdown Search

Since the `label` of the enum has become a component instance rather than a string type, it cannot be directly used for text search. You can use the `isMatch` or `isMatchCaseSensitive` method to filter enum items.

```tsx
import { Select } from 'antd';

<Select options={WeekEnum.items} filterOption={WeekEnum.isMatch} />;
```

## Other APIs

### 💎 isMatch

<sup>**_\[F]_**</sup> &nbsp; `isMatch(searchText: string, item: EnumItem): boolean`

The `isMatch` method is used to filter enum items based on search text, supporting fuzzy matching of the `label` of enum items, and ignoring case sensitivity.

> This method is only applicable when `Enum.localize` returns a non-string value. For example, in the Vue framework, `Enum.localize` returns a component to enable real-time UI updates when switching languages. In this case, string matching of the `label` of enum items is not possible, and you can consider using this method to filter enum items.

- Dropdown search

```tsx
import { Select } from 'antd';

<Select options={WeekEnum.items} filterOption={WeekEnum.isMatch} />;
```

- Regular filtering method

```js
WeekEnum.items.filter((item) => WeekEnum.isMatch('Mon', item)); // Filters enum items whose label contains 'Mon'
```

### 💎 isMatchCaseSensitive

<sup>**_\[F]_**</sup> &nbsp; `isMatchCaseSensitive(searchText: string, item: EnumItem): boolean`

The `isMatchCaseSensitive` method is similar to `isMatch`, but it performs case-sensitive matching.

> This method is only applicable when `Enum.localize` returns a non-string value. For example, in the Vue framework, `Enum.localize` returns a component to enable real-time UI updates when switching languages. In this case, string matching of the `label` of enum items is not possible, and you can consider using this method to filter enum items.

- Dropdown search

```tsx
import { Select } from 'antd';

<Select options={WeekEnum.items} filterOption={WeekEnum.isMatchCaseSensitive} />;
```

- Regular filtering

```js
WeekEnum.items.filter((item) => WeekEnum.isMatch('mon', item)); // Filters enum items whose label contains 'mon' (case-sensitive)
```
