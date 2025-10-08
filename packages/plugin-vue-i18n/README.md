<!-- markdownlint-disable MD001 MD009 MD033 MD041 -->

[English](./README.md) | [中文](./README.zh-CN.md) | [CHANGELOG](./CHANGELOG.md)

# @enum-plus/plugin-vue-i18n

[![npm version](https://img.shields.io/npm/v/@enum-plus/plugin-vue-i18n.svg)](https://www.npmjs.com/package/@enum-plus/plugin-vue-i18n)
[![license](https://img.shields.io/npm/l/@enum-plus/plugin-vue-i18n.svg)](https://www.npmjs.com/package/@enum-plus/plugin-vue-i18n)

> Integrates with [vue-i18n](https://vue-i18n.intlify.dev) to enable internationalization of enum labels.

## Introduction

`@enum-plus/plugin-vue-i18n` is a plugin for [enum-plus](https://github.com/shijistar/enum-plus) that automatically integrates with [vue-i18n](https://vue-i18n.intlify.dev) to achieve internationalization of enum labels. It allows you to use vue-i18n localization keys in your enum definitions, which are dynamically displayed as translated text for the current language.

> Note: This plugin requires Vue 3 and vue-i18n 9 or above. The `legacy` mode of vue-i18n is not supported.

## Installation

```bash
npm install @enum-plus/plugin-vue-i18n
```

Import the `@enum-plus/plugin-vue-i18n` plugin and install it in the entry file of your application:

```js
import i18nPlugin from '@enum-plus/plugin-vue-i18n';
import { Enum } from 'enum-plus';

Enum.install(i18nPlugin, {
  localize: {
    instance: i18n,
  },
});
```

## Plugin Options

When installing the plugin, you can pass a configuration object to set global options for the plugin:

```ts
Enum.install(i18nPlugin, {
  localize: {
    // Pass the global default i18n instance. If you want to use the enum's internationalization features in a non-component environment, you must pass in this instance
    instance: i18n,
    // Options to pass to the i18next.t method
    tOptions: {
      // Set the default value for the return value
      default: '-',
      // Other options supported by the i18next.t method
      // Please refer to https://vue-i18n.intlify.dev/api/general.html#translateoptions
    },
  },
});
```

`tOptions` also supports a function form to dynamically generate options, and can even directly return the final translated text.

```ts
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

```ts
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

const i18n = useI18n();
i18n.locale.value = 'zh-CN';
WeekEnum.label(1); // 星期一
WeekEnum.name; // 周
```
