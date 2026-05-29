## API

### 💎 &nbsp; Pick enum values

`Enum.XXX`

Works like native `enum`, allowing you to access enum values directly.

```js
WeekEnum.Sunday; // 0
WeekEnum.Monday; // 1
```

---

### 💎 &nbsp; named

`Record<string, EnumItemClass>`

An object that aggregates all enum items, allowing quick access to a specific enum item object through its `key`.

```js
WeekEnum.named.Monday; // { key: 'Monday', value: 1, label: 'Monday' }
```

### 💎 &nbsp; items

`{ value, label, key, raw }[]`

Returns a read-only array of all enum items.

```js
WeekEnum.items; // [ { value: 0, label: 'Sunday', key: 'Sunday' }, { value: 1, label: 'Monday', key: 'Monday' }, ... ]
```

---

### 💎 &nbsp; values

`(string | number)[]`

Returns an array of all enum item `value`(s).

```js
WeekEnum.values; // [0, 1, 2, 3, 4, 5, 6]
```

---

### 💎 &nbsp; labels

`string[]`

Returns an array of all enum item `label`(s). If [localization](?path=/docs/recipes--docs#localization) has been enabled, the localized texts of each enum item will be returned.

```js
WeekEnum.labels; // ['Sunday', 'Monday', ... 'Friday', 'Saturday']
```

---

### 💎 &nbsp; keys

`string[]`

Returns an array of all enum item `key`(s)

```js
WeekEnum.keys; // ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
```

---

### 💎 &nbsp; meta

`Record<string, any[]>`

Returns an object containing arrays of custom field values for all enum items. Each key in the object corresponds to a custom field name, and the value is an array of that field's values across all enum items.

```js
const ColorEnum = Enum({
  Red: { value: 1, label: 'Red', hex: '#FF0000' },
  Green: { value: 2, label: 'Green', hex: '#00FF00' },
  Blue: { value: 3, label: 'Blue', hex: '#0000FF' },
});
ColorEnum.meta.hex; // ['#FF0000', '#00FF00', '#0000FF']
```

Additionally, you can quickly access custom fields of an enum item through the `named` and `raw` properties.

```js
ColorEnum.named.Red.raw.hex; // '#FF0000'
```

---

### 💎 &nbsp; has

<sup>**_\[F]_**</sup> &nbsp; `has(keyOrValue?: string | number): boolean`

Check if the value or key of an enum item exists.

```js
WeekEnum.has(1); // true
WeekEnum.has('Sunday'); // true
WeekEnum.has(9); // false
WeekEnum.has('Birthday'); // false
```

---

### 💎 &nbsp; findBy

<sup>**_\[F]_**</sup> &nbsp; `findBy(field: string, value: any): EnumItemClass | undefined`

Find an enum item by a specific field and its value. Returns the enum item object if found, otherwise returns `undefined`.

The `field` parameter can be one of the built-in fields: `key`, `value`, `label`, or any meta field defined in the enum item.

```js
ColorEnum.findBy('value', 1); // { key: 'Red', value: 1, label: 'Red', hex: '#FF0000' }
ColorEnum.findBy('key', 'Red'); // { key: 'Red', value: 1, label: 'Red', hex: '#FF0000' }
ColorEnum.findBy('hex', '#FF0000'); // { key: 'Red', value: 1, label: 'Red', hex: '#FF0000' }
```

> If you need to get the meta fields of a known enum item, it is recommended to use the `named` and `raw` property, for example: `ColorEnum.named.Red.raw.hex`.

---

### 💎 &nbsp; label

<sup>**_\[F]_**</sup> &nbsp; `label(keyOrValue?: string | number): string | undefined`

Gets the display name of an enum item according to its value or key. If [localization](?path=/docs/recipes--docs#localization) is enabled, the localized text will be returned.

```js
WeekEnum.label(1); // Monday
WeekEnum.label('Monday'); // Monday, this is label, not key
```

---

### 💎 &nbsp; key

<sup>**_\[F]_**</sup> &nbsp; `key(value?: string | number): string | undefined`

Find the key of an enum item by its value. It's also known as [reverse mapping](https://www.typescriptlang.org/docs/handbook/enums.html#reverse-mappings). If not found, `undefined` is returned.

```js
WeekEnum.key(1); // Monday (this is key, not label)
```

---

### 💎 &nbsp; raw

<sup>**_\[F^1]_**</sup> &nbsp; `raw(): Record<K, T[K]>`
<br/>
<sup>**_\[F^2]_**</sup> &nbsp; `raw(keyOrValue: V | K): T[K]`

The `raw` method has two overloads. The first one is to return the original initialization object of the whole enum collection, i.e. the first parameter of the `Enum` method.

The second one is to return the original initialization object of a single enum item, i.e. the sub-object of the corresponding field in the first parameter of the `Enum` method.

The main purpose of the `raw` method is to get the extended custom fields of the enum items.

```js
const WeekEnum = Enum({
  Sunday: { value: 0, label: 'Sunday', happy: true },
  Monday: { value: 1, label: 'Monday', happy: false },
});

WeekEnum.raw(0).happy; // true
WeekEnum.raw(0); // { value: 0, label: 'Sunday', happy: true }
WeekEnum.raw('Monday'); // { value: 1, label: 'Monday', happy: false }
WeekEnum.raw(); // { Sunday: { value: 0, label: 'Sunday', happy: true }, Monday: { value: 1, label: 'Monday', happy: false } }
```

> Tips: If you want to access the metadata fields of a known enum item, using `enum.named.XXX.raw` is a good option, for example: `WeekEnum.named.Sunday.raw.happy`.

---

### 💎 &nbsp; toList

<sup>**_\[F^1]_**</sup> &nbsp; `toList(): { value, label }[]`
<br/>
<sup>**_\[F^2]_**</sup> &nbsp; `toList(options?: { valueField?: string; labelField?: string }): { [key: string]: any }[]`

Converts the enum items to an array of objects, each containing `value` and `label` fields by default. You can customize the field names using the `options` parameter.

```js
WeekEnum.toList();
// [
//   { value: 0, label: 'Sunday' },
//   { value: 1, label: 'Monday' },
//   ...
//   { value: 6, label: 'Saturday' }
// ]
WeekEnum.toList({ valueField: 'id', labelField: 'name' });
// [
//   { id: 0, name: 'Sunday' },
//   { id: 1, name: 'Monday' },
//   ...
//   { id: 6, name: 'Saturday' }
// ]
```

---

### 💎 &nbsp; toMap

<sup>**_\[F^1]_**</sup> &nbsp; `toMap(): Record<string, string | number>`
<br/>
<sup>**_\[F^2]_**</sup> &nbsp; `toMap(options?: { keySelector?: string; valueSelector?: string }): Record<string, any>`

Converts the enum items to a key-value map object, where the keys are the enum values and the values are the enum labels by default. You can customize the key and value fields using the `options` parameter.

```js
WeekEnum.toMap();
// {
//   "0": 'Sunday',
//   "1": 'Monday',
//   ...
//   "6": 'Saturday'
// }
WeekEnum.toMap({ keySelector: 'key', valueSelector: 'value' });
// {
//   "Sunday": 0,
//   "Monday": 1,
//   ...
//   "Saturday": 6
// }
```

---

### 💎 &nbsp; name

`string`

The display name of the whole enum collection. It's optional and can be set as the second parameter of the `Enum` method. This name can be either a plain string or a localization key to support internationalized text. Please refer to the [Localization](?path=/docs/recipes--docs#localization) section for more details.

```js
const WeekEnum = Enum(
  {
    Sunday: { value: 0, label: 'Sunday' },
    Monday: { value: 1, label: 'Monday' },
  },
  {
    name: 'i18n.enums.week', // A regular string or localization key
  },
);

WeekEnum.name; // Week or 周, depending on the current language setting
```

> Enums are usually used to generate dropdown menus in forms, or show item text in table cells. The display name of the enum type often serves as the form field label or table caption. By utilizing the `name` property, you can centralize the management of both the enum type's display name and its items' labels, simplifying maintenance and ensuring consistency across your application.

---

### ⚡️ &nbsp; valueType &nbsp; <sup>**_\[TypeScript Only]_**</sup>

`value1 | value2 | ...`

In TypeScript, provides a union type containing all enum values. It's usually used for type constraints on variables and method parameters, or used in component properties.

```ts
const weekValue: typeof WeekEnum.valueType = 1;

function setToday(day: typeof WeekEnum.valueType) {
  // ...
}

const MyComponent = (props: { day: typeof WeekEnum.valueType }) => {
  // ...
};
```

> Note: This is a TypeScript type and cannot be called at runtime. Calling it at runtime will throw an error.

---

### ⚡️ &nbsp; keyType &nbsp; <sup>**_\[TypeScript Only]_**</sup>

`key1 | key2 | ...`

Similar to `valueType`, provides a union type of all enum keys in TypeScript.

```ts
type WeekKeys = typeof WeekEnum.keyType; // 'Sunday' | 'Monday'

const weekKey: typeof WeekEnum.keyType = 'Monday';
const weekKeys: (typeof WeekEnum.keyType)[] = ['Sunday', 'Monday'];
```

> Note: This is a TypeScript type and cannot be called at runtime. Calling it at runtime will throw an error.

---

### ⚡️ &nbsp; rawType &nbsp; <sup>**_\[TypeScript Only]_**</sup>

`{ value: V, label: string, [...] }`

Provides a type of the original initialization object of the whole enum collection, i.e. the type of the first parameter of the `Enum` method.

Do not confuse it with the `raw` method. The `raw` method is a runtime method, while `rawType` is a TypeScript type.

```ts
type WeekRaw = typeof WeekEnum.rawType;
// { Sunday: { value: 0, label: string }, Monday: { value: 1, label: string } }
```

> Note: This is a TypeScript type and cannot be called at runtime. Calling it at runtime will throw an error.

---

## Static Methods

### 💎 &nbsp; Enum.isEnum

<sup>**_\[F]_**</sup> &nbsp; `isEnum(obj: any): boolean`

Check if a given object is an instance created by the `Enum` function.

```js
Enum.isEnum(WeekEnum); // true
Enum.isEnum({}); // false
```

---

### 💎 &nbsp; Enum.localize

<sup>**_\[F]_**</sup> &nbsp; `(key: string) => string`

Set a global localization function for all enums. This function will be used to get the localized text for enum items and enum type names. Please refer to the [Localization](?path=/docs/recipes--docs#localization) section for more details.

```js
import i18n from 'i18next';

Enum.localize = (key) => i18n.t(key);
```

---

### 💎 &nbsp; Enum.extends

<sup>**_\[F]_**</sup> &nbsp; `(obj: Record<string, Function>) => void`

Extend the `Enum` objects with custom methods. More details can be found in the [Extensibility](?path=/docs/recipes--docs#extensibility) section.

```js
Enum.extends({
  sayHello() {
    return `Hello EnumPlus!`;
  },
});
```

---

### 💎 &nbsp; Enum.install

<sup>**_\[F]_**</sup> &nbsp; `(plugin: Plugin, options?: any) => void`

Install a plugin to extend the functionality of all enums. More details can be found in the [Plugin System](?path=/docs/recipes--docs#plugin-system) section.

```js
import i18nextPlugin from '@enum-plus/plugin-i18next';

Enum.install(i18nextPlugin);
```

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
