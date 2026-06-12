import { useAuth } from "@clerk/react";
import { useCreateContactMutation } from "@contacts/queries";
import { UpdateContactSchema } from "@contacts/server/validation";
import { EditForm } from "@contacts/ui/components/Contact.Form";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";

export function ContactNew() {
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});

  const auth = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const search = searchParams.toString();

  const createContact = useCreateContactMutation(auth);

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

    createContact.mutate(validatedFields.data, {
      onSuccess: ({ contact }) => {
        const pathname = `/contacts/${contact.id}`;
        void navigate(search ? `${pathname}?${search}` : pathname);
      },
    });
  };

  return (
    <form className="flex max-w-xl flex-col gap-4" onSubmit={onSubmit}>
      <EditForm errors={errors} isPending={createContact.isPending} back={() => navigate(-1)} />
    </form>
  );
}
