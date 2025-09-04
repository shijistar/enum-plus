import type * as JSONEO from 'jsoneo';
import type * as EnumPlus from './src';
import type * as WeekConfig from './test/data/week-config';
import type * as WeekData from './test/data/week-data';

declare global {
  interface Window {
    EnumPlus: typeof EnumPlus;
    WeekConfig: typeof WeekConfig;
    WeekData: typeof WeekData;
    JSONEO: typeof JSONEO;
  }
}
export {};
