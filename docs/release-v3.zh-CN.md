# v3.0.0 发行公告

## 新功能

- 🔥 简化枚举初始化，不再需要 `as const` 断言。_感谢 @otomad_

  ```ts
  // 之前
  const WeekEnum = Enum({
    Monday: { value: 1, label: '星期一' },
    Tuesday: { value: 2, label: '星期二' },
  } as const);

  // 现在
  const WeekEnum = Enum({
    Monday: { value: 1, label: '星期一' },
    Tuesday: { value: 2, label: '星期二' },
  });
  ```

- 🔥 新增 `enum.named` 属性，聚合所有枚举项，方便通过 `enum.named.XXX` 快速访问某个枚举项。

  ```js
  // 以前
  const monday = WeekEnum.items.find((item) => item.value === 1);
  // 现在
  const monday = WeekEnum.named.Monday;
  ```

- 🔥 新增 `enum.meta` 对象，聚合枚举中定义的所有自定义字段，键为字段名，值为各字段的原始值。这样可以在不遍历枚举项的情况下访问自定义字段。

  ```js
  const ColorEnum = Enum({
    Red: { value: 1, label: 'Red', hex: '#FF0000' },
    Green: { value: 2, label: 'Green', hex: '#00FF00' },
    Blue: { value: 3, label: 'Blue', hex: '#0000FF' },
  });
  ColorEnum.meta.hex; // ['#FF0000', '#00FF00', '#0000FF']
  ```

- 🔥 修改 `enum.values` 的行为，现在它返回成员原始值的数组。请使用 `enum.items` 获取旧行为。

  ```js
  WeekEnum.values; // [1, 2, 3, 4, 5, 6, 7]
  ```

- 🔥 新增 `enum.labels` 属性，返回成员标签的只读数组。

```js
WeekEnum.labels; // ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期天']
```

- 🔥 新增 `enum.toList` 方法，作为 `toSelect`、`toMenu`、`toFilter` 的替代品。后者已经被移出核心库，作为插件提供。

  ```js
  WeekEnum.toList();
  // [
  //   { value: 1, label: '星期一' },
  //   { value: 2, label: '星期二' },
  //   ...
  // ]
  WeekEnum.toList({ valueField: 'id', labelField: 'name' });
  // [
  //   { id: 1, name: '星期一' },
  //   { id: 2, name: '星期二' },
  //   ...
  // ]
  ```

- 🔥 新增 `enum.toMap` 方法，作为 `enum.toValueMap` 的替代品。

  ```js
  WeekEnum.toMap();
  // {
  //   "1": '星期一',
  //   "2": '星期二',
  //   ...
  // }
  WeekEnum.toMap({ keySelector: 'key', valueSelector: 'value' });
  // {
  //   "Monday": 1,
  //   "Tuesday": 2,
  //   ...
  // }
  ```

- 新增 `Enum.isEnum` 方法，用于检查一个对象是否是 `Enum` 的实例。

  ```js
  Enum.isEnum(WeekEnum); // true
  ```

- 🔥 新增 `enum.findBy` 方法，允许通过内置字段和自定义 _meta_ 字段（即自定义字段）搜索枚举项。

  ```js
  WeekEnum.findBy('value', 1); // { key: 'Monday', value: 1, label: '星期一' }
  WeekEnum.findBy('key', 'Monday'); // { key: 'Monday', value: 1, label: '星期一' }
  ```

- 为 `EnumCollection` 的 `instanceof` 检查添加类型断言。

  ```ts
  const value: typeof WeekEnum.valueType | string | { value: number; name: string };
  if (value instanceof WeekEnum) {
    console.log(value); // 现在 value 的类型是: 0 | 1 | 2 | 3 | 4 | 5 | 6
  }
  ```

- 🔥 新增 `Enum.install` 方法，用于安装插件。有关详细信息，请查看 [插件系统](#插件系统)。

  ```ts
  Enum.install(plugin);
  ```

- 🔥 `Enum.extends` 方法对应的类型定义方式发生了变化，详情请参考 [迁移指南](./migration-guide-v2-to-v3.zh-CN.md#-扩展-enum-类型的方式已更改)

- 🔥 在 `umd` 文件夹中发布 `UMD` 格式的模块。
- 支持多个 TypeScript 版本的平滑降级。对于 v5.0 及更高版本，允许在 Enum 初始化时省略 `as const` 断言。对于较早版本，将自动降级为较早的语法，需要手动添加 `as const` 断言。

### 内部变更

- 移除 `EnumItemClass` 内部的 `proxy`，改用 `getter`。这是为了防止循环引用，以支持在微信小程序中使用 `JSON.stringify`。
- 为 `Jest` 和 `e2e` 测试重用一份测试代码。
- 从代码库中移除 `private member` 语法，因为它无法被完全序列化。
- 枚举项被修改的警告信息已被移除。

  为了避免枚举项内的循环引用（这会影响序列化），我们移除了内部的 `proxy`，改用 `getter/setter`。然而，这带来了另一个问题：在浏览器控制台或 node.js 中打印枚举项时，`key`、`value` 和 `label` 无法显示它们的值，而是显示为 `[Getter/Setter]`。这在某种程度上影响了调试体验。

  @yyz945947732 最早引入了这个功能，但经过权衡，我们不得不移除掉这个特性。对此我感到抱歉。

## 插件系统

- 🔥 引入新的插件系统，以独立的 npm 包形式扩展功能。以下是可用的包：
  - [@enum-plus/plugin-antd](https://github.com/shijistar/enum-plus/tree/main/packages/plugin-antd): Ant Design 相关功能，包括 `enum.toSelect`、`enum.toMenu`、`enum.toFilter` 和 `enum.toValueMap`。通过这些方法，可以直接将枚举绑定到对应的 Ant Design 组件上，极大地简化了代码。
  - [@enum-plus/plugin-i18next](https://github.com/shijistar/enum-plus/tree/main/packages/plugin-i18next): i18next 本地化支持。
  - [@enum-plus/plugin-react](https://github.com/shijistar/enum-plus/tree/main/packages/plugin-react): React 集成，包括支持 `Enum.localize` 返回 React 组件，以及监听语言变化以自动重新渲染组件。
  - 我们正在开发以下插件：
    - [@enum-plus/plugin-vue](https://github.com/shijistar/enum-plus/tree/main/packages/plugin-vue): Vue 集成，包括支持 `Enum.localize` 返回 Vue 组件，以及监听语言变化以自动重新渲染组件。
    - [@enum-plus/plugin-angular](https://github.com/shijistar/enum-plus/tree/main/packages/plugin-angular): Angular 集成，包括支持 `Enum.localize` 返回 Angular 组件，以及监听语言变化以自动重新渲染组件。_我们需要您的帮助来开发这个插件！_

> 如果您搜索的插件不可用，或者您想开发自己的插件，请参阅 [插件开发指南](./plugin-development.zh-CN.md)。 我们真诚地需要您的帮助，来丰富插件生态系统！

## 破坏性变更

- 修改 `enum.values` 的行为，现在它返回成员原始值的数组。请使用 `enum.items` 获取旧行为。
- 以下符号已被重命名，以更好地反映其用途：
  - `ENUM_COLLECTION` 变更为 `IS_ENUM`
  - `ENUM_ITEM` 变更为 `IS_ENUM_ITEM`
  - `ENUM_ITEMS` 变更为 `IS_ENUM_ITEMS`
- `enum.toSelect` 被迁移到插件库，请安装 [@enum-plus/plugin-antd](https://www.npmjs.com/package/@enum-plus/plugin-antd)。
- `enum.toMenu` 被迁移到插件库，请安装 [@enum-plus/plugin-antd](https://www.npmjs.com/package/@enum-plus/plugin-antd)。
- `enum.toFilter` 被迁移到插件库，请安装 [@enum-plus/plugin-antd](https://www.npmjs.com/package/@enum-plus/plugin-antd)。
- `enum.toValueMap` 被迁移到插件库，请安装 [@enum-plus/plugin-antd](https://www.npmjs.com/package/@enum-plus/plugin-antd)。
- 移除已弃用的 `enum.options`
- 移除已弃用的 `enum.menus`
- 移除已弃用的 `enum.filters`
- 移除已弃用的 `enum.valuesEnum`

## Bug 修复

- 修复 `lib` 目录下的 sourcemap 文件无法被解析的问题。

## Github Actions

- 改进 Github Actions，在发布新版本时更新 README.md 中 UMD 文件的 CDN URL。
- 添加 e2e 测试以覆盖浏览器兼容性的单元测试。
  - `es` 文件夹（ES2020）
  - [ ] `es-legacy` 文件夹（ES2015）
  - [ ] `umd` 文件夹（UMD）
