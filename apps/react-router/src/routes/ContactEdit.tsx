import { useAuth } from "@clerk/react";
import { useGetContactQueryOptions, useUpdateContactMutation } from "@contacts/queries";
import { UpdateContactSchema } from "@contacts/server/validation";
import { EditForm } from "@contacts/ui/components/Contact.Form";
import { ContactSkeleton } from "@contacts/ui/components/Contact.Skeleton";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";

export function ContactEdit() {
  return (
    <Suspense fallback={<ContactSkeleton />}>
      <ContactEditInner />
    </Suspense>
  );
}

function ContactEditInner() {
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});

  const { contactId = "" } = useParams();
  const auth = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const search = searchParams.toString();

  const contactQuery = useSuspenseQuery(useGetContactQueryOptions(auth, contactId));
  const { contact } = contactQuery.data;

  const updateContact = useUpdateContactMutation(auth, contactId);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const formData = new FormData(event.target as HTMLFormElement);

    const validatedFields = UpdateContactSchema.safeParse({
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      email: formData.get("email"),
      avatarUrl: formData.get("avatarUrl"),
    });

    if (!validatedFields.success) {
      setErrors(validatedFields.error.flatten().fieldErrors);
      return;
    }

    updateContact.mutate(validatedFields.data, {
      onSuccess: () => {
        const pathname = `/contacts/${contactId}`;
        void navigate(search ? `${pathname}?${search}` : pathname);
      },
    });
  };

  return (
    <form className="flex max-w-xl flex-col gap-4" onSubmit={onSubmit}>
      <EditForm
        contact={contact}
        errors={errors}
        isPending={updateContact.isPending}
        back={() => navigate(-1)}
      />
    </form>
  );
}
