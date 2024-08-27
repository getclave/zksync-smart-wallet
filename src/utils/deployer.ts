import { abiFactory } from "@/utils/abi";
import { SmartContract } from "@/utils/contract";
import { ZKsyncProvider } from "@/utils/provider";
import { ethers } from "ethers";
import { Provider } from "zksync-ethers";

export class Deployer {
  private readonly provider: Provider;
  private contract: SmartContract;

  constructor() {
    this.contract = new SmartContract();
    this.provider = ZKsyncProvider;
  }

  public static create(): Deployer {
    return new Deployer();
  }

  public getSalt(): string {
    const randomBytes = ethers.utils.randomBytes(32);
    return ethers.utils.keccak256(Buffer.from(randomBytes));
  }

  public async getRandomAddress(): Promise<string> {
    const salt = this.getSalt();
    const factoryContract = this.contract.getContract(
      "accountFactory",
      abiFactory
    );
    const address = await factoryContract.getAddressForSalt(salt);
    return address;
  }
}
