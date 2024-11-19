import { SignInButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function LoginPage(props: { searchParams: SearchParams }) {
  const user = await auth();
  const searchParams = await props.searchParams;
  const redirectTo = searchParams.redirectTo;

  if (user.userId) {
    redirect((redirectTo as string) || "/contacts");
  }

  return (
    <div className="flex w-full flex-col items-center gap-4 pt-10">
      <div>Please sign in</div>
      <SignInButton />
    </div>
  );
}
