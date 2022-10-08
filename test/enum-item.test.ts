import { Enum } from '../src';
import { WeekStandardConfig } from './data/week-config';

describe('the EnumItemClass api', () => {
  test('keyed enum item should be equal to its value', () => {
    const week = Enum(WeekStandardConfig);
    expect(week.Sunday).toBe(0);
    expect(week.Monday).toBe(1);
    expect(week.Tuesday).toBe(2);
    expect(week.Wednesday).toBe(3);
    expect(week.Thursday).toBe(4);
    expect(week.Friday).toBe(5);
    expect(week.Saturday).toBe(6);
  });

  test('[toString] should return enum label', () => {
    const week = Enum(WeekStandardConfig);
    expect(week.values[0].toString()).toBe('星期日');
    expect(week.values[0].toLocaleString()).toBe('星期日');
    expect(week.values[6].toString()).toBe('星期六');
    expect(week.values[6].toLocaleString()).toBe('星期六');
  });

  test('[toStringTag] should return a friendly name', () => {
    const week = Enum(WeekStandardConfig);
    week.values.forEach((item) => {
      expect(Object.prototype.toString.call(item)).toBe('[object EnumItem]');
    });
  });

  test('[valueOf] should return the enum value', () => {
    const week = Enum(WeekStandardConfig);
    expect(week.values[0].valueOf()).toBe(0);
    expect(week.values[6].valueOf()).toBe(6);
  });

  test('[toPrimitive] should be auto converted to a correct primitive type', () => {
    const week = Enum(WeekStandardConfig);
    expect('' + week.values[0]).toBe('星期日');
    expect('' + week.values[6]).toBe('星期六');

    expect(`${week.values[0]}`).toBe('星期日');
    expect(`${week.values[6]}`).toBe('星期六');

    expect(+week.values[0]).toBe(0);
    expect(+week.values[6]).toBe(6);
  });
});
