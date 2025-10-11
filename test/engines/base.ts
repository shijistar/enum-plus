import type { ExpectData, ExpectOptions, Matchers, TestEngine } from './types';
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

  abstract expect<T extends ExpectData[Engine]>(actual: T, options?: ExpectOptions[Engine]): Matchers<T>[Engine];
}

export default TestEngineBase;
