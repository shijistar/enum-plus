# Extensibility

Enum provides a wealth of built-in methods and properties that can satisfy most common use cases. However, if they are not sufficient, you can use `Enum.extends` to add more custom methods. These extensions will be globally applied to all enum instances, including those created before the extension was applied, and will take effect immediately without any additional setup.

> In fact, the entire [Plugin System](?path=/docs/plugin-system--docs#plugin-system) and the `Enum.install` method are implemented using `Enum.extends` at the underlying level.

&nbsp;

## TypeScript Projects

_my-enum-extension.ts_

```ts
// Implementation code
Enum.extends({
  toMySelect() {
    return this.items.map((item) => ({ value: item.value, title: item.label }));
  },
  reversedItems() {
    return this.items.toReversed();
  },
});

// Type declaration for better type hints
declare module 'enum-plus/extension' {
  export interface EnumExtension<T, K, V> {
    toMySelect: () => { value: V; title: string }[];
    reversedItems: () => EnumItemClass<EnumItemInit<V>, K, V>[];
  }
}
```

_index.ts_

Then import this file in the entry file of your project:

```ts
import './my-enum-extension';

WeekEnum.toMySelect(); // [{ value: 0, title: 'Sunday' }, { value: 1, title: 'Monday' }]
```

## JavaScript Projects

_my-enum-extension.js_

```js
import { Enum } from 'enum-plus';

// Implementation code
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

// Type declaration for better type hints
declare module 'enum-plus/extension' {
  export interface EnumExtension<T, K, V> {
    toMySelect: () => { value: V; title: string }[];
    reversedItems: () => EnumItemClass<EnumItemInit<V>, K, V>[];
  }
}
```

_index.js_

Then import this file in the entry file of your project:

```js
import './my-enum-extension';

WeekEnum.toMySelect(); // [{ value: 0, title: 'Sunday' }, { value: 1, title: 'Monday' }]
```

Please note that `EnumExtension` is a generic interface that accepts three type parameters, which represent:

- `T`: Initialization object of the enum type (e.g., the object passed to `Enum()`)
- `K`: Key of the enum item (e.g., Sunday, Monday)
- `V`: Value of the enum items

> If you want to provide more friendly type hints in the extension methods, you may need to use these type parameters. However these are all optional, if you don't need them, you can omit them.

---

<!-- docs-prev-next-nav -->

| Previous                                           | Next                                             |
| -------------------------------------------------- | ------------------------------------------------ |
| [← Plugin System](?path=/docs/plugin-system--docs) | [Localization →](?path=/docs/localization--docs) |
