import { expect, type Locator, type Page } from "@playwright/test";

export class ContactsListPage {
  readonly page: Page;
  readonly contactItems: Locator;
  readonly searchInput: Locator;
  readonly sortSelect: Locator;
  readonly newButton: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.contactItems = page.getByRole("list", { name: "Contacts" }).getByRole("listitem");
    this.searchInput = page.getByRole("textbox", { name: "Search contacts" });
    this.sortSelect = page.getByRole("combobox", { name: "Sort by" });
    this.newButton = page.getByRole("button", { name: "New" });
    this.emptyState = page.getByText("No contacts");
  }

  async goto(): Promise<void> {
    await this.page.goto("/contacts");
  }

  getContactItem(name: string): Locator {
    return this.contactItems.filter({ hasText: name });
  }

  async waitForCount(count: number): Promise<void> {
    await expect(this.contactItems).toHaveCount(count);
  }

  async search(query: string): Promise<void> {
    await this.searchInput.fill(query);
    await this.page.waitForURL((url) => url.searchParams.get("q") === query);
  }

  async sortBy(value: "firstName" | "lastName" | "email"): Promise<void> {
    await this.sortSelect.selectOption(value);
  }

  async clickContact(name: string): Promise<void> {
    await this.getContactItem(name).click();
  }

  async clickNew(): Promise<void> {
    await this.newButton.click();
  }
}
