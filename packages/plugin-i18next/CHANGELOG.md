<!-- markdownlint-disable MD009 MD024 -->

# Changelog

## 1.0.0

2025-10-5

Initial release of `@enum-plus/plugin-i18next`.

### ✨ Features

- Seamless integration of `enum-plus` with `i18next`.
- Global `localize` options:
  - `instance`: custom `i18next` instance (defaults to global).
  - `tOptions`: static object passed to `i18next.t`.
  - Functional `tOptions(key)` returning:
    - A dynamic options object, or
    - A final translated string (short‑circuit translation).
- Supports enum item `label` fields as i18next keys (e.g. `week.monday`).
- Supports enum type `name` localization key.

### Not Included

- Automatic UI repaint after language change.

> Please consider framework plugins like [@enum-plus/plugin-react](https://www.npmjs.com/package/@enum-plus/plugin-react) / [@enum-plus/plugin-vue](https://www.npmjs.com/package/@enum-plus/plugin-vue).
