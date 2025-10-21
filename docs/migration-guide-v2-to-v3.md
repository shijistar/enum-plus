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

In v2, the way to extend Enum types was using global type interface merging:

_enum-extension.d.ts_

```ts
declare global {
  export interface EnumExtension<T, K, V> {
    hello(): string;
  }
}
```

In v3, module declaration is used for interface merging, and you can also combine the implementation and type declaration into one file.

_my-enum-extension.ts_

```ts
import { Enum } from 'enum-plus';

// Implementation code
Enum.extends({
  hello() {
    return 'Hello, EnumPlus!';
  },
});

// Type declaration
declare module 'enum-plus/extension' {
  export interface EnumExtension<T, K, V> {
    hello(): string;
  }
}
```

Then import this file in the entry point of your project:

_index.js_

```ts
import './my-enum-extension';

WeekEnum.hello(); // 'Hello, EnumPlus!'
```

The advantage of this approach is that it avoids global namespace pollution and makes it clearer which module the extension is for.

## 🛠 Recommended to Upgrade TypeScript to 5.0

Although enum-plus v3 still supports TypeScript 3.8 and above, we strongly recommend upgrading to TypeScript 5.0 or above for the best experience. This is because v3 leverages some new features introduced in TypeScript 5.0, such as [const type parameters](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#const-type-parameters), which can significantly improve type inference and code maintainability. Now, you no longer need to use the `as const` assertion when initializing Enums. Enums can now be initialized with literal objects by default.

#### Upgrade TypeScript

```bash
npm install typescript@^5.0 --save-dev
```

#### Modify tsconfig.json

- **If you have upgraded to TypeScript 5.0 or above:**

Please set `moduleResolution` to any value **other than** `node` or `node10`, then you don't need to make any additional changes.

If you must set `moduleResolution` to `node` or `node10` for some reason, you will be automatically switched to a compatible mode type system and will not enjoy the convenience brought by automatic `as const`, so you may need to manually add `as const` assertions. If you insist on using modern version type definitions, please modify the `paths` configuration in `tsconfig.json` to manually map to modern mode type definitions:

```json
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

- **If you are still using TypeScript version `4.x` or below:**

Please ensure that `moduleResolution` is set to `node` or `node10` to use the compatible version type definitions. Since earlier versions of TypeScript do not support [const type parameters](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#const-type-parameters), the enum types will become `any`. Additionally, you need to add `as const` assertions when initializing Enums in your code.

If for some reason you must set `moduleResolution` to a value other than `node` or `node10`, then you need to modify the `paths` configuration in `tsconfig.json` to manually map to compatible version type definitions:

```json
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

#### Modify your code

Before:

```ts
const WeekEnum = Enum({
  Sunday: 0,
  Monday: 1,
} as const);
```

After:

```ts
const WeekEnum = Enum({
  Sunday: 0,
  Monday: 1,
});
```
