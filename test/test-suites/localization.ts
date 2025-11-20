import type { EnumItemClass, IEnum, ListItem } from '@enum-plus';
import type { MapResult } from '@enum-plus/enum-items';
import type {
  FuncLabelStandardWeekConfig,
  localeCN,
  localeEN,
  noLocale,
  ShortLabelStandardWeekConfig,
  StandardWeekConfig,
  WeekValueOnlyConfig,
} from '../data/week-config';
import type { getStandardWeekData as getStandardWeekDataInterface } from '../data/week-data';
import type TestEngineBase from '../engines/base';
import { copyList, pickArray } from '../utils/index';

const testLocalization = (engine: TestEngineBase<'jest' | 'playwright'>) => {
  engine.describe('Enum localization', () => {
    engine.test(
      'Should have default localize method',
      ({ EnumPlus: { Enum, defaultLocalize }, WeekConfig: { getLocales, genSillyLocalizer } }) => {
        return { Enum, getLocales, defaultLocalize, genSillyLocalizer };
      },
      ({ Enum, defaultLocalize }) => {
        engine.expect(Enum.localize?.toString()).toBe(defaultLocalize.toString());
      }
    );

    engine.test(
      'Should show English by default',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, FuncLabelStandardWeekConfig, setLang, localeEN, getLocales },
        WeekData: { getStandardWeekData },
      }) => {
        setLang('en-US', Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig);
        const weekEnumFuncLabel = Enum(FuncLabelStandardWeekConfig);
        const defaultListItems = weekEnum.toList();
        const idNameListItems = weekEnum.toList({ valueField: 'id', labelField: 'name' });
        const defaultMap = weekEnum.toMap();
        const customMap = weekEnum.toMap({ keySelector: 'key', valueSelector: (item) => ({ label: item.label }) });
        return {
          weekEnum,
          weekEnumFuncLabel,
          localeEN,
          getStandardWeekData,
          defaultListItems,
          idNameListItems,
          defaultMap,
          customMap,
        };
      },
      ({
        weekEnum,
        weekEnumFuncLabel,
        localeEN,
        getStandardWeekData,
        defaultListItems,
        idNameListItems,
        defaultMap,
        customMap,
      }) => {
        assertEnum(weekEnum, localeEN, getStandardWeekData);
        assertEnum(weekEnumFuncLabel, localeEN, getStandardWeekData);
        assertListItems({ defaultListItems, idNameListItems, locales: localeEN, getStandardWeekData });
        assertMapItems({ defaultMap, customMap, locales: localeEN, getStandardWeekData });
      }
    );

    engine.test(
      'Should show Chinese after changing lang',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, FuncLabelStandardWeekConfig, setLang, localeCN, getLocales },
        WeekData: { getStandardWeekData },
      }) => {
        setLang('zh-CN', Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig);
        const weekEnumFuncLabel = Enum(FuncLabelStandardWeekConfig);
        const defaultListItems = weekEnum.toList();
        const idNameListItems = weekEnum.toList({ valueField: 'id', labelField: 'name' });
        const defaultMap = weekEnum.toMap();
        const customMap = weekEnum.toMap({ keySelector: 'key', valueSelector: (item) => ({ label: item.label }) });
        return {
          weekEnum,
          weekEnumFuncLabel,
          localeCN,
          getStandardWeekData,
          defaultListItems,
          idNameListItems,
          defaultMap,
          customMap,
        };
      },
      ({
        weekEnum,
        weekEnumFuncLabel,
        localeCN,
        getStandardWeekData,
        defaultListItems,
        idNameListItems,
        defaultMap,
        customMap,
      }) => {
        assertEnum(weekEnum, localeCN, getStandardWeekData);
        assertEnum(weekEnumFuncLabel, localeCN, getStandardWeekData);
        assertListItems({ defaultListItems, idNameListItems, locales: localeCN, getStandardWeekData });
        assertMapItems({ defaultMap, customMap, locales: localeCN, getStandardWeekData });
      }
    );

    engine.test(
      'Should show English after changing back',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, FuncLabelStandardWeekConfig, setLang, localeEN, getLocales },
        WeekData: { getStandardWeekData },
      }) => {
        setLang('en-US', Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig);
        const weekEnumFuncLabel = Enum(FuncLabelStandardWeekConfig);
        const defaultListItems = weekEnum.toList();
        const idNameListItems = weekEnum.toList({ valueField: 'id', labelField: 'name' });
        const defaultMap = weekEnum.toMap();
        const customMap = weekEnum.toMap({ keySelector: 'key', valueSelector: (item) => ({ label: item.label }) });
        return {
          weekEnum,
          weekEnumFuncLabel,
          localeEN,
          getStandardWeekData,
          defaultListItems,
          idNameListItems,
          defaultMap,
          customMap,
        };
      },
      ({
        weekEnum,
        weekEnumFuncLabel,
        localeEN,
        getStandardWeekData,
        defaultListItems,
        idNameListItems,
        defaultMap,
        customMap,
      }) => {
        assertEnum(weekEnum, localeEN, getStandardWeekData);
        assertEnum(weekEnumFuncLabel, localeEN, getStandardWeekData);
        assertListItems({ defaultListItems, idNameListItems, locales: localeEN, getStandardWeekData });
        assertMapItems({ defaultMap, customMap, locales: localeEN, getStandardWeekData });
      }
    );

    engine.test(
      'Should show original label if no localization found',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, FuncLabelStandardWeekConfig, setLang, noLocale, getLocales },
        WeekData: { getStandardWeekData },
      }) => {
        setLang(undefined, Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig);
        const weekEnumFuncLabel = Enum(FuncLabelStandardWeekConfig);
        const defaultListItems = weekEnum.toList();
        const idNameListItems = weekEnum.toList({ valueField: 'id', labelField: 'name' });
        const defaultMap = weekEnum.toMap();
        const customMap = weekEnum.toMap({ keySelector: 'key', valueSelector: (item) => ({ label: item.label }) });
        return {
          weekEnum,
          weekEnumFuncLabel,
          defaultLocalize,
          noLocale,
          getStandardWeekData,
          defaultListItems,
          idNameListItems,
          defaultMap,
          customMap,
        };
      },
      ({
        weekEnum,
        weekEnumFuncLabel,
        noLocale,
        getStandardWeekData,
        defaultListItems,
        idNameListItems,
        defaultMap,
        customMap,
      }) => {
        assertEnum(weekEnum, noLocale, getStandardWeekData);
        assertEnum(weekEnumFuncLabel, noLocale, getStandardWeekData);
        assertListItems({ defaultListItems, idNameListItems, locales: noLocale, getStandardWeekData });
        assertMapItems({ defaultMap, customMap, locales: noLocale, getStandardWeekData });
      }
    );

    engine.test(
      'Should show original label if Enum.localize is explicitly set to undefined ',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, FuncLabelStandardWeekConfig, setLang, noLocale, getLocales },
        WeekData: { getStandardWeekData },
      }) => {
        setLang(undefined, Enum, getLocales, defaultLocalize);
        Enum.localize = undefined!;
        const weekEnum = Enum(StandardWeekConfig);
        const weekEnumFuncLabel = Enum(FuncLabelStandardWeekConfig);
        const defaultListItems = weekEnum.toList();
        const idNameListItems = weekEnum.toList({ valueField: 'id', labelField: 'name' });
        const defaultMap = weekEnum.toMap();
        const customMap = weekEnum.toMap({ keySelector: 'key', valueSelector: (item) => ({ label: item.label }) });
        return {
          weekEnum,
          weekEnumFuncLabel,
          noLocale,
          getStandardWeekData,
          defaultListItems,
          idNameListItems,
          defaultMap,
          customMap,
        };
      },
      ({
        weekEnum,
        weekEnumFuncLabel,
        noLocale,
        getStandardWeekData,
        defaultListItems,
        idNameListItems,
        defaultMap,
        customMap,
      }) => {
        assertEnum(weekEnum, noLocale, getStandardWeekData);
        assertEnum(weekEnumFuncLabel, noLocale, getStandardWeekData);
        assertListItems({ defaultListItems, idNameListItems, locales: noLocale, getStandardWeekData });
        assertMapItems({ defaultMap, customMap, locales: noLocale, getStandardWeekData });
      }
    );

    engine.test(
      'Should respect Enum options over global setting (Chinese over English)',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: {
          StandardWeekConfig,
          FuncLabelStandardWeekConfig,
          setLang,
          localeCN,
          localeEN,
          getLocales,
          genSillyLocalizer,
        },
        WeekData: { getStandardWeekData },
      }) => {
        setLang('en-US', Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig, {
          localize: genSillyLocalizer('zh-CN', getLocales),
        });
        const weekEnumFuncLabel = Enum(FuncLabelStandardWeekConfig, {
          localize: genSillyLocalizer('zh-CN', getLocales),
        });
        const defaultListItems = weekEnum.toList();
        const idNameListItems = weekEnum.toList({ valueField: 'id', labelField: 'name' });
        const defaultMap = weekEnum.toMap();
        const customMap = weekEnum.toMap({ keySelector: 'key', valueSelector: (item) => ({ label: item.label }) });
        return {
          weekEnum,
          weekEnumFuncLabel,
          localeCN,
          localeEN,
          getStandardWeekData,
          defaultListItems,
          idNameListItems,
          defaultMap,
          customMap,
        };
      },
      ({
        weekEnum,
        weekEnumFuncLabel,
        localeCN,
        localeEN,
        getStandardWeekData,
        defaultListItems,
        idNameListItems,
        defaultMap,
        customMap,
      }) => {
        assertEnum(weekEnum, localeCN, getStandardWeekData);
        assertEnum(weekEnumFuncLabel, localeEN, getStandardWeekData);
        assertListItems({ defaultListItems, idNameListItems, locales: localeCN, getStandardWeekData });
        assertMapItems({ defaultMap, customMap, locales: localeCN, getStandardWeekData });
      }
    );
    engine.test(
      'Should respect Enum options over global setting (undefined over English)',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, FuncLabelStandardWeekConfig, setLang, localeEN, getLocales },
        WeekData: { getStandardWeekData },
      }) => {
        setLang('en-US', Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig, { localize: undefined });
        const weekEnumFuncLabel = Enum(FuncLabelStandardWeekConfig, { localize: undefined });
        const defaultListItems = weekEnum.toList();
        const idNameListItems = weekEnum.toList({ valueField: 'id', labelField: 'name' });
        const defaultMap = weekEnum.toMap();
        const customMap = weekEnum.toMap({ keySelector: 'key', valueSelector: (item) => ({ label: item.label }) });
        return {
          weekEnum,
          weekEnumFuncLabel,
          localeEN,
          getStandardWeekData,
          defaultListItems,
          idNameListItems,
          defaultMap,
          customMap,
        };
      },
      ({
        weekEnum,
        weekEnumFuncLabel,
        localeEN,
        getStandardWeekData,
        defaultListItems,
        idNameListItems,
        defaultMap,
        customMap,
      }) => {
        assertEnum(weekEnum, localeEN, getStandardWeekData);
        assertEnum(weekEnumFuncLabel, localeEN, getStandardWeekData);
        assertListItems({ defaultListItems, idNameListItems, locales: localeEN, getStandardWeekData });
        assertMapItems({ defaultMap, customMap, locales: localeEN, getStandardWeekData });
      }
    );
    engine.test(
      'Should respect Enum options over global setting (undefined over English), support delayed assign',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, FuncLabelStandardWeekConfig, setLang, localeEN, getLocales },
        WeekData: { getStandardWeekData },
      }) => {
        setLang(undefined, Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig, { localize: undefined });
        const weekEnumFuncLabel = Enum(FuncLabelStandardWeekConfig, { localize: undefined });
        setLang('en-US', Enum, getLocales, defaultLocalize);
        const defaultListItems = weekEnum.toList();
        const idNameListItems = weekEnum.toList({ valueField: 'id', labelField: 'name' });
        const defaultMap = weekEnum.toMap();
        const customMap = weekEnum.toMap({ keySelector: 'key', valueSelector: (item) => ({ label: item.label }) });
        return {
          Enum,
          weekEnum,
          weekEnumFuncLabel,
          localeEN,
          getStandardWeekData,
          defaultListItems,
          idNameListItems,
          defaultMap,
          customMap,
        };
      },
      ({
        weekEnum,
        weekEnumFuncLabel,
        localeEN,
        getStandardWeekData,
        defaultListItems,
        idNameListItems,
        defaultMap,
        customMap,
      }) => {
        assertEnum(weekEnum, localeEN, getStandardWeekData);
        assertEnum(weekEnumFuncLabel, localeEN, getStandardWeekData);
        assertListItems({ defaultListItems, idNameListItems, locales: localeEN, getStandardWeekData });
        assertMapItems({ defaultMap, customMap, locales: localeEN, getStandardWeekData });
      }
    );
    engine.test(
      'Should respect Enum options over global setting (Chinese over undefined)',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: {
          StandardWeekConfig,
          FuncLabelStandardWeekConfig,
          setLang,
          localeCN,
          noLocale,
          getLocales,
          genSillyLocalizer,
        },
        WeekData: { getStandardWeekData },
      }) => {
        setLang(undefined, Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig, {
          localize: genSillyLocalizer('zh-CN', getLocales),
        });
        const weekEnumFuncLabel = Enum(FuncLabelStandardWeekConfig, {
          localize: genSillyLocalizer('zh-CN', getLocales),
        });
        const defaultListItems = weekEnum.toList();
        const idNameListItems = weekEnum.toList({ valueField: 'id', labelField: 'name' });
        const defaultMap = weekEnum.toMap();
        const customMap = weekEnum.toMap({ keySelector: 'key', valueSelector: (item) => ({ label: item.label }) });
        return {
          weekEnum,
          weekEnumFuncLabel,
          localeCN,
          noLocale,
          getStandardWeekData,
          defaultListItems,
          idNameListItems,
          defaultMap,
          customMap,
        };
      },
      ({
        weekEnum,
        weekEnumFuncLabel,
        localeCN,
        noLocale,
        getStandardWeekData,
        defaultListItems,
        idNameListItems,
        defaultMap,
        customMap,
      }) => {
        assertEnum(weekEnum, localeCN, getStandardWeekData);
        assertEnum(weekEnumFuncLabel, noLocale, getStandardWeekData);
        assertListItems({ defaultListItems, idNameListItems, locales: localeCN, getStandardWeekData });
        assertMapItems({ defaultMap, customMap, locales: localeCN, getStandardWeekData });
      }
    );

    engine.test(
      'Should respect Enum options over global setting (both undefined)',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, noLocale, getLocales },
        WeekData: { getStandardWeekData },
      }) => {
        setLang(undefined, Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig, { localize: undefined });
        const defaultListItems = weekEnum.toList();
        const idNameListItems = weekEnum.toList({ valueField: 'id', labelField: 'name' });
        const defaultMap = weekEnum.toMap();
        const customMap = weekEnum.toMap({ keySelector: 'key', valueSelector: (item) => ({ label: item.label }) });
        return {
          weekEnum,
          defaultLocalize,
          noLocale,
          getStandardWeekData,
          defaultListItems,
          idNameListItems,
          defaultMap,
          customMap,
        };
      },
      ({ weekEnum, noLocale, getStandardWeekData, defaultListItems, idNameListItems, defaultMap, customMap }) => {
        assertEnum(weekEnum, noLocale, getStandardWeekData);
        assertListItems({ defaultListItems, idNameListItems, locales: noLocale, getStandardWeekData });
        assertMapItems({ defaultMap, customMap, locales: noLocale, getStandardWeekData });
      }
    );
    engine.test(
      'Should respect Enum options over global setting (both explicit undefined)',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, noLocale, getLocales },
        WeekData: { getStandardWeekData },
      }) => {
        setLang(undefined, Enum, getLocales, defaultLocalize);
        Enum.localize = undefined!;
        const weekEnum = Enum(StandardWeekConfig, { localize: undefined });
        const defaultListItems = weekEnum.toList();
        const idNameListItems = weekEnum.toList({ valueField: 'id', labelField: 'name' });
        const defaultMap = weekEnum.toMap();
        const customMap = weekEnum.toMap({ keySelector: 'key', valueSelector: (item) => ({ label: item.label }) });
        return { weekEnum, noLocale, getStandardWeekData, defaultListItems, idNameListItems, defaultMap, customMap };
      },
      ({ weekEnum, noLocale, getStandardWeekData, defaultListItems, idNameListItems, defaultMap, customMap }) => {
        assertEnum(weekEnum, noLocale, getStandardWeekData);
        assertListItems({ defaultListItems, idNameListItems, locales: noLocale, getStandardWeekData });
        assertMapItems({ defaultMap, customMap, locales: noLocale, getStandardWeekData });
      }
    );
    engine.test(
      'should be able to set prefix of enum item labels',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { ShortLabelStandardWeekConfig, localeEN, setLang, getLocales },
        WeekData: { getStandardWeekData },
      }) => {
        setLang('en-US', Enum, getLocales, defaultLocalize);
        Enum.config.autoLabel = true;
        const weekEnum = Enum(ShortLabelStandardWeekConfig, { labelPrefix: 'weekday.' });
        const defaultListItems = weekEnum.toList();
        const idNameListItems = weekEnum.toList({ valueField: 'id', labelField: 'name' });
        const defaultMap = weekEnum.toMap();
        const customMap = weekEnum.toMap({ keySelector: 'key', valueSelector: (item) => ({ label: item.label }) });
        return {
          Enum,
          weekEnum,
          locales: localeEN,
          getStandardWeekData,
          defaultListItems,
          idNameListItems,
          defaultMap,
          customMap,
        };
      },
      ({ weekEnum, locales, getStandardWeekData, defaultListItems, idNameListItems, defaultMap, customMap }) => {
        assertEnum(weekEnum, locales, getStandardWeekData);
        assertListItems({ defaultListItems, idNameListItems, locales, getStandardWeekData });
        assertMapItems({ defaultMap, customMap, locales, getStandardWeekData });
      }
    );
    engine.test(
      'enum item label can be ignored with prefix',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { WeekValueOnlyConfig, localeEN, setLang, getLocales },
        WeekData: { getStandardWeekData },
      }) => {
        setLang('en-US', Enum, getLocales, defaultLocalize);
        Enum.config.autoLabel = true;
        const weekEnum = Enum(WeekValueOnlyConfig, { labelPrefix: 'weekday.' });
        const defaultListItems = weekEnum.toList();
        const idNameListItems = weekEnum.toList({ valueField: 'id', labelField: 'name' });
        const defaultMap = weekEnum.toMap();
        const customMap = weekEnum.toMap({ keySelector: 'key', valueSelector: (item) => ({ label: item.label }) });
        return {
          weekEnum,
          locales: localeEN,
          getStandardWeekData,
          defaultListItems,
          idNameListItems,
          defaultMap,
          customMap,
        };
      },
      ({ weekEnum, locales, getStandardWeekData, defaultListItems, idNameListItems, defaultMap, customMap }) => {
        assertEnum(weekEnum, locales, getStandardWeekData);
        assertListItems({ defaultListItems, idNameListItems, locales, getStandardWeekData });
        assertMapItems({ defaultMap, customMap, locales, getStandardWeekData });
      }
    );
    engine.test(
      'autoLabel can be false',
      ({ EnumPlus: { Enum, defaultLocalize }, WeekConfig: { ShortLabelStandardWeekConfig, setLang, getLocales } }) => {
        setLang('en-US', Enum, getLocales, defaultLocalize);
        Enum.config.autoLabel = false;
        const weekEnumStandard = Enum(ShortLabelStandardWeekConfig, { labelPrefix: 'weekday.' });
        const weekEnumShortLabel = Enum(ShortLabelStandardWeekConfig, { labelPrefix: 'weekday.' });
        return { weekEnumStandard, weekEnumShortLabel };
      },
      ({ weekEnumStandard, weekEnumShortLabel }) => {
        engine.expect(Array.from(weekEnumStandard.labels)).toEqual(weekEnumStandard.keys);
        engine.expect(Array.from(weekEnumShortLabel.labels)).toEqual(weekEnumShortLabel.keys);
      }
    );
    engine.test(
      'autoLabel can be function',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { ShortLabelStandardWeekConfig, localeEN, setLang, getLocales },
        WeekData: { getStandardWeekData },
      }) => {
        setLang('en-US', Enum, getLocales, defaultLocalize);
        Enum.config.autoLabel = ({ item }) => 'weekday.' + item.raw.label;
        const weekEnum = Enum(ShortLabelStandardWeekConfig);
        const defaultListItems = weekEnum.toList();
        const idNameListItems = weekEnum.toList({ valueField: 'id', labelField: 'name' });
        const defaultMap = weekEnum.toMap();
        const customMap = weekEnum.toMap({ keySelector: 'key', valueSelector: (item) => ({ label: item.label }) });
        return {
          weekEnum,
          locales: localeEN,
          getStandardWeekData,
          defaultListItems,
          idNameListItems,
          defaultMap,
          customMap,
        };
      },
      ({ weekEnum, locales, getStandardWeekData, defaultListItems, idNameListItems, defaultMap, customMap }) => {
        assertEnum(weekEnum, locales, getStandardWeekData);
        assertListItems({ defaultListItems, idNameListItems, locales, getStandardWeekData });
        assertMapItems({ defaultMap, customMap, locales, getStandardWeekData });
      }
    );
    engine.test(
      'labelPrefix can be object',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { ShortLabelStandardWeekConfig, noLocale, localeEN, setLang, getLocales },
        WeekData: { getStandardWeekData },
      }) => {
        setLang('en-US', Enum, getLocales, defaultLocalize);
        Enum.config.autoLabel = ({ item, labelPrefix }) => labelPrefix[item.key];
        const weekEnum = Enum(ShortLabelStandardWeekConfig, { labelPrefix: noLocale });
        const defaultListItems = weekEnum.toList();
        const idNameListItems = weekEnum.toList({ valueField: 'id', labelField: 'name' });
        const defaultMap = weekEnum.toMap();
        const customMap = weekEnum.toMap({ keySelector: 'key', valueSelector: (item) => ({ label: item.label }) });
        return {
          weekEnum,
          locales: localeEN,
          getStandardWeekData,
          defaultListItems,
          idNameListItems,
          defaultMap,
          customMap,
        };
      },
      ({ weekEnum, locales, getStandardWeekData, defaultListItems, idNameListItems, defaultMap, customMap }) => {
        assertEnum(weekEnum, locales, getStandardWeekData);
        assertListItems({ defaultListItems, idNameListItems, locales, getStandardWeekData });
        assertMapItems({ defaultMap, customMap, locales, getStandardWeekData });
      }
    );
    engine.test(
      'labelPrefix and autoLabel of Enum instances should override global configs in Enum.config',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { ShortLabelStandardWeekConfig, noLocale, localeCN, setLang, getLocales },
        WeekData: { getStandardWeekData },
      }) => {
        setLang('zh-CN', Enum, getLocales, defaultLocalize);
        Enum.config.autoLabel = () => 'NOT_EXISTED_KEY';
        const weekEnumStandard = Enum(ShortLabelStandardWeekConfig, { labelPrefix: 'weekday.', autoLabel: true });
        const defaultListItemsStandard = weekEnumStandard.toList();
        const idNameListItemsStandard = weekEnumStandard.toList({ valueField: 'id', labelField: 'name' });
        const defaultMapStandard = weekEnumStandard.toMap();
        const customMapStandard = weekEnumStandard.toMap({
          keySelector: 'key',
          valueSelector: (item) => ({ label: item.label }),
        });
        const weekEnumFunction = Enum(ShortLabelStandardWeekConfig, {
          labelPrefix: noLocale,
          autoLabel: ({ item, labelPrefix }) => labelPrefix[item.key],
        });
        const defaultListItemsFunction = weekEnumFunction.toList();
        const idNameListItemsFunction = weekEnumFunction.toList({ valueField: 'id', labelField: 'name' });
        const defaultMapFunction = weekEnumFunction.toMap();
        const customMapFunction = weekEnumFunction.toMap({
          keySelector: 'key',
          valueSelector: (item) => ({ label: item.label }),
        });
        return {
          locales: localeCN,
          getStandardWeekData,
          weekEnumStandard,
          defaultListItemsStandard,
          idNameListItemsStandard,
          defaultMapStandard,
          customMapStandard,
          weekEnumFunction,
          defaultListItemsFunction,
          idNameListItemsFunction,
          defaultMapFunction,
          customMapFunction,
        };
      },
      ({
        locales,
        getStandardWeekData,
        weekEnumStandard,
        defaultListItemsStandard,
        idNameListItemsStandard,
        defaultMapStandard,
        customMapStandard,
        weekEnumFunction,
        defaultListItemsFunction,
        idNameListItemsFunction,
        defaultMapFunction,
        customMapFunction,
      }) => {
        assertEnum(weekEnumStandard, locales, getStandardWeekData);
        assertListItems({
          defaultListItems: defaultListItemsStandard,
          idNameListItems: idNameListItemsStandard,
          locales: locales,
          getStandardWeekData,
        });
        assertMapItems({
          defaultMap: defaultMapStandard,
          customMap: customMapStandard,
          locales: locales,
          getStandardWeekData,
        });
        assertEnum(weekEnumFunction, locales, getStandardWeekData);
        assertListItems({
          defaultListItems: defaultListItemsFunction,
          idNameListItems: idNameListItemsFunction,
          locales: locales,
          getStandardWeekData,
        });
        assertMapItems({
          defaultMap: defaultMapFunction,
          customMap: customMapFunction,
          locales: locales,
          getStandardWeekData,
        });
      }
    );

    engine.test(
      'Enum name should support global localization (English)',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, localeEN, getLocales, resourceLocalizer },
      }) => {
        setLang('en-US', Enum, getLocales, defaultLocalize);
        const weekEnumWithoutName = Enum(StandardWeekConfig);
        const weekEnum = Enum(StandardWeekConfig, { name: 'weekDay.name' });
        const weekEnumFuncName = Enum(StandardWeekConfig, { name: () => resourceLocalizer('weekDay.name') });
        return { weekEnum, weekEnumFuncName, weekEnumWithoutName, localeEN };
      },
      ({ weekEnum, weekEnumFuncName, weekEnumWithoutName, localeEN }) => {
        engine.expect(weekEnumWithoutName.name).toBe(undefined);
        engine.expect(weekEnum.name).toBe(localeEN['weekDay.name']);
        engine.expect(weekEnumFuncName.name).toBe(localeEN['weekDay.name']);
      }
    );
    engine.test(
      'Enum name should support global localization (Chinese)',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, localeCN, getLocales, resourceLocalizer },
      }) => {
        setLang('zh-CN', Enum, getLocales, defaultLocalize);
        const weekEnumWithoutName = Enum(StandardWeekConfig);
        const weekEnum = Enum(StandardWeekConfig, { name: 'weekDay.name' });
        const weekEnumFuncName = Enum(StandardWeekConfig, { name: () => resourceLocalizer('weekDay.name') });
        return { weekEnum, weekEnumFuncName, weekEnumWithoutName, localeCN };
      },
      ({ weekEnum, weekEnumFuncName, weekEnumWithoutName, localeCN }) => {
        engine.expect(weekEnumWithoutName.name).toBe(undefined);
        engine.expect(weekEnum.name).toBe(localeCN['weekDay.name']);
        engine.expect(weekEnumFuncName.name).toBe(localeCN['weekDay.name']);
      }
    );
    engine.test(
      'Enum name should support global localization (No Locale)',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, noLocale, getLocales, resourceLocalizer },
      }) => {
        setLang(undefined, Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig, { name: 'weekDay.name' });
        const weekEnumFuncName = Enum(StandardWeekConfig, { name: () => resourceLocalizer('weekDay.name') });
        return { weekEnum, weekEnumFuncName, noLocale };
      },
      ({ weekEnum, weekEnumFuncName, noLocale }) => {
        engine.expect(weekEnum.name).toBe(noLocale['weekDay.name']);
        engine.expect(weekEnumFuncName.name).toBe(noLocale['weekDay.name']);
      }
    );
    engine.test(
      'Enum name should support custom localization (English)',
      ({
        EnumPlus: { Enum },
        WeekConfig: { StandardWeekConfig, localeEN, noLocale, getLocales, genSillyLocalizer, resourceLocalizer },
      }) => {
        const weekEnum = Enum(StandardWeekConfig, {
          localize: genSillyLocalizer('en-US', getLocales),
          name: 'weekDay.name',
        });
        const weekEnumFuncName = Enum(StandardWeekConfig, {
          localize: genSillyLocalizer('en-US', getLocales),
          name: () => resourceLocalizer('weekDay.name'),
        });
        return { weekEnum, weekEnumFuncName, localeEN, noLocale };
      },
      ({ weekEnum, weekEnumFuncName, localeEN, noLocale }) => {
        engine.expect(weekEnum.name).toBe(localeEN['weekDay.name']);
        engine.expect(weekEnumFuncName.name).toBe(noLocale['weekDay.name']);
      }
    );
    engine.test(
      'Enum name should support custom localization (Chinese)',
      ({
        EnumPlus: { Enum },
        WeekConfig: { StandardWeekConfig, localeCN, noLocale, getLocales, genSillyLocalizer, resourceLocalizer },
      }) => {
        const weekEnum = Enum(StandardWeekConfig, {
          localize: genSillyLocalizer('zh-CN', getLocales),
          name: 'weekDay.name',
        });
        const weekEnumFuncName = Enum(StandardWeekConfig, {
          localize: genSillyLocalizer('zh-CN', getLocales),
          name: () => resourceLocalizer('weekDay.name'),
        });
        return { weekEnum, weekEnumFuncName, localeCN, noLocale };
      },
      ({ weekEnum, weekEnumFuncName, localeCN, noLocale }) => {
        engine.expect(weekEnum.name).toBe(localeCN['weekDay.name']);
        engine.expect(weekEnumFuncName.name).toBe(noLocale['weekDay.name']);
      }
    );
    engine.test(
      'Enum name should support custom localization (No Locale)',
      ({
        EnumPlus: { Enum },
        WeekConfig: { StandardWeekConfig, noLocale, getLocales, genSillyLocalizer, resourceLocalizer },
      }) => {
        const weekEnum = Enum(StandardWeekConfig, {
          localize: genSillyLocalizer(undefined, getLocales),
          name: 'weekDay.name',
        });
        const weekEnumFuncName = Enum(StandardWeekConfig, {
          localize: genSillyLocalizer(undefined, getLocales),
          name: () => resourceLocalizer('weekDay.name'),
        });
        return { weekEnum, weekEnumFuncName, noLocale };
      },
      ({ weekEnum, weekEnumFuncName, noLocale }) => {
        engine.expect(weekEnum.name).toBe(noLocale['weekDay.name']);
        engine.expect(weekEnumFuncName.name).toBe(noLocale['weekDay.name']);
      }
    );
    engine.test(
      'Enum name should respect Enum options over global setting (Chinese over English)',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: {
          StandardWeekConfig,
          setLang,
          localeCN,
          localeEN,
          getLocales,
          genSillyLocalizer,
          resourceLocalizer,
        },
      }) => {
        setLang('en-US', Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig, {
          localize: genSillyLocalizer('zh-CN', getLocales),
          name: 'weekDay.name',
        });
        const weekEnumFuncName = Enum(StandardWeekConfig, {
          localize: genSillyLocalizer('zh-CN', getLocales),
          name: () => resourceLocalizer('weekDay.name'),
        });
        return { weekEnum, weekEnumFuncName, localeCN, localeEN };
      },
      ({ weekEnum, weekEnumFuncName, localeCN, localeEN }) => {
        engine.expect(weekEnum.name).toBe(localeCN['weekDay.name']);
        engine.expect(weekEnumFuncName.name).toBe(localeEN['weekDay.name']);
      }
    );
    engine.test(
      'Enum name should allow normal text',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
        Enum.localize = undefined!;
        const weekEnumWithoutName = Enum(StandardWeekConfig);
        const weekEnum = Enum(StandardWeekConfig, { name: 'Week Days' });
        const weekEnumFuncName = Enum(StandardWeekConfig, { name: () => 'Week Days' });
        return { weekEnum, weekEnumFuncName, weekEnumWithoutName };
      },
      ({ weekEnum, weekEnumFuncName, weekEnumWithoutName }) => {
        engine.expect(weekEnumWithoutName.name).toBe(undefined);
        engine.expect(weekEnum.name).toBe('Week Days');
        engine.expect(weekEnumFuncName.name).toBe('Week Days');
      }
    );
  });

  function assertEnum(
    weekEnum:
      | IEnum<
          typeof StandardWeekConfig,
          keyof typeof StandardWeekConfig,
          (typeof StandardWeekConfig)[keyof typeof StandardWeekConfig]['value']
        >
      | IEnum<
          typeof FuncLabelStandardWeekConfig,
          keyof typeof FuncLabelStandardWeekConfig,
          (typeof FuncLabelStandardWeekConfig)[keyof typeof FuncLabelStandardWeekConfig]['value']
        >
      | IEnum<
          typeof ShortLabelStandardWeekConfig,
          keyof typeof ShortLabelStandardWeekConfig,
          (typeof ShortLabelStandardWeekConfig)[keyof typeof ShortLabelStandardWeekConfig]['value']
        >
      | IEnum<
          typeof WeekValueOnlyConfig,
          keyof typeof WeekValueOnlyConfig,
          (typeof WeekValueOnlyConfig)[keyof typeof WeekValueOnlyConfig]['value']
        >,
    locales: typeof localeEN | typeof localeCN | typeof noLocale,
    getStandardWeekData: typeof getStandardWeekDataInterface
  ) {
    engine.expect(Array.from(weekEnum.labels)).toEqual(weekEnum.keys.map((key) => locales[key]));

    const sunday = weekEnum.items[0];
    engine.expect(sunday.label).toBe(locales.Sunday);
    engine.expect(sunday.toString()).toBe(locales.Sunday);
    engine.expect(sunday.toLocaleString()).toBe(locales.Sunday);
    engine
      .expect(
        copyList(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          weekEnum.items as any[]
        )
      )
      .toEqual(pickArray(getStandardWeekData(locales), ['label', 'value']));
    engine.expect(copyList(weekEnum.toList())).toEqual(pickArray(getStandardWeekData(locales), ['label', 'value']));
  }

  function assertListItems(options: {
    defaultListItems: ListItem<(typeof StandardWeekConfig)[keyof typeof StandardWeekConfig]['value']>[];
    idNameListItems: ListItem<(typeof StandardWeekConfig)[keyof typeof StandardWeekConfig]['value'], 'id', 'name'>[];
    locales: typeof localeEN | typeof localeCN | typeof noLocale;
    getStandardWeekData: typeof getStandardWeekDataInterface;
  }) {
    const { defaultListItems, idNameListItems, locales, getStandardWeekData } = options;
    engine.expect(copyList(defaultListItems)).toEqual(
      getStandardWeekData(locales).map((item) => ({
        value: item.value,
        label: item.label,
      }))
    );
    engine.expect(Array.from(idNameListItems)).toEqual(
      getStandardWeekData(locales).map((item) => ({
        id: item.value,
        name: item.label,
      }))
    );
  }

  function assertMapItems(options: {
    defaultMap: MapResult<typeof StandardWeekConfig, 'value', 'label'>;
    customMap: MapResult<
      typeof StandardWeekConfig,
      'key',
      (item: EnumItemClass<(typeof StandardWeekConfig)[keyof typeof StandardWeekConfig]>) => { label: string }
    >;
    locales: typeof localeEN | typeof localeCN | typeof noLocale;
    getStandardWeekData: typeof getStandardWeekDataInterface;
  }) {
    const { defaultMap, customMap, locales, getStandardWeekData } = options;
    engine.expect(defaultMap).toEqual(
      getStandardWeekData(locales).reduce(
        (acc, item) => {
          acc[item.value] = item.label;
          return acc;
        },
        {} as Record<string, string>
      )
    );
    engine.expect(customMap).toEqual(
      getStandardWeekData(locales).reduce(
        (acc, item) => {
          acc[item.key] = { label: item.label };
          return acc;
        },
        {} as Record<string, { label: string }>
      )
    );
  }
};

export default testLocalization;
