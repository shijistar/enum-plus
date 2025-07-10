import type TestEngineBase from '../engines/base';

// import './extension-type';

const testExtension = (engine: TestEngineBase) => {
  engine.describe('Enum extends', () => {
    engine.test(
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
        engine.expect(weekEnum.isWeekend(weekEnum.Monday)).toBe(false);
        engine.expect(weekEnum.isWeekend(weekEnum.Friday)).toBe(false);
        engine.expect(weekEnum.isWeekend(weekEnum.Saturday)).toBe(true);
        engine.expect(weekEnum.isWeekend(weekEnum.Sunday)).toBe(true);
        engine.expect(typeof weekEnum.isWeekend).toBe('function');
        engine.expect(typeof weekEnum.toMySelect).toBe('function');
        engine.expect(weekEnum.isWeekend?.toString()).toBe(extend.isWeekend?.toString());
        engine.expect(weekEnum.toMySelect?.toString()).toBe(extend.toMySelect?.toString());
        engine
          .expect(weekEnum.toMySelect?.())
          .toEqual(weekEnum.items.map((item) => ({ value: item.value, title: item.label })));
      }
    );
    engine.test(
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
        engine.expect(weekEnum.isWeekend).toBeUndefined();
      }
    );
    engine.test(
      'Should allow extends for objects only',
      ({ EnumPlus: { Enum } }) => {
        return { Enum };
      },
      ({ Enum }) => {
        engine
          .expect(() => {
            // @ts-expect-error: because want to simulate wrong type
            Enum.extends(1);
          })
          .toThrow();
        engine
          .expect(() => {
            // @ts-expect-error: because want to simulate wrong type
            Enum.extends('string');
          })
          .toThrow();
        engine
          .expect(() => {
            // @ts-expect-error: because want to simulate wrong type
            Enum.extends(null);
          })
          .toThrow();
        engine
          .expect(() => {
            // @ts-expect-error: because want to simulate wrong type
            Enum.extends(true);
          })
          .toThrow();
      }
    );

    engine.test(
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
        engine.expect(typeof weekEnumFirst.isWeekend).toBe('function');
        engine.expect(weekEnumFirst.isWeekend?.toString()).toBe(firstExtends.isWeekend?.toString());
        engine.expect(weekEnumFirst.isWeekend?.(weekEnumFirst.Monday)).toBe(false);
        engine.expect(weekEnumFirst.isWeekend?.(weekEnumFirst.Friday)).toBe(false);
        engine.expect(weekEnumFirst.isWeekend?.(weekEnumFirst.Saturday)).toBe(true);
        engine.expect(weekEnumFirst.isWeekend?.(weekEnumFirst.Sunday)).toBe(true);

        engine.expect(typeof weekEnumSecond.isWeekend).toBe('function');
        engine.expect(weekEnumSecond.toMySelect?.toString()).toBe(secondExtends.toMySelect?.toString());
        engine
          .expect(weekEnumSecond.toMySelect?.())
          .toEqual(weekEnumSecond.items.map((item) => ({ value: item.value, title: item.label })));
      }
    );
  });
};

declare module 'enum-plus/extension' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface EnumExtension<T, K, V> {
    isWeekend(value: number): boolean;
    toMySelect: () => { value: V; title: string }[];
  }
}

export default testExtension;
