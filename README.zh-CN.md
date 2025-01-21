<!-- markdownlint-disable MD009 -->

# enum-plus

一个 TypeScript 枚举库，完全兼容原生 `enum` 枚举对象的用法，同时扩展了一些高非常实用的方法，支持本地化方案。可以作为 `enum` 的完美替代品。

[English](./README.md) | [中文](./README.zh-CN.md)

## 特性

- 兼容原生 `enum` 类型的用法，可以作为 `enum` 的替代品
- 支持字符串和数字两种枚举类型
- 扩展了一组常用的枚举项集合操作方法，如 `label`、`key`、`options`，既可以很简单获取枚举项的显示文本，也可以用于绑定下拉框等组件
- 良好支持 TypeScript 类型推断
- 轻量(gzip 压缩后仅 4KB)

## 安装

使用 npm 安装:

```bash
npm install enum-plus
```

或者使用 yarn:

```bash
yarn add enum-plus
```

## 枚举定义

生成一个枚举集合，枚举值支持 `number` 和 `string` 两种类型。

示例 1：基础用法，与原生枚举用法基本一致

```js
import { Enum } from 'enum-plus';

const Week = Enum({
  Sunday: 0,
  Monday: 1,
} as const);
Week.Monday; // 1
```

示例 2：值类型使用 string

```js
import { Enum } from 'enum-plus';

const Week = Enum({
  Sunday: 'Sun',
  Monday: 'Mon',
} as const);
Week.Monday; // 'Mon'
```

👍 示例 3（标准写法，推荐）：扩展 label 枚举项文本

```js
import { Enum } from 'enum-plus';

const Week = Enum({
  Sunday: { value: 0, label: '星期日' },
  Monday: { value: 1, label: '星期一' },
} as const);
Week.Monday; // 1
Week.label(1); // 星期一
```

👍 示例 4：省略 value 字段，自动降级使用 key 字段

```js
import { Enum } from 'enum-plus';

const Week = Enum({
  Sunday: { label: '星期日' }, // 等价于 { value: "Sunday", label: '星期日' }
  Monday: { label: '星期一' }, // 等价于 { value: "Monday", label: '星期一' }
} as const);
Week.Monday; // 'Monday'
Week.label('Monday'); // 星期一
```

## API

- **获取枚举值**

  可以通过枚举项的 Key 直接获取枚举值，与`enum`类型用法一致，例如，`Week.Monday` = 1，`Week.Sunday` = 0

- **values** :`MyEnum.values: {value, label, key, raw}[]`

  获取枚举项列表

- **keys** : `MyEnum.keys: string[]`

  获取枚举项的 key 列表

- **label** 方法 : `label(keyOrValue?: string | number): string | undefined`

  根据某个枚举值或 Key，获取该枚举项的显示文本。如果设置了本地化方法，则会返回本地化后的文本。

- **key** 方法 : `key(value?: string | number): K | undefined`

  根据枚举值获取该枚举项的 Key

- **has** 方法 : `has(keyOrValue?: string | number): boolean`

  判断某个枚举项（值或 Key）是否存在

- **options** 方法 : `options(config?: OptionsConfig): {value, label}[]`

  生成符合 AntDesign 规范的下拉数据源数组，可以直接传给 Select、Radio、Checkbox 等组件

- **valuesEnum** 方法 : `valuesEnum(): Record<V, { text: string }>`

  生成一个符合 AntDesignPro 规范的枚举集合对象，可以传递给 ProFormField、ProTable 组件

- **filters** 方法 : `filters(): { text, value }[]`

  生成一个 filters 数组，可以直接传递给 AntDesign Table 组件 Column 的 filters 属性，作为列的筛选项

- **raw** 方法 : `raw(): T`

  获取枚举集合的初始化对象，即 Enum 方法的第一个参数

- **raw** 方法 : `raw(keyOrValue: V | K): T[K]`

  获取某个枚举项的原始初始化对象。如果在枚举项上增加了自定义字段的话，可以用这种方式获取到。

- _(type only)_ **valueType** : `valueType: V`

  获取枚举值的数据类型，注意这是一个类型声明，不可在运行时调用

- _(type only)_ **keyType** : `keyType: K`

  获取枚举项的 key 的数据类型，注意这是一个类型声明，不可在运行时调用

- _(type only)_ **rawType** : `rawType: T[K]`

  获取枚举项原始初始化对象的类型，注意这是一个类型声明，不可在运行时调用

## 使用方法

- **访问枚举项，与原生枚举用法一致**

```js
Week.Monday; // 1
Week.Sunday; // 0
```

- **添加扩展字段**

```js
const Week = Enum({
  Sunday: { value: 0, label: '星期日', active: true, disabled: false },
  Monday: { value: 1, label: '星期一', active: false, disabled: true },
} as const);
Week.raw(0).active // true
Week.raw(Week.Sunday).active // true
Week.raw('Sunday').active // true
```

- **获取枚举项数组**

```js
Week.values;
// [
//  { value: 0, label: '星期日', key: 'Sunday', raw: { value: 0, label: '星期日' } },
//  { value: 1, label: '星期一', key: 'Monday' }
// ]
```

- 获取第一个枚举项的值

```js
Week.values[0].value; // 0
```

- 判断枚举中是否包含某个值

```js
Week.values.some(item => item.value === 1); // true
Week.has(1); // true
1 instance of Week; // true
```

- `instanceof` 操作符

```js
1 instance of Week // true
"1" instance of Week // true
"Monday" instance of Week // true
```

- 支持遍历枚举项数组，但不支持修改

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

- 获取某个值的显示文本

```js
Week.label(1); // 星期一，
Week.label(Week.Monday); // 星期一
Week.label('Monday'); // 星期一
```

- 获取某个枚举项的 key

```js
Week.key(1); // 'Monday'
Week.key(Week.Monday); // 'Monday'
Week.key(9); // undefined
```

- 针对 [AntDesign](https://github.com/ant-design/ant-design) 组件库的优化和语法糖

  - `values`直接作为`Select`、`Checkbox`等组件的数据源

  ```jsx
  <Select options={Week.values} />
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
  <Menu items={Week.menus()} />
  ```

  - `filters`方法可以为 [AntDesign](https://github.com/ant-design/ant-design) `Table` 组件的`列筛选`功能生成数据源，格式为：`{ text: string, value: number|string }[]`

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

  - `valuesEnum`方法可以为 [AntDesignPro](https://github.com/ant-design/pro-components) 的`ProFormFields`、`ProTable`等组件生成数据源，这是一个类似 Map 的数据结构，格式为：`{ [key: number|string]: { text: string } }`

  ```jsx
  <ProFormSelect valueEnum={Week.valuesEnum()} />
  ```

- 两个枚举合并（或者扩展某个枚举）

```js
const myWeek = Enum({
  ...Week.raw(),
  Friday: { value: 5, label: '星期五' },
  Saturday: { value: 6, label: '星期六' },
});
```

- _[TypeScript Only]_ 【强烈建议】 使用枚举值的数据类型

使用 `valueType` 类型可以更精确的限制数据类型，相比使用 number、string 这种宽泛的数据类型更好

```typescript
type FooComponentProps = {
  value?: typeof Week.valueType; // 数据类型从number缩小至 0 | 1
  names?: typeof Week.keyType; // 'Sunday' | 'Monday'
};
```

- 😟 命名冲突？

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
//  { value: 1, label: 'foo' },
//  { value: 2, label: 'bar' },
//  { value: 3, label: 'values' }
// ]
// 等价于原来的 Week.values 🙂
```

## 本地化

`enum-plus` 本身不提供国际化功能，但是可以通过 `localize` 选项来实现本地化文本。你需要自己在项目中维护语言，并且在 `localize` 方法中实现文本的本地化。你也可以使用任意流行的国际化库，比如 `i18next`。

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
// ✅ 请使用 i18next 或其他国际化库
const i18nLocalize = (content: string) => i18next.t(content);
// ✅ 或者封装成一个基础组件
const componentLocalize = (content: string) => <Localize value={content} />;

const Week = Enum(
  {
    Sunday: { value: 0, label: 'weekday.sunday' },
    Monday: { value: 1, label: 'weekday.monday' },
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
