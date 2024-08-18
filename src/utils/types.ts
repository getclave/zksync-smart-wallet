import { IPasskeySigner } from "@/utils/signer";
import { BigNumber } from "ethers";
import { Provider, types } from "zksync-ethers";

export type PopulateTransactionProps = {
  to: string;
  value?: BigNumber;
  data?: string;
};

export type TransactionProps = {
  transaction: types.TransactionRequest;
  provider: Provider;
  signer: IPasskeySigner;
  validatorAddress: string;
};
