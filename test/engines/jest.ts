import * as EnumPlus from '@enum-plus';
import * as WeekConfig from '../data/week-config';
import * as WeekData from '../data/week-data';
import * as SerializeJavascript from '../utils/serialize-javascript.js';
import TestEngineBase, { type RuntimeContext } from './base';

export class JestEngine extends TestEngineBase {
  constructor() {
    super();
    this._type = 'jest';
  }

  override test<Data>(
    name: string,
    prepare: (context: RuntimeContext) => Data,
    assertion: (data: Data) => void,
    prepareContext?: Record<string, unknown>
  ): void {
    test(name, () => {
      const runtimeContext = this.getRuntimeContext();
      const result = prepare({ ...runtimeContext, ...prepareContext });
      if (result instanceof Promise) {
        result.then(assertion);
      } else {
        assertion(result);
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
      SerializeJavascript,
    };
  }
}
