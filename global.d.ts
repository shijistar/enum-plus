import type { EnumInit } from '@enum-plus';
import type * as EnumPlus from './es';
import type { Enum } from './es';

declare global {
  interface Window {
    EnumPlus: typeof EnumPlus;
  }
  function createWeekEnum(values: EnumInit): Enum;
}

export {};
