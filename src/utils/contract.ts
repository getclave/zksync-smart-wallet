import { ZKsyncProvider } from "@/utils/provider";
import { ContractInterface } from "ethers";
import { Provider, Wallet, Contract } from "zksync-ethers";

type ContractName =
  | "batchCaller"
  | "implementation"
  | "registry"
  | "gaslessPaymaster"
  | "claveProxy"
  | "passkeyValidator"
  | "accountFactory";

const contracts: Record<string, string> = {
  batchCaller: "0xe72A2d8325719D2c898B34b3E62efA02911c0965",
  implementation: "0xE4B4a001e6b2772E4aB2C4d818410B31Ea76197f",
  registry: "0x865794025d87c60042E8D732Cc94De51b5DAB961",
  gaslessPaymaster: "0x047f29474B4b2f576Ec884c893b10370AA638D63",
  claveProxy: "0x8A273Ec5229D8f1E62D7423D5e2c53f35AdD2B08",
  passkeyValidator: "0xF7060C114A9B0C40AaA2F5a011F3BeCb309b724d",
  accountFactory: "0x847403DaE74221beA08B8F073Cce30475D300045",
};

export class SmartContract {
  private readonly provider: Provider;

  /* Copy your deployed contract addresses from step 2 of this article */
  public readonly batchCaller = contracts.batchCaller;
  public readonly implementation = contracts.implementation;
  public readonly registry = contracts.registry;
  public readonly gaslessPaymaster = contracts.gaslessPaymaster;
  public readonly claveProxy = contracts.claveProxy;
  public readonly passkeyValidator = contracts.passkeyValidator;
  public readonly accountFactory = contracts.accountFactory;

  constructor() {
    this.provider = ZKsyncProvider;
  }

  public static create(): SmartContract {
    return new SmartContract();
  }

  /**
   * Getting a specific contract instance
   */
  public getContract(contractName: ContractName, abi: ContractInterface) {
    return new Contract(this[contractName], abi, this.provider);
  }

  /**
   * Getting a specific contract instance with EOA signer
   */
  public getContractWithEOASigner(
    contractName: ContractName,
    abi: ContractInterface,
    wallet: Wallet
  ) {
    return new Contract(this[contractName], abi, wallet);
  }
}
