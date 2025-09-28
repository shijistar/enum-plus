<!-- markdownlint-disable MD001 MD009 MD033 MD041 -->

[English](./README.md) | [中文](./README.zh-CN.md) | [CHANGELOG](./CHANGELOG.md)

# enum-plus for Globalization with i18next

## 简介

`@enum-plus/plugin-react-i18next` 是 [enum-plus](https://github.com/shijistar/enum-plus) 的一个插件，自动集成 [react-i18next](https://react.i18next.com/getting-started) 实现枚举标签的国际化。它允许你在枚举定义中使用 i18next 的本地化键，并动态显示为当前语言的翻译文本。

> 该插件不支持切换语言后自动更新 UI，这需要结合前端框架（如 React、Vue 等）来实现。请考虑使用 [@enum-plus/plugin-react](https://github.com/shijistar/enum-plus/tree/main/packages/plugin-react) 或 [@enum-plus/plugin-vue](https://github.com/shijistar/enum-plus/tree/main/packages/plugin-vue) 插件。

## 安装

```bash
npm install @enum-plus/plugin-react-i18next
```

在应用程序的入口文件中，导入 `@enum-plus/plugin-react-i18next` 插件并安装：

```js
import reactI18nextPlugin from '@enum-plus/plugin-react-i18next';
import { Enum } from 'enum-plus';

Enum.install(reactI18nextPlugin);
```

## 插件选项

安装插件时，可以传入一个配置对象，用于设置插件的全局选项：

```ts
Enum.install(reactI18nextPlugin, {
  localize: {
    // 设置 i18next 实例，如果有必要，默认为全局的 i18next 实例
    instance: i18next,
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

```ts
// 使用函数形式动态生成 tOptions
Enum.install(reactI18nextPlugin, {
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

```ts
Enum.install(reactI18nextPlugin, {
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

i18next.changeLanguage('zh-CN');
WeekEnum.label(1); // 星期一
WeekEnum.name; // 星期
```
