# 全局配置

&nbsp;

`Enum.config` 提供了一些全局配置参数，用来影响枚举的行为和特性。

&nbsp;

## 🅿️ Ⓜ️ autoLabel

`Enum.config.autoLabel` 是一个全局配置选项，用于自动生成枚举项的标签。它允许在定义枚举时，设置 `options.labelPrefix` 选项，为所有枚举项设置一个 `label` 前缀，枚举项只需要设置基础值即可，甚至可以省略 `label` 字段（与 `key` 字段相同）。这样可以减少重复代码，提高枚举定义的简洁性。

`Enum.config.autoLabel` 的值可以是一个布尔值，也可以使用 `function` 类型的函数以实现更复杂的逻辑。

- `true` - 默认值，启用自动标签生成功能。枚举项的 `label` 最终值将自动设置为 `labelPrefix`+`label`，如果省略了 `label` 字段，则使用 `labelPrefix`+`key` 规则。当然，如果创建枚举时没有设置 `labelPrefix`，则此选项将没有任何效果。
- `false` - 禁用自动标签生成功能，枚举项必须显式提供 `label` 字段。
- `function` - 一个自定义函数，用于自定义每个枚举项 `label` 生成规则。该函数接受一个选项对象参数，其中包含：`item`（枚举项对象）和 `labelPrefix`，并返回一个字符串作为最终的 `label` 值。

  ```js
  Enum.config.autoLabel = ({ item, labelPrefix }) => {
    return `${labelPrefix}.${item.key.lowerFirst()}`;
  };
  ```

> 请注意，在创建枚举时也可以通过 `options.autoLabel` 参数覆盖全局配置，其用法与 `Enum.config.autoLabel` 相同。
