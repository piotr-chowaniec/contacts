import { Suspense } from "react";
import { ContactNew } from "~/ui/contact/contact-new";

import { RouteSpinner } from "@contacts/ui/components/Spinner";

export default function ContactNewPage() {
  return (
    <Suspense fallback={<RouteSpinner />}>
      <ContactNew />
    </Suspense>
  );
}
