## 使用案例

### 💡 基础用法，消除魔法数字

```js
const WeekEnum = Enum({
  Sunday: { value: 0, label: '星期日' },
  Monday: { value: 1, label: '星期一' },
});

if (today === WeekEnum.Sunday) {
  // 今天是星期天，享受你的一天吧！
} else if (today === WeekEnum.Monday) {
  // 哦不，又是星期一了...
}
```

---

### 💡 检查是否一个有效的枚举值

```js
if (WeekEnum.has(value)) {
  // 是一个有效的枚举值，可以安全使用
} else {
  // 抛出异常或使用默认值
}
```

---

### 💡 检查是否一个枚举对象

```ts
let values: number[] | undefined;
if (Enum.isEnum(data)) {
  values = data.values;
} else if (Array.isArray(data)) {
  values = data;
} else {
  // 非法输入，抛出异常或使用默认值
}
```

---

### 💡 生成 UI 组件

以 React + Ant Design 为例，更多 UI 组件的案例请参考 [支持多种前端框架](?path=/docs/recipes--docs&globals=locale:zh-CN#-支持多种前端框架) 章节

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

> 需要安装 [@enum-plus/plugin-antd](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-antd) 插件

---

### 💡 枚举名称/标签支持国际化

可以支持多语言环境，将`label`字段设置为一个本地化键值，根据当前语言环境显示对应的文本。请参考 [本地化](?path=/docs/recipes--docs&globals=locale:zh-CN#本地化) 章节，了解更多详情。

```js
WeekEnum.label(1); // Monday 或 星期一，取决于当前语言环境
WeekEnum.named.Monday.label; // Monday 或 星期一，取决于当前语言环境
WeekEnum.name; // Week 或 周，取决于当前语言环境
```

---

### 💡 约束数据类型 (仅 TypeScript)

这是一个 TypeScript 特有的特性，可以使用 `valueType` 约束变量、方法参数或组件属性的类型，防止无效赋值，提高代码的类型安全性。

- 变量

```ts
type WeekValues = typeof WeekEnum.valueType; // 0 | 1 | ... | 5 | 6

const weekValue: WeekValues = 1; // ✅ 正确，1 是一个有效的周枚举值
const weeks: WeekValues[] = [0, 1]; // ✅ 正确，0 和 1 是有效的周枚举值

const badWeekValue1: WeekValues = 'Weekend'; // ❌ 类型错误，"Weekend" 不是数字
const badWeekValue2: WeekValues = 8; // ❌ 错误，8 不是一个有效的周枚举值
const badWeeks: WeekValues[] = [0, 8]; // ❌ 错误，8 不是一个有效的周枚举值
```

- 方法参数

```ts
function setDay(day: typeof WeekEnum.valueType) {
  // day 的类型被约束为 0 | 1 | ... | 5 | 6
}

setDay(1); // ✅ 正确
setDay('Monday'); // ❌ 类型错误，'Monday' 不是数字
setDay(8); // ❌ 错误，8 不是一个有效的枚举值
```

- 组件属性

```ts
type MyComponentProps = {
  day: typeof WeekEnum.valueType; // 0 | 1 | ... | 5 | 6
};
const MyComponent = (props: MyComponentProps) => {
  return <div>今天是 {WeekEnum.label(props.day)}</div>;
};

<MyComponent day={1} />; // ✅ 类型正确
<MyComponent day="Monday" />; // ❌ 类型错误
<MyComponent day={8} />; // ❌ 错误，8 不是一个有效的枚举值
```

---

### 💡 添加元数据字段，可以作为静态配置系统使用

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

### 💡 支持遍历枚举项数组，但不可修改

```js
Array.isArray(WeekEnum.items); // true
WeekEnum.items.map((item) => item.value); // [0, 1, ..., 5, 6]
WeekEnum.items.forEach((item) => {
  // ✅ 可遍历
});
for (const item of WeekEnum.items) {
  // ✅ 可遍历
}

WeekEnum.items.push({ value: 2, label: '星期二' }); // ❌ 不可修改
WeekEnum.items.splice(0, 1); // ❌ 不可修改
WeekEnum.items[0].label = 'foo'; // ❌ 不可修改
```

---

### 💡 枚举组合（合并）

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

### 💡 启用枚举项标签的智能提示

如果你启用了国际化，你可能想在输入枚举项标签时能够获得代码智能提示，列出所有可用的国际化资源的键值列表，简化输入过程。你可以通过为 `EnumLocaleExtends` 接口添加一个新的属性来实现这一点。

_index.ts_

```ts
declare module 'enum-plus/extension' {
  type EN = typeof import('./packages/locals/en').default;
  interface EnumLocaleExtends {
    LocaleKeys: keyof EN;
  }
}
```

---

### 💡 枚举项支持 JSDoc 注释，启用代码智能提示

在代码编辑器中，将光标悬停在枚举项上，即可显示关于该枚举项的详细 JSDoc 注释，而不必再转到枚举定义处查看。关于如何编写良好的代码，请参考 [最佳实践](https://github.com/shijistar/enum-plus/blob/master/docs/best-practices.md) 章节。

```js
const WeekEnum = Enum({
  /** 星期日 */
  Sunday: { value: 0, label: '星期日' },
  /** 星期一 */
  Monday: { value: 1, label: '星期一' },
});

WeekEnum.Monday; // 将光标悬浮在 Monday 上
```

![JSDoc](https://cdn.jsdelivr.net/gh/shijistar/enum-plus@master/public/jsdoc-chs.png)

可以看到，当光标悬浮在枚举项上时，可以同时显示枚举值和枚举项的介绍。无需跳转离开当前光标位置，去查看枚举的定义，这在阅读代码时非常方便。

---

### 💡 支持多种前端框架

`Enum.items` 可以直接作为组件的数据源（以 Select 组件为例）

- **React相关框架**

  [Ant Design](https://ant-design.antgroup.com/components/select-cn) | [Arco Design](https://arco.design/react/components/select)
  Select

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

- **Vue相关框架**

  [Element Plus](https://element-plus.org/zh-CN/component/select.html) Select

  ```html
  <el-select>
    <el-option v-for="item in WeekEnum.items" v-bind="item" />
  </el-select>
  ```

  [Ant Design Vue](https://antdv.com/components/select-cn) | [Arco Design](https://arco.design/vue/component/select) Select

  ```html
  <a-select :options="WeekEnum.items" />
  ```

  [Vuetify](https://vuetifyjs.com/zh-Hans/components/selects) Select

  ```html
  <v-select :items="WeekEnum.items" item-title="label" />
  ```

- **Angular相关框架**

  [Angular Material](https://material.angular.io/components/select/overview) Select

  ```html
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

---

### 💡 枚举配置选项

在创建枚举时，可以传入一个可选的配置对象，用来定制枚举的行为和特性。下面是一些常用的配置选项：

```ts
interface EnumOptions {
  /** 枚举类型名称，可以是一个普通字符串，或者一个本地化键值 */
  name?: string;
  /** 为所有枚举项设置一个标签前缀，更多详情请参考 [全局配置] 章节 */
  labelPrefix?: string;
  /** 自动生成枚举项标签的规则，更多详情请参考 [全局配置] 章节 */
  autoLabel?: boolean | ((params: { item: EnumItemClass; labelPrefix?: string }) => string);
  /** 枚举实例级别的本地化函数，会覆盖 Enum.localize 全局配置函数 */
  localize?: (localeKey: string) => string;
}
```

更多配置选项，请参考下面一个章节。

---

### 💡 在数组初始化方式中，设置不同的字段映射

在 [4. 数组格式](?path=/docs/get-started--docs&globals=locale:zh-CN#4-数组格式) 章节中，介绍了可以通过后端动态数据来构建枚举，但是很可能动态数据的字段名并不是`value`、`label`、`key`，而是其它的字段名。这时你可以传入一个自定义选项，把这些映射到其它字段名上

```js
import { Enum } from 'enum-plus';

const data = await getPetsData();
// [   { id: 1, code: 'dog', name: '狗' },
//     { id: 2, code: 'cat', name: '猫' },
//     { id: 3, code: 'rabbit', name: '兔' }   ];
const PetTypeEnum = Enum(data, {
  getValue: 'id',
  getLabel: 'name',
  getKey: 'code', // getKey可选
});
PetTypeEnum.items; // 输出如下:
// [   { value: 1, label: '狗', key: 'dog' },
//     { value: 2, label: '猫', key: 'cat' },
//     { value: 3, label: '兔', key: 'rabbit' }   ]
```

在上面的例子中，`getValue`、`getLabel`、`getKey` 还可以是一个函数，用来处理更复杂的业务逻辑，比如：

```js
const PetTypeEnum = Enum(petTypes, {
  getValue: (item) => item.id,
  getLabel: (item) => `${item.name} (${item.code})`,
  getKey: (item) => item.code,
});
```

---

## 插件系统

`enum-plus` 提供了一个插件系统，允许你为枚举添加额外的功能。插件可以为所有枚举实例添加新的方法或属性，极大地扩展了枚举的功能。你可以选择性地安装需要的插件，而不是将所有功能都打包在一起，从而保持核心库的轻量和高效。

```ts
import { Enum } from 'enum-plus';
import antdPlugin from '@enum-plus/plugin-antd';

Enum.install(antdPlugin);
```

当你安装一个插件后，插件会为所有枚举实例添加新的方法或属性。例如，安装了 [@enum-plus/plugin-antd](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-antd) 插件后，你可以使用 `enum.toSelect` 方法使用枚举生成一个 Select 组件。

你还可以设置插件的可选配置选项，以定制插件的行为，关于插件的配置选项，请参考各个插件的文档。

```ts
import { Enum } from 'enum-plus';
import antdPlugin from '@enum-plus/plugin-antd';

Enum.install(antdPlugin, {
  toSelect: {
    valueField: 'id', // 设置 toSelect 方法生成的数据对象中，关于值的字段名
    labelField: 'name', // 设置 toSelect 方法生成的数据对象中，关于枚举名称的字段名
  },
});
```

### 插件生态

目前我们已经开发并发布了以下插件，你可以根据需要选择安装：

- [@enum-plus/plugin-antd](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-antd)

  面向 [Ant Design](https://ant-design.antgroup.com) 的功能扩展，包括 `enum.toSelect`、`enum.toMenu`、`enum.toFilter` 和 `enum.toValueMap`。通过这些方法，可以直接将枚举绑定到对应的 Ant Design 组件上，极大地简化了代码。

- [@enum-plus/plugin-i18next](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-i18next)

  集成 [i18next](https://www.i18next.com) 并实现枚举标签的国际化。

- [@enum-plus/plugin-react-i18next](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-react-i18next)

  自动适配 [react-i18next](https://react.i18next.com) 以让枚举支持国际化。

- [@enum-plus/plugin-react](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-react)

  React 集成，包括支持 `Enum.localize` 返回 React 组件，以及监听语言变化以自动重新渲染组件。

- [@enum-plus/plugin-i18next-vue](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-i18next-vue)

  集成 [i18next-vue](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-i18next-vue) 并实现枚举标签的国际化，支持切换语言后自动更新UI。

- [@enum-plus/plugin-vue-i18n](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-vue-i18n)

  集成 [vue-i18n](https://vue-i18n.intlify.dev) 并实现枚举标签的国际化，支持切换语言后自动更新UI。

- [@enum-plus/plugin-next-international](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-next-international)

  在 Next.js 项目中，集成 [next-international](https://next-international.vercel.app/) 并实现枚举标签的国际化，支持切换语言后自动更新UI。

我们正在开发以下插件：

- [@enum-plus/plugin-angular](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-angular): Angular 集成，包括支持 `Enum.localize` 返回 Angular 组件，以及监听语言变化以自动重新渲染组件。_我们需要你的帮助来开发这个插件！_

> 如果你没有找到需要的插件，或者你想开发自己的插件，请参阅 [插件开发指南](https://github.com/shijistar/enum-plus/blob/master/docs/plugin-development.zh-CN.md)。你可以在enum-plus官方仓库中开发新插件，也可以将你开发的插件发布到 npm 上，并把你的插件链接分享在这里。我们真诚地需要你的帮助，来丰富插件生态系统！

---

## 本地化

enum-plus 默认不内置国际化能力，因此枚举项的`label`字段将被视为普通字符串，直接返回原始文本。

为 enum-plus 添加本地化支持，最简单的方式是安装对应的 [i18n插件](?path=/docs/recipes--docs&globals=locale:zh-CN#插件生态)，例如 `@enum-plus/plugin-i18next`，它会自动将 `label` 和 `name` 字段的值传递给 i18next 进行翻译。

```bash
npm install @enum-plus/plugin-i18next i18next
```

然后在项目入口文件中安装插件：

_index.js_

```js
import i18nextPlugin from '@enum-plus/plugin-i18next';
import { Enum } from 'enum-plus';

Enum.install(i18nextPlugin);
```

安装了插件后，枚举的 `label` 和 `name` 字段将自动通过 i18next 进行翻译。

```js
const WeekEnum = Enum(
  {
    Sunday: { value: 0, label: 'week.sunday' },
    Monday: { value: 1, label: 'week.monday' },
  },
  { name: 'weekDays.name' },
);
WeekEnum.label(1); // Monday 或 星期一，取决于当前语言环境
WeekEnum.named.Monday.label; // Monday 或 星期一，取决于当前语言环境
WeekEnum.name; // Week 或 周，取决于当前语言环境
```

此插件还支持自定义 i18next 选项，甚至允许完全控制 localize 方法，请参考[插件文档](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-i18next/README.zh-CN.md#插件选项)，了解更多详情。

如果你需要切换语言后自动更新UI，这需要借助 React、Vue 或 Angular 等框架的能力，请考虑使用 [@enum-plus/plugin-react](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-react) 或 [@enum-plus/plugin-vue](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-vue) 等插件。

如果你使用的是其它国际化库，例如 `react-intl`、`vue-i18next` 或 `ngx-translate`，你可以通过 `Enum.localize` 方法来集成这些库。

_my-extension.js_

```js
import { Enum } from 'enum-plus';

Enum.localize = (key) => {
  // 这是一段伪代码，请根据你使用的国际化库进行调整
  return intl.formatMessage({ id: key });
};
```

> 一旦你完成了这项功能，建议你考虑把它发布成一个 npm 包，并分享在[插件生态](?path=/docs/recipes--docs&globals=locale:zh-CN#插件生态)章节中，这样其他人也可以受益于你的工作。如果你觉得这个项目非常通用，也可以考虑把它提交到 [enum-plus](https://github.com/shijistar/enum-plus/tree/master/packages) 官方插件库中，具体开发规则请参阅 [插件开发指南](https://github.com/shijistar/enum-plus/blob/master/docs/plugin-development.zh-CN.md)。

### 自定义 label 逻辑

当然，如果不使用任何国际化框架，而是希望自己控制枚举 `label` 的本地化规则，或者为每个枚举项使用不同的自定义逻辑，你可以为 `label` 字段传入一个函数：

```js
const WeekEnum = Enum({
  Sunday: { value: 0, label: () => '星期日' },
  Monday: { value: 1, label: () => '星期一' },
});
```

另外，enum\.name 也支持使用自定义函数。

```js
const WeekEnum = Enum(
  {
    //...
  },
  {
    name: () => '周',
  },
);
```

---

## 全局扩展

Enum 提供了丰富的内置方法和属性，它们已经可以满足大多数常见的使用场景。如果这些还不够，你还可以使用 `Enum.extends` 扩展更多的自定义方法。这些扩展会全局应用于所有枚举实例，包括在扩展应用之前创建的实例，并且会立即生效，无需任何额外的设置。

> 实际上，整个[插件系统](?path=/docs/recipes--docs&globals=locale:zh-CN#插件系统)以及 `Enum.install` 在底层都是通过 `Enum.extends` 来实现的。

- **TypeScript 项目**

  _my-enum-extension.ts_

  ```ts
  // 功能实现
  Enum.extends({
    toMySelect() {
      return this.items.map((item) => ({ value: item.value, title: item.label }));
    },
    reversedItems() {
      return this.items.toReversed();
    },
  });

  // 类型声明，以获得更好的类型提示
  declare module 'enum-plus/extension' {
    export interface EnumExtension<T, K, V> {
      toMySelect: () => { value: V; title: string }[];
      reversedItems: () => EnumItemClass<EnumItemInit<V>, K, V>[];
    }
  }
  ```

  _index.ts_

  然后在项目的入口文件中导入这个文件：

  ```ts
  import './my-enum-extension';

  WeekEnum.toMySelect(); // [{ value: 0, title: '星期日' }, { value: 1, title: '星期一' }]
  ```

- **JavaScript 项目**

  _my-enum-extension.js_

  ```js
  import { Enum } from 'enum-plus';

  Enum.extends({
    toMySelect() {
      return this.items.map((item) => ({ value: item.value, title: item.label }));
    },
    reversedItems() {
      return this.items.toReversed();
    },
  });
  ```

  _my-enum-extension.js.d.ts_

  ```ts
  import { EnumExtension, EnumItemClass, EnumItemInit } from 'enum-plus';

  declare module 'enum-plus/extension' {
    export interface EnumExtension<T, K, V> {
      toMySelect: () => { value: V; title: string }[];
      reversedItems: () => EnumItemClass<EnumItemInit<V>, K, V>[];
    }
  }
  ```

  _index.js_

  然后在项目的入口文件中导入这个文件：

  ```js
  import './my-enum-extension';

  WeekEnum.toMySelect(); // [{ value: 0, title: '星期日' }, { value: 1, title: '星期一' }]
  ```

注意，`EnumExtension` 是一个泛型接口，它接受三个类型参数，它们的含义分别是：

- `T`: 表示枚举类型的初始化对象
- `K`: 表示枚举项的键值
- `V`: 表示枚举项的值

> 如果你希望在扩展方法中提供更友好的类型提示，你可能需要使用到这些类型参数。当然，这些类型参数是可选的，如果你不需要，可以直接忽略掉它们。

---

## 命名冲突？

`enum-plus` 设计时充分考虑了命名冲突的可能性。枚举项的命名空间与枚举实例的方法和属性是分开的，这样可以最大限度地减少冲突的可能性。例如，当枚举项的名称与某个方法名称相同时，你可以通过 `items` 属性访问那些被覆盖的方法。

```js
import { KEYS, VALUES } from 'enum-plus';

const WeekEnum = Enum({
  foo: { value: 1 },
  bar: { value: 2 },
  keys: { value: 3 }, // 命名冲突
  values: { value: 4 }, // 命名冲突
  label: { value: 5 }, // 命名冲突
  named: { value: 6 }, // 命名冲突
  toList: { value: 7 }, // 命名冲突
});

WeekEnum.foo; // 1
WeekEnum.bar; // 2
// 以下均为枚举项，优先级更高，会覆盖掉原来的方法
WeekEnum.keys; // 3
WeekEnum.values; // 4
WeekEnum.label; // 5
WeekEnum.named; // 6
WeekEnum.toList; // 7

// 可以 .items 访问到这些被覆盖的方法 🙂
WeekEnum.items[KEYS]; // ['foo', 'bar', 'keys', 'values', 'label', 'named', 'toList']
WeekEnum.items[VALUES]; // [1, 2, 3, 4, 5, 6, 7]
WeekEnum.items.label(1); // 'foo'
WeekEnum.items.named.foo; // { value: 1, label: 'foo', key: 'foo' }
WeekEnum.items.toList(); // [{ value: 1, label: 'foo' }, ...]
```

> 请注意，`keys` 和 `values` 这两个属性比较特殊，因为它们是 JavaScript 数组的内置方法，为了避免改变 items 数组的行为，需要使用 `KEYS` 和 `VALUES` 两个符号作为别名来访问它们。

再极端一点，万一 `items` 与枚举项命名冲突怎么办？放心，你仍然可以通过 `ITEMS` 别名来访问它。

```js
import { ITEMS } from 'enum-plus';

const WeekEnum = Enum({
  foo: { value: 1 },
  bar: { value: 2 },
  items: { value: 3 }, // 命名冲突
  toList: { value: 4 }, // 命名冲突
});

WeekEnum.items; // 3，枚举项优先级更高，会覆盖掉 items
WeekEnum[ITEMS].toList(); // 但可以通过 ITEMS 别名来访问它
```

---

## 最佳实践

在使用 `enum-plus` 创建和管理枚举时，遵循一些最佳实践可以帮助你编写更清晰、可维护的代码。以下是一些建议：

1. **枚举类型命名：** 采用 `PascalCase` 大驼峰命名法，并以 `Enum` 作为后缀，如 _WeekEnum_、_ColorEnum_ 等。
2. **枚举成员命名：** 使用 `PascalCase` 大驼峰命名法，如 _Sunday_、_Red_ 等。这种命名方式突显了枚举成员的静态与不可变性，并且在IDE智能提示中可以显示在顶部，而不是与其它方法名混在一起，更方便查看和拾取。
3. **语义明确：** 确保枚举和成员名称具有清晰的语义，良好的语义命名能够自解释代码意图，降低理解成本。
4. **单一职责原则：** 每个枚举类型应专注表达一组高内聚的相关常量，避免不同枚举类型之间的职责重叠。
5. **提供JSDoc注释：** 为每个枚举项添加 JSDoc 注释，说明其含义和用途。完善的JSDoc文档能在IDE中提供悬停提示，提升代码阅读体验。同样也建议为枚举类添加注释。
6. **国际化架构：** 建议从开始就搭建国际化架构，可集成本库提供的 [本地化](?path=/docs/recipes--docs&globals=locale:zh-CN#本地化) 机制。预先设计的国际化方案能够避免后期重构的高成本，并使应用更易于扩展到全球市场。

下面是一个示例，展示了如何结合上述最佳实践来定义一个枚举：

```js
/** 表示一周的枚举 */
const WeekEnum = Enum(
  {
    /** 星期日 */
    Sunday: { value: 0, label: 'enums.week.sunday' },
    /** 星期一 */
    Monday: { value: 1, label: 'enums.week.monday' },
    // ...
    /** 星期五 */
    Friday: { value: 5, label: 'enums.week.friday' },
    /** 星期六 */
    Saturday: { value: 6, label: 'enums.week.saturday' },
  },
  { name: 'enums.week.name' },
);
```

---

## 兼容性

enum-plus 设计之初就考虑了广泛的兼容性需求，可无缝运行于各类环境，包括现代浏览器、Node.js 以及多种构建工具。下面详细说明各环境的兼容性情况：

### 浏览器环境

- **现代打包工具**：对于支持 [exports](https://nodejs.org/api/packages.html#exports-sugar) 配置的打包工具（如 webpack 5+、vite、rollup），代码引入的是 `es` 目录，对应的 ECMAScript 版本是 **`ES2020`**。

- **旧版打包工具**：对于不支持 [exports](https://nodejs.org/api/packages.html#exports-sugar) 配置的旧版打包工具（如 webpack 4），代码引入的是 `es-legacy` 目录，对应的 ECMAScript 版本是 **`ES2015`**。

- **UMD版本**：为了方便在浏览器中直接使用，或者在没有打包工具的静态项目中使用，enum-plus 还提供了 UMD 版本，存放在 `umd` 目录下。UMD 格式的文件可以通过 `<script>` 标签直接引入，通过 `window.EnumPlus` 获取类库内容。umd 目录提供了两种版本：
  - **enum-plus.min.js**：对应的 ECMAScript 版本是 **`ES2020`**，适用于现代浏览器
  - **enum-plus-legacy.min.js**：对应的 ECMAScript 版本是 **`ES2015`**，适用于旧版浏览器

- **Polyfill 策略**：为了最小化包的体积，除了 UMD 格式，enum-plus 不包含任何 polyfill。如果需要支持旧版浏览器，可以自行引入以下工具：
  - `core-js`
  - 使用 `@babel/preset-env` 并配置合适的 `useBuiltIns` 选项
  - 其他替代的 polyfill 实现

### Node.js 环境

在 Node.js 环境下，支持通过 `require` 或 `import` 语法引入 enum-plus。

- **require**

  对于所有支持 CommonJS 的 Node.js 版本，均可通过 `require('enum-plus')` 方式引入 enum-plus。代码引入的是 `lib` 目录，对应的 ECMAScript 版本是 **`ES2015`**。Node.js版本最低可以向下兼容到 `v7.x`。

- **import**

  对于支持 ES Module 的 Node.js 现代版本（Node.js 14.13+），可以通过 `import { Enum } from 'enum-plus'` 方式引入 enum-plus。代码引入的是 `es` 目录，对应的 ECMAScript 版本是 **`ES2020`**。

---
