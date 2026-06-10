import { expect, test } from "../utils/index.js";
import { ContactsListPage } from "../pages/ContactsListPage.js";

const TOTAL_SEEDED = 31;

test.describe("Contacts list", () => {
  test("should render all seeded contacts", async ({ authedPage }) => {
    const listPage = new ContactsListPage(authedPage);
    await listPage.goto();

    await listPage.waitForCount(TOTAL_SEEDED);
    await expect(listPage.getContactItem("Ryan Florence")).toBeVisible();
    await expect(listPage.getContactItem("Kent C. Dodds")).toBeVisible();
  });

  test("should filter contacts by search query", async ({ authedPage }) => {
    const listPage = new ContactsListPage(authedPage);
    await listPage.goto();

    await listPage.search("Glenn");

    await expect(listPage.contactItems).toHaveCount(1);
    await expect(listPage.getContactItem("Glenn Reyes")).toBeVisible();
  });

  test("should reorder contacts when sort changes", async ({ authedPage }) => {
    const listPage = new ContactsListPage(authedPage);
    await listPage.goto();

    await expect(listPage.contactItems.nth(1)).toContainText("Alexandra Spalato");

    await listPage.sortBy("lastName");
    await expect(listPage.contactItems.nth(1)).toContainText("Giovanni Benussi");
  });

  test("should show empty state when user has no contacts", async ({ unseededPage }) => {
    const listPage = new ContactsListPage(unseededPage);
    await listPage.goto();

    await expect(listPage.emptyState).toBeVisible();
    await expect(listPage.contactItems).toHaveCount(0);
  });
});
