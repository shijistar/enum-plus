import type { EnumItemInterface, IEnum, ListItem } from '@enum-plus';
import { ENUM_OPTIONS } from '@enum-plus';
import type { MapResult } from '@enum-plus/enum-items';
import type {
  FuncLabelStandardWeekConfig,
  ShortLabelStandardWeekConfig,
  StandardWeekConfig,
  WeekValueOnlyConfig,
} from '../data/week-config';
import type { getStandardWeekData as getStandardWeekDataInterface } from '../data/week-data';
import type TestEngineBase from '../engines/base';
import type enUS from '../i18n/en-US.json';
import neutral from '../i18n/neutral.json';
import type zhCN from '../i18n/zh-CN.json';
import { copyList, pickArray } from '../utils/index';

const testLocalization = (engine: TestEngineBase<'jest' | 'playwright'>) => {
  engine.describe('Enum localization', () => {
    engine.test(
      'should provide a default localize method',
      ({ EnumPlus: { Enum, defaultLocalize }, WeekConfig: { getLocales, genSillyLocalizer } }) => {
        return { Enum, getLocales, defaultLocalize, genSillyLocalizer };
      },
      ({ Enum, defaultLocalize }) => {
        engine.expect(Enum.localize?.toString()).toBe(defaultLocalize.toString());
      },
    );

    engine.test(
      'should show English after setting the language to en-US',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, FuncLabelStandardWeekConfig, setLang, getLocales },
        WeekData: { getStandardWeekData },
        i18n: { enUS },
      }) => {
        setLang('en-US', Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig);
        const weekEnumFuncLabel = Enum(FuncLabelStandardWeekConfig, { autoLocalizeMeta: true });
        const defaultListItems = weekEnum.toList();
        const idNameListItems = weekEnum.toList({ valueField: 'id', labelField: 'name' });
        const defaultMap = weekEnum.toMap();
        const customMap = weekEnum.toMap({ keySelector: 'key', valueSelector: (item) => ({ label: item.label }) });
        return {
          weekEnum,
          weekEnumFuncLabel,
          enUS,
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
        enUS,
        getStandardWeekData,
        defaultListItems,
        idNameListItems,
        defaultMap,
        customMap,
      }) => {
        assertEnum(weekEnum, enUS, { getStandardWeekData });
        assertEnum(weekEnumFuncLabel, enUS, { getStandardWeekData });
        assertListItems({ defaultListItems, idNameListItems, locales: enUS, getStandardWeekData });
        assertMapItems({ defaultMap, customMap, locales: enUS, getStandardWeekData });
      },
    );

    engine.test(
      'should show Chinese after changing the language',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, FuncLabelStandardWeekConfig, setLang, getLocales },
        WeekData: { getStandardWeekData },
        i18n: { zhCN },
      }) => {
        setLang('zh-CN', Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig);
        const weekEnumFuncLabel = Enum(FuncLabelStandardWeekConfig, { autoLocalizeMeta: true });
        const defaultListItems = weekEnum.toList();
        const idNameListItems = weekEnum.toList({ valueField: 'id', labelField: 'name' });
        const defaultMap = weekEnum.toMap();
        const customMap = weekEnum.toMap({ keySelector: 'key', valueSelector: (item) => ({ label: item.label }) });
        return {
          weekEnum,
          weekEnumFuncLabel,
          zhCN,
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
        zhCN,
        getStandardWeekData,
        defaultListItems,
        idNameListItems,
        defaultMap,
        customMap,
      }) => {
        assertEnum(weekEnum, zhCN, { getStandardWeekData });
        assertEnum(weekEnumFuncLabel, zhCN, { getStandardWeekData });
        assertListItems({ defaultListItems, idNameListItems, locales: zhCN, getStandardWeekData });
        assertMapItems({ defaultMap, customMap, locales: zhCN, getStandardWeekData });
      },
    );

    engine.test(
      'should show English after switching back',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, FuncLabelStandardWeekConfig, setLang, getLocales },
        WeekData: { getStandardWeekData },
        i18n: { enUS },
      }) => {
        setLang('en-US', Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig);
        const weekEnumFuncLabel = Enum(FuncLabelStandardWeekConfig, { autoLocalizeMeta: true });
        const defaultListItems = weekEnum.toList();
        const idNameListItems = weekEnum.toList({ valueField: 'id', labelField: 'name' });
        const defaultMap = weekEnum.toMap();
        const customMap = weekEnum.toMap({ keySelector: 'key', valueSelector: (item) => ({ label: item.label }) });
        return {
          weekEnum,
          weekEnumFuncLabel,
          enUS,
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
        enUS,
        getStandardWeekData,
        defaultListItems,
        idNameListItems,
        defaultMap,
        customMap,
      }) => {
        assertEnum(weekEnum, enUS, { getStandardWeekData });
        assertEnum(weekEnumFuncLabel, enUS, { getStandardWeekData });
        assertListItems({ defaultListItems, idNameListItems, locales: enUS, getStandardWeekData });
        assertMapItems({ defaultMap, customMap, locales: enUS, getStandardWeekData });
      },
    );

    engine.test(
      'should fall back to the original label when no localization is found',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, FuncLabelStandardWeekConfig, setLang, getLocales },
        WeekData: { getStandardWeekData },
        i18n: { neutral },
      }) => {
        setLang(undefined, Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig);
        const weekEnumFuncLabel = Enum(FuncLabelStandardWeekConfig, { autoLocalizeMeta: true });
        const defaultListItems = weekEnum.toList();
        const idNameListItems = weekEnum.toList({ valueField: 'id', labelField: 'name' });
        const defaultMap = weekEnum.toMap();
        const customMap = weekEnum.toMap({ keySelector: 'key', valueSelector: (item) => ({ label: item.label }) });
        return {
          weekEnum,
          weekEnumFuncLabel,
          defaultLocalize,
          neutral,
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
        neutral,
        getStandardWeekData,
        defaultListItems,
        idNameListItems,
        defaultMap,
        customMap,
      }) => {
        assertEnum(weekEnum, neutral, { getStandardWeekData });
        assertEnum(weekEnumFuncLabel, neutral, { getStandardWeekData });
        assertListItems({ defaultListItems, idNameListItems, locales: neutral, getStandardWeekData });
        assertMapItems({ defaultMap, customMap, locales: neutral, getStandardWeekData });
      },
    );

    engine.test(
      'should fall back to the original label when Enum.localize is explicitly undefined',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, FuncLabelStandardWeekConfig, setLang, getLocales },
        WeekData: { getStandardWeekData },
        i18n: { neutral },
      }) => {
        setLang(undefined, Enum, getLocales, defaultLocalize);
        Enum.localize = undefined!;
        const weekEnum = Enum(StandardWeekConfig);
        const weekEnumFuncLabel = Enum(FuncLabelStandardWeekConfig, { autoLocalizeMeta: true });
        const defaultListItems = weekEnum.toList();
        const idNameListItems = weekEnum.toList({ valueField: 'id', labelField: 'name' });
        const defaultMap = weekEnum.toMap();
        const customMap = weekEnum.toMap({ keySelector: 'key', valueSelector: (item) => ({ label: item.label }) });
        return {
          weekEnum,
          weekEnumFuncLabel,
          neutral,
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
        neutral,
        getStandardWeekData,
        defaultListItems,
        idNameListItems,
        defaultMap,
        customMap,
      }) => {
        assertEnum(weekEnum, neutral, { getStandardWeekData });
        assertEnum(weekEnumFuncLabel, neutral, { getStandardWeekData });
        assertListItems({ defaultListItems, idNameListItems, locales: neutral, getStandardWeekData });
        assertMapItems({ defaultMap, customMap, locales: neutral, getStandardWeekData });
      },
    );

    engine.test(
      'should use Enum localization for static labels while function labels use the global localizer',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, FuncLabelStandardWeekConfig, setLang, getLocales, genSillyLocalizer },
        WeekData: { getStandardWeekData },
        i18n: { enUS, zhCN },
      }) => {
        setLang('en-US', Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig, {
          localize: genSillyLocalizer('zh-CN', getLocales),
          autoLocalizeMeta: true,
        });
        const weekEnumFuncLabel = Enum(FuncLabelStandardWeekConfig, {
          localize: genSillyLocalizer('zh-CN', getLocales),
          autoLocalizeMeta: true,
        });
        const defaultListItems = weekEnum.toList();
        const idNameListItems = weekEnum.toList({ valueField: 'id', labelField: 'name' });
        const defaultMap = weekEnum.toMap();
        const customMap = weekEnum.toMap({ keySelector: 'key', valueSelector: (item) => ({ label: item.label }) });
        return {
          weekEnum,
          weekEnumFuncLabel,
          zhCN,
          enUS,
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
        zhCN,
        enUS,
        getStandardWeekData,
        defaultListItems,
        idNameListItems,
        defaultMap,
        customMap,
      }) => {
        assertEnum(weekEnum, zhCN, { getStandardWeekData });
        assertEnum(weekEnumFuncLabel, enUS, { getStandardWeekData });
        assertListItems({ defaultListItems, idNameListItems, locales: zhCN, getStandardWeekData });
        assertMapItems({ defaultMap, customMap, locales: zhCN, getStandardWeekData });
      },
    );
    engine.test(
      'should fall back to the global localizer when Enum localize is undefined',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, FuncLabelStandardWeekConfig, setLang, getLocales },
        WeekData: { getStandardWeekData },
        i18n: { enUS },
      }) => {
        setLang('en-US', Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig, { localize: undefined, autoLocalizeMeta: true });
        const weekEnumFuncLabel = Enum(FuncLabelStandardWeekConfig, { localize: undefined, autoLocalizeMeta: true });
        const defaultListItems = weekEnum.toList();
        const idNameListItems = weekEnum.toList({ valueField: 'id', labelField: 'name' });
        const defaultMap = weekEnum.toMap();
        const customMap = weekEnum.toMap({ keySelector: 'key', valueSelector: (item) => ({ label: item.label }) });
        return {
          weekEnum,
          weekEnumFuncLabel,
          enUS,
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
        enUS,
        getStandardWeekData,
        defaultListItems,
        idNameListItems,
        defaultMap,
        customMap,
      }) => {
        assertEnum(weekEnum, enUS, { getStandardWeekData });
        assertEnum(weekEnumFuncLabel, enUS, { getStandardWeekData });
        assertListItems({ defaultListItems, idNameListItems, locales: enUS, getStandardWeekData });
        assertMapItems({ defaultMap, customMap, locales: enUS, getStandardWeekData });
      },
    );
    engine.test(
      'should use a global localizer assigned after Enum creation',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, FuncLabelStandardWeekConfig, setLang, getLocales },
        WeekData: { getStandardWeekData },
        i18n: { enUS },
      }) => {
        setLang(undefined, Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig, { localize: undefined, autoLocalizeMeta: true });
        const weekEnumFuncLabel = Enum(FuncLabelStandardWeekConfig, { localize: undefined, autoLocalizeMeta: true });
        setLang('en-US', Enum, getLocales, defaultLocalize);
        const defaultListItems = weekEnum.toList();
        const idNameListItems = weekEnum.toList({ valueField: 'id', labelField: 'name' });
        const defaultMap = weekEnum.toMap();
        const customMap = weekEnum.toMap({ keySelector: 'key', valueSelector: (item) => ({ label: item.label }) });
        return {
          Enum,
          weekEnum,
          weekEnumFuncLabel,
          enUS,
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
        enUS,
        getStandardWeekData,
        defaultListItems,
        idNameListItems,
        defaultMap,
        customMap,
      }) => {
        assertEnum(weekEnum, enUS, { getStandardWeekData });
        assertEnum(weekEnumFuncLabel, enUS, { getStandardWeekData });
        assertListItems({ defaultListItems, idNameListItems, locales: enUS, getStandardWeekData });
        assertMapItems({ defaultMap, customMap, locales: enUS, getStandardWeekData });
      },
    );
    engine.test(
      'should use Enum localization for static labels while function labels keep their own localization',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, FuncLabelStandardWeekConfig, setLang, getLocales, genSillyLocalizer },
        WeekData: { getStandardWeekData },
        i18n: { zhCN },
      }) => {
        setLang(undefined, Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig, {
          localize: genSillyLocalizer('zh-CN', getLocales),
          autoLocalizeMeta: true,
        });
        const weekEnumFuncLabel = Enum(FuncLabelStandardWeekConfig, {
          localize: genSillyLocalizer('zh-CN', getLocales),
          autoLocalizeMeta: true,
        });
        const defaultListItems = weekEnum.toList();
        const idNameListItems = weekEnum.toList({ valueField: 'id', labelField: 'name' });
        const defaultMap = weekEnum.toMap();
        const customMap = weekEnum.toMap({ keySelector: 'key', valueSelector: (item) => ({ label: item.label }) });
        return {
          weekEnum,
          weekEnumFuncLabel,
          zhCN,
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
        zhCN,
        getStandardWeekData,
        defaultListItems,
        idNameListItems,
        defaultMap,
        customMap,
      }) => {
        assertEnum(weekEnum, zhCN, { getStandardWeekData });
        // Note, you need to use `neutral` here, because the function of the raw field takes precedence over the enum.locale method,
        // which will not work here.
        assertEnum(weekEnumFuncLabel, neutral, { getStandardWeekData });
        assertListItems({ defaultListItems, idNameListItems, locales: zhCN, getStandardWeekData });
        assertMapItems({ defaultMap, customMap, locales: zhCN, getStandardWeekData });
      },
    );

    engine.test(
      'should handle undefined Enum and global localization options',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, getLocales },
        WeekData: { getStandardWeekData },
        i18n: { neutral },
      }) => {
        setLang(undefined, Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig, { localize: undefined, autoLocalizeMeta: true });
        const defaultListItems = weekEnum.toList();
        const idNameListItems = weekEnum.toList({ valueField: 'id', labelField: 'name' });
        const defaultMap = weekEnum.toMap();
        const customMap = weekEnum.toMap({ keySelector: 'key', valueSelector: (item) => ({ label: item.label }) });
        return {
          weekEnum,
          defaultLocalize,
          neutral,
          getStandardWeekData,
          defaultListItems,
          idNameListItems,
          defaultMap,
          customMap,
        };
      },
      ({ weekEnum, neutral, getStandardWeekData, defaultListItems, idNameListItems, defaultMap, customMap }) => {
        assertEnum(weekEnum, neutral, { getStandardWeekData });
        assertListItems({ defaultListItems, idNameListItems, locales: neutral, getStandardWeekData });
        assertMapItems({ defaultMap, customMap, locales: neutral, getStandardWeekData });
      },
    );
    engine.test(
      'should handle explicitly undefined Enum and global localization options',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, getLocales },
        WeekData: { getStandardWeekData },
        i18n: { neutral },
      }) => {
        setLang(undefined, Enum, getLocales, defaultLocalize);
        Enum.localize = undefined!;
        const weekEnum = Enum(StandardWeekConfig, { localize: undefined, autoLocalizeMeta: true });
        const defaultListItems = weekEnum.toList();
        const idNameListItems = weekEnum.toList({ valueField: 'id', labelField: 'name' });
        const defaultMap = weekEnum.toMap();
        const customMap = weekEnum.toMap({ keySelector: 'key', valueSelector: (item) => ({ label: item.label }) });
        return {
          weekEnum,
          neutral,
          getStandardWeekData,
          defaultListItems,
          idNameListItems,
          defaultMap,
          customMap,
        };
      },
      ({ weekEnum, neutral, getStandardWeekData, defaultListItems, idNameListItems, defaultMap, customMap }) => {
        assertEnum(weekEnum, neutral, { getStandardWeekData });
        assertListItems({ defaultListItems, idNameListItems, locales: neutral, getStandardWeekData });
        assertMapItems({ defaultMap, customMap, locales: neutral, getStandardWeekData });
      },
    );
    engine.test(
      'should support prefixes for enum item labels',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { ShortLabelStandardWeekConfig, setLang, getLocales },
        WeekData: { getStandardWeekData },
        i18n: { enUS },
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
          locales: enUS,
          getStandardWeekData,
          defaultListItems,
          idNameListItems,
          defaultMap,
          customMap,
        };
      },
      ({ weekEnum, locales, getStandardWeekData, defaultListItems, idNameListItems, defaultMap, customMap }) => {
        assertEnum(weekEnum, locales, { getStandardWeekData });
        assertListItems({ defaultListItems, idNameListItems, locales, getStandardWeekData });
        assertMapItems({ defaultMap, customMap, locales, getStandardWeekData });
      },
    );
    engine.test(
      'should derive labels from enum keys when a prefix is configured',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { WeekValueOnlyConfig, setLang, getLocales },
        WeekData: { getStandardWeekData },
        i18n: { enUS },
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
          locales: enUS,
          getStandardWeekData,
          defaultListItems,
          idNameListItems,
          defaultMap,
          customMap,
        };
      },
      ({ weekEnum, locales, getStandardWeekData, defaultListItems, idNameListItems, defaultMap, customMap }) => {
        assertEnum(weekEnum, locales, { getStandardWeekData });
        assertListItems({ defaultListItems, idNameListItems, locales, getStandardWeekData });
        assertMapItems({ defaultMap, customMap, locales, getStandardWeekData });
      },
    );
    engine.test(
      'should use enum keys as labels when autoLabel is false',
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
      },
    );
    engine.test(
      'should support a function for autoLabel',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { ShortLabelStandardWeekConfig, setLang, getLocales },
        WeekData: { getStandardWeekData },
        i18n: { enUS },
      }) => {
        setLang('en-US', Enum, getLocales, defaultLocalize);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Enum.config.autoLabel = ({ item }) => 'weekday.' + (item.raw as any)?.label;
        const weekEnum = Enum(ShortLabelStandardWeekConfig);
        const defaultListItems = weekEnum.toList();
        const idNameListItems = weekEnum.toList({ valueField: 'id', labelField: 'name' });
        const defaultMap = weekEnum.toMap();
        const customMap = weekEnum.toMap({ keySelector: 'key', valueSelector: (item) => ({ label: item.label }) });
        return {
          weekEnum,
          locales: enUS,
          getStandardWeekData,
          defaultListItems,
          idNameListItems,
          defaultMap,
          customMap,
        };
      },
      ({ weekEnum, locales, getStandardWeekData, defaultListItems, idNameListItems, defaultMap, customMap }) => {
        assertEnum(weekEnum, locales, { getStandardWeekData });
        assertListItems({ defaultListItems, idNameListItems, locales, getStandardWeekData });
        assertMapItems({ defaultMap, customMap, locales, getStandardWeekData });
      },
    );
    engine.test(
      'should support an object for labelPrefix',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { ShortLabelStandardWeekConfig, setLang, getLocales },
        WeekData: { getStandardWeekData },
        i18n: { enUS, neutral },
      }) => {
        setLang('en-US', Enum, getLocales, defaultLocalize);
        Enum.config.autoLabel = ({ item, labelPrefix }) => labelPrefix['weekday.' + item.key];
        const weekEnum = Enum(ShortLabelStandardWeekConfig, { labelPrefix: neutral });
        const defaultListItems = weekEnum.toList();
        const idNameListItems = weekEnum.toList({ valueField: 'id', labelField: 'name' });
        const defaultMap = weekEnum.toMap();
        const customMap = weekEnum.toMap({ keySelector: 'key', valueSelector: (item) => ({ label: item.label }) });
        return {
          weekEnum,
          locales: enUS,
          getStandardWeekData,
          defaultListItems,
          idNameListItems,
          defaultMap,
          customMap,
        };
      },
      ({ weekEnum, locales, getStandardWeekData, defaultListItems, idNameListItems, defaultMap, customMap }) => {
        assertEnum(weekEnum, locales, { getStandardWeekData });
        assertListItems({ defaultListItems, idNameListItems, locales, getStandardWeekData });
        assertMapItems({ defaultMap, customMap, locales, getStandardWeekData });
      },
    );
    engine.test(
      'should prefer instance labelPrefix and autoLabel options over Enum.config',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { ShortLabelStandardWeekConfig, setLang, getLocales },
        WeekData: { getStandardWeekData },
        i18n: { zhCN, neutral },
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
          labelPrefix: neutral,
          autoLabel: ({ item, labelPrefix }) => labelPrefix[('weekday.' + item.key) as keyof typeof labelPrefix],
        });
        const defaultListItemsFunction = weekEnumFunction.toList();
        const idNameListItemsFunction = weekEnumFunction.toList({ valueField: 'id', labelField: 'name' });
        const defaultMapFunction = weekEnumFunction.toMap();
        const customMapFunction = weekEnumFunction.toMap({
          keySelector: 'key',
          valueSelector: (item) => ({ label: item.label }),
        });
        return {
          locales: zhCN,
          neutral,
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
        assertEnum(weekEnumStandard, locales, { getStandardWeekData });
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
        assertEnum(weekEnumFunction, locales, { getStandardWeekData });
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
      },
    );

    engine.test(
      'should localize Enum names globally in English',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, getLocales, resourceLocalizer },
        i18n: { enUS },
      }) => {
        setLang('en-US', Enum, getLocales, defaultLocalize);
        const weekEnumWithoutName = Enum(StandardWeekConfig);
        const weekEnum = Enum(StandardWeekConfig, { name: 'weekDay.name', autoLocalizeMeta: ['abbr'] });
        const weekEnumFuncName = Enum(StandardWeekConfig, {
          name: () => resourceLocalizer('weekDay.name'),
          autoLocalizeMeta: ['abbr'],
        });
        return { weekEnum, weekEnumFuncName, weekEnumWithoutName, enUS };
      },
      ({ weekEnum, weekEnumFuncName, weekEnumWithoutName, enUS }) => {
        engine.expect(weekEnumWithoutName.name).toBe(undefined);
        engine.expect(weekEnum.name).toBe(enUS['weekDay.name']);
        engine.expect(weekEnumFuncName.name).toBe(enUS['weekDay.name']);
      },
    );
    engine.test(
      'should localize Enum names globally in Chinese',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, getLocales, resourceLocalizer },
        i18n: { zhCN },
      }) => {
        setLang('zh-CN', Enum, getLocales, defaultLocalize);
        const weekEnumWithoutName = Enum(StandardWeekConfig);
        const weekEnum = Enum(StandardWeekConfig, { name: 'weekDay.name', autoLocalizeMeta: ['abbr'] });
        const weekEnumFuncName = Enum(StandardWeekConfig, {
          name: () => resourceLocalizer('weekDay.name'),
          autoLocalizeMeta: ['abbr'],
        });
        return { weekEnum, weekEnumFuncName, weekEnumWithoutName, zhCN };
      },
      ({ weekEnum, weekEnumFuncName, weekEnumWithoutName, zhCN }) => {
        engine.expect(weekEnumWithoutName.name).toBe(undefined);
        engine.expect(weekEnum.name).toBe(zhCN['weekDay.name']);
        engine.expect(weekEnumFuncName.name).toBe(zhCN['weekDay.name']);
      },
    );
    engine.test(
      'should localize Enum names globally without a locale',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, getLocales, resourceLocalizer },
        i18n: { neutral },
      }) => {
        setLang(undefined, Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig, { name: 'weekDay.name', autoLocalizeMeta: ['abbr'] });
        const weekEnumFuncName = Enum(StandardWeekConfig, {
          name: () => resourceLocalizer('weekDay.name'),
          autoLocalizeMeta: ['abbr'],
        });
        return { weekEnum, weekEnumFuncName, neutral };
      },
      ({ weekEnum, weekEnumFuncName, neutral }) => {
        engine.expect(weekEnum.name).toBe(neutral['weekDay.name']);
        engine.expect(weekEnumFuncName.name).toBe(neutral['weekDay.name']);
      },
    );
    engine.test(
      'should use a custom English localizer for string names while function names keep their own localization',
      ({
        EnumPlus: { Enum },
        WeekConfig: { StandardWeekConfig, getLocales, genSillyLocalizer, resourceLocalizer },
        i18n: { enUS, neutral },
      }) => {
        const weekEnum = Enum(StandardWeekConfig, {
          localize: genSillyLocalizer('en-US', getLocales),
          name: 'weekDay.name',
          autoLocalizeMeta: ['abbr'],
        });
        const weekEnumFuncName = Enum(StandardWeekConfig, {
          localize: genSillyLocalizer('en-US', getLocales),
          name: () => resourceLocalizer('weekDay.name'),
          autoLocalizeMeta: ['abbr'],
        });
        return { weekEnum, weekEnumFuncName, enUS, neutral };
      },
      ({ weekEnum, weekEnumFuncName, enUS, neutral }) => {
        engine.expect(weekEnum.name).toBe(enUS['weekDay.name']);
        engine.expect(weekEnumFuncName.name).toBe(neutral['weekDay.name']);
      },
    );
    engine.test(
      'should use a custom Chinese localizer for string names while function names keep their own localization',
      ({
        EnumPlus: { Enum },
        WeekConfig: { StandardWeekConfig, getLocales, genSillyLocalizer, resourceLocalizer },
        i18n: { zhCN, neutral },
      }) => {
        const weekEnum = Enum(StandardWeekConfig, {
          localize: genSillyLocalizer('zh-CN', getLocales),
          name: 'weekDay.name',
          autoLocalizeMeta: ['abbr'],
        });
        const weekEnumFuncName = Enum(StandardWeekConfig, {
          localize: genSillyLocalizer('zh-CN', getLocales),
          name: () => resourceLocalizer('weekDay.name'),
          autoLocalizeMeta: ['abbr'],
        });
        return { weekEnum, weekEnumFuncName, zhCN, neutral };
      },
      ({ weekEnum, weekEnumFuncName, zhCN, neutral }) => {
        engine.expect(weekEnum.name).toBe(zhCN['weekDay.name']);
        engine.expect(weekEnumFuncName.name).toBe(neutral['weekDay.name']);
      },
    );
    engine.test(
      'should localize Enum names with a custom localizer and no locale',
      ({
        EnumPlus: { Enum },
        WeekConfig: { StandardWeekConfig, getLocales, genSillyLocalizer, resourceLocalizer },
        i18n: { neutral },
      }) => {
        const weekEnum = Enum(StandardWeekConfig, {
          localize: genSillyLocalizer(undefined, getLocales),
          name: 'weekDay.name',
          autoLocalizeMeta: ['abbr'],
        });
        const weekEnumFuncName = Enum(StandardWeekConfig, {
          localize: genSillyLocalizer(undefined, getLocales),
          name: () => resourceLocalizer('weekDay.name'),
          autoLocalizeMeta: ['abbr'],
        });
        return { weekEnum, weekEnumFuncName, neutral };
      },
      ({ weekEnum, weekEnumFuncName, neutral }) => {
        engine.expect(weekEnum.name).toBe(neutral['weekDay.name']);
        engine.expect(weekEnumFuncName.name).toBe(neutral['weekDay.name']);
      },
    );
    engine.test(
      'should use Enum localization for string names while function names use the global localizer',
      ({
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { StandardWeekConfig, setLang, getLocales, genSillyLocalizer, resourceLocalizer },
        i18n: { zhCN, enUS },
      }) => {
        setLang('en-US', Enum, getLocales, defaultLocalize);
        const weekEnum = Enum(StandardWeekConfig, {
          localize: genSillyLocalizer('zh-CN', getLocales),
          name: 'weekDay.name',
          autoLocalizeMeta: ['abbr'],
        });
        const weekEnumFuncName = Enum(StandardWeekConfig, {
          localize: genSillyLocalizer('zh-CN', getLocales),
          name: () => resourceLocalizer('weekDay.name'),
          autoLocalizeMeta: ['abbr'],
        });
        return { weekEnum, weekEnumFuncName, zhCN, enUS };
      },
      ({ weekEnum, weekEnumFuncName, zhCN, enUS }) => {
        engine.expect(weekEnum.name).toBe(zhCN['weekDay.name']);
        engine.expect(weekEnumFuncName.name).toBe(enUS['weekDay.name']);
      },
    );
    engine.test(
      'should accept plain text Enum names',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
        Enum.localize = undefined!;
        const weekEnumWithoutName = Enum(StandardWeekConfig);
        const weekEnum = Enum(StandardWeekConfig, { name: 'Week Days', autoLocalizeMeta: ['abbr'] });
        const weekEnumFuncName = Enum(StandardWeekConfig, { name: () => 'Week Days', autoLocalizeMeta: ['abbr'] });
        return { weekEnum, weekEnumFuncName, weekEnumWithoutName };
      },
      ({ weekEnum, weekEnumFuncName, weekEnumWithoutName }) => {
        engine.expect(weekEnumWithoutName.name).toBe(undefined);
        engine.expect(weekEnum.name).toBe('Week Days');
        engine.expect(weekEnumFuncName.name).toBe('Week Days');
      },
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
    locales: Readonly<typeof enUS> | Readonly<typeof zhCN> | Readonly<typeof neutral>,
    options: {
      getStandardWeekData: typeof getStandardWeekDataInterface;
    },
  ) {
    const { getStandardWeekData } = options;
    engine
      .expect(Array.from(weekEnum.labels))
      .toEqual(weekEnum.keys.map((key) => locales[('weekday.' + key) as keyof typeof locales]));

    const sunday = weekEnum.items[0];
    engine.expect(sunday.label).toBe(locales['weekday.Sunday']);
    engine.expect(sunday.toString()).toBe(locales['weekday.Sunday']);
    engine.expect(sunday.toLocaleString()).toBe(locales['weekday.Sunday']);
    engine
      .expect(
        copyList(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          weekEnum.items as any[],
        ),
      )
      .toEqual(pickArray(getStandardWeekData(locales), ['label', 'value']));
    engine.expect(copyList(weekEnum.toList())).toEqual(pickArray(getStandardWeekData(locales), ['label', 'value']));

    const autoLocalizeMeta = weekEnum[ENUM_OPTIONS]?.autoLocalizeMeta;
    const meta: Record<string, unknown[]> = {};
    Array.from(weekEnum.items).forEach((item) => {
      Object.keys(item.raw).forEach((metaKey) => {
        if (!['value', 'label'].includes(metaKey)) {
          if (!meta[metaKey]) {
            meta[metaKey] = [];
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let metaValue: any = item.raw[metaKey as keyof typeof item.raw];
          if (metaValue != null) {
            if (autoLocalizeMeta) {
              if (autoLocalizeMeta === true || autoLocalizeMeta.includes(metaKey as never)) {
                if (typeof metaValue === 'function') {
                  metaValue = metaValue(item);
                }
                meta[metaKey].push(locales[metaValue as unknown as keyof typeof locales] ?? metaValue);
              } else {
                meta[metaKey].push(metaValue);
              }
            } else {
              meta[metaKey].push(metaValue);
            }
          }
        }
      });
    });
    engine.expect(weekEnum.meta).toEqual(meta);

    if (autoLocalizeMeta) {
      if (autoLocalizeMeta === true) {
        Object.keys(sunday.raw).forEach((key) => {
          if (['value', 'label'].includes(key)) return;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rawValue: any = sunday.raw[key as keyof typeof sunday.raw];
          if (locales[rawValue as keyof typeof locales]) {
            engine.expect(sunday[key as keyof typeof sunday.raw]).toBe(locales[rawValue as keyof typeof locales]);
          }
        });
      }
    }
  }

  function assertListItems(options: {
    defaultListItems: ListItem<(typeof StandardWeekConfig)[keyof typeof StandardWeekConfig]['value']>[];
    idNameListItems: ListItem<(typeof StandardWeekConfig)[keyof typeof StandardWeekConfig]['value'], 'id', 'name'>[];
    locales: Readonly<typeof enUS> | Readonly<typeof zhCN> | Readonly<typeof neutral>;
    getStandardWeekData: typeof getStandardWeekDataInterface;
  }) {
    const { defaultListItems, idNameListItems, locales, getStandardWeekData } = options;
    engine.expect(copyList(defaultListItems)).toEqual(
      getStandardWeekData(locales).map((item) => ({
        value: item.value,
        label: item.label,
      })),
    );
    engine.expect(Array.from(idNameListItems)).toEqual(
      getStandardWeekData(locales).map((item) => ({
        id: item.value,
        name: item.label,
      })),
    );
  }

  function assertMapItems(options: {
    defaultMap: MapResult<typeof StandardWeekConfig, 'value', 'label'>;
    customMap: MapResult<
      typeof StandardWeekConfig,
      'key',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (item: EnumItemInterface<any, any, any, any>) => { label: string }
    >;
    locales: Readonly<typeof enUS> | Readonly<typeof zhCN> | Readonly<typeof neutral>;
    getStandardWeekData: typeof getStandardWeekDataInterface;
  }) {
    const { defaultMap, customMap, locales, getStandardWeekData } = options;
    engine.expect(defaultMap).toEqual(
      getStandardWeekData(locales).reduce(
        (acc, item) => {
          acc[item.value] = item.label;
          return acc;
        },
        {} as Record<string, string>,
      ),
    );
    engine.expect(customMap).toEqual(
      getStandardWeekData(locales).reduce(
        (acc, item) => {
          acc[item.key] = { label: item.label };
          return acc;
        },
        {} as Record<string, { label: string }>,
      ),
    );
  }
};

export default testLocalization;
