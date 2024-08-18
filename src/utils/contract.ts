import { ethers } from "ethers";
import { Interface } from "ethers/lib/utils";
import { Provider } from "zksync-ethers";

type ContractName =
  | "batchCaller"
  | "implementation"
  | "registry"
  | "gaslessPaymaster"
  | "claveProxy"
  | "passkeyValidator"
  | "accountFactory";

export class Contract {
  private readonly provider: Provider;

  /* Copy your deployed contract addresses from step 2 of this article */
  public readonly batchCaller = "0x238aDD7ad88F264001D1742cc5Cb210b42fdd88c";
  public readonly implementation = "0x73CEB2aC4A5b60f8D2E37fd911e076F0EC2e0a3D";
  public readonly registry = "0x3DEF5e03b57B5e6B5C757fF9e819C23Fe23B2791";
  public readonly gaslessPaymaster =
    "0x278247E62a9e8618E1EFbc65A8AD5365955e34C3";
  public readonly claveProxy = "0x9f93E3ce1D68385D384174Ac5D62Aa677E4dD696";
  public readonly passkeyValidator =
    "0x1ccc9D109A96Ffd2A6d0AE976dc1290cC0C7258F";
  public readonly accountFactory = "0xEA96D4604f5E1B0253E44454d5D8d283217A9161";

  constructor(provider: Provider) {
    this.provider = provider;
  }

  /**
   * Getting a specific contract instance
   */
  public async getContract(contractName: ContractName, abi: Interface) {
    return new ethers.Contract(this[contractName], abi, this.provider);
  }
}
