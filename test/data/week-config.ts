import type { defaultLocalize as defaultLocalizeType, EnumItemInterface, Enum as EnumType } from '../../src';
import type { EnumValue, StandardEnumItemInit } from '../../src/types';

export const localeEN = {
  'weekDay.name': 'Week Days',
  'weekday.Sunday': 'Sunday',
  'weekday.Monday': 'Monday',
  'weekday.Tuesday': 'Tuesday',
  'weekday.Wednesday': 'Wednesday',
  'weekday.Thursday': 'Thursday',
  'weekday.Friday': 'Friday',
  'weekday.Saturday': 'Saturday',
  'weekday.SundayAbbr': 'Sun',
  'weekday.MondayAbbr': 'Mon',
  'weekday.TuesdayAbbr': 'Tue',
  'weekday.WednesdayAbbr': 'Wed',
  'weekday.ThursdayAbbr': 'Thu',
  'weekday.FridayAbbr': 'Fri',
  'weekday.SaturdayAbbr': 'Sat',
  'boolean.Yes': 'Yes',
  'boolean.No': 'No',
  'date.FirstDay': 'First Day',
  'date.LastDay': 'Last Day',
} as const;
export const localeCN = {
  'weekDay.name': '星期',
  'weekday.Sunday': '星期日',
  'weekday.Monday': '星期一',
  'weekday.Tuesday': '星期二',
  'weekday.Wednesday': '星期三',
  'weekday.Thursday': '星期四',
  'weekday.Friday': '星期五',
  'weekday.Saturday': '星期六',
  'weekday.SundayAbbr': '日',
  'weekday.MondayAbbr': '一',
  'weekday.TuesdayAbbr': '二',
  'weekday.WednesdayAbbr': '三',
  'weekday.ThursdayAbbr': '四',
  'weekday.FridayAbbr': '五',
  'weekday.SaturdayAbbr': '六',
  'boolean.Yes': '是',
  'boolean.No': '否',
  'date.FirstDay': '第一天',
  'date.LastDay': '最后一天',
} as const;
export const noLocale = {
  'weekDay.name': 'weekDay.name',
  'weekday.Sunday': 'weekday.Sunday',
  'weekday.Monday': 'weekday.Monday',
  'weekday.Tuesday': 'weekday.Tuesday',
  'weekday.Wednesday': 'weekday.Wednesday',
  'weekday.Thursday': 'weekday.Thursday',
  'weekday.Friday': 'weekday.Friday',
  'weekday.Saturday': 'weekday.Saturday',
  'weekday.SundayAbbr': 'weekday.SundayAbbr',
  'weekday.MondayAbbr': 'weekday.MondayAbbr',
  'weekday.TuesdayAbbr': 'weekday.TuesdayAbbr',
  'weekday.WednesdayAbbr': 'weekday.WednesdayAbbr',
  'weekday.ThursdayAbbr': 'weekday.ThursdayAbbr',
  'weekday.FridayAbbr': 'weekday.FridayAbbr',
  'weekday.SaturdayAbbr': 'weekday.SaturdayAbbr',
  'boolean.Yes': 'boolean.Yes',
  'boolean.No': 'boolean.No',
  'date.FirstDay': 'date.FirstDay',
  'date.LastDay': 'date.LastDay',
} as const;

export let locales: typeof localeEN | typeof localeCN | typeof noLocale = noLocale;

export let lang = undefined as LangType | undefined;
export type LangType = 'en-US' | 'zh-CN' | undefined;

export function getLocales(language: LangType) {
  const { localeCN, localeEN, noLocale } = getLocales;
  return language === 'zh-CN' ? localeCN : language ? localeEN : noLocale;
}
getLocales.localeCN = localeCN;
getLocales.localeEN = localeEN;
getLocales.noLocale = noLocale;

type getLocalesType = typeof getLocales;
export function setLang(
  value: LangType | undefined,
  Enum: typeof EnumType,
  getLocales: getLocalesType,
  defaultLocalize: typeof defaultLocalizeType,
) {
  const { genSillyLocalizer } = setLang;
  lang = value;
  getTranslator.lang = lang;
  resourceLocalizer.lang = lang;
  localizeConfigData.lang = lang;
  locales = getLocales(value);
  Enum.localize = value ? genSillyLocalizer(value, getLocales) : defaultLocalize;
}
setLang.genSillyLocalizer = genSillyLocalizer;

export const clearLang = (Enum: typeof EnumType) => {
  lang = undefined;
  locales = noLocale;
  Enum.localize = undefined!;
};
const labelTranslator = getTranslator('label');
const abbrTranslator = getTranslator('abbr');

export const StandardWeekConfig = {
  Sunday: { value: 0, label: 'weekday.Sunday', status: 'error', abbr: 'weekday.SundayAbbr' },
  Monday: { value: 1, label: 'weekday.Monday', status: 'warning', abbr: 'weekday.MondayAbbr' },
  Tuesday: { value: 2, label: 'weekday.Tuesday', status: 'warning', abbr: 'weekday.TuesdayAbbr' },
  Wednesday: { value: 3, label: 'weekday.Wednesday', status: 'success', abbr: 'weekday.WednesdayAbbr' },
  Thursday: { value: 4, label: 'weekday.Thursday', status: 'success', abbr: 'weekday.ThursdayAbbr' },
  Friday: { value: 5, label: 'weekday.Friday', status: 'success', abbr: 'weekday.FridayAbbr' },
  Saturday: { value: 6, label: 'weekday.Saturday', status: 'error', abbr: 'weekday.SaturdayAbbr' },
} as const;
export const FuncLabelStandardWeekConfig = {
  Sunday: { value: 0, label: labelTranslator, abbr: abbrTranslator },
  Monday: { value: 1, label: labelTranslator, abbr: abbrTranslator },
  Tuesday: { value: 2, label: labelTranslator, abbr: abbrTranslator },
  Wednesday: { value: 3, label: labelTranslator, abbr: abbrTranslator },
  Thursday: { value: 4, label: labelTranslator, abbr: abbrTranslator },
  Friday: { value: 5, label: labelTranslator, abbr: abbrTranslator },
  Saturday: { value: 6, label: labelTranslator, abbr: abbrTranslator },
} as const;
export const ShortLabelStandardWeekConfig = {
  Sunday: { value: 0, label: 'Sunday' },
  Monday: { value: 1, label: 'Monday' },
  Tuesday: { value: 2, label: 'Tuesday' },
  Wednesday: { value: 3, label: 'Wednesday' },
  Thursday: { value: 4, label: 'Thursday' },
  Friday: { value: 5, label: 'Friday' },
  Saturday: { value: 6, label: 'Saturday' },
} as const;

export const BooleanStandardConfig = {
  Yes: { value: true, label: 'boolean.Yes' },
  No: { value: false, label: 'boolean.No' },
} as const;

export const DateStandardConfig = {
  FirstDay: { value: new Date(2001, 1, 1), label: 'date.FirstDay' },
  LastDay: { value: new Date(2001, 12, 31), label: 'date.LastDay' },
} as const;

export const WeekConfigWithKey = Object.keys(StandardWeekConfig).reduce((acc, key) => {
  acc[key as TKey] = {
    ...StandardWeekConfig[key as keyof typeof StandardWeekConfig],
    key: key as keyof TConfig,
  } as never;
  return acc;
}, {} as TConfigWithKey);

type TConfig = typeof StandardWeekConfig;

type TKey = keyof TConfig;
type TConfigWithKey = { [key in TKey]: TConfig[key] & { key: key } };

export const WeekStandardArray = Object.keys(StandardWeekConfig).map((key) => ({
  ...StandardWeekConfig[key as keyof typeof StandardWeekConfig],
  key,
  value: StandardWeekConfig[key as keyof typeof StandardWeekConfig].value,
  label: StandardWeekConfig[key as keyof typeof StandardWeekConfig].label,
}));

export const WeekNumberConfig = Object.keys(StandardWeekConfig).reduce(
  (acc, key) => {
    acc[key as TKey] = StandardWeekConfig[key as TKey].value as never;
    return acc;
  },
  {} as { [key in TKey]: TConfig[key]['value'] },
);

export const WeekStringConfig = Object.keys(StandardWeekConfig).reduce(
  (acc, key) => {
    acc[key as TKey] = key as never;
    return acc;
  },
  {} as { [key in TKey]: key },
);

export const WeekCompactConfig = Object.keys(StandardWeekConfig).reduce(
  (acc, key) => {
    acc[key as TKey] = undefined;
    return acc;
  },
  {} as { [key in TKey]: undefined },
);

export const WeekEmptyConfig = Object.keys(StandardWeekConfig).reduce(
  (acc, key) => {
    acc[key as TKey] = {};
    return acc;
  },
  // eslint-disable-next-line @typescript-eslint/ban-types
  {} as { [key in TKey]: {} },
);

export const WeekValueOnlyConfig = Object.keys(StandardWeekConfig).reduce(
  (acc, key) => {
    acc[key as TKey] = { value: StandardWeekConfig[key as TKey].value } as never;
    return acc;
  },
  {} as { [key in TKey]: { value: TConfig[key]['value'] } },
);

export const WeekLabelOnlyConfig = Object.keys(StandardWeekConfig).reduce(
  (acc, key) => {
    acc[key as TKey] = { label: StandardWeekConfig[key as TKey].label } as never;
    return acc;
  },
  {} as { [key in TKey]: { label: TConfig[key]['label'] } },
);

export const WeekMetaOnlyConfig = Object.keys(StandardWeekConfig).reduce(
  (acc, key) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { value, label, ...meta } = StandardWeekConfig[key as TKey];
    acc[key as TKey] = meta as never;
    return acc;
  },
  {} as { [key in TKey]: Omit<TConfig[key], 'value' | 'label'> },
);

export function genSillyLocalizer(language: LangType, getLocales: getLocalesType) {
  // should use function here to avoid closure. this is important for the e2e test cases.
  function sillyLocalize(
    // eslint-disable-next-line @typescript-eslint/ban-types
    content: (typeof noLocale)[keyof typeof noLocale] | (string & {}) | undefined,
  ): string | undefined {
    const { locales } = sillyLocalize;
    return locales[content as keyof typeof locales] ?? content;
  }
  sillyLocalize.locales = getLocales(language);
  return sillyLocalize;
}

// export function labelLocalizer
// eslint-disable-next-line @typescript-eslint/ban-types
export function getTranslator(field: string) {
  function translator(item: EnumItemInterface<StandardEnumItemInit<EnumValue>>) {
    const { parent, parentField } = translator;
    const { genSillyLocalizer, standardWeekConfig, getLocales, lang } = parent;
    const localizer = genSillyLocalizer(lang, getLocales);
    const rawValue =
      standardWeekConfig[item.key as keyof typeof standardWeekConfig][
        parentField as keyof (typeof standardWeekConfig)[keyof typeof standardWeekConfig]
      ];
    return localizer(rawValue as string);
  }
  translator.parent = getTranslator;
  translator.parentField = field;
  return translator;
}
getTranslator.genSillyLocalizer = genSillyLocalizer;
getTranslator.getLocales = getLocales;
getTranslator.standardWeekConfig = StandardWeekConfig;
getTranslator.lang = lang;

export function resourceLocalizer(content: (typeof noLocale)[keyof typeof noLocale] | undefined) {
  const { genSillyLocalizer, getLocales, lang } = resourceLocalizer;
  const localizer = genSillyLocalizer(lang, getLocales);
  return localizer(content);
}
resourceLocalizer.genSillyLocalizer = genSillyLocalizer;
resourceLocalizer.getLocales = getLocales;
resourceLocalizer.noLocale = noLocale;
resourceLocalizer.lang = lang;

export function localizeConfigData(
  config: typeof StandardWeekConfig,
  locales: typeof localeEN | typeof localeCN | typeof noLocale,
): { [key in keyof typeof config]: Omit<(typeof config)[key], 'label'> & { label: string } };
export function localizeConfigData(
  config: typeof StandardWeekConfig,
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  getLocales: getLocalesType,
  defaultLocalize: typeof defaultLocalizeType,
): { [key in keyof typeof config]: Omit<(typeof config)[key], 'label'> & { label: string } };
export function localizeConfigData(
  config: typeof StandardWeekConfig,
  getLocales: getLocalesType | typeof localeEN | typeof localeCN | typeof noLocale,
  defaultLocalize?: typeof defaultLocalizeType,
) {
  const { lang } = localizeConfigData;
  if (typeof getLocales === 'function' && defaultLocalize) {
    const { genSillyLocalizer } = localizeConfigData;
    const localizer = genSillyLocalizer(lang, getLocales);
    return Object.keys(config).reduce(
      (acc, key) => {
        // @ts-expect-error: because cannot assign to 'value' because it is a read-only property.
        acc[key as keyof typeof config] = {
          ...config[key as keyof typeof config],
          label: localizer?.(config[key as keyof typeof config].label),
        };
        return acc;
      },
      {} as typeof config,
    );
  } else {
    const locales = getLocales;
    return Object.keys(config).reduce(
      (acc, key) => {
        // @ts-expect-error: because cannot assign to 'value' because it is a read-only property.
        acc[key as keyof typeof config] = {
          ...config[key as keyof typeof config],
          label: locales[key as keyof typeof locales],
        };
        return acc;
      },
      {} as typeof config,
    );
  }
}
localizeConfigData.genSillyLocalizer = genSillyLocalizer;
localizeConfigData.lang = lang;
