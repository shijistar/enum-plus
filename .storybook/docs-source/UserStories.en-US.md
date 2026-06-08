# User Stories

&nbsp;

## 💡 Prevent Magic Numbers

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

## 💡 Check for Valid Enum Values

```js
if (WeekEnum.has(value)) {
  // It's a valid enum value, safe to use
} else {
  // Throw an error or use a default value
}
```

---

## 💡 Check for Enum Objects

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

## 💡 Generate UI Controls

Take React and Ant Design as examples. Please refer to the [Supports Various Frontend Frameworks](?path=/docs/user-stories--docs#-supports-various-frontend-frameworks) section for more examples.

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

## 💡 Internationalization for Enum Names and Labels

Internationalization support. Set the `label` field to a localization key, so that it displays the corresponding text based on the current language environment. Please refer to the [Localization](?path=/docs/localization--docs#localization) section for more details.

```js
WeekEnum.label(1); // Monday or 星期一, depending on the current locale
WeekEnum.named.Monday.label; // Monday or 星期一, depending on the current locale
WeekEnum.name; // Week or 周, depending on the current locale
```

---

## 💡 Type Narrowing &nbsp; <sup>**_\[TypeScript Only]_**</sup>

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

## 💡 Support Metadata Fields That Can Serve as a Static Configuration System

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

## 💡 Supports Traversing Enum Items in a Read-Only Manner

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

## 💡 Enum Composition (Merging)

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

## 💡 Enable Code Intelligence for Enum Item Labels

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

## 💡 Supports JSDoc Comments on Enum Items, Enabling Code Intelligence

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

## 💡 Supports Various Frontend Frameworks

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

## 💡 Enum Configuration Options

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

## 💡 Custom Field Mapping in Array Format Initialization

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

<!-- docs-prev-next-nav -->

## Continue reading

| Previous                                                         | Next                                                 |
| ---------------------------------------------------------------- | ---------------------------------------------------- |
| [← Global Configuration](?path=/docs/global-configuration--docs) | [Best Practices →](?path=/docs/best-practices--docs) |
