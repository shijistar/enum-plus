import type { Enum as EnumType } from '@enum-plus';
import type TestAdapterBase from 'test/adapter-one/base';
import { localeEN, StandardWeekConfig } from '../data/week-config';

const testEnumItem = (adapter: TestAdapterBase, Enum: typeof EnumType) => {
  adapter.describe('The EnumItemClass api', () => {
    adapter.test('Should be able to pick Enum values', () => {
      const week = Enum(StandardWeekConfig);
      adapter.expect(week.Sunday).toBe(0);
      adapter.expect(week.Monday).toBe(1);
      adapter.expect(week.Tuesday).toBe(2);
      adapter.expect(week.Wednesday).toBe(3);
      adapter.expect(week.Thursday).toBe(4);
      adapter.expect(week.Friday).toBe(5);
      adapter.expect(week.Saturday).toBe(6);

      adapter.expect(week.Saturday > week.Friday).toBeTruthy();
      adapter.expect(week.Monday < week.Tuesday).toBeTruthy();
      adapter.expect(week.Monday === 1).toBeTruthy();
      adapter.expect(week.Monday !== (2 as number)).toBeTruthy();
      adapter.expect(week.Monday + 1).toBe(2);
      adapter.expect(week.Friday - 1).toBe(4);
    });

    adapter.test('item.toString should return enum label', () => {
      const week = Enum(StandardWeekConfig);
      const sunday = week.items[0];
      adapter.expect(sunday.toString()).toBe(localeEN.Sunday);
      adapter.expect(sunday.toLocaleString()).toBe(localeEN.Sunday);
      adapter.expect(week.items[6].toString()).toBe(localeEN.Saturday);
      adapter.expect(week.items[6].toLocaleString()).toBe(localeEN.Saturday);
    });

    adapter.test('item.toStringTag should return a friendly name', () => {
      const week = Enum(StandardWeekConfig);
      week.items.forEach((item) => {
        adapter.expect(Object.prototype.toString.call(item)).toBe('[object EnumItem]');
      });
    });

    adapter.test('item.valueOf should return the enum value', () => {
      const week = Enum(StandardWeekConfig);
      const sunday = week.items[0];
      adapter.expect(sunday.valueOf()).toBe(0);
      adapter.expect(week.items[6].valueOf()).toBe(6);
    });

    adapter.test('item.toPrimitive should be auto converted to a correct primitive type', () => {
      const week = Enum(StandardWeekConfig);
      const sunday = week.items[0];
      const monday = week.items[1];
      const tuesday = week.items[2];
      const friday = week.items[5];
      const saturday = week.items[6];
      adapter.expect(Number(sunday)).toBe(0);
      adapter.expect(String(sunday)).toBe(localeEN.Sunday);
      // adapter.expect(Boolean(sunday)).toBe(false);
      // adapter.expect(Boolean(monday)).toBe(true);

      adapter.expect(saturday > friday).toBeTruthy();
      adapter.expect(monday < tuesday).toBeTruthy();
      // @ts-expect-error: because should be compatible with number
      // eslint-disable-next-line eqeqeq
      adapter.expect(monday == 1).toBeTruthy();
      // @ts-expect-error: because should be compatible with number
      adapter.expect(monday !== 2).toBeTruthy();
      // @ts-expect-error: because should be compatible with number
      // eslint-disable-next-line eqeqeq
      adapter.expect(monday != 2).toBeTruthy();
      // @ts-expect-error: because should be compatible with number
      adapter.expect(monday + 1).toBe(2);
      // @ts-expect-error: because should be compatible with number
      adapter.expect(friday - 1).toBe(4);

      adapter.expect('' + sunday).toBe('0');
      adapter.expect('' + saturday).toEqual('6');

      adapter.expect(`${sunday}`).toBe(localeEN.Sunday);
      adapter.expect(`${saturday}`).toBe(localeEN.Saturday);
      adapter.expect(saturday.toString()).toBe(localeEN.Saturday);
      adapter.expect(monday.toLocaleString()).toBe(localeEN.Monday);
      adapter.expect(typeof monday).toBe('object');

      adapter.expect(+sunday).toBe(0);
      adapter.expect(+saturday).toBe(6);
    });

    // should be readonly
    adapter.test('Should be readonly', () => {
      const week = Enum(StandardWeekConfig);
      const modifyValue = 'SHOULD NOT BE MODIFIED';
      const sunday = week.items[0];

      /* ----------------- set ----------------- */
      // @ts-expect-error: because try to modify the property forcefully
      sunday.key = modifyValue;
      adapter.expect(sunday.key).toBe('Sunday');
      // @ts-expect-error: because try to modify the property forcefully
      sunday.value = modifyValue;
      adapter.expect(sunday.value).toBe(0);
      // @ts-expect-error: because try to modify the property forcefully
      sunday.label = modifyValue;
      adapter.expect(sunday.label).toBe(localeEN.Sunday);
      // @ts-expect-error: because try to modify the property forcefully
      sunday.raw = modifyValue;
      adapter.expect(sunday.raw).toEqual(StandardWeekConfig.Sunday);

      /* ----------------- delete ----------------- */
      // @ts-expect-error: because try to delete the property forcefully
      delete sunday.key;
      adapter.expect(sunday.key).toBe('Sunday');
      // @ts-expect-error: because try to delete the property forcefully
      delete sunday.value;
      adapter.expect(sunday.value).toBe(0);
      // @ts-expect-error: because try to delete the property forcefully
      delete sunday.label;
      adapter.expect(sunday.label).toBe(localeEN.Sunday);
      // @ts-expect-error: because try to delete the property forcefully
      delete sunday.raw;
      adapter.expect(sunday.raw).toEqual(StandardWeekConfig.Sunday);

      /* ----------------- defineProperty ----------------- */
      Object.defineProperty(sunday, 'sayHello', { value: () => modifyValue });
      adapter.expect((sunday as unknown as { readonly sayHello: string }).sayHello).toBe(undefined);

      /* ----------------- defineProperties ----------------- */
      Object.defineProperties(sunday, {
        sayHello: { value: () => modifyValue },
        sayHi: { value: () => modifyValue },
      });
      adapter.expect((sunday as unknown as { readonly sayHello: string }).sayHello).toBe(undefined);

      /* ----------------- setPrototypeOf ----------------- */
      Object.setPrototypeOf(sunday, { sayHello: () => modifyValue });
      adapter.expect((sunday as unknown as { readonly sayHello: string }).sayHello).toBe(undefined);

      // adapter.expect(Object.isExtensible(sunday)).toBe(false);
      adapter.expect(Object.isSealed(sunday)).toBe(false);
      adapter.expect(Object.isFrozen(sunday)).toBe(false);
    });
  });
};

export default testEnumItem;
