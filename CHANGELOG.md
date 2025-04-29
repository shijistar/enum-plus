<!-- markdownlint-disable MD009 MD024 -->

# enum-plus Changelog

## 2.3.0

2025-4-24

### Features

- 🔥 add `Enum.install` method which introduces a new plugin system. The plugin system allows you to add new methods or properties to all enums. While similar to `Enum.extends`, the plugin system enables features to be packaged as `shareable` plugins, making it more flexible and widely applicable.
- 🔥 introduce an official plugin `enum-plus-plugin` that provides a collection of highly shareable plugins.
  - These plugins are designed to work in all scenarios and environments (including browser and Node.js), without introducing dependencies on third-party frameworks, component libraries, or platforms.
  - If you have a good idea that might be specific to a certain framework or platform rather than universally applicable, we recommend creating a new plugin project (e.g., `enum-plus-plugin-xxx`). We are happy to see that, and hope that you submit a PR to `enum-plus-plugin` to link your project back.
- ✨ Includes the `UMD` module format in this release, which allows you to use `enum-plus` in a browser environment without the need for a module bundler. This is particularly useful for quick prototyping or when working with legacy codebases that do not support modern module systems. You can find them in the `umd` directory of the package. They can also be downloaded in [github release](https://github.com/shijistar/enum-plus/releases) assets.

### Breaking Changes

- 💣 the following deprecated methods are removed:
  - `enums.values`
  - `enums.options`
  - `enums.menus`
  - `enums.filters`
  - `enums.valuesEnum`
- Please use the new methods `Enum.items`, `Enum.toSelect`, `Enum.toMenu`, `Enum.toFilter`, and `Enum.toValueMap` instead, which are introduced since `v2.1.0`.

## 2.2.9

2025-4-20

### Features

- 🛠 emit a warning while trying to modify an `EnumItem`

### Bug Fixes

- 🐞 the output `lib` directory structure is incorrect. This will break legacy Node.js applications using the `CommonJS` module spec, while modern Node.js applications using the `NodeNext` module spec remain unaffected. This issue was introduced in `v2.2.7`. For node.js applications, it's strongly recommended to upgrade.

## 2.2.8

2025-3-30

### Bug Fixes

- 🐞 fix `exports` configuration for moduleResolution `ESNext`

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

- 🛠 supports global type extension for enum localization keys, providing better editor intelligence awareness

## 2.2.3

2025-2-19

### Features

- 🛠 `Enum.localize` supports delayed assignment, i.e. sets the function after the enum is created

## 2.2.2

2025-2-10

### Features

- 🛠 change the return type of `Enum.options.getKey`
- 📖 update docs

## 2.2.1

2025-2-10

- 📖 update docs

## 2.2.0

2025-2-9

### Features

- 🔥 support initializing Enum with native enums
- 🔥 adds `items` array, deprecated the _`values`_ array. Reduces package size.

## 2.1.1

2025-2-8

### Bug Fixes

- 🐞 fix typing error in `EnumExtension` interface

## 2.1.0

2025-2-8

> **Note:** this version has a typing issue, please use `v2.1.1`

### Features

- 🔥 add `toSelect` method, deprecated the _`options`_ method
- 🔥 add `toMenu` method, deprecated the _`menus`_ method
- 🔥 add `toFilter` method, deprecated the _`filters`_ method
- 🔥 add `toValueMap` method, the _`valuesEnum`_ method
- 🔥 support global extension, custom methods can be added to Enums

## 2.0.3

2025-2-6

### Features

- 🛠 downgrade EcmaScript version to `ES2015`

## 2.0.2

2025-2-3

### Features

- 🔥 the `firstOption` of `options` method supports localization

## 2.0.1

2025-2-2

### Features

- 🔥 support for enum text localization
  - the `Enum` method now accepts a `localize` option that can be used to localize the enum text
  - you can also set the `Enum.localize` static method to localize all enums in a lower priority
- 🔥 add `menus` method

### Breaking Changes

- 💣 all parameters after the first of the `Enum` method has been changed to an `options` object

## 1.0.3

2023-11-14

- 🛠 if an enum is created from array, both the `enum.raw` or `enumItem.raw` methods return the original array item

## 1.0.2

2023-07-31

- 🆕 added `rawType` accessor

## 1.0.1

2023-03-09

- 🆕 added a new `filters` method that returns an array of enumerated items that can be passed directly to the `Column.filters` of the AntDesign Table component as a list of filtered items for the column

- ## 1.0.0

2022-10-08

- 🆕 the first release of `enum-plus` library
