import { describe, expect, test } from 'vitest';
import TestEngineBase from './base';
import type { RuntimeContext } from './utils';
import { getNodeRuntimeContext } from './utils';

export class ViTestNodeEngine extends TestEngineBase<'vitest-node'> {
  constructor() {
    super();
    this._type = 'vitest-node';
  }

  override describe(name: string, fn: () => void): void {
    describe(name, fn);
  }
  override test<Data>(
    name: string,
    evaluate: (context: RuntimeContext) => Data | Promise<Data>,
    assert: (data: Data) => void,
    evaluateContext?: Record<string, unknown>
  ): void {
    test(name, async () => {
      const runtimeContext = getNodeRuntimeContext();
      const result = await evaluate({ ...runtimeContext, ...evaluateContext });
      assert(result);
    });
  }
  override expect<ActualType>(actual: ActualType, options?: string) {
    return expect(actual, options);
  }
}

export default new ViTestNodeEngine();
