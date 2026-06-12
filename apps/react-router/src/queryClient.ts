import { QueryClient } from "@tanstack/react-query";

// Single QueryClient instance shared between the React component tree
// (<QueryClientProvider>) and the route loaders, which close over it directly.
export const queryClient = new QueryClient();
