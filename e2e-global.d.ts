import type * as EnumPlus from '@enum-plus';
import type * as _ from 'lodash-es';
import type * as WeekConfig from './test/data/week-config';
import type * as WeekData from './test/data/week-data';
import type * as SerializeJavascript from './test/utils/serialize-javascript.js';

declare global {
  interface Window {
    _: typeof _;
    EnumPlus: typeof EnumPlus;
    WeekConfig: typeof WeekConfig;
    WeekData: typeof WeekData;
    SerializeJavascript: typeof SerializeJavascript;
  }
}

export {};
