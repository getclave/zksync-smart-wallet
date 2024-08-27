import { abiFactory } from '@/utils/abi';
import { SmartContract } from '@/utils/contract';
import { ZKsyncProvider } from '@/utils/provider';
import { parseHex } from '@/utils/string';
import { BigNumber, ethers } from 'ethers';
import { defaultAbiCoder } from 'ethers/lib/utils';
import { types, Wallet, Contract } from 'zksync-ethers';

type InitCallType = {
    target: string;
    allowFailure: boolean;
    value: BigNumber;
    callData: string;
};

export class Deployer {
    private contract: SmartContract;
    private factoryContract: Contract;

    constructor() {
        const contract = new SmartContract();
        this.contract = contract;
        const deployerWallet = new Wallet(
            process.env.NEXT_PUBLIC_DEPLOYER_PRIVATE_KEY!,
            ZKsyncProvider,
        );
        this.factoryContract = contract.getContractWithEOASigner(
            'accountFactory',
            abiFactory,
            deployerWallet,
        );
    }

    public static create(): Deployer {
        return new Deployer();
    }

    public getSalt(): string {
        return ethers.utils.sha256(Buffer.from(ethers.utils.randomBytes(32)));
    }

    public async getAddressForSalt(salt: string): Promise<string> {
        const address = await this.factoryContract.getAddressForSalt(salt);
        return address;
    }

    public deploy = async (
        salt: string,
        publicKey: string,
    ): Promise<types.TransactionReceipt> => {
        const emptyCall: InitCallType = {
            target: ethers.constants.AddressZero,
            allowFailure: false,
            value: BigNumber.from(0),
            callData: '0x',
        };
        const modules: Array<string> = [];

        const SELECTOR = '0x77ba2e75';
        const CALLDATA = defaultAbiCoder.encode(
            [
                'bytes',
                'address',
                'bytes[]',
                'tuple(address target,bool allowFailure,uint256 value,bytes calldata)',
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
            ],
        );

        const initializer = SELECTOR.concat(parseHex(CALLDATA));
        const tx = await this.factoryContract.deployAccount(salt, initializer, {
            gasLimit: 100_000_000,
        });
        const receipt: types.TransactionReceipt = await tx.wait();
        return receipt;
    };
}
