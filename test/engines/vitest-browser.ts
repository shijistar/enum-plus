import type { Locator } from '@vitest/browser/context' with { 'resolution-mode': 'import' };
import type { ExpectPollOptions } from 'vitest';
import { describe, expect, test } from 'vitest';
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
  override expect<T>(actual: T, options?: ExpectPollOptions | string) {
    if (
      actual &&
      typeof actual === 'object' &&
      (actual instanceof Element ||
        ['querySelector', 'getByTestId', 'getByRole', 'getByText'].some((method) => method in actual))
    ) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return expect.element(actual as unknown as Locator, options as ExpectPollOptions) as any;
    } else {
      return expect(actual, options as string);
    }
  }
}

export default new ViTestBrowserEngine();
