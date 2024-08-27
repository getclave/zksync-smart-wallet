"use client";
import { useCredentialNullSafe, useSetCredential } from "@/store";
import Favicon from "@/app/favicon.png";
import Image from "next/image";
import { formatAddress, Storage, StorageKeys } from "@/utils";
import { FaExternalLinkAlt } from "react-icons/fa";

export const Navbar = () => {
  const setCredential = useSetCredential();
  const credential = useCredentialNullSafe();

  return (
    <nav className="container py-4">
      <div className="justify-between items-center flex w-full">
        <div className="flex space-x-4 items-center">
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
        <button
          onClick={() => {
            setCredential(null);
            Storage.removeItem(StorageKeys.credential);
          }}
          className="bDanger"
        >
          Disconnect
        </button>
      </div>
    </nav>
  );
};
