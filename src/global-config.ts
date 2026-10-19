import type { LocalizeTemplatesConfig } from './auto-localize';
import type { LocalizeInterface } from './localize-interface';
import { defaultLocalize } from './utils';

export const localizer: {
  /**
   * - **EN:** Convert resource key to localized text
   * - **CN:** 把资源键值转化为本地化文本
   */
  localize?: LocalizeInterface;
} = {
  localize: defaultLocalize,
};
/** Internal module, do not use. */
export const internalConfig: {
  /** @deprecated Use `templates.items` instead. */
  autoLabel?:
    | boolean
    | ((options: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        item: any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        labelPrefix: any;
      }) => string);
  /**
   * - **EN:** Internationalization templates for enum name and items, used to simplify the
   *   internationalization configuration of enums.
   * - **CN:** 枚举名称和枚举项的国际化模板，用于简化枚举的国际化配置
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  templates?: LocalizeTemplatesConfig<any, any, any, any, any, any>;
  /**
   * - **EN:** Whether to always preserve all meta information in the meta array, even if a enum item
   *   has no value for that meta field
   * - **CN:** meta数组中是否始终保留所有的元信息，即便某个枚举项的meta没有值
   *
   * @default false
   */
  preserveEmptyMeta?: boolean;
} = {
  autoLabel: true,
};
