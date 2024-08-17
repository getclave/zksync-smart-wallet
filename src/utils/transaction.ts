import { parseHex } from "@/utils/string";
import { TransactionProps } from "@/utils/types";
import { providers } from "ethers";
import { defaultAbiCoder } from "ethers/lib/utils";
import { EIP712Signer, Provider, types, utils } from "zksync-ethers";

export class Transaction {
  transaction: types.TransactionRequest;
  provider: Provider;
  messageSignerFn: (message: string) => Promise<string>;
  validatorAddress: string;

  constructor({
    transaction,
    provider,
    messageSignerFn,
    validatorAddress,
  }: TransactionProps) {
    this.transaction = transaction;
    this.provider = provider;
    this.messageSignerFn = messageSignerFn;
    this.validatorAddress = validatorAddress;
  }

  /**
   * @dev Sign the transaction and append the signature
   */
  public async sign(): Promise<string> {
    const signedTxHash = EIP712Signer.getSignedDigest(this.transaction);
    const message = parseHex(signedTxHash.toString());
    const signature = await this.messageSignerFn(message);
    return defaultAbiCoder.encode(
      ["bytes", "address", "bytes[]"],
      [signature, this.validatorAddress, []]
    );
  }

  public async send(
    transaction: types.TransactionRequest
  ): Promise<providers.TransactionReceipt> {
    const sentTx = await this.provider.sendTransaction(
      utils.serialize(transaction)
    );
    const txReceipt = await sentTx.wait();
    return txReceipt;
  }

  public async signAndSend(): Promise<providers.TransactionReceipt> {
    const signature = await this.sign();
    this.transaction = {
      ...this.transaction,
      customData: {
        ...this.transaction.customData,
        customSignature: signature,
      },
    };
    return await this.send(this.transaction);
  }
}
