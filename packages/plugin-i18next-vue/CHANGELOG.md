<!-- markdownlint-disable MD009 MD024 -->

# Changelog

## 1.0.0

2025-10-5

Initial release of `@enum-plus/plugin-i18next-vue`.

### ✨ Features

- Seamless integration between `enum-plus` and `i18next-vue`.
- Enum item `label` fields can be i18next localization keys (e.g. `week.monday`).
- Enum type `name` can also be a localization key (e.g. `weekDays.name`).
- Automatic resolution of current language each time a label is accessed (no stale cache).
- Global `localize` configuration:
  - `instance`: custom `i18next` instance (falls back to global default).
  - `tOptions`: static options object passed to `i18next.t`.
  - Functional `tOptions(key)`:
    - Return a dynamic options object, OR
    - Return a final translated string (short‑circuit translation pipeline).
- Full control over translation logic by returning a string directly in `tOptions`.

### Not Included

- Automatic UI repaint after language change.

> Please consider [@enum-plus/plugin-vue](https://www.npmjs.com/package/@enum-plus/plugin-vue) plugin.
