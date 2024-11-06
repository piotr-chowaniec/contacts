import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  return (
    <div className="flex w-full justify-center pt-10">
      <p>This is a Home page</p>
    </div>
  );
}
