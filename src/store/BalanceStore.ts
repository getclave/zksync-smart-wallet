import { tokens } from "@/constants/tokens";
import { BigNumber } from "ethers";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";

export type Balances = Record<string, BigNumber>;

export const BalanceStore = atom<Balances>({
  default: tokens
    .map((t) => ({ [t.address]: BigNumber.from(0) }))
    .reduce((a, b) => ({ ...a, ...b }), {}),
  key: "Balance.Atom",
});

export const useBalances = (): Balances => {
  return useRecoilValue(BalanceStore);
};

export const useSetBalances = () => {
  return useSetRecoilState(BalanceStore);
};
