# enum-plus v3.0 - A Major Update

## Features

- [x] Remove deprecated `enum.options`
- [x] Remove deprecated `enum.menus`
- [x] Remove deprecated `enum.filters`
- [x] Remove deprecated `enum.valuesEnum`
- [ ] Change the behavior of `enum.values`, now it returns an array of the member raw values. Use `enum.items` for the old behavior.
- [ ] Add `enum.labels` property, which returns an readonly array of the member labels.
- [ ] Add `enum.find` method, which allows searching for enum items by specific field, including _meta_ fields (i.e. custom fields).
- [ ] Add `enum.meta` object to aggregate all custom fields defined in the enum. The keys are the field names, and values are the raw values of each field. It's a good way of accessing custom fields without iterating through the enum items.
- [x] Add `enum.toList`, method which is an alternative of `toSelect`、`toMenu`、`toFilter`. The latter methods are moving out of the core library and will be available as plugins.
- [ ] Add `enum.toMap` as an alternative of `enum.toValueMap`.
- [x] Simplify the enum initialization that no longer requires `as const` assertion. _by @otomad_
- [x] Release the `UMD` module format of `enum-plus` in `umd` folder.
- [x] Improve Github Actions that updates the CDN url of UMD files in README.md when releasing a new version.
- [x] Add e2e tests to cover unit tests for browser compatibility.

  - [x] `es` folder ( ES2020 )
  - [ ] `es-legacy` folder ( ES2015 )
  - [ ] `umd` folder ( UMD )

- [x] Reuse one suite of testing code for both `Jest` and `e2e` testing.
- [x] Remove `private member` syntax from the codebase.

- [x] Introduce a new plugin system for extending features and ship them as separate npm packages.
- [x] Add `Enum.install` which is used to install plugins.
- [ ] Implement `enum-plus-plugin-antd` project and move Ant Design oriented code into the plugin, including `enum.toSelect`, `enum.toMenu`, `enum.toFilter`, and `enum.toValueMap`. Set the default value of `valueField` to `value` and `labelField` to `label` in the plugin.

## Breaking Changes

- `enum.options` method is removed, use `enum.toSelect` instead.
- `enum.menus` method is removed, use `enum.toMenu` instead.
- `enum.filters` method is removed, use `enum.toFilter` instead.
- `enum.valuesEnum` method is removed, use `enum.toValueMap` instead.
- The behavior of `enum.values` is changed. Use `enum.items` for the old behavior.
<!-- - The required version of TypeScript has been downgraded to `3.8`. -->

## Bug Fixes

- Fix the issue where sourcemap files under the `lib` directory could not be parsed.
