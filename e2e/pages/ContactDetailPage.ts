import { type Locator, type Page } from "@playwright/test";

export class ContactDetailPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly editButton: Locator;
  readonly deleteButton: Locator;
  readonly favoriteButton: Locator;
  readonly notFoundMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByTestId("contact-name");
    this.editButton = page.getByRole("button", { name: "Edit" });
    this.deleteButton = page.getByRole("button", { name: "Delete" });
    this.favoriteButton = page.getByRole("button", { name: /favorites/i });
    this.notFoundMessage = page.getByText("Sorry, we failed to get contact details");
  }

  async goto(contactId: string): Promise<void> {
    await this.page.goto(`/contacts/${contactId}`);
  }

  getEmailLink(email: string): Locator {
    return this.page.getByRole("link", { name: email });
  }

  async clickFavorite(): Promise<void> {
    await this.favoriteButton.click();
  }

  async clickEdit(): Promise<void> {
    await this.editButton.click();
  }

  async clickDelete(): Promise<void> {
    await this.deleteButton.click();
  }

  async clickDeleteAndConfirm(): Promise<void> {
    this.page.once("dialog", (dialog) => void dialog.accept());
    await this.deleteButton.click();
  }
}
