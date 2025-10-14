import { RouteSpinner } from "@contacts/ui/components/Spinner";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { getQueryClient } from "~/get-query-client";
import { useGetContactQueryOptions } from "~/server/queryOptions";
import { ContactEdit } from "~/ui/contact/contact-edit";

type Params = Promise<{ id: string }>;

export default async function ContactEditPage(props: { params: Params }) {
  const { id } = await props.params;

  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(useGetContactQueryOptions(id));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<RouteSpinner />}>
        <ContactEdit id={id} />
      </Suspense>
    </HydrationBoundary>
  );
}
