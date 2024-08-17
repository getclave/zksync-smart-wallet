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
  messageSignerFn: (message: string) => Promise<string>;
  validatorAddress: string;
};
