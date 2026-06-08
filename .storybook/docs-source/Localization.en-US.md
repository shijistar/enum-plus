# Localization

`enum-plus` does not include built-in internationalization capabilities by default. Therefore, the `label` field of enum items is treated as a plain string and returns the original text directly.

To add localization support to `enum-plus`, the simplest way is to install the corresponding [i18n plugin](?path=/docs/plugin-system--docs#plugin-system), such as `@enum-plus/plugin-i18next`, which automatically passes the values of the `label` and `name` fields to i18next for translation.

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

> Once you have completed this feature, it is recommended that you consider publishing it as an npm package and share it in the [Awesome Plugins](?path=/docs/plugin-system--docs#awesome-plugins) section, so that others can benefit from your work. If you believe that this project is very general, you can also consider submitting it to the official [enum-plus](https://github.com/shijistar/enum-plus/tree/master/packages) plugin repository. For specific development rules, please refer to the [Plugin Development Guide](https://github.com/shijistar/enum-plus/blob/master/docs/plugin-development.md).

## Custom Label Logic

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

<!-- docs-prev-next-nav -->

## Continue reading

| Previous                                           | Next                                                     |
| -------------------------------------------------- | -------------------------------------------------------- |
| [← Extensibility](?path=/docs/extensibility--docs) | [Naming Conflicts →](?path=/docs/naming-conflicts--docs) |
