'use client';
import { Page, usePage, useSetPage } from '@/store';
import { mergeClasses } from '@/utils/global';

const commonClasses = 'inline-block p-4 rounded-t cursor-pointer w-full';
const inactiveClasses = 'hover:bg-slate-800 cursor-pointer';
const activeClasses = 'text-slate-900 bg-gray-100 hover:bg-gray-100';

const pages = [
    {
        name: 'Home',
        page: Page.HOME,
    },
    {
        name: 'Send',
        page: Page.SEND,
    },
    {
        name: 'Receive',
        page: Page.RECEIVE,
    },
];

export const PageTabs = () => {
    const page = usePage();
    const setPage = useSetPage();

    return (
        <ul className="container mt-auto flex text-sm font-medium text-center justify-center space-x-1 border-t border-e border-l pt-4 rounded-t-xl border-gray-700">
            {pages.map((p) => {
                return (
                    <li className="me-2 w-[33%]" key={p.name}>
                        <a
                            onClick={() => setPage(p.page)}
                            className={mergeClasses(
                                commonClasses,
                                page === p.page
                                    ? activeClasses
                                    : inactiveClasses,
                            )}
                        >
                            {p.name}
                        </a>
                    </li>
                );
            })}
        </ul>
    );
};
