<!-- markdownlint-disable MD009 MD024 -->

# Changelog

## 1.0.0

2025-10-5

Initial release of `@enum-plus/plugin-vue`.

### ✨ Features

- Vue integration for `enum-plus` with automatic UI re-render on language change.
- Two install entry points:
  - `i18nextPlugin` (uses a provided or global `i18next` instance).
  - `vueI18nextPlugin` (uses `useTranslation` hook from `vue-i18next`).
- Enum labels & enum name localize to Vue elements (not plain strings).
- Dynamic translation options via `localize.tOptions`:
  - Static object form.
  - Function form returning:
    - A dynamic options object passed to `i18next.t`, or
    - A final translated string (short-circuit).
- Global localization configuration fields:
  - `instance` (i18next instance)
  - `useTranslation` / `useTranslationOptions`
  - `tOptions`
  - `defaultSearchField` (for search helpers)
- Search helper APIs for non-string labels:
  - `WeekEnum.isMatch(search, item)` (case-insensitive fuzzy match)
  - `WeekEnum.isMatchCaseSensitive(search, item)`
- Works seamlessly with enum-generated option arrays (e.g. for `<Select />`).
