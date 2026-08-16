# Best Practices

&nbsp;

When using `enum-plus`, following these best practices can help ensure consistency, maintainability, and clarity in your codebase:

1. **Enum Type Naming:** Use `PascalCase` and end with `Enum` (e.g., _WeekEnum_, _ColorEnum_).
2. **Enum Item Naming:** Use `PascalCase` (e.g., _Sunday_, _Red_). This naming approach highlights the static and immutable nature of enumeration members. Moreover, in the IDE's intelligent prompting, they will be displayed at the top instead of being mixed with other method names, making it more convenient for viewing and selection.
3. **Semantic Clarity:** Ensure enum and item names have clear semantics. Good semantic naming serves as self-documentation, making code intent explicit and reducing cognitive overhead.
4. **Single Responsibility Principle:** Each enum type should represent a single, cohesive set of related constants. Avoid overlapping responsibilities between different enum types.
5. **Provide JSDoc Comments:** Provide JSDoc comments for each enum item and the enum type itself, explaining their purpose and usage. Comprehensive documentation enables IDE hover tooltips and improves code readability and maintainability.
6. **Internationalization Architecture:** Plan for internationalization from the outset by leveraging the library's [localization](?path=/docs/localization--docs#localization) features. A well-designed internationalization architecture minimizes future refactoring and facilitates global scalability.

Here is an example that combines the above best practices to define an enum:

```js
const WeekEnum = Enum(
  {
    Sunday: { value: 0, label: 'enums.Week.Sunday' },
    Monday: { value: 1, label: 'enums.Week.Monday' },
    Tuesday: { value: 2, label: 'enums.Week.Tuesday' },
    Wednesday: { value: 3, label: 'enums.Week.Wednesday' },
    Thursday: { value: 4, label: 'enums.Week.Thursday' },
    Friday: { value: 5, label: 'enums.Week.Friday' },
    Saturday: { value: 6, label: 'enums.Week.Saturday' },
  },
  { name: 'enums.Week.name' },
);
```

## Minimal Configuration

By leveraging [global configuration templates](?path=/docs/global-configuration--docs#-templates), you can set up internationalization templates for enums globally, which can further simplify enum definitions.

- _Global configuration_

```js
Enum.config.templates = {
  name: 'enums.{name}',
  items: {
    label: 'enums.{name}.{key}',
  },
};
```

- _Minimal enum definition_

```js
const WeekEnum = Enum(
  { Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6 },
  { name: 'Week' },
);
```

---

<!-- docs-prev-next-nav -->

| Previous                                         | Next                                               |
| ------------------------------------------------ | -------------------------------------------------- |
| [← User Stories](?path=/docs/user-stories--docs) | [Plugin System →](?path=/docs/plugin-system--docs) |
