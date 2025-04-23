import { expect, test } from '@playwright/test';

// Test the basic functionality of enum
test('enum basic functionality works in modern browsers', async ({ page }) => {
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

// Test the localization functionality of enum
test('enum localization works in modern browsers', async ({ page }) => {
  await page.goto('http://localhost:7080/modern.html');

  const enumTest = await page.evaluate(() => {
    const { Enum } = window.EnumPlus;

    // Set localization function
    Enum.localize = (key) => {
      const translations = {
        'weekday.sunday': '星期日',
        'weekday.monday': '星期一',
      };
      return translations[key as keyof typeof translations] || key;
    };

    const WeekDays = Enum({
      Sunday: { value: 0, label: 'weekday.sunday' },
      Monday: { value: 1, label: 'weekday.monday' },
    });

    return {
      sundayLabel: WeekDays.label(0),
      mondayLabel: WeekDays.label(1),
    };
  });

  expect(enumTest.sundayLabel).toBe('星期日');
  expect(enumTest.mondayLabel).toBe('星期一');
});

// Test the corresponding Legacy functionality
test('enum basic functionality works in legacy browsers', async ({ page }) => {
  await page.goto('http://localhost:7080/legacy.html');
});
