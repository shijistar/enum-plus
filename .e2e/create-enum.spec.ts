import { expect, test } from '@playwright/test';
import { playwright } from '../test/engines';
import testCreatingEnum from '../test/test-suites/create-enum';

// testCreatingEnum(playwright);
// Test the basic functionality of enum
test('create enum in modern browsers', async ({ page }) => {
  await page.goto('http://localhost:7080/modern.html');

  const enumTest = await page.evaluate(() => {
    const { Enum } = window.EnumPlus;

    const WeekDays = Enum({
      Sunday: { value: 0, label: 'Sunday' },
      Monday: { value: 1, label: 'Monday' },
    });

    return {
      sunday: WeekDays.Sunday === 0,
      sundayLabel: WeekDays.label(0),
      monday: WeekDays.Monday === 1,
      mondayLabel: WeekDays.label(1),
      hasValidValue: WeekDays.has(1),
      hasInvalidValue: WeekDays.has(7),
    };
  });

  expect(enumTest.sunday).toBeTruthy();
  expect(enumTest.sundayLabel).toBe('Sunday');
  expect(enumTest.monday).toBeTruthy();
  expect(enumTest.mondayLabel).toBe('Monday');
  expect(enumTest.hasValidValue).toBeTruthy();
  expect(enumTest.hasInvalidValue).toBeFalsy();
});
