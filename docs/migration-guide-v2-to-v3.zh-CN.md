# 迁移指南 (v2到v3)

## 🛠 enum.values 行为变更

`enum.values` 属性原计划是要移除的，但[经过一些讨论后](https://github.com/shijistar/enum-plus/issues/13)，我们决定保留它并改变其功能：它现在表示成员原始值的数组。因此，如果你仍在使用旧的 `values`，请改为使用 `enum.items`。

## 🛠 符号变更

以下符号已被重命名，以更好地反映其用途：

- `ENUM_COLLECTION` 变更为 `IS_ENUM`
- `ENUM_ITEM` 变更为 `IS_ENUM_ITEM`
- `ENUM_ITEMS` 变更为 `IS_ENUM_ITEMS`

```diff
- import { ENUM_COLLECTION, ENUM_ITEM, ENUM_ITEMS } from 'enum-plus';
+ import { IS_ENUM, IS_ENUM_ITEM, IS_ENUM_ITEMS } from 'enum-plus';

- WeekEnum[ENUM_COLLECTION]; // true
+ WeekEnum[IS_ENUM]; // true

const Monday = WeekEnum.items[0];
- Monday[ENUM_ITEM]; // true
+ Monday[IS_ENUM_ITEM]; // true

- WeekEnum.items[ENUM_ITEMS]; // true
+ WeekEnum.items[IS_ENUM_ITEMS]; // true
```

## 🛠 AntDesign 相关方法被迁移到插件库

- `enum.toSelect`
- `enum.toMenu`
- `enum.toFilter`
- `enum.toValueMap`

上述方法已从核心库中移除并迁移到 [@enum-plus/plugin-antd](https://www.npmjs.com/package/@enum-plus/plugin-antd) 包中。它们现在作为插件的一部分提供。请安装该插件并参考插件文档以了解用法。

以下方法已被弃用并永久移除，但它们都有替代方法，请改用替代方法。

- _**enum.options**_

  请改用 `enum.toSelect`。

- _**enum.menus**_
  请改用 `enum.toMenu`。

- _**enum.filters**_
  请改用 `enum.toFilter`。

- _**enum.valueMaps**_
  请改用 `enum.toValueMap`。

## 🛠 类型变更

- `EnumValuesArray` 已被弃用并替换为 `EnumItemsArray`。

  ```diff
  - import { EnumValuesArray } from 'enum-plus';
  + import { EnumItemsArray } from 'enum-plus';
  ```

- `IEnumValues` 已重命名为 `IEnumItems`。

  ```diff
  - import { IEnumValues } from 'enum-plus';
  + import { IEnumItems } from 'enum-plus';
  ```

## 🛠 扩展 Enum 类型的方式已更改

在 v2 中，扩展 Enum 类型的方式是使用全局类型的接口合并：

_enum-extension.d.ts_

```ts
declare global {
  export interface EnumExtension<T, K, V> {
    hello(): string;
  }
}
```

在 v3 中，扩展 Enum 类型的方式是使用模块声明的接口合并：

_enum-extension.d.ts_

```ts
declare module 'enum-plus/extension' {
  export interface EnumExtension<T, K, V> {
    hello(): string;
  }
}
```

同时，在项目入口文件中导入 `enum-extension.d.ts` 模块：

_index.ts_

```ts
import './enum-extension';
```

这样做的好处是避免了全局命名空间污染，并且可以更清晰地看到扩展是针对哪个模块的。

## 🛠 推荐升级 TypeScript 至 5.0

虽然 enum-plus v3 仍然支持 TypeScript 3.8 及更高版本，但我们强烈建议升级到 TypeScript 5.0 或更高版本，以获得最佳体验。 这是因为 v3 利用了 TypeScript 5.0 引入的一些新特性，如 [const 类型参数](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#const-type-parameters)，这些特性可以显著提升类型推断和代码的可维护性。现在，你不再需要在 Enum 初始化时使用 `as const` 断言。Enum 现在可以默认使用字面量对象进行初始化。

以前：

```ts
const WeekEnum = Enum({
  Sunday: 0,
  Monday: 1,
} as const);
```

现在：

```ts
const WeekEnum = Enum({
  Sunday: 0,
  Monday: 1,
});
```

> **注意**：如果你无法升级到 TypeScript 5.0，请放心，v3 仍然能够自动平滑降级，以支持较早的 TypeScript 版本。但你需要继续使用 `as const` 断言来确保类型的正确推断。

<!-- - `tsconfig.json` 中的 `moduleResolution` 配置：
  - 对于 `node` 或 `node10`，需要 TypeScript 版本 `>=3.8`。由于不支持 [const 类型参数](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#const-type-parameters)，你需要手动在 Enum 初始化时添加 `as const` 断言。
  - 对于 `node16` 或 `nodenext`，需要 TypeScript 版本 `>=5.0`。 -->
