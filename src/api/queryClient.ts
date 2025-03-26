import { QueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 Minuten
      cacheTime: 10 * 60 * 1000, // 10 Minuten
      retry: 1,
      onError: (error: Error) => {
        toast.error(`Fehler: ${error.message}`);
      },
    },
    mutations: {
      onError: (error: Error) => {
        toast.error(`Fehler: ${error.message}`);
      },
    },
  },
}); 