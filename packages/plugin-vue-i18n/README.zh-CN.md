<!-- markdownlint-disable MD001 MD009 MD033 MD041 -->

[English](./README.md) | [中文](./README.zh-CN.md) | [CHANGELOG](./CHANGELOG.md)

# @enum-plus/plugin-vue-i18n

[![npm version](https://img.shields.io/npm/v/@enum-plus/plugin-vue-i18n.svg)](https://www.npmjs.com/package/@enum-plus/plugin-vue-i18n)
[![license](https://img.shields.io/npm/l/@enum-plus/plugin-vue-i18n.svg)](https://www.npmjs.com/package/@enum-plus/plugin-vue-i18n)

> 集成 [vue-i18n](https://vue-i18n.intlify.dev) 并实现枚举标签的国际化

## 简介

`@enum-plus/plugin-vue-i18n` 是 [enum-plus](https://github.com/shijistar/enum-plus) 的一个插件，自动集成 [vue-i18n](https://vue-i18n.intlify.dev) 实现枚举标签的国际化。它允许你在枚举定义中使用 vue-i18n 的本地化键，并动态显示为当前语言的翻译文本。当语言切换时，枚举标签也会相应自动更新。

> 注意：该插件要求 Vue 3 和 vue-i18n 9 及以上版本，不支持 vue-i18n 的 `legacy` 模式。

## 安装

```bash
npm install @enum-plus/plugin-vue-i18n
```

在应用程序的入口文件中，导入 `@enum-plus/plugin-vue-i18n` 插件并安装：

```js
import i18nPlugin from '@enum-plus/plugin-vue-i18n';
import { Enum } from 'enum-plus';

Enum.install(i18nPlugin, {
  localize: {
    instance: i18n,
  },
});
```

## 插件选项

安装插件时，可以传入一个配置对象，用于设置插件的全局选项：

```js
Enum.install(i18nPlugin, {
  localize: {
    // 传递全局默认的 i18n 实例。如果你想在非组件环境下使用枚举的国际化功能，必须传入该实例
    instance: i18n,
    // 传递给 i18next.t 方法的默认选项
    tOptions: {
      // 设置返回值的默认值
      default: '-',
      // 其它 i18next.t 方法支持的选项
      // 请参考 https://vue-i18n.intlify.dev/api/general.html#translateoptions
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

const i18n = useI18n();
i18n.locale.value = 'zh-CN';
WeekEnum.label(1); // 星期一
WeekEnum.name; // 周
```
