import type { PluginFunc } from '@enum-plus';
// eslint-disable-next-line import/no-unresolved
import { localizeConfigData, StandardWeekConfig } from '@enum-plus/test/data/week-config';
import type TestEngineBase from '@enum-plus/test/engines/base';
// eslint-disable-next-line import/no-unresolved
import { copyList, pickArray } from '@enum-plus/test/utils';
import { changeLanguage } from 'i18next';
import type { I18nextPluginOptions } from '../../src';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const testIsMatch = <P extends PluginFunc<any>>(engine: TestEngineBase<'jest'>, options: { plugin: P }) => {
  engine.describe('The isMatch plugin', () => {
    engine.test(
      'should filter out enum items by label',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN } }) => {
        Enum.install(options.plugin);
        const weekEnum = Enum(StandardWeekConfig);
        const findBy_Mon = weekEnum.items.filter((item) => weekEnum.isMatch('Mon', item));
        const findBy_mon = weekEnum.items.filter((item) => weekEnum.isMatch('mon', item));
        const findBy_Mon_CaseSensitive = weekEnum.items.filter((item) => weekEnum.isMatchCaseSensitive('Mon', item));
        const findBy_mon_CaseSensitive = weekEnum.items.filter((item) => weekEnum.isMatchCaseSensitive('mon', item));
        const findBy_Day = weekEnum.items.filter((item) => weekEnum.isMatch('Day', item));
        const findBy_day = weekEnum.items.filter((item) => weekEnum.isMatch('day', item));
        const findByEmpty = weekEnum.items.filter((item) => weekEnum.isMatch('', item));
        const findByObject = weekEnum.items.filter((item) => weekEnum.isMatch({} as unknown as string, item));
        const findByUndefined = weekEnum.items.filter((item) => weekEnum.isMatch(undefined, item));
        const findByUndefinedCaseSensitive = weekEnum.items.filter((item) =>
          weekEnum.isMatchCaseSensitive(undefined, item)
        );
        const findBoolean_true = [true, false].filter((item) => weekEnum.isMatch('true', item));
        const findNumber_2 = [0, 1, 2, 3, 10, 11, 12].filter((item) => weekEnum.isMatch('2', item));
        const findBigInt_2 = [BigInt(0), BigInt(1), BigInt(2), BigInt(3), BigInt(10), BigInt(11), BigInt(12)].filter(
          (item) => weekEnum.isMatch('2', item)
        );
        const findString_Mon = ['Mon', 'mon', 'Monday', 'monday', 'Tuesday'].filter((item) =>
          weekEnum.isMatch('Mon', item)
        );
        const findString_Mon_CaseSensitive = ['Mon', 'mon', 'Monday', 'monday', 'Tuesday'].filter((item) =>
          weekEnum.isMatchCaseSensitive('Mon', item)
        );
        const findRegExp_Mon = [/Mon/, /mon/, /Monday/, /monday/, /Tuesday/].filter((item) =>
          weekEnum.isMatch('Mon', item)
        );
        const findRegExp_Mon_CaseSensitive = [/Mon/, /mon/, /Monday/, /monday/, /Tuesday/].filter((item) =>
          weekEnum.isMatchCaseSensitive('Mon', item)
        );
        const findDate_2020_01_02 = [
          new Date('2020-01-01'),
          new Date('2020-01-02'),
          new Date('2020-01-03'),
          new Date('2020-01-04'),
        ].filter((item) => weekEnum.isMatch('2020-01-02', item));
        const findSymbol_Mon = [
          Symbol.for('Mon'),
          Symbol.for('mon'),
          Symbol.for('Monday'),
          Symbol.for('Tuesday'),
        ].filter((item) => weekEnum.isMatch('Mon', item));
        const findSymbol_Mon_CaseSensitive = [
          Symbol.for('Mon'),
          Symbol.for('mon'),
          Symbol.for('Monday'),
          Symbol.for('Tuesday'),
        ].filter((item) => weekEnum.isMatchCaseSensitive('Mon', item));

        const weekWithBadItemEnum = Enum({ ...StandardWeekConfig, Bad: { value: 8 }, Terrible: undefined! });
        const badItems = weekWithBadItemEnum.items.filter((item) => weekWithBadItemEnum.isMatch('bad', item));
        const terribleItems = weekWithBadItemEnum.items.filter((item) => weekWithBadItemEnum.isMatch('terrible', item));

        return {
          locales: localeEN,
          findBy_Mon,
          findBy_mon,
          findBy_Mon_CaseSensitive,
          findBy_mon_CaseSensitive,
          findBy_Day,
          findBy_day,
          findByEmpty,
          findByObject,
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
        findByObject,
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
        const localizedStandardWeekConfig = localizeConfigData(StandardWeekConfig, locales);
        const monData = pickArray(
          Object.keys(localizedStandardWeekConfig)
            .map((k) => ({
              ...localizedStandardWeekConfig[k as keyof typeof localizedStandardWeekConfig],
              key: k,
            }))
            .filter(({ label }) => label.toUpperCase().includes('MON')),
          ['value', 'key']
        );
        engine.expect(copyList(findBy_Mon, 'value', 'key')).toEqual(monData);
        engine.expect(copyList(findBy_mon, 'value', 'key')).toEqual(monData);
        const monData_CaseSensitive = pickArray(
          Object.keys(localizedStandardWeekConfig)
            .map((k) => ({
              ...localizedStandardWeekConfig[k as keyof typeof localizedStandardWeekConfig],
              key: k,
            }))
            .filter(({ label }) => label.includes('Mon')),
          ['value', 'key']
        );
        engine.expect(copyList(findBy_Mon_CaseSensitive, 'value', 'key')).toEqual(monData_CaseSensitive);
        engine.expect(copyList(findBy_mon_CaseSensitive, 'value', 'key')).toEqual([]);
        const dayData = pickArray(
          Object.keys(localizedStandardWeekConfig)
            .map((k) => ({
              ...localizedStandardWeekConfig[k as keyof typeof localizedStandardWeekConfig],
              key: k,
            }))
            .filter(({ label }) => label.toUpperCase().includes('DAY')),
          ['value', 'key']
        );
        engine.expect(copyList(findBy_Day, 'value', 'key')).toEqual(dayData);
        engine.expect(copyList(findBy_day, 'value', 'key')).toEqual(dayData);
        engine.expect(copyList(findByObject, 'value', 'key')).toEqual([]);
        const allData = pickArray(
          Object.keys(localizedStandardWeekConfig).map((k) => ({
            ...localizedStandardWeekConfig[k as keyof typeof localizedStandardWeekConfig],
            key: k,
          })),
          ['value', 'key']
        );
        engine.expect(copyList(findByEmpty, 'value', 'key')).toEqual(allData);
        engine.expect(copyList(findByUndefined, 'value', 'key')).toEqual(allData);
        engine.expect(copyList(findByUndefinedCaseSensitive, 'value', 'key')).toEqual(allData);

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
            }))
          )
          .toEqual([{ value: 8, key: 'Bad' }]);
        engine
          .expect(
            Array.from(terribleItems).map((item) => ({
              value: item.value,
              key: item.key,
            }))
          )
          .toEqual([{ value: 'Terrible', key: 'Terrible' }]);
      }
    );

    engine.test(
      'should filter out plain objects by label',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
        Enum.install(options.plugin);
        const weekEnum = Enum(StandardWeekConfig);
        const weekItems = [
          ...Object.values(StandardWeekConfig).map((item) => ({ value: item.value, label: item.label })),
        ];
        const findBy_Mon = weekItems.filter((item) => weekEnum.isMatch('Mon', item));
        const findBy_Mon_CaseSensitive = weekItems.filter((item) => weekEnum.isMatchCaseSensitive('Mon', item));

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
        Enum.install(options.plugin);
        changeLanguage('zh-CN');
        const weekEnum = Enum(StandardWeekConfig);
        const findBy_Mon = weekEnum.items.filter((item) => weekEnum.isMatch('一', item));
        const findBy_Mon_CaseSensitive = weekEnum.items.filter((item) => weekEnum.isMatchCaseSensitive('一', item));

        return { locales: localeCN, findBy_Mon, findBy_Mon_CaseSensitive };
      },
      ({ locales, findBy_Mon, findBy_Mon_CaseSensitive }) => {
        const localizedStandardWeekConfig = localizeConfigData(StandardWeekConfig, locales);
        const monData = pickArray(
          Object.keys(localizedStandardWeekConfig)
            .map((k) => ({
              ...localizedStandardWeekConfig[k as keyof typeof localizedStandardWeekConfig],
              key: k,
            }))
            .filter(({ label }) => label.includes('一')),
          ['value', 'key']
        );
        engine.expect(copyList(findBy_Mon, 'value', 'key')).toEqual(monData);
        engine.expect(copyList(findBy_Mon_CaseSensitive, 'value', 'key')).toEqual(monData);
      }
    );

    engine.test(
      'should be able to modify the search field by plugin options',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN } }) => {
        Enum.install(options.plugin, {
          defaultSearchField: 'value',
        } satisfies I18nextPluginOptions);
        changeLanguage('en');
        const weekEnum = Enum(StandardWeekConfig);
        const findBy_2 = weekEnum.items.filter((item) => weekEnum.isMatch('2', item));
        const findBy_2_CaseSensitive = weekEnum.items.filter((item) => weekEnum.isMatchCaseSensitive('2', item));

        return { locales: localeEN, findBy_2, findBy_2_CaseSensitive };
      },
      ({ locales, findBy_2, findBy_2_CaseSensitive }) => {
        const localizedStandardWeekConfig = localizeConfigData(StandardWeekConfig, locales);
        const tuesdayData = pickArray(
          Object.keys(localizedStandardWeekConfig)
            .map((k) => ({
              ...localizedStandardWeekConfig[k as keyof typeof localizedStandardWeekConfig],
              key: k,
            }))
            .filter(({ value }) => value.toString().toUpperCase().includes('2')),
          ['value', 'key']
        );
        engine.expect(copyList(findBy_2, 'value', 'key')).toEqual(tuesdayData);
        engine.expect(copyList(findBy_2_CaseSensitive, 'value', 'key')).toEqual(tuesdayData);
      }
    );
    engine.test(
      'should allow searching by incompatible fields',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN } }) => {
        Enum.install(options.plugin, {
          defaultSearchField: 'raw',
        } satisfies I18nextPluginOptions);
        changeLanguage('en');
        const weekEnum = Enum(StandardWeekConfig);
        const findByRaw = weekEnum.items.filter((item) => weekEnum.isMatch('Mon', item));
        const findByRawCaseSensitive = weekEnum.items.filter((item) => weekEnum.isMatchCaseSensitive('Mon', item));

        return { locales: localeEN, findByRaw, findByRawCaseSensitive };
      },
      ({ findByRaw, findByRawCaseSensitive }) => {
        engine.expect(copyList(findByRaw)).toEqual([]);
        engine.expect(copyList(findByRawCaseSensitive)).toEqual([]);
      }
    );
    engine.test(
      'should respect the options.translate function if provided',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, localeEN, noLocale } }) => {
        Enum.install(options.plugin);
        changeLanguage('en');
        const weekEnum = Enum(StandardWeekConfig);
        const switchMondayTuesday = (key: string | undefined) => {
          const localeKey = Object.keys(noLocale).find((k) => noLocale[k as keyof typeof noLocale] === key);
          if (key === 'weekday.monday') return localeEN.Tuesday;
          else if (key === 'weekday.tuesday') return localeEN.Monday;
          else return localeEN[localeKey as keyof typeof localeEN];
        };
        const matchTue = weekEnum.items.filter((item) =>
          weekEnum.isMatch('mon', item, {
            translate: switchMondayTuesday,
          })
        );
        const matchTueCaseSensitive = weekEnum.items.filter((item) =>
          weekEnum.isMatchCaseSensitive('mon', item, {
            translate: switchMondayTuesday,
          })
        );

        return { locales: localeEN, matchTue, matchTueCaseSensitive };
      },
      ({ locales, matchTue, matchTueCaseSensitive }) => {
        const localizedStandardWeekConfig = localizeConfigData(StandardWeekConfig, locales);
        const tuesdayData = pickArray(
          Object.keys(localizedStandardWeekConfig)
            .map((k) => ({
              ...localizedStandardWeekConfig[k as keyof typeof localizedStandardWeekConfig],
              key: k,
            }))
            .filter(({ label }) => label.toUpperCase().includes('TUE')),
          ['value', 'key']
        );
        engine.expect(copyList(matchTue, 'value', 'key')).toEqual(tuesdayData);
        engine.expect(copyList(matchTueCaseSensitive, 'value', 'key')).toEqual([]);
      }
    );
  });
};

export default testIsMatch;
