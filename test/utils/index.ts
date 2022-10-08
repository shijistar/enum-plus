import type { EnumItemInit, EnumOption, EnumValue, StandardEnumItemInit } from '../../src';
import type { EnumItemClass } from '../../src/enum-item';

export function toPlainEnums<T extends EnumItemInit<EnumValue>>(
  enums: EnumItemClass<any>[],
  fieldNames?: (keyof StandardEnumItemInit<EnumValue> | 'key')[]
): { value?: EnumValue; key?: keyof T; label?: string }[] {
  return enums.map((item) => {
    const obj: { value?: EnumValue; key?: keyof T; label?: string } = {};
    if (!fieldNames || fieldNames.includes('key')) {
      obj.key = item.key as keyof T;
    }
    if (!fieldNames || fieldNames.includes('value')) {
      obj.value = item.value;
    }
    if (!fieldNames || fieldNames.includes('label')) {
      obj.label = item.label;
    }
    return obj;
  });
}

export function getOptionsData<K, V>(options: EnumOption<K, V>[]) {
  return options.map(({ value, label }) => ({ value, label }));
}
