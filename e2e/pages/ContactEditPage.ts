import { type Locator, type Page } from "@playwright/test";

export class ContactEditPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly avatarUrlInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.getByRole("textbox", { name: "First name" });
    this.lastNameInput = page.getByRole("textbox", { name: "Last name" });
    this.emailInput = page.getByRole("textbox", { name: "Email" });
    this.avatarUrlInput = page.getByRole("textbox", { name: "Avatar URL" });
    this.saveButton = page.getByRole("button", { name: "Save" });
    this.cancelButton = page.getByRole("button", { name: "Cancel" });
  }

  async goto(contactId: string): Promise<void> {
    await this.page.goto(`/contacts/${contactId}/edit`);
  }

  async fill(fields: { firstName?: string; lastName?: string; email?: string; avatarUrl?: string }): Promise<void> {
    if (fields.firstName !== undefined) {
      await this.firstNameInput.fill(fields.firstName);
    }
    if (fields.lastName !== undefined) {
      await this.lastNameInput.fill(fields.lastName);
    }
    if (fields.email !== undefined) {
      await this.emailInput.fill(fields.email);
    }
    if (fields.avatarUrl !== undefined) {
      await this.avatarUrlInput.fill(fields.avatarUrl);
    }
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
