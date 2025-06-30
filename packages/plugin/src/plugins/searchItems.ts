import type {
  EnumInit,
  EnumItemClass,
  EnumItemInit,
  EnumKey,
  EnumValue,
  PluginFunc,
  ValueTypeFromSingleInit,
} from 'enum-plus';

export interface PluginOptions {
  /**
   * **EN:** The name of the field used for list item labels, used to search list items. Default is
   * `label`.
   *
   * **CN:** 列表项标签(名称)的字段名，用于搜索列表项，默认是`label`。
   */
  labelField?: string;

  /**
   * **EN:** Whether to ignore case when searching for list items. Default is `true`.
   *
   * **CN:** 搜索列表项时是否忽略大小写，默认是`true`。
   */
  ignoreCase?: boolean;
}

const searchItemsPlugin: PluginFunc<PluginOptions> = (options, Enum) => {
  const { labelField = 'label', ignoreCase = true } = options ?? {};
  Enum.extends({
    searchItems: <
      T extends EnumInit<K, V>,
      K extends EnumKey<T> = EnumKey<T>,
      V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
    >(
      search?: string,
      item?: V | Record<string, unknown> | EnumItemClass<EnumItemInit<V>, K, V>
    ): boolean => {
      let label: string | undefined;
      if (
        typeof item === 'boolean' ||
        typeof item === 'number' ||
        typeof item === 'bigint' ||
        typeof item === 'string' ||
        item instanceof RegExp ||
        item instanceof Date
      ) {
        label = item.toString();
      } else if (typeof item === 'symbol') {
        label = '';
      } else if (typeof item === 'object' && item !== null) {
        const possible = (item as Record<string, unknown>)[labelField];
        if (possible) {
          // only string, numbers are valid labels
          if (typeof possible === 'string') {
            label = possible;
          } else if (typeof possible === 'number' || typeof possible === 'bigint') {
            label = possible.toString();
          } else if (item.raw) {
            // item is possible EnumItemClass, try to get original label (before localization) from item.raw
            label = (item.raw as Record<string, string>).label ?? '';
          }
        }
      }
      if (Enum.localize) {
        const result = Enum.localize(label);
        if (typeof result === 'function') {
          // if $t is a function, call it to get the latest $t
          label = result(label) ?? label;
        } else {
          label = result ?? label;
        }
      }
      if (!search) return true;
      if (ignoreCase) {
        return label?.toUpperCase?.().includes(search.toUpperCase?.()) ?? false;
      } else {
        return label?.includes(search) ?? false;
      }
    },
  });
};
export default searchItemsPlugin;

declare module 'enum-plus-extend' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface EnumExtension<
    T extends EnumInit<K, V>,
    K extends EnumKey<T> = EnumKey<T>,
    V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
  > {
    /**
     * **EN:** Search for list items, returns true if the item matches the search criteria, false
     * otherwise. The function supports searching by specific field that is specified in options. If
     * the search string is empty, it returns all items.
     *
     * This function is compatible with the `Ant Design` specification, and can be as `filterOption`
     * property of components like `Select`, `AutoComplete`, `Transfer`, `Mentions`, etc.
     *
     * **CN:** 搜索列表项，如果项匹配搜索条件，则返回true，否则返回false。还可以在选项中设置搜索字段，支持按指定的字段进行搜索。如果搜索字符串为空，则返回所有项。
     *
     * 该函数兼容`Ant Design`规范，可以作为`Select`、`AutoComplete`、`Transfer`、`Mentions`等组件的`filterOption`属性。
     *
     * @param search The search string | 搜索字符串
     * @param item The item to search for | 要搜索的项
     *
     * @returns true if the item matches the search criteria, false otherwise |
     *   如果项匹配搜索条件，则返回true，否则返回false
     */
    searchItems: (
      /**
       * **EN:** The search string, if empty, return all items
       *
       * **CN:** 搜索字符串，如果为空，则返回所有项
       */
      search?: string,
      /**
       * **EN:** The item to search for
       *
       * **CN:** 待搜索的列表项
       */
      item?: V | Record<string, unknown> | EnumItemClass<EnumItemInit<V>, K, V>
    ) => boolean;
  }
}
