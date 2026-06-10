import { expect, test } from "../fixtures/index.js";

test("contacts list is visible for an authenticated user", async ({ authedPage }) => {
  await authedPage.goto("/contacts");

  // The URL must stay on /contacts (not redirected to /login)
  await expect(authedPage).toHaveURL(/\/contacts/);

  // The contacts sidebar renders a <ul> with at least one seeded contact
  await expect(authedPage.locator("ul > li").first()).toBeVisible();
});
