import { Show, SignInButton } from "@clerk/react";
import { Navigate, useSearchParams } from "react-router";

export function Login() {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/contacts";

  return (
    <>
      <Show when="signed-in">
        <Navigate to={redirect} replace />
      </Show>
      <Show when="signed-out">
        <div className="flex w-full flex-col items-center gap-4 pt-10">
          <div>Please sign in</div>
          <SignInButton />
        </div>
      </Show>
    </>
  );
}
