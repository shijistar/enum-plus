<!-- markdownlint-disable MD009 MD024 -->

# enum-plus Changelog

## 2.2.1

2025-2-10

- 📖 update docs

## 2.2.0

2025-2-9

### Features

- 🔥 Support initializing Enum with native enums
- 🔥 Adds `items` array, deprecated the _`values`_ array. Reduces package size.

## 2.1.1

2025-2-8

### Bug Fixes

- 🐞 Fix typing error in `EnumExtension` interface

## 2.1.0

2025-2-8

> **Note:** this version has a typing issue, please use `v2.1.1`

### Features

- 🔥 Adds `toSelect` method, deprecated the _`options`_ method
- 🔥 Adds `toMenu` method, deprecated the _`menus`_ method
- 🔥 Adds `toFilter` method, deprecated the _`filters`_ method
- 🔥 Adds `toValueMap` method, the _`valuesEnum`_ method
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
  - The `Enum` method now accepts a `localize` option that can be used to localize the enum text
  - You can also set the `Enum.localize` static method to localize all enums in a lower priority
- 🔥 Add `menus` method

### Breaking Changes

- 💣 All parameters after the first of the `Enum` method has been changed to an `options` object

## 1.0.3

2023-11-14

- 🛠 If an enum is created from array, both the `enum.raw` or `enumItem.raw` methods return the original array item

## 1.0.2

2023-07-31

- 🆕 Added `rawType` accessor

## 1.0.1

2023-03-09

- 🆕 Added a new `filters` method that returns an array of enumerated items that can be passed directly to the `Column.filters` of the AntDesign Table component as a list of filtered items for the column

- ## 1.0.0

2022-10-08

- 🆕 The first release of `enum-plus` library
