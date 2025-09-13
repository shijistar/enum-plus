// eslint-disable-next-line import/no-unresolved
import { localizeConfigData, noLocale, StandardWeekConfig } from '@enum-plus/test/data/week-config';
import type TestEngineBase from '@enum-plus/test/engines/base';
// eslint-disable-next-line import/no-unresolved
import { copyList, pickArray } from '@enum-plus/test/utils';
import { changeLanguage } from 'i18next';
// import filterItemPlugin from '../../src/filterItem';
import rootPlugin from '../../src/index';

const testEnumItems = (engine: TestEngineBase) => {
  engine.describe('The filterItem plugin', () => {
    engine.test(
      'should filter out enum items by label',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN } }) => {
        Enum.install(rootPlugin);
        const weekEnum = Enum(StandardWeekConfig);
        const findBy_Mon = weekEnum.items.filter((item) => weekEnum.filterItem('Mon', item));
        const findBy_mon = weekEnum.items.filter((item) => weekEnum.filterItem('mon', item));
        const findBy_Mon_CaseSensitive = weekEnum.items.filter((item) => weekEnum.filterItemCaseSensitive('Mon', item));
        const findBy_mon_CaseSensitive = weekEnum.items.filter((item) => weekEnum.filterItemCaseSensitive('mon', item));
        const findBy_Day = weekEnum.items.filter((item) => weekEnum.filterItem('Day', item));
        const findBy_day = weekEnum.items.filter((item) => weekEnum.filterItem('day', item));
        const findByEmpty = weekEnum.items.filter((item) => weekEnum.filterItem('', item));
        const findByOjbect = weekEnum.items.filter((item) => weekEnum.filterItem({} as unknown as string, item));
        const findByUndefined = weekEnum.items.filter((item) => weekEnum.filterItem(undefined, item));
        const findByUndefinedCaseSensitive = weekEnum.items.filter((item) =>
          weekEnum.filterItemCaseSensitive(undefined, item)
        );
        const findBoolean_true = [true, false].filter((item) => weekEnum.filterItem('true', item));
        const findNumber_2 = [0, 1, 2, 3, 10, 11, 12].filter((item) => weekEnum.filterItem('2', item));
        const findBigInt_2 = [BigInt(0), BigInt(1), BigInt(2), BigInt(3), BigInt(10), BigInt(11), BigInt(12)].filter(
          (item) => weekEnum.filterItem('2', item)
        );
        const findString_Mon = ['Mon', 'mon', 'Monday', 'monday', 'Tuesday'].filter((item) =>
          weekEnum.filterItem('Mon', item)
        );
        const findString_Mon_CaseSensitive = ['Mon', 'mon', 'Monday', 'monday', 'Tuesday'].filter((item) =>
          weekEnum.filterItemCaseSensitive('Mon', item)
        );
        const findRegExp_Mon = [/Mon/, /mon/, /Monday/, /monday/, /Tuesday/].filter((item) =>
          weekEnum.filterItem('Mon', item)
        );
        const findRegExp_Mon_CaseSensitive = [/Mon/, /mon/, /Monday/, /monday/, /Tuesday/].filter((item) =>
          weekEnum.filterItemCaseSensitive('Mon', item)
        );
        const findDate_2020_01_02 = [
          new Date('2020-01-01'),
          new Date('2020-01-02'),
          new Date('2020-01-03'),
          new Date('2020-01-04'),
        ].filter((item) => weekEnum.filterItem('2020-01-02', item));
        const findSymbol_Mon = [
          Symbol.for('Mon'),
          Symbol.for('mon'),
          Symbol.for('Monday'),
          Symbol.for('Tuesday'),
        ].filter((item) => weekEnum.filterItem('Mon', item));
        const findSymbol_Mon_CaseSensitive = [
          Symbol.for('Mon'),
          Symbol.for('mon'),
          Symbol.for('Monday'),
          Symbol.for('Tuesday'),
        ].filter((item) => weekEnum.filterItemCaseSensitive('Mon', item));

        const weekWithBadItemEnum = Enum({ ...StandardWeekConfig, Bad: { value: 8 }, Terrible: undefined! });
        const badItems = weekWithBadItemEnum.items.filter((item) => weekWithBadItemEnum.filterItem('bad', item));
        const terribleItems = weekWithBadItemEnum.items.filter((item) =>
          weekWithBadItemEnum.filterItem('terrible', item)
        );

        return {
          locales: localeEN,
          findBy_Mon,
          findBy_mon,
          findBy_Mon_CaseSensitive,
          findBy_mon_CaseSensitive,
          findBy_Day,
          findBy_day,
          findByEmpty,
          findByOjbect,
          findByUndefined,
          findByUndefinedCaseSensitive,
          findBoolean_true,
          findNumber_2,
          findBigInt_2,
          findString_Mon,
          findString_Mon_CaseSensitive,
          findRegExp_Mon,
          findRegExp_Mon_CaseSensitive,
          findDate_2020_01_02,
          findSymbol_Mon,
          findSymbol_Mon_CaseSensitive,
          badItems,
          terribleItems,
        };
      },
      ({
        locales,
        findBy_Mon,
        findBy_mon,
        findBy_Mon_CaseSensitive,
        findBy_mon_CaseSensitive,
        findBy_Day,
        findBy_day,
        findByEmpty,
        findByOjbect,
        findByUndefined,
        findByUndefinedCaseSensitive,
        findBoolean_true,
        findNumber_2,
        findBigInt_2,
        findString_Mon,
        findString_Mon_CaseSensitive,
        findRegExp_Mon,
        findRegExp_Mon_CaseSensitive,
        findDate_2020_01_02,
        findSymbol_Mon,
        findSymbol_Mon_CaseSensitive,
        badItems,
        terribleItems,
      }) => {
        const monData = pickArray(
          Object.values(localizeConfigData(StandardWeekConfig, locales)).filter(({ label }) =>
            label.toUpperCase().includes('MON')
          ),
          ['value', 'label']
        );
        engine.expect(copyList(findBy_Mon)).toEqual(monData);
        engine.expect(copyList(findBy_mon)).toEqual(monData);
        const monData_CaseSensitive = pickArray(
          Object.values(localizeConfigData(StandardWeekConfig, locales)).filter(({ label }) => label.includes('Mon')),
          ['value', 'label']
        );
        engine.expect(copyList(findBy_Mon_CaseSensitive)).toEqual(monData_CaseSensitive);
        engine.expect(copyList(findBy_mon_CaseSensitive)).toEqual([]);
        const dayData = pickArray(
          Object.values(localizeConfigData(StandardWeekConfig, locales)).filter(({ label }) =>
            label.toUpperCase().includes('DAY')
          ),
          ['value', 'label']
        );
        engine.expect(copyList(findBy_Day)).toEqual(dayData);
        engine.expect(copyList(findBy_day)).toEqual(dayData);
        engine.expect(copyList(findByOjbect)).toEqual([]);
        const allData = pickArray(Object.values(localizeConfigData(StandardWeekConfig, locales)), ['value', 'label']);
        engine.expect(copyList(findByEmpty)).toEqual(allData);
        engine.expect(copyList(findByUndefined)).toEqual(allData);
        engine.expect(copyList(findByUndefinedCaseSensitive)).toEqual(allData);

        engine.expect(findBoolean_true).toEqual([true]);
        engine.expect(findNumber_2).toEqual([2, 12]);
        engine.expect(findBigInt_2).toEqual([BigInt(2), BigInt(12)]);
        engine.expect(findString_Mon).toEqual(['Mon', 'mon', 'Monday', 'monday']);
        engine.expect(findString_Mon_CaseSensitive).toEqual(['Mon', 'Monday']);
        engine.expect(findRegExp_Mon).toEqual([/Mon/, /mon/, /Monday/, /monday/]);
        engine.expect(findRegExp_Mon_CaseSensitive).toEqual([/Mon/, /Monday/]);
        engine.expect(findDate_2020_01_02).toEqual([new Date('2020-01-02')]);
        engine.expect(findSymbol_Mon).toEqual([Symbol.for('Mon'), Symbol.for('mon'), Symbol.for('Monday')]);
        engine.expect(findSymbol_Mon_CaseSensitive).toEqual([Symbol.for('Mon'), Symbol.for('Monday')]);

        engine
          .expect(
            Array.from(badItems).map((item) => ({
              value: item.value,
              key: item.key,
              label: item.label,
            }))
          )
          .toEqual([{ value: 8, key: 'Bad', label: 'Bad' }]);
        engine
          .expect(
            Array.from(terribleItems).map((item) => ({
              value: item.value,
              key: item.key,
              label: item.label,
            }))
          )
          .toEqual([{ value: 'Terrible', key: 'Terrible', label: 'Terrible' }]);
      }
    );

    engine.test(
      'should filter out plain objects by label',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
        Enum.install(rootPlugin);
        const weekEnum = Enum(StandardWeekConfig);
        const weekItems = [
          ...Object.values(StandardWeekConfig).map((item) => ({ value: item.value, label: item.label })),
        ];
        const findBy_Mon = weekItems.filter((item) => weekEnum.filterItem('Mon', item));
        const findBy_Mon_CaseSensitive = weekItems.filter((item) => weekEnum.filterItemCaseSensitive('Mon', item));

        return { findBy_Mon, findBy_Mon_CaseSensitive };
      },
      ({ findBy_Mon, findBy_Mon_CaseSensitive }) => {
        const monData = pickArray(
          Object.values(StandardWeekConfig).filter(({ label }) => label.toUpperCase().includes('MON')),
          ['value', 'label']
        );
        engine.expect(copyList(findBy_Mon)).toEqual(monData);
        const monData_CaseSensitive = pickArray(
          Object.values(StandardWeekConfig).filter(({ label }) => label.includes('Mon')),
          ['value', 'label']
        );
        engine.expect(copyList(findBy_Mon_CaseSensitive)).toEqual(monData_CaseSensitive);
      }
    );

    engine.test(
      'should filter out items by label in Chinese',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeCN } }) => {
        Enum.install(rootPlugin);
        changeLanguage('zh-CN');
        const weekEnum = Enum(StandardWeekConfig);
        const findBy_Mon = weekEnum.items.filter((item) => weekEnum.filterItem('一', item));
        const findBy_Mon_CaseSensitive = weekEnum.items.filter((item) => weekEnum.filterItemCaseSensitive('一', item));

        return { locales: localeCN, findBy_Mon, findBy_Mon_CaseSensitive };
      },
      ({ locales, findBy_Mon, findBy_Mon_CaseSensitive }) => {
        const monData = pickArray(
          Object.values(localizeConfigData(StandardWeekConfig, locales)).filter(({ label }) => label.includes('一')),
          ['value', 'label']
        );
        engine.expect(copyList(findBy_Mon)).toEqual(monData);
        engine.expect(copyList(findBy_Mon_CaseSensitive)).toEqual(monData);
      }
    );

    engine.test(
      'should be able to modify the search field by plugin options',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN } }) => {
        Enum.install(rootPlugin, {
          filterItem: { searchField: 'value' },
        });
        changeLanguage('en');
        const weekEnum = Enum(StandardWeekConfig);
        const findBy_2 = weekEnum.items.filter((item) => weekEnum.filterItem('2', item));
        const findBy_2_CaseSensitive = weekEnum.items.filter((item) => weekEnum.filterItemCaseSensitive('2', item));

        return { locales: localeEN, findBy_2, findBy_2_CaseSensitive };
      },
      ({ locales, findBy_2, findBy_2_CaseSensitive }) => {
        const tuesdayData = pickArray(
          Object.values(localizeConfigData(StandardWeekConfig, locales)).filter(({ value }) =>
            value.toString().toUpperCase().includes('2')
          ),
          ['value', 'label']
        );
        engine.expect(copyList(findBy_2)).toEqual(tuesdayData);
        engine.expect(copyList(findBy_2_CaseSensitive)).toEqual(tuesdayData);
      }
    );
    engine.test(
      'should allow searching by incompatible fields',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN } }) => {
        Enum.install(rootPlugin, {
          filterItem: { searchField: 'raw' },
        });
        changeLanguage('en');
        const weekEnum = Enum(StandardWeekConfig);
        const findByRaw = weekEnum.items.filter((item) => weekEnum.filterItem('Mon', item));
        const findByRawCaseSensitive = weekEnum.items.filter((item) => weekEnum.filterItemCaseSensitive('Mon', item));

        return { locales: localeEN, findByRaw, findByRawCaseSensitive };
      },
      ({ findByRaw, findByRawCaseSensitive }) => {
        engine.expect(copyList(findByRaw)).toEqual([]);
        engine.expect(copyList(findByRawCaseSensitive)).toEqual([]);
      }
    );
    engine.test(
      'should work when Enum.localize is null',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN } }) => {
        Enum.install(rootPlugin);
        Enum.localize = null!;
        const weekEnum = Enum({ ...StandardWeekConfig, Terrible: undefined! });
        const findByRaw = weekEnum.items.filter((item) => weekEnum.filterItem('Mon', item));
        const findByRawCaseSensitive = weekEnum.items.filter((item) => weekEnum.filterItemCaseSensitive('Mon', item));

        return { locales: noLocale, findByRaw, findByRawCaseSensitive };
      },
      ({ locales, findByRaw, findByRawCaseSensitive }) => {
        const monData = pickArray(
          Object.values(localizeConfigData(StandardWeekConfig, locales)).filter(({ label }) =>
            label.toUpperCase().includes('MON')
          ),
          ['value', 'label']
        );
        engine.expect(copyList(findByRaw)).toEqual(monData);
        engine.expect(copyList(findByRawCaseSensitive)).toEqual([]);
      }
    );
  });
};

export default testEnumItems;
