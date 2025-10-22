import type { defaultLocalize as defaultLocalizeType, Enum as EnumType } from '@enum-plus';

export const localeEN = {
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
  'weekDay.name': 'weekDay.name',
  Sunday: 'weekday.Sunday',
  Monday: 'weekday.Monday',
  Tuesday: 'weekday.Tuesday',
  Wednesday: 'weekday.Wednesday',
  Thursday: 'weekday.Thursday',
  Friday: 'weekday.Friday',
  Saturday: 'weekday.Saturday',
  Yes: 'boolean.Yes',
  No: 'boolean.No',
  FirstDay: 'date.FirstDay',
  LastDay: 'date.LastDay',
} as const;

export let locales: typeof localeEN | typeof localeCN | typeof noLocale = noLocale;

export let lang: 'en-US' | 'zh-CN' | undefined = undefined;

export function getLocales(language: typeof lang) {
  return language === 'zh-CN' ? getLocales.localeCN : language ? getLocales.localeEN : noLocale;
}
getLocales.localeCN = localeCN;
getLocales.localeEN = localeEN;

type getLocalesType = typeof getLocales;
export function setLang(
  value: typeof lang | undefined,
  Enum: typeof EnumType,
  getLocales: getLocalesType,
  defaultLocalize: typeof defaultLocalizeType
) {
  lang = value;
  locales = getLocales(value);
  Enum.localize = value ? setLang.genSillyLocalizer(value, getLocales, defaultLocalize) : defaultLocalize;
}
setLang.genSillyLocalizer = genSillyLocalizer;

export const clearLang = (Enum: typeof EnumType) => {
  lang = undefined;
  locales = noLocale;
  Enum.localize = undefined!;
};

export const StandardWeekConfig = {
  Sunday: { value: 0, label: noLocale.Sunday, status: 'error' },
  Monday: { value: 1, label: noLocale.Monday, status: 'warning' },
  Tuesday: { value: 2, label: noLocale.Tuesday, status: 'warning' },
  Wednesday: { value: 3, label: noLocale.Wednesday, status: 'success' },
  Thursday: { value: 4, label: noLocale.Thursday, status: 'success' },
  Friday: { value: 5, label: noLocale.Friday, status: 'success' },
  Saturday: { value: 6, label: noLocale.Saturday, status: 'error' },
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
  // eslint-disable-next-line @typescript-eslint/ban-types
  {} as { [key in TKey]: {} }
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

export const WeekMetaOnlyConfig = Object.keys(StandardWeekConfig).reduce(
  (acc, key) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { value, label, ...meta } = StandardWeekConfig[key as TKey];
    acc[key as TKey] = meta as never;
    return acc;
  },
  {} as { [key in TKey]: Omit<TConfig[key], 'value' | 'label'> }
);

export function genSillyLocalizer(
  language: typeof lang,
  getLocales: getLocalesType,
  defaultLocalize: typeof defaultLocalizeType
) {
  // should use function here to avoid closure. this is important for the e2e test cases.
  function sillyLocalize(
    content: (typeof StandardWeekConfig)[keyof typeof StandardWeekConfig]['label'] | NonNullable<string> | undefined
  ): typeof content {
    const locales = sillyLocalize.locales;
    switch (content) {
      case 'weekDay.name':
        return locales['weekDay.name'] as typeof content;
      case 'weekday.Sunday':
        return locales.Sunday as typeof content;
      case 'weekday.Monday':
        return locales.Monday as typeof content;
      case 'weekday.Tuesday':
        return locales.Tuesday as typeof content;
      case 'weekday.Wednesday':
        return locales.Wednesday as typeof content;
      case 'weekday.Thursday':
        return locales.Thursday as typeof content;
      case 'weekday.Friday':
        return locales.Friday as typeof content;
      case 'weekday.Saturday':
        return locales.Saturday as typeof content;
      case 'boolean.youes':
        return locales.Yes as typeof content;
      case 'boolean.No':
        return locales.No as typeof content;
      case 'date.FirstDay':
        return locales.FirstDay as typeof content;
      case 'date.LastDay':
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
  locales: typeof localeEN | typeof localeCN | typeof noLocale
): { [key in keyof typeof config]: Omit<(typeof config)[key], 'label'> & { label: string } };
export function localizeConfigData(
  config: typeof StandardWeekConfig,
  // eslint-disable-next-line @typescript-eslint/unified-signatures
  getLocales: getLocalesType,
  defaultLocalize: typeof defaultLocalizeType
): { [key in keyof typeof config]: Omit<(typeof config)[key], 'label'> & { label: string } };
export function localizeConfigData(
  config: typeof StandardWeekConfig,
  getLocales: getLocalesType | typeof localeEN | typeof localeCN | typeof noLocale,
  defaultLocalize?: typeof defaultLocalizeType
) {
  if (typeof getLocales === 'function' && defaultLocalize) {
    const localizer = localizeConfigData.genSillyLocalizer(lang, getLocales, defaultLocalize);
    return Object.keys(config).reduce(
      (acc, key) => {
        // @ts-expect-error: because cannot assign to 'value' because it is a read-only property.
        acc[key as keyof typeof config] = {
          ...config[key as keyof typeof config],
          label: localizer?.(config[key as keyof typeof config].label),
        };
        return acc;
      },
      {} as typeof config
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
      {} as typeof config
    );
  }
}
localizeConfigData.genSillyLocalizer = genSillyLocalizer;
