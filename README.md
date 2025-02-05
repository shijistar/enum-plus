<!-- markdownlint-disable MD009 -->

# enum-plus

[English](./README.md) | [中文](./README.zh-CN.md)

> Like native `enum`, but much better than that!

[![npm version](https://img.shields.io/npm/v/enum-plus.svg)](https://www.npmjs.com/package/enum-plus)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/enum-plus)](https://bundlephobia.com/result?p=enum-plus)
[![npm downloads](https://img.shields.io/npm/dm/enum-plus.svg)](https://www.npmjs.com/package/enum-plus)
![GitHub License](https://img.shields.io/github/license/shijistar/enum-plus?label=License&color=%23F68F1E)

⬇️ &nbsp;&nbsp; [Introduction](#introduction) | [Features](#features) | [Installation](#installation) | [Enum Definition](#enum-definition) | [API](#api) | [Usage](#usage) | [Localization](#localization) &nbsp;&nbsp;⬇️

## Introduction

`enum-plus` is an enhanced enum library that is fully compatible with the basic usage of native `enum`, while supporting extending display text, binding to UI components, and providing rich extension methods. It is a lightweight, zero-dependency, 100% TypeScript implementation tool that is suitable for a variety of front-end frameworks and supports localization.

After extending the display name of the enum item, it can be used to generate dropdowns, checkboxes, and other components with a single line of code. By using the extension methods of the enum, you can easily traverse the array of enum items, get the display text of a certain enum value, determine whether a value exists, etc. The display text of the enum item supports localization, which can return the corresponding text according to the current language environment, making the display text of the enum item more flexible and more in line with user needs.

What other exciting features are there? Please continue to explore the technical documentation below!

## Features

- Fully compatible with native `enum` usage
- Supports multiple data types such as `number` and `string`
- Support extending display text for enum items>
- Display text supports localization, you can use any internationalization library
- Support converting enum values to display text, making the code more concise
- Enum items support extending any number of custom fields
- Supports binding enums to [AntDesign](https://ant.design/components/overview), [ElementPlus](https://element-plus.org/en-US/component/overview.html), [Material-UI](https://mui.com/material-ui) or any other libraries, in a single line of code
- Zero dependencies, pure native JavaScript, can be applied to any front-end framework
- 100% TypeScript implementation, good support for type inference
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

## Enum Definition

Create an enum, enum values support both `number` and `string` types

#### Example 1: Basic usage, almost the same as native enum

```js
import { Enum } from 'enum-plus';

const Week = Enum({
  Sunday: 0,
  Monday: 1,
} as const);
Week.Monday; // 1
```

#### Example 2: string value type

```js
import { Enum } from 'enum-plus';

const Week = Enum({
  Sunday: 'Sun',
  Monday: 'Mon',
} as const);
Week.Monday; // 'Mon'
```

#### 👍👍 [Recommended] Example 3 (standard usage): With key, value, and display text

```js
import { Enum } from 'enum-plus';

const Week = Enum({
  Sunday: { value: 0, label: 'Sunday' }, // this example does not consider localization
  Monday: { value: 1, label: 'Monday' }, // this example does not consider localization
} as const);
Week.Monday; // 1
Week.label(1); // Monday (this is display text, not key)
```

#### 👍 Example 4: Omit the value field, automatically degrade to use the key field

```js
import { Enum } from 'enum-plus';

const Week = Enum({
  Sunday: { label: 'Sunday' }, // Equivalent to { value: "Sunday", label: 'Sunday' }
  Monday: { label: 'Monday' }, // Equivalent to { value: "Monday", label: 'Monday' }
} as const);
Week.Monday; // 'Monday'
Week.label('Monday'); // Monday
```

#### Example 5: Create an enum dynamically

````js

Sometimes we need to create an enum dynamically using data returned by an api, in this case, we can use an array to initialize the enum

```js
import { Enum } from 'enum-plus';

const petTypes = await getPetsData();
// [   { id: 1, code: 'dog', name: 'Dog' },
//     { id: 2, code: 'cat', name: 'Cat' },
//     { id: 3, code: 'rabbit', name: 'Rabbit' }   ];
const PetTypes = Enum(petTypes, {
  getValue: 'id',
  getLabel: 'name',
  getKey: 'code', // Optional, if omitted, value is used as Key as fallback
});
Week.values; // Output is:
// [   { value: 1, label: 'Dog', key: 'dog' },
//     { value: 2, label: 'Cat', key: 'cat' },
//     { value: 3, label: 'Rabbit', key: 'rabbit' }   ]
````

## API

### Pick enum value

`Enum.XXX`

Like native `enum`, pick a value of an enum item from the enum type

```js
Week.Monday; // 1
Week.Sunday; // 0
```

---

### values

`{value, label, key, raw}[]`

Get a read-only array containing all enum items, which can be easily traversed. Since it conforms to the data specification of [AntDesign](https://github.com/ant-design/ant-design) components, it supports one-click conversion of enums into components such as dropdowns and checkboxes, with just a single line of code. For more details, please refer to the examples below.

---

### keys

`string[]`

Get a read-only array containing all `Key` of the enum items

---

### label

<sup>**_[Function]_**</sup> `label(keyOrValue?: string | number): string | undefined`

Get the display text of an enum item based on a certain enum value or Key. If localization is setup, the localized text will be returned.

```js
Week.label(1); // Monday
Week.label('Monday'); // Monday (this is label, not key)
```

---

### key

<sup>**_[Function]_**</sup> `key(value?: string | number): string | undefined`

Get the Key of an enum item based on the enum value, if the Key is not found, return `undefined`.

```js
Week.key(1); // Monday (this is key, not label)
```

---

### has

<sup>**_[Function]_**</sup> `has(keyOrValue?: string | number): boolean`

Determine whether a certain enum item (value or Key) exists

```js
Week.has(1); // true
Week.has('Sunday'); // true
Week.has(9); // false
Week.has('Birthday'); // false
```

---

### options

<sup>**_[Function]_**</sup> `options(config?: OptionsConfig): {value, label}[]`

`options` is similar to `values`, both return an array containing all enum items. The difference is that the elements returned by `options` only contain the `label` and `value` fields. At the same time, the `options` method supports inserting a default element at the beginning of the array, which is generally used for the default option of components such as dropdowns, representing all, none, or unlimited, etc., of course, you can also customize this default option

---

### valuesEnum

<sup>**_[Function]_**</sup> `valuesEnum(): Record<V, { text: string }>`

Generate an enum collection object that conforms to the [AntDesignPro](https://procomponents.ant.design/en-US/components/schema) specification, which can be passed to components like `ProFormField`, `ProTable`

The data format is:

```js
{
  0: { text: 'Sunday' },
  1: { text: 'Monday' },
}
```

---

### filters

<sup>**_[Function]_**</sup> `filters(): { text, value }[]`

Generate an array of filters that can be passed directly to the `Column.filters` of the [AntDesign](https://ant.design/components/table#table-demo-head) Table component as a list of filtered items for the column, displaying a dropdown filter box in the table header to filter table data

The data format is:

```js
[
  { text: 'Sunday', value: 0 },
  { text: 'Monday', value: 1 },
];
```

---

### raw

<sup>**_[Override^1]_**</sup> `raw(): Record<K, T[K]>`
<br/>
<sup>**_[Override^2]_**</sup> `raw(keyOrValue: V | K): T[K]`

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

### valueType <sup>**_[Type-ONLY]_**</sup>

`value1 | value2 | ...`

In TypeScript, get a union type containing all enum values, used to narrow the data type of variables or component properties, avoid using `number`, `string` and other overly broad types, improve code readability and type safety

```typescript
const weekValue: typeof Week.valueType = 1;
const weeks: typeof Week.valueType[] = [0, 1];
type WeekValues = typeof Week.valueType; // 0 | 1
```

> Note that this is only a TypeScript type, which can only be used to constrain types and cannot be called at runtime, calling at runtime will throw an exception

---

### keyType <sup>**_[Type-ONLY]_**</sup>

`key1 | key2 | ...`

Similar to `valueType`, get a union type containing all enum Keys

```typescript
const weekKey: typeof Week.keyType = 'Monday';
const weekKeys: typeof Week.keyType[] = ['Sunday', 'Monday'];
type WeekKeys = typeof Week.keyType; // 'Sunday' | 'Monday'
```

> Note that this is only a TypeScript type, which can only be used to constrain types and cannot be called at runtime, calling at runtime will throw an exception

---

### rawType <sup>**_[Type-ONLY]_**</sup>

`{ value: V, label: string, [...] }`

Similar to the `raw` method without parameters, but the `raw` method supports runtime calls, while `rawType` can only be used to constrain types

> Note that this is only a TypeScript type, which can only be used to constrain types and cannot be called at runtime, calling at runtime will throw an exception

---

## Usage

#### Access enum items, consistent with native enum usage

```js
const Week = Enum({
  Sunday: { value: 0, label: 'Sunday' },
  Monday: { value: 1, label: 'Monday' },
} as const);

Week.Monday; // 1
Week.Sunday; // 0
```

---

#### Keep Jsdoc comments, more friendly code hints

In the code editor, hover over an enum item to display detailed Jsdoc comments about the enum item, without having to go back to the enum definition. In addition, when entering `HttpCodes.`, the editor will automatically prompt the enum item list, switch enum items through the up and down keys, and also display detailed information

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

HttpCodes.E404; // Hover over E404 to display Jsdoc documentation
```

> In the above code example, the interpretation of Http status codes is based on [MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

---

#### Get array of enum items

```js
Week.values; // Output is:
// [
//  { value: 0, label: 'Sunday', key: 'Sunday', raw: { value: 0, label: 'Sunday' } },
//  { value: 1, label: 'Monday', key: 'Monday', raw: { value: 1, label: 'Monday' } },
// ]
```

---

#### Get the value of the first enum item

```js
Week.values[0].value; // 0
```

---

#### Determine whether a certain value is included in the enum

```js
Week.values.some(item => item.value === 1); // true
Week.has(1); // true
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

#### Support traversing the array of enum items, but not modifying

```js
Week.values.length; // 2
Week.values.map((item) => item.value); // [0, 1], ✅ Traversable
Week.values.forEach((item) => {}); // ✅ Traversable
for (let item of Week.values) {
  // ✅ Traversable
}
Week.values.push({ value: 2, label: 'Tuesday' }); // ❌ Not modifiable
Week.values.splice(0, 1); // ❌ Not modifiable
Week.values[0].label = 'foo'; // ❌ Not modifiable
```

---

#### Get the display text of a certain value

```js
Week.label(1); // Monday
Week.label(Week.Monday); // Monday
Week.label('Monday'); // Monday
```

---

#### Get the key of a certain enum item

```js
Week.key(1); // 'Monday', this is label, not key
Week.key(Week.Monday); // 'Monday', this is label, not key
Week.key(9); // undefined, not found
```

---

#### Add custom fields

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

- `values` can be consumed as the data source (here uses Select as examples)

  [AntDesign](https://ant.design/components/select-cn) Select

  ```jsx
  import { Select } from 'antd';
  <Select options={Week.values} />;
  ```

  [Material-UI](https://mui.com/material-ui/react-select/) Select

  ```jsx
  import { Select, MenuItem } from '@mui/material';
  <Select>
    {Week.values.map((item) => (
      <MenuItem key={item.value} value={item.value}>
        {item.label}
      </MenuItem>
    ))}
  </Select>;
  ```

  [Kendo UI](https://www.telerik.com/kendo-angular-ui/components/dropdowns/select/) Select

  ```jsx
  import { DropDownList } from '@progress/kendo-react-dropdowns';
  <DropDownList data={Week.values} textField="label" dataItemKey="value" />;
  ```

  [ElementPlus](https://element-plus.org/zh-CN/component/select.html) Select

  ```jsx
  <el-select>
    <el-option v-for="item in Week.values" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
  ```

  [Vuetify](https://vuetifyjs.com/en/components/selects/) Select

  ```jsx
  <v-select :items="Week.values" item-title="label" item-value="value" />
  ```

  [Angular Material](https://material.angular.io/components/select/overview) Select

  HTML

  ```html
  <mat-select>
    <mat-option *ngFor="let item of Week.values" [value]="item.value">{{ item.label }}</mat-option>
  </mat-select>
  ```

  [NG-ZORRO](https://ng.ant.design/components/select/zh) Select

  HTML

  ```html
  <nz-select>
    <nz-option *ngFor="let item of Week.values" [nzValue]="item.value">{{ item.label }}</nz-option>
  </nz-select>
  ```

- `options` method is similar to `values`, but is allowed to add a default option at the top. The default option can be a boolean value or a custom object.
  - If set to a boolean value, the default option is `{ value: '', label: 'All' }`, the display name only supports English. If you need localization, please parse and process the built-in resource  key `enum-plus.options.all` in the localization method. For more details about localization, please refer to the [Localization](#localization) section
  - If set to an object, you can customize the value and display text of the default option, and the display text will automatically support localization


  ```jsx
  <Select options={Week.options({ firstOption: true })} />
  // [
  //  { value: '', label: 'All' },
  //  { value: 0, label: 'Sunday' },
  //  { value: 1, label: 'Monday' }
  // ]

  // Add custom option at the top
  <Select options={Week.options({ firstOption: { value: 0, label: 'Unlimited' } })} />
  ```

- `menus` method can generate data sources for [AntDesign](https://github.com/ant-design/ant-design) `Menu`, `Dropdown` components, the format is: `{ key: number|string, label: string }[]`

```jsx
import { Menu } from 'antd';
<Menu items={Week.menus()} />;
```

- `filters` method can generate data sources for the `Column filters` feature of the [AntDesign](https://github.com/ant-design/ant-design) `Table` component, the format is: `{ text: string, value: number|string }[]`

```jsx
import { Table } from 'antd';
const columns = [
  {
    title: 'week',
    dataIndex: 'week',
    filters: Week.filters(),
  },
];
// Add column filter at table header
<Table columns={columns} />;
```

- `valuesEnum` method can generate data sources for `ProFormFields`, `ProTable` components of [AntDesignPro](https://github.com/ant-design/pro-components), which is a data structure similar to `Map`, the format is: `{ [key: number|string]: { text: string } }`

```jsx
import { ProTable } from '@ant-design/pro-components';
<ProFormSelect valueEnum={Week.valuesEnum()} />;
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

#### Narrowing data types with enum value sequences &nbsp;&nbsp;<sup>_[TypeScript ONLY]_</sup>

By using the `valueType` type constraint, you can narrow the field type from the broad `number` or `string` type to a limited sequence of enum values, which not only reduces the possibility of erroneous assignments, but also improves the readability of the code.

```typescript
const weekValue: number = 8; // 👎 Any number can be assigned to the week enum, even if it is wrong
const weekName: string = 'Birthday'; // 👎 Any string can be assigned to the week enum, even if it is wrong

const badWeekValue: typeof Week.valueType = 8; // ❌ Type error, 8 is not a valid week enum value
const badWeekName: typeof Week.keyType = 'Birthday'; // ❌ Type error, 'Birthday' is not a valid week enum name

const goodWeekValue: typeof Week.valueType = 1; // ✅ Type correct, 1 is a valid week enum value
const goodWeekName: typeof Week.keyType = 'Monday'; // ✅ Type correct, 'Monday' is a valid week enum name

type FooProps = {
  value?: typeof Week.valueType; // 👍 Component property type constraint, prevent erroneous assignment, and also prompt which values are valid
  names?: typeof Week.keyType[]; // 👍 Component property type constraint, prevent erroneous assignment, and also prompt which values are valid
};
```

---

#### 😟 Naming conflict?

Here are some edge cases for using enums. As seen from the above examples, we can quickly access enum items through `Week.XXX`, but what if the key of an enum item conflicts with the name of an enum method?

We know that there are methods like `label`, `key`, `options` on the enum type. If they have the same name as an enum item, the enum item's value has a higher priority and will override these methods. But don't worry, you can access them under `values`. Please refer to the code example below:

```js
const Week = Enum({
  foo: { value: 1 },
  bar: { value: 2 },
  keys: { value: 3 }, // Naming conflict
  label: { value: 4 }, // Naming conflict
} as const);
Week.keys; // 3, enum item has higher priority and will override the method
Week.label; // 4, enum item has higher priority and will override the method
// You can access these methods through values 🙂
Week.values.keys // ['foo', 'bar', 'keys', 'label']
Week.values.label(1); // 'foo'
```

An even more extreme case, what if `values` conflicts with the name of an enum item? Don't worry, you can still access the `values` array through an alias field. Refer to the example below:

```js
import { VALUES } from 'enum-plus';

const Week = Enum({
  foo: { value: 1 },
  bar: { value: 2 },
  values: { value: 3 }, // Naming conflict
} as const);

Week.values; // 3, enum item has higher priority and will override values
Week[VALUES]; // VALUES is an alias Symbol
// [
//  { value: 1, key: 'foo', label: 'foo' },
//  { value: 2, key: 'bar', label: 'bar' },
//  { value: 3, key: 'values', label: 'values' }
// ]
// Equivalent to the original Week.values 🙂
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

// ❌ This is not a good example, just to demonstrate basic functionality, please use other methods later
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
// ✅ Recommended to use i18next or other internationalization libraries
const i18nLocalize = (content: string | undefined) => i18next.t(content);
// ✅ Or encapsulate it into a basic component
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
