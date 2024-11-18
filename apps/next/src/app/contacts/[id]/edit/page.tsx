import { notFound } from "next/navigation";
import { getContactServerFn } from "~/server/queries";
import { ContactEdit } from "~/ui/contact/contact-edit";

type Params = Promise<{ id: string }>;

export default async function ContactEditPage(props: { params: Params }) {
  const { id } = await props.params;
  const { contact } = await getContactServerFn(id);

  if (!contact) {
    notFound();
  }

  return <ContactEdit contact={contact} />;
}
