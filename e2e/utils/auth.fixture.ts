import { createClerkClient } from "@clerk/backend";
import { clerk, setupClerkTestingToken } from "@clerk/testing/playwright";
import { test as base, type Page } from "@playwright/test";

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });
const API_URL = process.env.VITE_API_URL ?? "http://localhost:3010";

type AuthFixtures = {
  /** Authenticated page with 31 seeded contacts. Use this instead of bare `page` for tests that need auth. */
  authedPage: Page;
  /** Authenticated page with no contacts seeded. Use this for empty-state tests. */
  unseededPage: Page;
};

export const test = base.extend<AuthFixtures>({
  authedPage: async ({ page, baseURL }, use) => {
    const username = `e2e_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const user = await clerkClient.users.createUser({
      username,
      password: "E2eTestPassword123!",
      firstName: "E2e",
      lastName: "Test",
    });

    try {
      // Inject the Clerk testing token (bypasses bot detection) then sign in
      const signInToken = await clerkClient.signInTokens.createSignInToken({ userId: user.id, expiresInSeconds: 60 });
      await setupClerkTestingToken({ page });
      await page.goto(baseURL!);
      await clerk.signIn({ page, signInParams: { strategy: "ticket", ticket: signInToken.token } });

      // Retrieve the session JWT from the browser so we can call the Express API directly
      const token = await page.evaluate<string | null>(async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (await (window as any).Clerk?.session?.getToken()) ?? null;
      });
      if (!token) throw new Error("No Clerk session token available after sign-in");

      // Seed 31 test contacts for this user
      const seedRes = await page.context().request.post(`${API_URL}/contact/seed`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!seedRes.ok()) {
        throw new Error(`Contact seed failed with status ${seedRes.status()}`);
      }

      await use(page);

      // Teardown: get a fresh token (auto-refreshed by Clerk) and bulk-delete contacts
      const teardownToken = await page
        .evaluate<string | null>(async () => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (await (window as any).Clerk?.session?.getToken()) ?? null;
        })
        .catch(() => null);

      if (teardownToken) {
        await page
          .context()
          .request.delete(`${API_URL}/contact`, {
            headers: { Authorization: `Bearer ${teardownToken}` },
          })
          .catch(() => {
            // Best-effort; the Clerk user deletion below prevents orphaned rows
          });
      }
    } finally {
      await clerkClient.users.deleteUser(user.id);
    }
  },

  unseededPage: async ({ page, baseURL }, use) => {
    const username = `e2e_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const user = await clerkClient.users.createUser({
      username,
      password: "E2eTestPassword123!",
      firstName: "E2e",
      lastName: "Test",
    });

    try {
      const signInToken = await clerkClient.signInTokens.createSignInToken({ userId: user.id, expiresInSeconds: 60 });
      await setupClerkTestingToken({ page });
      await page.goto(baseURL!);
      await clerk.signIn({ page, signInParams: { strategy: "ticket", ticket: signInToken.token } });

      await use(page);
    } finally {
      await clerkClient.users.deleteUser(user.id);
    }
  },
});
