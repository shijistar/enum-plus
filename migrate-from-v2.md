# Migration Guide from v2

## 🛠 enum.values has been changed

The `enum.values` property was originally planned for removal, but after some discussions, we decided to restore it and change its function: it now represents an array of the member raw values. Therefore, if you are still using the old `values`, please change to the `enum.items` instead.

## 🛠 AntDesign oriented methods have been moved

The following methods are removed from the core library and moved to the `enum-plus-plugin-antd` package. Please install the package and use them from there.

- `enum.toSelect`
- `enum.toMenu`
- `enum.toFilter`
- `enum.toValueMap`

The following methods are deprecated and permanently removed. However they both have alternatives, please use the alternative methods instead.

- ~~`enum.options`~~ → `enum.toSelect`
- ~~`enum.menus`~~ → `enum.toMenu`
- ~~`enum.filters`~~ → `enum.toFilter`
- ~~`enum.valuesEnum`~~ → `enum.toValueMap`

## 🛠 Type Declaration Changes

- `EnumValuesArray` has has been deprecated and replaced with `EnumItemsArray`.
- `IEnumValues` has been renamed to `IEnumItems`.

## 🛠 Enum initialization no longer requires "as const" assertion

The `Enum` can now be initialized with literal objects without the need of `as const` assertion.

> You can still use `as const` to initialize an enum, if you like.

```js
const WeekEnum = Enum({
  Sunday: 0,
  Monday: 1,
});
```
