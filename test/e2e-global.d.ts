import type * as jsoneo from 'jsoneo';
import type * as EnumPlus from '../src';
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
  }
}
export {};
