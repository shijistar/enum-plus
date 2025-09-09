import { defaultLocalize } from '@enum-plus';
import { getLocales, localizeConfigData, StandardWeekConfig } from '../../../../test/data/week-config';
import { getStandardWeekData } from '../../../../test/data/week-data';
import type TestEngineBase from '../../../../test/engines/base';
import { copyList, pickArray } from '../../../../test/utils/index';
import '../../src/index';

const testEnumItems = (engine: TestEngineBase) => {
  engine.describe('The EnumItemsArray api', () => {
    addEnumItemsTestSuite(engine);
  });
};

export function addEnumItemsTestSuite(engine: TestEngineBase) {
  engine.test(
    'enum.items.toList should generate an object array',
    ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, locales } }) => {
      const weekEnum = Enum(StandardWeekConfig);
      const defaultListItems = weekEnum.toSelect();
      // const defaultListItemsWithFirst = weekEnum.toSelect({
      //   firstOption: { label: 'All', value: '' },
      // });
      const customListItems = weekEnum.toSelect({
        valueField: 'id',
        labelField: 'name',
      });
      return { weekEnum, locales, defaultListItems, customListItems };
    },
    ({ weekEnum, locales, defaultListItems, customListItems }) => {
      engine.expect(copyList(defaultListItems)).toEqual(pickArray(getStandardWeekData(locales), ['value', 'label']));
      engine.expect(copyList(customListItems, 'id', 'name')).toEqual(
        pickArray(getStandardWeekData(locales), ['value', 'label']).map((item) => ({
          id: item.value,
          name: item.label,
        }))
      );

      // // Add first-option by boolean flag
      // const withDefaultFirstOption = weekEnum.toSelect({ firstOption: { label: 'All', value: '' } });
      // engine.expect(withDefaultFirstOption).toHaveLength(8);
      // engine.expect(withDefaultFirstOption[0]).toEqual({
      //   value: '',
      //   key: '',
      //   label: 'All',
      // });

      // // Add first-option by boolean flag with custom value
      // const customDefaultOption = weekEnum.toSelect({
      //   firstOption: true,
      //   firstOptionValue: 99 as 1,
      //   firstOptionLabel: 'Select All',
      // });
      // engine.expect(customDefaultOption).toHaveLength(8);
      // engine.expect(customDefaultOption[0]).toEqual({ value: 99, key: '', label: 'Select All' });

      // // Add custom first-option
      // const customOption = { value: 99, key: '99', label: 'WeekdayX' };
      // const withCustomFirstOption = weekEnum.toSelect({
      //   firstOption: customOption,
      // });
      // engine.expect(withCustomFirstOption[0]).toEqual(customOption);

      // // Add custom first-option using value as key
      // const customOptionWithoutKey = { value: 99, label: 'WeekdayX' };
      // const withCustomFirstOptionUsingValueAsKey = weekEnum.toSelect({
      //   firstOption: customOptionWithoutKey,
      // });
      // engine.expect(withCustomFirstOptionUsingValueAsKey[0]).toEqual({
      //   ...customOptionWithoutKey,
      //   key: customOptionWithoutKey.value,
      // });
    }
  );

  engine.test(
    'enum.items.toMenu should generate an object array for AntDesign Menu',
    ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
      const weekEnum = Enum(StandardWeekConfig);
      return { weekEnum };
    },
    ({ weekEnum }) => {
      engine.expect(Array.from(weekEnum.toMenu())).toEqual(
        Object.values(localizeConfigData(StandardWeekConfig, getLocales, defaultLocalize)).map(({ value, label }) => ({
          key: value,
          label: label,
        }))
      );
    }
  );

  engine.test(
    'enum.items.toFilter should generate an object array for AntDesign Table',
    ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
      const weekEnum = Enum(StandardWeekConfig);
      return { weekEnum };
    },
    ({ weekEnum }) => {
      engine.expect(Array.from(weekEnum.toFilter())).toEqual(
        Object.values(localizeConfigData(StandardWeekConfig, getLocales, defaultLocalize)).map(({ value, label }) => ({
          text: label,
          value,
        }))
      );
    }
  );

  engine.test(
    'enum.items.toValueMap should generate an object array for AntDesignPro',
    ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
      const weekEnum = Enum(StandardWeekConfig);
      return { weekEnum };
    },
    ({ weekEnum }) => {
      engine.expect(weekEnum.toValueMap()).toEqual(
        Object.values(localizeConfigData(StandardWeekConfig, getLocales, defaultLocalize)).reduce(
          (acc, { value, label }) => {
            acc[value] = { text: label };
            return acc;
          },
          {} as Record<number, { text: string }>
        )
      );
    }
  );
}

export default testEnumItems;
