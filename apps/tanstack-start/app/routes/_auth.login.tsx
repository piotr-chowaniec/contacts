import { SignInButton } from "@clerk/tanstack-start";
import { createFileRoute, redirect } from "@tanstack/react-router";
import z from "zod";

export const Route = createFileRoute("/_auth/login")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),
  beforeLoad: (ops) => {
    if (ops.context.auth.userId) {
      throw redirect({
        to: ops.search.redirect || "/contacts",
      });
    }
  },
  component: LoginComponent,
});

function LoginComponent() {
  return (
    <div className="flex w-full flex-col items-center gap-4 pt-10">
      <div>Please sign in</div>
      <SignInButton />
    </div>
  );
}
