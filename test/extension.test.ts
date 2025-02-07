import { Enum } from '../src';
import type { EnumItemClass } from '../src/enum-item';
import type { EnumItemInit } from '../src/types';
import { StandardWeekConfig } from './data/week-config';

describe('Enum should be extensible', () => {
  test('Add global extension', () => {
    Enum.extends({
      isWeekend(value: number) {
        return value === 6 || value === 0;
      },
      toArray(this: ReturnType<typeof Enum>) {
        return this.values;
      },
    });
    const weekEnum = Enum(StandardWeekConfig);
    expect(weekEnum.isWeekend(weekEnum.Monday)).toBe(false);
    expect(weekEnum.isWeekend(weekEnum.Friday)).toBe(false);
    expect(weekEnum.isWeekend(weekEnum.Saturday)).toBe(true);
    expect(weekEnum.isWeekend(weekEnum.Sunday)).toBe(true);
    expect(weekEnum.toArray()).toEqual(weekEnum.values);
  });
  test('clear global extension', () => {
    Enum.extends({
      isWeekend(value: number) {
        return value === 6 || value === 7;
      },
    });
    Enum.extends(undefined);
    const weekEnum = Enum(StandardWeekConfig);
    expect(weekEnum.isWeekend).toBeUndefined();
  });
  test('Only allow extends type of object', () => {
    expect(() => {
      // @ts-expect-error: because want to simulate wrong type
      Enum.extends(1);
    }).toThrow();
    expect(() => {
      // @ts-expect-error: because want to simulate wrong type
      Enum.extends('string');
    }).toThrow();
    expect(() => {
      // @ts-expect-error: because want to simulate wrong type
      Enum.extends(null);
    }).toThrow();
    expect(() => {
      // @ts-expect-error: because want to simulate wrong type
      Enum.extends(true);
    }).toThrow();
  });
});

// Enum extensions
declare global {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface EnumExtension<T, K, V> {
    isWeekend(value: number): boolean;
    toArray(): EnumItemClass<EnumItemInit<V>, K, V>[];
  }
}
