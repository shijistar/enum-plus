<!-- markdownlint-disable MD009 MD024 -->

# Changelog

## 1.0.0

2025-10-5

Initial release of `@enum-plus/plugin-antd`.

### ✨ Features

- Ant Design integration for `enum-plus`
- `toSelect(config)`
  - Generates `{ value, label }[]` (or custom field names) for `<Select />`
  - Supports `firstOption` injection (e.g. “All” / “None”)
- `toMenu()`
  - Produces `{ key, label }[]` compatible with `Menu` / `Dropdown`
- `toFilter()`
  - Produces `{ text, value }[]` for `Table` column `filters`
- `toValueMap()`
  - Generates `Record<EnumValue, { text: string }>` for Ant Design Pro (`ProFormSelect`, `ProTable`, etc.)
