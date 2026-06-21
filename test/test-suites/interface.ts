import type { EnumItemInterface, IEnum, IEnumItems } from '@enum-plus';
import type { ExactEqual } from '@enum-plus/types';
import type { StandardWeekConfig } from '../data/week-config';
import type TestEngineBase from '../engines/base';

const testTyping = (engine: TestEngineBase<'jest' | 'playwright'>) => {
  engine.describe('Enum typings', () => {
    engine.test(
      'the enum.X should have primitive values',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
        const WeekConfig = StandardWeekConfig;
        const weekEnum = Enum(StandardWeekConfig);
        return { weekEnum, Enum, WeekConfig };
      },
      ({ weekEnum }) => {
        weekEnum.Monday satisfies 1;
        engine.expect(weekEnum.Monday + 1).toBe(weekEnum.Tuesday);
        engine.expect(weekEnum.Tuesday > weekEnum.Monday).toBe(true);
      },
    );
    engine.test(
      'the Enum.isEnum should behave as type guard, and no TypeScript error should be raised',
      ({ EnumPlus: { Enum, defaultLocalize }, WeekConfig: { StandardWeekConfig, setLang, getLocales } }) => {
        setLang('en-US', Enum, getLocales, defaultLocalize);
        const WeekConfig = StandardWeekConfig;
        const weekEnum = Enum(StandardWeekConfig);
        return { weekEnum, Enum, WeekConfig };
      },
      ({ weekEnum, Enum, WeekConfig }) => {
        const enumObj = weekEnum as typeof weekEnum | number;
        if (Enum.isEnum(enumObj)) {
          engine.expect(enumObj).toBe(weekEnum);
        } else {
          (enumObj + 1) satisfies number;
        }

        const value = 1 as 1 | { foo: number };
        if (weekEnum.has(value)) {
          engine.expect(value.toFixed(1)).toBe('1.0');
        } else {
          value satisfies { foo: number };
        }

        validateEnum(engine, weekEnum, WeekConfig);
        validateEnum(engine, weekEnum.items, WeekConfig);
      },
    );
    engine.test(
      'the instanceof operator on Enum should behave as type guard, and no TypeScript error should be raised',
      ({ EnumPlus: { Enum, defaultLocalize }, WeekConfig: { StandardWeekConfig, setLang, getLocales } }) => {
        setLang('en-US', Enum, getLocales, defaultLocalize);
        const WeekConfig = StandardWeekConfig;
        const weekEnum = Enum(StandardWeekConfig);
        return { weekEnum, Enum, WeekConfig };
      },
      ({ weekEnum, Enum, WeekConfig }) => {
        const enumObj = weekEnum as typeof weekEnum | number;
        if (enumObj instanceof Enum) {
          enumObj satisfies typeof weekEnum;
          engine.expect(enumObj).toBe(weekEnum);
        } else {
          enumObj satisfies number;
        }

        const value2 = 1 as 1 | { foo: number };
        if (value2 instanceof weekEnum) {
          value2 satisfies 1;
          engine.expect(value2.toFixed(1)).toBe('1.0');
        } else {
          // FIXME: instanceof operator cannot narrow types in else branch
          // value2 satisfies { foo: number };
        }

        const value3 = 'Monday' as 'Monday' | { foo: number };
        if (value3 instanceof weekEnum) {
          value3 satisfies 'Monday';
          engine.expect(value3.trim()).toBe('Monday');
        } else {
          // FIXME: instanceof operator cannot narrow types in else branch
          // value3 satisfies { foo: number };
        }

        const value4 = 9 as 9 | { foo: number };
        if (value4 instanceof weekEnum) {
          false satisfies ExactEqual<typeof value4, 9>;
        } else {
          value4 satisfies 9 | { foo: number };
        }

        validateEnum(engine, weekEnum, WeekConfig);
        validateEnum(engine, weekEnum.items, WeekConfig);
      },
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
>(engine: TestEngineBase<'jest' | 'playwright'>, weekEnum: T, WeekConfig: typeof StandardWeekConfig) {
  engine.expect(() => weekEnum.valueType satisfies (typeof WeekConfig)[keyof typeof WeekConfig]['value']).toThrow();
  engine.expect(() => weekEnum.keyType satisfies keyof typeof WeekConfig).toThrow();
  engine.expect(() => weekEnum.rawType satisfies (typeof WeekConfig)[keyof typeof WeekConfig]).toThrow();

  type WeekNames = keyof typeof StandardWeekConfig;
  weekEnum.key(1) satisfies 'Monday';
  weekEnum.key(1 as number) satisfies WeekNames | undefined;
  weekEnum.key(8) satisfies undefined;
  // @ts-expect-error: because key returns nullable value, should use optional chaining (?.) operator
  engine.expect(() => weekEnum.key(8 as number).trim()).toThrow();

  weekEnum.label(1) satisfies string;
  weekEnum.label(1 as number) satisfies string | undefined;
  weekEnum.label(8) satisfies undefined;
  // @ts-expect-error: because label returns nullable value, should use optional chaining (?.) operator
  engine.expect(() => weekEnum.label(8 as number).trim()).toThrow();

  type MondayItem = EnumItemInterface<
    (typeof StandardWeekConfig)['Monday'],
    'Monday',
    (typeof StandardWeekConfig)['Monday']['value']
  >;
  type WeekItems = EnumItemInterface<
    (typeof StandardWeekConfig)[keyof typeof StandardWeekConfig],
    keyof typeof StandardWeekConfig,
    (typeof StandardWeekConfig)[keyof typeof StandardWeekConfig]['value']
  >;
  weekEnum.item(1) satisfies MondayItem;
  weekEnum.item(1 as number) satisfies WeekItems | undefined;
  weekEnum.item(8) satisfies undefined;
  // @ts-expect-error: because label returns nullable value, should use optional chaining (?.) operator
  engine.expect(() => weekEnum.item(8 as number).label).toThrow();

  weekEnum.raw('Monday') satisfies typeof WeekConfig.Monday;
  weekEnum.raw('Monday' as string) satisfies (typeof WeekConfig)[keyof typeof WeekConfig] | undefined;
  weekEnum.raw('January') satisfies undefined;
  // @ts-expect-error: because raw returns nullable object, should use optional chaining (?.) operator
  engine.expect(() => weekEnum.raw('January' as string).value).toThrow();

  weekEnum.findBy('key', 'Monday') satisfies MondayItem;
  weekEnum.findBy('key', 'Monday' as string) satisfies WeekItems | undefined;
  // @ts-expect-error: because findBy returns nullable object, should use optional chaining (?.) operator
  engine.expect(() => weekEnum.findBy('key', 'January' as string).key).toThrow();
  weekEnum.findBy('value', 1) satisfies MondayItem;
  weekEnum.findBy('value', 1 as number) satisfies WeekItems | undefined;
  // @ts-expect-error: because findBy returns nullable object, should use optional chaining (?.) operator
  engine.expect(() => weekEnum.findBy('value', 8 as number).key).toThrow();
  weekEnum.findBy('label', 'Monday') satisfies WeekItems | undefined;
  // @ts-expect-error: because findBy label always return nullable string
  engine.expect(() => weekEnum.findBy('label', 'January' as string).key).toThrow();
  weekEnum.findBy('status', 'warning') satisfies EnumItemInterface<
    (typeof StandardWeekConfig)['Monday' | 'Tuesday'],
    'Monday' | 'Tuesday',
    (typeof StandardWeekConfig)['Monday' | 'Tuesday']['value']
  >;
  weekEnum.findBy('status', 'warning' as string) satisfies WeekItems | undefined;
  // @ts-expect-error: because findBy returns nullable object, should use optional chaining (?.) operator
  engine.expect(() => weekEnum.findBy('status', 'foo' as string).key).toThrow();

  weekEnum.named satisfies {
    [key in keyof typeof WeekConfig]: EnumItemInterface<
      (typeof WeekConfig)[key],
      key,
      (typeof WeekConfig)[key]['value']
    >;
  };
  const mondayItem = weekEnum.named.Monday;
  engine.expect(mondayItem.status satisfies 'warning').toBe('warning');
  engine.expect(mondayItem.abbr satisfies 'weekday.MondayAbbr').toBe('weekday.MondayAbbr');
  if (Date.now() < 0) {
    // @ts-expect-error: because dynamic enum item fields are readonly
    mondayItem.status = 'error';
  }

  type WeekItemsInit = (typeof WeekConfig)[keyof typeof WeekConfig];
  type MetaType = Omit<
    {
      [key in keyof WeekItemsInit]: key extends 'value' | 'label' ? never : WeekItemsInit[key][];
    },
    'value' | 'label'
  >;
  weekEnum.meta satisfies MetaType;

  type DefaultListItem = Pick<WeekItemsInit, 'value'> & { label: string };
  weekEnum.toList()[0] satisfies DefaultListItem;
  weekEnum.toList({ valueField: 'id', labelField: 'name' })[0] satisfies {
    id: WeekItemsInit['value'];
    name: string;
  };

  weekEnum.toMap() satisfies Record<WeekItemsInit['value'], string>;
  weekEnum.toMap({ keySelector: 'key', valueSelector: 'value' }) satisfies Record<
    keyof typeof WeekConfig,
    WeekItemsInit['value']
  >;
}
