import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { getQueryClient } from "~/get-query-client";
import { useGetContactQueryOptions } from "~/server/queryOptions";
import { ContactDetails } from "~/ui/contact/contact-details";

import { ContactSkeleton } from "@contacts/ui/components/Contact.Skeleton";

type Params = Promise<{ id: string }>;

export default async function Contact(props: { params: Params }) {
  const { id } = await props.params;

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(useGetContactQueryOptions(id));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ContactSkeleton />}>
        <ContactDetails id={id} />
      </Suspense>
    </HydrationBoundary>
  );
}
