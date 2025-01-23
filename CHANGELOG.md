<!-- markdownlint-disable MD009 -->

# enum-plus Changelog

## 2.0.0

2025-1-23

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
