"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { getQueryClient } from "~/get-query-client";
import { deleteContactServerFn } from "~/server/queries";

export function ContactDeleteButton({ contactId }: { contactId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = getQueryClient();

  return (
    <button
      className="text-red-600"
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onClick={async () => {
        const response = confirm("Please confirm you want to delete this contact.");

        if (!response) {
          return;
        }

        await deleteContactServerFn(contactId);

        router.push(`/contacts${searchParams ? `?${searchParams.toString()}` : ""}`);

        await queryClient.invalidateQueries({
          queryKey: ["contact"],
        });
      }}
    >
      Delete
    </button>
  );
}
