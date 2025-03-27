<!-- markdownlint-disable MD001 MD009 MD033 MD041 -->

[English](./README.md) | [中文](./README.zh-CN.md)

<p align="center">
  <a href="https://github.com/shijistar/enum-plus" target="blank">
    <img src="https://cdn.jsdelivr.net/npm/enum-plus@2.2.3/public/enum-plus.svg" width="240" alt="enum-plus" />
  </a>
</p>

<p align="center">
  <strong>像原生 enum 一样容易，但更强大！</strong>
</p>
<br/>

[![npm version](https://img.shields.io/npm/v/enum-plus.svg?color=red)](https://www.npmjs.com/package/enum-plus)
[![npm bundle size](https://img.shields.io/bundlephobia/minzip/enum-plus)](https://bundlephobia.com/result?p=enum-plus)
[![npm downloads](https://img.shields.io/npm/dm/enum-plus.svg)](https://www.npmjs.com/package/enum-plus)
![GitHub License](https://img.shields.io/github/license/shijistar/enum-plus?label=License&color=%23F68F1E)

⬇️ &nbsp;&nbsp; [简介](#简介) | [特性](#特性) | [安装](#安装) | [枚举定义](#枚举定义) | [API](#api) | [使用方法](#使用方法) | [本地化](#本地化) | [全局扩展](#全局扩展) &nbsp;&nbsp; ⬇️

## 简介

`enum-plus`是一个增强版的枚举类库，完全兼容原生`enum`的基本用法，同时支持扩展显示文本、绑定到 UI 组件以及提供丰富的扩展方法，是原生`enum`的一个直接替代品。它是一个轻量级、零依赖、100% TypeScript 实现的工具，适用于多种前端框架，并支持本地化。

枚举项扩展了显示名称后，可以与枚举值用来一键生成下拉框、复选框等组件。通过枚举的扩展方法，可以轻松遍历枚举项数组，获取某个枚举值的显示文本，判断某个值是否存在等。枚举项的显示文本支持本地化，可以根据当前语言环境返回对应的文本，这样可以使得枚举项的显示文本更加灵活，更加符合用户的需求。

还有哪些令人兴奋的特性呢？请继续探索下面的技术文档吧！

<p align="center">
   <img src="https://cdn.jsdelivr.net/npm/enum-plus@2.2.3/public/usage-screenshot.gif" width="500" alt="usage video" />
</p>

## 特性

- 兼容原生 `enum` 的用法
- 支持`number`、`string`等多种数据类型
- 支持枚举项扩展显示文本
- 支持本地化显示文本，可以使用任意国际化类库
- 支持枚举值转换为显示文本，代码更简洁
- 枚举项支持扩展任意个自定义字段
- 支持将枚举绑定到 [Ant Design](https://ant-design.antgroup.com/components/overview-cn)、[ElementPlus](https://element-plus.org/zh-CN/component/select.html)、[Material-UI](https://mui.com/material-ui) 或任意其它组件库，只要一行代码
- 支持 Node.js 环境，支持服务端渲染(SSR)
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

- ### 示例 1：基础用法，与原生枚举用法基本一致

```js
import { Enum } from 'enum-plus';

const Week = Enum({
  Sunday: 0,
  Monday: 1,
} as const);
Week.Monday; // 1
```

- ### 示例 2：值类型使用 string

```js
import { Enum } from 'enum-plus';

const Week = Enum({
  Sunday: 'Sun',
  Monday: 'Mon',
} as const);
Week.Monday; // 'Mon'
```

- ### 👍👍 【推荐】 示例 3（标准用法）：包含 Key、Value，以及显示文本

```js
import { Enum } from 'enum-plus';

const Week = Enum({
  Sunday: { value: 0, label: '星期日' }, // 此示例不考虑本地化
  Monday: { value: 1, label: '星期一' }, // 此示例不考虑本地化
} as const);
Week.Monday; // 1
Week.label(1); // 星期一
```

- ### 👍 示例 4：省略 value 字段

如果 `value` 与 Key 相同，可以考虑省略 `value` 字段，使用 Key 作为枚举值

```js
import { Enum } from 'enum-plus';

const Week = Enum({
  Sunday: { label: '星期日' }, // 等价于 { value: "Sunday", label: '星期日' }
  Monday: { label: '星期一' }, // 等价于 { value: "Monday", label: '星期一' }
} as const);
Week.Monday; // 'Monday'
Week.label('Monday'); // 星期一
```

- ### 示例 5：动态数组构建枚举

有时候我们需要使用接口返回的数据，动态创建一个枚举，这时可以采用数组的方式来初始化枚举

```js
import { Enum } from 'enum-plus';

const petTypes = await getPetsData();
// [   { value: 1, key: 'dog', label: '狗' },
//     { value: 2, key: 'cat', label: '猫' },
//     { value: 3, key: 'rabbit', label: '兔子' }   ];
const PetTypes = Enum(petTypes);
```

关于更高级的用法，请参考 [自定义初始化选项](#自定义初始化选项) 章节

- ### 示例 6：支持原生枚举初始化，相当于给原生枚举添加一些扩展方法

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

### 拾取枚举值

`Enum.XXX`

像原生`enum`一样，直接拾取一个枚举值

```js
Week.Sunday; // 0
Week.Monday; // 1
```

---

### items

`{ value, label, key, raw }[]`

获取一个包含全部枚举项的只读数组，可以方便地遍历枚举项。由于符合 [Ant Design](https://github.com/ant-design/ant-design) 组件的数据规范，因此支持将枚举一键转换成下拉框、复选框等组件，只需要一行代码，更多详情可以参考后面的例子

---

### keys

`string[]`

获取一个包含全部枚举项`Key`的只读数组

---

### label

<sup>**_[方法]_**</sup> &nbsp; `label(keyOrValue?: string | number): string | undefined`

根据某个枚举值或枚举 Key，获取该枚举项的显示文本。如果设置了本地化，则会返回本地化后的文本。

```js
Week.label(1); // 星期一
Week.label('Monday'); // 星期一
```

---

### key

<sup>**_[方法]_**</sup> &nbsp; `key(value?: string | number): string | undefined`

根据枚举值获取该枚举项的 Key，如果不存在则返回`undefined`

```js
Week.key(1); // 'Monday'
```

---

### has

<sup>**_[方法]_**</sup> &nbsp; `has(keyOrValue?: string | number): boolean`

判断某个枚举项（值或 Key）是否存在

```js
Week.has(1); // true
Week.has('Sunday'); // true
Week.has(9); // false
Week.has('Birthday'); // false
```

---

### toSelect

<sup>**_[方法]_**</sup> &nbsp; `toSelect(config?: OptionsConfig): {value, label}[]`

`toSelect`与`items`相似，都是返回一个包含全部枚举项的数组。区别是，`toSelect`返回的元素只包含`label`和`value`两个字段，同时，`toSelect`方法支持在数组头部插入一个默认元素，一般用于下拉框等组件的默认选项，表示全部、无值或不限等，当然你也能够自定义这个默认选项

---

### toMenu

<sup>**_[方法]_**</sup> &nbsp; `toMenu(): { key, label }[]`

生成一个对象数组，可以绑定给 [Ant Design](https://ant-design.antgroup.com/components/menu-cn) 的`Menu`、`Dropdown`等组件

```js
import { Menu } from 'antd';

<Menu items={Week.toMenu()} />;
```

数据格式为：

```js
[
  { key: 0, label: '星期日' },
  { key: 1, label: '星期一' },
];
```

---

### toFilter

<sup>**_[方法]_**</sup> &nbsp; `toFilter(): { text, value }[]`

生成一个对象数组，可以直接传递给 [Ant Design](https://ant-design.antgroup.com/components/table-cn#table-demo-head) Table 组件的列配置，在表头中显示一个下拉筛选框，用来过滤表格数据

数据格式为：

```js
[
  { text: '星期日', value: 0 },
  { text: '星期一', value: 1 },
];
```

---

### toValueMap

<sup>**_[方法]_**</sup> &nbsp; `toValueMap(): Record<V, { text: string }>`

生成一个符合 [Ant Design Pro](https://procomponents.ant.design/components/schema#valueenum) 规范的枚举集合对象，可以传递给 `ProFormField`、`ProTable` 等组件。

数据格式为：

```js
{
  0: { text: '星期日' },
  1: { text: '星期一' },
}
```

---

### raw

<sup>**_[方法重载^1]_**</sup> &nbsp; `raw(): Record<K, T[K]>`
<br/>
<sup>**_[方法重载^2]_**</sup> &nbsp; `raw(keyOrValue: V | K): T[K]`

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

### valueType &nbsp; <sup>**_[Type-ONLY]_**</sup>

`value1 | value2 | ...`

在 TypeScript 中，获取一个包含全部枚举值的联合类型，用于缩小变量或组件属性的数据类型，避免使用`number`、`string`这种过于宽泛的类型，提高代码的可读性和类型安全性

```typescript
const weekValue: typeof Week.valueType = 1;
const weeks: (typeof Week.valueType)[] = [0, 1];
type WeekValues = typeof Week.valueType; // 0 | 1
```

> 注意，这只是一个 TypeScript 类型，只能用来约束类型，不可在运行时调用，运行时调用会抛出异常

---

### keyType &nbsp; <sup>**_[Type-ONLY]_**</sup>

`key1 | key2 | ...`

与`valueType`类似，获取一个包含全部枚举 Key 的联合类型

```typescript
const weekKey: typeof Week.keyType = 'Monday';
const weekKeys: (typeof Week.keyType)[] = ['Sunday', 'Monday'];
type WeekKeys = typeof Week.keyType; // 'Sunday' | 'Monday'
```

> 注意，这只是一个 TypeScript 类型，只能用来约束类型，不可在运行时调用，运行时调用会抛出异常

---

### rawType &nbsp; <sup>**_[Type-ONLY]_**</sup>

`{ value: V, label: string, [...] }`

与无参数的`raw`方法类似，只不过`raw`方法支持在运行时调用，而`rawType`只能用来约束类型

> 注意，这只是一个 TypeScript 类型，只能用来约束类型，不可在运行时调用，运行时调用会抛出异常

---

## 使用方法

#### 拾取枚举值，与原生枚举用法一致

```js
const Week = Enum({
  Sunday: { value: 0, label: '星期日' },
  Monday: { value: 1, label: '星期一' },
} as const);

Week.Sunday; // 0
Week.Monday; // 1
```

---

#### 支持添加 Jsdoc 注释，代码提示更友好

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

HttpCodes.E404; // 将光标悬停在 E404 上，将显示完整的Jsdoc文档注释
```

> Http 状态码的释义内容参考自 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)

---

#### 获取包含全部枚举项的数组

```js
Week.items; // 输出如下:
// [
//  { value: 0, label: '星期日', key: 'Sunday', raw: { value: 0, label: '星期日' } },
//  { value: 1, label: '星期一', key: 'Monday', raw: { value: 1, label: '星期一' } }
// ]
```

---

#### 获取第一个枚举值

```js
Week.items[0].value; // 0
```

---

#### 检查一个值是否一个有效的枚举值

```js
Week.has(1); // true
Week.items.some(item => item.value === 1); // true
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
Week.items.length; // 2
Week.items.map((item) => item.value); // [0, 1]，✅ 可遍历
Week.items.forEach((item) => {}); // ✅ 可遍历
for (let item of Week.items) {
  // ✅ 可遍历
}
Week.items.push({ value: 2, label: '星期二' }); // ❌ 不可修改
Week.items.splice(0, 1); // ❌ 不可修改
Week.items[0].label = 'foo'; // ❌ 不可修改
```

---

#### 枚举值(或Key)转换为显示文本

```js
Week.label(1); // 星期一，
Week.label(Week.Monday); // 星期一
Week.label('Monday'); // 星期一
```

---

#### 枚举值转换为Key

```js
Week.key(1); // 'Monday'
Week.key(Week.Monday); // 'Monday'
Week.key(9); // undefined, 因为不存在
```

---

#### 添加扩展字段，数量无限制

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

#### 转换成 UI 组件

- `items` 可以直接作为组件的数据源（以 Select 组件为例）

  [Ant Design](https://ant-design.antgroup.com/components/select-cn) | [Arco Design](https://arco.design/react/components/select)
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

  [ElementPlus](https://element-plus.org/zh-CN/component/select.html) Select

  ```tsx
  <el-select>
    <el-option v-for="item in Week.items" v-bind="item" />
  </el-select>
  ```

  [Ant Design Vue](https://antdv.com/components/select-cn) | [Arc Design](https://arco.design/vue/component/select) Select

  ```tsx
  <a-select :options="Week.items" />
  ```

  [Vuetify](https://vuetifyjs.com/zh-Hans/components/selects) Select

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

- `toSelect`方法与`items`类似，但允许在头部增加一个默认选项。默认选项可以是一个布尔值，也可以是一个自定义对象。

  - 如果是布尔值，则默认选项为`{ value: '', label: 'All' }`，显示名称只支持英文。如果希望支持本地化，请在本地化方法中解析并处理`enum-plus.options.all`这个内置资源。关于本地化的更多详情，请参考[本地化](#本地化)章节
  - 如果是一个对象，则可以自定义默认选项的值和显示文本，显示文本会自动支持本地化

  ```tsx
  <Select options={Week.toSelect({ firstOption: true })} />
  // [
  //  { value: '', label: 'All' },
  //  { value: 0, label: '星期日' },
  //  { value: 1, label: '星期一' }
  // ]

  // 自定义头部默认选项
  <Select options={Week.toSelect({ firstOption: { value: 0, label: '不限' } })} />
  ```

- `toMenu`方法可以为 [Ant Design](https://github.com/ant-design/ant-design) `Menu`、`Dropdown` 等组件生成数据源，格式为：`{ key: number|string, label: string } []`

```tsx
import { Menu } from 'antd';

<Menu items={Week.toMenu()} />;
```

- `toFilter`方法可以生成一个对象数组，为表格绑定`列筛选`功能，列头中显示一个下拉筛选框，用来过滤表格数据。对象结构遵循 [Ant Design](https://ant-design.antgroup.com/components/table-cn#table-demo-head) 的数据规范，格式为：`{ text: string, value: number|string } []`

```tsx
import { Table } from 'antd';

const columns = [
  {
    title: 'week',
    dataIndex: 'week',
    filters: Week.toFilter(),
  },
];
// 在表头中显示下拉筛选项
<Table columns={columns} />;
```

- `toValueMap`方法可以为 [Ant Design Pro](https://github.com/ant-design/pro-components) 的`ProFormFields`、`ProTable`等组件生成数据源，这是一个类似 Map 的数据结构，格式为：`{ [key: number|string]: { text: string } }`

```tsx
import { ProTable } from '@ant-design/pro-components';

<ProFormSelect valueEnum={Week.toValueMap()} />;
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

#### 使用枚举值序列来缩小`number`类型 &nbsp;&nbsp;<sup>_[TypeScript ONLY]_</sup>

使用 `valueType` 类型约束，可以将数据类型从宽泛的`number`或`string`类型缩小为有限的枚举值序列，这不但能减少错误赋值的可能性，还能提高代码的可读性

```typescript
const weekValue: number = 8; // 👎 任意数字都可以赋值给周枚举，即使错误的
const weekName: string = 'Birthday'; // 👎 任意字符串都可以赋值给周枚举，即使错误的

const goodWeekValue: typeof Week.valueType = 1; // ✅ 类型正确，1 是一个有效的周枚举值
const goodWeekName: typeof Week.keyType = 'Monday'; // ✅ 类型正确，'Monday' 是一个有效的周枚举名

const badWeekValue: typeof Week.valueType = 8; // ❌ 类型错误，8 不是一个有效的周枚举值
const badWeekName: typeof Week.keyType = 'Birthday'; // ❌ 类型错误，'Birthday' 不是一个有效的周枚举名

type FooProps = {
  value?: typeof Week.valueType; // 👍 组件属性类型约束，可以防止错误赋值，还能智能提示有效值有哪些
  names?: (typeof Week.keyType)[]; // 👍 组件属性类型约束，可以防止错误赋值，还能智能提示有效值有哪些
};
```

---

#### 自定义初始化选项

在 [示例 5：动态数组构建枚举](#示例-5动态数组构建枚举) 章节中，介绍了可以通过后端动态数据来构建枚举，但是很可能动态数据的字段名并不是`value`、`label`、`key`，而是其它的字段名。这时你可以传入一个自定义选项，把这些映射到其它字段名上

```js
import { Enum } from 'enum-plus';

const petTypes = await getPetsData();
// [   { id: 1, code: 'dog', name: '狗' },
//     { id: 2, code: 'cat', name: '猫' },
//     { id: 3, code: 'rabbit', name: '兔子' }   ];
const PetTypes = Enum(petTypes, {
  getValue: 'id',
  getLabel: 'name',
  getKey: 'code', // getKey可选
});
Week.items; // 输出如下:
// [   { value: 1, label: '狗', key: 'dog' },
//     { value: 2, label: '猫', key: 'cat' },
//     { value: 3, label: '兔子', key: 'rabbit' }   ]
```

在上面的例子中，`getValue`、`getLabel`、`getKey` 还可以是一个函数，用来处理更复杂的业务逻辑，比如：

```js
const PetTypes = Enum(petTypes, {
  getValue: (item) => item.id,
  getLabel: (item) => `${item.name} (${item.code})`,
  getKey: (item) => item.code,
});
```

---

#### 😟 命名冲突？

这里为枚举使用添加一些边界情况，从上面的用例中可以看到，我们可以通过 `Week.XXX` 来快捷访问枚举项，但是万一枚举项的 key 与枚举方法命名冲突怎么办？

我们知道枚举类型上还存在 `label`、`key`、`toSelect` 等方法，如果与某个枚举项重名，枚举项的值优先级更高，会覆盖掉这些方法。但不用担心，你可以在 `items` 下访问到它们。请参考下面的代码示例：

```js
const Week = Enum({
  foo: { value: 1 },
  bar: { value: 2 },
  keys: { value: 3 }, // 命名冲突
  label: { value: 4 }, // 命名冲突
} as const);
Week.keys; // 3，枚举项优先级更高，会覆盖掉方法
Week.label; // 4，枚举项优先级更高，会覆盖掉方法
// 可以通过 items 访问到这些方法 🙂
Week.items.keys // ['foo', 'bar', 'keys', 'label']
Week.items.label(1); // 'foo'
```

更极端一些，万一`items`与枚举项命名冲突怎么办？放心，你仍然可以通过别名字段访问到`items`数组。参考下面的示例：

```js
import { ITEMS } from 'enum-plus';

const Week = Enum({
  foo: { value: 1 },
  bar: { value: 2 },
  items: { value: 3 }, // 命名冲突
} as const);

Week.items; // 3，枚举项优先级更高，会覆盖掉 items
Week[ITEMS]; // ITEMS 是一个别名Symbol
// [
//  { value: 1, key: 'foo', label: 'foo' },
//  { value: 2, key: 'bar', label: 'bar' },
//  { value: 3, key: 'items', label: 'items' }
// ]
// 等价于原来的 Week.items 🙂
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

// 👎 这不是一个好例子，仅为了演示基础功能，请采用后面其它的方式
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
// 👍 建议使用 i18next 或其他国际化库
const i18nLocalize = (content: string | undefined) => i18next.t(content);
// 👍 或者封装成一个基础组件
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

---

## 全局扩展

`Enum`已经提供了一些常用的方法，但如果这些方法还不能满足你的需求，你可以通过 `Enum.extend` 方法来添加自定义扩展函数。这些扩展方法将会被添加到所有的枚举类型上，即便是在扩展之前已经创建的枚举类型，也会立即生效

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

Week.toMySelect(); // [{ value: 0, title: '星期日' }, { value: 1, title: '星期一' }]
```

如果你在使用 TypeScript，你可能需要再扩展一下枚举类型声明，这样可以获得更好的类型提示。在你的项目中创建或编辑一个声明文件（例如 `global.d.ts`），并在其中扩展全局类型。此文件可以放在项目的根目录或任意目录下，只要确保 TypeScript 能够找到它

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

请注意，你不是必须导入`EnumItemInit`和`EnumItemClass`这些类型，这些仅在这个示例中被使用，为了添加更友好的类型提示。

`EnumExtension`接口是一个泛型接口，它接受三个类型参数，分别是：

- `T`: 枚举类型的初始化对象
- `K`: 枚举项的键值
- `V`: 枚举项的值

如果你希望在扩展方法中提供更友好的类型提示，你或许可能需要使用到这些类型参数，但这些都是可选的，如果你不需要，可以直接省略掉它们

## Q&A

### 1. 如何基于 i18next 实现国际化？

main.tsx

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

// 👀 这里是关键代码，通过 Enum.localize 方法全局设置，使用 Locale 组件来输出本地化文本
Enum.localize = (key?: string) => <Locale value={key} />;

const root = createRoot(document.getElementById('root'));
root.render(
  <LocaleProvider>
    <App />
  </LocaleProvider>
);
```

components/LocaleProvider.tsx

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

components/Locale.tsx

```tsx
import { useContext } from 'react';
import i18next from 'i18next';
import { LocaleContext } from './LocaleProvider';

export default function Localize({ value }: { value: string }) {
  const { lang } = useContext(LocaleContext);
  return <>{i18next.t(value, { lng: lang })}</>;
}
```

### 2. 实现国际化后，为什么antd下拉框的搜索功能失效了？

这是因为 antd 下拉框的搜索功能是基于 `label` 来实现的，而支持了国际化后，`label` 返回的是一个组件，而不是常规字符串，因此 Antd 无法正确进行字符串匹配。解决方法是可以给枚举扩展一个 `filterOption` 方法，帮助Select组件自定义搜索功能，这样就可以正确地支持搜索功能了

参考下面的示例代码：

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
