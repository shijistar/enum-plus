import type { EnumItemOptionData, EnumValue } from '@enum-plus';
import type { EnumItemClass } from '@enum-plus/enum-item';
import type { EnumInit, EnumKey, IEnumValues, StandardEnumItemInit, ValueTypeFromSingleInit } from '@enum-plus/types';

export function toPlainEnums<
  T extends EnumInit<K, V>,
  K extends EnumKey<T> = EnumKey<T>,
  V extends EnumValue = ValueTypeFromSingleInit<T[K], K>,
>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  enums: EnumItemClass<T[K], K, V>[] & IEnumValues<T, K, V>,
  fieldNames: (keyof StandardEnumItemInit<EnumValue> | 'key')[] = ['key', 'value', 'label']
): { value?: EnumValue; key?: keyof T; label?: string }[] {
  return Array.from(enums).map((item) => {
    const obj: { value?: EnumValue; key?: keyof T; label?: string } = {};
    if (fieldNames.includes('key')) {
      obj.key = item.key as keyof T;
    }
    if (fieldNames.includes('value')) {
      obj.value = item.value;
    }
    if (fieldNames.includes('label')) {
      obj.label = item.label;
    }
    return obj;
  });
}

export function pickInitConfig<T extends Record<keyof T, StandardEnumItemInit<EnumValue>>>(
  obj: T,
  fieldNames: (keyof T[keyof T])[] = ['value', 'label']
): T {
  return Object.keys(obj).reduce((acc, key) => {
    (acc as Record<string, unknown>)[key] = pickObject(obj[key as keyof T], fieldNames);
    return acc;
  }, {} as T);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function pickArray<T extends Record<string, any>>(
  array: T[],
  fieldNames: (keyof T)[] = Object.keys(array[0] || {}) as (keyof T)[]
): T[] {
  return array.map((item) => pickObject(item, fieldNames));
}

export function getOptionsData<K, V>(options: EnumItemOptionData<K, V>[]) {
  return Array.from(options).map(({ value, label }) => ({ value, label }));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pickObject<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  fieldNames: K[] = Object.keys(obj) as K[]
) {
  return fieldNames.reduce(
    (acc, key) => {
      acc[key] = obj[key];
      return acc;
    },
    {} as { [key in K]: T[key] }
  );
}
