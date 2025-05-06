import type TestAdapterBase from 'test/adapter-one/base';

const testExtension = (adapter: TestAdapterBase) => {
  adapter.describe('Enum extends', () => {
    adapter.test(
      'Should allow extend new methods',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
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
        return { weekEnum, extend };
      },
      ({ weekEnum, extend }) => {
        adapter.expect(weekEnum.isWeekend(weekEnum.Monday)).toBe(false);
        adapter.expect(weekEnum.isWeekend(weekEnum.Friday)).toBe(false);
        adapter.expect(weekEnum.isWeekend(weekEnum.Saturday)).toBe(true);
        adapter.expect(weekEnum.isWeekend(weekEnum.Sunday)).toBe(true);
        adapter.expect(typeof weekEnum.isWeekend).toBe('function');
        adapter.expect(typeof weekEnum.toMySelect).toBe('function');
        adapter.expect(weekEnum.isWeekend?.toString()).toBe(extend.isWeekend?.toString());
        adapter.expect(weekEnum.toMySelect?.toString()).toBe(extend.toMySelect?.toString());
        adapter
          .expect(weekEnum.toMySelect?.())
          .toEqual(weekEnum.items.map((item) => ({ value: item.value, title: item.label })));
      }
    );
    adapter.test(
      'Should allow clearing global extension',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
        Enum.extends({
          isWeekend(value: number) {
            return value === 6 || value === 7;
          },
        });
        Enum.extends({ isWeekend: undefined });
        const weekEnum = Enum(StandardWeekConfig);
        return { weekEnum };
      },
      ({ weekEnum }) => {
        adapter.expect(weekEnum.isWeekend).toBeUndefined();
      }
    );
    adapter.test(
      'Should allow extends for objects only',
      ({ EnumPlus: { Enum } }) => {
        return { Enum };
      },
      ({ Enum }) => {
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
      }
    );

    adapter.test(
      'Should allow extending multiple times',
      ({ EnumPlus: { Enum }, WeekConfig: { StandardWeekConfig } }) => {
        const firstExtends = {
          isWeekend(value: number) {
            return value === 6 || value === 0;
          },
        };
        const secondExtends = {
          toMySelect(this: ReturnType<typeof Enum>) {
            return this.items.map((item) => ({ value: item.value, title: item.label }));
          },
        };
        Enum.extends(firstExtends);
        const weekEnumFirst = Enum(StandardWeekConfig);
        Enum.extends(secondExtends);
        const weekEnumSecond = Enum(StandardWeekConfig);
        return { weekEnumFirst, weekEnumSecond, firstExtends, secondExtends };
      },
      ({ weekEnumFirst, weekEnumSecond, firstExtends, secondExtends }) => {
        adapter.expect(typeof weekEnumFirst.isWeekend).toBe('function');
        adapter.expect(weekEnumFirst.isWeekend?.toString()).toBe(firstExtends.isWeekend?.toString());
        adapter.expect(weekEnumFirst.isWeekend?.(weekEnumFirst.Monday)).toBe(false);
        adapter.expect(weekEnumFirst.isWeekend?.(weekEnumFirst.Friday)).toBe(false);
        adapter.expect(weekEnumFirst.isWeekend?.(weekEnumFirst.Saturday)).toBe(true);
        adapter.expect(weekEnumFirst.isWeekend?.(weekEnumFirst.Sunday)).toBe(true);

        adapter.expect(typeof weekEnumSecond.isWeekend).toBe('function');
        adapter.expect(weekEnumSecond.toMySelect?.toString()).toBe(secondExtends.toMySelect?.toString());
        adapter
          .expect(weekEnumSecond.toMySelect?.())
          .toEqual(weekEnumSecond.items.map((item) => ({ value: item.value, title: item.label })));
      }
    );
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
