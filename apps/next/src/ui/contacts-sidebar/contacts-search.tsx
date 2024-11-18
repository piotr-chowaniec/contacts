"use client";

import _ from "lodash";
import { useQueryState } from "nuqs";
import { useEffect, useMemo, useState } from "react";

export function ContactSearch() {
  const [querySearch, setQuerySearch] = useQueryState("q", {
    defaultValue: "",
    shallow: false,
  });
  const [queryInput, setQueryInput] = useState(querySearch);

  useEffect(() => {
    if (querySearch !== queryInput) {
      setQueryInput(querySearch);
    }
  }, [querySearch]);

  const debounceSearchParamChange = useMemo(
    () =>
      _.debounce((value: string) => {
        setQuerySearch(value);
      }, 500),
    [],
  );

  return (
    <input
      aria-label="Search contacts"
      id="search"
      name="search"
      className="w-full rounded p-1 px-2"
      onChange={(e) => {
        const value = e.target.value;
        setQueryInput(value);
        debounceSearchParamChange(value);
      }}
      placeholder="Search..."
      value={queryInput}
    />
  );
}
