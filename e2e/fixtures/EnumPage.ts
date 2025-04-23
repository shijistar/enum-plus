import type { Page } from '@playwright/test';

export default class EnumPage {
  constructor(public readonly page: Page) {}

  async gotoModern() {
    await this.page.goto('/modern.html');
  }
  async gotoLegacy() {
    await this.page.goto('/legacy.html');
  }
  async setupLang() {
    await this.page.evaluate(() => {
      const {
        EnumPlus: { Enum, defaultLocalize },
        WeekConfig: { setLang, getLocales },
      } = window;

      setLang('en-US', Enum, getLocales, defaultLocalize);
    });
  }
  async resetLang() {
    await this.page.evaluate(() => {
      const {
        EnumPlus: { Enum },
        WeekConfig: { clearLang },
      } = window;
      clearLang(Enum);
    });
  }
}
