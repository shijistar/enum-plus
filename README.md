<!-- markdownlint-disable MD001 MD009 MD033 MD041 -->

[English](./README.md) | [中文](./README.zh-CN.md) | [CHANGELOG](./CHANGELOG.md)

<p align="center">
  <a href="https://github.com/shijistar/enum-plus" target="blank">
    <img src="./public/enum-plus.svg" width="240" alt="enum-plus" />
  </a>
</p>

<p align="center">
  <strong>Like native enum, but much better!</strong>
</p>
<br/>

[![npm latest version](https://img.shields.io/npm/v/enum-plus.svg?cacheSeconds=86400)](https://www.npmjs.com/package/enum-plus)
[![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/enum-plus?logo=javascript&label=Minzipped&color=44cc11&cacheSeconds=86400)](https://www.npmjs.com/package/enum-plus?activeTab=code)
[![npm downloads](https://img.shields.io/npm/dm/enum-plus.svg?logo=rolldown&logoColor=fd7b24&label=Downloads&color=007ec6&cacheSeconds=86400)](https://www.npmjs.com/package/enum-plus)
[![code coverage](https://codecov.io/gh/shijistar/enum-plus/graph/badge.svg?token=JMCDJKLT0B)](https://codecov.io/gh/shijistar/enum-plus)
![GitHub License](https://img.shields.io/github/license/shijistar/enum-plus?label=License&color=ff8000&cacheSeconds=86400)

**Supported Platforms**

[![Node compatibility](https://img.shields.io/node/v/enum-plus?logo=nodedotjs&label=Node.js&color=2185D0&cacheSeconds=86400)](https://github.com/shijistar/enum-plus)
[![Web Browsers](https://img.shields.io/badge/Web%20Browser-2185D0?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAABa1BMVEUAAAD/1kZap04co1BLr1H/1kZKr0//zDbmXC6IzZv95Y390jpLr09Lr0//1kT/1kU8rE/aeibNi13NfUz3kUrDjVrZaTjZWib2YSn2YSj3iC33xRp7q1/91kX9211cuWxBsWv81VL/10f1jhX411Uqpk771Ub2byLNazVTq0xAq09Lr0/91EBAqk6SwFkipFD8zi/GZiz1dSHGYCb2dSDKykirw0oup0/6yiO2dzn2fhuzdDVKrlD1fxv1gBtHrU+hcCr4wRT3Vi1Lr1D/1kVHr1D+1T//10b3Uyr3TyUel+wWj+f2hhn6yiT3SR74wxOn2PmdzfINh+FErVA8rFAxqFD90Tf8zjD2Ow3j8/7g7/sinO8Zk+kRi+QIgt73RBin1fYto/EMgt3J58z88MLYvJxBrVA5qlAqplAkpFD0WC33QBOu3Pvf7vre7vqgzfG748v97rtRqk1knUSBiDembSftUiTFWBrhRxFiNA5aAAAAQnRSTlMAUQX89dtVBfv6+fHapqSJUQ39/f38/Pz7+/j48/Py8fHx7+7s6+fj4t7d3NjX1dXRz8/OzsHApqWTk46MiomAfUvELz/2AAABGUlEQVQoz52P11rCQBBGQ4mhKIK999577ytKEo2JgiaxgAIWsPfHd3Z2JXDLuTzn+ydZoWwiy0O+XK55cCVS6ld9sR1G03qRdk/LcgwKY8YJs5qGgTP377fMpCYXlw1+aPg3T0tDTV3LAdIrYaggn2Ze+85aum69tR5RtjFUEfJjJrOP1+eKksocUpYwVBLyYTZa4C9U1e4+A6YweAkhX7U69ZfHRuAUCBbCe72O/soI7AFBfgposxXqb547aBjjH6ekUyr4l8wuJcR/F4h607ZhPL32YXCxB46Cj57cdvr9XRPoRUlgEwzxu8SDZ4APOGt0EE/cexbQVwsFNtmgv30fAO8QHqGDedAi3nFwhxcnx3vEkEsSyuUPnANWVoDZ/WEAAAAASUVORK5CYII=)](https://www.npmjs.com/package/enum-plus)
[![ReactNative](https://img.shields.io/badge/ReactNative-2185D0?logo=react)](https://reactnative.dev)
[![MicroProgram](https://img.shields.io/badge/MiniProgram-2185D0?logo=wechat)](https://developers.weixin.qq.com/miniprogram/en/dev/framework)
[![Taro](https://img.shields.io/badge/Taro-18BCF2?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACkAAAAcCAMAAADLCWbaAAABSlBMVEUAAAAAL7MAJ7QAKrcAJ7NxyP90zP8Pev8Tfv8Tff8Uff8Rff9zyv8Tgv8AT9hzy/8Uf/9zyv8Uff8TfP8AJ7Ryyv8AJ7UVff8AJ7IUfv8Tfv8AJrVzyf8Sff8Te/8Vfv8DKbsTev8Mef8Maextv/8AM60AKLZ1zP8Vfv8AKbQAJ7Rvxv8AKLRuxP8AJ7R0y/8MXuIFQ8tzy/8AKLR0y/8BLbkUfv8AJ7Ryyf90yf9Hpv9zyf8Vff8AJrQPbPFyyv9zyv9zy/8AJ7RGo/8Sfv8AKbFivv8Se/9wzP8AI65t2/8Ufv8AKLR0yv8AKbgWg/93zv92zf91y/8WhP8Xgf9ivP8ojv8UgP8AJrMWhf8FP8hMrP8UffwJUtoDNsEBLrx30P9txP9kvv9atf9Tr/89nv8qjv8kiv8Whv8Sd/gRbvEOZegMXOIIStE2vhD3AAAAS3RSTlMACeQkszTNDH24nYFbFgTv7uTb1dXMmF9UTUVDPTcvKSkiHhMODPr59vXx7uzd3djSysPBwL28t66rpqCTk4SCfHZwZlU+Jx0ZFgduc4qrAAABVElEQVQ4y42QV1PCQBCAo4ihF+m923vvvQu5BIIxIGDv/v9Xb+9B9jJzjt/j3jf37awkxhOs1/osstmAhYoPpstqDbEPo5PwIM90nE7Tc5xphx+XlCqHMpGi4wM/jgclysVo1WKGbXS8oSGzvgVmXLGYvZWSLJ9GcFzzUNEX5U2l1Zl3uN2bUxoyx85hzVlOvGm9E9IgRruG4xGI5y3xb3IFPGo4vgfmIf9l70sH8aWJTTUN5hpvdj+Y+XyP4/4yFSuTljVvWfxJ1QCVcbd+Sc2U5ZYdtqbefmgCM8MMD8R3FI7up87M12vGkZ1RBjM6xLFA478YoaLUx8aR320gk2yXJBFeF0GmeSwJyY4YyAxkxWaCizvPhKLsxqbpkIVmYRWvqSfF8cw4FkM5oeiLmXhNl/efN3qLieM5fCMjkBGbSf5GBfGNHNhs/HGjopPgPxP86w8TLLu5GsqeugAAAABJRU5ErkJggg==)](https://docs.taro.zone/en/docs)

⬇️ &nbsp;[Introduction](#introduction) | [Features](#features) | [Installation](#installation) | [Enum Initialization](#enum-initialization) | [API](#api) | [Static Methods](#static-methods) | [User Stories](#user-stories) | [Plugin System](#plugin-system) | [Localization](#localization) | [Extensibility](#extensibility) | [Naming Conflicts](#naming-conflicts) | [Best Practices](#best-practices) | [Compatibility](#compatibility) | [Q&A](#qa) | [Contributing](#contributing)&nbsp; ⬇️

> **🎉 v3.0 is Released!**
>
> The new version is a major milestone that brings many exciting features and improvements. Please refer to the [Release Notes](./docs/release-v3.md) and [Migration Guide](./docs/migration-guide-v2-to-v3.md) for details.

## Introduction

`enum-plus` is an enhanced enum library that is fully compatible with the native `enum` and extends it with powerful features such as display text, localization, UI control binding, enum members traversal, and more useful extension methods. This lightweight, zero-dependency, TypeScript library works with any front-end framework.

With the extended display text capability, enum members can be used to generate dropdowns, checkboxes, and other UI controls with a single line of code. By using the extension methods of the enum, you can easily traverse the array of enum members, get the display text of a certain enum value, determine whether a value exists, etc. The display text of the enum member supports localization, which can return the corresponding text according to the current language environment, making the display text of the enum member more flexible and more in line with user needs.

What other exciting features are there? Please continue to explore! Or you can check out this usage video first.

<p align="center">
  <img src="./public/usage-screenshot-v3.gif" width="500" alt="usage video" />
</p>

## Features

- Full compatibility with native `enum` behavior
- Support for multiple data types including `number` and `string`
- Enhanced enum members with customizable display text
- [Localization](#localization) capabilities that integrate with any i18n library
- Streamlined conversion from enum values to human-readable display text
- Extensible design allowing unlimited metadata fields on enum members
- Plugin system with a variety of practical plugins available for installation
- Seamless integration with any UI libraries like [Ant Design](https://ant.design/components/overview), [ElementPlus](https://element-plus.org/en-US/component/overview.html), [Material-UI](https://mui.com/material-ui), in a single line of code
- Support for server-side rendering (SSR)
- Support for multiple environments including Web browsers, Node.js, ReactNative, Taro, and Mini Programs
- Zero dependencies - pure JavaScript implementation usable in any front-end framework
- First-class TypeScript support with comprehensive type inference
- Lightweight (only 2KB+ gzipped)

## Installation

Install using npm:

```bash
npm install enum-plus
```

Install using pnpm:

```bash
pnpm add enum-plus
```

Install using bun:

```bash
bun add enum-plus
```

Or using yarn:

```bash
yarn add enum-plus
```

**Install in a browser**:

- The specific version:

```html
<!-- Modern version, ES2020 compatible -->
<script src="https://cdn.jsdelivr.net/npm/enum-plus@v3.0.0/umd/enum-plus.min.js"></script>
<!-- Legacy version, ES2015 compatible -->
<script src="https://cdn.jsdelivr.net/npm/enum-plus@v3.0.0/umd/enum-plus-legacy.min.js"></script>
```

- The latest version:

```html
<!-- Modern version, ES2020 compatible -->
<script src="https://cdn.jsdelivr.net/npm/enum-plus/umd/enum-plus.min.js"></script>
<!-- Legacy version, ES2015 compatible -->
<script src="https://cdn.jsdelivr.net/npm/enum-plus/umd/enum-plus-legacy.min.js"></script>
```

⬇️ **Download**:

- [enum-plus.umd.min.js.gz](https://github.com/shijistar/enum-plus/releases/download/v3.0.0/enum-plus.umd.min.js.gz)
- [enum-plus.umd.tar.gz](https://github.com/shijistar/enum-plus/releases/download/v3.0.0/enum-plus.umd.tar.gz) (Full package with sourcemap)
- [enum-plus-legacy.umd.min.js.gz](https://github.com/shijistar/enum-plus/releases/download/v3.0.0/enum-plus-legacy.umd.min.js.gz)
- [enum-plus-legacy.umd.tar.gz](https://github.com/shijistar/enum-plus/releases/download/v3.0.0/enum-plus-legacy.umd.tar.gz) (Full package with sourcemap)

> You can download them in [github release](https://github.com/shijistar/enum-plus/releases) assets too.

## Enum Initialization

This section shows the various ways to initialize enums using the `Enum` function. Understanding these different initialization formats allows you to choose the most convenient approach for your specific use case.

### 1. Simple Key-Value Format

The simplest format is a direct mapping of keys to values. This is similar to the native enum format.

```js
import { Enum } from 'enum-plus';

// With number values
const WeekEnum = Enum({
  Sunday: 0,
  Monday: 1,
});

WeekEnum.Monday; // 1

// With string values
const WeekEnum2 = Enum({
  Sunday: 'Sun',
  Monday: 'Mon',
});

WeekEnum2.Monday; // 'Mon'
```

### 2. Standard Format (Recommended)

The standard format includes both a `value` and a `label` for each enum member. This is the most commonly used format and is recommended for most cases. This format allows you to specify a display text for each enum member, which can be used in UI components. For enabling localization support for the `label` field, please refer to the [Localization](#localization) section.

```js
import { Enum } from 'enum-plus';

const WeekEnum = Enum({
  Sunday: { value: 0, label: 'I love Sunday' },
  Monday: { value: 1, label: 'I hate Monday' },
});

WeekEnum.Sunday; // 0
WeekEnum.label(0); // I love Sunday
```

### 3. Label-Only Format

This is useful when you want to use the key as the value.

```js
import { Enum } from 'enum-plus';

const WeekEnum = Enum({
  Sunday: { label: 'I love Sunday' },
  Monday: { label: 'I hate Monday' },
});

WeekEnum.Sunday; // 'Sunday'
WeekEnum.label('Sunday'); // I love Sunday
```

### 4. Array Format

The array format is useful when you need to create enums dynamically, such as from API data. This allows for flexibility in [Custom Field Mapping](#-custom-field-mapping-in-array-format-initialization) to adapt to different data structures.

```js
import { Enum } from 'enum-plus';

const pets = [
  { value: 1, key: 'Dog', label: 'Dog' },
  { value: 2, key: 'Cat', label: 'Cat' },
  { value: 3, key: 'Rabbit', label: 'Rabbit' },
];
const PetEnum = Enum(pets);

PetEnum.Dog; // 1
PetEnum.label(1); // Dog
```

### 5. Native Enum Format

You can also create from native enums. It benefits from the native enum's `auto-incrementing` behavior.

```ts
import { Enum } from 'enum-plus';

enum init {
  Sunday = 0,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}
const WeekEnum = Enum(init);

WeekEnum.Sunday; // 0
WeekEnum.Monday; // 1
WeekEnum.Saturday; // 6
WeekEnum.label('Sunday'); // Sunday
```

## API

### 💎 &nbsp; Picks an enum value

`Enum.XXX`

Works like native `enum`, allowing you to access enum values directly.

```js
WeekEnum.Sunday; // 0
WeekEnum.Monday; // 1
```

---

### 💎 &nbsp; named

`Record<string, EnumItemClass>`

An object that aggregates all enum items, allowing quick access to a specific enum member object through its `key`.

```js
WeekEnum.named.Monday; // { key: 'Monday', value: 1, label: 'Monday' }
```

### 💎 &nbsp; items

`{ value, label, key, raw }[]`

Returns a read-only array of all enum members.

```js
WeekEnum.items; // [ { value: 0, label: 'Sunday', key:  'Sunday' }, { value: 1, label: 'Monday', key: 'Monday' }, ... ]
```

---

### 💎 &nbsp; values

`(string | number)[]`

Returns an array of all enum member `value`(s).

```js
WeekEnum.values; // [0, 1, 2, 3, 4, 5, 6]
```

---

### 💎 &nbsp; labels

`string[]`

Returns an array of all enum member `label`(s).

```js
WeekEnum.labels; // ['Sunday', 'Monday', ... 'Friday', 'Saturday']
```

---

### 💎 &nbsp; keys

`string[]`

Returns an array of all enum member `key`(s)

```js
WeekEnum.keys; // ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
```

---

### 💎 &nbsp; meta

`Record<string, any[]>`

Returns an object containing arrays of custom field values for all enum members. Each key in the object corresponds to a custom field name, and the value is an array of that field's values across all enum members.

```js
const ColorEnum = Enum({
  Red: { value: 1, label: 'Red', hex: '#FF0000' },
  Green: { value: 2, label: 'Green', hex: '#00FF00' },
  Blue: { value: 3, label: 'Blue', hex: '#0000FF' },
});
ColorEnum.meta.hex; // ['#FF0000', '#00FF00', '#0000FF']
```

By the way, you can quickly access custom fields of a single enum member through the `named` property.

```js
ColorEnum.named.Red.raw.hex; // '#FF0000'
```

---

### 💎 &nbsp; has

<sup>**_\[F]_**</sup> &nbsp; `has(keyOrValue?: string | number): boolean`

Determine whether a certain enum member (value or key) exists.

```js
WeekEnum.has(1); // true
WeekEnum.has('Sunday'); // true
WeekEnum.has(9); // false
WeekEnum.has('Birthday'); // false
```

---

### 💎 &nbsp; findBy

<sup>**_\[F]_**</sup> &nbsp; `findBy(field: string, value: any): EnumItemClass | undefined`

Find an enum member by a specific field and its value. Returns the enum member object if found, otherwise returns `undefined`.

The `field` parameter can be one of the built-in fields: `key`, `value`, `label`, or any custom field defined in the enum.

```js
WeekEnum.findBy('value', 1); // { key: 'Monday', value: 1, label: 'Monday' }
WeekEnum.findBy('key', 'Monday'); // { key: 'Monday', value: 1, label: 'Monday' }
```

> If you want to get the custom fields of a known enum member, it is recommended to use the `named` property to access it

---

### 💎 &nbsp; label

<sup>**_\[F]_**</sup> &nbsp; `label(keyOrValue?: string | number): string | undefined`

Gets the display text of an enum member based on a certain value or key. If localization has been set up, the localized text will be returned.

```js
WeekEnum.label(1); // Monday
WeekEnum.label('Monday'); // Monday, here is label, not key
```

---

### 💎 &nbsp; key

<sup>**_\[F]_**</sup> &nbsp; `key(value?: string | number): string | undefined`

Get the key of an enum member based on the enum value, if the key is not found, return `undefined`.

```js
WeekEnum.key(1); // Monday (here is key, not label)
```

---

### 💎 &nbsp; raw

<sup>**_\[F^1]_**</sup> &nbsp; `raw(): Record<K, T[K]>`
<br/>
<sup>**_\[F^2]_**</sup> &nbsp; `raw(keyOrValue: V | K): T[K]`

The `raw` method is used to return the original initialization object of the enum collection, which is the object used to create the enum.

The second overload method is used to return the original initialization object of a single enum member.

The main purpose of the `raw` method is to get the extended custom fields of the enum members. Unlimited number of custom fields are allowed.

```js
const WeekEnum = Enum({
  Sunday: { value: 0, label: 'Sunday', happy: true },
  Monday: { value: 1, label: 'Monday', happy: false },
});

WeekEnum.raw(0).happy; // true
WeekEnum.raw(0); // { value: 0, label: 'Sunday', happy: true }
WeekEnum.raw('Monday'); // { value: 1, label: 'Monday', happy: false }
WeekEnum.raw(); // { Sunday: { value: 0, label: 'Sunday', happy: true }, Monday: { value: 1, label: 'Monday', happy: false } }
```

---

### 💎 &nbsp; toList

<sup>**_\[F^1]_**</sup> &nbsp; `toList(): { value, label }[]`
<br/>
<sup>**_\[F^2]_**</sup> &nbsp; `toList(options?: { valueField?: string; labelField?: string }): { [key: string]: any }[]`

Converts the enum members to an array of objects, each containing `value` and `label` fields by default. You can customize the field names using the `options` parameter.

```js
WeekEnum.toList();
// [
//   { value: 1, label: 'Monday' },
//   { value: 2, label: 'Tuesday' },
//   ...
// ]
WeekEnum.toList({ valueField: 'id', labelField: 'name' });
// [
//   { id: 1, name: 'Monday' },
//   { id: 2, name: 'Tuesday' },
//   ...
// ]
```

---

### 💎 &nbsp; toMap

<sup>**_\[F^1]_**</sup> &nbsp; `toMap(): Record<string, string | number>`
<br/>
<sup>**_\[F^2]_**</sup> &nbsp; `toMap(options?: { keySelector?: string; valueSelector?: string }): Record<string, any>`

Converts the enum members to a key-value map object, where the keys are the enum values and the values are the enum labels by default. You can customize the key and value fields using the `options` parameter.

```js
WeekEnum.toMap();
// {
//   "1": 'Monday',
//   "2": 'Tuesday',
//   ...
// }
WeekEnum.toMap({ keySelector: 'key', valueSelector: 'value' });
// {
//   "Monday": 1,
//   "Tuesday": 2,
//   ...
// }
```

---

### 💎 &nbsp; name

`string`

Display name for Enum types. When creating an enum, you can assign it a display name using the optional `name` parameter. This name can be either a plain string or a localization key to support internationalized text. For more details on localization, see the [Localization](#localization) section.

> Usually Enums are used to generate dropdown menus in form, or show member text in table cells. The display name of the enum type often serves as the form field label or table caption. By utilizing the `name` property, you can centralize the management of both the enum type's display name and its members' labels, simplifying maintenance and ensuring consistency across your application.

```js
const WeekEnum = Enum(
  {
    Sunday: { value: 0, label: 'Sunday', happy: true },
    Monday: { value: 1, label: 'Monday', happy: false },
  },
  {
    name: 'i18n.enums.week', // A localization key
  }
);

WeekEnum.name; // Week
WeekEnum.label(0); // Sunday
WeekEnum.label(1); // Monday
```

---

### ⚡️ &nbsp; valueType &nbsp; <sup>**_\[TypeScript ONLY]_**</sup>

`value1 | value2 | ...`

In TypeScript, provides a union type containing all enum values, enabling precise type constraints for variables and component properties. This replaces broad primitive types like `number` or `string` with exact value sets, preventing invalid assignments while enhancing both code readability and compile-time type safety.

```typescript
type WeekValues = typeof WeekEnum.valueType; // 0 | 1

const weekValue: typeof WeekEnum.valueType = 1; // ✅ Type correct, 1 is a valid week enum value
const weeks: (typeof WeekEnum.valueType)[] = [0, 1]; // ✅ Type correct, 0 and 1 are valid week enum values
const badWeekValue: typeof WeekEnum.valueType = 8; // ❌ Type error, 8 is not a valid week enum value
const badWeeks: (typeof WeekEnum.valueType)[] = [0, 8]; // ❌ Type error, 8 is not a valid week enum value
```

> Note: This is a TypeScript type only and cannot be called at runtime. Calling it at runtime will throw an exception.

---

### ⚡️ &nbsp; keyType &nbsp; <sup>**_\[TypeScript ONLY]_**</sup>

`key1 | key2 | ...`

Similar to `valueType`, provides an union type of all enum `key`(s)

```typescript
type WeekKeys = typeof WeekEnum.keyType; // 'Sunday' | 'Monday'

const weekKey: typeof WeekEnum.keyType = 'Monday';
const weekKeys: (typeof WeekEnum.keyType)[] = ['Sunday', 'Monday'];
```

> Note: This is a TypeScript type only and cannot be called at runtime. Calling it at runtime will throw an exception.

---

### ⚡️ &nbsp; rawType &nbsp; <sup>**_\[TypeScript ONLY]_**</sup>

`{ value: V, label: string, [...] }`

Provides a type of the original initialization object of the Enum collection.

```typescript
type WeekRaw = typeof WeekEnum.rawType;
// { Sunday: { value: 0, label: string }, Monday: { value: 1, label: string } }
```

> Note: This is a TypeScript type only and cannot be called at runtime. Calling it at runtime will throw an exception.

---

## Static Methods

### 💎 &nbsp; Enum.isEnum

<sup>**_\[F]_**</sup> &nbsp; `isEnum(obj: any): boolean`

Check if a given object is an instance which was created by `Enum` function.

```js
Enum.isEnum(WeekEnum); // true
Enum.isEnum({}); // false
```

---

### 💎 &nbsp; Enum.localize

<sup>**_\[F]_**</sup> &nbsp; `(key: string) => string`

Set a global localization function for all enums. This function will be used to get the localized text for enum members and enum type names.

```js
import i18n from 'i18next';

Enum.localize = (key) => i18n.t(key);
```

---

### 💎 &nbsp; Enum.extends

<sup>**_\[F]_**</sup> &nbsp; `(obj: Record<string, unknown> | undefined) => void`

Extend the `Enum` objects with custom methods. More details can be found in the [Extensibility](#extensibility) section.

```js
Enum.extends({
  sayHello() {
    return `Hello EnumPlus!`;
  },
});
```

---

### 💎 &nbsp; Enum.install

<sup>**_\[F]_**</sup> &nbsp; `(plugin: EnumPlugin, options?: any) => void`

Install a plugin to extend the functionality of all enums. More details can be found in the [Plugin System](#plugin-system) section.

```js
import i18nextPlugin from '@enum-plus/i18next';

Enum.install(i18nextPlugin);
```

---

## User Stories

#### 💡 Basic Usage, Replacing Magic Numbers

```js
const WeekEnum = Enum({
  Sunday: { value: 0, label: 'Sunday' },
  Monday: { value: 1, label: 'Monday' },
});

if (today === WeekEnum.Sunday) {
  // It's Sunday, enjoy your day!
} else if (today === WeekEnum.Monday) {
  // Oh no, it's Monday again...
}
```

---

#### 💡 Checks for Valid Enum Values

```js
if (WeekEnum.has(value)) {
  // It's a valid enum value, safe to use
} else {
  // Throw an error or use a default value
}
```

---

#### 💡 Checks for Enum Objects

```js
let values: number[] | undefined;
if (Enum.isEnum(data)) {
  values = data.values;
} else if (Array.isArray(data)) {
  values = data;
} else {
  // Throw an error or use a default value
}
```

---

#### 💡 Generate UI Components

Take React and Ant Design as an example. Please refer to the [Supports Various Frontend Frameworks](#-supports-various-frontend-frameworks) section for more examples.

```jsx
import { Menu, Select, Table } from 'antd';
import { ProFormCheckbox, ProFormSelect } from '@ant-design/pro-components';

const App = () => {
  return (
    <>
      <Select options={WeekEnum.items} />
      <Menu items={WeekEnum.toMenu()} />
      <Table columns={[{ filters: WeekEnum.toFilter() }]} />
      <ProFormSelect valueEnum={WeekEnum.toValueMap()} />
      <ProFormCheckbox valueEnum={WeekEnum.toValueMap()} />
    </>
  );
};
```

> Need to install [@enum-plus/plugin-antd](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-antd) plugin

---

#### 💡 Enable Localization for Enum Labels

Support internationalization. Set the `label` field to a localization key, it can display the corresponding text based on the current language environment. For more information, please refer to the [Localization](#localization) section.

```js
WeekEnum.label(1); // Monday or 星期一, depending on the current locale
WeekEnum.named.Monday.label; // Monday or 星期一, depending on the current locale
WeekEnum.name; // Week or 周, depending on the current locale
```

---

#### 💡 Type Narrowing &nbsp; <sup>**_\[TypeScript ONLY]_**</sup>

```ts
type MyComponentProps = {
  day: typeof WeekEnum.valueType; // 0 | 1 | ... | 5 | 6
};
const MyComponent = (props: MyComponentProps) => {
  return <div>Today is {WeekEnum.label(props.day)}</div>;
};

<MyComponent day={1} />; // ✅ Type correct
<MyComponent day="Monday" />; // ❌ Type error
<MyComponent day={8} />; // ❌ Error, 8 is not a valid enum value
```

```ts
function setDay(day: typeof WeekEnum.valueType) {
  // The type of day is narrowed to 0 | 1 | ... | 5 | 6
}

setDay(1); // ✅ Type correct
setDay('Monday'); // ❌ Type error
setDay(8); // ❌ Error, 8 is not a valid enum value
```

---

<!-- #### 💡 添加元数据字段，可以作为静态全局配置系统使用 -->

#### 💡 Support Metadata Fields That Serves as a Static Configuration System

```js
const ColorEnum = Enum({
  Red: { value: 1, hex: '#FF0000', icon: '🔥' },
  Green: { value: 2, hex: '#00FF00', icon: '🍏' },
  Blue: { value: 3, hex: '#0000FF', icon: '🔵' },
});

ColorEnum.values; // [1, 2, 3]
ColorEnum.keys; // ['Red', 'Green', 'Blue']
ColorEnum.meta.hex; // ['#FF0000', '#00FF00', '#0000FF']
ColorEnum.meta.icon; // ['🔥', '🍏', '🔵']
ColorEnum.named.Red.raw.hex; // '#FF0000'
ColorEnum.named.Red.raw.icon; // '🔥'
```

---

#### Supports Traversing Enum Members, in a Read-Only Manner

```js
Array.isArray(WeekEnum.items); // true
WeekEnum.items.map((item) => item.value); // [0, 1, ..., 5, 6]
WeekEnum.items.forEach((item) => {
  // ✅ Traversable
});
for (const item of WeekEnum.items) {
  // ✅ Traversable
}

WeekEnum.items.push({ value: 2, label: 'Tuesday' }); // ❌ Not allowed, read-only
WeekEnum.items.splice(0, 1); // ❌ Not allowed, read-only
WeekEnum.items[0].label = 'foo'; // ❌ Not allowed, read-only
```

---

#### 💡 Enum Composition (Merging)

```js
const PrimaryColorEnum = Enum({
  Red: { value: 1, hex: '#FF0000' },
  Green: { value: 2, hex: '#00FF00' },
  Blue: { value: 3, hex: '#0000FF' },
});
const SecondaryColorEnum = Enum({
  Yellow: { value: 4, hex: '#FFFF00' },
  Cyan: { value: 5, hex: '#00FFFF' },
  Magenta: { value: 6, hex: '#FF00FF' },
});
const AllColorEnum = Enum({
  ...PrimaryColorEnum.raw(),
  ...SecondaryColorEnum.raw(),
});
```

---

#### 💡 Supports JSDoc Comments on Enum Members, Enabling Code Intelligence

Supports inline documentation through JSDoc, allowing developers to view detailed comments by simply hovering over enum values in the editor. Please refer to the [Best Practices](./docs/best-practices.md) section for writing good code.

```js
const WeekEnum = Enum({
  /** Represents Sunday */
  Sunday: { value: 0, label: 'Sunday' },
  /** Represents Monday */
  Monday: { value: 1, label: 'Monday' },
});

WeekEnum.Monday; // Hover over Monday
```

![jsdoc](./public/jsdoc-en.png)

You can see that this hover functionality reveals both documentation and enum values simultaneously, without leaving your current position in the code.

---

#### 💡 Supports Various Frontend Frameworks

`Enum.items` can be consumed as control data sources (using Select as an example).

- **React-based UI libraries**

  [Ant Design](https://ant.design/components/select) | [Arco Design](https://arco.design/react/en-US/components/select) Select

  ```tsx
  import { Select } from 'antd';

  <Select options={WeekEnum.items} />;
  ```

  [Material-UI](https://mui.com/material-ui/react-select/) Select

  ```tsx
  import { MenuItem, Select } from '@mui/material';

  <Select>
    {WeekEnum.items.map((item) => (
      <MenuItem key={item.value} value={item.value}>
        {item.label}
      </MenuItem>
    ))}
  </Select>;
  ```

  [Kendo UI](https://www.telerik.com/kendo-react-ui/components/dropdowns/dropdownlist) Select

  ```tsx
  import { DropDownList } from '@progress/kendo-react-dropdowns';

  <DropDownList data={WeekEnum.items} textField="label" dataItemKey="value" />;
  ```

- **Vue-based UI libraries**

  [ElementPlus](https://element-plus.org/en-US/component/select.html) Select

  ```tsx
  <el-select>
    <el-option v-for="item in WeekEnum.items" v-bind="item" />
  </el-select>
  ```

  [Ant Design Vue](https://antdv.com/components/select) | [Arco Design](https://arco.design/vue/en-US/component/select) Select

  ```tsx
  <a-select :options="WeekEnum.items" />
  ```

  [Vuetify](https://vuetifyjs.com/en/components/selects/) Select

  ```tsx
  <v-select :items="WeekEnum.items" item-title="label" />
  ```

- **Angular-based UI libraries**

  [Angular Material](https://material.angular.io/components/select/overview) Select

  ```jsx
  <mat-select>
    @for (item of WeekEnum.items; track item.value) {
      <mat-option [value]="item.value">{{ item.label }}</mat-option>
    }
  </mat-select>
  ```

  [NG-ZORRO](https://ng.ant.design/components/select/en) Select

  ```jsx
  <nz-select>
    @for (item of WeekEnum.items; track item.value) {
      <nz-option [nzValue]="item.value">{{ item.label }}</nz-option>
    }
  </nz-select>
  ```

---

#### 💡 Custom Field Mapping in Array Format Initialization

In [4. Array Format](#4-array-format) section, we know that you can build an enum from dynamic data from the backend, but it is very likely that the field names of dynamic data are not `value`, `label`, `key`, but other field names. In this case, you can pass in a custom option to map these to other field names.

```js
import { Enum } from 'enum-plus';

const data = await getPetsData();
// [   { id: 1, code: 'dog', name: 'Dog' },
//     { id: 2, code: 'cat', name: 'Cat' },
//     { id: 3, code: 'rabbit', name: 'Rabbit' }   ];
const PetTypesEnum = Enum(data, {
  getValue: 'id',
  getLabel: 'name',
  getKey: 'code', // getKey is optional
});
PetTypesEnum.items; // The output is:
// [   { value: 1, label: 'Dog', key: 'dog' },
//     { value: 2, label: 'Cat', key: 'cat' },
//     { value: 3, label: 'Rabbit', key: 'rabbit' }   ]
```

`getValue`, `getLabel`, `getKey` can also be a function to handle more complex business logic, for example:

```js
const PetTypesEnum = Enum(petTypes, {
  getValue: (item) => item.id,
  getLabel: (item) => `${item.name} (${item.code})`,
  getKey: (item) => item.code,
});
```

---

## Plugin System

`enum-plus` provides a plugin system that allows you to extend the functionality of all enums. Plugins can add new methods or properties to all enum instances, greatly enhancing their capabilities. You can choose to install only the plugins you need, keeping the core library lightweight and efficient.

```ts
import antdPlugin from '@enum-plus/plugin-antd';
import { Enum } from 'enum-plus';

Enum.install(antdPlugin);
```

After installing a plugin, it will add new methods or properties to all enum instances. For example, after installing the `@enum-plus/plugin-antd` plugin, you can use the `enum.toSelect` method to generate a Select component from the enum.

Optionally, you can provide configuration options to customize the behavior of the plugin. For details on the configuration options for each plugin, please refer to the documentation of the respective plugins.

```ts
import antdPlugin from '@enum-plus/plugin-antd';
import { Enum } from 'enum-plus';

Enum.install(antdPlugin, {
  toSelect: {
    valueField: 'id', // Sets the field representing the value in the data object generated by the toSelect method
    labelField: 'name', // Sets the field representing the label in the data object generated by the toSelect method
  },
});
```

### Awesome Plugins

The following plugins are available. You can choose to install them based on your needs:

- [@enum-plus/plugin-antd](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-antd): Ant Design oriented features, including `enum.toSelect`, `enum.toMenu`, `enum.toFilter`, and `enum.toValueMap`. With these methods, you can directly bind enums to the corresponding Ant Design components, greatly simplifying your code.
- [@enum-plus/plugin-i18next](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-i18next): i18next localization support.
- [@enum-plus/plugin-react](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-react): React integration, including support for `Enum.localize` to return React components, and listening for language changes to auto re-render components.
- We are working on the following plugins:
  - [@enum-plus/plugin-vue](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-vue): Vue integration, including support for `Enum.localize` to return Vue components, and listening for language changes to auto re-render components.
  - [@enum-plus/plugin-angular](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-angular): Angular integration, including support for `Enum.localize` to return Angular components, and listening for language changes to auto re-render components. _We need your help to develop this plugin!_

> If the plugin you are searching for is not available, or if you want to develop your own plugin, please refer to the [Plugin Development Guide](./docs/plugin-development.md). You can develop new plugins in the official enum-plus repository or publish your developed plugins to npm and share your plugin links here. We sincerely need your help to enrich the plugin ecosystem!

---

## Localization

`enum-plus` does not include built-in internationalization capabilities by default. Therefore, the `label` field of enum members is treated as a plain string and returns the original text directly.

To add localization support to `enum-plus`, the simplest way is to install the corresponding [i18n plugin](#plugin-system), such as `@enum-plus/plugin-i18next`, which automatically passes the values of the `label` and `name` fields to i18next for translation.

```bash
npm install @enum-plus/plugin-i18next i18next
```

Then install the plugin in the project entry file:

```js
import i18nextPlugin from '@enum-plus/plugin-i18next';
import { Enum } from 'enum-plus';

Enum.install(i18nextPlugin);
```

After installing the plugin, the `label` and `name` fields of the enum will be automatically translated through i18next.

```js
const WeekEnum = Enum(
  {
    Sunday: { value: 0, label: 'week.sunday' },
    Monday: { value: 1, label: 'week.monday' },
  },
  { name: 'weekDays.name' }
);
WeekEnum.label(1); // Monday Or 星期一, depending on the current locale
WeekEnum.named.Monday.label; // Monday Or 星期一, depending on the current locale
WeekEnum.name; // Week Or 周, depending on the current locale
```

This plugin also supports custom i18next options, and even allows complete control over the `localize` method. For more details, please refer to the [plugin documentation](https://github.com/shijistar/enum-plus/tree/main/packages/plugin-i18next#plugin-options)。

If you need to automatically update the UI after switching languages, this requires the capabilities of frameworks like React, Vue, or Angular. Please consider using plugins such as [@enum-plus/plugin-react](https://github.com/shijistar/enum-plus/tree/main/packages/plugin-react) or [@enum-plus/plugin-vue](https://github.com/shijistar/enum-plus/tree/main/packages/plugin-vue).

If you are using other internationalization libraries, such as `react-intl`, `vue-i18next`, or `ngx-translate`, you can integrate these libraries through the `Enum.localize` method.

_index.js_

```js
import { Enum } from 'enum-plus';

Enum.localize = (key) => {
  // 这是一段伪代码，请根据你使用的国际化库进行调整
  return intl.formatMessage({ id: key });
};
```

> Once you have completed the custom localization functionality, it is highly recommended to publish it as an npm package and share it in the [Awesome Plugins](#awesome-plugins) section, so that others can benefit from your work. If you believe that this project is very general, you can also consider submitting it to the official [enum-plus](https://github.com/shijistar/enum-plus/tree/master/packages) plugin repository. For specific development rules, please refer to the [Plugin Development Guide](./docs/plugin-development.md).

---

## Extensibility

While `Enum` provides a comprehensive set of built-in methods, you can extend its functionality with custom methods using the `Enum.extends` API. These extensions are globally applied to all enum instances, including those created before the extension was applied, and take effect immediately without requiring any manual setup.

_App.ts_

```tsx
Enum.extends({
  toMySelect(this: ReturnType<typeof Enum>) {
    return this.items.map((item) => ({ value: item.value, title: item.label }));
  },
  reversedItems(this: ReturnType<typeof Enum>) {
    return this.items.reverse();
  },
});

WeekEnum.toMySelect(); // [{ value: 0, title: 'Sunday' }, { value: 1, title: 'Monday' }]
```

If you are using TypeScript, you probably need to further extend the enum type declaration to get better type hints. Create a declaration file in your project (e.g., `enum-extension.d.ts`), and extend the global types there.

> `enum-extension.d.ts` file can be placed in the root directory of the project or any directory.
> Note, please check the `include` option in your `tsconfig.json` configuration to ensure that TypeScript can find your declaration file.

_enum-extension.d.ts_

```typescript
declare module 'enum-plus/extension' {
  export interface EnumExtension<T, K, V> {
    toMySelect: () => { value: V; title: string }[];
    reversedItems: () => EnumItemClass<EnumItemInit<V>, K, V>[];
  }
}
```

Then import this declaration file in your project entry file.

_index.ts_

```tsx
import './enum-extension';
```

Please note that `EnumExtension` is a generic interface that accepts three type parameters, which represent:

- `T`: Initialization object of the enum type (e.g., the object passed to `Enum()`)
- `K`: Key of the enum member (e.g., Sunday, Monday)
- `V`: Value of the enum members

If you want to provide more friendly type hints in the extension methods, you may need to use these type parameters.

> However these are all optional, if you don't need them, you can omit them.

---

## Naming Conflicts?

`enum-plus` is designed with naming conflicts in mind. The namespace of enum members is separate from the methods and properties of the enum instance, minimizing the chances of conflicts. For example, when an enum member's name conflicts with a method name, you can access the overridden methods through the `items` property.

```js
import { KEYS, VALUES } from 'enum-plus';

const WeekEnum = Enum({
  foo: { value: 1 },
  bar: { value: 2 },
  keys: { value: 3 }, // Naming conflict
  values: { value: 4 }, // Naming conflict
  label: { value: 5 }, // Naming conflict
  named: { value: 6 }, // Naming conflict
  toList: { value: 7 }, // Naming conflict
});

Week.foo; // 1
Week.bar; // 2
// Below are all enum members, which take precedence and override the original methods
WeekEnum.keys; // 3
WeekEnum.values; // 4
WeekEnum.label; // 5
WeekEnum.named; // 6
WeekEnum.toList; // 7

// You can access these overridden methods via .items 🙂
WeekEnum.items[KEYS]; // ['foo', 'bar', 'keys', 'values', 'label', 'named', 'toList']
WeekEnum.items[VALUES]; // [1, 2, 3, 4, 5, 6, 7]
WeekEnum.items.label(1); // 'foo'
WeekEnum.items.named.foo; // { value: 1, label: 'foo', key: 'foo' }
WeekEnum.items.toList(); // [{ value: 1, label: 'foo' }, ...]
```

> Note that `keys` and `values` are special because they are built-in methods of JavaScript arrays. To avoid altering the behavior of the `items` array, you need to use the `KEYS` and `VALUES` symbols as aliases to access them.

For an even more extreme case, what if `items` conflicts with an enum member name? Don't worry, you can still access it via the `ITEMS` alias.

```js
import { ITEMS } from 'enum-plus';

const WeekEnum = Enum({
  foo: { value: 1 },
  bar: { value: 2 },
  items: { value: 3 }, // Naming conflict
  toList: { value: 4 }, // Naming conflict
});

WeekEnum.items; // 3, enum member takes precedence and overrides items
WeekEnum[ITEMS].toList(); // But you can access it via the ITEMS alias
```

---

## Best Practices

When using `enum-plus`, following these best practices can help ensure consistency, maintainability, and clarity in your codebase:

1. **Enum Type Naming:** Use `PascalCase` and append with the `Enum` suffix (e.g., _WeekEnum_, _ColorEnum_).
2. **Enum Member Naming:** Use `PascalCase` for enum members(e.g., _WeekEnum.Sunday_, _ColorEnum.Red_). This naming style highlights the immutability and static nature of enum members, and ensures they appear at the top in IDE IntelliSense suggestions for easier selection.
3. **Semantic Clarity:** Ensure enum and member names have clear semantics. Good semantic naming serves as self-documentation, making code intent explicit and reducing cognitive overhead.
4. **Single Responsibility Principle:** Each enum type should represent a single, cohesive set of related constants. Avoiding overlapping responsibilities between different enum types.
5. **Provide JSDoc Comments:** Provide JSDoc comments for each enum member and the enum type itself, explaining their purpose and usage. Comprehensive documentation enables IDE hover tooltips and improves code readability and maintainability.
6. **Internationalization Architecture:** Plan for internationalization from the outset by leveraging the library's [localization](#localization) features. A well-designed internationalization architecture minimizes future refactoring and facilitates global scalability.

Here is an example that combines the above best practices to define an enum:

```js
/** Represents the days of the week */
const WeekEnum = Enum(
  {
    /** Sunday */
    Sunday: { value: 0, label: 'enums.week.sunday' },
    /** Monday */
    Monday: { value: 1, label: 'enums.week.monday' },
    // ...
    /** Friday */
    Friday: { value: 5, label: 'enums.week.friday' },
    /** Saturday */
    Saturday: { value: 6, label: 'enums.week.saturday' },
  },
  { name: 'enums.week.name' }
);
```

---

## Compatibility

enum-plus is designed to be compatible with a wide range of environments, including modern browsers, Node.js, and various build tools. Below are the compatibility details for different environments:

### Browser Environments

- **Modern Bundlers**: For bundlers supporting the [exports](https://nodejs.org/api/packages.html#exports-sugar) configuration (such as webpack 5+, vite, rollup), `es` directory is imported, which targets `ES2020`. If you need to support earlier browsers, you can use `@babel/preset-env` to transpile to earlier syntax during the build process.

- **Legacy Bundlers**: For bundlers without [exports](https://nodejs.org/api/packages.html#exports-sugar) configuration support (like Webpack 4), this library automatically falls back to the `main` field entry point, and `es-legacy` directory is imported, which targets `ES2015`.

- **UMD Version**: For direct browser usage or static projects without bundlers, enum-plus provides UMD format files in the `umd` directory. These can be included via a `<script>` tag and accessed through `window.EnumPlus`. The UMD directory offers two versions:
  - `enum-plus.min.js`: Targets **`ES2020`**, suitable for modern browsers.
  - `enum-plus-legacy.min.js`: Targets **`ES2015`**, suitable for older browsers.

- **Polyfill Strategy**: enum-plus ships no polyfills to minimize bundle size. For legacy browser support, you can include the following tools as needed:
  - `core-js`
  - `@babel/preset-env` with appropriate `useBuiltIns` settings
  - Alternative polyfill implementations

### **Node.js Environments**

In Node.js environments, the EcmaScript version provided is **`ES2016`**.

Additionally, enum-plus supports both `CommonJS` and `ESModule` module formats.

- For versions that support the [exports](https://nodejs.org/api/packages.html#exports-sugar) configuration (e.g., Node 14+), you can choose to use either `require` or `import` syntax to import the module.
- For earlier Node.js versions, the default import is from the `lib` directory, which only supports the `CommonJS` module format, meaning you can only use the `require` syntax.
- The minimum compatible version of Node.js is `v7.x`.

---

## Q&A

### 1. How to implement internationalization based on i18next?

Please refer to the code example below:

_main.tsx_

```tsx
import { createRoot } from 'react-dom/client';
import { Enum } from 'enum-plus';
import i18next from 'i18next';
import App from './App';
import Locale from './components/Locale';
import LocaleProvider from './components/LocaleProvider';
import enUS from './locales/en-US';
import zhCN from './locales/zh-CN';

i18next.init({
  lng: localStorage.getItem('my_lang'),
  fallbackLng: 'en-US',
  supportedLngs: ['en-US', 'zh-CN'],
  resources: {
    'en-US': { translation: enUS },
    'zh-CN': { translation: zhCN },
  },
});
i18next.on('languageChanged', (lang) => {
  localStorage.setItem('my_lang', lang);
});

// 👀 Here is the key code, set globally through Enum.localize method, use Locale component to output localized text
Enum.localize = (key?: string) => <Locale value={key} />;

const root = createRoot(document.getElementById('root'));
root.render(
  <LocaleProvider>
    <App />
  </LocaleProvider>
);
```

_components/LocaleProvider.tsx_

```tsx
import type { FC, ReactNode } from 'react';
import { createContext, useEffect, useState } from 'react';
import i18next from 'i18next';

export const LocaleContext = createContext<{
  lang: string;
  setLang: (lang: string) => void;
}>({});

const LocaleProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState(i18next.language);

  useEffect(() => {
    i18next.changeLanguage(lang);
  }, [lang]);
  return <LocaleContext.Provider value={{ lang, setLang }}>{children}</LocaleContext.Provider>;
};
export default LocaleProvider;
```

_components/Locale.tsx_

```tsx
import { useContext } from 'react';
import i18next from 'i18next';
import { LocaleContext } from './LocaleProvider';

export default function Localize({ value }: { value: string }) {
  const { lang } = useContext(LocaleContext);
  return <>{i18next.t(value, { lng: lang })}</>;
}
```

### 2. Why does the search function of the antd dropdown not work after localization?

This occurs because Ant Design's dropdown search functionality performs string matching against the `label` property. When using React components for labels (after localization), the string matching fails since it's comparing against component objects rather than primitive strings.

The solution is to extend an enum with a `filterOption` method to help the Select component customize the search function, which will allow it to support the search functionality correctly.

You can refer to the code example below:

```tsx
import { Select } from 'antd';
import { Enum, type EnumItemClass } from 'enum-plus';

Enum.extends({
  filterOption: (search?: string, option?: EnumItemClass<number | string>) => {
    const label = $t(option?.raw?.label ?? '') ?? option?.value;
    return !search || label?.toUpperCase().includes(search.toUpperCase());
  },
});

// <Select options={WeekEnum.items} filterOption={WeekEnum.filterOption} />;
```

## Contributing

If you would like to contribute to this project, please follow the [CONTRIBUTING](CONTRIBUTING.md) guidelines outlined in the repository.
Feel free to submit issues, pull requests, or suggestions for improvements. Your contributions are greatly appreciated!

If you find a security issue, please follow the [Security Policy](SECURITY.md) to report it responsibly.

If you find this project useful, please consider giving it a star ⭐️ on GitHub. It helps others discover the project and encourages further development.
