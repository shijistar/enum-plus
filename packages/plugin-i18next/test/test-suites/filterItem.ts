import { defaultLocalize } from '@enum-plus';
import { getLocales, localizeConfigData, StandardWeekConfig } from '../../../../test/data/week-config';
import type TestEngineBase from '../../../../test/engines/base';
import { copyList, pickArray } from '../../../../test/utils';
import '../../src/index';

const testEnumItems = (engine: TestEngineBase) => {
  engine.describe('The filterItem plugin', () => {
    engine.test(
      'should filter out items by text',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
        const weekEnum = Enum(StandardWeekConfig);
        const findBy_Mon = weekEnum.items.filter((item) => weekEnum.filterItem('Mon', item));
        const findBy_mon = weekEnum.items.filter((item) => weekEnum.filterItem('mon', item));
        const findBy_Mon_CaseSensitive = weekEnum.items.filter((item) => weekEnum.filterItemCaseSensitive('Mon', item));
        const findBy_mon_CaseSensitive = weekEnum.items.filter((item) => weekEnum.filterItemCaseSensitive('mon', item));
        const findBy_Day = weekEnum.items.filter((item) => weekEnum.filterItem('Day', item));
        const findBy_day = weekEnum.items.filter((item) => weekEnum.filterItem('day', item));
        const findByEmpty = weekEnum.items.filter((item) => weekEnum.filterItem('', item));
        const findBoolean_true = [true, false].filter((item) => weekEnum.filterItem('true', item));
        const findNumber_2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((item) =>
          weekEnum.filterItem('2', item)
        );
        const findBigInt_2 = [
          BigInt(0),
          BigInt(1),
          BigInt(2),
          BigInt(3),
          BigInt(4),
          BigInt(5),
          BigInt(6),
          BigInt(7),
          BigInt(8),
          BigInt(9),
          BigInt(10),
          BigInt(11),
          BigInt(12),
        ].filter((item) => weekEnum.filterItem('2', item));
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

        return {
          findBy_Mon,
          findBy_mon,
          findBy_Mon_CaseSensitive,
          findBy_mon_CaseSensitive,
          findBy_Day,
          findBy_day,
          findByEmpty,
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
        };
      },
      ({
        findBy_Mon,
        findBy_mon,
        findBy_Mon_CaseSensitive,
        findBy_mon_CaseSensitive,
        findBy_Day,
        findBy_day,
        findByEmpty,
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
      }) => {
        const monData = pickArray(
          Object.values(localizeConfigData(StandardWeekConfig, getLocales, defaultLocalize)).filter(({ label }) =>
            label.toUpperCase().includes('MON')
          ),
          ['value', 'label']
        );
        engine.expect(copyList(findBy_Mon)).toEqual(monData);
        engine.expect(copyList(findBy_mon)).toEqual(monData);
        const monData_CaseSensitive = pickArray(
          Object.values(localizeConfigData(StandardWeekConfig, getLocales, defaultLocalize)).filter(({ label }) =>
            label.includes('Mon')
          ),
          ['value', 'label']
        );
        engine.expect(copyList(findBy_Mon_CaseSensitive)).toEqual(monData_CaseSensitive);
        engine.expect(copyList(findBy_mon_CaseSensitive)).toEqual([]);
        const dayData = pickArray(
          Object.values(localizeConfigData(StandardWeekConfig, getLocales, defaultLocalize)).filter(({ label }) =>
            label.toUpperCase().includes('DAY')
          ),
          ['value', 'label']
        );
        engine.expect(copyList(findBy_Day)).toEqual(dayData);
        engine.expect(copyList(findBy_day)).toEqual(dayData);
        const allData = pickArray(Object.values(localizeConfigData(StandardWeekConfig, getLocales, defaultLocalize)), [
          'value',
          'label',
        ]);
        engine.expect(copyList(findByEmpty)).toEqual(allData);

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
      }
    );
  });
};

export default testEnumItems;
