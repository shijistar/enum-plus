import type { BuiltInLocaleKeys, EnumInit, EnumKey, EnumValue, ValueTypeFromSingleInit } from './types';

declare global {
  /**
   * **EN:** Global extension of the enumeration, which can be used to add global extension methods
   *
   * **CN:** 枚举的全局扩展，可以用来添加全局扩展方法
   */
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore: TS2428: All declarations of 'EnumExtension' must have identical type parameters
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface EnumExtension<
    T extends EnumInit<K, V>,
    K extends EnumKey<T> = EnumKey<T>,
    V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
  > {}
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
}
