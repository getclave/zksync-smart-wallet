import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryClient, RecoilWrapper, StateSetter } from '@/components';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'ZKsync Smart Wallet',
    description: 'Simple Smart Wallet implementation on ZKsync',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <QueryClient>
                <RecoilWrapper>
                    <StateSetter />
                    <body className={inter.className}>{children}</body>
                </RecoilWrapper>
            </QueryClient>
        </html>
    );
}
