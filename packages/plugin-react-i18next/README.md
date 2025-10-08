<!-- markdownlint-disable MD001 MD009 MD033 MD041 -->

[English](./README.md) | [中文](./README.zh-CN.md) | [CHANGELOG](./CHANGELOG.md)

# @enum-plus/plugin-react-i18next

[![npm version](https://img.shields.io/npm/v/@enum-plus/plugin-react-i18next.svg)](https://www.npmjs.com/package/@enum-plus/plugin-react-i18next)
[![license](https://img.shields.io/npm/l/@enum-plus/plugin-react-i18next.svg)](https://www.npmjs.com/package/@enum-plus/plugin-react-i18next)

> Integrates with [react-i18next](https://react.i18next.com/getting-started) to enable internationalization of enum labels

## Introduction

`@enum-plus/plugin-react-i18next` is a plugin for [enum-plus](https://github.com/shijistar/enum-plus) that automatically integrates with [react-i18next](https://react.i18next.com/getting-started) to achieve internationalization of enum labels. It allows you to use i18next localization keys in your enum definitions, which are dynamically displayed as translated text for the current language.

> This plugin does not support automatic UI updates after switching languages, which requires integration with React framework. Please consider using the [@enum-plus/plugin-react](https://github.com/shijistar/enum-plus/tree/main/packages/plugin-react) plugin.

## Installation

```bash
npm install @enum-plus/plugin-react-i18next
```

Import the `@enum-plus/plugin-react-i18next` plugin and install it in the entry file of your application:

```js
import reactI18nextPlugin from '@enum-plus/plugin-react-i18next';
import { Enum } from 'enum-plus';

Enum.install(reactI18nextPlugin);
```

## Plugin Options

When installing the plugin, you can pass a configuration object to set global options for the plugin:

```ts
Enum.install(reactI18nextPlugin, {
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
Enum.install(reactI18nextPlugin, {
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

````ts
Enum.install(reactI18nextPlugin, {
  localize: {
    tOptions: (key) => {
      if (key === 'week.sunday') {
        return 'Sunday'; // Directly return the translated text
      }
      return instance.t(key); // Return the default translation in other cases
    },
  },
});

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
WeekEnum.name; // 周
````
