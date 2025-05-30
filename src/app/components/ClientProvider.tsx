'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/utils/react-query';
import { Toaster } from 'sonner';
import UserRoleProvider from './UserRoleProvider';

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserRoleProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster richColors position='top-right' duration={5000} />
      </QueryClientProvider>
    </UserRoleProvider>
  );
}
