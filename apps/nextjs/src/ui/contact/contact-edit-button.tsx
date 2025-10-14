"use client";

import { useRouter, useSearchParams } from "next/navigation";

export function ContactEditButton({ contactId }: { contactId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <button
      type="button"
      onClick={() =>
        router.push(
          `/contacts/${contactId}/edit${searchParams ? `?${searchParams.toString()}` : ""}`
        )
      }
    >
      Edit
    </button>
  );
}
