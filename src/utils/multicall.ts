import { abiErc20, abiMulticall } from "@/utils/abi";
import { ZKsyncProvider } from "@/utils/provider";
import { BigNumber, Contract, ethers } from "ethers";

type MulticallParams = {
  /* Target (to) addresses of each read call */
  target: string;

  /* Whether revert whole batch for unsucceed read calls */
  allowFailure?: boolean;

  /* Data of each read call */
  callData: string;
};

type Multicall3Input = Array<Array<string | boolean>>;

type Multicall3Response = Array<{
  success: boolean;
  returnData: string;
}>;

type MulticallGetBalancesResponse = Array<{
  /* ERC-20 token address */
  address: string;

  /* ERC-20 token balance */
  balance: BigNumber;
}>;

const BALANCEOF_UINT256_SELECTOR = "0x9cc7f708";

export class Multicall {
  private static multicallContractAddress =
    "0xF9cda624FBC7e059355ce98a31693d299FACd963";
  private static contract = new Contract(
    this.multicallContractAddress,
    abiMulticall,
    ZKsyncProvider
  );

  public static async read(
    params: Array<MulticallParams>
  ): Promise<Multicall3Response> {
    const calls: Multicall3Input = params.map((param) => {
      return [param.target, param.allowFailure ?? true, param.callData];
    });

    return await this.contract.callStatic["aggregate3"](calls);
  }

  public static async getTokenBalances(
    user: string,
    addresses: Array<string>
  ): Promise<MulticallGetBalancesResponse | null> {
    const BATCH_SIZE = 10;
    try {
      const addressBatches: Array<Array<string>> = [];
      for (let i = 0; i < addresses.length; i += BATCH_SIZE) {
        addressBatches.push(addresses.slice(i, i + BATCH_SIZE));
      }
      const promises = addressBatches.map(async (batch) =>
        this._getTokenBalances(user, batch)
      );
      const responses = await Promise.all(promises);
      const returnData: MulticallGetBalancesResponse = [];
      responses.forEach((response) => {
        if (response) {
          returnData.push(...response);
        }
      });
      return returnData;
    } catch (err) {
      return null;
    }
  }

  private static async _getTokenBalances(
    user: string,
    addresses: Array<string>
  ): Promise<MulticallGetBalancesResponse | null> {
    const returnData: MulticallGetBalancesResponse = [];

    const erc20TokenInterface = new ethers.utils.Interface(abiErc20);

    const baseCallData = erc20TokenInterface.encodeFunctionData("balanceOf", [
      user,
    ]);

    const params: Array<MulticallParams> = addresses.map((address) => {
      let callData: string = baseCallData;
      if (address.toLowerCase() === this.getETHAddress()) {
        // selector of balanceOf(uint256) instead of balanceOf(address)
        callData = BALANCEOF_UINT256_SELECTOR.concat(baseCallData.slice(10));
      }

      returnData.push({
        address: address,
        balance: BigNumber.from(0),
      });

      return {
        target: address,
        callData: callData,
      };
    });

    const results: Multicall3Response = await this.read(params);

    for (let i = 0; i < results.length; i++) {
      if (results[i].success === false || results[i].returnData === "0x") {
        continue;
      }

      returnData[i].balance = BigNumber.from(results[i].returnData);
    }

    return returnData;
  }

  private static getETHAddress(): string {
    return "0x000000000000000000000000000000000000800a";
  }
}
