declare module 'enum-plus-extend' {
  /**
   * **EN:** Global extension of the enumeration, which can be used to add global extension methods
   *
   * **CN:** 枚举的全局扩展，可以用来添加全局扩展方法
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-interface, @typescript-eslint/no-unused-vars
  interface EnumExtension<T, K, V> {}
  /**
   * **EN:** Enum global localization extension
   *
   * **CN:** 枚举本地化的全局扩展
   */
  interface EnumLocaleExtends {
    /**
     * **EN:** Key values of the localized text of the enumeration, which can be used to enhance the
     * intelligent prompt of the editor
     *
     * **CN:** 枚举本地化文本的Key值，可以用来增强编辑器的智能提示
     */
    LocaleKeys: BuiltInLocaleKeys;
  }

  /** Built-in resources */
  type BuiltInLocaleKeys = 'enum-plus.options.all';
}
