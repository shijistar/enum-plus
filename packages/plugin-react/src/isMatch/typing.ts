import type { EnumInit, EnumKey, EnumValue, ValueTypeFromSingleInit } from 'enum-plus';

declare module 'enum-plus/extension' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface EnumExtension<
    T extends EnumInit<K, V>,
    K extends EnumKey<T> = EnumKey<T>,
    V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
  > {
    /**
     * - **EN:** Check if the input `item` matches the search string `search`, returns `true` if the
     *   item matches the search criteria, `false` otherwise. The function supports searching by
     *   specific field that is specified in options. If the search string is empty, it returns all
     *   items.
     *
     *   This function is compatible with the `Ant Design` specification, and can be as `filterOption`
     *   property of components like `Select`, `AutoComplete`, `Transfer`, `Mentions`, etc.
     *
     * > **Note:** This function is case-insensitive by default.
     *
     * - **CN:**
     *   检查输入的`item`是否与搜索字符串`search`匹配，如果匹配则返回`true`，否则返回`false`。还可以在选项中设置搜索字段，支持按指定的字段进行搜索。如果搜索字符串为空，则返回所有项。
     *
     *   该函数兼容`Ant Design`规范，可以作为`Select`、`AutoComplete`、`Transfer`、`Mentions`等组件的`filterOption`属性。
     *
     * > **注意：** 该函数默认不区分大小写。
     *
     * @param search The search string | 搜索字符串
     * @param item The item to compare | 要比较的项
     *
     * @returns `true` if the item matches the search criteria, `false` otherwise |
     *   如果项匹配搜索条件，则返回`true`，否则返回`false`
     */
    isMatch: (
      /**
       * - **EN:** The search string, if empty, return all items
       * - **CN:** 搜索字符串，如果为空，则返回所有项
       */
      search: string | undefined,
      /**
       * - **EN:** The item to compare
       * - **CN:** 待比较的项
       */
      item: unknown,
      /**
       * - **EN:** Optional settings
       * - **CN:** 可选设置
       */
      options?: {
        /**
         * - **EN:** Set a translation function to convert the localization key of the enum item into
         *   display text. In some cases, such as with `react-i18next`, the default `t` function may
         *   not be accessible outside of a component context, so you need to manually obtain the
         *   `t` function and pass it in.
         * - **CN:**
         *   设置一个翻译函数，用于将枚举项的本地化键转换为显示文本。在某些情况下，例如`react-i18next`，默认的`t`函数可能无法在非组件环境中获取到，此时需要先手动获取`t`函数，然后传递进来。
         *
         * @param key The localization key | 本地化键
         *
         * @returns The translated text | 翻译后的文本
         */
        translate?: (key: string | undefined) => string | undefined;
      }
    ) => boolean;

    /**
     * - **EN:** Check if the input `item` matches the search string `search`, returns `true` if the
     *   item matches the search criteria, `false` otherwise. The function supports searching by
     *   specific field that is specified in options. If the search string is empty, it returns all
     *   items.
     *
     *   This function is compatible with the `Ant Design` specification, and can be as `filterOption`
     *   property of components like `Select`, `AutoComplete`, `Transfer`, `Mentions`, etc.
     *
     * > **Note:** This function is case-sensitive.
     *
     * - **CN:**
     *   检查输入的`item`是否与搜索字符串`search`匹配，如果匹配则返回`true`，否则返回`false`。还可以在选项中设置搜索字段，支持按指定的字段进行搜索。如果搜索字符串为空，则返回所有项。
     *
     *   该函数兼容`Ant Design`规范，可以作为`Select`、`AutoComplete`、`Transfer`、`Mentions`等组件的`filterOption`属性。
     *
     * > **注意：** 该函数区分大小写。
     *
     * @param search The search string | 搜索字符串
     * @param item The item to compare | 要比较的项
     *
     * @returns `true` if the item matches the search criteria, `false` otherwise |
     *   如果项匹配搜索条件，则返回`true`，否则返回`false`
     */
    isMatchCaseSensitive: (
      /**
       * - **EN:** The search string, if empty, return all items
       * - **CN:** 搜索字符串，如果为空，则返回所有项
       */
      search: string | undefined,
      /**
       * - **EN:** The item to compare
       * - **CN:** 待比较的项
       */
      item: unknown,
      /**
       * - **EN:** Optional settings
       * - **CN:** 可选设置
       */
      options?: {
        /**
         * - **EN:** Set a translation function to convert the localization key of the enum item into
         *   display text. In some cases, such as with `react-i18next`, the default `t` function may
         *   not be accessible outside of a component context, so you need to manually obtain the
         *   `t` function and pass it in.
         * - **CN:**
         *   设置一个翻译函数，用于将枚举项的本地化键转换为显示文本。在某些情况下，例如`react-i18next`，默认的`t`函数可能无法在非组件环境中获取到，此时需要先手动获取`t`函数，然后传递进来。
         *
         * @param key The localization key | 本地化键
         *
         * @returns The translated text | 翻译后的文本
         */
        translate?: (key: string | undefined) => string | undefined;
      }
    ) => boolean;
  }
}
