<!-- markdownlint-disable MD001 MD009 MD033 MD041 -->

[English](./README.md) | [中文](./README.zh-CN.md) | [CHANGELOG](./CHANGELOG.md)

# enum-plus for Sample Plugin

## Introduction

`@enum-plus/sample` is a plugin for `enum-plus` that adds a sample method to enums, allowing for easier manipulation and usage of enum values. This plugin is designed to enhance the functionality of enums in your application.

## Installation

```bash
npm install @enum-plus/sample
```

Import the `@enum-plus/sample` plugin and install it in the entry file of your application:

```js
import samplePlugin from '@enum-plus/sample';
import { Enum } from 'enum-plus';

Enum.use(samplePlugin);
```

## Plugin Options

When installing the plugin, you can pass a configuration object to set global options for the plugin:

```ts
Enum.use(samplePlugin, {
  foo: 'bar', // Example option
});
```

## Basic Usage

You can use the `sample` method added by the plugin on any enum instance:

```js
import { Enum } from 'enum-plus';

const WeekEnum = Enum({
  Monday: { value: 1, label: 'week.monday' },
  Tuesday: { value: 2, label: 'week.tuesday' },
});
WeekEnum.sample(); // Example usage of the sample method
```
