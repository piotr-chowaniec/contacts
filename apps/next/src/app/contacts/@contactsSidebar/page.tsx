import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { getQueryClient } from "~/get-query-client";
import { useGetMyContactsQueryOptions } from "~/server/queryOptions";
import { ContactsList, type SortBy } from "~/ui/contacts-sidebar/contacts-list";
import { ContactsNewButton } from "~/ui/contacts-sidebar/contacts-new-button";
import { ContactSearch } from "~/ui/contacts-sidebar/contacts-search";
import { ContactSort } from "~/ui/contacts-sidebar/contacts-sort";

import { RouteSpinner } from "@contacts/ui/components/Spinner";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ContactsSidebarPage(props: { searchParams: SearchParams }) {
  const queryClient = getQueryClient();

  const searchParams = await props.searchParams;

  const sortBy = (searchParams.sortBy as SortBy) || "firstName";
  const q = (searchParams.q as string) || "";

  void queryClient.prefetchQuery(useGetMyContactsQueryOptions(q));

  return (
    <>
      <div className="flex w-full flex-col items-center gap-4 px-6">
        <ContactSort />
        <ContactSearch />
        <ContactsNewButton />
      </div>
      <div className="h-full w-full overflow-scroll px-6">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense key={JSON.stringify({ sortBy, q })} fallback={<RouteSpinner />}>
            <ContactsList sortBy={sortBy} q={q} />
          </Suspense>
        </HydrationBoundary>
      </div>
    </>
  );
}
