## User Stories

### 💡 Prevent Magic Numbers

```js
const WeekEnum = Enum({
  Sunday: { value: 0, label: 'Sunday' },
  Monday: { value: 1, label: 'Monday' },
});

if (today === WeekEnum.Sunday) {
  // It's Sunday, enjoy your day!
} else if (today === WeekEnum.Monday) {
  // Oh no, it's Monday again...
}
```

---

### 💡 Check for Valid Enum Values

```js
if (WeekEnum.has(value)) {
  // It's a valid enum value, safe to use
} else {
  // Throw an error or use a default value
}
```

---

### 💡 Check for Enum Objects

```ts
let values: number[] | undefined;
if (Enum.isEnum(data)) {
  values = data.values;
} else if (Array.isArray(data)) {
  values = data;
} else {
  // Throw an error or use a default value
}
```

---

### 💡 Generate UI Controls

Take React and Ant Design as examples. Please refer to the [Supports Various Frontend Frameworks](?path=/docs/recipes--docs#-supports-various-frontend-frameworks) section for more examples.

```jsx
import { Menu, Select, Table } from 'antd';
import { ProFormCheckbox, ProFormSelect } from '@ant-design/pro-components';

const App = () => {
  return (
    <>
      <Select options={WeekEnum.items} />
      <Menu items={WeekEnum.toMenu()} />
      <Table columns={[{ filters: WeekEnum.toFilter() }]} />
      <ProFormSelect valueEnum={WeekEnum.toValueMap()} />
      <ProFormCheckbox valueEnum={WeekEnum.toValueMap()} />
    </>
  );
};
```

> Need to install [@enum-plus/plugin-antd](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-antd) plugin

---

### 💡 Internationalization for Enum Names and Labels

Internationalization support. Set the `label` field to a localization key, so that it displays the corresponding text based on the current language environment. Please refer to the [Localization](?path=/docs/recipes--docs#localization) section for more details.

```js
WeekEnum.label(1); // Monday or 星期一, depending on the current locale
WeekEnum.named.Monday.label; // Monday or 星期一, depending on the current locale
WeekEnum.name; // Week or 周, depending on the current locale
```

---

### 💡 Type Narrowing &nbsp; <sup>**_\[TypeScript Only]_**</sup>

Type narrowing is a TypeScript-specific feature that allows you to use `valueType` to constrain the types of variables, function parameters, or component props. This prevents invalid assignments and enhances type safety in your code.

- Variables

```ts
type WeekValues = typeof WeekEnum.valueType; // 0 | 1 | ... | 5 | 6

const weekValue: WeekValues = 1; // ✅ Correct, 1 is a valid week enum value
const weeks: WeekValues[] = [0, 1]; // ✅ Correct, 0 and 1 are valid week enum values

const badWeekValue1: WeekValues = 'Weekend'; // ❌ Type error, "Weekend" is not a number
const badWeekValue2: WeekValues = 8; // ❌ Error, 8 is not a valid week enum value
const badWeeks: WeekValues[] = [0, 8]; // ❌ Error, 8 is not a valid week enum value
```

- Function Parameters

```ts
function setDay(day: typeof WeekEnum.valueType) {
  // The type of day is narrowed to 0 | 1 | ... | 5 | 6
}

setDay(1); // ✅ Correct
setDay('Monday'); // ❌ Type error
setDay(8); // ❌ Error, 8 is not a valid enum value
```

- Component Props

```ts
type MyComponentProps = {
  day: typeof WeekEnum.valueType; // 0 | 1 | ... | 5 | 6
};
const MyComponent = (props: MyComponentProps) => {
  return <div>Today is {WeekEnum.label(props.day)}</div>;
};

<MyComponent day={1} />; // ✅ Correct
<MyComponent day="Monday" />; // ❌ Type error, "Monday" is not a number
<MyComponent day={8} />; // ❌ Error, 8 is not a valid enum value
```

---

### 💡 Support Metadata Fields That Can Serve as a Static Configuration System

```js
const ColorEnum = Enum({
  Red: { value: 1, hex: '#FF0000', icon: '🔥' },
  Green: { value: 2, hex: '#00FF00', icon: '🍏' },
  Blue: { value: 3, hex: '#0000FF', icon: '🔵' },
});

ColorEnum.values; // [1, 2, 3]
ColorEnum.keys; // ['Red', 'Green', 'Blue']
ColorEnum.meta.hex; // ['#FF0000', '#00FF00', '#0000FF']
ColorEnum.meta.icon; // ['🔥', '🍏', '🔵']
ColorEnum.named.Red.raw.hex; // '#FF0000'
ColorEnum.named.Red.raw.icon; // '🔥'
```

---

### 💡 Supports Traversing Enum Items in a Read-Only Manner

```js
Array.isArray(WeekEnum.items); // true
WeekEnum.items.map((item) => item.value); // [0, 1, ..., 5, 6]
WeekEnum.items.forEach((item) => {
  // ✅ Traversable
});
for (const item of WeekEnum.items) {
  // ✅ Traversable
}

WeekEnum.items.push({ value: 2, label: 'Tuesday' }); // ❌ Not allowed, read-only
WeekEnum.items.splice(0, 1); // ❌ Not allowed, read-only
WeekEnum.items[0].label = 'foo'; // ❌ Not allowed, read-only
```

---

### 💡 Enum Composition (Merging)

```js
const PrimaryColorEnum = Enum({
  Red: { value: 1, hex: '#FF0000' },
  Green: { value: 2, hex: '#00FF00' },
  Blue: { value: 3, hex: '#0000FF' },
});
const SecondaryColorEnum = Enum({
  Yellow: { value: 4, hex: '#FFFF00' },
  Cyan: { value: 5, hex: '#00FFFF' },
  Magenta: { value: 6, hex: '#FF00FF' },
});
const AllColorEnum = Enum({
  ...PrimaryColorEnum.raw(),
  ...SecondaryColorEnum.raw(),
});
```

---

### 💡 Enable Code Intelligence for Enum Item Labels

If you have internationalization enabled, you may want to enable code intelligence when entering enum item labels, listing all available localization resource key values to simplify the input process. You can achieve this by adding a new property to the `EnumLocaleExtends` interface.

_index.ts_

```ts
declare module 'enum-plus/extension' {
  type EN = typeof import('./packages/locals/en').default;
  interface EnumLocaleExtends {
    LocaleKeys: keyof EN;
  }
}
```

---

### 💡 Supports JSDoc Comments on Enum Items, Enabling Code Intelligence

Supports inline documentation through JSDoc, allowing engineers to view detailed comments by simply hovering over enum values in the editor. Please refer to the [Best Practices](https://github.com/shijistar/enum-plus/blob/master/docs/best-practices.md) section for how to write good code.

```js
const WeekEnum = Enum({
  /** Represents Sunday */
  Sunday: { value: 0, label: 'Sunday' },
  /** Represents Monday */
  Monday: { value: 1, label: 'Monday' },
});

WeekEnum.Monday; // Hover over Monday
```

![JSDoc](https://cdn.jsdelivr.net/gh/shijistar/enum-plus@master/public/jsdoc-en.png)

We can see that both the enumeration value and the description of the enumeration item can be displayed at the same time, when the cursor hovers over an enumeration item. There is no need to jump away from the current position in the code to check the definitions.

---

### 💡 Supports Various Frontend Frameworks

`Enum.items` can be consumed as the data source of UI components. Take `Select` component as examples.

- **React-based UI libraries**

  [Ant Design](https://ant.design/components/select) | [Arco Design](https://arco.design/react/en-US/components/select) Select

  ```tsx
  import { Select } from 'antd';

  <Select options={WeekEnum.items} />;
  ```

  [Material-UI](https://mui.com/material-ui/react-select/) Select

  ```tsx
  import { MenuItem, Select } from '@mui/material';

  <Select>
    {WeekEnum.items.map((item) => (
      <MenuItem key={item.value} value={item.value}>
        {item.label}
      </MenuItem>
    ))}
  </Select>;
  ```

  [Kendo UI](https://www.telerik.com/kendo-react-ui/components/dropdowns/dropdownlist) Select

  ```tsx
  import { DropDownList } from '@progress/kendo-react-dropdowns';

  <DropDownList data={WeekEnum.items} textField="label" dataItemKey="value" />;
  ```

- **Vue-based UI libraries**

  [Element Plus](https://element-plus.org/en-US/component/select.html) Select

  ```html
  <el-select>
    <el-option v-for="item in WeekEnum.items" v-bind="item" />
  </el-select>
  ```

  [Ant Design Vue](https://antdv.com/components/select) | [Arco Design](https://arco.design/vue/en-US/component/select) Select

  ```html
  <a-select :options="WeekEnum.items" />
  ```

  [Vuetify](https://vuetifyjs.com/en/components/selects/) Select

  ```html
  <v-select :items="WeekEnum.items" item-title="label" />
  ```

- **Angular-based UI libraries**

  [Angular Material](https://material.angular.io/components/select/overview) Select

  ```html
  <mat-select>
    @for (item of WeekEnum.items; track item.value) {
    <mat-option [value]="item.value">{{ item.label }}</mat-option>
    }
  </mat-select>
  ```

  [NG-ZORRO](https://ng.ant.design/components/select/en) Select

  ```jsx
  <nz-select>
    @for (item of WeekEnum.items; track item.value) {
      <nz-option [nzValue]="item.value">{{ item.label }}</nz-option>
    }
  </nz-select>
  ```

---

### 💡 Enum Configuration Options

You can pass in an optional configuration object when creating an enum to customize its behavior and features. Here are some commonly used configuration options:

```ts
interface EnumOptions {
  /** The name of the enum type, which can be a plain string or a localization key */
  name?: string;
  /**
   * Set a label prefix for all enum items. For more details, please refer to the [Global
   * Configuration] section
   */
  labelPrefix?: string;
  /**
   * The rule for automatically generating enum item labels. For more details, please refer to the
   * [Global Configuration] section
   */
  autoLabel?: boolean | ((params: { item: EnumItemClass; labelPrefix?: string }) => string);
  /**
   * Enum instance-level localization function, which overrides the Enum.localize global
   * configuration function
   */
  localize?: (localeKey: string) => string;
}
```

For more configuration options, please refer to the next section.

---

### 💡 Custom Field Mapping in Array Format Initialization

In the [4. Array Format](?path=/docs/get-started--docs#4-array-format) section, we know that enums can be created from dynamic data arrays. However, the field names in the real world may be different from the default `value`, `label`, and `key`. In such cases, you can pass in a custom option to map these to other field names.

```js
import { Enum } from 'enum-plus';

const data = await getPetsData();
// [   { id: 1, code: 'dog', name: 'Dog' },
//     { id: 2, code: 'cat', name: 'Cat' },
//     { id: 3, code: 'rabbit', name: 'Rabbit' }   ];
const PetTypeEnum = Enum(data, {
  getValue: 'id',
  getLabel: 'name',
  getKey: 'code', // getKey is optional
});
PetTypeEnum.items; // The output is:
// [   { value: 1, label: 'Dog', key: 'dog' },
//     { value: 2, label: 'Cat', key: 'cat' },
//     { value: 3, label: 'Rabbit', key: 'rabbit' }   ]
```

`getValue`, `getLabel`, `getKey` can also be a function to handle more complex business logic, for example:

```js
const PetTypeEnum = Enum(petTypes, {
  getValue: (item) => item.id,
  getLabel: (item) => `${item.name} (${item.code})`,
  getKey: (item) => item.code,
});
```

---

## Plugin System

`enum-plus` provides a plugin system that allows you to extend the functionality of all enums. Plugins can add new methods or properties to all enum instances, greatly enhancing their capabilities. You can choose to install only the plugins you need, keeping the core library lightweight and efficient.

```ts
import { Enum } from 'enum-plus';
import antdPlugin from '@enum-plus/plugin-antd';

Enum.install(antdPlugin);
```

After installing a plugin, it will add new methods or properties to all enum instances. For example, after installing the `@enum-plus/plugin-antd` plugin, you can use the `enum.toSelect` method to generate a Select component from the enum.

Optionally, you can provide configuration options to customize the behavior of the plugin. For details on the configuration options for each plugin, please refer to the documentation of the respective plugins.

```ts
import { Enum } from 'enum-plus';
import antdPlugin from '@enum-plus/plugin-antd';

Enum.install(antdPlugin, {
  toSelect: {
    valueField: 'id', // Sets the field representing the value in the data object generated by the toSelect method
    labelField: 'name', // Sets the field representing the label in the data object generated by the toSelect method
  },
});
```

### Awesome Plugins

The following plugins are available. You can choose to install them based on your needs:

- [@enum-plus/plugin-antd](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-antd)

  [Ant Design](https://ant.design) oriented features, including `enum.toSelect`, `enum.toMenu`, `enum.toFilter`, and `enum.toValueMap`. With these methods, you can directly bind enums to the corresponding Ant Design components, greatly simplifying your code.

- [@enum-plus/plugin-i18next](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-i18next)

  Integrates [i18next](https://www.i18next.com) to enable internationalization of enum labels.

- [@enum-plus/plugin-react-i18next](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-react-i18next)

  Integrates [react-i18next](https://react.i18next.com) to enable internationalization of enum labels.

- [@enum-plus/plugin-react](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-react)

  React integration, including support for `Enum.localize` to return React components, and listening for language changes to auto update components.

- [@enum-plus/plugin-i18next-vue](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-i18next-vue)

  Integrates [i18next-vue](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-i18next-vue) to enable internationalization of enum labels and listen for language changes to auto update components.

- [@enum-plus/plugin-vue-i18n](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-vue-i18n)

  Integrates [vue-i18n](https://vue-i18n.intlify.dev) to enable internationalization of enum labels and listen for language changes to auto update components.

- [@enum-plus/plugin-next-international](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-next-international)

  Integrates [next-international](https://next-international.vercel.app/) in Next.js projects to enable internationalization of enum labels and listen for language changes to auto update components.

We are working on the following plugins:

- [@enum-plus/plugin-angular](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-angular): Angular integration, including support for `Enum.localize` to return Angular components, and listening for language changes to auto update components. _We need your help to develop this plugin!_

> If the plugin you are searching for is not available, or if you want to develop your own plugin, please refer to the [Plugin Development Guide](https://github.com/shijistar/enum-plus/blob/master/docs/plugin-development.md). You can develop new plugins in the official enum-plus repository or publish your developed plugins to npm and share your plugin links here. We sincerely need your help to enrich the plugin ecosystem!

---

## Localization

`enum-plus` does not include built-in internationalization capabilities by default. Therefore, the `label` field of enum items is treated as a plain string and returns the original text directly.

To add localization support to `enum-plus`, the simplest way is to install the corresponding [i18n plugin](?path=/docs/recipes--docs#plugin-system), such as `@enum-plus/plugin-i18next`, which automatically passes the values of the `label` and `name` fields to i18next for translation.

```bash
npm install @enum-plus/plugin-i18next i18next
```

Then install the plugin in the project entry file:

_index.js_

```js
import i18nextPlugin from '@enum-plus/plugin-i18next';
import { Enum } from 'enum-plus';

Enum.install(i18nextPlugin);
```

After installing the plugin, the `label` and `name` fields of the enum will be automatically translated through i18next.

```js
const WeekEnum = Enum(
  {
    Sunday: { value: 0, label: 'week.sunday' },
    Monday: { value: 1, label: 'week.monday' },
  },
  { name: 'weekDays.name' },
);
WeekEnum.label(1); // Monday or 星期一, depending on the current locale
WeekEnum.named.Monday.label; // Monday or 星期一, depending on the current locale
WeekEnum.name; // Week or 周, depending on the current locale
```

This plugin also supports custom i18next options, and even allows complete control over the `localize` method. Please refer to the [plugin documentation](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-i18next#plugin-options) for more details.

If you need to automatically update the UI after switching languages, this requires the capabilities of frameworks like React, Vue, or Angular. Please consider using plugins such as [@enum-plus/plugin-react](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-react) or [@enum-plus/plugin-vue](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-vue).

If you are using other internationalization libraries, such as `react-intl`, `vue-i18next`, or `ngx-translate`, you can integrate these libraries by overwriting the `Enum.localize` method.

_my-extension.js_

```js
import { Enum } from 'enum-plus';

Enum.localize = (key) => {
  // This is a pseudo code, please adjust it according to your own logic
  return intl.formatMessage({ id: key });
};
```

> Once you have completed this feature, it is recommended that you consider publishing it as an npm package and share it in the [Awesome Plugins](?path=/docs/recipes--docs#awesome-plugins) section, so that others can benefit from your work. If you believe that this project is very general, you can also consider submitting it to the official [enum-plus](https://github.com/shijistar/enum-plus/tree/master/packages) plugin repository. For specific development rules, please refer to the [Plugin Development Guide](https://github.com/shijistar/enum-plus/blob/master/docs/plugin-development.md).

### Custom Label Logic

Of course, if you are not using any internationalization framework but want to control the localization rules of enum `label` yourself, or use different custom logic for each enum item, you can pass a function to the `label` field:

```js
const WeekEnum = Enum({
  Sunday: { value: 0, label: () => 'Sunday' },
  Monday: { value: 1, label: () => 'Monday' },
});
```

Additionally, `enum.name` also supports using a custom function.

```js
const WeekEnum = Enum(
  {
    //...
  },
  {
    name: () => 'Week',
  },
);
```

---

## Extensibility

Enum provides a wealth of built-in methods and properties that can satisfy most common use cases. However, if they are not sufficient, you can use `Enum.extends` to add more custom methods. These extensions will be globally applied to all enum instances, including those created before the extension was applied, and will take effect immediately without any additional setup.

> In fact, the entire [Plugin System](?path=/docs/recipes--docs#plugin-system) and the `Enum.install` method are implemented using `Enum.extends` at the underlying level.

- **TypeScript Projects**

  _my-enum-extension.ts_

  ```ts
  // Implementation code
  Enum.extends({
    toMySelect() {
      return this.items.map((item) => ({ value: item.value, title: item.label }));
    },
    reversedItems() {
      return this.items.toReversed();
    },
  });

  // Type declaration for better type hints
  declare module 'enum-plus/extension' {
    export interface EnumExtension<T, K, V> {
      toMySelect: () => { value: V; title: string }[];
      reversedItems: () => EnumItemClass<EnumItemInit<V>, K, V>[];
    }
  }
  ```

  _index.ts_

  Then import this file in the entry file of your project:

  ```ts
  import './my-enum-extension';

  WeekEnum.toMySelect(); // [{ value: 0, title: 'Sunday' }, { value: 1, title: 'Monday' }]
  ```

- **JavaScript Projects**

  _my-enum-extension.js_

  ```js
  import { Enum } from 'enum-plus';

  // Implementation code
  Enum.extends({
    toMySelect() {
      return this.items.map((item) => ({ value: item.value, title: item.label }));
    },
    reversedItems() {
      return this.items.toReversed();
    },
  });
  ```

  _my-enum-extension.js.d.ts_

  ```ts
  import { EnumExtension, EnumItemClass, EnumItemInit } from 'enum-plus';

  // Type declaration for better type hints
  declare module 'enum-plus/extension' {
    export interface EnumExtension<T, K, V> {
      toMySelect: () => { value: V; title: string }[];
      reversedItems: () => EnumItemClass<EnumItemInit<V>, K, V>[];
    }
  }
  ```

  _index.js_

  Then import this file in the entry file of your project:

  ```js
  import './my-enum-extension';

  WeekEnum.toMySelect(); // [{ value: 0, title: 'Sunday' }, { value: 1, title: 'Monday' }]
  ```

Please note that `EnumExtension` is a generic interface that accepts three type parameters, which represent:

- `T`: Initialization object of the enum type (e.g., the object passed to `Enum()`)
- `K`: Key of the enum item (e.g., Sunday, Monday)
- `V`: Value of the enum items

> If you want to provide more friendly type hints in the extension methods, you may need to use these type parameters. However these are all optional, if you don't need them, you can omit them.

---

## Naming Conflicts?

`enum-plus` is designed with naming conflicts in mind. The namespace of enum items is separate from the methods and properties of the enum instance, minimizing the chances of conflicts. For example, when an enum item's name conflicts with a method name, you can access the overridden methods through the `items` property.

```js
import { KEYS, VALUES } from 'enum-plus';

const WeekEnum = Enum({
  foo: { value: 1 },
  bar: { value: 2 },
  keys: { value: 3 }, // Naming conflict
  values: { value: 4 }, // Naming conflict
  label: { value: 5 }, // Naming conflict
  named: { value: 6 }, // Naming conflict
  toList: { value: 7 }, // Naming conflict
});

WeekEnum.foo; // 1
WeekEnum.bar; // 2
// Below are all enum items, which take precedence and override the original methods
WeekEnum.keys; // 3
WeekEnum.values; // 4
WeekEnum.label; // 5
WeekEnum.named; // 6
WeekEnum.toList; // 7

// You can access these overridden methods via .items 🙂
WeekEnum.items[KEYS]; // ['foo', 'bar', 'keys', 'values', 'label', 'named', 'toList']
WeekEnum.items[VALUES]; // [1, 2, 3, 4, 5, 6, 7]
WeekEnum.items.label(1); // 'foo'
WeekEnum.items.named.foo; // { value: 1, label: 'foo', key: 'foo' }
WeekEnum.items.toList(); // [{ value: 1, label: 'foo' }, ...]
```

> Note that `keys` and `values` are special because they are built-in methods of JavaScript arrays. To avoid altering the behavior of the `items` array, you need to use the `KEYS` and `VALUES` symbols as aliases to access them.

For an even more extreme case, what if `items` conflicts with an enum item name? Don't worry, you can still access it via the `ITEMS` alias.

```js
import { ITEMS } from 'enum-plus';

const WeekEnum = Enum({
  foo: { value: 1 },
  bar: { value: 2 },
  items: { value: 3 }, // Naming conflict
  toList: { value: 4 }, // Naming conflict
});

WeekEnum.items; // 3, enum item takes precedence and overrides items
WeekEnum[ITEMS].toList(); // But you can access it via the ITEMS alias
```

---

## Best Practices

When using `enum-plus`, following these best practices can help ensure consistency, maintainability, and clarity in your codebase:

1. **Enum Type Naming:** Use `PascalCase` and end with `Enum` (e.g., _WeekEnum_, _ColorEnum_).
2. **Enum Item Naming:** Use `PascalCase` (e.g., _Sunday_, _Red_). This naming approach highlights the static and immutable nature of enumeration members. Moreover, in the IDE's intelligent prompting, they will be displayed at the top instead of being mixed with other method names, making it more convenient for viewing and selection.
3. **Semantic Clarity:** Ensure enum and item names have clear semantics. Good semantic naming serves as self-documentation, making code intent explicit and reducing cognitive overhead.
4. **Single Responsibility Principle:** Each enum type should represent a single, cohesive set of related constants. Avoid overlapping responsibilities between different enum types.
5. **Provide JSDoc Comments:** Provide JSDoc comments for each enum item and the enum type itself, explaining their purpose and usage. Comprehensive documentation enables IDE hover tooltips and improves code readability and maintainability.
6. **Internationalization Architecture:** Plan for internationalization from the outset by leveraging the library's [localization](?path=/docs/recipes--docs#localization) features. A well-designed internationalization architecture minimizes future refactoring and facilitates global scalability.

Here is an example that combines the above best practices to define an enum:

```js
/** Represents the days of the week */
const WeekEnum = Enum(
  {
    /** Sunday */
    Sunday: { value: 0, label: 'enums.week.sunday' },
    /** Monday */
    Monday: { value: 1, label: 'enums.week.monday' },
    // ...
    /** Friday */
    Friday: { value: 5, label: 'enums.week.friday' },
    /** Saturday */
    Saturday: { value: 6, label: 'enums.week.saturday' },
  },
  { name: 'enums.week.name' },
);
```

---

## Compatibility

enum-plus is designed to be compatible with a wide range of environments, including modern browsers, Node.js, and various build tools. Below are the compatibility details for different environments:

### Browser Environments

- **Modern Bundlers**: For bundlers supporting the [exports](https://nodejs.org/api/packages.html#exports-sugar) configuration (such as webpack 5+, vite, rollup), imports will be resolved to the `es` directory, which targets **`ES2020`**.

- **Legacy Bundlers**: For older bundlers without [exports](https://nodejs.org/api/packages.html#exports-sugar) support (like Webpack 4), imports will be resolved to the `es-legacy` directory, which targets **`ES2015`**.

- **UMD Version**: For direct browser usage or static projects without bundlers, enum-plus provides UMD format files in the `umd` directory. You can include it via a `<script>` tag and access it through the global `window.EnumPlus`. The UMD directory offers two versions:
  - **enum-plus.min.js**: Targets **`ES2020`**, suitable for modern browsers.
  - **enum-plus-legacy.min.js**: Targets **`ES2015`**, suitable for older browsers.

- **Polyfill Strategy**: enum-plus ships no polyfills to minimize bundle size. For legacy browser support, you can choose from the following polyfill strategies based on your project's needs:
  - `core-js`
  - `@babel/preset-env` with appropriate `useBuiltIns` settings
  - Alternative polyfill implementations

### Node.js Environments

In Node.js environments, you can import enum-plus using either `require` or `import` syntax.

- **require**

  For all Node.js versions that support CommonJS, you can import enum-plus using `require('enum-plus')`. The require statement will be resolved to the `lib` directory, which targets **`ES2015`**. The minimum compatible version is Node.js `v7.x`.

- **import**

  For modern versions of Node.js that support ES Modules (Node.js 14.13+), you can import enum-plus using `import { Enum } from 'enum-plus'`. The imports will be resolved to the `es` directory, which targets **`ES2020`**.

---
