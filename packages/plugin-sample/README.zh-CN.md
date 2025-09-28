<!-- markdownlint-disable MD001 MD009 MD033 MD041 -->

[English](./README.md) | [中文](./README.zh-CN.md) | [CHANGELOG](./CHANGELOG.md)

# enum-plus for 示例插件

## 简介

`@enum-plus/plugin-sample` 是 [enum-plus](https://github.com/shijistar/enum-plus) 的一个插件，添加了一个示例方法到枚举中，允许更方便地操作和使用枚举值。该插件旨在增强应用程序中枚举的功能。

## 安装

```bash
npm install @enum-plus/plugin-sample
```

在应用程序的入口文件中，导入 `@enum-plus/plugin-sample` 插件并安装：

```js
import samplePlugin from '@enum-plus/plugin-sample';
import { Enum } from 'enum-plus';

Enum.install(samplePlugin);
```

## 插件选项

安装插件时，可以传入一个配置对象，用于设置插件的全局选项：

```ts
Enum.install(samplePlugin, {
  foo: 'bar', // 示例选项
});
```

## 基本用法

您可以在任何枚举实例上使用插件添加的 `sample` 方法：

```js
import { Enum } from 'enum-plus';

const WeekEnum = Enum({
  Monday: { value: 1, label: 'week.monday' },
  Tuesday: { value: 2, label: 'week.tuesday' },
});

WeekEnum.sample(); // 示例方法的用法
```
