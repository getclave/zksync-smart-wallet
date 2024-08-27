import { IPasskeySigner } from '@/utils/signer';
import { BigNumber } from 'ethers';
import { Provider, types } from 'zksync-ethers';

export type Base64 = string;
export type Base64Url = string;

export type PopulateTransactionProps = {
    to: string;
    value?: BigNumber;
    data?: string;
};

export type TransactionProps = {
    transaction: types.TransactionRequest;
    provider: Provider;
    signer: IPasskeySigner;
    validatorAddress: string;
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
