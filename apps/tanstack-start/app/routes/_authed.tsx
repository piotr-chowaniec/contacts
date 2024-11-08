import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed")({
  beforeLoad: (ops) => {
    if (!ops.context.auth.userId) {
      throw redirect({
        to: "/login",
        search: { redirect: ops.location.href },
      });
    }
  },
});
