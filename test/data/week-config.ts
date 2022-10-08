export const WeekStandardConfig = {
  Sunday: { value: 0, label: '星期日' },
  Monday: { value: 1, label: '星期一' },
  Tuesday: { value: 2, label: '星期二' },
  Wednesday: { value: 3, label: '星期三' },
  Thursday: { value: 4, label: '星期四' },
  Friday: { value: 5, label: '星期五' },
  Saturday: { value: 6, label: '星期六' },
} as const;

type TConfig = typeof WeekStandardConfig;

type TKey = keyof TConfig;

export const WeekStandardArray = Object.keys(WeekStandardConfig).map((key) => ({
  key,
  value: WeekStandardConfig[key].value as number,
  label: WeekStandardConfig[key].label as string,
}));

export const WeekNumberConfig = Object.keys(WeekStandardConfig).reduce((acc, key) => {
  acc[key] = WeekStandardConfig[key].value;
  return acc;
}, {} as { [key in TKey]: TConfig[key]['value'] });

export const WeekStringConfig = Object.keys(WeekStandardConfig).reduce((acc, key) => {
  acc[key] = key;
  return acc;
}, {} as { [key in TKey]: key });

export const WeekCompactConfig = Object.keys(WeekStandardConfig).reduce((acc, key) => {
  acc[key] = undefined;
  return acc;
}, {} as { [key in TKey]: undefined });

export const WeekEmptyConfig = Object.keys(WeekStandardConfig).reduce((acc, key) => {
  acc[key] = {};
  return acc;
}, {} as { [key in TKey]: Record<string, never> });

export const WeekValueOnlyConfig = Object.keys(WeekStandardConfig).reduce((acc, key) => {
  acc[key] = { value: WeekStandardConfig[key].value };
  return acc;
}, {} as { [key in TKey]: { value: TConfig[key]['value'] } });

export const WeekLabelOnlyConfig = Object.keys(WeekStandardConfig).reduce((acc, key) => {
  acc[key] = { label: WeekStandardConfig[key].label };
  return acc;
}, {} as { [key in TKey]: { label: TConfig[key]['label'] } });
