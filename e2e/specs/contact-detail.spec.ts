import { expect, test } from "../utils/index.js";
import { ContactDetailPage } from "../pages/ContactDetailPage.js";
import { ContactsListPage } from "../pages/ContactsListPage.js";

test.describe("Contact detail", () => {
  test("should display the correct contact detail when a contact is selected", async ({ authedPage }) => {
    const listPage = new ContactsListPage(authedPage);
    const detailPage = new ContactDetailPage(authedPage);

    await listPage.goto();
    await listPage.clickContact("Ryan Florence");

    await expect(detailPage.heading).toContainText("Ryan Florence");
    await expect(detailPage.getEmailLink("r.f@some.com")).toBeVisible();
    await expect(detailPage.editButton).toBeVisible();
    await expect(detailPage.deleteButton).toBeVisible();
    await expect(detailPage.favoriteButton).toBeVisible();
  });

  test("should persist the favorite toggle after navigating away", async ({ authedPage }) => {
    const listPage = new ContactsListPage(authedPage);
    const detailPage = new ContactDetailPage(authedPage);

    await listPage.goto();
    await listPage.clickContact("Ryan Florence");

    await expect(detailPage.favoriteButton).toHaveAttribute("aria-label", "Add to favorites");
    await detailPage.clickFavorite();
    await expect(detailPage.favoriteButton).toHaveAttribute("aria-label", "Remove from favorites");

    // Navigate away then back to verify server-side persistence, not just optimistic DOM state
    await listPage.clickContact("Kent C. Dodds");
    await listPage.clickContact("Ryan Florence");

    await expect(detailPage.favoriteButton).toHaveAttribute("aria-label", "Remove from favorites");
  });

  test("should show not-found UI when navigating to a non-existent contact", async ({ authedPage }) => {
    const detailPage = new ContactDetailPage(authedPage);

    await detailPage.goto("00000000-0000-0000-0000-000000000000");

    await expect(detailPage.notFoundMessage).toBeVisible();
  });
});
