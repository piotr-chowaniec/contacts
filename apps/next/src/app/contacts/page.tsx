import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { getQueryClient } from "~/get-query-client";
import { useGetMyContactsQueryOptions } from "~/server/queryOptions";
import { ContactDefaultPage } from "~/ui/contact/contact-index";

import { RouteSpinner } from "@contacts/ui/components/Spinner";

export default function ContactsPage() {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(useGetMyContactsQueryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<RouteSpinner />}>
        <ContactDefaultPage />
      </Suspense>
    </HydrationBoundary>
  );
}
