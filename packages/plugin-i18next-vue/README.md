<!-- markdownlint-disable MD001 MD009 MD033 MD041 -->

[English](./README.md) | [中文](./README.zh-CN.md) | [CHANGELOG](./CHANGELOG.md)

# @enum-plus/plugin-i18next-vue

[![npm version](https://img.shields.io/npm/v/@enum-plus/plugin-i18next-vue.svg)](https://www.npmjs.com/package/@enum-plus/plugin-i18next-vue)
[![license](https://img.shields.io/npm/l/@enum-plus/plugin-i18next-vue.svg)](https://www.npmjs.com/package/@enum-plus/plugin-i18next-vue)

> Integrates with [i18next-vue](https://i18next.github.io/i18next-vue) to enable internationalization of enum labels.

## Introduction

`@enum-plus/plugin-i18next-vue` is a plugin for [enum-plus](https://github.com/shijistar/enum-plus) that automatically integrates with [i18next-vue](https://i18next.github.io/i18next-vue) to achieve internationalization of enum labels. It allows you to use i18next localization keys in your enum definitions, which are dynamically displayed as translated text for the current language.

## Installation

```bash
npm install @enum-plus/plugin-i18next-vue
```

Import the `@enum-plus/plugin-i18next-vue` plugin and install it in the entry file of your application:

```js
import i18nPlugin from '@enum-plus/plugin-i18next-vue';
import { Enum } from 'enum-plus';

Enum.install(i18nPlugin);
```

## Plugin Options

When installing the plugin, you can pass a configuration object to set global options for the plugin:

```js
Enum.install(i18nPlugin, {
  localize: {
    // Set options for the internal useTranslation call
    useTranslationOptions: {
      // Set the key prefix
      keyPrefix: 'foo',
      // Other options to pass to useTranslation
      // Please refer to https://i18next.github.io/i18next-vue/guide/composition-api.html#customize-t
    },
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

```js
// Use function form to dynamically generate tOptions
Enum.install(i18nPlugin, {
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

```js
Enum.install(i18nPlugin, {
  localize: {
    tOptions: (key) => {
      if (key === 'week.sunday') {
        return 'Sunday'; // Directly return the translated text
      }
      return instance.t(key); // Return the default translation in other cases
    },
  },
});
```

## Basic Usage

You can achieve internationalization of enum labels by using localization keys in the enum definition.

```js
import { Enum } from 'enum-plus';
import { changeLanguage } from 'i18next';

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

changeLanguage('zh-CN');
WeekEnum.label(1); // 星期一
WeekEnum.name; // 周
```

> **Note**: The internationalization of enum labels relies on the `useTranslation` method from i18next-vue. Therefore, please ensure that you use enum labels within the context of Vue components so that they can correctly respond to language changes. If you use enum labels outside of Vue component contexts, such as in the callback function of `setTimeout`, the enum labels will still work correctly by falling back to the default i18next instance for translation. However, in this case, changing the language will not update the enum labels automatically; you will need to listen to i18next's language change events and manually update the component state.
