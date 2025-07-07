import type * as EnumPlus from './src';
import type * as WeekConfig from './test/data/week-config';
import type * as WeekData from './test/data/week-data';
import type * as SerializeJavascript from './test/utils/serialize-javascript';

declare global {
  interface Window {
    EnumPlus: typeof EnumPlus;
    WeekConfig: typeof WeekConfig;
    WeekData: typeof WeekData;
    SerializeJavascript: typeof SerializeJavascript;
  }
}
export {};
