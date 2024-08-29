import { ZKsyncProvider } from '@/utils/provider';
import { ContractInterface } from 'ethers';
import { Provider, Wallet, Contract } from 'zksync-ethers';

type ContractName =
    | 'batchCaller'
    | 'implementation'
    | 'registry'
    | 'gaslessPaymaster'
    | 'claveProxy'
    | 'passkeyValidator'
    | 'accountFactory';

/*
 * Copy your deployed contract addresses from step 2 of this article:
 * // https://mirror.xyz/asgarovf.eth/s_Tftx4GV4ExkIZ22ENivFOJlgp7hAqjfS4t7enE8zg
 */
const contracts: Record<string, string> = {
    batchCaller: '0x1513dB8DdC9420728bFb2830AE6784B26Ac9bf25',
    implementation: '0x5627beD3bA7DFc5D9DbAa0122A52C7F22a2DD4D3',
    registry: '0x7f273AF2576EA32309c32c9bae2b609B6e4484aC',
    gaslessPaymaster: '0xF83F534153358AD6643B358AC3953f6467d5DAe7',
    claveProxy: '0x3b633b071ABFf838d30D1a326744D8277Fad468c',
    passkeyValidator: '0xDA63bBbc0A1a3F94e95c6bdd2DCB7B7112e3C635',
    accountFactory: '0x281d01350B4449D6F4B3a58ce7F342c5221E1636',
};

export class SmartContract {
    private readonly provider: Provider;

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
        wallet: Wallet,
    ) {
        return new Contract(this[contractName], abi, wallet);
    }
}
