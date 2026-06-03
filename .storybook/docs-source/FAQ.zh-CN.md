# 常见问题

&nbsp;

## 为什么需要这个库？TypeScript 已经有内置的枚举了

TypeScript 的内置枚举类型（`enum`）只是实现了[枚举](https://en.wikipedia.org/wiki/Enumerated_type)的基本功能，即消除魔法数字和流程控制。但对于一个前端工程师来说，枚举的需求远不止于此。我们还需要：

1. _消除魔法数字_
2. _在 `if` 或 `switch` 语句中进行流程控制_
3. **为枚举添加显示名称，并支持国际化**
4. **为枚举扩展元数据字段，例如颜色、图标、描述等**
5. **枚举直接生成各种表单控件，例如下拉框、菜单、选项卡等**
6. **把数字直接转换成对应的国际化枚举名称，回显业务数据变得很轻松**

如果你需要这些功能，那么 `enum-plus` 就是为你量身打造的。如果你是一个前端工程师，强烈建议你尝试一下！

## 好像 TypeScript 要废弃 enum 了？

无论 enum 这个**特性**是否未来会被替代，但枚举这个**概念**不会消失，在很多高级语言中这是最基础的特性之一。

`enum-plus` 恰恰是为了弥补 TypeScript 内置 enum 的不足而诞生的。它是一个纯粹的运行时库，不会受到 TypeScript 语言发展的影响。所以，你完全可以放心使用它。它既不会过时，未来也不会被废弃。

> TypeScript 官方并没有明确的计划废除 enum，但是确实在[一些情况](https://www.typescriptlang.org/tsconfig/#erasableSyntaxOnly)下可能会禁止使用 enum。根本原因还是 enum 既不是纯粹的TypeScript类型（在编译时可以被彻底移除），也不是纯粹的JavaScript运行时代码，而是两者的混合体，这给编译器带来了较大的复杂性。

## 枚举库的性能怎么样？

`enum-plus` 始终关注性能。它的设计目标之一就是在提供丰富功能的同时，保持高效的性能表现。

对于 `WeekEnum.Monday` 这种最基本的用法，性能表现与原生枚举是相同的，因为它们在底层都是直接访问JavaScript对象的成员字段。

对于枚举项数组的遍历或查找等操作，与原生数组的性能是一样的，因为枚举项集合的底层就是一个被冻结的原生数组。

由此可见，在性能方面几乎已经达到了极致，你完全可以放心使用它，而不必担心性能问题。

## 为什么不支持反向映射？

请使用 `enum.key(value)` 方法来获取枚举项的键名，这种反向映射的方式不但适用于数字类型的枚举值，也适用于字符串类型的枚举值。

## 为什么启用国际化后，Ant Design下拉框的搜索功能失效了？

这是因为 `Enum.localize` 返回了一个组件对象，而不是常规字符串，导致 antd 无法正确进行字符串匹配。请使用 `enum.isMatch` 方法来实现自定义搜索功能。请参考 [@enum-plus/plugin-react](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-react#dropdown-search)，了解更多详情。

```bash
npm install @enum-plus/plugin-react
```

```tsx
import { Select } from 'antd';

<Select options={WeekEnum.items} filterOption={WeekEnum.isMatch} />;
```

> 如果你使用的是 `@enum-plus/plugin-i18next` 插件，或者自己实现了 `Enum.localize` 方法并且返回的是字符串，那么下拉框的搜索功能应该可以正常工作。

## 我必须使用 TypeScript 吗？我的是 JavaScript 项目要怎么办？

不用担心，无论你的项目是 TypeScript 还是 JavaScript，`enum-plus` 都可以正常工作，并且两种项目都可以享受到类型安全和智能提示的好处。VSCode等现代代码编辑器已经内置了对 TypeScript 的支持，因此你并不需要在项目中安装 TypeScript 依赖。

## TypeScript 版本必须升级到 5.0+ 吗？

不是的。升级 TypeScript 5.0 是为了得到更好的开发体验，如果你选择不升级，它仍然是可以正常工作的，只需要一小点额外的工作。

```ts
const WeekEnum = Enum({
  Sunday: 0,
  Monday: 1,
} as const);
```

可以看到，在较低版本的TypeScript中，你可能需要使用 `as const` 类型断言。`as const` 可以让枚举值保持原始的字面量值，而不会变成 `number`、`string` 类型，同时 `enum.valueType` 类型也会保持 `0 | 1`，而不会变成 `number` 类型。这让 TypeScript 的类型校验变得更准确，也可以提升代码的安全性。关于如何升级TypeScript以及如何修改项目配置，请仔细阅读 [迁移指南](https://github.com/shijistar/enum-plus/blob/master/docs/migration-guide-v2-to-v3.zh-CN.md#升级-typescript)。

如果你使用的是 JavaScript，那么你可以借助 `JSDoc` 来让编辑器精确识别类型。

```js
/** @type {{ Sunday: 0; Monday: 1 }} */
const weekInit = { Sunday: 0, Monday: 1 };

const WeekEnum = Enum(weekInit);
```

## 为什么我的项目安装后没有 TypeScript 类型提示？

这是因为 tsconfig.json 中的配置不正确，请参考[这篇文档](https://github.com/shijistar/enum-plus/blob/master/docs/migration-guide-v2-to-v3.zh-CN.md#修改-tsconfigjson)，了解更多详情。

## 我想定义一个通用的枚举类型，可以表示任意枚举，目前的枚举类型定义太复杂了，有没有简单的办法？

请使用 `AnyEnum` 类型，它是一个通用的枚举类型，可以表示任意枚举。

## 我在发行公告里看到，你们让 Jest 和 Playwright 共享了同一套测试代码，这很有意思。能介绍一下如何实现的吗？

是的，这并不轻松。Jest 和 Playwright 的工作原理并不相同，Jest 运行在 Node.js 环境中，而 Playwright 运行在浏览器环境中。为了让它们共享一套测试代码，我们做了以下工作：

1. **环境适配**：我们为不同的测试框架编写了一个[适配层](https://github.com/shijistar/enum-plus/tree/master/test/engines/index.ts)，处理它们之间的差异。
2. **抽象测试逻辑**：我们将测试逻辑抽象出来，放在一些独立的模块中，这样就可以在不同的测试框架中复用这些测试套件。
3. **增强的序列化机制**：e2e测试要求在浏览器环境中运行，然后把运行结果传递到 Node.js 环境中，再执行断言。为此，我们开发了一个[增强的序列化库](https://github.com/shijistar/jsoneo)。由于在 `enum-plus` 枚举的内部用到了 `类`、`function`、`Symbol`、`Date`、`RegExp` 类型，重写了 `Symbol.toStringTag`、`Symbol.hasInstance` 内置函数，甚至包括 `Getter/Setter` 这些特性，这些都是 JSON.stringify 无法序列化的，我们通过 [jsoneo](https://github.com/shijistar/jsoneo) 实现了对这些复杂特性的支持，从而可以让复杂对象经过 `序列化/反序列化` 跨越不同的环境，并且保留了所有的动态行为。传递后的对象仍然是`活`的，就像原始的对象没有经过序列化过一样。

基于这些工作，我们成功地让 Jest 和 Playwright 共享了一套测试代码，大大提高了单元测试的开发效率，降低了维护成本，你不必维护两套测试代码。未来我们还会把 第1部分 独立成一个开源项目，如果你在开发一个 `通用JavaScript`（Universal JavaScript）项目，或许你也可以尝试这种方式来共享测试代码。

## 我有一个很好的点子，希望为这个项目做贡献，我要怎么做？

我非常欢迎你为这个项目做贡献！以下是一些指导原则，能帮助你决定如何贡献：

得益于 enum-plus 的 [插件系统](?path=/docs/plugin-system--docs&globals=locale:zh-CN#插件系统)，我们要为 enum-plus 扩展新功能变得非常容易。你可以根据功能的通用性和依赖关系，选择以下三种方式之一来贡献：

1. **核心库** - 新功能对所有人都适用，且不引入外部依赖。你可以直接贡献到核心库，请参考 [CONTRIBUTING](https://github.com/shijistar/enum-plus/blob/master/CONTRIBUTING.md) 指南。
2. **官方插件库** - 新功能需要依赖某个 `开放的` 框架或类库，并且在这个框架或类库已经有很多人在使用了。你可以贡献到官方插件库，请参考 [插件开发指南](https://github.com/shijistar/enum-plus/blob/master/docs/plugin-development.zh-CN.md)。
3. **自定义插件** - 新功能需要引入某个闭源的外部依赖，或者这个领域比较小众，建议你自己发布一个 npm 包，并把你的插件链接分享在 [插件生态](?path=/docs/plugin-system--docs&globals=locale:zh-CN#插件生态) 章节中，同样可以共享给所有人。
