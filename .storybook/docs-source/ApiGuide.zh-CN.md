## API

### 💎 &nbsp; 拾取枚举值

`Enum.XXX`

像原生`enum`一样，直接拾取一个枚举值

```js
WeekEnum.Sunday; // 0
WeekEnum.Monday; // 1
```

---

### 💎 &nbsp; named

`Record<string, EnumItemClass>`

一个聚合了所有枚举项的只读对象，可以通过`key`来快速访问某个枚举项对象。

```js
WeekEnum.named.Monday; // { key: 'Monday', value: 1, label: '星期一' }
```

### 💎 &nbsp; items

`{ value, label, key, raw }[]`

获取一个包含全部枚举项的只读数组，可以方便地遍历枚举项。

```js
WeekEnum.items; // [ { value: 0, label: '星期日', key: 'Sunday' }, { value: 1, label: '星期一', key: 'Monday' }, ... ]
```

---

### 💎 &nbsp; values

`(string | number)[]`

获取一个包含全部枚举项`value`的数组

```js
WeekEnum.values; // [0, 1, 2, 3, 4, 5, 6]
```

---

### 💎 &nbsp; labels

`string[]`

获取一个包含全部枚举项`label`的数组

```js
WeekEnum.labels; // ['星期日', '星期一', ... '星期五', '星期六']
```

---

### 💎 &nbsp; keys

`string[]`

获取一个包含全部枚举项`key`的数组

```js
WeekEnum.keys; // ['Sunday', 'Monday', ... 'Friday', 'Saturday']
```

---

### 💎 &nbsp; meta

`Record<string, any[]>`

获取一个包含全部枚举项自定义字段的聚合对象，键是字段名，值是该字段的所有枚举项值的数组，这样可以在不遍历枚举项的情况下访问自定义字段。

```js
const ColorEnum = Enum({
  Red: { value: 1, label: '红色', hex: '#FF0000' },
  Green: { value: 2, label: '绿色', hex: '#00FF00' },
  Blue: { value: 3, label: '蓝色', hex: '#0000FF' },
});
ColorEnum.meta.hex; // ['#FF0000', '#00FF00', '#0000FF']
```

顺便一提，你可以通过 `named` 和 `raw` 属性快速访问单个枚举项的自定义字段

```js
ColorEnum.named.Red.raw.hex; // '#FF0000'
```

---

### 💎 &nbsp; has

<sup>**_\[方法]_**</sup> &nbsp; `has(keyOrValue?: string | number): boolean`

判断某个枚举项（值或 key）是否存在

```js
WeekEnum.has(1); // true
WeekEnum.has('Sunday'); // true
WeekEnum.has(9); // false
WeekEnum.has('Birthday'); // false
```

---

### 💎 &nbsp; findBy

<sup>**_\[方法]_**</sup> &nbsp; `findBy(field: string, value: any): EnumItemClass | undefined`

根据指定字段和字段值，获取枚举项对象，如果不存在则返回`undefined`

字段名支持：`key`、`value`、`label`或元数据字段

```js
ColorEnum.findBy('value', 1); // { key: 'Red', value: 1, label: '红色', hex: '#FF0000' }
ColorEnum.findBy('key', 'Red'); // { key: 'Red', value: 1, label: '红色', hex: '#FF0000' }
ColorEnum.findBy('hex', '#FF0000'); // { key: 'Red', value: 1, label: '红色', hex: '#FF0000' }
```

---

### 💎 &nbsp; label

<sup>**_\[方法]_**</sup> &nbsp; `label(keyOrValue?: string | number): string | undefined`

根据某个枚举值或枚举 key，获取该枚举项的显示名称。如果启用了[本地化](?path=/docs/recipes--docs&globals=locale:zh-CN#本地化)，则会返回当前语言的内容。

```js
WeekEnum.label(1); // 星期一
WeekEnum.label('Monday'); // 星期一
```

---

### 💎 &nbsp; key

<sup>**_\[方法]_**</sup> &nbsp; `key(value?: string | number): string | undefined`

根据枚举值获取该枚举项的`key`，这也被称为[反向映射](https://www.typescriptlang.org/docs/handbook/enums.html#reverse-mappings)。如果不存在则返回`undefined`

```js
WeekEnum.key(1); // 'Monday'
```

---

### 💎 &nbsp; raw

<sup>**_\[方法^1]_**</sup> &nbsp; `raw(): Record<K, T[K]>`
<br/>
<sup>**_\[方法^2]_**</sup> &nbsp; `raw(keyOrValue: V | K): T[K]`

`raw`方法有两种重载形式。第一种是返回整个枚举集合的原始初始化对象，即`Enum`方法的第一个参数。

第二种是返回单个枚举项的原始初始化对象，即`Enum`方法的第一个参数中对应字段的子对象。

这个方法主要作用是，用来获取枚举项的自定义字段。

```js
const WeekEnum = Enum({
  Sunday: { value: 0, label: '星期日', happy: true },
  Monday: { value: 1, label: '星期一', happy: false },
});

WeekEnum.raw(0).happy; // true
WeekEnum.raw(0); // { value: 0, label: '星期日', happy: true }
WeekEnum.raw('Monday'); // { value: 1, label: '星期一', happy: false }
WeekEnum.raw(); // { Sunday: { value: 0, label: '星期日', happy: true }, Monday: { value: 1, label: '星期一', happy: false } }
```

> 温馨提示：如果要获取某个已知枚举项的元数据字段，使用`enum.named.XXX.raw` 是一个不错的选择。

---

### 💎 &nbsp; toList

<sup>**_\[方法^1]_**</sup> &nbsp; `toList(): { value, label }[]`
<br/>
<sup>**_\[方法^2]_**</sup> &nbsp; `toList(options?: { valueField?: string; labelField?: string }): { [key: string]: any }[]`

将枚举转换为一个默认包含`value`和`label`字段的数组，或者通过`options`参数自定义字段名。

```js
WeekEnum.toList();
// [
//   { value: 0, label: '星期日' },
//   { value: 1, label: '星期一' },
//   ...
//   { value: 6, label: '星期六' }
// ]
WeekEnum.toList({ valueField: 'id', labelField: 'name' });
// [
//   { id: 0, name: '星期日' },
//   { id: 1, name: '星期一' },
//   ...
//   { id: 6, name: '星期六' }
// ]
```

---

### 💎 &nbsp; toMap

<sup>**_\[方法^1]_**</sup> &nbsp; `toMap(): Record<string, string | number>`
<br/>
<sup>**_\[方法^2]_**</sup> &nbsp; `toMap(options?: { keySelector?: string; valueSelector?: string }): Record<string, any>`

将枚举转换为一个默认以`value`为键，`label`为值的对象，或者通过`options`参数自定义键和值的字段名。

```js
WeekEnum.toMap();
// {
//   "0": '星期日',
//   "1": '星期一',
//   ...
//   "6": '星期六'
// }
WeekEnum.toMap({ keySelector: 'key', valueSelector: 'value' });
// {
//   "Sunday": 0,
//   "Monday": 1,
//   ...
//   "Saturday": 6
// }
```

---

### 💎 &nbsp; name

`string`

整个枚举集合的显示名称。可以在创建枚举时，通过传入一个可选的 `name` 参数来为枚举类型命名。这个名称可以是一个普通字符串，也可以是一个本地化键值，以支持国际化文本。请参考[本地化](?path=/docs/recipes--docs&globals=locale:zh-CN#本地化)章节，了解更多详情。

```js
const WeekEnum = Enum(
  {
    Sunday: { value: 0, label: '星期日' },
    Monday: { value: 1, label: '星期一' },
  },
  {
    name: 'i18n.enums.week', // 可以普通字符串或者一个本地化键值
  },
);

WeekEnum.name; // Week 或 周，取决于当前语言
```

> 在 UI 组件中，枚举通常用来作为数据源，生成下拉框表单项，或在表格单元格中显示枚举成员文本。而对应的表单项标签或列标题就是枚举类型的名称。通过使用`name`，我们可以集中管理枚举名称，和枚举成员的名称，也更方便使用。

---

### ⚡️ &nbsp; valueType &nbsp;&nbsp;&nbsp; <sup>**_\[TypeScript Only]_**</sup>

`value1 | value2 | ...`

在 TypeScript 中，提供了一个包含所有枚举值的联合类型，用于缩小变量或组件属性的数据类型。这种类型替代了像 `number` 或 `string` 这样宽泛的原始类型，使用精确的值集合，防止无效赋值，同时提高代码可读性和编译时类型安全性。

```ts
const weekValue: typeof WeekEnum.valueType = 1;

function setToday(day: typeof WeekEnum.valueType) {
  // ...
}

const MyComponent = (props: { day: typeof WeekEnum.valueType }) => {
  // ...
};
```

> 注意，这只是一个 TypeScript 类型，只能用来约束类型。不可在运行时调用，运行时调用会抛出异常。

---

### ⚡️ &nbsp; keyType &nbsp;&nbsp;&nbsp; <sup>**_\[TypeScript Only]_**</sup>

`key1 | key2 | ...`

与`valueType`类似，获取一个包含全部枚举 `key` 的联合类型

```ts
type WeekKeys = typeof WeekEnum.keyType; // 'Sunday' | 'Monday'
const weekKey: typeof WeekEnum.keyType = 'Monday';
const weekKeys: (typeof WeekEnum.keyType)[] = ['Sunday', 'Monday'];
```

> 注意，这只是一个 TypeScript 类型，只能用来约束类型。不可在运行时调用，运行时调用会抛出异常。

---

### ⚡️ &nbsp; rawType &nbsp;&nbsp;&nbsp; <sup>**_\[TypeScript Only]_**</sup>

`{ value: V, label: string, [...] }`

获取初始化整个枚举集合的原始类型，即 `Enum` 函数的第一个参数的类型。

不要与 `raw` 方法混淆，`raw` 方法是一个运行时方法，而`rawType`是一个 TypeScript 的类型。

```ts
type WeekRaw = typeof WeekEnum.rawType;
// { Sunday: { value: 0, label: string }, Monday: { value: 1, label: string } }
```

> 注意，这只是一个 TypeScript 类型，只能用来约束类型。不可在运行时调用，运行时调用会抛出异常。

---

## 静态方法

### 💎 &nbsp; Enum.isEnum

<sup>**_\[方法]_**</sup> &nbsp; `isEnum(obj: any): boolean`

判断一个对象是否是一个由`Enum`函数创建的枚举对象

```js
Enum.isEnum(WeekEnum); // true
Enum.isEnum({}); // false
```

---

### 💎 &nbsp; Enum.localize

<sup>**_\[方法]_**</sup> &nbsp; `(key: string) => string`

设置全局的本地化函数，用来处理枚举类型名称和枚举项显示名称的本地化。请参考 [本地化](?path=/docs/recipes--docs&globals=locale:zh-CN#本地化) 章节，了解更多详情。

```js
import i18n from 'i18next';

Enum.localize = (key) => i18n.t(key);
```

---

### 💎 &nbsp; Enum.extends

<sup>**_\[方法]_**</sup> &nbsp; `(obj: Record<string, Function>) => void`

为所有枚举对象添加全局扩展方法，请参考[全局扩展](?path=/docs/recipes--docs&globals=locale:zh-CN#全局扩展)章节，了解更多详情。

```js
Enum.extends({
  sayHello() {
    return `你好，EnumPlus!`;
  },
});
```

---

### 💎 &nbsp; Enum.install

<sup>**_\[方法]_**</sup> &nbsp; `(plugin: Plugin, options?: any) => void`

安装一个插件，插件可以为所有枚举添加新的功能。请参考[插件系统](?path=/docs/recipes--docs&globals=locale:zh-CN#插件系统)章节，了解更多详情。

```js
import i18nextPlugin from '@enum-plus/plugin-i18next';

Enum.install(i18nextPlugin);
```

## 全局配置

`Enum.config` 提供了一些全局配置参数，用来影响枚举的行为和特性。

### autoLabel

`Enum.config.autoLabel` 是一个全局配置选项，用于自动生成枚举项的标签。它允许在定义枚举时，设置 `options.labelPrefix` 选项，为所有枚举项设置一个 `label` 前缀，枚举项只需要设置基础值即可，甚至可以省略 `label` 字段（与 `key` 字段相同）。这样可以减少重复代码，提高枚举定义的简洁性。

`Enum.config.autoLabel` 的值可以是一个布尔值，也可以使用 `function` 类型的函数以实现更复杂的逻辑。

- `true` - 默认值，启用自动标签生成功能。枚举项的 `label` 最终值将自动设置为 `labelPrefix`+`label`，如果省略了 `label` 字段，则使用 `labelPrefix`+`key` 规则。当然，如果创建枚举时没有设置 `labelPrefix`，则此选项将没有任何效果。
- `function` - 一个自定义函数，用于自定义每个枚举项 `label` 生成规则。该函数接受一个选项对象参数，其中包含：`item`（枚举项对象）和 `labelPrefix`，并返回一个字符串作为最终的 `label` 值。

  ```js
  Enum.config.autoLabel = ({ item, labelPrefix }) => {
    return `${labelPrefix}.${item.key.lowerFirst()}`;
  };
  ```

- `false` - 禁用自动标签生成功能，枚举项必须显式提供 `label` 字段。

> 请注意，在创建枚举时也可以通过 `options.autoLabel` 参数覆盖全局配置，其用法与 `Enum.config.autoLabel` 相同。
