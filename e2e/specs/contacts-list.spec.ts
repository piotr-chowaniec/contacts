import { expect, test } from "../utils/index.js";
import { ContactDetailPage } from "../pages/ContactDetailPage.js";
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

  test("should keep contact open when sort changes while viewing a contact", async ({ authedPage }) => {
    const listPage = new ContactsListPage(authedPage);
    const detailPage = new ContactDetailPage(authedPage);

    await listPage.goto();
    await listPage.clickContact("Ryan Florence");
    await expect(detailPage.heading).toContainText("Ryan Florence");

    await listPage.sortBy("lastName");

    await expect(detailPage.heading).toContainText("Ryan Florence");
    await expect(listPage.contactItems.nth(1)).toContainText("Giovanni Benussi");
  });

  test("should keep contact open when search is performed while viewing a contact", async ({ authedPage }) => {
    const listPage = new ContactsListPage(authedPage);
    const detailPage = new ContactDetailPage(authedPage);

    await listPage.goto();
    await listPage.clickContact("Ryan Florence");
    await expect(detailPage.heading).toContainText("Ryan Florence");

    await listPage.search("Ryan");

    await expect(detailPage.heading).toContainText("Ryan Florence");
  });

  test("should show empty state when user has no contacts", async ({ unseededPage }) => {
    const listPage = new ContactsListPage(unseededPage);
    await listPage.goto();

    await expect(listPage.emptyState).toBeVisible();
    await expect(listPage.contactItems).toHaveCount(0);
  });
});
