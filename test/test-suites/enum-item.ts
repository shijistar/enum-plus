import type { Enum as EnumType } from '@enum-plus';
import { localeEN, StandardWeekConfig } from '../data/week-config';
import type TestEngineBase from '../engines/base';

const testEnumItem = (engine: TestEngineBase, Enum: typeof EnumType) => {
  engine.describe('The EnumItemClass api', () => {
    engine.test('Should be able to pick Enum values', () => {
      const week = Enum(StandardWeekConfig);
      engine.expect(week.Sunday).toBe(0);
      engine.expect(week.Monday).toBe(1);
      engine.expect(week.Tuesday).toBe(2);
      engine.expect(week.Wednesday).toBe(3);
      engine.expect(week.Thursday).toBe(4);
      engine.expect(week.Friday).toBe(5);
      engine.expect(week.Saturday).toBe(6);

      engine.expect(week.Saturday > week.Friday).toBeTruthy();
      engine.expect(week.Monday < week.Tuesday).toBeTruthy();
      engine.expect(week.Monday === 1).toBeTruthy();
      engine.expect(week.Monday !== (2 as number)).toBeTruthy();
      engine.expect(week.Monday + 1).toBe(2);
      engine.expect(week.Friday - 1).toBe(4);
    });

    engine.test('item.toString should return enum label', () => {
      const week = Enum(StandardWeekConfig);
      const sunday = week.items[0];
      engine.expect(sunday.toString()).toBe(localeEN.Sunday);
      engine.expect(sunday.toLocaleString()).toBe(localeEN.Sunday);
      engine.expect(week.items[6].toString()).toBe(localeEN.Saturday);
      engine.expect(week.items[6].toLocaleString()).toBe(localeEN.Saturday);
    });

    engine.test('item.toStringTag should return a friendly name', () => {
      const week = Enum(StandardWeekConfig);
      week.items.forEach((item) => {
        engine.expect(Object.prototype.toString.call(item)).toBe('[object EnumItem]');
      });
    });

    engine.test('item.valueOf should return the enum value', () => {
      const week = Enum(StandardWeekConfig);
      const sunday = week.items[0];
      engine.expect(sunday.valueOf()).toBe(0);
      engine.expect(week.items[6].valueOf()).toBe(6);
    });

    engine.test('item.toPrimitive should be auto converted to a correct primitive type', () => {
      const week = Enum(StandardWeekConfig);
      const sunday = week.items[0];
      const monday = week.items[1];
      const tuesday = week.items[2];
      const friday = week.items[5];
      const saturday = week.items[6];
      engine.expect(Number(sunday)).toBe(0);
      engine.expect(String(sunday)).toBe(localeEN.Sunday);
      // engine.expect(Boolean(sunday)).toBe(false);
      // engine.expect(Boolean(monday)).toBe(true);

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
    });

    // should be readonly
    engine.test('Should be readonly', () => {
      const week = Enum(StandardWeekConfig);
      const modifyValue = 'SHOULD NOT BE MODIFIED';
      const sunday = week.items[0];

      /* ----------------- set ----------------- */
      // @ts-expect-error: because try to modify the property forcefully
      sunday.key = modifyValue;
      engine.expect(sunday.key).toBe('Sunday');
      // @ts-expect-error: because try to modify the property forcefully
      sunday.value = modifyValue;
      engine.expect(sunday.value).toBe(0);
      // @ts-expect-error: because try to modify the property forcefully
      sunday.label = modifyValue;
      engine.expect(sunday.label).toBe(localeEN.Sunday);
      // @ts-expect-error: because try to modify the property forcefully
      sunday.raw = modifyValue;
      engine.expect(sunday.raw).toEqual(StandardWeekConfig.Sunday);

      /* ----------------- delete ----------------- */
      // @ts-expect-error: because try to delete the property forcefully
      delete sunday.key;
      engine.expect(sunday.key).toBe('Sunday');
      // @ts-expect-error: because try to delete the property forcefully
      delete sunday.value;
      engine.expect(sunday.value).toBe(0);
      // @ts-expect-error: because try to delete the property forcefully
      delete sunday.label;
      engine.expect(sunday.label).toBe(localeEN.Sunday);
      // @ts-expect-error: because try to delete the property forcefully
      delete sunday.raw;
      engine.expect(sunday.raw).toEqual(StandardWeekConfig.Sunday);

      /* ----------------- defineProperty ----------------- */
      Object.defineProperty(sunday, 'sayHello', { value: () => modifyValue });
      engine.expect((sunday as unknown as { readonly sayHello: string }).sayHello).toBe(undefined);

      /* ----------------- defineProperties ----------------- */
      Object.defineProperties(sunday, {
        sayHello: { value: () => modifyValue },
        sayHi: { value: () => modifyValue },
      });
      engine.expect((sunday as unknown as { readonly sayHello: string }).sayHello).toBe(undefined);

      /* ----------------- setPrototypeOf ----------------- */
      Object.setPrototypeOf(sunday, { sayHello: () => modifyValue });
      engine.expect((sunday as unknown as { readonly sayHello: string }).sayHello).toBe(undefined);

      // engine.expect(Object.isExtensible(sunday)).toBe(false);
      engine.expect(Object.isSealed(sunday)).toBe(false);
      engine.expect(Object.isFrozen(sunday)).toBe(false);
    });
  });
};

export default testEnumItem;
