import { Show, SignInButton, UserButton } from "@clerk/react";
import { Spinner } from "@contacts/ui/components/Spinner";
import { NavLink, Outlet, useNavigation } from "react-router";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block px-3 py-2 text-blue-700${isActive ? " font-bold" : ""}`;

export function RootLayout() {
  const navigation = useNavigation();
  const isPending = navigation.state !== "idle";

  return (
    <div className="flex h-screen w-screen flex-col p-2">
      <div className="col flex items-center justify-between gap-2 border-b pb-2">
        <div className="flex items-center gap-2">
          <h1 className="p-2 text-3xl">Contacts App</h1>
          <div className="h-6 w-6">
            <Spinner show={isPending} />
          </div>
        </div>
        <div className="mr-4 flex items-center">
          <Show when="signed-out">
            <SignInButton />
          </Show>
          <Show when="signed-in">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10! h-10!",
                },
              }}
            />
          </Show>
        </div>
      </div>
      <div className="flex h-full">
        <div className="w-40 divide-y">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/contacts" className={navLinkClass}>
            Contacts
          </NavLink>
          <Show when="signed-out">
            <NavLink to="/login" className={navLinkClass}>
              Sign in
            </NavLink>
          </Show>
        </div>
        <div className="flex h-full flex-1 border-l">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
