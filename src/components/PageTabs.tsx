"use client";
import { Page, usePage, useSetPage } from "@/store";
import { mergeClasses } from "@/utils/global";

const inactiveClasses =
  "inline-block p-4 rounded-t hover:bg-slate-800 cursor-pointer";
const activeClasses = "text-slate-900 bg-gray-100 rounded-t hover:bg-gray-100";

export const PageTabs = () => {
  const page = usePage();
  const setPage = useSetPage();

  const pages = [
    {
      name: "Home",
      page: Page.HOME,
    },
    {
      name: "Send",
      page: Page.SEND,
    },
    {
      name: "Receive",
      page: Page.RECEIVE,
    },
  ];

  return (
    <ul className="container mt-4 flex flex-wrap text-sm font-medium text-center border-b border-gray-700">
      {pages.map((p) => {
        return (
          <li className="me-2">
            <a
              onClick={() => setPage(p.page)}
              className={mergeClasses(
                inactiveClasses,
                page === p.page ? activeClasses : undefined
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
