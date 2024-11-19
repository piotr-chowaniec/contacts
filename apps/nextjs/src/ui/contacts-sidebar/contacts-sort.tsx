"use client";

import { useQueryState } from "nuqs";

import { SortBy } from "./contacts-list";

export function ContactSort() {
  const [sortBy, setSortBy] = useQueryState("sortBy", {
    defaultValue: "",
    shallow: false,
  });

  return (
    <div className="flex w-full items-center gap-2">
      Sort By:
      <select
        value={sortBy}
        onChange={(e) => void setSortBy(e.target.value as SortBy)}
        className="h-8 flex-1 rounded border p-1 px-2"
      >
        {[
          { value: "firstName", label: "First Name" },
          { value: "lastName", label: "Last Name" },
          { value: "email", label: "Email" },
        ].map(({ value, label }) => {
          return <option key={value} value={value} children={label} />;
        })}
      </select>
    </div>
  );
}
