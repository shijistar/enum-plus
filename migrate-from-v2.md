# Migration Guide from v2

## 🛠 enum.values has been changed

The `enum.values` property was originally planned for removal, but after some discussions, we decided to restore it and change its function: it now represents an array of the member raw values. Therefore, if you are still using the old `values`, please change to the `enum.items` instead.

## 🛠 Symbols changed

The following symbols have been renamed to better reflect their purpose:

- `ENUM_COLLECTION` is now `IS_ENUM`
- `ENUM_ITEM` is now `IS_ENUM_ITEM`
- `ENUM_ITEMS` is now `IS_ENUM_ITEMS`

## 🛠 AntDesign oriented methods have been moved

The following methods are removed from the core library and moved to the `enum-plus-plugin-antd` package. Please install the package and use them from there.

- `enum.toSelect`
- `enum.toMenu`
- `enum.toFilter`
- `enum.toValueMap`

The following methods are deprecated and permanently removed. However they both have alternatives, please use the alternative methods instead.

- _`enum.options`_ → `enum.toSelect`
- _`enum.menus`_ → `enum.toMenu`
- _`enum.filters`_ → `enum.toFilter`
- _`enum.valuesEnum`_ → `enum.toValueMap`

## 🛠 Type changes

- `EnumValuesArray` has has been deprecated and replaced with `EnumItemsArray`.
- `IEnumValues` has been renamed to `IEnumItems`.

## 🛠 The way to extend the Enum type has changed

```typescript
declare module 'enum-plus/extension' {
  interface EnumExtension<T, K, V> {
    hello(): string;
  }
}
```

- `moduleResolution` in tsconfig.json
  - `node` or `node10`, TypeScript version `>=3.8`. The [const Type Parameters](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#const-type-parameters) is not supported, should add `as const` manually to the Enum initializations.
  - `node16` or `nodenext`, TypeScript version `>=5.0`

## 🛠 Recommended to upgrade TypeScript to 5.0

We recommend upgrading your TypeScript version to `v5.0` or later, as we have introduced the [const Type Parameters](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-0.html#const-type-parameters) feature to simplify Enum initializations. You don't have to use `as const` anymore. The `Enum` can now be initialized with literal objects by default.

```js
const WeekEnum = Enum({
  Sunday: 0,
  Monday: 1,
});
```

> If you can't upgrade, don't worry. TypeScript `4.9` or earlier is still backward compatible. You will have to add `as const` manually, just like before.
