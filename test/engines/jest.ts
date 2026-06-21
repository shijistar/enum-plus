import * as EnumPlus from '@enum-plus';
import * as Jsoneo from 'jsoneo';
import type { describe as describeInterface, expect as expectInterface, test as testInterface } from '@jest/globals';
import * as WeekConfig from '../data/week-config';
import * as WeekData from '../data/week-data';
import TestEngineBase from './base';
import type { RuntimeContext } from './utils';

export class JestEngine extends TestEngineBase<'jest'> {
  constructor() {
    super();
    this._type = 'jest';
  }

  override describe(name: string, fn: () => void): void {
    (describe as typeof describeInterface)(name, fn);
  }
  override test<Data>(
    name: string,
    evaluate: (context: RuntimeContext) => Data | Promise<Data>,
    assert: (data: Data) => void,
    evaluateContext?: Record<string, unknown>,
  ) {
    (test as typeof testInterface)(name, async () => {
      const runtimeContext = this.getRuntimeContext();
      const result = await evaluate({ ...runtimeContext, ...evaluateContext });
      assert(result);
    });
  }
  override expect<ActualType>(actual: ActualType) {
    return (expect as typeof expectInterface)(actual);
  }

  private getRuntimeContext(): RuntimeContext {
    return {
      EnumPlus,
      WeekConfig,
      WeekData,
      Jsoneo,
    };
  }
}

export default new JestEngine();
