import { ReactNode } from 'react';

export const Layout = ({ children }: { children: ReactNode }) => {
    return <main className="min-h-screen flex flex-col">{children}</main>;
};
