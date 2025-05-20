<!-- markdownlint-disable MD009 MD024 -->

# enum-plus Changelog

## 2.2.12

2025-5-21

### Features

- ✨ Exports three new symbols `ENUM_ITEM`，`ENUM_ITEMS` and `ENUM_COLLECTION`.
- ✨ Add `[ENUM_COLLECTION] = true` to the `Enum` class, which is used to indicates that this is as an enum collection.
- ✨ Add `[ENUM_ITEM] = true` to the `EnumItem` class, which is used to indicates that this is as an enum item.
- ✨ Add `[ENUM_ITEMS] = true` to the `Enum.items`, which is used to indicates that this is as an enum items array.

### Breaking Changes

- 💣 Remove `[Symbol.toStringTag] = "EnumItem"` from `EnumItem` class. The value of `Object.prototype.toString.call(enumItem)` is changed from `[object EnumItem]` to `[object Object]`. If you are relying on this, please use `enumItem[ENUM_ITEM] === true` instead.
- 💣 Remove `[Symbol.toStringTag] = "EnumCollection"` from `Enum` class. The value of `Object.prototype.toString.call(enum)` is changed from `[object EnumCollection]` to `[object Array]`. If you are relying on this, please use `enum[ENUM_COLLECTION] === true` instead.

## 2.2.11

2025-5-15

### Features

- 🛠 Remove `"type": "commonjs"` from package.json, which may breaks webpack bundling.

## 2.2.10

2025-5-14

### Features

- ✨ Enhance the type inference of the `raw` method. When the input value matches a specific enum item, it only returns the raw object of that enum item instead of returning the raw objects of all enum items.

### Bug Fixes

- 🐞 The output `lib` directory structure is incorrect. This will break legacy Node.js applications using the `CommonJS` module spec, while modern Node.js applications using the `NodeNext` module spec remain unaffected. This issue was introduced in `v2.2.7`. For node.js applications, it's strongly recommended to upgrade.

## 2.2.9

2025-4-20

### Features

- 🛠 Emit a warning while trying to modify an `EnumItem`

### Bug Fixes

- 🐞 The output `lib` directory structure is incorrect. This will break legacy Node.js applications using the `CommonJS` module spec, while modern Node.js applications using the `NodeNext` module spec remain unaffected. This issue was introduced in `v2.2.7`. For node.js applications, it's strongly recommended to upgrade.

## 2.2.8

2025-3-30

### Bug Fixes

- 🐞 Fix `exports` configuration for moduleResolution `ESNext`

## 2.2.7

2025-3-30

### Features

- 🛠 Provide different versions of ESModule output for modern browsers and legacy browsers

## 2.2.6

2025-3-29

### Features

- 🛠 Change compile transformer
- 👀 Support `ES2020` and `Chrome>=80`, if you need to support legacy browsers, please use use a modern bundler like `webpack` or `vite` and use `babel` to include proper polyfills on-demand.
- 👀 For the Node.js environment, backward compatible down to ES2016.
- 🛠 Generate better sourcemaps
- 🛠 Package size reduces by 0.1k

## 2.2.5

2025-3-7

### Features

- 🛠 Improve Enum typing, support `boolean` and `Date` as enum values

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
