import type { EnumItemOptions } from './types';

/**
 * **EN:** Default global localization function, only used to resolve built-in resources into
 * English, does not provide actual localization functions
 *
 * **CN:** 默认的全局本地化函数，仅用于将内置资源解析为英文，并不提供实际的本地化功能
 *
 * @summary
 *
 * - `enum-plus.options.all` => `All`
 */
export const defaultLocalize: NonNullable<EnumItemOptions['localize']> = (content) => {
  if (content === 'enum-plus.options.all') {
    return 'All';
  }
  return content;
};
