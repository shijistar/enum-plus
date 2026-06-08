# 命名冲突？

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

<!-- docs-prev-next-nav -->

## 继续阅读

| 上一步                                                          | 下一步                                                           |
| --------------------------------------------------------------- | ---------------------------------------------------------------- |
| [← 本地化](?path=/docs/localization--docs&globals=locale:zh-CN) | [兼容性 →](?path=/docs/compatibility--docs&globals=locale:zh-CN) |
