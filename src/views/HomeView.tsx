"use client";
import { tokens } from "@/constants/tokens";
import Image from "next/image";

export const HomeView = () => {
  return (
    <div className="space-y-3">
      {tokens.map((token) => (
        <div
          className="flex bg-slate-900 p-4 rounded-lg items-center"
          key={token.address}
        >
          <Image src={token.icon} alt={token.name} width={40} height={40} />
          <div className="ml-4">
            <p className="text-md">{token.name}</p>
            <p className="text-xs text-gray-400">{token.symbol}</p>
          </div>
          <div className="ml-auto">
            <p className="text-md">
              {0.003124} {token.symbol}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
