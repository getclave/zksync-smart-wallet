'use client';
import { PageTabs, Navbar } from '@/components';
import { Page, usePage } from '@/store';
import { HomeView, SendView } from '@/views';

export const WalletView = () => {
    const page = usePage();

    let pageRenderer = null;
    switch (page) {
        case Page.HOME:
            pageRenderer = <HomeView />;
            break;
        case Page.SEND:
            pageRenderer = <SendView />;
            break;
        case Page.RECEIVE:
            pageRenderer = <div>Receive</div>;
            break;
    }

    return (
        <>
            <Navbar />
            <div className="container mt-4">{pageRenderer}</div>
            <PageTabs />
        </>
    );
};
