import type { EnumInit, EnumKey, EnumValue, PluginFunc, ValueTypeFromSingleInit } from 'enum-plus';

export interface SamplePluginOptions {
  /**
   * - **EN:** A custom field for demonstration purposes.
   * - **CN:** 用于演示的自定义字段。
   */
  foo?: string;
}

const samplePlugin: PluginFunc<SamplePluginOptions> = (options = {}, Enum) => {
  const { foo } = options;
  Enum.extends({
    sample: <
      T extends EnumInit<K, V>,
      K extends EnumKey<T> = EnumKey<T>,
      V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
    >() => {
      console.log('Sample plugin works! Foo:', foo);
    },
  });
};

export default samplePlugin;

declare module 'enum-plus/extension' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface EnumExtension<
    T extends EnumInit<K, V>,
    K extends EnumKey<T> = EnumKey<T>,
    V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
  > {
    /**
     * - **EN:** A sample method added by the sample plugin.
     * - **CN:** 由 sample 插件添加的示例方法。
     */
    sample: () => void;
  }
}
