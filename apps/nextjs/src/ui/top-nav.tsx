import { Show, SignInButton, UserButton } from "@clerk/nextjs";

export default function TopNav() {
  return (
    <div className={`col flex items-center justify-between gap-2 border-b pb-2`}>
      <h1 className="p-2 text-3xl">Contacts App</h1>
      <div className="mr-4 flex items-center">
        <Show when="signed-out">
          <SignInButton />
        </Show>
        <Show when="signed-in">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-10 h-10",
              },
            }}
          />
        </Show>
      </div>
    </div>
  );
}
