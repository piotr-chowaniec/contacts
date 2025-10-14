import { RouteSpinner } from "@contacts/ui/components/Spinner";
import { Suspense } from "react";
import { ContactNew } from "~/ui/contact/contact-new";

export default function ContactNewPage() {
  return (
    <Suspense fallback={<RouteSpinner />}>
      <ContactNew />
    </Suspense>
  );
}
