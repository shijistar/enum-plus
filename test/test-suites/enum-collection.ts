import { type Enum as EnumType, ITEMS, KEYS } from '@enum-plus';
import type TestAdapterBase from 'test/adapter-one/base';
import { locales, sillyLocalize, StandardWeekConfig } from '../data/week-config';
import { getStandardWeekData } from '../data/week-data';
import { toPlainEnums } from '../utils';
import { addEnumValuesTestSuite } from './enum-values';

const testEnumCollection = (adapter: TestAdapterBase, Enum: typeof EnumType) => {
  adapter.describe('The EnumCollectionClass api', () => {
    addEnumValuesTestSuite(adapter, Enum(StandardWeekConfig));

    adapter.test('enums.keys should return all enum keys', () => {
      const week = Enum(StandardWeekConfig);
      adapter.expect(week.keys).toEqual(Object.keys(StandardWeekConfig));
    });

    adapter.test('enums.items should return an array of enum items', () => {
      const week = Enum(StandardWeekConfig);
      adapter.expect(Array.isArray(week.items)).toBeTruthy();
      adapter.expect(toPlainEnums(week.items)).toEqual(getStandardWeekData(locales));
    });

    adapter.test('the methods should be same as EnumValuesArray', () => {
      const week = Enum(StandardWeekConfig);
      adapter.expect(week.label(1)).toBe(week.items.label(1));
      adapter.expect(week.key(1)).toBe(week.items.key(1));
      adapter.expect(week.has(1)).toBe(week.items.has(1));
      adapter.expect(week.raw()).toBe(week.items.raw());
      adapter.expect(week.toSelect()).toEqual(week.items.toSelect());
      adapter.expect(week.toMenu()).toEqual(week.items.toMenu());
      adapter.expect(week.toFilter()).toEqual(week.items.toFilter());
      adapter.expect(week.toValueMap()).toEqual(week.items.toValueMap());
    });

    adapter.test(
      'enums.keys and enums.items should be auto renamed to fallback names once they are conflicted with Enum keys',
      () => {
        const strangeEnumConfig = {
          label: { value: 1, label: 'label' },
          key: { value: 2, label: 'key' },
          has: { value: 3, label: 'has' },
          toSelect: { value: 4, label: 'toSelect' },
          toValueMap: { value: 5, label: 'toValueMap' },
          toFilter: { value: 6, label: 'toFilter' },
          toMenu: { value: 7, label: 'toMenu' },
          raw: { value: 99, label: 'raw' },
          keys: { value: 101, label: 'foo' },
        } as const;
        const strangeEnum = Enum(strangeEnumConfig);
        adapter.expect(strangeEnum.label).toBe(1);
        adapter.expect(strangeEnum.items.label(1)).toBe('label');
        adapter.expect(strangeEnum.key).toBe(2);
        adapter.expect(strangeEnum.items.key(2)).toBe('key');
        adapter.expect(strangeEnum.has).toBe(3);
        adapter.expect(strangeEnum.items.has(3)).toBe(true);
        adapter.expect(strangeEnum.toSelect).toBe(4);
        adapter.expect(strangeEnum.items.toSelect()).toHaveLength(Object.keys(strangeEnumConfig).length);
        adapter.expect(strangeEnum.toFilter).toBe(6);
        adapter.expect(strangeEnum.items.toFilter()).toHaveLength(Object.keys(strangeEnumConfig).length);
        adapter.expect(strangeEnum.toMenu).toBe(7);
        adapter.expect(strangeEnum.items.toMenu()).toHaveLength(Object.keys(strangeEnumConfig).length);
        adapter.expect(strangeEnum.toValueMap).toBe(5);
        adapter
          .expect(Object.keys(strangeEnum.items.toValueMap()))
          .toEqual(
            Object.keys(strangeEnumConfig).map((key) =>
              strangeEnumConfig[key as keyof typeof strangeEnumConfig].value.toString()
            )
          );
        adapter.expect(strangeEnum.keys).toBe(101);
        adapter.expect(strangeEnum.items.map((i) => i.key)).toEqual(Object.keys(strangeEnumConfig));

        const strangerEnumConfig = {
          ...strangeEnumConfig,
          items: { value: 101, label: 'bar' },
          values: { value: 102, label: 'baz' },
        } as const;
        const strangerEnum = Enum(strangerEnumConfig);
        adapter.expect(strangerEnum.items).toBe(101);
        adapter.expect(strangerEnum.values).toBe(102);
        adapter.expect(strangerEnum[KEYS]).toEqual(Object.keys(strangerEnumConfig));
        const standardEnumItems = Object.keys(strangerEnumConfig).map((key) => ({
          key,
          value: strangerEnumConfig[key as keyof typeof strangerEnumConfig].value,
          label: strangerEnumConfig[key as keyof typeof strangerEnumConfig].label,
        }));
        adapter.expect(Array.isArray(strangerEnum[ITEMS])).toBeTruthy();
        adapter.expect(toPlainEnums(strangerEnum[ITEMS])).toEqual(standardEnumItems);
      }
    );

    adapter.test('enums.toString should return a friendly name', () => {
      const week = Enum(StandardWeekConfig);
      adapter.expect(week.toString()).toBe('[object EnumCollection]');
      adapter.expect(Object.prototype.toString.call(week)).toBe('[object EnumCollection]');
    });

    adapter.test('enums.value/enums.key/enums.label should be applicable to "instanceof" operator', () => {
      const week = Enum(StandardWeekConfig);
      adapter.expect((0 as unknown) instanceof (week as unknown as () => void)).toBeTruthy();
      adapter.expect(('Sunday' as unknown) instanceof (week as unknown as () => void)).toBeTruthy();
      adapter
        .expect((sillyLocalize?.('weekday.sunday') as unknown) instanceof (week as unknown as () => void))
        .toBeTruthy();
      adapter.expect((6 as unknown) instanceof (week as unknown as () => void)).toBeTruthy();
      adapter.expect(('Saturday' as unknown) instanceof (week as unknown as () => void)).toBeTruthy();
      adapter
        .expect((sillyLocalize?.('weekday.saturday') as unknown) instanceof (week as unknown as () => void))
        .toBeTruthy();
      adapter.expect((7 as unknown) instanceof (week as unknown as () => void)).toBeFalsy();
      adapter.expect(('[Not Exists]' as unknown) instanceof (week as unknown as () => void)).toBeFalsy();
    });
  });
};

export default testEnumCollection;
