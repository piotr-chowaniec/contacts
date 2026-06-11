import { expect, test } from "../utils/index.js";
import { ContactDetailPage } from "../pages/ContactDetailPage.js";
import { ContactEditPage } from "../pages/ContactEditPage.js";
import { ContactNewPage } from "../pages/ContactNewPage.js";
import { ContactsListPage } from "../pages/ContactsListPage.js";

test.describe("Contact mutations", () => {
  test("should create a new contact and show it in the sidebar", async ({ authedPage }) => {
    const listPage = new ContactsListPage(authedPage);
    const newPage = new ContactNewPage(authedPage);
    const detailPage = new ContactDetailPage(authedPage);

    await listPage.goto();
    await listPage.clickNew();

    await newPage.fill({ firstName: "Ada", lastName: "Lovelace", email: "ada.lovelace@test.com" });
    await newPage.save();

    await expect(detailPage.heading).toContainText("Ada Lovelace");
    await expect(listPage.getContactItem("Ada Lovelace")).toBeVisible();
  });

  test("should update a contact's name and reflect it in the detail view", async ({ authedPage }) => {
    const listPage = new ContactsListPage(authedPage);
    const detailPage = new ContactDetailPage(authedPage);
    const editPage = new ContactEditPage(authedPage);

    await listPage.goto();
    await listPage.clickContact("Scott Smerchek");
    await detailPage.clickEdit();

    await editPage.fill({ firstName: "Edited" });
    await editPage.save();

    await expect(detailPage.heading).toContainText("Edited Smerchek");
  });
});
