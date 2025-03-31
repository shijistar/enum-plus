<!-- markdownlint-disable MD001 MD009 MD033 MD041 -->

[English](./README.md) | [中文](./README.zh-CN.md)

<p align="center">
  <a href="https://github.com/shijistar/enum-plus" target="blank">
    <img src="https://cdn.jsdelivr.net/npm/enum-plus@2.2.3/public/enum-plus.svg" width="240" alt="enum-plus" />
  </a>
</p>

<p align="center">
  <strong>Like native enum, but much better!</strong>
</p>
<br/>

[![npm version](https://img.shields.io/npm/v/enum-plus.svg?color=red)](https://www.npmjs.com/package/enum-plus)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/enum-plus)](https://bundlephobia.com/result?p=enum-plus)
[![npm downloads](https://img.shields.io/npm/dm/enum-plus.svg)](https://www.npmjs.com/package/enum-plus)
![GitHub License](https://img.shields.io/github/license/shijistar/enum-plus?label=License&color=%23F68F1E)

⬇️ &nbsp;&nbsp; [Introduction](#introduction) | [Features](#features) | [Installation](#installation) | [Enum Definition](#enum-definition) | [API](#api) | [Usage](#usage) | [Localization](#localization) | [Global Extension](#global-extension) &nbsp;&nbsp; ⬇️

## Introduction

`enum-plus` is an enhanced enum library that is fully compatible with the basic usage of native `enum`, while supporting extending display text, binding to UI components, and providing rich extension methods. It is a lightweight, zero-dependency, 100% TypeScript implementation tool that is suitable for a variety of front-end frameworks and supports localization.

After extending the display name of the enum item, it can be used to generate dropdowns, checkboxes, and other components with a single line of code. By using the extension methods of the enum, you can easily traverse the array of enum items, get the display text of a certain enum value, determine whether a value exists, etc. The display text of the enum item supports localization, which can return the corresponding text according to the current language environment, making the display text of the enum item more flexible and more in line with user needs.

What other exciting features are there? Please continue to explore the technical documentation below!

<p align="center">
  <img src="https://cdn.jsdelivr.net/npm/enum-plus@2.2.3/public/usage-screenshot.gif" width="500" alt="usage video" />
</p>

## Features

- Fully compatible with native `enum` usage
- Supports multiple data types such as `number` and `string`
- Support extending display text for enum items
- Supports localization of display texts, is compatible with any internationalization library
- Supports converting enum values to display text, making the code more concise
- Enum items support extending any number of custom fields
- Supports binding enums to [Ant Design](https://ant.design/components/overview), [ElementPlus](https://element-plus.org/en-US/component/overview.html), [Material-UI](https://mui.com/material-ui) or any other libraries, in a single line of code
- Supports Node.js environment, supports server-side rendering (SSR)
- Zero dependencies, pure native JavaScript, can be applied to any front-end framework
- 100% TypeScript implementation, good support for type inference
- Lightweight (only 1KB+ gzipped)

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

## Enum Definition

Create an enum, enum values support both `number` and `string` types

- ### Example 1: Basic usage, almost the same as native enum

```js
import { Enum } from 'enum-plus';

const Week = Enum({
  Sunday: 0,
  Monday: 1,
} as const);
Week.Monday; // 1
```

- ### Example 2: string enum values

```js
import { Enum } from 'enum-plus';

const Week = Enum({
  Sunday: 'Sun',
  Monday: 'Mon',
} as const);
Week.Monday; // 'Mon'
```

- ### 👍 [Recommended] Example 3 (standard usage): with Key, Value, and Display text

```js
import { Enum } from 'enum-plus';

const Week = Enum({
  Sunday: { value: 0, label: 'Sunday' }, // this example does not consider localization
  Monday: { value: 1, label: 'Monday' }, // this example does not consider localization
} as const);
Week.Monday; // 1
Week.label(1); // Monday (here is display text, not key)
```

- ### Example 4: omit the value field

If the `value` is the same as the Key, you can consider omitting the `value` field and using the Key instead

```js
import { Enum } from 'enum-plus';

const Week = Enum({
  Sunday: { label: 'Sunday' }, // Equivalent to { value: "Sunday", label: 'Sunday' }
  Monday: { label: 'Monday' }, // Equivalent to { value: "Monday", label: 'Monday' }
} as const);
Week.Monday; // 'Monday'
Week.label(/*key*/ 'Monday'); // Monday, output display text
```

- ### Example 5: Create from dynamic array

Sometimes we need to create an enum dynamically using data returned by an api, in this case, we can use an array to initialize the enum

```js
import { Enum } from 'enum-plus';

const petTypes = await getPetsData();
// [   { value: 1, key: 'dog', label: 'Dog' },
//     { value: 2, key: 'cat', label: 'Cat' },
//     { value: 3, key: 'rabbit', label: 'Rabbit' }   ];
const PetTypes = Enum(petTypes);
```

For more advanced usages, please refer to the [Custom initialization options](#custom-initialization-options) section

- ### Example 6: initialized from native enum (i.e. extend native enum with additional methods)

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
const Week = Enum(init);
Week.Sunday; // 0
Week.Monday; // 1
Week.Saturday; // 6
Week.label('Sunday'); // Sunday
```

## API

### Pick an enum value

`Enum.XXX`

Like native `enum`, just pick an enum value

```js
Week.Sunday; // 0
Week.Monday; // 1
```

---

### items

`{ value, label, key, raw }[]`

Get a read-only array containing all enum items, which can be easily traversed. Since it conforms to the data specification of [Ant Design](https://github.com/ant-design/ant-design) components, it supports one-click conversion of enums into components such as dropdowns and checkboxes, with just a single line of code. For more details, please refer to the examples below.

---

### keys

`string[]`

Get a read-only array containing all `Key` of the enum items

---

### label

<sup>**_[Function]_**</sup> &nbsp; `label(keyOrValue?: string | number): string | undefined`

Get the display text of an enum item based on a certain enum value or Key. If localization is setup, the localized text will be returned.

```js
Week.label(1); // Monday
Week.label('Monday'); // Monday (here is label, not key)
```

---

### key

<sup>**_[Function]_**</sup> &nbsp; `key(value?: string | number): string | undefined`

Get the Key of an enum item based on the enum value, if the Key is not found, return `undefined`.

```js
Week.key(1); // Monday (here is key, not label)
```

---

### has

<sup>**_[Function]_**</sup> &nbsp; `has(keyOrValue?: string | number): boolean`

Determine whether a certain enum item (value or Key) exists

```js
Week.has(1); // true
Week.has('Sunday'); // true
Week.has(9); // false
Week.has('Birthday'); // false
```

---

### toSelect

<sup>**_[Function]_**</sup> &nbsp; `toSelect(config?: OptionsConfig): {value, label}[]`

`toSelect` is similar to `items`, both return an array containing all enum items. The difference is that the elements returned by `toSelect` only contain the `label` and `value` fields. At the same time, the `toSelect` method supports inserting a default element at the beginning of the array, which is generally used for the default option of components such as dropdowns, representing all, none, or unlimited, etc., of course, you can also customize this default option

---

### toMenu

<sup>**_[Function]_**</sup> &nbsp; `toMenu(): { key, label }[]`

Generate an object array that can be bound to the `Menu`, `Dropdown` components of [Ant Design](https://ant.design/components/menu)

```js
import { Menu } from 'antd';

<Menu items={Week.toMenu()} />;
```

The data format is:

```js
[
  { key: 0, label: 'Sunday' },
  { key: 1, label: 'Monday' },
];
```

---

### toFilter

<sup>**_[Function]_**</sup> &nbsp; `toFilter(): { text, value }[]`

Generate an array of filters that can be passed directly to the `Column.filters` of the [Ant Design](https://ant.design/components/table#table-demo-head) Table component as a list of filtered items for the column, displaying a dropdown filter box in the table header to filter table data

The data format is:

```js
[
  { text: 'Sunday', value: 0 },
  { text: 'Monday', value: 1 },
];
```

---

### toValueMap

<sup>**_[Function]_**</sup> &nbsp; `toValueMap(): Record<V, { text: string }>`

Generate an enum collection object that conforms to the [Ant Design Pro](https://procomponents.ant.design/en-US/components/schema) specification, which can be passed to components like `ProFormField`, `ProTable`

The data format is:

```js
{
  0: { text: 'Sunday' },
  1: { text: 'Monday' },
}
```

---

### raw

<sup>**_[Override^1]_**</sup> &nbsp; `raw(): Record<K, T[K]>`
<br/>
<sup>**_[Override^2]_**</sup> &nbsp; `raw(keyOrValue: V | K): T[K]`

The first overload without parameters returns the initialization object of the enum collection, which is used to initialize the Enum original init object.

The second overload method is used to process a single enum item. Get the original initialization object of the enum item based on the enum value or enum Key, that is, the return value of the first method is part of the return value of the second method. In addition, if additional extension fields are added to the enum item, they can also be obtained in this way

```js
const Week = Enum({
  Sunday: { value: 0, label: 'Sunday' },
  Monday: { value: 1, label: 'Monday' },
} as const);

Week.raw(); // { Sunday: { value: 0, label: 'Sunday' }, Monday: { value: 1, label: 'Monday' } }
Week.raw(0); // { value: 0, label: 'Sunday' }
Week.raw('Monday'); // { value: 1, label: 'Monday' }
```

---

### valueType &nbsp; <sup>**_[Type-ONLY]_**</sup>

`value1 | value2 | ...`

In TypeScript, get a union type containing all enum values, used to narrow the data type of variables or component properties, avoid using `number`, `string` and other overly broad types, improve code readability and type safety

```typescript
const weekValue: typeof Week.valueType = 1;
const weeks: (typeof Week.valueType)[] = [0, 1];
type WeekValues = typeof Week.valueType; // 0 | 1
```

> Note that here is only a TypeScript type, which can only be used to constrain types and cannot be called at runtime, calling at runtime will throw an exception

---

### keyType &nbsp; <sup>**_[Type-ONLY]_**</sup>

`key1 | key2 | ...`

Similar to `valueType`, get a union type containing all enum Keys

```typescript
const weekKey: typeof Week.keyType = 'Monday';
const weekKeys: (typeof Week.keyType)[] = ['Sunday', 'Monday'];
type WeekKeys = typeof Week.keyType; // 'Sunday' | 'Monday'
```

> Note that here is only a TypeScript type, which can only be used to constrain types and cannot be called at runtime, calling at runtime will throw an exception

---

### rawType &nbsp; <sup>**_[Type-ONLY]_**</sup>

`{ value: V, label: string, [...] }`

Similar to the `raw` method without parameters, but the `raw` method supports runtime calls, while `rawType` can only be used to constrain types

> Note that here is only a TypeScript type, which can only be used to constrain types and cannot be called at runtime, calling at runtime will throw an exception

---

## Usage

#### Pick enum values, consistent with native enum usage

```js
const Week = Enum({
  Sunday: { value: 0, label: 'Sunday' },
  Monday: { value: 1, label: 'Monday' },
} as const);

Week.Sunday; // 0
Week.Monday; // 1
```

---

#### Support Jsdoc comments, more friendly code hints

In the code editor, hover over an enum item to display detailed Jsdoc comments about the enum item, without having to go back to the enum definition. In addition, when entering `HttpCodes.`, the editor will automatically prompt the enum item list, switch enum items through the up and down keys, and you can also see the detailed Jsdoc comments of each one.

```js
const HttpCodes = Enum({
  /** Code400: Bad Request. The server cannot or will not process the request due to an apparent client error (e.g., malformed request syntax, invalid request message framing, or deceptive request routing) */
  E400: { value: 400, label: 'Bad Request' },
  /** Code400: Unauthorized. The client must authenticate itself to get the requested response */
  E401: { value: 401, label: 'Unauthorized' },
  /** Code403: Forbidden. The client does not have access rights to the content; that is, it is unauthorized, so the server is refusing to give the requested resource. Unlike 401 Unauthorized, the server knows the client's identity */
  E403: { value: 0, label: 'Forbidden' },
  /** Code404: Not Found. The server can not find the requested resource. In a browser, this means the URL is not recognized */
  E404: { value: 1, label: 'Not Found' },
} as const);

HttpCodes.E404; // Hover over E404 to display full Jsdoc comments
```

> The interpretation of Http status is referenced from [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)

---

#### Get an array of all enum items

```js
Week.items; // Output is:
// [
//  { value: 0, label: 'Sunday', key: 'Sunday', raw: { value: 0, label: 'Sunday' } },
//  { value: 1, label: 'Monday', key: 'Monday', raw: { value: 1, label: 'Monday' } },
// ]
```

---

#### Get the first enum value

```js
Week.items[0].value; // 0
```

---

#### Check if a value is a valid enum value

```js
Week.has(1); // true
Week.items.some(item => item.value === 1); // true
1 instance of Week; // true
```

---

#### `instanceof` operator

```js
1 instance of Week // true
"1" instance of Week // true
"Monday" instance of Week // true
```

---

#### Support traversing enum items array, readonly

```js
Week.items.length; // 2
Week.items.map((item) => item.value); // [0, 1], ✅ Traversable
Week.items.forEach((item) => {}); // ✅ Traversable
for (let item of Week.items) {
  // ✅ Traversable
}
Week.items.push({ value: 2, label: 'Tuesday' }); // ❌ Not modifiable
Week.items.splice(0, 1); // ❌ Not modifiable
Week.items[0].label = 'foo'; // ❌ Not modifiable
```

---

#### Get enum display text by value (or key)

```js
Week.label(1); // Monday
Week.label(Week.Monday); // Monday
Week.label('Monday'); // Monday
```

---

#### Get enum key by value

```js
Week.key(1); // 'Monday', here is label, not key
Week.key(Week.Monday); // 'Monday', here is label, not key
Week.key(9); // undefined, because it does not exist
```

---

#### Extend custom fields with unlimited numbers

```js
const Week = Enum({
  Sunday: { value: 0, label: 'Sunday', active: true, disabled: false },
  Monday: { value: 1, label: 'Monday', active: false, disabled: true },
} as const);
Week.raw(0).active // true
Week.raw(Week.Sunday).active // true
Week.raw('Sunday').active // true
```

---

#### Convert to UI components

- `items` can be consumed as the data source (here uses Select as examples)

  [Ant Design](https://ant.design/components/select) | [Arco Design](https://arco.design/react/en-US/components/select)
  Select

  ```tsx
  import { Select } from 'antd';

  <Select options={Week.items} />;
  ```

  [Material-UI](https://mui.com/material-ui/react-select/) Select

  ```tsx
  import { MenuItem, Select } from '@mui/material';

  <Select>
    {Week.items.map((item) => (
      <MenuItem key={item.value} value={item.value}>
        {item.label}
      </MenuItem>
    ))}
  </Select>;
  ```

  [Kendo UI](https://www.telerik.com/kendo-react-ui/components/dropdowns/dropdownlist) Select

  ```tsx
  import { DropDownList } from '@progress/kendo-react-dropdowns';

  <DropDownList data={Week.items} textField="label" dataItemKey="value" />;
  ```

  [ElementPlus](https://element-plus.org/en-US/component/select.html) Select

  ```tsx
  <el-select>
    <el-option v-for="item in Week.items" v-bind="item" />
  </el-select>
  ```

  [Ant Design Vue](https://antdv.com/components/select) | [Arc Design](https://arco.design/vue/en-US/component/select) Select

  ```tsx
  <a-select :options="Week.items" />
  ```

  [Vuetify](https://vuetifyjs.com/en/components/selects/) Select

  ```tsx
  <v-select :items="Week.items" item-title="label" />
  ```

  [Angular Material](https://material.angular.io/components/select/overview) Select

  HTML

  ```html
  <mat-select>
    <mat-option *ngFor="let item of Week.items" [value]="item.value">{{ item.label }}</mat-option>
  </mat-select>
  ```

  [NG-ZORRO](https://ng.ant.design/components/select/zh) Select

  HTML

  ```html
  <nz-select>
    <nz-option *ngFor="let item of Week.items" [nzValue]="item.value">{{ item.label }}</nz-option>
  </nz-select>
  ```

- `toSelect` method is similar to `items`, but is allowed to add a default option at the top. The default option can be a boolean value or a custom object.

  - If set to a boolean value, the default option is `{ value: '', label: 'All' }`, the display name only supports English. If you need localization, please parse and process the built-in resource key `enum-plus.options.all` in the localization method. For more details about localization, please refer to the [Localization](#localization) section
  - If set to an object, you can customize the value and display text of the default option, and the display text will automatically support localization

  ```tsx
  <Select options={Week.toSelect({ firstOption: true })} />
  // [
  //  { value: '', label: 'All' },
  //  { value: 0, label: 'Sunday' },
  //  { value: 1, label: 'Monday' }
  // ]

  // Add custom option at the top
  <Select options={Week.toSelect({ firstOption: { value: 0, label: 'Unlimited' } })} />
  ```

- `toMenu` method can generate data sources for [Ant Design](https://github.com/ant-design/ant-design) `Menu`, `Dropdown` components, the format is: `{ key: number|string, label: string } []`

```tsx
import { Menu } from 'antd';

<Menu items={Week.toMenu()} />;
```

- `toFilter` method can generate an object array for binding the `column filter` function to the table, displaying a dropdown filter box in the table header to filter table data. The object structure follows the data specification of [Ant Design](https://ant.design/components/table#table-demo-head) Table component, the format is: `{ text: string, value: number|string } []`

```tsx
import { Table } from 'antd';

const columns = [
  {
    title: 'week',
    dataIndex: 'week',
    filters: Week.toFilter(),
  },
];
// Add column filter at table header
<Table columns={columns} />;
```

- `toValueMap` method can generate data sources for `ProFormFields`, `ProTable` components of [Ant Design Pro](https://github.com/ant-design/pro-components), which is a data structure similar to `Map`, the format is: `{ [key: number|string]: { text: string } }`

```tsx
import { ProTable } from '@ant-design/pro-components';

<ProFormSelect valueEnum={Week.toValueMap()} />;
```

---

#### Merge two enums (or extend an enum)

```js
const myWeek = Enum({
  ...Week.raw(),
  Friday: { value: 5, label: 'Friday' },
  Saturday: { value: 6, label: 'Saturday' },
});
```

---

#### Narrowing the `number` type to enum value sequences &nbsp;&nbsp;<sup>_[TypeScript ONLY]_</sup>

By using the `valueType` type constraint, you can narrow the field type from the broad `number` or `string` type to a limited sequence of enum values, which not only reduces the possibility of erroneous assignments, but also improves the readability of the code

```typescript
const weekValue: number = 8; // 👎 Any number can be assigned to the week enum, even if it is wrong
const weekName: string = 'Birthday'; // 👎 Any string can be assigned to the week enum, even if it is wrong

const goodWeekValue: typeof Week.valueType = 1; // ✅ Type correct, 1 is a valid week enum value
const goodWeekName: typeof Week.keyType = 'Monday'; // ✅ Type correct, 'Monday' is a valid week enum name

const badWeekValue: typeof Week.valueType = 8; // ❌ Type error, 8 is not a valid week enum value
const badWeekName: typeof Week.keyType = 'Birthday'; // ❌ Type error, 'Birthday' is not a valid week enum name

type FooProps = {
  value?: typeof Week.valueType; // 👍 Component property type constraint, prevent erroneous assignment, and also prompts which values are valid
  names?: (typeof Week.keyType)[]; // 👍 Component property type constraint, prevent erroneous assignment, and also prompts which values are valid
};
```

---

#### Custom initialization options

In [Example 5: Create from dynamic array](#example-5-create-from-dynamic-array) section, we know that you can build an enum from dynamic data from the backend, but it is very likely that the field names of dynamic data are not `value`, `label`, `key`, but other field names. In this case, you can pass in a custom option to map these to other field names

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
Week.items; // Output is:
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

#### 😟 Naming conflict?

Here are some edge cases for using enums. As seen from the above examples, we can quickly access enum items through `Week.XXX`, but what if the key of an enum item conflicts with the name of an enum method?

We know that there are methods like `label`, `key`, `toSelect` on the enum type. If they have the same name as an enum item, the enum item's value has a higher priority and will override these methods. But don't worry, you can access them under `items`. Please refer to the code example below:

```js
const Week = Enum({
  foo: { value: 1 },
  bar: { value: 2 },
  keys: { value: 3 }, // Naming conflict
  label: { value: 4 }, // Naming conflict
} as const);
Week.keys; // 3, enum item has higher priority and will override the method
Week.label; // 4, enum item has higher priority and will override the method
// You can access these methods through items 🙂
Week.items.keys // ['foo', 'bar', 'keys', 'label']
Week.items.label(1); // 'foo'
```

An even more extreme case, what if `items` conflicts with the name of an enum item? Don't worry, you can still access the `items` array through an alias field. Refer to the example below:

```js
import { ITEMS } from 'enum-plus';

const Week = Enum({
  foo: { value: 1 },
  bar: { value: 2 },
  items: { value: 3 }, // Naming conflict
} as const);

Week.items; // 3, enum item has higher priority and will override items
Week[ITEMS]; // ITEMS is an alias Symbol
// [
//  { value: 1, key: 'foo', label: 'foo' },
//  { value: 2, key: 'bar', label: 'bar' },
//  { value: 3, key: 'items', label: 'items' }
// ]
// Equivalent to the original Week.items 🙂
```

---

## Localization

`enum-plus` does not provide internationalization functionality itself, but supports custom localization methods through the `localize` optional parameter. You can declare a localization method in your project to convert the input enum `label` into the corresponding localized text. You need to maintain the language yourself and return the corresponding text for the current language in the `localize` method. If possible, it is strongly recommended that you use a popular internationalization library, such as `i18next`

Here is a simple example, but the first method is not a good practice because it is not flexible enough, and is only used to demonstrate basic functionality

```tsx
import { Enum } from 'enum-plus';
import i18next from 'i18next';
import Localize from './Localize';

let lang = 'zh-CN';
const setLang = (l: string) => {
  lang = l;
};

// 👎 This is not a good example, just to demonstrate basic functionality, please use other methods later
const sillyLocalize = (content: string) => {
  if (lang === 'zh-CN') {
    switch (content) {
      case 'enum-plus.options.all':
        return '全部';
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

const Week = Enum(
  {
    Sunday: { value: 0, label: 'week.sunday' },
    Monday: { value: 1, label: 'week.monday' },
  } as const,
  {
    localize: sillyLocalize,
    // localize: i18nLocalize, // 👍  Recommended to use i18n
    // localize: componentLocalize, // 👍  Recommended to use component
  }
);
setLang('zh-CN');
Week.label(1); // 星期一
setLang('en-US');
Week.label(1); // Monday
```

Setting each enum type individually can be cumbersome. You can also set localization globally using the `Enum.localize` method. If both static settings and initialization options are provided, the initialization options take precedence.

```js
Enum.localize = sillyLocalize;
```

---

## Global Extension

`Enum` has provided some helpful methods, but if these methods are not enough to you, you can add custom extension functions via the `Enum.extend` method. These extension methods will be added to all enum types, even if the enum type has been created before the extension, it will take effect immediately

_**App.ts**_

```tsx
Enum.extend({
  toMySelect(this: ReturnType<typeof Enum>) {
    return this.items.map((item) => ({ value: item.value, title: item.label }));
  },
  reversedItems(this: ReturnType<typeof Enum>) {
    return this.items.reverse();
  },
});

Week.toMySelect(); // [{ value: 0, title: 'Sunday' }, { value: 1, title: 'Monday' }]
```

If you are using TypeScript, you probably need to further extend the enum type declaration to get better type hints. Create or edit a declaration file in your project (e.g. `global.d.ts`) and extend the global type. This file can be placed in the root directory of the project or any other directory, just make sure TypeScript can find it

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

Please note that you are not required to import types such as `EnumItemInit` and `EnumItemClass`, they are only used in this example to provide better type hints

`EnumExtension` is a generic interface that accepts three type parameters, which are:

- `T`: Initialization object of the enum type
- `K`: Key value of the enum item
- `V`: Value of the enum item

If you want to provide more friendly type hints in the extension methods, you may need to use these type parameters. However these are all optional, if you don't need them, you can omit them.

---

## Compatibility

For browser environments, enum-plus provides good compatibility support

- For modern packaging tool supports parsing the [exports](https://nodejs.org/api/packages.html#exports-sugar) configuration (such as Webpack 5+, Vite, Rollup, etc.), enum-plus outputs version `ES2020`. If you want to be compatible with lower versions of browsers, you can use `@babel/preset-env` to convert to lower version syntax during the build process
- For legacy version of packaging tools (such as Webpack 4), enum-plus outputs version `ES2016`.

For Node.js environments, `enum-plus` is compatible with `ES2016`, which corresponds to Node.js version `v7.x`. The latest version of `enum-plus` is compatible with Node.js version `v18.x` and above.

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

This is because the search function of the antd dropdown is based on `label`, and after supporting internationalization, `label` returns a component instead of a regular string, so Antd cannot perform string matching correctly. The solution is to extend the enum with a `filterOption` method to help the Select component customize the search function, which will allow it to support the search function correctly.

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
