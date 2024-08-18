import { IPasskeySigner } from "@/utils/signer";
import { Transaction } from "@/utils/transaction";
import { PopulateTransactionProps } from "@/utils/types";
import ethers, { BigNumber, constants } from "ethers";
import { Interface } from "ethers/lib/utils";
import { Provider, types, utils } from "zksync-ethers";
import { DEFAULT_GAS_PER_PUBDATA_LIMIT } from "zksync-ethers/build/src/utils";

export class Core {
  /**
   *Copy your deployed contract addresses from step 2 of this article
   */
  private contracts = {
    batchCaller: "0x238aDD7ad88F264001D1742cc5Cb210b42fdd88c",
    implementation: "0x73CEB2aC4A5b60f8D2E37fd911e076F0EC2e0a3D",
    registry: "0x3DEF5e03b57B5e6B5C757fF9e819C23Fe23B2791",
    gaslessPaymaster: "0x278247E62a9e8618E1EFbc65A8AD5365955e34C3",
    claveProxy: "0x9f93E3ce1D68385D384174Ac5D62Aa677E4dD696",
    passkeyValidator: "0x1ccc9D109A96Ffd2A6d0AE976dc1290cC0C7258F",
    accountFactory: "0xEA96D4604f5E1B0253E44454d5D8d283217A9161",
  };

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
  private signer: IPasskeySigner;

  constructor(signer: IPasskeySigner) {
    this.provider = new Provider("https://mainnet.era.zksync.io");
    this.publicAddress = constants.AddressZero;
    this.signer = signer;
  }

  /**
   * Getting a specific contract instance
   */
  public async getContract(
    contractName: keyof typeof this.contracts,
    abi: Interface
  ) {
    return new ethers.Contract(
      this.contracts[contractName],
      abi,
      this.provider
    );
  }

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
