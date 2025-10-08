<!-- markdownlint-disable MD009 MD024 -->

# Changelog

## 1.0.0

2025-10-13

Initial release of `@enum-plus/plugin-vue-i18n`.

### ✨ Features

- Seamless integration between `enum-plus` and `vue-i18n`.
- Enum item `label` fields can be i18n keys (e.g. `week.monday`).
- Enum type `name` can also be a i18n key (e.g. `weekDays.name`).
- Automatic resolution of current language each time a label is accessed (no stale cache).
- Automatic UI repaint after language change.
- Global `localize` configuration:
  - `instance`: the global `i18n` instance. It's used as a fallback when used outside of Vue component context.
  - `tOptions`: static options object passed to `i18next.t`.
  - Functional `tOptions(key)`:
    - Return a dynamic options object, OR
    - Return a final translated string (short‑circuit translation pipeline).
- Full control over translation logic by returning a string directly in `tOptions`.
