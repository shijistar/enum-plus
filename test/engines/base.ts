import type { ExpectConfig, TestEngine } from './types';
import type { RuntimeContext } from './utils';

abstract class TestEngineBase<Engine extends TestEngine = 'jest'> {
  protected _type?: Engine;

  get type() {
    return this._type;
  }

  abstract describe(name: string, fn: () => void): void;

  abstract test<Data = unknown>(
    name: string,
    evaluate: (context: RuntimeContext) => Data | Promise<Data>,
    assert: (data: Data) => void,
    evaluateContext?: Record<string, unknown>
  ): void;

  abstract expect<T extends ExpectConfig<unknown>[Engine][0][0]>(
    actual: T,
    options?: ExpectConfig<T>[Engine][0][1]
  ): ExpectConfig<T>[Engine][0][2];
  abstract expect<T extends ExpectConfig<unknown>[Engine][1][0]>(
    actual: T,
    options?: ExpectConfig<T>[Engine][1][1]
  ): ExpectConfig<T>[Engine][1][2];
}

export default TestEngineBase;
