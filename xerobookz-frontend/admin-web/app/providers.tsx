"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthProvider } from "@/hooks/useAuth";
import { TenantProvider } from "@/hooks/useTenant";

export function Providers({ children }: { children: React.ReactNode }) {
  // Create QueryClient using useState - this ensures it's only created once per component instance
  // and persists across re-renders
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // to avoid refetching immediately on the client
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TenantProvider>
        <AuthProvider>{children}</AuthProvider>
      </TenantProvider>
    </QueryClientProvider>
  );
}
