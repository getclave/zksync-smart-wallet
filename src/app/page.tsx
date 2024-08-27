'use client';
import { Layout } from '@/components/Layout';
import { useCredential } from '@/store';
import { AuthView, WalletView } from '@/views';

export default function Home() {
    const credential = useCredential();
    return (
        <Layout>{credential == null ? <AuthView /> : <WalletView />}</Layout>
    );
}
