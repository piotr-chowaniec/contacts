"use client";

import { useFormStatus } from "react-dom";

export function SeedButton() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className="mt-2" disabled={pending}>
      Seed database
    </button>
  );
}
