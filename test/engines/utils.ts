import * as EnumPlus from '@enum-plus';
import * as Jsoneo from 'jsoneo';
import * as WeekConfig from '../data/week-config';
import * as WeekData from '../data/week-data';

export const getNodeRuntimeContext = (): RuntimeContext => {
  return {
    EnumPlus,
    WeekConfig,
    WeekData,
    Jsoneo: Jsoneo,
  };
};

export interface RuntimeContext {
  EnumPlus: typeof EnumPlus;
  WeekConfig: typeof WeekConfig;
  WeekData: typeof WeekData;
  Jsoneo: typeof Jsoneo;
  [key: string]: unknown;
}
