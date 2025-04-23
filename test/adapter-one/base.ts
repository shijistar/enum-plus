import type * as EnumPlusNamespace from '@enum-plus';
import type * as WeekConfigNamespace from '../data/week-config';
import type { TestFramework } from './config';
import type { MakeMatchers } from './playwright-types';

abstract class TestAdapterBase {
  protected _type?: TestFramework;

  get type() {
    return this._type;
  }

  abstract test<Data = unknown>(
    name: string,
    prepare: (context: PrepareContext) => Data,
    assertion: (data: Data) => void,
    prepareContext?: Record<string, unknown>
  ): void;

  abstract expect<ActualType = unknown>(
    actual: ActualType // eslint-disable-next-line @typescript-eslint/ban-types
  ): jest.JestMatchers<ActualType> | MakeMatchers<void, ActualType, {}>;

  abstract describe(name: string, fn: () => void): void;
}

export interface PrepareContext {
  EnumPlus: typeof EnumPlusNamespace;
  WeekConfig: typeof WeekConfigNamespace;
  [key: string]: unknown;
}
export default TestAdapterBase;
