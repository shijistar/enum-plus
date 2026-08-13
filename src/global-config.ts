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
  autoLabel?:
    | boolean
    | ((options: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        item: any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        labelPrefix: any;
      }) => string);
} = {
  autoLabel: true,
};
