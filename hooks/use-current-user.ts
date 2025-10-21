'use client';

import { useQuery } from '@tanstack/react-query';

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

export function useCurrentUser() {
  return useQuery<CurrentUser>({
    queryKey: ['current-user'],
    queryFn: async () => {
      const res = await fetch('/api/auth/me', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error('Não autorizado');
      }
      const data = await res.json();
      return data.user as CurrentUser;
    },
    staleTime: 5 * 60 * 1000,
    retry: false
  });
}
