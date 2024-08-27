import { IPasskeySigner, parseHex, TransactionProps } from '@/utils';
import { providers } from 'ethers';
import { defaultAbiCoder } from 'ethers/lib/utils';
import { EIP712Signer, Provider, types, utils } from 'zksync-ethers';

export class Transaction {
    transaction: types.TransactionRequest;
    provider: Provider;
    signer: IPasskeySigner;
    validatorAddress: string;

    constructor({
        transaction,
        provider,
        signer,
        validatorAddress,
    }: TransactionProps) {
        this.transaction = transaction;
        this.provider = provider;
        this.signer = signer;
        this.validatorAddress = validatorAddress;
    }

    /**
     * @dev Sign the transaction and append the signature
     */
    public async sign(): Promise<string> {
        const signedTxHash = EIP712Signer.getSignedDigest(this.transaction);
        const message = parseHex(signedTxHash.toString());
        const signature = await this.signer.sign(message);
        return defaultAbiCoder.encode(
            ['bytes', 'address', 'bytes[]'],
            [signature, this.validatorAddress, []],
        );
    }

    /**
     * @dev Send the transaction
     */
    public async send(
        transaction: types.TransactionRequest,
    ): Promise<providers.TransactionReceipt> {
        const sentTx = await this.provider.sendTransaction(
            utils.serialize(transaction),
        );
        const txReceipt = await sentTx.wait();
        return txReceipt;
    }

    /**
     * @dev Sign the transaction and send to the network
     */
    public async signAndSend(): Promise<providers.TransactionReceipt> {
        const signature = await this.sign();
        this.transaction = {
            ...this.transaction,
            customData: {
                ...this.transaction.customData,
                customSignature: signature,
            },
        };
        return await this.send(this.transaction);
    }
}
