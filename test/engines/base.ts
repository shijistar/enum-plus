import type * as EnumPlusNamespace from '@enum-plus';
import type * as JsoneoNamespace from 'jsoneo';
import type * as WeekConfigNamespace from '../data/week-config';
import type * as WeekDataNamespace from '../data/week-data';
import type { TestEngine } from './config';
import type { MakeMatchers } from './playwright-types';

abstract class TestEngineBase {
  protected _type?: TestEngine;

  get type() {
    return this._type;
  }

  abstract test<Data = unknown>(
    name: string,
    evaluate: (context: RuntimeContext) => Data,
    assert: (data: Data) => void,
    evaluateContext?: Record<string, unknown>
  ): void;

  abstract expect<ActualType = unknown>(
    actual: ActualType // eslint-disable-next-line @typescript-eslint/ban-types
  ): jest.JestMatchers<ActualType> | MakeMatchers<void, ActualType, {}>;

  abstract describe(name: string, fn: () => void): void;
}

export interface RuntimeContext {
  EnumPlus: typeof EnumPlusNamespace;
  WeekConfig: typeof WeekConfigNamespace;
  WeekData: typeof WeekDataNamespace;
  jsoneo: typeof JsoneoNamespace;
  [key: string]: unknown;
}
export default TestEngineBase;
