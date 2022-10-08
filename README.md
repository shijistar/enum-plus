# enum-plus

An enumeration library similar to typescript's `enum` keyword, but extended with some enhanced features.

生成一个枚举集合，枚举值支持 `number` 和 `string` 两种类型。

## Installation

Install using yarn:

```bash
yarn add enum-plus
```

Or npm:

```bash
npm install enum-plus
```

## 枚举定义

示例 1：number 类型

```typescript
import { Enum } from 'enum-plus';

const Week = Enum({
  Sunday: 0,
  Monday: 1,
} as const);
```

示例 2：string 类型

```typescript
import { Enum } from 'enum-plus';

const Week = Enum({
  Sunday: 'Sunday',
  Monday: 'Monday',
} as const);
```

示例 3（标准写法，推荐）：扩展 label 显示文本

```typescript
import { Enum } from 'enum-plus';

const Week = Enum({
  Sunday: { value: 0, label: '星期日' },
  Monday: { value: 1, label: '星期一' },
} as const);
```

示例 4（推荐）：省略 label，value 的默认值为 key

```typescript
import { Enum } from 'enum-plus';

const Week = Enum({
  Sunday: { label: '星期日' }, // 等价于 { value: "Sunday", label: '星期日' }
  Monday: { label: '星期一' }, // 等价于 { value: "Monday", label: '星期一' }
} as const);
```

示例 5：与示例 2 等价，value 的默认值为 key

```typescript
import { Enum } from 'enum-plus';

const Week = Enum({
  Sunday: undefined, // 等价于 { value: "Sunday" }
  Monday: undefined, // 等价于 { value: "Sunday" }
} as const);
```

示例 6：扩展自定义字段

```typescript
import { Enum } from 'enum-plus';

const Week = Enum({
  Sunday: { value: 0, label: '星期日', active: true, disabled: false },
  Monday: { value: 0, label: '星期日', active: false, disabled: true },
} as const);
// Week.raw('Sunday').active // true
// Week.raw('Monday').disabled // true
```

## 使用方法

直接作为 Select 的数据源

```tsx
<Select options={Week.values} />
```

在头部增加默认选项（默认文本为'全部'，value 为''）

```tsx
<Select options={Week.options({ firstOption: true })} />
```

在头部增加自定义选项

```tsx
<Select options={Week.options({ firstOption: { value: 0, label: '不限' } as const })} />
```

使用 AntDesignPro

```tsx
<ProFormSelect valueEnum={Week.valuesEnum()} />
```

支持所有数组遍历，但不支持任何形式的修改

```typescript
Week.values.length; // 2
Week.values.map((item) => item.value); // [0, 1]，可遍历
Week.values.forEach((item) => {}); // 可遍历
for (let item of Week.values) {
} // 可遍历
Week.values.push({ value: 2, label: '星期二' }); // ❌ 不可修改
Week.values[0].label = 'foo'; // ❌ 不可修改
```

获取第一个枚举项的值

```typescript
Week.values[0].value; // 0
```

判断某个值是否有效？

```typescript
Week.values.some(item => item.value === 1); // true
if(1 instance of Week) // true，更简单的用法
```

`instanceof` 操作符

```typescript
1 instance of Week // true
"1" instance of Week // true
"Monday" instance of Week // true
```

获取某个值的显示文本

```typescript
Week.label(1); // 星期一，
Week.label(Week.Monday); // 星期一
Week.label('Monday'); // 星期一
```

获取某个枚举项的 key

```typescript
Week.key(1); // 'Monday'
Week.key(Week.Monday); // 'Monday'
Week.key(9); // undefined
```

两个枚举合并（或者扩展某个枚举）

```typescript
const myWeek = Enum({
...Week.raw(),
Friday: 5,
Saturday: 6,
};
```

给枚举字段声明类型，【强烈建议】

```typescript
type Props = {
  week: typeof Week.valueType; // 0 | 1
  weekName: typeof Week.keyType; // 'Sunday' | 'Monday'
};
```

使用 valueType 类型可以更准确的限定取值范围，比使用 number、string 这种宽泛的数据类型更好

😟 命名冲突？

如果 `Week` 的 `key`、`label`、`options` 方法与某个枚举的 key 重名了，则这些方法会被覆盖掉。不用担心，在 `Week.values` 下仍然可以访问到这些方法
