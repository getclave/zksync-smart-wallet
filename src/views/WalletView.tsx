'use client';
import { PageTabs } from '@/components';
import { Navbar } from '@/components/Navbar';
import { Page, usePage } from '@/store';
import { HomeView } from '@/views/HomeView';

export const WalletView = () => {
    const page = usePage();

    let pageRenderer = null;
    switch (page) {
        case Page.HOME:
            pageRenderer = <HomeView />;
            break;
        case Page.SEND:
            pageRenderer = <div>Send</div>;
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
