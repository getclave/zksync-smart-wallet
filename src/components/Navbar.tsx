"use client";
import { useCredentialNullSafe } from "@/store";
import Favicon from "@/app/favicon.png";
import Image from "next/image";
import { formatAddress } from "@/utils";
import { FaExternalLinkAlt, FaGlobe } from "react-icons/fa";

export const Navbar = () => {
  const credential = useCredentialNullSafe();

  return (
    <nav className="container py-4">
      <div className="justify-between items-center flex w-full">
        <Image alt="Logo" src={Favicon} className="w-[48px] h-[48px]" />
        <div className="flex items-center">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400">Wallet</span>
            <div className="flex items-center text-sm">
              {formatAddress(credential.publicAddress)}{" "}
            </div>
          </div>
          <a
            className="ml-2"
            target="_blank"
            href={`https://explorer.zksync.io/address/${credential.publicAddress}`}
          >
            <FaExternalLinkAlt size={14} />
          </a>
        </div>
      </div>
    </nav>
  );
};
