import { test as base } from '@playwright/test';
import EnumPage from './EnumPage';

export { expect } from '@playwright/test';

export const legacyTest = base.extend<{
  enumPage: EnumPage;
}>({
  enumPage: async ({ page }, use) => {
    const enumPage = new EnumPage(page);
    await enumPage.gotoLegacy();

    await use(enumPage);
  },
});

legacyTest.beforeEach(async ({ enumPage }) => {
  await enumPage.setupLang();
});
legacyTest.afterEach(async ({ enumPage }) => {
  await enumPage.resetLang();
});
