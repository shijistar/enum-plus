import * as EnumPlus from '@enum-plus';
import * as Jsoneo from 'jsoneo';
import * as WeekConfig from '../data/week-config';
import * as WeekData from '../data/week-data';
import enUS from '../i18n/en-US.json';
import neutral from '../i18n/neutral.json';
import zhCN from '../i18n/zh-CN.json';

export const getNodeRuntimeContext = (): RuntimeContext => {
  return {
    EnumPlus,
    WeekConfig,
    WeekData,
    Jsoneo: Jsoneo,
    i18n: {
      enUS,
      zhCN,
      neutral,
    },
  };
};

export interface RuntimeContext {
  EnumPlus: typeof EnumPlus;
  WeekConfig: typeof WeekConfig;
  WeekData: typeof WeekData;
  Jsoneo: typeof Jsoneo;
  i18n: {
    enUS: Readonly<typeof enUS>;
    zhCN: Readonly<typeof zhCN>;
    neutral: Readonly<typeof neutral>;
  };
  [key: string]: unknown;
}
