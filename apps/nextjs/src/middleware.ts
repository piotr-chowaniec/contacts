import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/contacts(.*)"]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    const redirectTo = new URL(
      `/login?redirectTo=${encodeURIComponent(`${req.nextUrl.pathname}${req.nextUrl.search}`)}`,
      req.url,
    ).toString();

    auth().protect({
      unauthenticatedUrl: redirectTo,
    });
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
