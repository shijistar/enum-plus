// eslint-disable-next-line import/no-unresolved
import { getStandardWeekData } from '@enum-plus/test/data/week-data';
import type TestEngineBase from '@enum-plus/test/engines/base';
// eslint-disable-next-line import/no-unresolved
import { copyList, pickArray } from '@enum-plus/test/utils/index';
import antdPlugin from '../../src/index';
import toSelectPlugin from '../../src/toSelect';

const testEnumItems = (engine: TestEngineBase<'jest'>) => {
  engine.describe('The toSelect plugin', () => {
    engine.test(
      'should generate an object array',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, locales } }) => {
        Enum.install(toSelectPlugin);
        const weekEnum = Enum(StandardWeekConfig);
        const defaultListItems = weekEnum.toSelect();
        const defaultListItemsWithFirst1 = weekEnum.toSelect({
          firstOption: { label: 'All', value: undefined },
        });
        const defaultListItemsWithFirst2 = weekEnum.toSelect({
          firstOption: { label: '全部', value: 0 },
        });
        const customListItems = weekEnum.toSelect({
          valueField: 'id',
          labelField: 'name',
        });
        const customListItemsUsingFunc = weekEnum.toSelect({
          valueField: () => 'id',
          labelField: () => 'name',
        });
        const customListItemsUsingFunc2 = weekEnum.toSelect({
          valueField: (item) => `id_${item?.value}`,
          labelField: (item) => `name_${item?.key}`,
        });
        return {
          locales,
          defaultListItems,
          defaultListItemsWithFirst1,
          defaultListItemsWithFirst2,
          customListItems,
          customListItemsUsingFunc,
          customListItemsUsingFunc2,
        };
      },
      ({
        locales,
        defaultListItems,
        defaultListItemsWithFirst1,
        defaultListItemsWithFirst2,
        customListItems,
        customListItemsUsingFunc,
        customListItemsUsingFunc2,
      }) => {
        engine.expect(copyList(defaultListItems)).toEqual(pickArray(getStandardWeekData(locales), ['value', 'label']));
        engine.expect(defaultListItemsWithFirst1).toEqual([
          {
            value: undefined,
            label: 'All',
          },
          ...pickArray(getStandardWeekData(locales), ['value', 'label']),
        ]);
        engine.expect(defaultListItemsWithFirst2).toEqual([
          {
            value: 0,
            label: '全部',
          },
          ...pickArray(getStandardWeekData(locales), ['value', 'label']),
        ]);
        const defaultItemsData = pickArray(getStandardWeekData(locales), ['value', 'label']).map((item) => ({
          id: item.value,
          name: item.label,
        }));
        engine.expect(copyList(customListItems, 'id', 'name')).toEqual(defaultItemsData);
        engine.expect(copyList(customListItemsUsingFunc, 'id', 'name')).toEqual(defaultItemsData);
        engine.expect(customListItemsUsingFunc2).toEqual(
          getStandardWeekData(locales).map((item) => ({
            [`id_${item.value}`]: item.value,
            [`name_${item.key}`]: item.label,
          }))
        );
      }
    );
  });

  engine.test(
    'should accept plugin options',
    ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, locales } }) => {
      Enum.install(toSelectPlugin, {
        valueField: 'id',
        labelField: 'name',
      });
      Enum.install(antdPlugin, {
        toSelect: { valueField: 'id', labelField: 'name' },
      });
      const weekEnum = Enum(StandardWeekConfig);
      const defaultListItems = weekEnum.toSelect();

      return { locales, defaultListItems };
    },
    ({ defaultListItems, locales }) => {
      const defaultItemsData = pickArray(getStandardWeekData(locales), ['value', 'label']).map((item) => ({
        id: item.value,
        name: item.label,
      }));
      engine.expect(defaultListItems).toEqual(defaultItemsData);
    }
  );
  engine.test(
    'should be able to set plugin options by root plugin',
    ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig, locales } }) => {
      Enum.install(antdPlugin, {
        toSelect: { valueField: 'id', labelField: 'name' },
      });
      const weekEnum = Enum(StandardWeekConfig);
      const defaultListItems = weekEnum.toSelect();

      return { locales, defaultListItems };
    },
    ({ defaultListItems, locales }) => {
      const defaultItemsData = pickArray(getStandardWeekData(locales), ['value', 'label']).map((item) => ({
        id: item.value,
        name: item.label,
      }));
      engine.expect(defaultListItems).toEqual(defaultItemsData);
    }
  );
};

export default testEnumItems;
