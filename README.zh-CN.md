<!-- markdownlint-disable MD009 -->

# enum-plus

[English](./README.md) | [中文](./README.zh-CN.md)

> 与原生`enum`一样容易，但更强大得多

[![npm version](https://img.shields.io/npm/v/enum-plus.svg)](https://www.npmjs.com/package/enum-plus)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/enum-plus)](https://bundlephobia.com/result?p=enum-plus)
[![npm downloads](https://img.shields.io/npm/dm/enum-plus.svg)](https://www.npmjs.com/package/enum-plus)
![GitHub License](https://img.shields.io/github/license/shijistar/enum-plus?label=License&color=%23F68F1E)

⬇️&nbsp;&nbsp; [简介](#简介) | [特性](#特性) | [安装](#安装) | [枚举定义](#枚举定义) | [API](#api) | [使用方法](#使用方法) | [本地化](#本地化) &nbsp;&nbsp;⬇️

## 简介

`enum-plus`是一个增强版的枚举类库，完全兼容原生`enum`的基本用法，同时支持扩展显示文本、绑定到 UI 组件以及提供丰富的扩展方法，是原生`enum`的一个直接替代品。它是一个轻量级、零依赖、100% TypeScript 实现的工具，适用于多种前端框架，并支持本地化。

枚举项扩展了显示名称后，可以与枚举值用来一键生成下拉框、复选框等组件。通过枚举的扩展方法，可以轻松遍历枚举项数组，获取某个枚举值的显示文本，判断某个值是否存在等。枚举项的显示文本支持本地化，可以根据当前语言环境返回对应的文本，这样可以使得枚举项的显示文本更加灵活，更加符合用户的需求。

还有哪些令人兴奋的特性呢？请继续探索下面的技术文档吧！

## 特性

- 兼容原生 `enum` 的用法
- 支持`number`、`string`等多种数据类型
- 支持枚举项扩展显示文本
- 显示文本支持本地化，可以使用任意国际化类库
- 支持枚举值转换为显示文本，代码更简洁
- 枚举项支持扩展任意个自定义字段
- 支持将枚举绑定到 [AntDesign](https://ant.design/components/overview-cn)、[ElementPlus](https://element-plus.org/zh-CN/component/select.html)、[Material-UI](https://mui.com/material-ui) 或任意其它组件库，只要一行代码
- 零依赖，纯原生 JavaScript，可以应用在任意前端框架中
- 100% TypeScript 实现，支持类型推断
- 轻量(gzip 压缩后仅 2KB+)

## 安装

使用 npm 安装:

```bash
npm install enum-plus
```

使用 pnpm 安装:

```bash
pnpm add enum-plus
```

使用 bun 安装:

```bash
bun add enum-plus
```

或者使用 yarn:

```bash
yarn add enum-plus
```

## 枚举定义

构造一个枚举，枚举值支持 `number` 和 `string` 两种类型

#### 示例 1：基础用法，与原生枚举用法基本一致

```js
import { Enum } from 'enum-plus';

const Week = Enum({
  Sunday: 0,
  Monday: 1,
} as const);
Week.Monday; // 1
```

#### 示例 2：值类型使用 string

```js
import { Enum } from 'enum-plus';

const Week = Enum({
  Sunday: 'Sun',
  Monday: 'Mon',
} as const);
Week.Monday; // 'Mon'
```

#### 👍👍 【推荐】 示例 3（标准用法）：包含 Key、Value，以及显示文本

```js
import { Enum } from 'enum-plus';

const Week = Enum({
  Sunday: { value: 0, label: '星期日' }, // 此示例不包含本地化
  Monday: { value: 1, label: '星期一' }, // 此示例不包含本地化
} as const);
Week.Monday; // 1
Week.label(1); // 星期一
```

#### 👍 示例 4：如果 Key 与 Value 相同，可以采用省略写法

```js
import { Enum } from 'enum-plus';

const Week = Enum({
  Sunday: { label: '星期日' }, // 等价于 { value: "Sunday", label: '星期日' }
  Monday: { label: '星期一' }, // 等价于 { value: "Monday", label: '星期一' }
} as const);
Week.Monday; // 'Monday'
Week.label('Monday'); // 星期一
```

#### 示例 5：动态创建枚举

有时候我们需要使用接口返回的数据，动态创建一个枚举，这时可以采用数组的方式来初始化枚举

```js
import { Enum } from 'enum-plus';

const petTypes = await getPetsData();
// [   { id: 1, code: 'dog', name: '狗' },
//     { id: 2, code: 'cat', name: '猫' },
//     { id: 3, code: 'rabbit', name: '兔子' }   ];
const PetTypes = Enum(petTypes, {
  getValue: 'id',
  getLabel: 'name',
  getKey: 'code', // getKey可选，如果忽略则默认使用value作为Key
});
Week.values; // 输出如下:
// [   { value: 1, label: '狗', key: 'dog' },
//     { value: 2, label: '猫', key: 'cat' },
//     { value: 3, label: '兔子', key: 'rabbit' }   ]
```

## API

### 拾取枚举值

`Enum.XXX`

像原生`enum`一样，从枚举类型中拾取一个枚举项的值

```js
Week.Monday; // 1
Week.Sunday; // 0
```

---

### values

`{value, label, key, raw}[]`

获取一个包含全部枚举项的只读数组，可以方便地遍历枚举项。由于符合 [AntDesign](https://github.com/ant-design/ant-design) 组件的数据规范，因此支持将枚举一键转换成下拉框、复选框等组件，只需要一行代码，更多详情可以参考后面的例子

---

### keys

`string[]`

获取一个包含全部枚举项`Key`的只读数组

---

### label

<sup>**_[方法]_**</sup> `label(keyOrValue?: string | number): string | undefined`

根据某个枚举值或枚举 Key，获取该枚举项的显示文本。如果设置了本地化，则会返回本地化后的文本。

```js
Week.label(1); // 星期一
Week.label('Monday'); // 星期一
```

---

### key

<sup>**_[方法]_**</sup> `key(value?: string | number): string | undefined`

根据枚举值获取该枚举项的 Key，如果不存在则返回`undefined`

```js
Week.key(1); // 'Monday'
```

---

### has

<sup>**_[方法]_**</sup> `has(keyOrValue?: string | number): boolean`

判断某个枚举项（值或 Key）是否存在

```js
Week.has(1); // true
Week.has('Sunday'); // true
Week.has(9); // false
Week.has('Birthday'); // false
```

---

### options

<sup>**_[方法]_**</sup> `options(config?: OptionsConfig): {value, label}[]`

`options`与`values`相似，都是返回一个包含全部枚举项的数组。区别是，options 返回的元素只包含`label`和`value`两个字段，同时，options 方法支持在数组头部插入一个默认元素，一般用于下拉框等组件的默认选项，表示全部、无值或不限等，当然你也能够自定义这个默认选项

---

### valuesEnum

<sup>**_[方法]_**</sup> `valuesEnum(): Record<V, { text: string }>`

生成一个符合 [AntDesignPro](https://procomponents.ant.design/components/schema#valueenum) 规范的枚举集合对象，可以传递给 `ProFormField`、`ProTable` 组件。

数据格式为：

```js
{
  0: { text: '星期日' },
  1: { text: '星期一' },
}
```

---

### filters

<sup>**_[方法]_**</sup> `filters(): { text, value }[]`

生成一个 filters 数组，可以直接传递给 [AntDesign](https://ant.design/components/table-cn#table-demo-head) Table 组件的列配置，在表头中显示一个下拉筛选框，用来过滤表格数据

数据格式为：

```js
[
  { text: '星期日', value: 0 },
  { text: '星期一', value: 1 },
];
```

---

### raw

<sup>**_[方法重载^1]_**</sup> `raw(): Record<K, T[K]>`
<br/>
<sup>**_[方法重载^2]_**</sup> `raw(keyOrValue: V | K): T[K]`

第一个无参数的重载，返回枚举集合的初始化对象，即用来初始化 Enum 原始 init 对象。

第二个重载方法用来处理单个枚举项，根据枚举值或枚举 Key 获取该枚举项的原始初始化对象，也就是说第二个方法是第一个方法返回值的一部分。另外，如果在枚举项上添加了额外的扩展字段的话，也可以用这种方式获取到

```js
const Week = Enum({
  Sunday: { value: 0, label: '星期日' },
  Monday: { value: 1, label: '星期一' },
} as const);

Week.raw(); // { Sunday: { value: 0, label: '星期日' }, Monday: { value: 1, label: '星期一' } }
Week.raw(0); // { value: 0, label: '星期日' }
Week.raw('Monday'); // { value: 1, label: '星期一' }
```

---

### valueType <sup>**_[Type-ONLY]_**</sup>

`value1 | value2 | ...`

在 TypeScript 中，获取一个包含全部枚举值的联合类型，用于缩小变量或组件属性的数据类型，避免使用`number`、`string`这种过于宽泛的类型，提高代码的可读性和类型安全性

```typescript
const weekValue: typeof Week.valueType = 1;
const weeks: typeof Week.valueType[] = [0, 1];
type WeekValues = typeof Week.valueType; // 0 | 1
```

> 注意，这只是一个 TypeScript 类型，只能用来约束类型，不可在运行时调用，运行时调用会抛出异常

---

### keyType <sup>**_[Type-ONLY]_**</sup>

`key1 | key2 | ...`

与`valueType`类似，获取一个包含全部枚举 Key 的联合类型

```typescript
const weekKey: typeof Week.keyType = 'Monday';
const weekKeys: typeof Week.keyType[] = ['Sunday', 'Monday'];
type WeekKeys = typeof Week.keyType; // 'Sunday' | 'Monday'
```

> 注意，这只是一个 TypeScript 类型，只能用来约束类型，不可在运行时调用，运行时调用会抛出异常

---

### rawType <sup>**_[Type-ONLY]_**</sup>

`{ value: V, label: string, [...] }`

与无参数的`raw`方法类似，只不过`raw`方法支持在运行时调用，而`rawType`只能用来约束类型

> 注意，这只是一个 TypeScript 类型，只能用来约束类型，不可在运行时调用，运行时调用会抛出异常

---

## 使用方法

#### 访问枚举项，与原生枚举用法一致

```js
const Week = Enum({
  Sunday: { value: 0, label: '星期日' },
  Monday: { value: 1, label: '星期一' },
} as const);

Week.Monday; // 1
Week.Sunday; // 0
```

---

#### 可保留 Jsdoc 注释，代码提示更友好

在代码编辑器中，将光标悬停在枚举项上，即可显示关于该枚举项的详细 Jsdoc 注释，而不必再转到枚举定义处查看。另外，在输入`HttpCodes.`时，编辑器也会自动提示枚举项列表，通过键盘上下键切换枚举项，也可以展示详细信息

```js
const HttpCodes = Enum({
  /** Code400: 错误的请求语法。由于被认为是客户端错误（例如，错误的请求语法、无效的请求消息帧或欺骗性的请求路由），服务器无法或不会处理请求 */
  E400: { value: 400, label: 'Bad Request' },
  /** Code400: 未经授权。客户端必须对自身进行身份验证才能获得请求的响应 */
  E401: { value: 401, label: 'Unauthorized' },
  /** Code403: 禁止访问。客户端没有访问内容的权限；也就是说，它是未经授权的，因此服务器拒绝提供请求的资源。与 401 Unauthorized 不同，服务器知道客户端的身份 */
  E403: { value: 0, label: 'Forbidden' },
  /** Code404: 未找到。服务器找不到请求的资源。在浏览器中，这意味着无法识别 URL */
  E404: { value: 1, label: 'Not Found' },
} as const);

HttpCodes.E404; // 将光标悬停在 E404 上，将显示Jsdoc文档注释
```

> 上面的代码示例中，Http 状态码的释义内容参考自 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)

---

#### 获取枚举项数组

```js
Week.values; // 输出如下:
// [
//  { value: 0, label: '星期日', key: 'Sunday', raw: { value: 0, label: '星期日' } },
//  { value: 1, label: '星期一', key: 'Monday', raw: { value: 1, label: '星期一' } }
// ]
```

---

#### 获取第一个枚举项的值

```js
Week.values[0].value; // 0
```

---

#### 判断枚举中是否包含某个值

```js
Week.values.some(item => item.value === 1); // true
Week.has(1); // true
1 instance of Week; // true
```

---

#### `instanceof` 操作符

```js
1 instance of Week // true
"1" instance of Week // true
"Monday" instance of Week // true
```

---

#### 支持遍历枚举项数组，但不支持修改

```js
Week.values.length; // 2
Week.values.map((item) => item.value); // [0, 1]，✅ 可遍历
Week.values.forEach((item) => {}); // ✅ 可遍历
for (let item of Week.values) {
  // ✅ 可遍历
}
Week.values.push({ value: 2, label: '星期二' }); // ❌ 不可修改
Week.values.splice(0, 1); // ❌ 不可修改
Week.values[0].label = 'foo'; // ❌ 不可修改
```

---

#### 获取某个值的显示文本

```js
Week.label(1); // 星期一，
Week.label(Week.Monday); // 星期一
Week.label('Monday'); // 星期一
```

---

#### 获取某个枚举项的 key

```js
Week.key(1); // 'Monday'
Week.key(Week.Monday); // 'Monday'
Week.key(9); // undefined, 不存在
```

---

#### 添加扩展字段

```js
const Week = Enum({
  Sunday: { value: 0, label: '星期日', active: true, disabled: false },
  Monday: { value: 1, label: '星期一', active: false, disabled: true },
} as const);
Week.raw(0).active // true
Week.raw(Week.Sunday).active // true
Week.raw('Sunday').active // true
```

---

#### 针对 [AntDesign](https://github.com/ant-design/ant-design) 组件库的优化和语法糖

- `values`直接作为`Select`、`Checkbox`等组件的数据源

```jsx
import { Select } from 'antd';
<Select options={Week.values} />;
```

- `options`方法与`values`类似，但可选在头部增加一个默认选项

```jsx
<Select options={Week.options({ firstOption: true })} />
// [
//  { value: '', label: 'All' },
//  { value: 0, label: 'Sunday' },
//  { value: 1, label: 'Monday' }
// ]

// 自定义头部默认选项
<Select options={Week.options({ firstOption: { value: 0, label: 'Unlimited' } })} />
```

- `menus`方法可以为 [AntDesign](https://github.com/ant-design/ant-design) `Menu`、`Dropdown` 等组件生成数据源，格式为：`{ key: number|string, label: string }[]`

```jsx
import { Menu } from 'antd';
<Menu items={Week.menus()} />;
```

- `filters`方法可以为 [AntDesign](https://github.com/ant-design/ant-design) `Table` 组件的`列筛选`功能生成数据源，格式为：`{ text: string, value: number|string }[]`

```jsx
import { Table } from 'antd';
const columns = [
  {
    title: 'week',
    dataIndex: 'week',
    filters: Week.filters(),
  },
];
// 在表头中显示下拉筛选项
<Table columns={columns} />;
```

- `valuesEnum`方法可以为 [AntDesignPro](https://github.com/ant-design/pro-components) 的`ProFormFields`、`ProTable`等组件生成数据源，这是一个类似 Map 的数据结构，格式为：`{ [key: number|string]: { text: string } }`

```jsx
import { ProTable } from '@ant-design/pro-components';
<ProFormSelect valueEnum={Week.valuesEnum()} />;
```

---

#### 两个枚举合并（或者扩展某个枚举）

```js
const myWeek = Enum({
  ...Week.raw(),
  Friday: { value: 5, label: '星期五' },
  Saturday: { value: 6, label: '星期六' },
});
```

---

#### 使用枚举值序列来缩小数据类型 &nbsp;&nbsp;<sup>_[TypeScript ONLY]_</sup>

使用 `valueType` 类型约束，可以将字段类型从宽泛的`number`或`string`类型缩小为有限的枚举值序列，这不但能减少错误赋值的可能性，还能提高代码的可读性。

```typescript
const weekValue: number = 8; // 👎 任意数字都可以赋值给周枚举，即使错误的
const weekName: string = 'Birthday'; // 👎 任意字符串都可以赋值给周枚举，即使错误的

const badWeekValue: typeof Week.valueType = 8; // ❌ 类型错误，8 不是一个有效的周枚举值
const badWeekName: typeof Week.keyType = 'Birthday'; // ❌ 类型错误，'Birthday' 不是一个有效的周枚举名

const goodWeekValue: typeof Week.valueType = 1; // ✅ 类型正确，1 是一个有效的周枚举值
const goodWeekName: typeof Week.keyType = 'Monday'; // ✅ 类型正确，'Monday' 是一个有效的周枚举名

type FooProps = {
  value?: typeof Week.valueType; // 👍 组件属性类型约束，可以防止错误赋值，还能智能提示有效值有哪些
  names?: typeof Week.keyType[]; // 👍 组件属性类型约束，可以防止错误赋值，还能智能提示有效值有哪些
};
```

---

#### 😟 命名冲突？

这里为枚举使用添加一些边界情况，从上面的用例中可以看到，我们可以通过 `Week.XXX` 来快捷访问枚举项，但是万一枚举项的 key 与枚举方法命名冲突怎么办？

我们知道枚举类型上还存在 `label`、`key`、`options` 等方法，如果与某个枚举项重名，枚举项的值优先级更高，会覆盖掉这些方法。但不用担心，你可以在 `values` 下访问到它们。请参考下面的代码示例：

```js
const Week = Enum({
  foo: { value: 1 },
  bar: { value: 2 },
  keys: { value: 3 }, // 命名冲突
  label: { value: 4 }, // 命名冲突
} as const);
Week.keys; // 3，枚举项优先级更高，会覆盖掉方法
Week.label; // 4，枚举项优先级更高，会覆盖掉方法
// 可以通过 values 访问到这些方法 🙂
Week.values.keys // ['foo', 'bar', 'keys', 'label']
Week.values.label(1); // 'foo'
```

更极端一些，万一`values`与枚举项命名冲突怎么办？放心，你仍然可以通过别名字段访问到`values`数组。参考下面的示例：

```js
import { VALUES } from 'enum-plus';

const Week = Enum({
  foo: { value: 1 },
  bar: { value: 2 },
  values: { value: 3 }, // 命名冲突
} as const);

Week.values; // 3，枚举项优先级更高，会覆盖掉 values
Week[VALUES]; // VALUES 是一个别名Symbol
// [
//  { value: 1, key: 'foo', label: 'foo' },
//  { value: 2, key: 'bar', label: 'bar' },
//  { value: 3, key: 'values', label: 'values' }
// ]
// 等价于原来的 Week.values 🙂
```

---

## 本地化

`enum-plus` 本身不提供国际化功能，但支持通过设置 `localize` 可选自定义方法来实现本地化文本。你可以在项目内声明一个本地化方法，把输入的枚举`label`转换成对应的本地化文本。你需要自己维护语言，并且在 `localize` 方法中针对当前语言返回对应的文本。如果可能的话，强烈建议你使用一个流行的国际化库，比如 `i18next`

下面是一个简单的示例，但第一种方式并不是一个好的实践，因为它不够灵活，仅用于演示基本功能

```tsx
import { Enum } from 'enum-plus';
import i18next from 'i18next';
import Localize from './Localize';

let lang = 'zh-CN';
const setLang = (l: string) => {
  lang = l;
};

// ❌ 这不是一个好例子，仅为了演示基础功能，请采用后面其它的方式
const sillyLocalize = (content: string) => {
  if (lang === 'zh-CN') {
    switch (content) {
      case 'week.sunday':
        return '星期日';
      case 'week.monday':
        return '星期一';
      default:
        return content;
    }
  } else {
    switch (content) {
      case 'week.sunday':
        return 'Sunday';
      case 'week.monday':
        return 'Monday';
      default:
        return content;
    }
  }
};
// ✅ 建议使用 i18next 或其他国际化库
const i18nLocalize = (content: string | undefined) => i18next.t(content);
// ✅ 或者封装成一个基础组件
const componentLocalize = (content: string | undefined) => <Localize value={content} />;

const Week = Enum(
  {
    Sunday: { value: 0, label: 'week.sunday' },
    Monday: { value: 1, label: 'week.monday' },
  } as const,
  {
    localize: sillyLocalize,
    // localize: i18nLocalize, // 👍 推荐使用i18类库
    // localize: componentLocalize, // 👍 推荐使用组件形式
  }
);
setLang('zh-CN');
Week.label(1); // 星期一
setLang('en-US');
Week.label(1); // Monday
```

每个枚举类型都这样设置可能比较繁琐，你也可以通过 `Enum.localize` 方法来全局设置。如果静态设置和初始化选项两者同时存在，则枚举类型的初始化选项方式优先级更高。

```js
Enum.localize = sillyLocalize;
```
