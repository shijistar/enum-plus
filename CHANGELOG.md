<!-- markdownlint-disable MD009 MD024 -->

# enum-plus Changelog

## 3.2.0

2026-6-21

### Features

- ✨ Add `item` method to quickly access enum items by key or value.
- ✨ Add `autoLocalizeMeta` option to automatically localize meta fields, just like `label`.

## 3.1.8

2026-1-28

### Features

- ✨ Enhance `EnumLocaleExtends` type definition to support global extension of `EnumItemLabel`.

## 3.1.7

2026-1-26

### Features

- ✨ Update `has` method type signature for better type inference.

## 3.1.6

2025-11-26

### Features

- ✨ Expand the AnyEnum type to be compatible with all enumeration types.

## 3.1.5

2025-11-20

### Features

- ✨ Enhance enum creation to support `function` labels and enum name.

### Bug Fixes

- 🐞 Fix the issue where `enum.meta` is always empty in `meta-only` mode.

## 3.1.4

2025-11-19

### Features

- ✨ Add `AnyEnum` type as a generic enum type that can be used to represent any enum collection.
- 🛠 Improve the type of `enum.meta`.

## 3.1.3

2025-11-17

### Features

- ✨ Enhance `Enum.extends` method to support getter and setter properties in the extension object.

## 3.1.2

2025-11-7

### Features

- 🛠 Export the `./extension` subpath in package.json to fix the `Cannot find module 'enum-plus/extension'"` error.
- 🛠 Exclude `label` field from the type of `autoLabel` option.

## 3.1.1

2025-10-22

### Features

- ✨ Introduce `meta-only` mode in `Enum` creation, allowing the creation of Enums without `value` and `label` fields. This is useful for scenarios where only metadata is needed for enum items.
- ✨ Implementation `instanceof` operator of `Enum` method, and add type guard to provide type narrowing functionality. This allows you to use `instanceof` to check if an object is an enum object created by `Enum`.
- ✨ Add type guard to `Enum.has` method.
- 🛠️ Allow the type extending for `Enum.name`, just like enum labels.
- 📝 Add documentation for TypeScript 5.0 upgrade instructions

## 3.1.0

2025-10-21

### Features

- ✨ Introduce `Enum.config` to manage global configuration for all Enums.
  - `Enum.config.autoLabel` to enable/disable automatic label generation for enum items by specifying the label prefix.
- ✨ Add `options.labelPrefix` to specify the label prefix for enum items during Enum creation.
- ✨ Add `options.autoLabel` to enable/disable automatic label generation on Enum creation. It overrides the global configuration.
- ✨ Allow extending `EnumItemLabel` type to support IntelliSense.

## 3.0.1

2025-10-6

### Features

- 🛠 Improve type guard feature of `Enum.isEnum` method.
- 📝 Add the badge of DeepWiki in README.

## 3.0.0

2025-10-5

> 🎉 **v3.0 is Arrived!**
>
> This is a milestone release that brings many exciting features and improvements. Enjoy the new version!
>
> Please refer to the [Release Notes](./docs/release-v3.md) and [Migration Guide](./docs/migration-guide-v2-to-v3.md) for details.

### Features

- ✨ Introduce the new [Plugin System](./README.md#plugin-system). Many fantastic features can be shared as plugins, and you can enhance Enum by installing them.
- 💄 Simplified enum initialization. No `as const` assertion is required on TypeScript ≥ 5.0. _Thanks to @otomad_.
- ✨ New `enum.named` for quick access EnumItem by `key`.
- ✨ New `enum.meta` to aggregate custom metadata fields across items.
- ✨ New `enum.labels` returning a readonly array of labels.
- ✨ New `enum.toList` to transform enum items to a list of `{ value, label }` objects. Supports remapping the field names via options.
- ✨ New `enum.toMap` to transform enum items to a mapping object. Supports remapping the field names via options.
- ✨ New `Enum.isEnum` for type guarding.
- ✨ New `enum.findBy` to locate an item by built-in or metadata fields.
- ✨ New `Enum.install` to install plugins.
- 🛠️ Typing: `instanceof` narrowing for EnumCollection; updated `Enum.extend` typing; graceful downgrade across TS versions.
- ✨ Ship UMD module format under `umd` folder for direct browser usage.

### Notable Changes

- The typing declaration of extending Enums has [changed](./docs/migration-guide-v2-to-v3.md#-the-typing-declaration-of-extending-enums-has-changed)
- Recommended to upgrade TypeScript to 5.0

### Breaking Changes

- The following deprecated methods are removed:
  - `enums.values`
  - `enums.options`
  - `enums.menus`
  - `enums.filters`
  - `enums.valuesEnum`
- The following methods are removed from the core library and moved to the [@enum-plus/plugin-antd](https://www.npmjs.com/package/@enum-plus/plugin-antd) plugin. Please install the plugin to use them.
  - `enums.toSelect`
  - `enums.toMenu`
  - `enums.toFilter`
  - `enums.toValueMap`
- The following symbols are renamed:
  - `ENUM_COLLECTION` symbol is renamed to `IS_ENUM`.
  - `ENUM_ITEM` symbol is renamed to `IS_ENUM_ITEM`.
  - `ENUM_ITEMS` symbol is renamed to `IS_ENUM_ITEMS`.
  - `EnumValuesArray` interface is renamed to `EnumItemsArray`, and the `...rest` parameter is removed.
  - `IEnumValues` interface is renamed to `IEnumItems`.

### Bug Fixes

- 🐞 Fix sourcemap resolution issues in `CommonJS` mode

## 2.4.3

2025-9-4

### Security

- 🔒 Bump `sha.js` from `2.4.11` to `2.4.12` to address security vulnerabilities.

## 2.4.2

2025-7-8

### Bug Fixes

- 🐞 Fix the issue where `lib/extension.d.ts` was missing, which caused all enum types to default to `any`.

## 2.4.1

> ⚠️ This version is deprecated. Please use `v2.4.2` instead.

2025-7-7

### Bug Fixes

- 🐞 Fix `lib/extension.d.ts` missing issue, but failed. Please use `v2.4.2` instead.

## 2.4.0

> ⚠️ This version has a critical issue, please use `v2.4.2` instead.

2025-7-6

### Features

- 🛠 Support `Node.js ESM`
- 🛠 Remove file circular dependencies

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
