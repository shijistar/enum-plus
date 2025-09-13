<!-- markdownlint-disable MD001 MD009 MD033 MD041 -->

[English](./README.md) | [中文](./README.zh-CN.md) | [CHANGELOG](./CHANGELOG.md)

# enum-plus for Globalization with i18next

## 简介

`@enum-plus/i18next` 是 `enum-plus` 的一个插件，支持通过 [i18next](https://www.i18next.com/) 为枚举提供国际化支持，它允许你轻松地将枚举转换为多语言支持的文本，从而提升应用的国际化能力。

## 安装

```bash
npm install @enum-plus/i18next
```

在应用程序的入口文件中，导入 `@enum-plus/i18next` 插件并安装：

```js
import i18nextPlugin from '@enum-plus/i18next';
import { Enum } from 'enum-plus';

Enum.install(i18nextPlugin);
```

## 基本用法

可以通过在枚举定义中使用本地化键，来实现枚举标签的国际化。

```js
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

## 其它API

### 💎 &nbsp; filterItem

<sup>**_\[方法]_**</sup> &nbsp; `filterItem(searchText: string, item: EnumItem): boolean`

`filterItem` 方法用于根据搜索文本过滤枚举项，支持对枚举项的 `label` 进行模糊匹配，且忽略大小写。

> 此方法仅适用于`Enum.localize`返回非字符串的情况。例如，Enum.localize 在React框架下返回一个组件，以便能在切换语言后实时更新UI。在这种情况下，无法对枚举项的`label`进行字符串匹配，可以考虑使用此方法过滤枚举项。

- 常规过滤方式

```js
WeekEnum.items.filter((item) => WeekEnum.filterItem('Mon', item)); // 过滤出 label 中包含 'Mon' 的枚举项
```

- 下拉框搜索

```tsx
import { Select } from 'antd';

<Select options={WeekEnum.items} filterOption={WeekEnum.filterItem} />;
```

### 💎 &nbsp; filterItemCaseSensitive

<sup>**_\[方法]_**</sup> &nbsp; `filterItemCaseSensitive(searchText: string, item: EnumItem): boolean`

`filterItemCaseSensitive` 方法用于根据搜索文本过滤枚举项，支持对枚举项的 `label` 进行模糊匹配，且区分大小写。

> 此方法仅适用于`Enum.localize`返回非字符串的情况。例如，Enum.localize 在React框架下返回一个组件，以便能在切换语言后实时更新UI。在这种情况下，无法对枚举项的`label`进行字符串匹配，可以考虑使用此方法过滤枚举项。

- 常规过滤方式

```js
WeekEnum.items.filter((item) => WeekEnum.filterItemCaseSensitive('Mon', item)); // 过滤出 label 中包含 'Mon' 的枚举项
```

- 下拉框搜索

```tsx
import { Select } from 'antd';

<Select options={WeekEnum.items} filterOption={WeekEnum.filterItemCaseSensitive} />;
```
