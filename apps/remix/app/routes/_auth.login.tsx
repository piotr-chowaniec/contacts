import { SignInButton } from "@clerk/react-router";
import { getAuth } from "@clerk/react-router/ssr.server";
import { type LoaderFunctionArgs, redirect } from "react-router";

export const loader = async (args: LoaderFunctionArgs) => {
  const { userId } = await getAuth(args);

  if (userId) {
    return redirect("/");
  }

  return {};
};

export default function Login() {
  return (
    <div className="flex w-full flex-col items-center gap-4 pt-10">
      <div>Please sign in</div>
      <SignInButton />
    </div>
  );
}
