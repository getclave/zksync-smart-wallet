'use client';
import { queryClient } from '@/utils';
import { QueryClientProvider } from '@tanstack/react-query';

type Props = {
    children: React.ReactNode;
};

export const QueryClient = ({ children }: Props) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};
