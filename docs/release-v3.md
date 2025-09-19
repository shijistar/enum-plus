# What's New in v3.0.0

## Features

- 🔥 Simplify the enum initialization that no longer requires `as const` assertion. _Thanks to @otomad_

  ```ts
  // Before
  const WeekEnum = Enum({
    Monday: { value: 1, label: 'Monday' },
    Tuesday: { value: 2, label: 'Tuesday' },
  } as const);

  // After
  const WeekEnum = Enum({
    Monday: { value: 1, label: 'Monday' },
    Tuesday: { value: 2, label: 'Tuesday' },
  });
  ```

- 🔥 Add `enum.named` to aggregate all enum items by their names, so that you can quick access an enum item by `enum.named.XXX`.

  ```diff
  - const monday = WeekEnum.items.find(item => item.value === 1);
  + const monday = WeekEnum.named.Monday;
  ```

- 🔥 Add `enum.meta` object to aggregate all custom fields defined in the enum. The keys are the field names, and values are the raw values of each field. It's a good way of accessing custom fields without iterating through the enum items.

  ```js
  const ColorEnum = Enum({
    Red: { value: 1, label: 'Red', hex: '#FF0000' },
    Green: { value: 2, label: 'Green', hex: '#00FF00' },
    Blue: { value: 3, label: 'Blue', hex: '#0000FF' },
  });
  ColorEnum.meta.hex; // ['#FF0000', '#00FF00', '#0000FF'
  ```

- 🔥 Change the behavior of `enum.values`, now it returns an array of the member raw values. Use `enum.items` for the old behavior.

  ```js
  WeekEnum.values; // [1, 2, 3, 4, 5, 6, 7]
  ```

- 🔥 Add `enum.labels` property, which returns an readonly array of the member labels.

  ```js
  WeekEnum.labels; // ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  ```

- 🔥 Add `enum.toList` method which is an alternative of `toSelect`、`toMenu`、`toFilter`. The latter methods are moved out of the core library and is available as plugins.

  ```js
  WeekEnum.toList();
  // [
  //   { value: 1, label: 'Monday' },
  //   { value: 2, label: 'Tuesday' },
  //   ...
  // ]
  WeekEnum.toList({ valueField: 'id', labelField: 'name' });
  // [
  //   { id: 1, name: 'Monday' },
  //   { id: 2, name: 'Tuesday' },
  //   ...
  // ]
  ```

- 🔥 Add `enum.toMap` as an alternative of `enum.toValueMap`.

  ```js
  WeekEnum.toMap();
  // {
  //   "1": 'Monday',
  //   "2": 'Tuesday',
  //   ...
  // }
  WeekEnum.toMap({ keySelector: 'key', valueSelector: 'value' });
  // {
  //   "Monday": 1,
  //   "Tuesday": 2,
  //   ...
  // }
  ```

- Add `Enum.isEnum` method to check if an object is an instance of `Enum`.

  ```js
  Enum.isEnum(WeekEnum); // true
  ```

- 🔥 Add `enum.findBy` method, which allows searching for enum items by built-in fields, and the custom _meta_ fields (i.e. custom fields).

  ```js
  WeekEnum.findBy('value', 1); // { key: 'Monday', value: 1, label: 'Monday' }
  WeekEnum.findBy('key', 'Monday'); // { key: 'Monday', value: 1, label: 'Monday' }
  ```

- Add type assertion for `instanceof` check of EnumCollection.

  ```ts
  const value: typeof WeekEnum.valueType | string | { value: number; name: string };
  if (value instanceof WeekEnum) {
    console.log(value); // Now the typeof value is: 0 | 1 | 2 | 3 | 4 | 5 | 6
  }
  ```

- 🔥 Add `Enum.install` method to install plugins. Check the [plugin system](#plugin-system) for details.

  ```ts
  Enum.install(plugin);
  ```

- 🔥 Release the `UMD` format module in `umd` folder.
- Support graceful downgrade for multiple TypeScript versions. For v5.0 and later, Enum initializations allows omitting the `as const` assertion. For earlier versions, will be automatically downgraded to the earlier syntax, you have to add `as const` manually.

### Internal Changes

- Remove the internal `proxy` from EnumItemClass, and use `getter` instead. This is to prevent circular-reference to support `JSON.stringify` in WeChat mini-programs.
- Reuse one copy of testing code for both `Jest` and `e2e` testing.
- Remove `private member` syntax from the codebase which cannot be fully serialized.
- The warning message for trying to modify enum items has been removed.

  In order to avoid circular references within enum items (which would affect serialization), we removed the internal `proxy` and used `getter/setter` instead. However, this brought about another problem: when printing enum items in the browser console or node.js, the `key`, `value`, and `label` cannot display their values, but show `[Getter/Setter]` instead. This somewhat affects the debugging experience.

  @yyz945947732 introduced this feature, but after the tradeoff, we have to remove this feature. I'm sorry about that.

## Plugin System

- 🔥 Introduce a new plugin system for extending features as separate npm packages. The following packages are available:
  - [@enum-plus/plugin-antd](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-antd): Ant Design oriented features, including `enum.toSelect`, `enum.toMenu`, `enum.toFilter`, and `enum.toValueMap`.
  - [@enum-plus/plugin-i18next](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-i18next): i18next localization support.
  - [@enum-plus/plugin-react](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-react): React integration, including support for `Enum.localize` to return React components, and listening for language changes to auto re-render components.
  - We are working on the following plugins:
    - [@enum-plus/plugin-vue](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-vue): Vue integration, including support for `Enum.localize` to return Vue components, and listening for language changes to auto re-render components.

> If the plugin you are searching for is not available, or you want to develop your own plugin, please refer to the [plugin development guide](./plugin-development.md). We need your help to enrich the plugin ecosystem!

## Breaking Changes

- The behavior of `enum.values` is changed. Use `enum.items` for the old behavior.
- The following symbols have been renamed to better reflect their purpose:
  - `ENUM_COLLECTION` is changed to `IS_ENUM`
  - `ENUM_ITEM` is changed to `IS_ENUM_ITEM`
  - `ENUM_ITEMS` is changed to `IS_ENUM_ITEMS`
- `enum.toSelect` is moved to plugin, please install [@enum-plus/plugin-antd](https://www.npmjs.com/package/@enum-plus/plugin-antd).
- `enum.toMenu` is moved to plugin, please install [@enum-plus/plugin-antd](https://www.npmjs.com/package/@enum-plus/plugin-antd).
- `enum.toFilter` is moved to plugin, please install [@enum-plus/plugin-antd](https://www.npmjs.com/package/@enum-plus/plugin-antd).
- `enum.toValueMap` is moved to plugin, please install [@enum-plus/plugin-antd](https://www.npmjs.com/package/@enum-plus/plugin-antd).
- Remove deprecated `enum.options`
- Remove deprecated `enum.menus`
- Remove deprecated `enum.filters`
- Remove deprecated `enum.valuesEnum`.

## Bug Fixes

- Fix the issue where sourcemap files under the `lib` directory could not be parsed.

## Github Actions

- Improve Github Actions that updates the CDN url of UMD files in README.md when releasing a new version.
- Add e2e tests to cover unit tests for browser compatibility.
  - `es` folder ( ES2020 )
  - [ ] `es-legacy` folder ( ES2015 )
  - [ ] `umd` folder ( UMD )
