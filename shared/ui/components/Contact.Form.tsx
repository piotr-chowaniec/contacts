import { Contact } from "@contacts/server/db/schema";

export function EditForm({
  contact,
  errors,
  back,
  isPending,
}: {
  contact?: Contact;
  errors?: Record<string, string[] | undefined>;
  back: () => void;
  isPending: boolean;
}) {
  return (
    <>
      <div className="flex">
        <label htmlFor="firstName" className="w-24 pt-2">
          Name
        </label>
        <div className="mr-2 flex flex-1 flex-col gap-2">
          <input
            aria-label="First name"
            defaultValue={contact?.firstName}
            id="firstName"
            name="firstName"
            placeholder="First"
            type="text"
            disabled={isPending}
          />
          {errors?.firstName ? <em className="text-sm text-red-700">{errors.firstName}</em> : null}
        </div>
        <div className="ml-2 flex flex-1 flex-col gap-2">
          <input
            aria-label="Last name"
            defaultValue={contact?.lastName}
            id="lastName"
            name="lastName"
            placeholder="Last"
            type="text"
            disabled={isPending}
          />
          {errors?.lastName ? <em className="text-sm text-red-700">{errors.lastName}</em> : null}
        </div>
      </div>
      <div className="flex">
        <label htmlFor="email" className="w-24 pt-2">
          Email
        </label>
        <div className="flex flex-1 flex-col gap-2">
          <input
            defaultValue={contact?.email}
            id="email"
            name="email"
            placeholder="some@email.com"
            type="email"
            disabled={isPending}
          />
          {errors?.email ? <em className="text-sm text-red-700">{errors.email}</em> : null}
        </div>
      </div>
      <div className="flex">
        <label htmlFor="avatarUrl" className="w-24 pt-2">
          Avatar URL
        </label>
        <div className="flex flex-1 flex-col gap-2">
          <input
            aria-label="Avatar URL"
            defaultValue={contact?.avatarUrl || ""}
            name="avatarUrl"
            placeholder="https://example.com/avatar.jpg"
            type="text"
            disabled={isPending}
          />
          {errors?.avatarUrl ? <em className="text-sm text-red-700">{errors.avatarUrl}</em> : null}
        </div>
      </div>
      <div className="ml-24 flex gap-4">
        <button type="submit" className="w-28" disabled={isPending}>
          {isPending ? "Saving..." : "Save"}
        </button>
        <button
          type="button"
          className="w-24 text-inherit"
          disabled={isPending}
          onClick={() => back()}
        >
          Cancel
        </button>
      </div>
    </>
  );
}
