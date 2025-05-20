import { Enum, ENUM_ITEM } from '@enum-plus';
import { localeEN, StandardWeekConfig } from './data/week-config';

describe('the EnumItemClass api', () => {
  test('keyed enum item should be equal to its value', () => {
    const week = Enum(StandardWeekConfig);
    expect(week.Sunday).toBe(0);
    expect(week.Monday).toBe(1);
    expect(week.Tuesday).toBe(2);
    expect(week.Wednesday).toBe(3);
    expect(week.Thursday).toBe(4);
    expect(week.Friday).toBe(5);
    expect(week.Saturday).toBe(6);

    expect(week.Saturday > week.Friday).toBeTruthy();
    expect(week.Monday < week.Tuesday).toBeTruthy();
    expect(week.Monday === 1).toBeTruthy();
    expect(week.Monday !== (2 as number)).toBeTruthy();
    expect(week.Monday + 1).toBe(2);
    expect(week.Friday - 1).toBe(4);
  });

  test('[toString] should return enum label', () => {
    const week = Enum(StandardWeekConfig);
    const sunday = week.values[0];
    expect(sunday.toString()).toBe(localeEN.Sunday);
    expect(sunday.toLocaleString()).toBe(localeEN.Sunday);
    expect(week.values[6].toString()).toBe(localeEN.Saturday);
    expect(week.values[6].toLocaleString()).toBe(localeEN.Saturday);
  });

  test('should have [ENUM_ITEM] property to indicate that this is an enum item', () => {
    const week = Enum(StandardWeekConfig);
    const firstItem = week.items[0];
    const lastItem = week.items[week.items.length - 1];
    expect(firstItem[ENUM_ITEM]).toBe(true);
    // @ts-expect-error: because ENUM_ITEM equals Symbol.for('[EnumItem]')
    expect(firstItem[Symbol.for('[EnumItem]')]).toBe(true);
    expect(lastItem[ENUM_ITEM]).toBe(true);
    // @ts-expect-error: because ENUM_ITEM equals Symbol.for('[EnumItem]')
    expect(lastItem[Symbol.for('[EnumItem]')]).toBe(true);
  });

  test('[valueOf] should return the enum value', () => {
    const week = Enum(StandardWeekConfig);
    const sunday = week.values[0];
    expect(sunday.valueOf()).toBe(0);
    expect(week.values[6].valueOf()).toBe(6);
  });

  test('[toPrimitive] should be auto converted to a correct primitive type', () => {
    const week = Enum(StandardWeekConfig);
    const sunday = week.values[0];
    const monday = week.values[1];
    const tuesday = week.values[2];
    const friday = week.values[5];
    const saturday = week.values[6];
    expect(Number(sunday)).toBe(0);
    expect(String(sunday)).toBe(localeEN.Sunday);
    // expect(Boolean(sunday)).toBe(false);
    // expect(Boolean(monday)).toBe(true);

    expect(saturday > friday).toBeTruthy();
    expect(monday < tuesday).toBeTruthy();
    // @ts-expect-error: because should be compatible with number
    // eslint-disable-next-line eqeqeq
    expect(monday == 1).toBeTruthy();
    // @ts-expect-error: because should be compatible with number
    expect(monday !== 2).toBeTruthy();
    // @ts-expect-error: because should be compatible with number
    // eslint-disable-next-line eqeqeq
    expect(monday != 2).toBeTruthy();
    // @ts-expect-error: because should be compatible with number
    expect(monday + 1).toBe(2);
    // @ts-expect-error: because should be compatible with number
    expect(friday - 1).toBe(4);

    expect('' + sunday).toBe('0');
    expect('' + saturday).toEqual('6');

    expect(`${sunday}`).toBe(localeEN.Sunday);
    expect(`${saturday}`).toBe(localeEN.Saturday);
    expect(saturday.toString()).toBe(localeEN.Saturday);
    expect(monday.toLocaleString()).toBe(localeEN.Monday);
    expect(typeof monday).toBe('object');

    expect(+sunday).toBe(0);
    expect(+saturday).toBe(6);
  });

  // should be readonly
  test('EnumItem should be readonly', () => {
    const week = Enum(StandardWeekConfig);
    const modifyValue = 'SHOULD NOT BE MODIFIED';
    const sunday = week.values[0];

    /* ----------------- set ----------------- */
    // @ts-expect-error: because try to modify the property forcefully
    sunday.key = modifyValue;
    expect(sunday.key).toBe('Sunday');
    // @ts-expect-error: because try to modify the property forcefully
    sunday.value = modifyValue;
    expect(sunday.value).toBe(0);
    // @ts-expect-error: because try to modify the property forcefully
    sunday.label = modifyValue;
    expect(sunday.label).toBe(localeEN.Sunday);
    // @ts-expect-error: because try to modify the property forcefully
    sunday.raw = modifyValue;
    expect(sunday.raw).toEqual(StandardWeekConfig.Sunday);

    /* ----------------- delete ----------------- */
    // @ts-expect-error: because try to delete the property forcefully
    delete sunday.key;
    expect(sunday.key).toBe('Sunday');
    // @ts-expect-error: because try to delete the property forcefully
    delete sunday.value;
    expect(sunday.value).toBe(0);
    // @ts-expect-error: because try to delete the property forcefully
    delete sunday.label;
    expect(sunday.label).toBe(localeEN.Sunday);
    // @ts-expect-error: because try to delete the property forcefully
    delete sunday.raw;
    expect(sunday.raw).toEqual(StandardWeekConfig.Sunday);

    /* ----------------- defineProperty ----------------- */
    Object.defineProperty(sunday, 'sayHello', { value: () => modifyValue });
    expect((sunday as unknown as { readonly sayHello: string }).sayHello).toBe(undefined);

    /* ----------------- defineProperties ----------------- */
    Object.defineProperties(sunday, {
      sayHello: { value: () => modifyValue },
      sayHi: { value: () => modifyValue },
    });
    expect((sunday as unknown as { readonly sayHello: string }).sayHello).toBe(undefined);

    /* ----------------- setPrototypeOf ----------------- */
    Object.setPrototypeOf(sunday, { sayHello: () => modifyValue });
    expect((sunday as unknown as { readonly sayHello: string }).sayHello).toBe(undefined);

    // expect(Object.isExtensible(sunday)).toBe(false);
    expect(Object.isSealed(sunday)).toBe(false);
    expect(Object.isFrozen(sunday)).toBe(false);
  });
});
