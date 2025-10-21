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

在 v3 中，使用模块声明的方式进行接口合并，同时还可以把功能实现和类型声明合并到一个文件中。

_my-enum-extension.ts_

```ts
import { Enum } from 'enum-plus';

// 功能实现
Enum.extends({
  hello() {
    return '你好，EnumPlus！';
  },
});

// 类型声明
declare module 'enum-plus/extension' {
  export interface EnumExtension<T, K, V> {
    hello(): string;
  }
}
```

然后在项目的入口文件中导入这个文件：

_index.js_

```ts
import './my-enum-extension';

WeekEnum.hello(); // '你好，EnumPlus！'
```

这样做的好处是避免了全局命名空间污染，并且可以更清晰地看到扩展是针对哪个模块的。

## 🛠 推荐升级 TypeScript 至 5.0

虽然 enum-plus v3 仍然支持 TypeScript 3.8 及更高版本，但我们强烈建议升级到 TypeScript 5.0 或更高版本，以获得最佳体验。 这是因为 v3 利用了 TypeScript 5.0 引入的一些新特性，如 [const 类型参数](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#const-type-parameters)，这些特性可以显著提升类型推断和代码的可维护性。现在，你不再需要在 Enum 初始化时使用 `as const` 断言。Enum 现在可以默认使用字面量对象进行初始化。

#### 升级 TypeScript

```bash
npm install typescript@^5.0 --save-dev
```

#### 修改 tsconfig.json

- **如果你已经升级到 TypeScript 5.0 或更高版本：**

请检查 `tsconfig.json` 中的 `moduleResolution` 配置，确保其值是**除了** `node` 或 `node10` **之外**的其他值，那么你不需要做任何额外的修改。

如果因为特殊原因，你必须将 `moduleResolution` 设置为 `node` 或 `node10`，那么你将被自动切换到兼容模式的类型系统，不会享受到自动 `as const` 带来的便利性，因此你可能需要手动添加 `as const` 断言。如果你坚持希望使用现代版本的类型定义，请修改 `tsconfig.json` 的 `paths` 配置，手动映射到现代模式的类型定义：

```js
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "enum-plus": ["./node_modules/enum-plus/lib/index.d.ts"],
      "enum-plus/*": ["./node_modules/enum-plus/lib/*"]
    }
  }
}
```

- **如果你仍在使用 `4.x` 或更低版本的 TypeScript：**

请检查 `tsconfig.json` 中的 `moduleResolution` 配置，确保其被设置为 `node` 或 `node10`，将确保你使用的是兼容版本的类型定义。兼容版本模式会自动从类型定义中移除 [const 类型参数](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#const-type-parameters) 特性，否则会导致所有枚举的类型都变成 `any`。另外，你需要在初始化 Enum 时手动添加 `as const` 断言，以确保更优的类型推断。

如果由于特殊原因你必须将 `moduleResolution` 设置为 `node` 或 `node10` 之外的其他值，那么你需要修改 `tsconfig.json` 的 `paths` 配置，手动映射到兼容版本的类型定义：

```js
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "enum-plus": ["./node_modules/enum-plus/types-legacy/pre-v5/index.d.ts"],
      "enum-plus/*": ["./node_modules/enum-plus/types-legacy/pre-v5/*"]
    }
  }
}
```

#### 修改项目代码

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
