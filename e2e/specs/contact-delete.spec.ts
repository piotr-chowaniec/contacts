import { expect, test } from "../utils/index.js";
import { ContactDetailPage } from "../pages/ContactDetailPage.js";
import { ContactsListPage } from "../pages/ContactsListPage.js";

test.describe("Contact delete", () => {
  test("should remove the contact from the sidebar after deletion is confirmed", async ({ authedPage }) => {
    const listPage = new ContactsListPage(authedPage);
    const detailPage = new ContactDetailPage(authedPage);

    await listPage.goto();
    await listPage.clickContact("Glenn Reyes");

    await detailPage.clickDeleteAndConfirm();

    await expect(listPage.getContactItem("Glenn Reyes")).not.toBeVisible();
  });
});
