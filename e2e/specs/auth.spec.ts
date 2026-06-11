import { test } from "../utils/index.js";
import { LoginPage } from "../pages/LoginPage.js";

test.describe("Authentication", () => {
  test("should redirect to login when navigating to contacts without authentication", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await page.goto("/contacts");

    await loginPage.expectRedirectedHere();
  });
});
