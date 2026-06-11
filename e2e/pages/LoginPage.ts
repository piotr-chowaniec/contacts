import { expect, type Locator, type Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly signInPrompt: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signInPrompt = page.getByText("Please sign in");
  }

  async expectRedirectedHere(): Promise<void> {
    await expect(this.page).toHaveURL(/\/login/);
    await expect(this.signInPrompt).toBeVisible();
  }
}
