import { defaultLocalize, Enum } from '@enum-plus';
import { expect, test } from '../../e2e/fixtures/EnumTest';
import { getLocales, setLang } from '../data/week-config';
import { deserializeJavascript, serializeJavascript } from '../utils/serialize-javascript.js';
import TestEngineBase, { type RuntimeContext } from './base';
import type { MakeMatchers } from './playwright-types';

export class PlaywrightEngine extends TestEngineBase {
  constructor() {
    super();
    this._type = 'playwright';
  }

  override test<Data = unknown>(
    name: string,
    prepare: (context: RuntimeContext) => Data,
    assertion: (data: Data) => void,
    prepareContext?: Record<string, unknown>
  ): void {
    const prepareContextStr = serializeJavascript({ ...prepareContext, prepareFn: prepare });
    test(`${name} in modern browsers`, async ({ page }) => {
      const resultStr = await page.evaluate((contextStr) => {
        const EnumPlus = window.EnumPlus;
        const WeekConfig = window.WeekConfig;
        const WeekData = window.WeekData;
        const SerializeJavascript = window.SerializeJavascript;
        const runtimeContext = {
          EnumPlus,
          WeekConfig,
          WeekData,
          SerializeJavascript,
        };
        console.log('SerializeJavascript', SerializeJavascript);
        const { serializeJavascript: serialize, deserializeJavascript: deserialize } = SerializeJavascript;
        const args = deserialize(contextStr) as { prepareFn: typeof prepare };
        const { prepareFn, ...rest } = args;
        const prepareResult = prepareFn({ ...runtimeContext, ...rest });
        // console.log('prepareResult');
        // console.log(prepareResult);
        // save the current lang to the result
        const serializedStr = serialize({
          EnumLocalize: EnumPlus.Enum.localize,
          lang: WeekConfig.lang,
          ...prepareResult,
        });
        // console.log('serialize result');
        // console.log(serializeResult);
        return serializedStr;
      }, prepareContextStr);

      const initialState = deserializeJavascript(resultStr);
      // restore the lang to the Enum.localize
      setLang(initialState.lang, Enum, getLocales, defaultLocalize);
      if (!initialState.EnumLocalize) {
        Enum.localize = undefined!;
      }
      // the Enum object is used to "help" the localize function of EnumItem and EnumValuesArray,
      // because the code is like `const localize = this._options?.localize ?? Enum.localize;`,
      // it seems that Enum is a global variable, but actually it is not, we simulate it as a closure context.
      const testResult = deserializeJavascript(resultStr, { Enum, ...initialState });
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
