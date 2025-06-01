import { ENUM_ITEM as NODE_ENUM_ITEM } from '@enum-plus';
import type TestEngineBase from '../engines/base';

const testEnumItem = (engine: TestEngineBase) => {
  engine.describe('The EnumItemClass api', () => {
    engine.test(
      'Should be able to pick Enum values',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
        const weekEnum = Enum(StandardWeekConfig);
        return { weekEnum };
      },
      ({ weekEnum }) => {
        engine.expect(weekEnum.Sunday).toBe(0);
        engine.expect(weekEnum.Monday).toBe(1);
        engine.expect(weekEnum.Tuesday).toBe(2);
        engine.expect(weekEnum.Wednesday).toBe(3);
        engine.expect(weekEnum.Thursday).toBe(4);
        engine.expect(weekEnum.Friday).toBe(5);
        engine.expect(weekEnum.Saturday).toBe(6);

        engine.expect(weekEnum.Saturday > weekEnum.Friday).toBeTruthy();
        engine.expect(weekEnum.Monday < weekEnum.Tuesday).toBeTruthy();
        engine.expect(weekEnum.Monday === 1).toBeTruthy();
        engine.expect(weekEnum.Monday !== (2 as number)).toBeTruthy();
        engine.expect(weekEnum.Monday + 1).toBe(2);
        engine.expect(weekEnum.Friday - 1).toBe(4);
      }
    );

    engine.test(
      'item.toString should return enum label',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN } }) => {
        const weekEnum = Enum(StandardWeekConfig);
        const sunday = weekEnum.items[0];
        return { weekEnum, sunday, localeEN };
      },
      ({ weekEnum, sunday, localeEN }) => {
        engine.expect(sunday.toString()).toBe(localeEN.Sunday);
        engine.expect(sunday.toLocaleString()).toBe(localeEN.Sunday);
        engine.expect(weekEnum.items[6].toString()).toBe(localeEN.Saturday);
        engine.expect(weekEnum.items[6].toLocaleString()).toBe(localeEN.Saturday);
      }
    );

    engine.test(
      'should have [ENUM_ITEM] property to indicate that this is an enum item',
      ({ EnumPlus: { Enum, ENUM_ITEM }, WeekConfig: { StandardWeekConfig } }) => {
        const weekEnum = Enum(StandardWeekConfig);
        return { weekEnum, ENUM_ITEM };
      },
      ({ weekEnum, ENUM_ITEM }) => {
        weekEnum.items.forEach((item) => {
          engine.expect(item[NODE_ENUM_ITEM]).toBe(true);
          // @ts-expect-error: because ENUM_ITEM equals Symbol.for('[EnumItem]')
          engine.expect(item[ENUM_ITEM]).toBe(true);
          // @ts-expect-error: because ENUM_ITEM equals Symbol.for('[EnumItem]')
          engine.expect(item[Symbol.for('[EnumItem]')]).toBe(true);
        });
      }
    );

    engine.test(
      'item.valueOf should return the enum value',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
        const weekEnum = Enum(StandardWeekConfig);
        const sunday = weekEnum.items[0];
        return { weekEnum, sunday };
      },
      ({ weekEnum, sunday }) => {
        engine.expect(sunday.valueOf()).toBe(0);
        engine.expect(weekEnum.items[6].valueOf()).toBe(6);
      }
    );

    engine.test(
      'item.toPrimitive should be auto converted to a correct primitive type',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN } }) => {
        const weekEnum = Enum(StandardWeekConfig);
        const sunday = weekEnum.items[0];
        const monday = weekEnum.items[1];
        const tuesday = weekEnum.items[2];
        const friday = weekEnum.items[5];
        const saturday = weekEnum.items[6];
        return { localeEN, sunday, monday, tuesday, friday, saturday };
      },
      ({ localeEN, sunday, monday, tuesday, friday, saturday }) => {
        engine.expect(Number(sunday)).toBe(0);
        engine.expect(String(sunday)).toBe(localeEN.Sunday);
        engine.expect(Boolean(sunday)).toBe(true);
        engine.expect(Boolean(monday)).toBe(true);

        engine.expect(saturday > friday).toBeTruthy();
        engine.expect(monday < tuesday).toBeTruthy();
        // @ts-expect-error: because should be compatible with number
        // eslint-disable-next-line eqeqeq
        engine.expect(monday == 1).toBeTruthy();
        // @ts-expect-error: because should be compatible with number
        engine.expect(monday !== 2).toBeTruthy();
        // @ts-expect-error: because should be compatible with number
        // eslint-disable-next-line eqeqeq
        engine.expect(monday != 2).toBeTruthy();
        // @ts-expect-error: because should be compatible with number
        engine.expect(monday + 1).toBe(2);
        // @ts-expect-error: because should be compatible with number
        engine.expect(friday - 1).toBe(4);

        engine.expect('' + sunday).toBe('0');
        engine.expect('' + saturday).toEqual('6');

        engine.expect(`${sunday}`).toBe(localeEN.Sunday);
        engine.expect(`${saturday}`).toBe(localeEN.Saturday);
        engine.expect(saturday.toString()).toBe(localeEN.Saturday);
        engine.expect(monday.toLocaleString()).toBe(localeEN.Monday);
        engine.expect(typeof monday).toBe('object');

        engine.expect(+sunday).toBe(0);
        engine.expect(+saturday).toBe(6);
      }
    );

    // should be readonly
    engine.test(
      'Should be readonly',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN } }) => {
        const weekEnum = Enum(StandardWeekConfig);
        const modifyValue = 'SHOULD NOT BE MODIFIED';
        const sunday = weekEnum.items[0];

        /* ----------------- set ----------------- */
        // @ts-expect-error: because try to modify the property forcefully
        sunday.key = modifyValue;
        const sundayModifiedKey = sunday.key;
        // @ts-expect-error: because try to modify the property forcefully
        sunday.value = modifyValue;
        const sundayModifiedValue = sunday.value;
        // @ts-expect-error: because try to modify the property forcefully
        sunday.label = modifyValue;
        const sundayModifiedLabel = sunday.label;
        // @ts-expect-error: because try to modify the property forcefully
        sunday.raw = modifyValue;
        const sundayModifiedRaw = sunday.raw;

        /* ----------------- delete ----------------- */
        // @ts-expect-error: because try to delete the property forcefully
        delete sunday.key;
        const sundayDeletedKey = sunday.key;
        // @ts-expect-error: because try to delete the property forcefully
        delete sunday.value;
        const sundayDeletedValue = sunday.value;
        // @ts-expect-error: because try to delete the property forcefully
        delete sunday.label;
        const sundayDeletedLabel = sunday.label;
        // @ts-expect-error: because try to delete the property forcefully
        delete sunday.raw;
        const sundayDeletedRaw = sunday.raw;

        /* ----------------- defineProperty ----------------- */
        Object.defineProperty(sunday, 'sayHello', { value: () => modifyValue });
        const sundaySayHello = (sunday as unknown as { readonly sayHello: string }).sayHello;

        /* ----------------- defineProperties ----------------- */
        Object.defineProperties(sunday, {
          sayHello: { value: () => modifyValue },
          sayHi: { value: () => modifyValue },
        });
        const sundaySayHello2 = (sunday as unknown as { readonly sayHello: string }).sayHello;

        /* ----------------- setPrototypeOf ----------------- */
        Object.setPrototypeOf(sunday, { sayHello: () => modifyValue });
        const sundaySayHello3 = (sunday as unknown as { readonly sayHello: string }).sayHello;

        // engine.expect(Object.isExtensible(sunday)).toBe(false);
        const isSundaySealed = Object.isSealed(sunday);
        const isSundayFrozen = Object.isFrozen(sunday);
        return {
          StandardWeekConfig,
          localeEN,
          sundayModifiedKey,
          sundayModifiedValue,
          sundayModifiedLabel,
          sundayModifiedRaw,
          sundayDeletedKey,
          sundayDeletedValue,
          sundayDeletedLabel,
          sundayDeletedRaw,
          sundaySayHello,
          sundaySayHello2,
          sundaySayHello3,
          isSundaySealed,
          isSundayFrozen,
        };
      },
      ({
        StandardWeekConfig,
        localeEN,
        sundayModifiedKey,
        sundayModifiedValue,
        sundayModifiedLabel,
        sundayModifiedRaw,
        sundayDeletedKey,
        sundayDeletedValue,
        sundayDeletedLabel,
        sundayDeletedRaw,
        sundaySayHello,
        sundaySayHello2,
        sundaySayHello3,
        isSundaySealed,
        isSundayFrozen,
      }) => {
        engine.expect(sundayModifiedKey).toBe('Sunday');
        engine.expect(sundayModifiedValue).toBe(0);
        engine.expect(sundayModifiedLabel).toBe(localeEN.Sunday);
        engine.expect(sundayModifiedRaw).toEqual(StandardWeekConfig.Sunday);
        engine.expect(sundayDeletedKey).toBe('Sunday');
        engine.expect(sundayDeletedValue).toBe(0);
        engine.expect(sundayDeletedLabel).toBe(localeEN.Sunday);
        engine.expect(sundayDeletedRaw).toEqual(StandardWeekConfig.Sunday);
        engine.expect(sundaySayHello).toBe(undefined);
        engine.expect(sundaySayHello2).toBe(undefined);
        engine.expect(sundaySayHello3).toBe(undefined);
        engine.expect(isSundaySealed).toBe(false);
        engine.expect(isSundayFrozen).toBe(false);
      }
    );
  });
};

export default testEnumItem;
