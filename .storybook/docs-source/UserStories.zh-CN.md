# 使用案例

&nbsp;

## 💡 基础用法，消除魔法数字

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

## 💡 检查是否一个有效的枚举值

```js
if (WeekEnum.has(value)) {
  // 是一个有效的枚举值，可以安全使用
} else {
  // 抛出异常或使用默认值
}
```

---

## 💡 获取完整的枚举项对象

```js
const item = WeekEnum.item(value);

if (item) {
  item.key; // Monday
  item.value; // 1
  item.label; // 星期一
  item.raw; // 原始枚举项配置
}
```

---

## 💡 检查是否一个枚举对象

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

## 💡 生成 UI 组件

以 React + Ant Design 为例，更多 UI 组件的案例请参考 [支持多种前端框架](?path=/docs/user-stories--docs&globals=locale:zh-CN#-支持多种前端框架) 章节

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

## 💡 枚举名称/标签支持国际化

可以支持多语言环境，将`label`字段设置为一个本地化键值，根据当前语言环境显示对应的文本。请参考 [本地化](?path=/docs/localization--docs&globals=locale:zh-CN#本地化) 章节，了解更多详情。

```js
WeekEnum.label(1); // Monday 或 星期一，取决于当前语言环境
WeekEnum.named.Monday.label; // Monday 或 星期一，取决于当前语言环境
WeekEnum.name; // Week 或 周，取决于当前语言环境
```

自定义元数据字段也可以本地化。当缩写、描述、提示文案等字段也是本地化键值时，可以使用 `autoLocalizeMeta`。

```js
const WeekEnum = Enum(
  {
    Sunday: { value: 0, label: 'week.sunday', abbr: 'week.abbr.sun' },
    Monday: { value: 1, label: 'week.monday', abbr: 'week.abbr.mon' },
  },
  { autoLocalizeMeta: ['abbr'] },
);

WeekEnum.items[0].abbr; // 周日
WeekEnum.named.Sunday.abbr; // 周日
```

---

## 💡 约束数据类型 (仅 TypeScript)

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

## 💡 添加元数据字段，可以作为静态配置系统使用

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

## 💡 支持遍历枚举项数组，但不可修改

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

## 💡 枚举组合（合并）

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

## 💡 启用枚举项标签的智能提示

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

## 💡 枚举项支持 JSDoc 注释，启用代码智能提示

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

## 💡 支持多种前端框架

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

## 💡 枚举配置选项

在创建枚举时，可以传入一个可选的配置对象，用来定制枚举的行为和特性。下面是一些常用的配置选项：

```ts
interface EnumOptions {
  /** 枚举类型名称，可以是一个普通字符串，或者一个本地化键值 */
  name?: string;
  /** 枚举实例级别的本地化函数，会覆盖 Enum.localize 全局配置函数 */
  localize?: (localeKey: string) => string;
  /** 为所有枚举项设置一个标签前缀，更多详情请参考 [全局配置] 章节 */
  labelPrefix?: string;
  /** 自动生成枚举项标签的规则，更多详情请参考 [全局配置] 章节 */
  autoLabel?: boolean | ((params: { item: EnumItemClass; labelPrefix?: string }) => string);
  /** 是否自动本地化枚举元数据，默认为 false。可以是布尔值，也可以是需要本地化的字段数组 */
  autoLocalizeMeta?: boolean | string[];
}
```

更多配置选项，请参考下面一个章节。

---

## 💡 在数组初始化方式中，设置不同的字段映射

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

<!-- docs-prev-next-nav -->

| 上一篇                                                                    | 下一篇                                                              |
| ------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| [← 全局配置](?path=/docs/global-configuration--docs&globals=locale:zh-CN) | [最佳实践 →](?path=/docs/best-practices--docs&globals=locale:zh-CN) |
