import { defaultLocalize, Enum } from '@enum-plus';
import { expect, test } from '../../e2e/fixtures/EnumTest';
import { getLocales, setLang } from '../data/week-config';
import { deserializeJavascript, serializeJavascript } from '../utils/serialize-javascript';
import TestEngineBase, { type RuntimeContext } from './base';
import type { MakeMatchers } from './playwright-types';

export class PlaywrightEngine extends TestEngineBase {
  constructor() {
    super();
    this._type = 'playwright';
  }

  override test<Data = unknown>(
    name: string,
    evaluate: (context: RuntimeContext) => Data,
    assert: (data: Data) => void,
    evaluateContext?: Record<string, unknown>
  ): void {
    const evaluateContextStr = serializeJavascript({ ...evaluateContext, evaluateFn: evaluate });
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
        console.log('window', runtimeContext);
        const { serializeJavascript: serialize, deserializeJavascript: deserialize } = SerializeJavascript;
        const args = deserialize(contextStr) as { evaluateFn: typeof evaluate };
        const { evaluateFn, ...rest } = args;
        const evaluateResult = evaluateFn({ ...runtimeContext, ...rest });
        // console.log('evaluateResult');
        // console.log(evaluateResult);
        // save the current lang to the result
        const serializedStr = serialize({
          EnumLocalize: EnumPlus.Enum.localize,
          lang: WeekConfig.lang,
          ...evaluateResult,
        });
        // console.log('serialize result');
        // console.log(serializeResult);
        return serializedStr;
      }, evaluateContextStr);

      const initialState = deserializeJavascript(resultStr);
      // restore the lang to the Enum.localize
      setLang(initialState.lang, Enum, getLocales, defaultLocalize);
      if (!initialState.EnumLocalize) {
        Enum.localize = undefined!;
      }
      // the Enum object is used to "help" to access the Enum global function,
      // because the code is like `const localize = this._options?.localize ?? Enum.localize;`,
      // it seems that Enum is a global variable, but actually it is not, we simulate it as a closure context.
      const testResult = deserializeJavascript(resultStr, {
        closure: { Enum, ...initialState },
      });
      // console.log('deserialize result');
      // console.log(testResult);
      assert(testResult as Data);
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

export default new PlaywrightEngine();
