<!-- markdownlint-disable MD009 -->

# enum-plus

A TypeScript enum library that is fully compatible with the native `enum` object usage, while extending some highly practical methods and supporting localization schemes. It can be a perfect replacement for `enum`.

[English](./README.md) | [中文](./README.zh-CN.md)

## Features

- Compatible with the usage of native `enum` types, can be used as a replacement for `enum`
- Supports both string and number enum types
- Extends a set of commonly used enum item collection operation methods, such as `label`, `key`, `options`, which can easily get the display text of enum items and can also be used to bind components like dropdowns
- Good support for TypeScript type inference
- Lightweight (only 4KB gzipped)

## Installation

Install using npm:

```bash
npm install enum-plus
```

Or yarn:

```bash
yarn add enum-plus
```

## Enum Definition

Generate an enum collection, enum values support both `number` and `string` types.

Example 1: Basic usage, almost the same as native enum usage

```js
import { Enum } from 'enum-plus';

const Week = Enum({
  Sunday: 0,
  Monday: 1,
} as const);
Week.Monday; // 1
```

Example 2: Use string as value type

```js
import { Enum } from 'enum-plus';

const Week = Enum({
  Sunday: 'Sun',
  Monday: 'Mon',
} as const);
Week.Monday; // 'Mon'
```

👍 Example 3 (Standard usage, recommended): Extend label enum item text

```js
import { Enum } from 'enum-plus';

const Week = Enum({
  Sunday: { value: 0, label: 'Sunday' },
  Monday: { value: 1, label: 'Monday' },
} as const);
Week.Monday; // 1
Week.label(1); // Monday
```

👍 Example 4: Omit the value field, automatically degrade to use the key field

```js
import { Enum } from 'enum-plus';

const Week = Enum({
  Sunday: { label: 'Sunday' }, // Equivalent to { value: "Sunday", label: 'Sunday' }
  Monday: { label: 'Monday' }, // Equivalent to { value: "Monday", label: 'Monday' }
} as const);
Week.Monday; // 'Monday'
Week.label('Monday'); // Monday
```

## API

- **Get enum value**

  You can directly get the enum value through the Key of the enum item, which is consistent with the usage of `enum` type, for example, `Week.Monday` = 1, `Week.Sunday` = 0

- **values** :`MyEnum.values: {value, label, key, raw}[]`

  Get the list of enum items

- **keys** : `MyEnum.keys: string[]`

  Get the list of keys of enum items

- **label** method : `label(keyOrValue?: string | number): string | undefined`

  Get the display text of an enum item based on a certain enum value or Key. If a localization method is set, the localized text will be returned.

- **key** method : `key(value?: string | number): K | undefined`

  Get the Key of an enum item based on the enum value

- **has** method : `has(keyOrValue?: string | number): boolean`

  Determine whether a certain enum item (value or Key) exists

- **options** method : `options(config?: OptionsConfig): {value, label}[]`

  Generate a data source array that conforms to the AntDesign specification, which can be directly passed to components like Select, Radio, Checkbox

- **valuesEnum** method : `valuesEnum(): Record<V, { text: string }>`

  Generate an enum collection object that conforms to the AntDesignPro specification, which can be passed to components like ProFormField, ProTable

- **filters** method : `filters(): { text, value }[]`

  Generate a filters array, which can be directly passed to the filters attribute of the Column of the AntDesign Table component as column filter options

- **raw** method : `raw(): T`

  Get the initialization object of the enum collection, which is the first parameter of the Enum method

- **raw** method : `raw(keyOrValue: V | K): T[K]`

  Get the original initialization object of a certain enum item. If custom fields are added to the enum item, you can use this method to get them.

- _(type only)_ **valueType** : `valueType: V`

  Get the data type of the enum value, note that this is a type declaration and cannot be called at runtime

- _(type only)_ **keyType** : `keyType: K`

  Get the data type of the key of the enum item, note that this is a type declaration and cannot be called at runtime

- _(type only)_ **rawType** : `rawType: T[K]`

  Get the type of the original initialization object of the enum item, note that this is a type declaration and cannot be called at runtime

## Usage

- **Access enum items, consistent with native enum usage**

```js
Week.Monday; // 1
Week.Sunday; // 0
```

- **Add custom fields**

```js
const Week = Enum({
  Sunday: { value: 0, label: 'Sunday', active: true, disabled: false },
  Monday: { value: 1, label: 'Monday', active: false, disabled: true },
} as const);
Week.raw(0).active // true
Week.raw(Week.Sunday).active // true
Week.raw('Sunday').active // true
```

- **Get array of enum items**

```js
Week.values;
// [
//  { value: 0, label: 'Sunday', key: 'Sunday', raw: { value: 0, label: 'Sunday' } },
//  { value: 1, label: 'Monday', key: 'Monday' }
// ]
```

- Get the value of the first enum item

```js
Week.values[0].value; // 0
```

- Determine whether a certain value is included in the enum

```js
Week.values.some(item => item.value === 1); // true
Week.has(1); // true
1 instance of Week; // true
```

- `instanceof` operator

```js
1 instance of Week // true
"1" instance of Week // true
"Monday" instance of Week // true
```

- Support traversing the array of enum items, but not modifying

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

- Get the display text of a certain value

```js
Week.label(1); // Monday
Week.label(Week.Monday); // Monday
Week.label('Monday'); // Monday
```

- Get the key of a certain enum item

```js
Week.key(1); // 'Monday'
Week.key(Week.Monday); // 'Monday'
Week.key(9); // undefined
```

- Optimization and syntactic sugar for [AntDesign](https://github.com/ant-design/ant-design)

  - `values` directly as the data source for components like `Select`, `Checkbox`

  ```jsx
  <Select options={Week.values} />
  ```

  - `options` method is similar to `values`, but can add a default option at the top

  ```jsx
  <Select options={Week.options({ firstOption: true })} />
  // [
  //  { value: '', label: 'All' },
  //  { value: 0, label: 'Sunday' },
  //  { value: 1, label: 'Monday' }
  // ]

  // Custom default option at the top
  <Select options={Week.options({ firstOption: { value: 0, label: 'Unlimited' } })} />
  ```

  - `menus` method can generate data sources for [AntDesign](https://github.com/ant-design/ant-design) `Menu`, `Dropdown` components, the format is: `{ key: number|string, label: string }[]`

  ```jsx
  <Menu items={Week.menus()} />
  ```

  - `filters` method can generate data sources for the `column filter` function of the [AntDesign](https://github.com/ant-design/ant-design) `Table` component, the format is: `{ text: string, value: number|string }[]`

  ```jsx
  const columns = [
    {
      title: 'Weekday',
      dataIndex: 'weekday',
      key: 'weekday',
      filters: Week.filters(),
    },
  ];
  <Table columns={columns} />;
  ```

  - `valuesEnum` method can generate data sources for `ProFormFields`, `ProTable` components of [AntDesignPro](https://github.com/ant-design/pro-components), which is a data structure similar to Map, the format is: `{ [key: number|string]: { text: string } }`

  ```jsx
  <ProFormSelect valueEnum={Week.valuesEnum()} />
  ```

- Merge two enums (or extend an enum)

```js
const myWeek = Enum({
  ...Week.raw(),
  Friday: { value: 5, label: 'Friday' },
  Saturday: { value: 6, label: 'Saturday' },
});
```

- _[TypeScript Only]_ 【Strongly recommended】 Use the data type of enum values

Use the `valueType` type to more precisely restrict the data type, which is better than using broad data types like number or string

```typescript
type FooComponentProps = {
  value?: typeof Week.valueType; // Data type narrowed from number to 0 | 1
  names?: typeof Week.keyType; // 'Sunday' | 'Monday'
};
```

- 😟 Naming conflict?

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

More extreme, what if `values` conflicts with the name of an enum item? Don't worry, you can still access the `values` array through an alias field. Refer to the example below:

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
//  { value: 1, label: 'foo' },
//  { value: 2, label: 'bar' },
//  { value: 3, label: 'values' }
// ]
// Equivalent to the original Week.values 🙂
```

## Localization

`enum-plus` itself does not provide internationalization functionality, but you can achieve localized text through the `localize` option. You need to maintain the language in your project and implement text localization in the `localize` method. You can also use any popular internationalization library, such as `i18next`.

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
      case 'weekday.sunday':
        return '星期日';
      case 'weekday.monday':
        return '星期一';
      default:
        return content;
    }
  } else {
    switch (content) {
      case 'weekday.sunday':
        return 'Sunday';
      case 'weekday.monday':
        return 'Monday';
      default:
        return content;
    }
  }
};
// ✅ Please use i18next or other internationalization libraries
const i18nLocalize = (content: string) => i18next.t(content);
// ✅ Or encapsulate it into a basic component
const componentLocalize = (content: string) => <Localize value={content} />;

const Week = Enum(
  {
    Sunday: { value: 0, label: 'weekday.sunday' },
    Monday: { value: 1, label: 'weekday.monday' },
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
