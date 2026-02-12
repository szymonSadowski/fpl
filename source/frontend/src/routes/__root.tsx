import { createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function RootComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative min-h-screen bg-bg-dark text-text-primary">
        {/* Global dot grid */}
        <div className="fixed inset-0 dot-grid opacity-30 pointer-events-none" />
        <div className="relative z-0">
          <Outlet />
        </div>
      </div>
    </QueryClientProvider>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
});
