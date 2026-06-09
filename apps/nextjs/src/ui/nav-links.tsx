"use client";

import { Show } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      <Link
        href="/"
        className={`block px-3 py-2 text-blue-700 ${pathname === "/" ? "font-bold" : ""}`}
      >
        Home
      </Link>
      <Link
        href="/contacts"
        className={`block px-3 py-2 text-blue-700 ${pathname.includes("/contacts") ? "font-bold" : ""}`}
      >
        Contacts
      </Link>
      <Show when="signed-out">
        <Link
          href="/login"
          className={`block px-3 py-2 text-blue-700 ${pathname === "/login" ? "font-bold" : ""}`}
        >
          Sign in
        </Link>
      </Show>
    </>
  );
}
