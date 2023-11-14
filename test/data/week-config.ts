export const StandardWeekConfig = {
  Sunday: { value: 0, label: '星期日', aliasName: '礼拜天' },
  Monday: { value: 1, label: '星期一', aliasName: '礼拜一' },
  Tuesday: { value: 2, label: '星期二', aliasName: '礼拜二' },
  Wednesday: { value: 3, label: '星期三', aliasName: '礼拜三' },
  Thursday: { value: 4, label: '星期四', aliasName: '礼拜四' },
  Friday: { value: 5, label: '星期五', aliasName: '礼拜五' },
  Saturday: { value: 6, label: '星期六', aliasName: '礼拜六' },
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
