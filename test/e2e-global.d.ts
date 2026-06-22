import type * as jsoneo from 'jsoneo';
import type * as EnumPlus from '../src';
import type enUS from '../i18n/en-US.json';
import type neutral from '../i18n/neutral.json';
import type zhCN from '../i18n/zh-CN.json';
import type * as WeekConfig from './data/week-config';
import type * as WeekData from './data/week-data';

declare global {
  interface Window {
    EnumPlus: typeof EnumPlus;
    WeekConfig: typeof WeekConfig;
    WeekData: typeof WeekData;
    jsoneo: typeof jsoneo;
    ClientHooks: {
      beforeEach?: () => void | Promise<void>;
    };
    I18n: {
      enUS: Readonly<typeof enUS>;
      zhCN: Readonly<typeof zhCN>;
      neutral: Readonly<typeof neutral>;
    };
  }
}
export {};
