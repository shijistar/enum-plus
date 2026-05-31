## Global Configuration

`Enum.config` provides some global configuration options that affect the behavior and features of enums.

### autoLabel

`Enum.config.autoLabel` is a global configuration option used to automatically generate labels for enum items. It allows you to set the `options.labelPrefix` option when defining an enum, which sets a `label` prefix for all enum items. Enum items only need to set the base value and can even omit the `label` field (when same as the `key` field). This reduces repetitive code and improves the conciseness of enum definitions.

`Enum.config.autoLabel` can be a boolean value or a function type to implement more complex logic.

- `true` - The default value, enabling the automatic label generation feature. The final value of the enum item's `label` will be automatically set to `labelPrefix` + `label`. If the `label` field is omitted, the `labelPrefix` + `key` rule will be used. Of course, if the `labelPrefix` is not set when creating the enum, this option will have no effect.
- `function` - A custom function used to customize the `label` generation rule for each enum item. This function accepts an options object parameter that contains: `item` (the enum item object) and `labelPrefix`, and returns a string as the final `label` value.

  ```js
  Enum.config.autoLabel = ({ item, labelPrefix }) => {
    return `${labelPrefix}.${item.key.lowerFirst()}`;
  };
  ```

- `false` - Disables the automatic label generation feature. Enum items must explicitly provide the `label` field.

> Note that `autoLabel` is also an option that can be set when creating an enum as `options.autoLabel`. The usage is the same as `Enum.config.autoLabel`, and it overrides the global configuration for that specific enum.
