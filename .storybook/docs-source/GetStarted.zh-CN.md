## 枚举定义

本节展示了使用 `Enum` 函数初始化枚举的多种方式，你可以根据不同的使用场景选择最合适的方法

### 1. Key-Value 格式

```js
import { Enum } from 'enum-plus';

// Number 类型
const WeekEnum = Enum({
  Sunday: 0,
  Monday: 1,
});

WeekEnum.Monday; // 1

// String 类型
const WeekEnum2 = Enum({
  Sunday: 'Sun',
  Monday: 'Mon',
});

WeekEnum2.Monday; // 'Mon'
```

> 如果你的项目使用 TypeScript 且版本低于 5.0，那么建议你为 Enum 方法的参数添加 `as const` 类型断言，这样枚举值将保持原始的字面量值，而不会变成`number`、`string`类型。关于更多详情，请参考 [这里](?path=/docs/faq--docs&globals=locale:zh-CN#typescript-版本必须升级到-50-吗)。

### 2. 标准格式（推荐）

为每个枚举项指定 `value` (枚举值) 和 `label`（显示名称）字段，这是最常用的格式，也是推荐的格式。这种格式允许你为每个枚举项设置显示名称，这些文本可以在 UI 组件中使用。关于为 `label` 字段启用本地化支持，请参考[本地化](?path=/docs/localization--docs&globals=locale:zh-CN#本地化)章节

```js
import { Enum } from 'enum-plus';

const WeekEnum = Enum({
  Sunday: { value: 0, label: '星期日' },
  Monday: { value: 1, label: '星期一' },
});

WeekEnum.Sunday; // 0
WeekEnum.items[0].key; // 'Sunday'
WeekEnum.items[0].label; // 星期日
```

> 想要输入 `label` 时启用代码智能提示？请参考 [启用枚举项标签的智能提示](?path=/docs/user-stories--docs&globals=locale:zh-CN#-启用枚举项标签的智能提示) 章节，了解更多详情。
>
> 希望自定义 `label` 字段逻辑？可以传入一个函数，请参考 [自定义 label 逻辑](?path=/docs/localization--docs&globals=locale:zh-CN#自定义-label-逻辑) 章节，了解更多详情。

### 3. Key-Label 格式

只提供 `key` 和 `label` 字段创建枚举。如果省略了 `value` 字段，则它默认为与 `key` 字段相同。

```js
import { Enum } from 'enum-plus';

const WeekEnum = Enum({
  Sunday: { label: '星期日' },
  Monday: { label: '星期一' },
});

WeekEnum.Sunday; // 'Sunday'
WeekEnum.items[0].key; // 'Sunday'
WeekEnum.items[0].label; // 星期日
```

### 4. 数组格式

数组格式在需要动态创建枚举时很有用，例如从 API 获取数据中动态创建一个枚举。

你可以动态映射字段以适应各种不同的数据结构。请参考 [数组格式初始化，设置不同的字段映射](?path=/docs/user-stories--docs&globals=locale:zh-CN#-在数组初始化方式中设置不同的字段映射) 章节，了解更多详情。

```js
import { Enum } from 'enum-plus';

const pets = [
  { value: 1, key: 'Dog', label: '可爱的小狗' },
  { value: 2, key: 'Cat', label: '萌萌的小猫' },
  { value: 3, key: 'Rabbit', label: '白白的小兔' },
];
const PetEnum = Enum(pets);

PetEnum.Dog; // 1
PetEnum.label(1); // 狗
```

### 5. 原生枚举格式

如果你已经有一个原生的枚举，你可以直接传递给`Enum`函数，它会自动转换为增强版的枚举，这样可以借用原生枚举的`枚举值自动递增`特性

```ts
import { Enum } from 'enum-plus';

enum WeekNative {
  Sunday = 0,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}
const WeekEnum = Enum(WeekNative);

WeekEnum.Sunday; // 0
WeekEnum.Monday; // 1
WeekEnum.Saturday; // 6
```

> 请注意：当创建枚举对象时，所有枚举项的数据结构必须保持一致。例如，不能在同一个枚举中同时使用 Key-Value 格式和标准格式。
>
> 枚举还支持一些配置项，以更好地控制枚举的行为，详情请参考 [枚举配置选项](?path=/docs/user-stories--docs&globals=locale:zh-CN#-枚举配置选项) 章节。
