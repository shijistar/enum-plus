import type { Enum as EnumType } from '@enum-plus';
import type TestAdapterBase from 'test/adapter-one/base';
import { StandardWeekConfig } from '../data/week-config';

const testExtension = (adapter: TestAdapterBase, Enum: typeof EnumType) => {
  adapter.describe('Enum extends', () => {
    adapter.test('Should allow extend new methods', () => {
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
      adapter.expect(weekEnum.isWeekend(weekEnum.Monday)).toBe(false);
      adapter.expect(weekEnum.isWeekend(weekEnum.Friday)).toBe(false);
      adapter.expect(weekEnum.isWeekend(weekEnum.Saturday)).toBe(true);
      adapter.expect(weekEnum.isWeekend(weekEnum.Sunday)).toBe(true);
      adapter.expect(weekEnum.isWeekend).toBe(extend.isWeekend);
      adapter.expect(weekEnum.toMySelect).toBe(extend.toMySelect);
      adapter
        .expect(weekEnum.toMySelect?.())
        .toEqual(weekEnum.items.map((item) => ({ value: item.value, title: item.label })));
    });
    adapter.test('Should allow clearing global extension', () => {
      Enum.extends({
        isWeekend(value: number) {
          return value === 6 || value === 7;
        },
      });
      Enum.extends({ isWeekend: undefined });
      const weekEnum = Enum(StandardWeekConfig);
      adapter.expect(weekEnum.isWeekend).toBeUndefined();
    });
    adapter.test('Should allow extends for objects only', () => {
      adapter
        .expect(() => {
          // @ts-expect-error: because want to simulate wrong type
          Enum.extends(1);
        })
        .toThrow();
      adapter
        .expect(() => {
          // @ts-expect-error: because want to simulate wrong type
          Enum.extends('string');
        })
        .toThrow();
      adapter
        .expect(() => {
          // @ts-expect-error: because want to simulate wrong type
          Enum.extends(null);
        })
        .toThrow();
      adapter
        .expect(() => {
          // @ts-expect-error: because want to simulate wrong type
          Enum.extends(true);
        })
        .toThrow();
    });

    adapter.test('Should allow extending multiple times', () => {
      const firstExtends = {
        isWeekend(value: number) {
          return value === 6 || value === 0;
        },
      };
      Enum.extends(firstExtends);
      const weekEnum = Enum(StandardWeekConfig);
      adapter.expect(weekEnum.isWeekend).toBe(firstExtends.isWeekend);
      adapter.expect(weekEnum.isWeekend?.(weekEnum.Monday)).toBe(false);
      adapter.expect(weekEnum.isWeekend?.(weekEnum.Friday)).toBe(false);
      adapter.expect(weekEnum.isWeekend?.(weekEnum.Saturday)).toBe(true);
      adapter.expect(weekEnum.isWeekend?.(weekEnum.Sunday)).toBe(true);

      const secondExtends = {
        toMySelect(this: ReturnType<typeof Enum>) {
          return this.items.map((item) => ({ value: item.value, title: item.label }));
        },
      };
      Enum.extends(secondExtends);
      adapter.expect(weekEnum.toMySelect).toBe(secondExtends.toMySelect);
      adapter
        .expect(weekEnum.toMySelect?.())
        .toEqual(weekEnum.items.map((item) => ({ value: item.value, title: item.label })));
    });
  });
};

// Enum extensions
declare module 'enum-plus-extend' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface EnumExtension<T, K, V> {
    isWeekend(value: number): boolean;
    toMySelect: () => { value: V; title: string }[];
  }
}

export default testExtension;
