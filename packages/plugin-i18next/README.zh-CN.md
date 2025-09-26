<!-- markdownlint-disable MD001 MD009 MD033 MD041 -->

[English](./README.md) | [中文](./README.zh-CN.md) | [CHANGELOG](./CHANGELOG.md)

# enum-plus for Globalization with i18next

## 简介

`@enum-plus/i18next` 是 `enum-plus` 的一个插件，自动集成 [i18next](https://www.i18next.com/) 实现枚举标签的国际化。它允许你在枚举定义中使用 i18next 的本地化键，并动态显示为当前语言的翻译文本。

> 该插件不支持切换语言后自动更新 UI，这需要结合前端框架（如 React、Vue 等）来实现。请考虑使用 [@enum-plus/plugin-react](https://github.com/shijistar/enum-plus/tree/main/packages/plugin-react) 或 [@enum-plus/plugin-vue](https://github.com/shijistar/enum-plus/tree/main/packages/plugin-vue) 插件。

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

## 插件选项

安装插件时，可以传入一个配置对象，用于设置插件的全局选项：

```ts
Enum.install(i18nextPlugin, {
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
Enum.install(i18nextPlugin, {
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
Enum.install(i18nextPlugin, {
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
