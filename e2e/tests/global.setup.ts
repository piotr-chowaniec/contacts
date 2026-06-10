import { clerkSetup } from "@clerk/testing/playwright";
import { test as setup } from "@playwright/test";

// Must run serially (Playwright requirement for setup projects)
setup.describe.configure({ mode: "serial" });

setup("global setup", async ({}) => {
  await clerkSetup();
});
