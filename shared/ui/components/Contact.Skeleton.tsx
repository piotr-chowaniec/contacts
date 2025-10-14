export const ContactSkeleton = () => (
  <div className="flex animate-pulse gap-10">
    <div className="h-60 w-60 rounded-3xl bg-gray-300"></div>

    <div className="flex flex-col gap-6">
      <div className="flex h-6 w-64 gap-4 bg-gray-300 align-center"></div>

      <div className="h-6 w-48 bg-gray-300 text-blue-700"></div>

      <div className="flex gap-4">
        <div className="h-10 w-16 rounded-lg bg-gray-300"></div>
        <div className="h-10 w-16 rounded-lg bg-gray-300"></div>
      </div>
    </div>
  </div>
);
