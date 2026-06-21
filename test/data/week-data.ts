import type { localeCN, localeEN, noLocale } from './week-config';

/** Standard week data, with key, value and label */
export const getStandardWeekData = (locales: typeof localeEN | typeof localeCN | typeof noLocale) =>
  [
    { key: 'Sunday', value: 0, label: locales['weekday.Sunday'] },
    { key: 'Monday', value: 1, label: locales['weekday.Monday'] },
    { key: 'Tuesday', value: 2, label: locales['weekday.Tuesday'] },
    { key: 'Wednesday', value: 3, label: locales['weekday.Wednesday'] },
    { key: 'Thursday', value: 4, label: locales['weekday.Thursday'] },
    { key: 'Friday', value: 5, label: locales['weekday.Friday'] },
    { key: 'Saturday', value: 6, label: locales['weekday.Saturday'] },
  ] as const;

/** Incomplete week data, with key and value, no label (fallback to key) */
export const getWeekDataHasKeyHasValueNoLabel = () =>
  [
    { key: 'Sunday', value: 0, label: 'Sunday' },
    { key: 'Monday', value: 1, label: 'Monday' },
    { key: 'Tuesday', value: 2, label: 'Tuesday' },
    { key: 'Wednesday', value: 3, label: 'Wednesday' },
    { key: 'Thursday', value: 4, label: 'Thursday' },
    { key: 'Friday', value: 5, label: 'Friday' },
    { key: 'Saturday', value: 6, label: 'Saturday' },
  ] as const;

/** Incomplete week data, with key only, with value ({}) and label (fallback to key) */
export const getWeekDataHasKeyEmptyObjectValueNoLabel = () =>
  [
    { key: 'Sunday', value: 'Sunday', label: 'Sunday' },
    { key: 'Monday', value: 'Monday', label: 'Monday' },
    { key: 'Tuesday', value: 'Tuesday', label: 'Tuesday' },
    { key: 'Wednesday', value: 'Wednesday', label: 'Wednesday' },
    { key: 'Thursday', value: 'Thursday', label: 'Thursday' },
    { key: 'Friday', value: 'Friday', label: 'Friday' },
    { key: 'Saturday', value: 'Saturday', label: 'Saturday' },
  ] as const;

/**
 * Incomplete week data, with key only, no value (auto-incremented number) and no label (fallback to
 * key)
 */
export const getWeekDataHasKeyAutoIncrementedValue = () =>
  [
    { key: 'Sunday', value: 0, label: 'Sunday' },
    { key: 'Monday', value: 1, label: 'Monday' },
    { key: 'Tuesday', value: 2, label: 'Tuesday' },
    { key: 'Wednesday', value: 3, label: 'Wednesday' },
    { key: 'Thursday', value: 4, label: 'Thursday' },
    { key: 'Friday', value: 5, label: 'Friday' },
    { key: 'Saturday', value: 6, label: 'Saturday' },
  ] as const;

/** Incomplete week data, with key and label, no value (fallback to key) */
export const getWeekDataHasKeyNoValueHasLabel = (locales: typeof localeEN | typeof localeCN | typeof noLocale) =>
  [
    { key: 'Sunday', value: 'Sunday', label: locales['weekday.Sunday'] },
    { key: 'Monday', value: 'Monday', label: locales['weekday.Monday'] },
    { key: 'Tuesday', value: 'Tuesday', label: locales['weekday.Tuesday'] },
    { key: 'Wednesday', value: 'Wednesday', label: locales['weekday.Wednesday'] },
    { key: 'Thursday', value: 'Thursday', label: locales['weekday.Thursday'] },
    { key: 'Friday', value: 'Friday', label: locales['weekday.Friday'] },
    { key: 'Saturday', value: 'Saturday', label: locales['weekday.Saturday'] },
  ] as const;

/** Incomplete week data, with value and label, no key (fallback to value) */
export const getWeekDataHasValueHasLabelNoKey = (locales: typeof localeEN | typeof localeCN | typeof noLocale) =>
  [
    { key: '0', value: 0, label: locales['weekday.Sunday'] },
    { key: '1', value: 1, label: locales['weekday.Monday'] },
    { key: '2', value: 2, label: locales['weekday.Tuesday'] },
    { key: '3', value: 3, label: locales['weekday.Wednesday'] },
    { key: '4', value: 4, label: locales['weekday.Thursday'] },
    { key: '5', value: 5, label: locales['weekday.Friday'] },
    { key: '6', value: 6, label: locales['weekday.Saturday'] },
  ] as const;

/** Incomplete week data, with value only, no key (fallback to value) and label (fallback to value) */
export const getWeekDataHasValueNoKeyNoLabel = () =>
  [
    { key: '0', value: 0, label: '0' },
    { key: '1', value: 1, label: '1' },
    { key: '2', value: 2, label: '2' },
    { key: '3', value: 3, label: '3' },
    { key: '4', value: 4, label: '4' },
    { key: '5', value: 5, label: '5' },
    { key: '6', value: 6, label: '6' },
  ] as const;

export const getStandardBooleanData = (locales: typeof localeEN | typeof localeCN | typeof noLocale) =>
  [
    { key: 'Yes', value: true, label: locales['boolean.Yes'] },
    { key: 'No', value: false, label: locales['boolean.No'] },
  ] as const;

export const getStandardDateData = (locales: typeof localeEN | typeof localeCN | typeof noLocale) =>
  [
    { key: 'FirstDay', value: new Date(2001, 1, 1), label: locales['date.FirstDay'] },
    { key: 'LastDay', value: new Date(2001, 12, 31), label: locales['date.LastDay'] },
  ] as const;
