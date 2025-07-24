import * as utils from '@enum-plus/utils';
import { defaultLocalize, Enum } from '@enum-plus';
import { EnumExtensionClass } from '@enum-plus/enum-collection';
import { localizer } from '@enum-plus/localizer';
import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';
import { getLocales, setLang } from '../data/week-config';
import { parse, stringify } from '../utils/serialize-javascript';
import TestEngineBase, { type RuntimeContext } from './base';
import type { MakeMatchers } from './playwright-types';

export class PlaywrightEngine extends TestEngineBase {
  constructor() {
    super();
    this._type = 'playwright';
  }
  override describe(name: string, fn: () => void): void {
    test.describe(name, fn);
  }

  override test<Data = unknown>(
    name: string,
    evaluate: (context: RuntimeContext) => Data,
    assert: (data: Data) => void,
    evaluateContext?: Record<string, unknown>
  ): void {
    const serializedEvaluateParams = stringify({ ...evaluateContext, evaluateFn: evaluate });

    test(`(es) ${name}`, async ({ page }) => {
      await page.goto('/modern.html', { waitUntil: 'load' });
      await this.executeEvaluation({ page, assert, serializedEvaluateParams });
    });

    // test(`(es-legacy) ${name}`, async ({ page }) => {
    //   await page.goto('/legacy.html', { waitUntil: 'load' });
    //   await this.executeEvaluation({ page, assert, serializedEvaluateParams });
    // });
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  override expect<ActualType = unknown>(actual: ActualType): MakeMatchers<void, ActualType, {}> {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return expect(actual) as unknown as MakeMatchers<void, ActualType, {}>;
  }

  // Execute the test evaluation
  protected async executeEvaluation<Data = unknown>(options: {
    page: Page;
    assert: (data: Data) => void;
    serializedEvaluateParams: string;
  }) {
    const { page, assert, serializedEvaluateParams } = options;
    const resultStr = await page.evaluate((contextStr) => {
      const EnumPlus = window.EnumPlus;
      const WeekConfig = window.WeekConfig;
      const WeekData = window.WeekData;
      const SerializeJavascript = window.SerializeJavascript;

      // Deserialize request
      const runtimeContext = {
        EnumPlus,
        WeekConfig,
        WeekData,
        SerializeJavascript,
      };
      // console.log('window', runtimeContext);
      const { stringify: serialize, parse: deserialize } = SerializeJavascript;
      const args = deserialize(contextStr) as { evaluateFn: (context: RuntimeContext) => Data };
      const { evaluateFn, ...rest } = args;

      // Set the initial state to en-US before executing evaluation, equal to setup in jest.
      WeekConfig.setLang('en-US', EnumPlus.Enum, WeekConfig.getLocales, EnumPlus.defaultLocalize);

      // Execute the evaluation
      const evaluateResult = evaluateFn({ ...runtimeContext, ...rest });
      // console.log('evaluateResult');
      // console.log(evaluateResult);

      // Serialize the evaluation result and pass it to assertion method
      const serializedStr = serialize({
        _enumLocalize: EnumPlus.Enum.localize,
        _lang: WeekConfig.lang,
        ...evaluateResult,
      });
      // console.log('serialize result');
      // console.log(serializeResult);
      return serializedStr;
    }, serializedEvaluateParams);

    const globalClosure = { Enum, EnumExtensionClass, localizer, ...utils };
    const initialState = parse(resultStr, {
      closure: globalClosure,
      // debug: true,
      prettyPrint: false,
    });
    // Restore the lang to the Enum.localize
    setLang(initialState._lang, Enum, getLocales, defaultLocalize);
    if (!initialState._enumLocalize) {
      Enum.localize = undefined!;
    }

    // the Enum object is used to "help" to access the Enum global function,
    // because the code is like `const localize = this._options?.localize ?? Enum.localize;`,
    // it seems that Enum is a global variable, but actually it is not, we simulate it as a closure context.
    const testResult = parse(resultStr, {
      closure: { ...globalClosure, ...initialState },
    });
    // console.log('deserialize result');
    // console.log(testResult);
    assert(testResult as Data);
  }
}

export default new PlaywrightEngine();
