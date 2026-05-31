## Naming Conflicts?

`enum-plus` is designed with naming conflicts in mind. The namespace of enum items is separate from the methods and properties of the enum instance, minimizing the chances of conflicts. For example, when an enum item's name conflicts with a method name, you can access the overridden methods through the `items` property.

```js
import { KEYS, VALUES } from 'enum-plus';

const WeekEnum = Enum({
  foo: { value: 1 },
  bar: { value: 2 },
  keys: { value: 3 }, // Naming conflict
  values: { value: 4 }, // Naming conflict
  label: { value: 5 }, // Naming conflict
  named: { value: 6 }, // Naming conflict
  toList: { value: 7 }, // Naming conflict
});

WeekEnum.foo; // 1
WeekEnum.bar; // 2
// Below are all enum items, which take precedence and override the original methods
WeekEnum.keys; // 3
WeekEnum.values; // 4
WeekEnum.label; // 5
WeekEnum.named; // 6
WeekEnum.toList; // 7

// You can access these overridden methods via .items 🙂
WeekEnum.items[KEYS]; // ['foo', 'bar', 'keys', 'values', 'label', 'named', 'toList']
WeekEnum.items[VALUES]; // [1, 2, 3, 4, 5, 6, 7]
WeekEnum.items.label(1); // 'foo'
WeekEnum.items.named.foo; // { value: 1, label: 'foo', key: 'foo' }
WeekEnum.items.toList(); // [{ value: 1, label: 'foo' }, ...]
```

> Note that `keys` and `values` are special because they are built-in methods of JavaScript arrays. To avoid altering the behavior of the `items` array, you need to use the `KEYS` and `VALUES` symbols as aliases to access them.

For an even more extreme case, what if `items` conflicts with an enum item name? Don't worry, you can still access it via the `ITEMS` alias.

```js
import { ITEMS } from 'enum-plus';

const WeekEnum = Enum({
  foo: { value: 1 },
  bar: { value: 2 },
  items: { value: 3 }, // Naming conflict
  toList: { value: 4 }, // Naming conflict
});

WeekEnum.items; // 3, enum item takes precedence and overrides items
WeekEnum[ITEMS].toList(); // But you can access it via the ITEMS alias
```

---
