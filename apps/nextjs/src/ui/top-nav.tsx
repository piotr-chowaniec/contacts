import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

export default function TopNav() {
  return (
    <div className={`col flex items-center justify-between gap-2 border-b pb-2`}>
      <h1 className="p-2 text-3xl">Contacts App</h1>
      <div className="mr-4 flex items-center">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-10 h-10",
              },
            }}
          />
        </SignedIn>
      </div>
    </div>
  );
}
