import { expect, test } from 'playwright/test';
import { deserializeJavascript, serializeJavascript } from '../utils/serialize-javascript.js';
import TestAdapterBase, { type PrepareContext } from './base';
import type { MakeMatchers } from './playwright-types';

export class PlaywrightAdapter extends TestAdapterBase {
  constructor() {
    super();
    this._type = 'playwright';
  }

  override test<Data = unknown>(
    name: string,
    prepare: (context: PrepareContext) => Data,
    assertion: (data: Data) => void,
    prepareContext?: Record<string, unknown>
  ): void {
    const serializedContext = serializeJavascript({ ...prepareContext, prepareFn: prepare });
    test(`${name} in modern browsers`, async ({ page }) => {
      await page.goto('http://localhost:7080/modern.html');
      const resultStr = await page.evaluate((argsStr) => {
        const EnumPlus = window.EnumPlus;
        const WeekConfig = window.WeekConfig;
        const { serializeJavascript: serialize, deserializeJavascript: deserialize } = window.SerializeJavascript;

        const args = deserialize(argsStr) as { prepareFn: typeof prepare };
        const { prepareFn, ...rest } = args;
        const prepareResult = prepareFn({ EnumPlus, WeekConfig, ...rest });
        // console.log('prepareResult');
        // console.log(prepareResult);
        const serializeResult = serialize(prepareResult as object);
        // console.log('serialize result');
        // console.log(serializeResult);
        return serializeResult;
      }, serializedContext);

      const initialState = deserializeJavascript(resultStr);
      const testResult = deserializeJavascript(resultStr, initialState);
      // console.log('deserialize result');
      // console.log(testResult);
      assertion(testResult as Data);
    });
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  override expect<ActualType = unknown>(actual: ActualType): MakeMatchers<void, ActualType, {}> {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return expect(actual) as MakeMatchers<void, ActualType, {}>;
  }
  override describe(name: string, fn: () => void): void {
    test.describe(name, fn);
  }
}
