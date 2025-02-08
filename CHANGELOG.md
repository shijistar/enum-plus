<!-- markdownlint-disable MD009 MD024 -->

# enum-plus Changelog

## 2.1.1

2025-2-8

### Bug Fixes

- 🐞 Fix typing error in `EnumExtension` interface

## 2.1.0

2025-2-8

### Features

- 🔥 Adds `toSelect` method, deprecated ~~`options`~~ method
- 🔥 Adds `toMenu` method, deprecated ~~`menus`~~ method
- 🔥 Adds `toFilter` method, deprecated ~~`filters`~~ method
- 🔥 Adds `toValueMap` method, ~~`valuesEnum`~~ method
- 🔥 Support global extending, you can add custom methods to Enums

> **Note:** this version has typing problem, please use `v2.1.1`

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
