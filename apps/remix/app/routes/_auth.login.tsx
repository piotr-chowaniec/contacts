import { SignInButton } from "@clerk/remix";
import { getAuth } from "@clerk/remix/ssr.server";
import { LoaderFunctionArgs, redirect } from "@remix-run/node";

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
