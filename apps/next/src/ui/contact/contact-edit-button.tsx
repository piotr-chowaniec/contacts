"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function ContactEditButton({ contactId }: { contactId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <button
      onClick={() =>
        router.push(`/contacts/${contactId}/edit${searchParams ? `?${searchParams}` : ""}`)
      }
    >
      Edit
    </button>
  );
}
