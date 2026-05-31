## Q&A

### • Why do I need this library? TypeScript already has the built-in enums

TypeScript's built-in enum only provides the basic functionality of [Enumeration](https://en.wikipedia.org/wiki/Enumerated_type): eliminating magic numbers and structuring control flow (e.g. with if / switch). However, as a front-end engineer, the needs for enumerations are not merely these. We also need:

1. _Eliminate magic numbers_
2. _Used in the `if` or `switch` statements for conditional branching_
3. **Add display names to enums, and should support internationalization**
4. **Add custom metadata fields, such as color, icon, and description, etc.**
5. **Enums can be generated into various form controls such as dropdowns, menus, tabs, etc.**
6. **Convert values directly into localized names for displaying business data in the UI**

If you need these features, then `enum-plus` is designed for you. If you are a front-end engineer, we strongly recommend you give it a try!

### • It seems that TypeScript is going to deprecate enum?

Whether the enum **feature** will be replaced in the future or not, the **concept** of enumeration will never disappear. It is one of the most basic features in many high-level languages.

`enum-plus` was precisely created to make up for the shortcomings of TypeScript's built-in enum. It is a pure runtime library and will not be affected by the development of the TypeScript language. Therefore, you can use it with complete confidence. It will neither become outdated nor be deprecated in the future.

> The TypeScript team does not have a clear plan to deprecate enum. However, it is indeed not supported in [some cases](https://www.typescriptlang.org/tsconfig/#erasableSyntaxOnly). The key reason is that enum is neither a pure TypeScript type (which can be completely removed during compilation) nor pure JavaScript runtime code, but a mixture of the two, which brings significant complexity to the compiler.

### • How about the performance of this library?

`enum-plus` always focuses on performance. One of its design goals is to maintain efficient performance while providing rich functionality.

For the basic usage like `WeekEnum.Monday`, the performance is the same as the native enum, because they both directly access the member fields of a JavaScript object at the underlying level.

For operations such as traversing or searching the array of enum items, the performance is the same as that of native arrays, because the underlying level of the Enum collection is a frozen native array.

As you can see, the performance has almost reached its peak, and you can use it with complete confidence without worrying about performance issues.

### • Why doesn't Enum support reverse mapping?

Please use the `enum.key(value)` method to get the key name according to its value. This reverse mapping method is applicable to both numeric and string enum values.

### • Why does the search function of the Ant Design Select stop working after enabling internationalization?

This is because `Enum.localize` returns a component instance instead of a regular string, causing Ant Design to fail in performing string matching correctly. Please use the `enum.isMatch` method to enable the search functionality. Please refer to [@enum-plus/plugin-react](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-react#dropdown-search) for more details.

```bash
npm install @enum-plus/plugin-react
```

```tsx
import { Select } from 'antd';

<Select options={WeekEnum.items} filterOption={WeekEnum.isMatch} />;
```

> If you are using the `@enum-plus/plugin-i18next` plugin, or have implemented the `Enum.localize` method yourself and it returns a string, then the search functionality in the dropdown should work correctly.

### • Do I have to install TypeScript? What if my project is in JavaScript?

Don't worry, whether your project is in TypeScript or JavaScript, `enum-plus` works perfectly fine. Both of them can benefit from type safety and intelligent code completion. You don't have to install TypeScript dependencies in your project, since modern code editors like VSCode have built-in support for TypeScript.

### • Do I have to upgrade TypeScript to version 5.0+?

Not necessarily. The purpose of upgrading to TypeScript 5.0 is to provide a better development experience. If you choose not to upgrade, it will still work fine with just a little extra effort.

```ts
const WeekEnum = Enum({
  Sunday: 0,
  Monday: 1,
} as const);
```

As you can see, in earlier versions of TypeScript, you may need to use the `as const` type assertion. `as const` allows the enum values to remain their original literal values instead of being converted to `number` or `string` types. Meanwhile, the `enum.valueType` will remain as `0 | 1` instead of becoming `number`. This makes TypeScript's type checking more accurate and enhances code safety. About how to upgrade TypeScript and modify project configurations, please read the [Migration Guide](https://github.com/shijistar/enum-plus/blob/master/docs/migration-guide-v2-to-v3.md#migrating-to-typescript-5) carefully.

If you are using JavaScript, you can leverage `JSDoc` to help the editor accurately recognize types.

```js
/** @type {{ Sunday: 0; Monday: 1 }} */
const weekInit = { Sunday: 0, Monday: 1 };

const WeekEnum = Enum(weekInit);
```

### • Why my project has no TypeScript type hints after installation?

This is due to incorrect configuration in `tsconfig.json`. Please refer to [this document](https://github.com/shijistar/enum-plus/blob/master/docs/migration-guide-v2-to-v3.md#modify-tsconfigjson) for more details.

### • I want to define a generic enum type that can represent any enum. The current enum type definition is too complex. Is there a simple way?

Please use the `AnyEnum` type, which is a generic enum type that can represent any enum.

### • I saw in the release notes that you made Jest and Playwright share the same set of test code, which is interesting. Can you introduce how to achieve this?

Yes, actually it wasn't easy from the beginning. The working principles of Jest and Playwright are quite different. Jest runs in a Node.js environment, while Playwright runs in a browser environment and then returns to the Node.js environment to execute assertions. To make them share a set of test code, we did the following:

1. **Environment Adaptation**: We wrote an [adaptation layer](https://github.com/shijistar/enum-plus/tree/master/test/engines/index.ts) to handle the differences between the two testing frameworks.
2. **Abstract Testing Logic**: We abstracted the testing logic into some independent modules, so that these test suites can be reused in different testing frameworks.
3. **Enhanced Serialization Mechanism**: E2E tests require running in a browser environment and then passing the running results to the Node.js environment for assertions. To achieve this, we developed an [enhanced serialization library](https://github.com/shijistar/jsoneo). Since the `enum-plus` enums internally use types like `class`, `function`, `Symbol`, `Date`, and `RegExp`, built-in functions rewritten like `Symbol.toStringTag` and `Symbol.hasInstance`, and even including `Getter/Setter`, which are not serializable by `JSON.stringify`. We implemented support for these complex features through [jsoneo](https://github.com/shijistar/jsoneo). So complex objects can cross different environments through `serialization/deserialization` while retaining all dynamic behaviors. The transferred object remains "alive", just like the original object has not been serialized.

Based on these efforts, we successfully share a set of test code between Jest and Playwright. It significantly improves the development efficiency of unit tests and reduces maintenance costs. You don't have to maintain two sets of test code. In the future, we will also consider separating the first part into an open-source project. If you are developing a "Universal JavaScript" project, you might also try this approach to share test code.

### • I have a great idea and would like to contribute to this project. What should I do?

We are very glad to hear that! We sincerely welcome contributions from the community. Here are some guidelines to help you get started:

Thanks to the high flexibility of [Plugin System](?path=/docs/plugin-system--docs#plugin-system), it is quite easy to extend new features for enum-plus. Depending on the `generality` and `dependencies` of the feature, you can choose one of the following three ways to contribute:

1. **Core Library** - The new feature is applicable to everyone and does not introduce external dependencies. You can contribute directly to the core library. Please refer to the [CONTRIBUTING](https://github.com/shijistar/enum-plus/blob/master/CONTRIBUTING.md) guide.
2. **Official Plugin Library** - The new feature needs to depend on an `open` framework or library, and many people are already using this framework or library. You can contribute to the official plugin library. Please refer to the [Plugin Development Guide](https://github.com/shijistar/enum-plus/blob/master/docs/plugin-development.md).
3. **Custom Plugin** - The new feature needs to depend on a `private` external dependency, or the field is relatively niche. It is recommended that you publish an npm package yourself and share your plugin link in the [Awesome Plugins](?path=/docs/plugin-system--docs#awesome-plugins) section, which can still be shared with everyone.
