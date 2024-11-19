"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function ContactsNewButton() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <button
      type="submit"
      className="h-8 w-full p-0"
      onClick={() =>
        router.push(`/contacts/new${searchParams ? `?${searchParams.toString()}` : ""}`)
      }
    >
      New
    </button>
  );
}
