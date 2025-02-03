import { DefaultLocalize, Enum, type BuiltInResources } from '../../src';

export const localeEN = {
  'enum-plus.options.all': 'All',
  Sunday: 'Sunday',
  Monday: 'Monday',
  Tuesday: 'Tuesday',
  Wednesday: 'Wednesday',
  Thursday: 'Thursday',
  Friday: 'Friday',
  Saturday: 'Saturday',
} as const;
export const localeCN = {
  'enum-plus.options.all': '全部',
  Sunday: '星期日',
  Monday: '星期一',
  Tuesday: '星期二',
  Wednesday: '星期三',
  Thursday: '星期四',
  Friday: '星期五',
  Saturday: '星期六',
} as const;
export const noLocale = {
  'enum-plus.options.all': 'enum-plus.options.all',
  Sunday: 'weekday.sunday',
  Monday: 'weekday.monday',
  Tuesday: 'weekday.tuesday',
  Wednesday: 'weekday.wednesday',
  Thursday: 'weekday.thursday',
  Friday: 'weekday.friday',
  Saturday: 'weekday.saturday',
} as const;

export let locales: typeof localeEN | typeof localeCN | typeof noLocale = localeEN;

export let lang: 'en-US' | 'zh-CN' | undefined = 'en-US';
export let sillyLocalize = genSillyLocalizer(lang);

function getLocales(language: typeof lang) {
  return language === 'zh-CN' ? localeCN : language ? localeEN : noLocale;
}
export const setLang = (value: typeof lang | undefined) => {
  lang = value;
  locales = getLocales(value);
  sillyLocalize = genSillyLocalizer(value);
  Enum.localize = sillyLocalize;
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

export const WeekConfigWithKey = Object.keys(StandardWeekConfig).reduce((acc, key) => {
  // @ts-ignore TS7053: 对象无索引签名
  acc[key] = {
    ...StandardWeekConfig[key as keyof typeof StandardWeekConfig],
    key: key as keyof TConfig,
  };
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

export const WeekNumberConfig = Object.keys(StandardWeekConfig).reduce((acc, key) => {
  // @ts-ignore TS7053: 对象无索引签名
  acc[key] = StandardWeekConfig[key].value;
  return acc;
}, {} as { [key in TKey]: TConfig[key]['value'] });

export const WeekStringConfig = Object.keys(StandardWeekConfig).reduce((acc, key) => {
  // @ts-ignore TS7053: 对象无索引签名
  acc[key] = key;
  return acc;
}, {} as { [key in TKey]: key });

export const WeekCompactConfig = Object.keys(StandardWeekConfig).reduce((acc, key) => {
  // @ts-ignore TS7053: 对象无索引签名
  acc[key] = undefined;
  return acc;
}, {} as { [key in TKey]: undefined });

export const WeekEmptyConfig = Object.keys(StandardWeekConfig).reduce((acc, key) => {
  // @ts-ignore TS7053: 对象无索引签名
  acc[key] = {};
  return acc;
}, {} as { [key in TKey]: Record<string, never> });

export const WeekValueOnlyConfig = Object.keys(StandardWeekConfig).reduce((acc, key) => {
  // @ts-ignore TS7053: 对象无索引签名
  acc[key] = { value: StandardWeekConfig[key].value };
  return acc;
}, {} as { [key in TKey]: { value: TConfig[key]['value'] } });

export const WeekLabelOnlyConfig = Object.keys(StandardWeekConfig).reduce((acc, key) => {
  // @ts-ignore TS7053: 对象无索引签名
  acc[key] = { label: StandardWeekConfig[key].label };
  return acc;
}, {} as { [key in TKey]: { label: TConfig[key]['label'] } });

export function genSillyLocalizer(language: typeof lang) {
  if (!language) return DefaultLocalize;
  const locales = getLocales(language);
  return function sillyLocalize(
    content:
      | BuiltInResources
      | typeof StandardWeekConfig[keyof typeof StandardWeekConfig]['label']
      // eslint-disable-next-line @typescript-eslint/ban-types
      | (string & {})
      | undefined
  ): typeof content {
    switch (content) {
      case 'enum-plus.options.all':
        return locales['enum-plus.options.all'] as typeof content;
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
      default:
        return content;
    }
  };
}

export function localizeConfigData(config: typeof StandardWeekConfig) {
  if (sillyLocalize) {
    return Object.keys(config).reduce((acc, key) => {
      // @ts-expect-error TS2540: Cannot assign to 'value' because it is a read-only property.
      acc[key as keyof typeof config] = {
        ...config[key as keyof typeof config],
        label: sillyLocalize?.(config[key as keyof typeof config].label),
      };
      return acc;
    }, {} as typeof config);
  }
  return config;
}
