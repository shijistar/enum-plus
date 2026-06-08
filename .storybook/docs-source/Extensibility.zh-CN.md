# 全局扩展

Enum 提供了丰富的内置方法和属性，它们已经可以满足大多数常见的使用场景。如果这些还不够，你还可以使用 `Enum.extends` 扩展更多的自定义方法。这些扩展会全局应用于所有枚举实例，包括在扩展应用之前创建的实例，并且会立即生效，无需任何额外的设置。

> 实际上，整个[插件系统](?path=/docs/plugin-system--docs&globals=locale:zh-CN#插件系统)以及 `Enum.install` 在底层都是通过 `Enum.extends` 来实现的。

&nbsp;

## TypeScript 项目

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

## JavaScript 项目

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

<!-- docs-prev-next-nav -->

| 上一篇                                                             | 下一篇                                                          |
| ------------------------------------------------------------------ | --------------------------------------------------------------- |
| [← 插件系统](?path=/docs/plugin-system--docs&globals=locale:zh-CN) | [本地化 →](?path=/docs/localization--docs&globals=locale:zh-CN) |
