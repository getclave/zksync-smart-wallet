import {
  SmartContract,
  IPasskeySigner,
  Transaction,
  PopulateTransactionProps,
  Signer,
} from "@/utils";
import { ZKsyncProvider } from "./provider";
import { BigNumber, constants } from "ethers";
import { Provider, types, utils } from "zksync-ethers";
import { DEFAULT_GAS_PER_PUBDATA_LIMIT } from "zksync-ethers/build/src/utils";

export class Core {
  /**
   * Provider for the ZKsync Mainnet
   */
  private provider: Provider;
  /**
   * Public address of connected wallet
   */
  private publicAddress: string;
  /**
   * Function to sign a message
   */
  private signer: IPasskeySigner | null;

  /**
   * Deployed contracts and utils
   */
  public contracts: SmartContract;

  constructor() {
    this.provider = ZKsyncProvider;
    this.contracts = SmartContract.create();
    this.publicAddress = constants.AddressZero;
    this.signer = null;
  }

  /**
   * @dev Connect the signer
   */
  public connect = async (credentialId: string, publicAddress: string) => {
    this.signer = new Signer(credentialId);
    this.publicAddress = publicAddress;
  };

  /**
   * @dev Estimate the gas limit for a transaction
   */
  public estimateGas = async (
    transaction: types.TransactionRequest
  ): Promise<BigNumber> => {
    try {
      const estimatedGas = await this.provider.estimateGas(transaction);
      return estimatedGas;
    } catch (e) {
      const DEFAULT_GAS_LIMIT = 10_000_000;
      return BigNumber.from(DEFAULT_GAS_LIMIT);
    }
  };

  /**
   * @dev Prepare a transaction object
   */
  public async populateTransaction({
    to,
    value = BigNumber.from(0),
    data = "0x",
  }: PopulateTransactionProps) {
    if (this.signer == null) {
      throw new Error("Signer is not connected");
    }

    let transaction: types.TransactionRequest = {
      to,
      from: this.publicAddress,
      value,
      data,
      type: 113,
      customData: {
        gasPerPubdata: DEFAULT_GAS_PER_PUBDATA_LIMIT,

        // Gasless Paymaster params
        paymasterParams: utils.getPaymasterParams(
          this.contracts.gaslessPaymaster,
          {
            type: "General",
            innerInput: new Uint8Array(),
          }
        ),
      },
    };

    const [gasLimit, gasPrice, { chainId }, nonce] = await Promise.all([
      this.estimateGas(transaction),
      this.provider.getGasPrice(),
      this.provider.getNetwork(),
      this.provider.getTransactionCount(this.publicAddress),
    ]);

    transaction = {
      ...transaction,
      gasPrice,
      nonce,
      gasLimit,
      chainId,
    };

    const populatedTransaction = new Transaction({
      transaction,
      provider: this.provider,
      signer: this.signer,
      validatorAddress: this.contracts.passkeyValidator,
    });

    return populatedTransaction;
  }
}

export const core = new Core();
