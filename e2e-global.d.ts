import type * as EnumPlus from '@enum-plus';
import type * as WeekConfig from './test/data/week-config';
import type * as WeekData from './test/data/week-data';
import type { deserializeJavascript, serializeJavascript } from './test/utils/serialize-javascript.js';

declare global {
  interface Window {
    EnumPlus: typeof EnumPlus;
    WeekConfig: typeof WeekConfig;
    WeekData: typeof WeekData;
    SerializeJavascript: {
      serializeJavascript: typeof serializeJavascript;
      deserializeJavascript: typeof deserializeJavascript;
    };
  }
}

export {};
