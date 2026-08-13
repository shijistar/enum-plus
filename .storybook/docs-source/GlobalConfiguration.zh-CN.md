# 全局配置

`Enum.config` 提供了一些全局配置参数，用来影响枚举的行为和特性。

&nbsp;

## ⚙️ templates

`{ name?: string | Function, items?: Record<string, string | Function> }`

`Enum.config.templates` 是一个全局配置选项，用于为枚举的 `name` 和枚举项字段定义本地化模板。它对每个枚举实例生效，是推荐的统一本地化配置方式（取代下方已废弃的 `Enum.config.autoLabel`）。

模板可以是字符串，使用 `{name}`、`{key}`、`{value}` 和 `{raw}` 占位符；也可以是函数，接收上下文 `{ type: 'name' | 'item', options, item?, metaField? }` 并返回本地化 key。

可用占位符如下：

- `{name}` — 枚举名称（来自 `options.name`）。
- `{key}` — 枚举项的 key。
- `{value}` — 枚举项的值。
- `{raw}` — 被模板化的元数据字段的原始值（仅在 `items` 模板中有意义）。

模板结果优先于原始声明的字符串，但不优先于函数：`name` 模板会覆盖 `options.name`，`items` 模板会覆盖枚举项元数据字段的原始值。原始声明的函数会直接返回最终的本地化结果，优先级最高，不会被模板覆盖。优先级顺序为：原始函数 > 实例模板 > 全局模板 > 原始字符串。如需引用原始值，请显式使用 `{name}` 和 `{raw}` 占位符。

```ts
Enum.config.templates = {
  name: 'enum.{name}.name',
  items: {
    label: 'enum.{name}.{key}.label',
    description: 'enum.{name}.{key}.description',
  },
};
```

实例级 `templates` 与全局配置按字段逐项合并，且实例配置优先级更高，覆盖同名字段的全局模板。

## ⚙️ autoLabel

> 🚫 **已废弃（Deprecated）**：将在下一大版本中移除。请改用 `Enum.config.templates`。

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

---

<!-- docs-prev-next-nav -->

| 上一篇                                                             | 下一篇                                                            |
| ------------------------------------------------------------------ | ----------------------------------------------------------------- |
| [← API 文档](?path=/docs/api-reference--docs&globals=locale:zh-CN) | [典型用法 →](?path=/docs/user-stories--docs&globals=locale:zh-CN) |
