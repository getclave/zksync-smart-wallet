import {
    SmartContract,
    IPasskeySigner,
    Transaction,
    Signer,
    GetCalldataProps,
    GetTransactionProps,
    abiBatchCaller,
    parseHex,
} from '@/utils';
import { ZKsyncProvider } from './provider';
import { BigNumber, constants, ethers } from 'ethers';
import { Provider, types } from 'zksync-ethers';
import { DEFAULT_GAS_PER_PUBDATA_LIMIT } from 'zksync-ethers/build/src/utils';
import { defaultAbiCoder } from 'ethers/lib/utils';

const BATCH_CALL_SIGNATURE = '0x8f0273a9';

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
    public connect = async ({
        credentialId,
        publicAddress,
    }: {
        credentialId: string;
        publicAddress: string;
    }) => {
        this.signer = new Signer(credentialId);
        this.publicAddress = publicAddress;
    };

    public getProvider = (): Provider => {
        return this.provider;
    };

    /**
     * @dev Estimate the gas limit for a transaction
     */
    public estimateGas = async (
        transaction: types.TransactionRequest,
    ): Promise<BigNumber> => {
        try {
            const estimatedGas = await this.provider.estimateGas(transaction);
            return estimatedGas;
        } catch (e) {
            console.error('Failed to estimate', e);
            const DEFAULT_GAS_LIMIT = 10_000_000;
            return BigNumber.from(DEFAULT_GAS_LIMIT);
        }
    };

    public getCalldata = ({ abi, method, args }: GetCalldataProps): string => {
        const iface = new ethers.utils.Interface(abi);
        const calldata = iface.encodeFunctionData(method, args);
        return calldata;
    };

    /**
     * @dev Prepare a transaction object
     */
    public async getTransaction({
        to,
        value = BigNumber.from(0),
        data = '0x',
    }: GetTransactionProps) {
        if (this.signer == null) {
            throw new Error('Signer is not connected');
        }

        let transaction: types.TransactionRequest = {
            to,
            from: this.publicAddress,
            value,
            data,
            type: 113,
            customData: {
                gasPerPubdata: DEFAULT_GAS_PER_PUBDATA_LIMIT,
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

        const tx = new Transaction({
            transaction,
            provider: this.provider,
            signer: this.signer,
            validatorAddress: this.contracts.passkeyValidator,
            gaslessPaymasterAddress: this.contracts.gaslessPaymaster,
        });

        return tx;
    }

    public async getBatchTransaction(...txs: Array<GetTransactionProps>) {
        const to = this.contracts.batchCaller;

        const value = txs.reduce(
            (acc, tx) => acc.add(tx.value ?? BigNumber.from(0)),
            BigNumber.from(0),
        );

        const encodedData = defaultAbiCoder.encode(abiBatchCaller, [
            txs.map((tx) => {
                return {
                    ...tx,
                    value: tx.value ?? BigNumber.from(0),
                    callData: tx.data ?? '0x',
                    allowFailure: false,
                };
            }),
        ]);
        const data = BATCH_CALL_SIGNATURE.concat(parseHex(encodedData));
        return await this.getTransaction({ to, value, data });
    }
}

export const core = new Core();
