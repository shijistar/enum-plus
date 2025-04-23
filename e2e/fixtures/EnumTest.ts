import { test as base } from '@playwright/test';
import EnumPage from './EnumPage';

export { expect } from '@playwright/test';

export const test = base.extend<{
  enumPage: EnumPage;
}>({
  enumPage: async ({ page }, use) => {
    const enumPage = new EnumPage(page);
    await enumPage.gotoModern();

    await use(enumPage);
  },
});

test.beforeEach(async ({ enumPage }) => {
  await enumPage.setupLang();
});
test.afterEach(async ({ enumPage }) => {
  await enumPage.resetLang();
});
