import { abiFactory } from '@/utils/abi';
import { SmartContract } from '@/utils/contract';
import { parseHex } from '@/utils/string';
import { BigNumber, ethers } from 'ethers';
import { defaultAbiCoder } from 'ethers/lib/utils';
import { Contract } from 'zksync-ethers';

type InitCallType = {
    target: string;
    allowFailure: boolean;
    value: BigNumber;
    callData: string;
};

type DeployParams = {
    salt: string;
    initializer: string;
};

export class Deployer {
    private contract: SmartContract;
    private factoryContract: Contract;

    constructor() {
        const contract = new SmartContract();
        this.contract = contract;
        this.factoryContract = contract.getContract(
            'accountFactory',
            abiFactory,
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

    public async deploy(salt: string, publicKey: string) {
        const deployParams = this.getDeploymentParams(salt, publicKey);
        const deployRequest = await fetch('/api/deploy', {
            method: 'POST',
            body: JSON.stringify(deployParams),
            headers: {
                'Content-Type': 'application/json',
            },
            referrer: undefined,
        });
        const response = await deployRequest.json();
        return response;
    }

    private getDeploymentParams = (
        salt: string,
        publicKey: string,
    ): DeployParams => {
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

        return {
            salt,
            initializer,
        };
    };
}
