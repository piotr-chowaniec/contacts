import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { createFileRoute, Navigate, useSearch } from "@tanstack/react-router";
import z from "zod";

export const Route = createFileRoute("/_auth/login")({
  validateSearch: z.object({
    redirect: z.string().optional().catch(""),
  }),
  component: LoginComponent,
});

function LoginComponent() {
  const { redirect } = useSearch({ from: "/_auth/login" });

  return (
    <>
      <SignedIn>
        <Navigate to={redirect || "/contacts"} />
      </SignedIn>
      <SignedOut>
        <div className="flex w-full flex-col items-center gap-4 pt-10">
          <div>Please sign in</div>
          <SignInButton />
        </div>
      </SignedOut>
    </>
  );
}
