import type { EnumInit, EnumKey, EnumValue, PluginFunc, ValueTypeFromSingleInit } from '@enum-plus';
import { Enum, IS_ENUM_ITEM } from '@enum-plus';

export interface FilterItemPluginOptions {
  /**
   * - **EN:** The name of the field used for list item labels, used to search list items. Default is
   *   `label`.
   * - **CN:** 列表项标签(名称)的字段名，用于搜索列表项，默认是`label`。
   */
  labelField?: string;
}

const filterItemPlugin: PluginFunc<FilterItemPluginOptions> = (options = {}, Enum) => {
  const { labelField = 'label' } = options;
  Enum.extends({
    filterItem: <
      T extends EnumInit<K, V>,
      K extends EnumKey<T> = EnumKey<T>,
      V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
    >(
      search: string | undefined,
      item: unknown
    ): boolean => {
      return filterCore({ search, item, labelField, ignoreCase: true });
    },
    filterItemCaseSensitive: <
      T extends EnumInit<K, V>,
      K extends EnumKey<T> = EnumKey<T>,
      V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
    >(
      search: string | undefined,
      item: unknown
    ): boolean => {
      return filterCore({ search, item, labelField, ignoreCase: false });
    },
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function filterCore(options: { search: string | undefined; item: any; labelField: string; ignoreCase: boolean }) {
  const { search, item, labelField, ignoreCase } = options;
  if (!search) return true;
  let label: string | undefined;
  if (needConvert(item)) {
    label = toString(item);
  } else if (typeof item === 'object' && item !== null) {
    const possible = item[IS_ENUM_ITEM]
      ? (item[labelField] ?? item.raw?.[labelField])
      : (item as Record<string, unknown>)[labelField];
    if (possible != null) {
      if (needConvert(possible)) {
        label = toString(possible);
      }
    }
  }
  if (Enum.localize) {
    const result = Enum.localize(label);
    label = result ?? label;
  }
  if (ignoreCase) {
    return label?.toUpperCase?.().includes(search.toUpperCase?.()) ?? false;
  } else {
    return label?.includes(search) ?? false;
  }
}

function needConvert(v: unknown) {
  return (
    typeof v === 'boolean' ||
    typeof v === 'number' ||
    typeof v === 'bigint' ||
    typeof v === 'string' ||
    typeof v === 'symbol' ||
    v instanceof RegExp ||
    v instanceof Date
  );
}
function toString(v: unknown | undefined) {
  if (v instanceof Date) {
    return v.toISOString();
  }
  return v?.toString?.();
}

export default filterItemPlugin;

declare module 'enum-plus/extension' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface EnumExtension<
    T extends EnumInit<K, V>,
    K extends EnumKey<T> = EnumKey<T>,
    V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
  > {
    /**
     * - **EN:** Search for list items, returns true if the item matches the search criteria, false
     *   otherwise. The function supports searching by specific field that is specified in options.
     *   If the search string is empty, it returns all items.
     *
     *   This function is compatible with the `Ant Design` specification, and can be as `filterOption`
     *   property of components like `Select`, `AutoComplete`, `Transfer`, `Mentions`, etc.
     *
     * > **Note:** This function is case-insensitive by default.
     *
     * - **CN:** 搜索列表项，如果项匹配搜索条件，则返回true，否则返回false。还可以在选项中设置搜索字段，支持按指定的字段进行搜索。如果搜索字符串为空，则返回所有项。
     *
     *   该函数兼容`Ant Design`规范，可以作为`Select`、`AutoComplete`、`Transfer`、`Mentions`等组件的`filterOption`属性。
     *
     * > **注意：** 该函数默认不区分大小写。
     *
     * @param search The search string | 搜索字符串
     * @param item The item to search for | 要搜索的项
     *
     * @returns true if the item matches the search criteria, false otherwise |
     *   如果项匹配搜索条件，则返回true，否则返回false
     */
    filterItem: (
      /**
       * - **EN:** The search string, if empty, return all items
       * - **CN:** 搜索字符串，如果为空，则返回所有项
       */
      search: string | undefined,
      /**
       * - **EN:** The item to search for
       * - **CN:** 待搜索的列表项
       */
      item: unknown
    ) => boolean;

    /**
     * - **EN:** Search for list items, returns true if the item matches the search criteria, false
     *   otherwise. The function supports searching by specific field that is specified in options.
     *   If the search string is empty, it returns all items.
     *
     *   This function is compatible with the `Ant Design` specification, and can be as `filterOption`
     *   property of components like `Select`, `AutoComplete`, `Transfer`, `Mentions`, etc.
     *
     * > **Note:** This function is case-sensitive.
     *
     * - **CN:** 搜索列表项，如果项匹配搜索条件，则返回true，否则返回false。还可以在选项中设置搜索字段，支持按指定的字段进行搜索。如果搜索字符串为空，则返回所有项。
     *
     *   该函数兼容`Ant Design`规范，可以作为`Select`、`AutoComplete`、`Transfer`、`Mentions`等组件的`filterOption`属性。
     *
     * > **注意：** 该函数区分大小写。
     *
     * @param search The search string | 搜索字符串
     * @param item The item to search for | 要搜索的项
     *
     * @returns true if the item matches the search criteria, false otherwise |
     *   如果项匹配搜索条件，则返回true，否则返回false
     */
    filterItemCaseSensitive: (
      /**
       * - **EN:** The search string, if empty, return all items
       * - **CN:** 搜索字符串，如果为空，则返回所有项
       */
      search: string | undefined,
      /**
       * - **EN:** The item to search for
       * - **CN:** 待搜索的列表项
       */
      item: unknown
    ) => boolean;
  }
}
