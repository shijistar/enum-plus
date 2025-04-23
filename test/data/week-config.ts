import type { BuiltInLocaleKeys, defaultLocalize as defaultLocalizeType, Enum as EnumType } from '@enum-plus';

export const localeEN = {
  'enum-plus.options.all': 'All',
  'weekDay.name': 'Week Days',
  Sunday: 'Sunday',
  Monday: 'Monday',
  Tuesday: 'Tuesday',
  Wednesday: 'Wednesday',
  Thursday: 'Thursday',
  Friday: 'Friday',
  Saturday: 'Saturday',
  Yes: 'Yes',
  No: 'No',
  FirstDay: 'First Day',
  LastDay: 'Last Day',
} as const;
export const localeCN = {
  'enum-plus.options.all': '全部',
  'weekDay.name': '星期',
  Sunday: '星期日',
  Monday: '星期一',
  Tuesday: '星期二',
  Wednesday: '星期三',
  Thursday: '星期四',
  Friday: '星期五',
  Saturday: '星期六',
  Yes: '是',
  No: '否',
  FirstDay: '第一天',
  LastDay: '最后一天',
} as const;
export const noLocale = {
  'enum-plus.options.all': 'enum-plus.options.all',
  'weekDay.name': 'weekDay.name',
  Sunday: 'weekday.sunday',
  Monday: 'weekday.monday',
  Tuesday: 'weekday.tuesday',
  Wednesday: 'weekday.wednesday',
  Thursday: 'weekday.thursday',
  Friday: 'weekday.friday',
  Saturday: 'weekday.saturday',
  Yes: 'boolean.yes',
  No: 'boolean.no',
  FirstDay: 'date.firstDay',
  LastDay: 'date.lastDay',
} as const;

export let locales: typeof localeEN | typeof localeCN | typeof noLocale = noLocale;

export let lang: 'en-US' | 'zh-CN' | undefined = undefined;

export function getLocales(language: typeof lang) {
  return language === 'zh-CN' ? getLocales.localeCN : language ? getLocales.localeEN : noLocale;
}
getLocales.localeCN = localeCN;
getLocales.localeEN = localeEN;

type getLocalesType = typeof getLocales;
export const setLang = (
  value: typeof lang | undefined,
  Enum: typeof EnumType,
  getLocales: getLocalesType,
  defaultLocalize: typeof defaultLocalizeType
) => {
  lang = value;
  locales = getLocales(value);
  Enum.localize = genSillyLocalizer(value, getLocales, defaultLocalize);
};
export const clearLang = (Enum: typeof EnumType) => {
  lang = undefined;
  locales = noLocale;
  Enum.localize = undefined!;
};

export const StandardWeekConfig = {
  Sunday: { value: 0, label: 'weekday.sunday', status: 'error' },
  Monday: { value: 1, label: 'weekday.monday', status: 'warning' },
  Tuesday: { value: 2, label: 'weekday.tuesday', status: 'warning' },
  Wednesday: { value: 3, label: 'weekday.wednesday', status: 'success' },
  Thursday: { value: 4, label: 'weekday.thursday', status: 'success' },
  Friday: { value: 5, label: 'weekday.friday', status: 'success' },
  Saturday: { value: 6, label: 'weekday.saturday', status: 'error' },
} as const;

export const BooleanStandardConfig = {
  Yes: { value: true, label: 'boolean.yes' },
  No: { value: false, label: 'boolean.no' },
} as const;

export const DateStandardConfig = {
  FirstDay: { value: new Date(2001, 1, 1), label: 'date.firstDay' },
  LastDay: { value: new Date(2001, 12, 31), label: 'date.lastDay' },
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
  {} as { [key in TKey]: TConfig[key]['value'] }
);

export const WeekStringConfig = Object.keys(StandardWeekConfig).reduce(
  (acc, key) => {
    acc[key as TKey] = key as never;
    return acc;
  },
  {} as { [key in TKey]: key }
);

export const WeekCompactConfig = Object.keys(StandardWeekConfig).reduce(
  (acc, key) => {
    acc[key as TKey] = undefined;
    return acc;
  },
  {} as { [key in TKey]: undefined }
);

export const WeekEmptyConfig = Object.keys(StandardWeekConfig).reduce(
  (acc, key) => {
    acc[key as TKey] = {};
    return acc;
  },
  {} as { [key in TKey]: Record<string, never> }
);

export const WeekValueOnlyConfig = Object.keys(StandardWeekConfig).reduce(
  (acc, key) => {
    acc[key as TKey] = { value: StandardWeekConfig[key as TKey].value } as never;
    return acc;
  },
  {} as { [key in TKey]: { value: TConfig[key]['value'] } }
);

export const WeekLabelOnlyConfig = Object.keys(StandardWeekConfig).reduce(
  (acc, key) => {
    acc[key as TKey] = { label: StandardWeekConfig[key as TKey].label } as never;
    return acc;
  },
  {} as { [key in TKey]: { label: TConfig[key]['label'] } }
);

export function genSillyLocalizer(
  language: typeof lang,
  getLocales: getLocalesType,
  defaultLocalize: typeof defaultLocalizeType
) {
  if (!language) return defaultLocalize;

  // should use function here to avoid closure. this is important for the e2e test cases.
  function sillyLocalize(
    content:
      | BuiltInLocaleKeys
      | (typeof StandardWeekConfig)[keyof typeof StandardWeekConfig]['label']
      | NonNullable<string>
      | undefined
  ): typeof content {
    const locales = sillyLocalize.locales;
    switch (content) {
      case 'enum-plus.options.all':
        return locales['enum-plus.options.all'] as typeof content;
      case 'weekDay.name':
        return locales['weekDay.name'] as typeof content;
      case 'weekday.sunday':
        return locales.Sunday as typeof content;
      case 'weekday.monday':
        return locales.Monday as typeof content;
      case 'weekday.tuesday':
        return locales.Tuesday as typeof content;
      case 'weekday.wednesday':
        return locales.Wednesday as typeof content;
      case 'weekday.thursday':
        return locales.Thursday as typeof content;
      case 'weekday.friday':
        return locales.Friday as typeof content;
      case 'weekday.saturday':
        return locales.Saturday as typeof content;
      case 'boolean.yes':
        return locales.Yes as typeof content;
      case 'boolean.no':
        return locales.No as typeof content;
      case 'date.firstDay':
        return locales.FirstDay as typeof content;
      case 'date.lastDay':
        return locales.LastDay as typeof content;
      default:
        return content;
    }
  }
  sillyLocalize.locales = getLocales(language);
  return sillyLocalize;
}

export function localizeConfigData(
  config: typeof StandardWeekConfig,
  getLocales: getLocalesType,
  defaultLocalize: typeof defaultLocalizeType
) {
  const sillyLocalize = genSillyLocalizer(lang, getLocales, defaultLocalize);
  return Object.keys(config).reduce(
    (acc, key) => {
      // @ts-expect-error: because cannot assign to 'value' because it is a read-only property.
      acc[key as keyof typeof config] = {
        ...config[key as keyof typeof config],
        label: sillyLocalize?.(config[key as keyof typeof config].label),
      };
      return acc;
    },
    {} as typeof config
  );
}
