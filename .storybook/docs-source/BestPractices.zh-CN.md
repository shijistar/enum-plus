# 最佳实践

&nbsp;

在使用 `enum-plus` 创建和管理枚举时，遵循一些最佳实践可以帮助你编写更清晰、可维护的代码。以下是一些建议：

1. **枚举类型命名：** 采用 `PascalCase` 大驼峰命名法，并以 `Enum` 作为后缀，如 _WeekEnum_、_ColorEnum_ 等。
2. **枚举成员命名：** 使用 `PascalCase` 大驼峰命名法，如 _Sunday_、_Red_ 等。这种命名方式突显了枚举成员的静态与不可变性，并且在IDE智能提示中可以显示在顶部，而不是与其它方法名混在一起，更方便查看和拾取。
3. **语义明确：** 确保枚举和成员名称具有清晰的语义，良好的语义命名能够自解释代码意图，降低理解成本。
4. **单一职责原则：** 每个枚举类型应专注表达一组高内聚的相关常量，避免不同枚举类型之间的职责重叠。
5. **提供JSDoc注释：** 为每个枚举项添加 JSDoc 注释，说明其含义和用途。完善的JSDoc文档能在IDE中提供悬停提示，提升代码阅读体验。同样也建议为枚举类添加注释。
6. **国际化架构：** 建议从开始就搭建国际化架构，可集成本库提供的 [本地化](?path=/docs/localization--docs&globals=locale:zh-CN#本地化) 机制。预先设计的国际化方案能够避免后期重构的高成本，并使应用更易于扩展到全球市场。

下面是一个示例，展示了如何结合上述最佳实践来定义一个枚举：

```js
/** 表示一周的枚举 */
const WeekEnum = Enum(
  {
    /** 星期日 */
    Sunday: { value: 0, label: 'enums.week.sunday' },
    /** 星期一 */
    Monday: { value: 1, label: 'enums.week.monday' },
    // ...
    /** 星期五 */
    Friday: { value: 5, label: 'enums.week.friday' },
    /** 星期六 */
    Saturday: { value: 6, label: 'enums.week.saturday' },
  },
  { name: 'enums.week.name' },
);
```

---

<!-- docs-prev-next-nav -->

| 上一篇                                                            | 下一篇                                                             |
| ----------------------------------------------------------------- | ------------------------------------------------------------------ |
| [← 典型用法](?path=/docs/user-stories--docs&globals=locale:zh-CN) | [插件系统 →](?path=/docs/plugin-system--docs&globals=locale:zh-CN) |
