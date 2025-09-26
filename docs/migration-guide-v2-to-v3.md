# Migration Guide (v2 to v3)

## 🛠 Behavior Change of enum.values

The `enum.values` property was originally planned for removal, but [after some discussions](https://github.com/shijistar/enum-plus/issues/13), we decided to restore it and change its function: it now represents an array of the member raw values. Therefore, if you are still using the old `values`, please change to the `enum.items` instead.

## 🛠 Symbols Changes

The following symbols have been renamed to better reflect their purpose:

- `ENUM_COLLECTION` is now `IS_ENUM`
- `ENUM_ITEM` is now `IS_ENUM_ITEM`
- `ENUM_ITEMS` is now `IS_ENUM_ITEMS`

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

## 🛠 AntDesign Oriented Methods are Moved to Plugin

- `enum.toSelect`
- `enum.toMenu`
- `enum.toFilter`
- `enum.toValueMap`

The above methods are removed from the core library and moved to the [@enum-plus/plugin-antd](https://www.npmjs.com/package/@enum-plus/plugin-antd) package. They are now available as part of the plugin. Please install the plugin and refer to the plugin documentation for usage.

The following methods are deprecated and permanently removed. However they both have alternatives, please use the alternative methods instead.

- _**enum.options**_

  Please use `enum.toSelect` instead.

- _**enum.menus**_

  Please use `enum.toMenu` instead.

- _**enum.filters**_

  Please use `enum.toFilter` instead.

- _**enum.valuesEnum**_

  Please use `enum.toValueMap` instead.

## 🛠 Type changes

- `EnumValuesArray` has has been deprecated and replaced with `EnumItemsArray`.

  ```diff
  - import { EnumValuesArray } from 'enum-plus';
  + import { EnumItemsArray } from 'enum-plus';
  ```

- `IEnumValues` has been renamed to `IEnumItems`.

  ```diff
  - import { IEnumValues } from 'enum-plus';
  + import { IEnumItems } from 'enum-plus';
  ```

## 🛠 The typing declaration of extending Enums has changed

<!-- 在 v2 中，扩展 Enum 类型的方式是使用全局类型的接口合并： -->

In v2, the way to extend Enum types was using global type interface merging:

_enum-extension.d.ts_

```ts
declare global {
  export interface EnumExtension<T, K, V> {
    hello(): string;
  }
}
```

In v3, the way to extend Enum types is using module declaration interface merging:

_enum-extension.d.ts_

```ts
declare module 'enum-plus' {
  export interface EnumExtension<T, K, V> {
    hello(): string;
  }
}
```

At the same time, import the `enum-extension.d.ts` module in the project entry file:

_index.ts_

```ts
import './enum-extension';
```

The advantage of this approach is that it avoids global namespace pollution and makes it clearer which module the extension is for.

## 🛠 Recommended to Upgrade TypeScript to 5.0

Although enum-plus v3 still supports TypeScript 3.8 and above, we strongly recommend upgrading to TypeScript 5.0 or above for the best experience. This is because v3 leverages some new features introduced in TypeScript 5.0, such as [const type parameters](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#const-type-parameters), which can significantly improve type inference and code maintainability. Now, you no longer need to use the `as const` assertion when initializing Enums. Enums can now be initialized with literal objects by default.

```js
const WeekEnum = Enum({
  Sunday: 0,
  Monday: 1,
});
```

> If you can't upgrade, don't worry. TypeScript `4.9` or earlier is still backward compatible. You just need to add `as const` manually, just like before.

<!-- - `moduleResolution` in tsconfig.json
  - `node` or `node10`, TypeScript version `>=3.8`. The [const Type Parameters](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#const-type-parameters) is not supported, should add `as const` manually to the Enum initializations.
  - `node16` or `nodenext`, TypeScript version `>=5.0` -->
