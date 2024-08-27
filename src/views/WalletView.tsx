"use client";
import { PageTabs } from "@/components";
import { Navbar } from "@/components/Navbar";
import { usePage } from "@/store";

enum Page {
  Home,
  Send,
  Receive,
}

export const WalletView = () => {
  const page = usePage();

  return (
    <>
      <Navbar />
      <PageTabs />
    </>
  );
};
