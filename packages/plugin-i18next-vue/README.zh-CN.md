<!-- markdownlint-disable MD001 MD009 MD033 MD041 -->

[English](./README.md) | [中文](./README.zh-CN.md) | [CHANGELOG](./CHANGELOG.md)

# @enum-plus/plugin-i18next-vue

[![npm version](https://img.shields.io/npm/v/@enum-plus/plugin-i18next-vue.svg)](https://www.npmjs.com/package/@enum-plus/plugin-i18next-vue)
[![license](https://img.shields.io/npm/l/@enum-plus/plugin-i18next-vue.svg)](https://www.npmjs.com/package/@enum-plus/plugin-i18next-vue)

> 集成 [i18next-vue](https://i18next.github.io/i18next-vue) 并实现枚举标签的国际化

## 简介

`@enum-plus/plugin-i18next-vue` 是 [enum-plus](https://github.com/shijistar/enum-plus) 的一个插件，自动集成 [i18next-vue](https://i18next.github.io/i18next-vue) 实现枚举标签的国际化。它允许你在枚举定义中使用 i18next 的本地化键，并动态显示为当前语言的翻译文本。当语言切换时，枚举标签也会相应自动更新。

## 安装

```bash
npm install @enum-plus/plugin-i18next-vue
```

在应用程序的入口文件中，导入 `@enum-plus/plugin-i18next-vue` 插件并安装：

```js
import i18nPlugin from '@enum-plus/plugin-i18next-vue';
import { Enum } from 'enum-plus';

Enum.install(i18nPlugin);
```

## 插件选项

安装插件时，可以传入一个配置对象，用于设置插件的全局选项：

```js
Enum.install(i18nPlugin, {
  localize: {
    // 设置 useTranslation 方法的选项
    useTranslationOptions: {
      // 设置键值前缀
      keyPrefix: 'foo',
      // 其它传递给 useTranslation 的选项
      // 请参考 https://i18next.github.io/i18next-vue/guide/composition-api.html#customize-t
    },
    // 传递给 i18next.t 方法的默认选项
    tOptions: {
      // 设置命名空间
      ns: 'my-namespace',
      // 设置返回值的默认值
      defaultValue: '-',
      // 其它 i18next.t 方法支持的选项
      // 请参考 https://www.i18next.com/translation-function/essentials#overview-options
    },
  },
});
```

`tOptions` 还支持函数形式，以便动态生成选项，

```js
// 使用函数形式动态生成 tOptions
Enum.install(i18nPlugin, {
  localize: {
    tOptions: (key) => {
      if (key === 'week.sunday') {
        return { ns: 'my-namespace' };
      }
      return { ns: 'translation' }; // 默认命名空间
    },
  },
});
```

你甚至可以在 `tOptions` 中直接返回一个字符串，作为最终的翻译文本，以完全控制 `localize` 方法的行为。

```js
Enum.install(i18nPlugin, {
  localize: {
    tOptions: (key) => {
      if (key === 'week.sunday') {
        return '周日'; // 直接返回翻译文本
      }
      return instance.t(key); // 其它情况返回默认翻译
    },
  },
});
```

## 基本用法

可以通过在枚举定义中使用本地化键，来实现枚举标签的国际化。

```js
import { Enum } from 'enum-plus';
import { changeLanguage } from 'i18next';

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

i18next.changeLanguage('zh-CN');
WeekEnum.label(1); // 星期一
WeekEnum.name; // 周
```

> **注意**：枚举标签的国际化依赖于 i18next-vue 的 `useTranslation` 方法，因此请确保在 Vue 组件的环境中使用枚举标签，以便它们能够正确响应语言变化。如果在非 Vue 组件环境中，例如 `setTimeout` 的回调函数，枚举标签也可以正常工作，会自动退回到使用 i18next 的默认实例进行翻译。但此时切换语言后不会更新枚举标签，你需要自己监听 i18next 的语言变化事件，并手动更新组件状态。
