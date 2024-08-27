import { abiFactory } from "@/utils/abi";
import { SmartContract } from "@/utils/contract";
import { ZKsyncProvider } from "@/utils/provider";
import { parseHex } from "@/utils/string";
import { BigNumber, ethers } from "ethers";
import { defaultAbiCoder } from "ethers/lib/utils";
import { Provider, types } from "zksync-ethers";

type InitCallType = {
  target: string;
  allowFailure: boolean;
  value: BigNumber;
  callData: string;
};

export class Deployer {
  private readonly provider: Provider;
  private contract: SmartContract;
  private factoryContract: ethers.Contract;

  constructor() {
    const contract = new SmartContract();
    this.contract = contract;
    this.factoryContract = contract.getContract("accountFactory", abiFactory);
    this.provider = ZKsyncProvider;
  }

  public static create(): Deployer {
    return new Deployer();
  }

  public getSalt(): string {
    const randomBytes = ethers.utils.randomBytes(32);
    return ethers.utils.keccak256(Buffer.from(randomBytes));
  }

  public async getRandomAddress(salt: string): Promise<string> {
    const address = await this.factoryContract.getAddressForSalt(salt);
    return address;
  }

  public deploy = async (
    salt: string,
    publicKey: string
  ): Promise<types.TransactionReceipt> => {
    const emptyCall: InitCallType = {
      target: ethers.constants.AddressZero,
      allowFailure: false,
      value: BigNumber.from(0),
      callData: "0x",
    };
    const modules: Array<string> = [];

    const SELECTOR = "0x77ba2e75";
    const CALLDATA = defaultAbiCoder.encode(
      [
        "bytes",
        "address",
        "bytes[]",
        "tuple(address target,bool allowFailure,uint256 value,bytes calldata)",
      ],
      [
        publicKey,
        this.contract.passkeyValidator,
        modules,
        [
          emptyCall.target,
          emptyCall.allowFailure,
          emptyCall.value,
          emptyCall.callData,
        ],
      ]
    );

    const initializer = SELECTOR.concat(parseHex(CALLDATA));
    const tx = await this.factoryContract.deployAccount(salt, initializer);
    const receipt: types.TransactionReceipt = await tx.wait();
    return receipt;
  };
}
