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
[![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/enum-plus?label=minzipped%20size&color=44cc11&cacheSeconds=86400)](https://www.npmjs.com/package/enum-plus)
[![npm downloads](https://img.shields.io/npm/dm/enum-plus.svg?label=Downloads&color=007ec6&cacheSeconds=86400)](https://www.npmjs.com/package/enum-plus)
[![code coverage](https://codecov.io/gh/shijistar/enum-plus/graph/badge.svg?token=JMCDJKLT0B)](https://codecov.io/gh/shijistar/enum-plus)
![GitHub License](https://img.shields.io/github/license/shijistar/enum-plus?label=License&color=ff8000&cacheSeconds=86400)

[![Node compatibility](https://img.shields.io/node/v/enum-plus?label=Node&color=33a0ff&cacheSeconds=86400)](https://github.com/shijistar/enum-plus)
[![Browser compatible](https://img.shields.io/badge/Web-Browser-brightgreen?logo=googlechrome)](https://www.npmjs.com/package/enum-plus)
[![MicroProgram](https://img.shields.io/badge/MiniProgram-eeeeee?logo=wechat)](https://www.npmjs.com/package/enum-plus)

⬇️ &nbsp;[Introduction](#introduction) | [Features](#features) | [Installation](#installation) | [Enum Initialization](#enum-initialization) | [API](#api) | [Usage](#usage) | [Naming Conventions](#naming-convention-best-practices) | [Localization](#localization) | [Extensibility](#extensibility) | [Compatibility](#compatibility) | [Q&A](#qa)&nbsp; ⬇️

## Introduction

`enum-plus` is an enhanced enum library that is fully compatible with the native `enum` and extends it with powerful features such as display text, localization, UI control binding, enum members traversal, and more useful extension methods. This lightweight, zero-dependency, TypeScript library works with any front-end framework.

With the extended display text capability, enum members can be used to generate dropdowns, checkboxes, and other UI controls with a single line of code. By using the extension methods of the enum, you can easily traverse the array of enum members, get the display text of a certain enum value, determine whether a value exists, etc. The display text of the enum member supports localization, which can return the corresponding text according to the current language environment, making the display text of the enum member more flexible and more in line with user needs.

What other exciting features are there? Please continue to explore! Or you can check out this usage video first.

<p align="center">
  <img src="./public/usage-screenshot.gif" width="500" alt="usage video" />
</p>

## Features

- Full compatibility with native `enum` behavior
- Support for multiple data types including `number` and `string`
- Enhanced enum members with customizable display text
- Built-in localization capabilities that integrate with any i18n library
- Streamlined conversion from enum values to human-readable display text
- Extensible design allowing unlimited custom fields on enum members
- Seamless integration with any UI libraries like [Ant Design](https://ant.design/components/overview), [ElementPlus](https://element-plus.org/en-US/component/overview.html), [Material-UI](https://mui.com/material-ui), in a single line of code
- Complete Node.js compatibility with SSR support
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

## Enum Initialization

This section shows the various ways to initialize enums using the `Enum` function. Understanding these different initialization formats allows you to choose the most convenient approach for your specific use case.

### 1. Simple `key-value` Format

The simplest format is a direct mapping of keys to values. This is similar to the native enum format.

```js
import { Enum } from 'enum-plus';

const WeekEnum = Enum({
  Sunday: 0,
  Monday: 1,
} as const);

WeekEnum.Monday; // 1
```

> The `as const` type assertion is used to ensure that the enum values are treated as `literal` types, otherwise they will be treated as `number` types. If you are using JavaScript, please remove the `as const`.

### 2. Simple `key-value` with String Values

This format is similar to the first one, allowing you to use `string` values.

```js
import { Enum } from 'enum-plus';

const WeekEnum = Enum({
  Sunday: 'Sun',
  Monday: 'Mon',
} as const);

WeekEnum.Monday; // 'Mon'
```

### 3. Standard Format (Recommended)

The standard format includes both a `value` and a `label` for each enum member. This is the most commonly used format and is recommended for most cases. This format allows you to specify a display text for each enum member, which can be used in UI components.

```js
import { Enum } from 'enum-plus';

const WeekEnum = Enum({
  Sunday: { value: 0, label: 'I love Sunday' },
  Monday: { value: 1, label: 'I hate Monday' },
} as const);

WeekEnum.Sunday; // 0
WeekEnum.label(0); // I love Sunday
```

### 4. Label-Only Format

This is useful when you want to use the key as the value.

```js
import { Enum } from 'enum-plus';

const WeekEnum = Enum({
  Sunday: { label: 'I love Sunday' },
  Monday: { label: 'I hate Monday' },
} as const);

WeekEnum.Sunday; // 'Sunday'
WeekEnum.label('Sunday'); // I love Sunday
```

### 5. Array Format

The array format is useful when you need to create enums dynamically, such as from API data. This allows for flexibility in [custom field mapping](#custom-field-mapping) to adapt to different data structures.

```js
import { Enum } from 'enum-plus';

const petTypes = await getPetsData();
// [   { value: 1, key: 'dog', label: 'Dog' },
//     { value: 2, key: 'cat', label: 'Cat' },
//     { value: 3, key: 'rabbit', label: 'Rabbit' }   ];
const PetTypes = Enum(petTypes);
```

### 6. Native Enum Format

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

### 💎 &nbsp; items

`{ value, label, key, raw }[]`

Returns a read-only array of all enum members. The array structure conforms to [Ant Design](https://ant.design/components/select#usage-upgrade) component specifications, which makes it possible to generate dropdown menus, checkboxes, and other UI controls with just one line of code. For more details, please refer to the usage examples below.

---

### 💎 &nbsp; keys

`string[]`

Returns a read-only array of all enum member `key`(s)

---

### 💎 &nbsp; label

<sup>**_\[Function]_**</sup> &nbsp; `label(keyOrValue?: string | number): string | undefined`

Gets the display text of an enum member based on a certain value or key. If localization has been set up, the localized text will be returned.

```js
WeekEnum.label(1); // Monday
WeekEnum.label('Monday'); // Monday, here is label, not key
WeekEnum.label('Monday'); // 星期日, or show localized text if localization is set up
```

---

### 💎 &nbsp; key

<sup>**_\[Function]_**</sup> &nbsp; `key(value?: string | number): string | undefined`

Get the key of an enum member based on the enum value, if the key is not found, return `undefined`.

```js
WeekEnum.key(1); // Monday (here is key, not label)
```

---

### 💎 &nbsp; has

<sup>**_\[Function]_**</sup> &nbsp; `has(keyOrValue?: string | number): boolean`

Determine whether a certain enum member (value or key) exists.

```js
WeekEnum.has(1); // true
WeekEnum.has('Sunday'); // true
WeekEnum.has(9); // false
WeekEnum.has('Birthday'); // false
```

---

### 💎 &nbsp; toSelect

<sup>**_\[Function]_**</sup> &nbsp; `toSelect(config?: OptionsConfig): {value, label}[]`

`toSelect` is similar to `items`, both return an array of all enum members. The difference is that the elements returned by `toSelect` only contain the `label` and `value` fields, no other extra fields. At the same time, the `toSelect` method allows inserting a default element at the beginning of the array, which is generally used for the default option (which means _all_, _none_, or _unlimited_, etc) of select control. Of course, you can customize this default option.

---

### 💎 &nbsp; toMenu

<sup>**_\[Function]_**</sup> &nbsp; `toMenu(): { key, label }[]`

Returns an array of all enum members that conforms to [Ant Design](https://ant.design/components/menu) specifications. It's used to generate the `Menu`, `Dropdown` controls, in a single line of code.

```js
import { Menu } from 'antd';

<Menu items={WeekEnum.toMenu()} />;
```

The data format is:

```js
[
  { key: 0, label: 'Sunday' },
  { key: 1, label: 'Monday' },
];
```

---

### 💎 &nbsp; toFilter

<sup>**_\[Function]_**</sup> &nbsp; `toFilter(): { text, value }[]`

Returns an array of enum members that can pass directly to the [Ant Design](https://ant.design/components/table#table-demo-head) Table component as `filters` property of a column. This is used to add a dropdown filter box in the table header to filter table data.

The data format is:

```js
[
  { text: 'Sunday', value: 0 },
  { text: 'Monday', value: 1 },
];
```

---

### 💎 &nbsp; toValueMap

<sup>**_\[Function]_**</sup> &nbsp; `toValueMap(): Record<V, { text: string }>`

Returns a value-to-text mapping object, which maps enum values to their display text, conforming to the [Ant Design Pro](https://procomponents.ant.design/en-US/components/schema#valueenum-1) specification. This is used to generate data sources for `ProFormField` series controls, and `ProTable`.

The data format is:

```js
{
  0: { text: 'Sunday' },
  1: { text: 'Monday' },
}
```

---

### 💎 &nbsp; raw

<sup>**_\[Override^1]_**</sup> &nbsp; `raw(): Record<K, T[K]>`
<br/>
<sup>**_\[Override^2]_**</sup> &nbsp; `raw(keyOrValue: V | K): T[K]`

The `raw` method is used to return the original initialization object of the enum collection, which is the object used to create the enum.

The second overload method is used to return the original initialization object of a single enum member.

The main purpose of the `raw` method is to get the extended custom fields of the enum members. Unlimited number of custom fields are allowed.

```js
const WeekEnum = Enum({
  Sunday: { value: 0, label: 'Sunday', happy: true },
  Monday: { value: 1, label: 'Monday', happy: false },
} as const);

WeekEnum.raw(0).happy; // true
WeekEnum.raw(0); // { value: 0, label: 'Sunday', happy: true }
WeekEnum.raw('Monday'); // { value: 1, label: 'Monday', happy: false }
WeekEnum.raw(); // { Sunday: { value: 0, label: 'Sunday', happy: true }, Monday: { value: 1, label: 'Monday', happy: false } }
```

---

### 💎 &nbsp; name

`string`

Display name for Enum types. When creating an enum, you can assign it a display name using the optional `name` parameter. This name can be either a plain string or a localization key to support internationalized text. For more details on localization, see the [Localization](#localization) section.

> Usually Enums are used to generate dropdown menus in form, or show member text in table cells. The display name of the enum type often serves as the form field label or table caption. By utilizing the `name` property, you can centralize the management of both the enum type's display name and its members' labels, simplifying maintenance and ensuring consistency across your application.

```js
const WeekEnum = Enum({
  Sunday: { value: 0, label: 'Sunday', happy: true },
  Monday: { value: 1, label: 'Monday', happy: false },
} as const, {
  name: 'i18n.enums.week', // A localization key
});

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

> Note: This is a TypeScript type only and cannot be called at runtime. Calling it at runtime will throw an exception.

---

## Usage

#### Picks enum values, consistent with native enums

```js
const WeekEnum = Enum({
  Sunday: { value: 0, label: 'Sunday' },
  Monday: { value: 1, label: 'Monday' },
} as const);

WeekEnum.Sunday; // 0
WeekEnum.Monday; // 1
```

---

#### Supports JSDoc comments on enum members

Supports inline documentation through JSDoc, allowing developers to view detailed comments by simply hovering over enum values in the editor.

```js
const WeekEnum = Enum({
  /** Represents Sunday */
  Sunday: { value: 0, label: 'Sunday' },
  /** Represents Monday */
  Monday: { value: 1, label: 'Monday' },
} as const);

WeekEnum.Monday; // Hover over Monday
```

![jsdoc](./public/jsdoc-en.png)

You can see that this hover functionality reveals both documentation and enum values simultaneously, without leaving your current position in the code.

---

#### Gets a read-only enum members array

```js
WeekEnum.items; // The output is:
// [
//  { value: 0, label: 'Sunday', key: 'Sunday', raw: { value: 0, label: 'Sunday' } },
//  { value: 1, label: 'Monday', key: 'Monday', raw: { value: 1, label: 'Monday' } },
// ]
```

---

#### Gets the first enum value

```js
WeekEnum.items[0].value; // 0
```

---

#### Checks if a value is a valid enum value

```js
WeekEnum.has(1); // true
WeekEnum.items.some((item) => item.value === 1); // true
1 instanceof WeekEnum; // true
```

---

#### `instanceof` operator

```js
1 instanceof WeekEnum; // true
'1' instanceof WeekEnum; // true
'Monday' instanceof WeekEnum; // true
```

---

#### Supports traversing enum members array

```js
WeekEnum.items.length; // 2
WeekEnum.items.map((item) => item.value); // [0, 1], ✅ Traversable
WeekEnum.items.forEach((item) => {}); // ✅ Traversable
for (const item of WeekEnum.items) {
  // ✅ Traversable
}
WeekEnum.items.push({ value: 2, label: 'Tuesday' }); // ❌ Not allowed, read-only
WeekEnum.items.splice(0, 1); // ❌ Not allowed, read-only
WeekEnum.items[0].label = 'foo'; // ❌ Not allowed, read-only
```

---

#### Gets enum display text by value (or key)

```js
WeekEnum.label(1); // Monday, here is label, not key
WeekEnum.label(WeekEnum.Monday); // Monday, here is label, not key
WeekEnum.label('Monday'); // Monday, get display text by key
```

---

#### Gets enum key by value

```js
WeekEnum.key(1); // 'Monday'
WeekEnum.key(WeekEnum.Monday); // 'Monday'
WeekEnum.key(9); // undefined, because it does not exist
```

---

#### Extends custom fields with unlimited numbers

```js
const WeekEnum = Enum({
  Sunday: { value: 0, label: 'Sunday', active: true, disabled: false },
  Monday: { value: 1, label: 'Monday', active: false, disabled: true },
} as const);

WeekEnum.raw(0).active; // true
WeekEnum.raw(WeekEnum.Sunday).active; // true
WeekEnum.raw('Sunday').active; // true
```

---

#### Converts to UI controls

- `Enum.items` can be consumed as control data sources (using Select as an example).

  **React-based UI libraries**

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

  **Vue-based UI libraries**

  [ElementPlus](https://element-plus.org/en-US/component/select.html) Select

  ```tsx
  <el-select>
    <el-option v-for="item in WeekEnum.items" v-bind="item" />
  </el-select>
  ```

  [Ant Design Vue](https://antdv.com/components/select) | [Arc Design](https://arco.design/vue/en-US/component/select) Select

  ```tsx
  <a-select :options="WeekEnum.items" />
  ```

  [Vuetify](https://vuetifyjs.com/en/components/selects/) Select

  ```tsx
  <v-select :items="WeekEnum.items" item-title="label" />
  ```

  **Angular-based UI libraries**

  [Angular Material](https://material.angular.io/components/select/overview) Select

  ```jsx
  <mat-select>
    @for (item of WeekEnum.items; track item.value) {
      <mat-option [value]="item.value">{{ item.label }}</mat-option>
    }
  </mat-select>
  ```

  [NG-ZORRO](https://ng.ant.design/components/select/zh) Select

  ```jsx
  <nz-select>
    @for (item of WeekEnum.items; track item.value) {
      <nz-option [nzValue]="item.value">{{ item.label }}</nz-option>
    }
  </nz-select>
  ```

- The `toSelect` method is similar to `items`, allows adding a default option at the beginning of the array. The default option can be a boolean value or a custom object.

  - If set to a boolean value, the default option is `{ value: '', label: 'All' }`, the display name only supports English. If you need localization, please parse and process the built-in resource key `enum-plus.options.all` in the localization method. For more details about localization, please refer to the [Localization](#localization) section.
  - If set to an object, you can customize the value and display text of the default option, and the display text will automatically support localization.

  ```tsx
  <Select options={WeekEnum.toSelect({ firstOption: true })} />
  // [
  //  { value: '', label: 'All' },
  //  { value: 0, label: 'Sunday' },
  //  { value: 1, label: 'Monday' }
  // ]

  // Add custom option at the top
  <Select options={WeekEnum.toSelect({ firstOption: { value: 0, label: 'Unlimited' } })} />
  ```

- `toMenu` method is used to generate data sources for [Ant Design](https://ant.design/components/menu#itemtype) `Menu`, `Dropdown` components.

```tsx
import { Menu } from 'antd';

<Menu items={WeekEnum.toMenu()} />;
```

- `toFilter` method is used to add a dropdown filter box in the [Ant Design](https://ant.design/components/table#table-demo-head) `Table` header to filter table data.

```tsx
import { Table } from 'antd';

const columns = [
  {
    title: 'week',
    dataIndex: 'week',
    filters: WeekEnum.toFilter(),
  },
];
// Add column filter at table header
<Table columns={columns} />;
```

- `toValueMap` method is used to generate data sources for binding the [Ant Design Pro](https://procomponents.ant.design/en-US/components/schema#valueenum-1) `ProFormField` series controls, and `ProTable`.

```tsx
import { ProFormCheckbox, ProFormRadio, ProFormSelect, ProFormTreeSelect, ProTable } from '@ant-design/pro-components';

<ProFormSelect valueEnum={WeekEnum.toValueMap()} />; // Select
<ProFormCheckbox valueEnum={WeekEnum.toValueMap()} />; // Checkbox
<ProFormRadio.Group valueEnum={WeekEnum.toValueMap()} />; // Radio
<ProFormTreeSelect valueEnum={WeekEnum.toValueMap()} />; // TreeSelect
<ProTable columns={[{ dataIndex: 'week', valueEnum: WeekEnum.toValueMap() }]} />; // ProTable
```

---

#### Merge two enums (or extend an enum)

```js
const myWeek = Enum({
  ...WeekEnum.raw(),
  Friday: { value: 5, label: 'Friday' },
  Saturday: { value: 6, label: 'Saturday' },
});
```

---

#### Narrowing the `number` type to enum value sequences &nbsp;&nbsp;<sup>_\[TypeScript ONLY]_</sup>

By leveraging the `valueType` type constraint, you can narrow variable types from broad primitives like `number` or `string` to precise enum value unions. This type narrowing not only prevents invalid assignments at compile time, but also enhances code readability and self-documentation while providing stronger type safety guarantees.

```typescript
const weekValue: number = 8; // 👎 Any number can be assigned to the week enum, even if it is wrong
const weekName: string = 'Birthday'; // 👎 Any string can be assigned to the week enum, even if it is wrong

const goodWeekValue: typeof WeekEnum.valueType = 1; // ✅ Type correct, 1 is a valid week enum value
const goodWeekName: typeof WeekEnum.keyType = 'Monday'; // ✅ Type correct, 'Monday' is a valid week enum name

const badWeekValue: typeof WeekEnum.valueType = 8; // ❌ Type error, 8 is not a valid week enum value
const badWeekName: typeof WeekEnum.keyType = 'Birthday'; // ❌ Type error, 'Birthday' is not a valid week enum name

type FooProps = {
  value?: typeof WeekEnum.valueType; // 👍 Component property type constraint, prevent erroneous assignment, and also prompts which values are valid
  names?: (typeof WeekEnum.keyType)[]; // 👍 Component property type constraint, prevent erroneous assignment, and also prompts which values are valid
};
```

---

#### Custom field mapping

In [5. Array Format](#5-array-format) section, we know that you can build an enum from dynamic data from the backend, but it is very likely that the field names of dynamic data are not `value`, `label`, `key`, but other field names. In this case, you can pass in a custom option to map these to other field names.

```js
import { Enum } from 'enum-plus';

const petTypes = await getPetsData();
// [   { id: 1, code: 'dog', name: 'Dog' },
//     { id: 2, code: 'cat', name: 'Cat' },
//     { id: 3, code: 'rabbit', name: 'Rabbit' }   ];
const PetTypes = Enum(petTypes, {
  getValue: 'id',
  getLabel: 'name',
  getKey: 'code', // getKey is optional
});
WeekEnum.items; // The output is:
// [   { value: 1, label: 'Dot', key: 'dog' },
//     { value: 2, label: 'Cat', key: 'cat' },
//     { value: 3, label: 'Rabbit', key: 'rabbit' }   ]
```

`getValue`, `getLabel`, `getKey` can also be a function to handle more complex business logic, for example:

```js
const PetTypes = Enum(petTypes, {
  getValue: (item) => item.id,
  getLabel: (item) => `${item.name} (${item.code})`,
  getKey: (item) => item.code,
});
```

---

#### Handling Name Conflicts?

When working with enums, a common edge case occurs when an enum member's key conflicts with built-in method names. While we typically access enum values through `WeekEnum.XXX` notation, complications arise when these keys overlap with enum methods.

The enum library provides several utility methods like `label`, `key`, and `toSelect`. When an enum member shares a name with these methods, the enum member takes precedence, effectively overriding the utility method. However, this doesn't mean you lose access to those methods - they remain available through the `items` collection, ensuring all functionality is preserved regardless of naming conflicts. Please refer to the code example below:

```js
const WeekEnum = Enum({
  foo: { value: 1 },
  bar: { value: 2 },
  keys: { value: 3 }, // Naming conflict
  label: { value: 4 }, // Naming conflict
} as const);

WeekEnum.keys; // 3, enum member has higher priority and will override the method
WeekEnum.label; // 4, enum member has higher priority and will override the method
// You can still access these methods through Enum.items 🙂
WeekEnum.items.keys; // ['foo', 'bar', 'keys', 'label']
WeekEnum.items.label(1); // 'foo'
```

For an even more extreme edge case where the items property itself conflicts with an enum member name, a solution is still available. In such scenarios, you can access the items array through a Symbol-based alias field that guarantees access regardless of naming conflicts. Consider the following example:

```js
import { ITEMS } from 'enum-plus';

const WeekEnum = Enum({
  foo: { value: 1 },
  bar: { value: 2 },
  items: { value: 3 }, // Naming conflict
} as const);

WeekEnum.items; // 3, enum member has higher priority and will override items
WeekEnum[ITEMS]; // ITEMS is an alias Symbol
// [
//  { value: 1, key: 'foo', label: 'foo' },
//  { value: 2, key: 'bar', label: 'bar' },
//  { value: 3, key: 'items', label: 'items' }
// ]
// Equivalent to the original WeekEnum.items 🙂
```

---

## Naming Convention Best Practices

1. **Enum Type Naming:** Use `PascalCase` and append with the `Enum` suffix (e.g., _WeekEnum_, _ColorEnum_).
2. **Enum Member Naming:** Use `PascalCase` for enum members(e.g., _WeekEnum.Sunday_, _ColorEnum.Red_). This naming style highlights the immutability and static nature of enum members, and ensures they appear at the top in IDE IntelliSense suggestions for easier selection.
3. **Semantic Clarity:** Ensure enum and member names have clear semantics. Good semantic naming serves as self-documentation, making code intent explicit and reducing cognitive overhead.
4. **Single Responsibility Principle:** Each enum type should represent a single, cohesive set of related constants. Avoiding overlapping responsibilities between different enum types.
5. **Provide JSDoc Comments:** Provide JSDoc comments for each enum member and the enum type itself, explaining their purpose and usage. Comprehensive documentation enables IDE hover tooltips and improves code readability and maintainability.
6. **Internationalization Architecture:** Plan for internationalization from the outset by leveraging the library’s built-in [localization](#localization) features. A well-designed internationalization architecture minimizes future refactoring and facilitates global scalability.

---

## Localization

While `enum-plus` doesn't include built-in internationalization capabilities, it offers flexible localization through the optional `localize` parameter. This allows you to implement a custom localization function that transforms enum `label` values into appropriate translated text based on the current language context. The language state management remains your responsibility, with your `localize` method determining which localized text to return. For production applications, we strongly recommend leveraging established internationalization libraries such as `i18next` rather than creating custom solutions.

Below is a simple example for illustration purposes. Note that the first approach is not recommended for production use due to its limited flexibility - it serves only to demonstrate the basic concept.

```tsx
import { Enum } from 'enum-plus';
import i18next from 'i18next';
import Localize from './Localize';

let lang = 'zh-CN';
const setLang = (l: string) => {
  lang = l;
};

// 👎 Not a good example, just for demonstration - not recommended for production
const sillyLocalize = (content: string) => {
  if (lang === 'zh-CN') {
    switch (content) {
      case 'enum-plus.options.all':
        return '全部';
      case 'weekDays.name':
        return '星期';
      case 'week.sunday':
        return '星期日';
      case 'week.monday':
        return '星期一';
      default:
        return content;
    }
  } else {
    switch (content) {
      case 'enum-plus.options.all':
        return 'All';
      case 'weekDays.name':
        return 'Week';
      case 'week.sunday':
        return 'Sunday';
      case 'week.monday':
        return 'Monday';
      default:
        return content;
    }
  }
};
// 👍 Recommended to use i18next or other internationalization libraries
const i18nLocalize = (content: string | undefined) => i18next.t(content);
// 👍 Or encapsulate it into a basic component
const componentLocalize = (content: string | undefined) => <Localize value={content} />;

const WeekEnum = Enum(
  {
    Sunday: { value: 0, label: 'week.sunday' },
    Monday: { value: 1, label: 'week.monday' },
  } as const,
  {
    localize: sillyLocalize,
    // localize: i18nLocalize, // 👍  Recommended to use i18n
    // localize: componentLocalize, // 👍  Recommended to use component
    name: 'weekDays.name', // Optional, the localized name of the enum type, generally used as table title or form field title
  }
);
setLang('zh-CN');
WeekEnum.label(1); // 星期一
WeekEnum.name; // 星期
setLang('en-US');
WeekEnum.label(1); // Monday
WeekEnum.name; // Week
```

For applications with consistent localization needs, the `Enum.localize` method offers a convenient way to set localization globally rather than configuring each enum individually. When enum-specific localization options are provided during initialization, these will override the global settings.

```js
Enum.localize = i18nLocalize;
```

---

## Extensibility

While `Enum` provides a comprehensive set of built-in methods, you can extend its functionality with custom methods using the `Enum.extends` API. These extensions are globally applied to all enum instances, including those created before the extension was applied, and take effect immediately without requiring any manual setup.

_**App.ts**_

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

If you are using TypeScript, you probably need to further extend the enum type declaration to get better type hints. Create or edit a declaration file in your project (e.g., `global.d.ts`) and extend the global type. This file can be placed in the root directory of the project or any other directory, just make sure TypeScript can find it.

_**global.d.ts**_

```tsx
import type { EnumItemInit } from 'enum-plus';
import type { EnumItemClass } from 'enum-plus/lib/enum-item';

declare global {
  export interface EnumExtension<T, K, V> {
    toMySelect: () => { value: V; title: string }[];
    reversedItems: () => EnumItemClass<EnumItemInit<V>, K, V>[];
  }
}
```

Please note that you are not required to import types such as `EnumItemInit` and `EnumItemClass`, they are only used in this example to provide better type hints.

`EnumExtension` is a generic interface that accepts three type parameters, which are:

- `T`: Initialization object of the enum type (e.g., the object passed to `Enum()`)
- `K`: Key of the enum member (e.g., Sunday, Monday)
- `V`: Value of the enum members

If you want to provide more friendly type hints in the extension methods, you may need to use these type parameters. However these are all optional, if you don't need them, you can omit them.

---

## Compatibility

- **Browser Environments**:

  - **Modern Bundlers**: With bundlers supporting the [exports](https://nodejs.org/api/packages.html#exports-sugar) field (Webpack 5+, Vite, Rollup), enum-plus targets `ES2020`. For broader browser support, transpile to earlier syntax using `@babel/preset-env` during your build process.

  - **Legacy Bundlers**: For tools without `exports` field support (like Webpack 4), enum-plus automatically falls back to the `main` field entry point, which targets `ES2016`.

  - **Polyfill Strategy**: enum-plus ships without polyfills to minimize bundle size. For legacy browser support, incorporate:

    - `core-js`
    - `@babel/preset-env` with appropriate `useBuiltIns` settings
    - Alternative polyfill implementations

- **Node.js Compatibility**: enum-plus requires a minimum of `ES2016` features, compatible with Node.js `v7.x` and above.

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
