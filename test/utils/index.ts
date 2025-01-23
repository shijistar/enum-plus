import type { EnumItemInit, EnumItemOptionData, EnumValue, StandardEnumItemInit } from '../../src';
import type { EnumItemClass } from '../../src/enum-item';

export function toPlainEnums<T extends EnumItemInit<EnumValue>>(
  enums: EnumItemClass<any>[],
  fieldNames: (keyof StandardEnumItemInit<EnumValue> | 'key')[] = ['key', 'value', 'label']
): { value?: EnumValue; key?: keyof T; label?: string }[] {
  return enums.map((item) => {
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
    // @ts-ignore TS7053: 对象无索引签名
    (acc as Record<string, any>)[key] = pickObject(obj[key], fieldNames);
    return acc;
  }, {} as T);
}

export function pickArray<T extends Record<string, any>>(
  array: T[],
  fieldNames: (keyof T)[] = Object.keys(array[0] || {}) as (keyof T)[]
): T[] {
  return array.map((item) => pickObject(item, fieldNames));
}

export function getOptionsData<K, V>(options: EnumItemOptionData<K, V>[]) {
  return options.map(({ value, label }) => ({ value, label }));
}

function pickObject<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  fieldNames: K[] = Object.keys(obj) as K[]
) {
  return fieldNames.reduce((acc, key) => {
    acc[key] = obj[key];
    return acc;
  }, {} as { [key in K]: T[key] });
}
