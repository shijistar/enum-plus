import type { IEnum, IEnumItems } from '@enum-plus';
import type { localeEN, StandardWeekConfig } from '../data/week-config';
import type TestEngineBase from '../engines/base';

const testTyping = (engine: TestEngineBase<'jest' | 'playwright'>) => {
  engine.describe('Enum typings', () => {
    engine.test(
      'the test codes should not report any TypeScript errors, even including @ts-expect-error comments',
      ({ EnumPlus: { Enum, defaultLocalize }, WeekConfig: { StandardWeekConfig, setLang, getLocales, localeEN } }) => {
        setLang('en-US', Enum, getLocales, defaultLocalize);
        const WeekConfig = StandardWeekConfig;
        const weekEnum = Enum(StandardWeekConfig);
        return { weekEnum, Enum, WeekConfig, localeEN };
      },
      ({ weekEnum, Enum, WeekConfig, localeEN }) => {
        const value = weekEnum as typeof weekEnum | number | string | undefined;
        if (Enum.isEnum(value)) {
          engine.expect(value).toBe(weekEnum);
        } else {
          console.log(value);
        }

        validateEnum(engine, weekEnum, localeEN, WeekConfig);
        validateEnum(engine, weekEnum.items, localeEN, WeekConfig);
      }
    );
  });
};

export default testTyping;

/* 
!----------------------------------------------------------------------
  The below function should not contain any TypeScript errors, even the 
  @ts-expect-error comments should not report any errors.
  If you see any TypeScript errors, it means the typing is incorrect!
!----------------------------------------------------------------------
*/
function validateEnum<
  T extends
    | IEnum<
        typeof StandardWeekConfig,
        keyof typeof StandardWeekConfig,
        (typeof StandardWeekConfig)[keyof typeof StandardWeekConfig]['value']
      >
    | IEnumItems<
        typeof StandardWeekConfig,
        keyof typeof StandardWeekConfig,
        (typeof StandardWeekConfig)[keyof typeof StandardWeekConfig]['value']
      >,
>(
  engine: TestEngineBase<'jest' | 'playwright'>,
  weekEnum: T,
  locale: typeof localeEN,
  WeekConfig: typeof StandardWeekConfig
) {
  const value2 = 1 as 1 | { foo: number };
  const value3 = 'Monday' as 'Monday' | { foo: number };
  if (value2 instanceof weekEnum) {
    engine.expect(value2.toFixed(1)).toBe('1.0');
  } else {
    console.log(value2 as { foo: number });
  }
  if (value3 instanceof weekEnum) {
    engine.expect(value3.trim()).toBe('Monday');
  } else {
    console.log(value3 as { foo: number });
  }

  engine.expect(weekEnum.key(1).trim()).toBe('Monday');
  // @ts-expect-error: because key returns nullable value, should use optional chaining (?.) operator
  engine.expect(weekEnum.key(1 as number).trim()).toBe('Monday');
  // @ts-expect-error: because key returns nullable value, should use optional chaining (?.) operator
  engine.expect(() => weekEnum.key(8 as number).trim()).toThrow();
  // @ts-expect-error: because out-of-range literal values return undefined only, cannot be cased to number
  engine.expect(weekEnum.key(8) as number).toBe(undefined);

  engine.expect(weekEnum.label(1)?.trim()).toBe(locale.Monday);
  // @ts-expect-error: because label returns nullable value, should use optional chaining (?.) operator
  engine.expect(weekEnum.label(1 as number).trim()).toBe(locale.Monday);
  // @ts-expect-error: because label returns nullable value, should use optional chaining (?.) operator
  engine.expect(() => weekEnum.label(8 as number).trim()).toThrow();
  // @ts-expect-error: because out-of-range literal values return undefined only, cannot be cased to string
  engine.expect(weekEnum.label(8) as string).toBe(undefined);

  engine.expect(weekEnum.raw('Monday')).toBe(WeekConfig.Monday);
  // @ts-expect-error: because raw returns nullable object, should use optional chaining (?.) operator
  engine.expect(weekEnum.raw('Monday' as string).value).toBe(1);
  // @ts-expect-error: because raw returns nullable object, should use optional chaining (?.) operator
  engine.expect(() => weekEnum.raw('January' as string).value).toThrow();
  // @ts-expect-error: because out-of-range literal values return undefined only, cannot be cased to object
  engine.expect(weekEnum.raw('January') as { value: number }).toBe(undefined);

  engine.expect(weekEnum.findBy('key', 'Monday').key).toBe('Monday');
  // @ts-expect-error: because findBy returns nullable object, should use optional chaining (?.) operator
  engine.expect(weekEnum.findBy('key', 'Monday' as string).key).toBe('Monday');
  // @ts-expect-error: because findBy returns nullable object, should use optional chaining (?.) operator
  engine.expect(() => weekEnum.findBy('key', 'January' as string).key).toThrow();
  engine.expect(weekEnum.findBy('value', 1).key).toBe('Monday');
  // @ts-expect-error: because findBy returns nullable object, should use optional chaining (?.) operator
  engine.expect(weekEnum.findBy('value', 1 as number).key).toBe('Monday');
  // @ts-expect-error: because findBy returns nullable object, should use optional chaining (?.) operator
  engine.expect(() => weekEnum.findBy('value', 8 as number).key).toThrow();
  // @ts-expect-error: because findBy label always return nullable string
  engine.expect(weekEnum.findBy('label', 'Monday').key).toBe('Monday');
  // @ts-expect-error: because findBy label always return nullable string
  engine.expect(() => weekEnum.findBy('label', 'January' as string).key).toThrow();
  engine.expect(weekEnum.findBy('status', 'warning').key).toBe('Monday');
  // @ts-expect-error: because findBy findBy returns nullable object, should use optional chaining (?.) operator
  engine.expect(weekEnum.findBy('status', 'warning' as string).key).toBe('Monday');
  // @ts-expect-error: because findBy returns nullable object, should use optional chaining (?.) operator
  engine.expect(() => weekEnum.findBy('status', 'foo' as string).key).toThrow();
}
