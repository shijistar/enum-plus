<!-- markdownlint-disable MD001 MD009 MD033 MD041 -->

[English](./README.md) | [中文](./README.zh-CN.md) | [CHANGELOG](./CHANGELOG.md)

# enum-plus for React

## 简介

`@enum-plus/react` 是 `enum-plus` 的一个插件，可以认为是`@enum-plus/i18next` 的进阶版本。它提供了 [i18next](https://www.i18next.com/) 和 [react-i18next](https://react.i18next.com/getting-started) 两个版本的插件。插件允许你在枚举定义中使用 i18next 的本地化键，并动态显示为当前语言的翻译文本，使得在 React 应用中使用 i18next 变得更加简单和高效。

它与 `@enum-plus/i18next` 插件的区别在于：

#### **@enum-plus/i18next**

- 适用于任何 JavaScript 项目，返回的标签是字符串类型，适合在各种主流框架中使用。
- 可以直接用于文本搜索等场景，例如，`Array.includes` 方法可以用于检查标签是否包含某个子字符串，或者绑定到Select等UI组件，搜索功能可以正常工作。
- 缺点是无法监听语言变化，当语言变化时，需要手动重新渲染组件。

#### **@enum-plus/react**

- 专为 React 应用设计，返回的标签是 React 组件，可以直接在 JSX 中使用。
- 监听语言变化，当语言变化时，组件会自动重新渲染，无需刷新页面或手动干预。
- 由于返回值不是字符串类型，因此无法直接用于文本搜索等场景。例如，`Array.includes` 方法无法用于检查标签是否包含某个子字符串，或者绑定到Select等UI组件，可能搜索功能会失效。为了解决这个问题，建议使用 `@enum-plus/i18next` 中提供的 `filterItem` 和 `filterItemCaseSensitive` 方法。

## 安装

```bash
npm install @enum-plus/react
```

在应用程序的入口文件中，导入 `@enum-plus/react` 插件并安装：

- 如果你使用 `i18next`：

```js
import { i18nextPlugin } from '@enum-plus/react';
import { Enum } from 'enum-plus';

Enum.install(i18nextPlugin);
```

- 如果你使用 `react-i18next`：

```js
import { reactI18nextPlugin } from '@enum-plus/react';
import { Enum } from 'enum-plus';

Enum.install(reactI18nextPlugin);
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

WeekEnum.label(1); // Monday - ReactElement
WeekEnum.name; // Week - ReactElement

i18next.changeLanguage('zh-CN');
WeekEnum.label(1); // 星期一 - ReactElement
WeekEnum.name; // 星期 - ReactElement
```

绑定到UI组件：

```tsx
import { Button, Select } from 'antd';
import { changeLanguage } from 'i18next';

<Select options={WeekEnum.items} defaultValue={WeekEnum.Monday} />;
// 选中并显示: Monday

<Button onClick={() => changeLanguage('zh-CN')}>切换语言</Button>;

// 切换语言后，选中项的文本会自动更新为: 星期一
```
