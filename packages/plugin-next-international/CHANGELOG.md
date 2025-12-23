<!-- markdownlint-disable MD009 MD024 -->

# Changelog

## 1.0.0

2025-12-23

Initial release of `@enum-plus/plugin-next-international`.

### ✨ Features

- React integration for `enum-plus` with automatic UI re-render on language change.
- Enum labels & enum name localize to React elements (not plain strings).
- Global localization configuration fields:
  - `localize.mode`: localization mode (`text` or `component`).
    - `text`: returns plain text, does not auto-update on language change.
    - `component`: returns a React component that auto-updates on language change.
  - `isMatch.defaultSearchField` (for search helpers)
- Search helper APIs for non-string labels:
  - `WeekEnum.isMatch(search, item)` (case-insensitive fuzzy match)
  - `WeekEnum.isMatchCaseSensitive(search, item)`
- Works seamlessly with enum-generated option arrays (e.g. for `<Select />`).
