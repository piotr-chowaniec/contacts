import { Suspense } from "react";
import { ContactDetails } from "~/ui/contact/contact-details";

import { ContactSkeleton } from "@contacts/ui/components/Contact.Skeleton";

type Params = Promise<{ id: string }>;

export default async function Contact(props: { params: Params }) {
  const { id } = await props.params;

  return (
    <Suspense fallback={<ContactSkeleton />}>
      <ContactDetails id={id} />
    </Suspense>
  );
}
