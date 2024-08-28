import { IPasskeySigner } from '@/utils/signer';
import { JsonFragmentType } from '@ethersproject/abi';
import { BigNumber } from 'ethers';
import { Provider, types } from 'zksync-ethers';

export type Base64 = string;
export type Base64Url = string;

export type GetTransactionProps = {
    to: string;
    value?: BigNumber;
    data?: string;
};

export interface JsonFragment {
    readonly name?: string;
    readonly type?: string;

    readonly anonymous?: boolean;

    readonly payable?: boolean;
    readonly constant?: boolean;
    readonly stateMutability?: string;

    readonly inputs?: ReadonlyArray<JsonFragmentType>;
    readonly outputs?: ReadonlyArray<JsonFragmentType>;

    readonly gas?: string;
}

export type GetCalldataProps = {
    abi: Array<JsonFragment | string>;
    method: string;
    args: Array<unknown>;
};

export type TransactionProps = {
    transaction: types.TransactionRequest;
    provider: Provider;
    signer: IPasskeySigner;
    validatorAddress: string;
    gaslessPaymasterAddress: string;
};

export type WebauthnRegistrationResponse = {
    id: Base64Url;
    rawId: Base64Url;
    authenticatorData: Base64Url;
    clientDataJSON: Base64Url;
};

export type WebauthnAuthenticationResponse = {
    id: Base64Url;
    rawId: Base64Url;
    response: {
        authenticatorData: Base64Url;
        clientDataJSON: Base64Url;
        signature: Base64Url;
        userHandle: string;
    };
    type: 'public-key';
};
