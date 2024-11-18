import { ClerkProvider } from "@clerk/nextjs";
import { type Metadata } from "next";
import NavLinks from "~/ui/nav-links";
import TopNav from "~/ui/top-nav";

import "@contacts/ui/styles/global.css";

export const metadata: Metadata = {
  title: "Contacts - Next.js",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <div className="flex h-screen w-screen flex-col p-2">
            <TopNav />
            <div className={`flex h-full`}>
              <div className={`w-40 divide-y`}>
                <NavLinks />
              </div>
              <div className={`flex h-full flex-1 border-l`}>{children}</div>
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}