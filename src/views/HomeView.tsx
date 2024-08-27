"use client";
import { tokens } from "@/constants/tokens";
import {
  Balances,
  useBalances,
  useCredentialNullSafe,
  useSetBalances,
} from "@/store";
import { Multicall } from "@/utils";
import { formatUnits } from "ethers/lib/utils";
import Image from "next/image";
import { useEffect } from "react";

export const HomeView = () => {
  const balances = useBalances();
  const setBalances = useSetBalances();
  const credential = useCredentialNullSafe();

  useEffect(() => {
    Multicall.getTokenBalances(
      credential.publicAddress,
      tokens.map((t) => t.address)
    ).then((balances) => {
      if (balances == null) {
        return;
      }

      const fetchedBalances: Balances = {};
      balances.forEach((balance) => {
        fetchedBalances[balance.address] = balance.balance;
      });
      setBalances(fetchedBalances);
    });
  }, []);

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
              {formatUnits(balances[token.address], token.decimals)}{" "}
              {token.symbol}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
