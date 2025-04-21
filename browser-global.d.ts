// eslint-disable-next-line import/no-duplicates
import type * as EnumPlus from '@enum-plus';
// eslint-disable-next-line import/no-duplicates
import type { Enum, EnumInit } from '@enum-plus';

declare global {
  interface Window {
    EnumPlus: typeof EnumPlus;
  }
  function createWeekEnum(values: EnumInit): Enum;
}

export {};
