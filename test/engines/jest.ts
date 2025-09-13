import * as EnumPlus from '@enum-plus';
import * as jsoneo from 'jsoneo';
import * as WeekConfig from '../data/week-config';
import * as WeekData from '../data/week-data';
import type { RuntimeContext } from './base';
import TestEngineBase from './base';

export class JestEngine extends TestEngineBase {
  constructor() {
    super();
    this._type = 'jest';
  }

  override test<Data>(
    name: string,
    evaluate: (context: RuntimeContext) => Data,
    assert: (data: Data) => void,
    evaluateContext?: Record<string, unknown>
  ): void {
    test(name, () => {
      const runtimeContext = this.getRuntimeContext();
      const result = evaluate({ ...runtimeContext, ...evaluateContext });
      if (result instanceof Promise) {
        result.then(assert);
      } else {
        assert(result);
      }
    });
  }
  override expect<ActualType = unknown>(actual: ActualType): jest.JestMatchers<ActualType> {
    return expect(actual);
  }
  override describe(name: string, fn: () => void): void {
    describe(name, fn);
  }

  private getRuntimeContext(): RuntimeContext {
    return {
      EnumPlus,
      WeekConfig,
      WeekData,
      jsoneo: jsoneo,
    };
  }
}

export default new JestEngine();
