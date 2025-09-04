# enum-plus v3.0 - A Major Update

### ■■■■■■■■■■■■■■■■■■■□ (95%)

## Features

### Codebase

- [x] Remove deprecated `enum.options`
- [x] Remove deprecated `enum.menus`
- [x] Remove deprecated `enum.filters`
- [x] Remove deprecated `enum.valuesEnum`
- [x] The following symbols have been renamed to better reflect their purpose:
  - `ENUM_COLLECTION` is now `IS_ENUM`
  - `ENUM_ITEM` is now `IS_ENUM_ITEM`
  - `ENUM_ITEMS` is now `IS_ENUM_ITEMS`
- [x] 🔥 Add `enum.named` to aggregate all enum items by their names, so that you can quick access an enum item by `enum.named.XXX`.
- [x] 🔥 Add `enum.meta` object to aggregate all custom fields defined in the enum. The keys are the field names, and values are the raw values of each field. It's a good way of accessing custom fields without iterating through the enum items.
- [x] 🔥 Change the behavior of `enum.values`, now it returns an array of the member raw values. Use `enum.items` for the old behavior.
- [x] 🔥 Add `enum.labels` property, which returns an readonly array of the member labels.
- [x] 🔥 Add `enum.toList`, method which is an alternative of `toSelect`、`toMenu`、`toFilter`. The latter methods are moving out of the core library and will be available as plugins.
- [ ] 🔥 Add `enum.toMap` as an alternative of `enum.toValueMap`.
- [x] Add `Enum.isEnum` method to check if an object is an instance of `Enum`.
- [x] 🔥 Add `enum.findBy` method, which allows searching for enum items by built-in fields, and the custom _meta_ fields (i.e. custom fields).
- [x] Add type assertion for `instanceof` check of EnumCollection.
- [x] 🔥 Simplify the enum initialization that no longer requires `as const` assertion. _by @otomad_
- [x] 🔥 Release the `UMD` module format of `enum-plus` in `umd` folder.
- [x] Reuse one copy of testing code for both `Jest` and `e2e` testing.
- [x] Remove `private member` syntax from the codebase.
- [x] Support graceful downgrade for multiple TypeScript versions. For v5.0 and later, Enum initializations allows omitting the as const assertion. For earlier versions, will be automatically downgraded to the earlier syntax, just manually adding as const as needed.
- [x] Remove the internal `proxy` from `EnumItemClass`, and use `getter` instead. This is to prevent circular-reference to support `JSON.stringify` in WeChat mini-programs.

### Plugin System

- [x] 🔥 Introduce a new plugin system for extending features and ship them as separate npm packages.
- [x] Add `Enum.install` which is used to install plugins.
- [ ] 🔥 Implement `enum-plus-plugin-antd` project and move Ant Design oriented code into the plugin, including `enum.toSelect`, `enum.toMenu`, `enum.toFilter`, and `enum.toValueMap`. Set the default value of `valueField` to `value` and `labelField` to `label` in the plugin.

### Github Actions

- [x] Improve Github Actions that updates the CDN url of UMD files in README.md when releasing a new version.
- [x] Add e2e tests to cover unit tests for browser compatibility.

  - [x] `es` folder ( ES2020 )
  - [ ] `es-legacy` folder ( ES2015 )
  - [ ] `umd` folder ( UMD )

## Breaking Changes

- `enum.options` method is removed, use `enum.toSelect` instead.
- `enum.menus` method is removed, use `enum.toMenu` instead.
- `enum.filters` method is removed, use `enum.toFilter` instead.
- `enum.valuesEnum` method is removed, use `enum.toValueMap` instead.
- The behavior of `enum.values` is changed. Use `enum.items` for the old behavior.

## Misc

- The warning message for trying to modify enum items has been removed. First, in order to avoid circular references within enum items (which would affect serialization), we removed the internal `proxy` and used `getter/setter` instead. However, this brought about another problem: when printing enum items in the browser console or node.js, the `key`, `value`, and `label` cannot display their values, but show `[Getter/Setter]` instead. This somewhat affects the debugging experience. Sorry @yyz945947732, you introduced this feature, which is very good, but after weighing the pros and cons, we still had to remove this feature.

## Bug Fixes

- Fix the issue where sourcemap files under the `lib` directory could not be parsed.
