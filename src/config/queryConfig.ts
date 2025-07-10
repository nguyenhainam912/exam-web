import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0, 
      refetchOnWindowFocus: false, 
      staleTime: 60 * 1000, 
      gcTime: 5 * 60 * 1000, 
    },
  },
});

export default queryClient;