# 本地化

enum-plus 默认不内置国际化能力，因此枚举项的`label`字段将被视为普通字符串，直接返回原始文本。

为 enum-plus 添加本地化支持，最简单的方式是安装对应的 [i18n插件](?path=/docs/plugin-system--docs&globals=locale:zh-CN#插件生态)，例如 `@enum-plus/plugin-i18next`，它会自动将 `label` 和 `name` 字段的值传递给 i18next 进行翻译。

```bash
npm install @enum-plus/plugin-i18next i18next
```

然后在项目入口文件中安装插件：

_index.js_

```js
import i18nextPlugin from '@enum-plus/plugin-i18next';
import { Enum } from 'enum-plus';

Enum.install(i18nextPlugin);
```

安装了插件后，枚举的 `label` 和 `name` 字段将自动通过 i18next 进行翻译。

```js
const WeekEnum = Enum(
  {
    Sunday: { value: 0, label: 'week.sunday' },
    Monday: { value: 1, label: 'week.monday' },
  },
  { name: 'weekDays.name' },
);
WeekEnum.label(1); // Monday 或 星期一，取决于当前语言环境
WeekEnum.named.Monday.label; // Monday 或 星期一，取决于当前语言环境
WeekEnum.name; // Week 或 周，取决于当前语言环境
```

此插件还支持自定义 i18next 选项，甚至允许完全控制 localize 方法，请参考[插件文档](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-i18next/README.zh-CN.md#插件选项)，了解更多详情。

如果你需要切换语言后自动更新UI，这需要借助 React、Vue 或 Angular 等框架的能力，请考虑使用 [@enum-plus/plugin-react](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-react) 或 [@enum-plus/plugin-vue](https://github.com/shijistar/enum-plus/tree/master/packages/plugin-vue) 等插件。

如果你使用的是其它国际化库，例如 `react-intl`、`vue-i18next` 或 `ngx-translate`，你可以通过 `Enum.localize` 方法来集成这些库。

_my-extension.js_

```js
import { Enum } from 'enum-plus';

Enum.localize = (key) => {
  // 这是一段伪代码，请根据你使用的国际化库进行调整
  return intl.formatMessage({ id: key });
};
```

> 一旦你完成了这项功能，建议你考虑把它发布成一个 npm 包，并分享在[插件生态](?path=/docs/plugin-system--docs&globals=locale:zh-CN#插件生态)章节中，这样其他人也可以受益于你的工作。如果你觉得这个项目非常通用，也可以考虑把它提交到 [enum-plus](https://github.com/shijistar/enum-plus/tree/master/packages) 官方插件库中，具体开发规则请参阅 [插件开发指南](https://github.com/shijistar/enum-plus/blob/master/docs/plugin-development.zh-CN.md)。

## 自定义 label 逻辑

当然，如果不使用任何国际化框架，而是希望自己控制枚举 `label` 的本地化规则，或者为每个枚举项使用不同的自定义逻辑，你可以为 `label` 字段传入一个函数：

```js
const WeekEnum = Enum({
  Sunday: { value: 0, label: () => '星期日' },
  Monday: { value: 1, label: () => '星期一' },
});
```

另外，enum\.name 也支持使用自定义函数。

```js
const WeekEnum = Enum(
  {
    //...
  },
  {
    name: () => '周',
  },
);
```

---

<!-- docs-prev-next-nav -->

| 上一篇                                                             | 下一篇                                                                |
| ------------------------------------------------------------------ | --------------------------------------------------------------------- |
| [← 全局扩展](?path=/docs/extensibility--docs&globals=locale:zh-CN) | [命名冲突 →](?path=/docs/naming-conflicts--docs&globals=locale:zh-CN) |
