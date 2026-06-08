# Enum Initialization

&nbsp;

This section shows the various ways to initialize enums using the `Enum` function. Understanding these different initialization formats allows you to choose the most convenient approach for your specific use case.

## 1. Key-Value Format

The simplest format is a direct mapping of keys to values. This is similar to the native enum format.

```js
import { Enum } from 'enum-plus';

// With number values
const WeekEnum = Enum({
  Sunday: 0,
  Monday: 1,
});

WeekEnum.Monday; // 1

// With string values
const WeekEnum2 = Enum({
  Sunday: 'Sun',
  Monday: 'Mon',
});

WeekEnum2.Monday; // 'Mon'
```

> If your project uses TypeScript and the version is below 5.0, it is recommended to add the `as const` type assertion to the parameter of the `Enum` method. In this way, the enum values will remain their original literal values instead of being converted to `number` or `string`. For more details, please refer to [here](?path=/docs/faq--docs#do-i-have-to-upgrade-typescript-to-version-50).

## 2. Standard Format (Recommended)

The standard format includes both a `value` and a `label` for each enum item. This is the most commonly used format and is recommended for most cases. This format allows you to specify a display name for each enum item, which can be used in UI components. Please refer to the [Localization](?path=/docs/localization--docs#localization) section for internationalization support.

```js
import { Enum } from 'enum-plus';

const WeekEnum = Enum({
  Sunday: { value: 0, label: 'I love Sunday' },
  Monday: { value: 1, label: 'I hate Monday' },
});

WeekEnum.Sunday; // 0
WeekEnum.items[0].key; // 'Sunday'
WeekEnum.items[0].label; // I love Sunday
```

> Want to enable code completion when entering `label`? Please refer to the [Enable Code Intelligence for Enum Item Labels](?path=/docs/user-stories--docs#-enable-code-intelligence-for-enum-item-labels) section for more details.
>
> Want to customize the logic of the `label` field? You can pass in a function. Please refer to the [Custom Label Logic](?path=/docs/localization--docs#custom-label-logic) section for more details.

## 3. Label-Only Format

Create an enumeration that only provides the `key` and `label` fields. If the `value` field is omitted, it defaults to the same value as the `key` field.

```js
import { Enum } from 'enum-plus';

const WeekEnum = Enum({
  Sunday: { label: 'I love Sunday' },
  Monday: { label: 'I hate Monday' },
});

WeekEnum.Sunday; // 'Sunday'
WeekEnum.items[0].key; // 'Sunday'
WeekEnum.items[0].label; // I love Sunday
```

## 4. Array Format

The array format is useful when you need to create enums with dynamic data, for example the data from an API.

You can also use dynamic field mapping rules to adapt to various different data structures. Please refer to the [Custom Field Mapping](?path=/docs/user-stories--docs#-custom-field-mapping-in-array-format-initialization) section for more details.

```js
import { Enum } from 'enum-plus';

const pets = [
  { value: 1, key: 'Dog', label: 'Dog' },
  { value: 2, key: 'Cat', label: 'Cat' },
  { value: 3, key: 'Rabbit', label: 'Rabbit' },
];
const PetEnum = Enum(pets);

PetEnum.Dog; // 1
PetEnum.label(1); // Dog
```

## 5. Native Enum Format

Create from native enums. It benefits from the native enum's `auto-incrementing` behavior.

```ts
import { Enum } from 'enum-plus';

enum WeekNative {
  Sunday = 0,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}
const WeekEnum = Enum(WeekNative);

WeekEnum.Sunday; // 0
WeekEnum.Monday; // 1
WeekEnum.Saturday; // 6
```

> Please note that when creating enums, all enum items must maintain a consistent data structure. For example, you cannot use both Key-Value format and Standard format in the same enum.
>
> You can pass in some optional configuration options to better control the behavior of the enum. Please refer to the [Enum Configuration Options](?path=/docs/user-stories--docs#-enum-configuration-options) section for details.

---

<!-- docs-prev-next-nav -->

| Previous                               | Next                                               |
| -------------------------------------- | -------------------------------------------------- |
| [← Install](?path=/docs/install--docs) | [API Reference →](?path=/docs/api-reference--docs) |
