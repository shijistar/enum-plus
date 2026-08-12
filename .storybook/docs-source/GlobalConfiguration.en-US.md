# Global Configuration

&nbsp;

`Enum.config` provides some global configuration options that affect the behavior and features of enums.

&nbsp;

## ⚙️ templates

`{ name?: string | Function, items?: Record<string, string | Function> }`

`Enum.config.templates` is a global configuration option that defines localization templates for the enum `name` and item fields. It applies to every enum instance, and it is the recommended unified way to set up localization (replacing the legacy `Enum.config.autoLabel`, see below).

Templates can be strings using the `{name}` and `{key}` placeholders, or functions that receive a context `{ type: 'name' | 'item', options, item? }` and return a localization key; returning `undefined` skips the template for that field.

```ts
Enum.config.templates = {
  name: 'enum.{name}.name',
  items: {
    label: 'enum.{name}.{key}.label',
    description: 'enum.{name}.{key}.description',
  },
};
```

Instance-level `templates` are merged with the global configuration field by field and take precedence over global templates with the same name.

## ⚙️ autoLabel

> 🚫 **Deprecated**: will be removed in the next major version. Use `Enum.config.templates` instead.

`Enum.config.autoLabel` is a global configuration option used to automatically generate labels for enum items. It allows you to set the `options.labelPrefix` option when defining an enum, which sets a `label` prefix for all enum items. Enum items only need to set the base value and can even omit the `label` field (when same as the `key` field). This reduces repetitive code and improves the conciseness of enum definitions.

`Enum.config.autoLabel` can be a boolean value or a function type to implement more complex logic.

- `true` - The default value, enabling the automatic label generation feature. The final value of the enum item's `label` will be automatically set to `labelPrefix` + `label`. If the `label` field is omitted, the `labelPrefix` + `key` rule will be used. Of course, if the `labelPrefix` is not set when creating the enum, this option will have no effect.
- `false` - Disables the automatic label generation feature. Enum items must explicitly provide the `label` field.
- `function` - A custom function used to customize the `label` generation rule for each enum item. This function accepts an options object parameter that contains: `item` (the enum item object) and `labelPrefix`, and returns a string as the final `label` value.

  ```js
  Enum.config.autoLabel = ({ item, labelPrefix }) => {
    return `${labelPrefix}.${item.key.lowerFirst()}`;
  };
  ```

> Note that `autoLabel` is also an option that can be set when creating an enum as `options.autoLabel`. The usage is the same as `Enum.config.autoLabel`, and it overrides the global configuration for that specific enum.

---

<!-- docs-prev-next-nav -->

| Previous                                           | Next                                             |
| -------------------------------------------------- | ------------------------------------------------ |
| [← API Reference](?path=/docs/api-reference--docs) | [User Stories →](?path=/docs/user-stories--docs) |
