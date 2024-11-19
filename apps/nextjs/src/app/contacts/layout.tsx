import { NuqsAdapter } from "nuqs/adapters/next/app";

export default function ContactsLayout({
  children,
  contactsSidebar,
}: {
  children: React.ReactNode;
  contactsSidebar: React.ReactNode;
}) {
  return (
    <NuqsAdapter>
      <div className="flex h-full w-80 flex-col items-center gap-4 border-r py-4">
        {contactsSidebar}
      </div>
      <div className="flex-1 p-14">{children}</div>
    </NuqsAdapter>
  );
}
