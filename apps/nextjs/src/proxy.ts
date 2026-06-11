import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/contacts(.*)"]);

export default clerkMiddleware(async ({ protect }, req) => {
  if (isProtectedRoute(req)) {
    const redirectTo = new URL(
      `/login?redirectTo=${encodeURIComponent(`${req.nextUrl.pathname}${req.nextUrl.search}`)}`,
      req.url
    ).toString();

    await protect({
      unauthenticatedUrl: redirectTo,
    });
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
    "/__clerk/(.*)",
  ],
};
