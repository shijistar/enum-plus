import { Enum } from '@enum-plus';
import { StandardWeekConfig } from './data/week-config';

describe('Enum extends', () => {
  test('Should allow extend new methods', () => {
    const extend = {
      isWeekend(value: number) {
        return value === 6 || value === 0;
      },
      toMySelect(this: ReturnType<typeof Enum>) {
        return this.items.map((item) => ({ value: item.value, title: item.label }));
      },
    };
    Enum.extends(extend);
    const weekEnum = Enum(StandardWeekConfig);
    expect(weekEnum.isWeekend(weekEnum.Monday)).toBe(false);
    expect(weekEnum.isWeekend(weekEnum.Friday)).toBe(false);
    expect(weekEnum.isWeekend(weekEnum.Saturday)).toBe(true);
    expect(weekEnum.isWeekend(weekEnum.Sunday)).toBe(true);
    expect(weekEnum.isWeekend).toBe(extend.isWeekend);
    expect(weekEnum.toMySelect).toBe(extend.toMySelect);
    expect(weekEnum.toMySelect?.()).toEqual(weekEnum.items.map((item) => ({ value: item.value, title: item.label })));
  });
  test('Should allow clearing global extension', () => {
    Enum.extends({
      isWeekend(value: number) {
        return value === 6 || value === 7;
      },
    });
    Enum.extends({ isWeekend: undefined });
    const weekEnum = Enum(StandardWeekConfig);
    expect(weekEnum.isWeekend).toBeUndefined();
  });
  test('Should allow extends for objects only', () => {
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

  test('Should allow extending multiple times', () => {
    const firstExtends = {
      isWeekend(value: number) {
        return value === 6 || value === 0;
      },
    };
    Enum.extends(firstExtends);
    const weekEnum = Enum(StandardWeekConfig);
    expect(weekEnum.isWeekend).toBe(firstExtends.isWeekend);
    expect(weekEnum.isWeekend?.(weekEnum.Monday)).toBe(false);
    expect(weekEnum.isWeekend?.(weekEnum.Friday)).toBe(false);
    expect(weekEnum.isWeekend?.(weekEnum.Saturday)).toBe(true);
    expect(weekEnum.isWeekend?.(weekEnum.Sunday)).toBe(true);

    const secondExtends = {
      toMySelect(this: ReturnType<typeof Enum>) {
        return this.items.map((item) => ({ value: item.value, title: item.label }));
      },
    };
    Enum.extends(secondExtends);
    expect(weekEnum.toMySelect).toBe(secondExtends.toMySelect);
    expect(weekEnum.toMySelect?.()).toEqual(weekEnum.items.map((item) => ({ value: item.value, title: item.label })));
  });
});

// Enum extensions
declare module 'enum-plus-extend' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface EnumExtension<T, K, V> {
    isWeekend(value: number): boolean;
    toMySelect: () => { value: V; title: string }[];
  }
}
