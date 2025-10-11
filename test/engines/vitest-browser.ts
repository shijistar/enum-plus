import type { Locator } from '@vitest/browser/context' with { 'resolution-mode': 'import' };
import type { ExpectPollOptions } from 'vitest';
import { expect, test } from 'vitest';
import TestEngineBase from './base';
import type { RuntimeContext } from './utils';
import { getNodeRuntimeContext } from './utils';

export class ViTestBrowserEngine extends TestEngineBase<'vitest-browser'> {
  constructor() {
    super();
    this._type = 'vitest-browser';
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
  override expect<T>(actual: T, options?: ExpectPollOptions) {
    return expect.element(actual as Locator, options);
  }
}

export default new ViTestBrowserEngine();
