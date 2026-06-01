# 插件系统

&nbsp;

`enum-plus` 提供了一个插件系统，允许你为枚举添加额外的功能。插件可以为所有枚举实例添加新的方法或属性，极大地扩展了枚举的功能。你可以选择性地安装需要的插件，而不是将所有功能都打包在一起，从而保持核心库的轻量和高效。

```ts
import { Enum } from 'enum-plus';
import antdPlugin from '@enum-plus/plugin-antd';

Enum.install(antdPlugin);
```

当你安装一个插件后，插件会为所有枚举实例添加新的方法或属性。例如，安装了 [@enum-plus/plugin-antd](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-antd) 插件后，你可以使用 `enum.toSelect` 方法使用枚举生成一个 Select 组件。

你还可以设置插件的可选配置选项，以定制插件的行为，关于插件的配置选项，请参考各个插件的文档。

```ts
import { Enum } from 'enum-plus';
import antdPlugin from '@enum-plus/plugin-antd';

Enum.install(antdPlugin, {
  toSelect: {
    valueField: 'id', // 设置 toSelect 方法生成的数据对象中，关于值的字段名
    labelField: 'name', // 设置 toSelect 方法生成的数据对象中，关于枚举名称的字段名
  },
});
```

## 插件生态

目前我们已经开发并发布了以下插件，你可以根据需要选择安装：

- [@enum-plus/plugin-antd](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-antd)

  面向 [Ant Design](https://ant-design.antgroup.com) 的功能扩展，包括 `enum.toSelect`、`enum.toMenu`、`enum.toFilter` 和 `enum.toValueMap`。通过这些方法，可以直接将枚举绑定到对应的 Ant Design 组件上，极大地简化了代码。

- [@enum-plus/plugin-i18next](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-i18next)

  集成 [i18next](https://www.i18next.com) 并实现枚举标签的国际化。

- [@enum-plus/plugin-react-i18next](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-react-i18next)

  自动适配 [react-i18next](https://react.i18next.com) 以让枚举支持国际化。

- [@enum-plus/plugin-react](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-react)

  React 集成，包括支持 `Enum.localize` 返回 React 组件，以及监听语言变化以自动重新渲染组件。

- [@enum-plus/plugin-i18next-vue](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-i18next-vue)

  集成 [i18next-vue](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-i18next-vue) 并实现枚举标签的国际化，支持切换语言后自动更新UI。

- [@enum-plus/plugin-vue-i18n](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-vue-i18n)

  集成 [vue-i18n](https://vue-i18n.intlify.dev) 并实现枚举标签的国际化，支持切换语言后自动更新UI。

- [@enum-plus/plugin-next-international](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-next-international)

  在 Next.js 项目中，集成 [next-international](https://next-international.vercel.app/) 并实现枚举标签的国际化，支持切换语言后自动更新UI。

我们正在开发以下插件：

- [@enum-plus/plugin-angular](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-angular): Angular 集成，包括支持 `Enum.localize` 返回 Angular 组件，以及监听语言变化以自动重新渲染组件。_我们需要你的帮助来开发这个插件！_

> 如果你没有找到需要的插件，或者你想开发自己的插件，请参阅 [插件开发指南](https://github.com/shijistar/enum-plus/blob/master/docs/plugin-development.zh-CN.md)。你可以在enum-plus官方仓库中开发新插件，也可以将你开发的插件发布到 npm 上，并把你的插件链接分享在这里。我们真诚地需要你的帮助，来丰富插件生态系统！

---
