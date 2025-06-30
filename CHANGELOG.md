<!-- markdownlint-disable MD009 MD024 -->

# enum-plus Changelog

## 3.0.0

_UNRELEASED_

**enum-plus v3** is coming! 🎉

### Features

- 🔥 Introduces the new plugin system. Plugins are registered using `Enum.install`. The plugin system allows you to add new methods or properties to all enums. While similar to `Enum.extends`, the plugin system enables features to be packaged as `shareable` plugins, making it more flexible and widely applicable.
- 🔥 introduce an official plugin `enum-plus-plugin` that provides a collection of highly shareable plugins.
  - These plugins are designed to work in all scenarios and environments (including browser and Node.js), without introducing dependencies on third-party frameworks, component libraries, or platforms.
  - If you have a good idea that might be specific to a certain framework or platform rather than universally applicable, we recommend creating a new plugin project (e.g., `enum-plus-plugin-xxx`). We are happy to see that, and hope that you submit a PR to `enum-plus-plugin` to link your project back.
- 🛠 Add `const` modifier to Enum function to simplify the enum initialization. Inline initializations no longer requires `as const`. Thanks to @otomad.

```diff
import { Enum } from 'enum-plus';

const MyEnum = Enum({
  Foo: 1,
  Bar: 2,
- } as const);
+ });
```

- ✨ Introduced **UMD module format** support, enabling direct browser usage without requiring a module bundler. Two variants are now available:

  - `enum-plus.min.js` (ES2020) optimized for modern browsers.
  - `enum-plus-legacy.min.js` (ES2015) for maximum compatibility.

  This addition is ideal for rapid prototyping and integration with legacy systems that don't support contemporary module resolution. The UMD builds are accessible in the `umd` directory of the npm package or can be directly downloaded from [Github Releases](https://github.com/shijistar/enum-plus/releases).

- The way of extending enums has been changed.

```diff
-declare global {
+declare module 'enum-plus-extend' {
   interface EnumExtension<T, K, V> {
     isWeekend(value: number): boolean;
   }
}
```

### Breaking Changes

- 💣 the following deprecated methods are removed:
  - `enums.values`
  - `enums.options`
  - `enums.menus`
  - `enums.filters`
  - `enums.valuesEnum`
- Please use the new methods `Enum.items`, `Enum.toSelect`, `Enum.toMenu`, `Enum.toFilter`, and `Enum.toValueMap` instead, which are introduced since `v2.1.0`.

### Bug Fixes

- 🐞 Fix sourcemap resolution issues in CommonJS mode

## 2.3.5

2025-7-6

### Features

- 🛠 Downgrade the requirement of TypeScript to `v3.8`

## 2.3.4

2025-7-2

### Features

- ✨ Enhance the type definitions for methods like `Enum.label`, `Enum.key`, and `Enum.raw` to ensure return types more accurately correspond to input values. When an input value can be matched within the enum, the return type will no longer include `undefined`.

## 2.3.3

2025-6-19

### Features

- 🔥 Allow naming Enum types, accept both plain text and localization keys, similar to the localization for enum members.
- 🛠 Mark Enum collection fields as `readonly`.
- 🛠 Improve the type of `Enum.label`、`Enum.key`、`Enum.raw` parameters, to accept the real value types.

## 2.3.2

2025-6-10

### Features

- ✨ Improve type IntelliSense for array initialization Enums, allowing enum items to be listed as literals. Thanks to @mudoo.

## 2.3.1

2025-6-7

### Features

- ✨ Add `IEnum` to packages exports

## 2.3.0

2025-5-23

### Features

- ✨ Export new symbols `ENUM_ITEM`，`ENUM_ITEMS` and `ENUM_COLLECTION` which are used to access some special internal properties.
- ✨ Add `[ENUM_COLLECTION]: true` to the `Enum` class, which is used to indicates that this is as an enum collection.
- ✨ Add `[ENUM_ITEM]: true` to the `EnumItem` class, which is used to indicates that this is as an enum item.
- ✨ Add `[ENUM_ITEMS]: true` to `Enum.items` array, which is used to indicates that this is as an enum items array.

### Notable Changes

- 💣 Remove `[Symbol.toStringTag]: "EnumItem"` from `EnumItem` class. The result of `Object.prototype.toString.call(enumItem)` is changed from `[object EnumItem]` back to `[object Object]`. If you are relying on this, please use `enumItem[ENUM_ITEM] === true` instead.
- 💣 Remove `[Symbol.toStringTag]: "EnumCollection"` from `Enum` class. The result of `Object.prototype.toString.call(enum)` is changed from `[object EnumCollection]` to `[object Array]`. If you are relying on this, please use `enum[ENUM_COLLECTION] === true` instead.

## 2.2.11

2025-5-15

### Features

- 🛠 Remove `"type": "commonjs"` from package.json, which may breaks webpack bundling.

## 2.2.10

2025-5-14

### Features

- ✨ Enhance the type inference of the `raw` method. When the input value matches a specific enum item, it only returns the raw object of that enum item instead of returning the raw objects of all enum items.

## 2.2.9

2025-4-20

### Features

- 🛠 Emit a warning while trying to modify an `EnumItem`

### Bug Fixes

- 🐞 the output `lib` directory structure is incorrect. This will break legacy Node.js applications using the `CommonJS` module spec, while modern Node.js applications using the `NodeNext` module spec remain unaffected. This issue was introduced in `v2.2.7`. For node.js applications, it's strongly recommended to upgrade.

## 2.2.8

2025-3-30

### Bug Fixes

- 🐞 Fix `exports` configuration for moduleResolution `ESNext`

## 2.2.7

2025-3-30

### Features

- 🛠 provide different versions of ESModule output for modern browsers and legacy browsers

## 2.2.6

2025-3-29

### Features

- 🛠 change compile transformer
- 👀 support `ES2020` and `Chrome>=80`, if you need to support legacy browsers, please use use a modern bundler like `webpack` or `vite` and use `babel` to include proper polyfills on-demand.
- 👀 for the Node.js environment, backward compatible down to ES2016.
- 🛠 generate better sourcemaps
- 🛠 package size reduces by 0.1k

## 2.2.5

2025-3-7

### Features

- 🛠 improve Enum typing, support `boolean` and `Date` as enum values

## 2.2.4

2025-2-24

### Features

- 🛠 Support global type extension for enum localization keys, providing better editor intelligence awareness

## 2.2.3

2025-2-19

### Features

- 🛠 `Enum.localize` supports delayed assignment, i.e. sets the function after the enum is created

## 2.2.2

2025-2-10

### Features

- 🛠 Change the return type of `Enum.options.getKey`
- 📖 Update docs

## 2.2.1

2025-2-10

- 📖 Update docs

## 2.2.0

2025-2-9

### Features

- 🔥 Support initializing Enum with native enums
- 🔥 Add `items` array, deprecated the _`values`_ array. Reduces package size.

## 2.1.1

2025-2-8

### Bug Fixes

- 🐞 Fix typing error in `EnumExtension` interface

## 2.1.0

2025-2-8

> **Note:** This version has a typing issue, please use `v2.1.1`

### Features

- 🔥 Add `toSelect` method, deprecated the _`options`_ method
- 🔥 Add `toMenu` method, deprecated the _`menus`_ method
- 🔥 Add `toFilter` method, deprecated the _`filters`_ method
- 🔥 Add `toValueMap` method, the _`valuesEnum`_ method
- 🔥 Support global extension, custom methods can be added to Enums

## 2.0.3

2025-2-6

### Features

- 🛠 Downgrade EcmaScript version to `ES2015`

## 2.0.2

2025-2-3

### Features

- 🔥 The `firstOption` of `options` method supports localization

## 2.0.1

2025-2-2

### Features

- 🔥 Support for enum text localization
  - the `Enum` method now accepts a `localize` option that can be used to localize the enum text
  - you can also set the `Enum.localize` static method to localize all enums in a lower priority
- 🔥 Add `menus` method

### Breaking Changes

- 💣 All parameters after the first of the `Enum` method has been changed to an `options` object

## 1.0.3

2023-11-14

- 🛠 Both the `enum.raw` or `enumItem.raw` methods return the original array item, if an enum is created from array,

## 1.0.2

2023-07-31

- 🆕 Add `rawType` accessor

## 1.0.1

2023-03-09

- 🆕 Add a new `filters` method that returns an array of enumerated items that can be passed directly to the `Column.filters` of the AntDesign Table component as a list of filtered items for the column

- ## 1.0.0

2022-10-08

- 🆕 The first release of `enum-plus` library
