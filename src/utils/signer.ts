import { formatHex, Webauthn } from '@/utils';
import { AuthenticationEncoded } from '@passwordless-id/webauthn/dist/esm/types';
import { BigNumber } from 'ethers';
import { defaultAbiCoder } from 'ethers/lib/utils';

export interface IPasskeySigner {
    credentialId: string;
    sign: (data: string) => Promise<string>;
}

export class Signer implements IPasskeySigner {
    public readonly credentialId: string;

    private readonly expectedClientDataPrefix = Webauthn.bufferFromString(
        '{"type":"webauthn.get","challenge":"',
    );

    constructor(credentialId: string) {
        this.credentialId = credentialId;
    }

    public async sign(data: string): Promise<string> {
        const { response } = await Webauthn.authenticate(
            [this.credentialId],
            data,
        );

        const authenticatorDataBuffer = Webauthn.bufferFromBase64url(
            response.authenticatorData,
        );
        const clientDataBuffer = Webauthn.bufferFromBase64url(
            response.clientDataJSON,
        );
        const rs = Webauthn.getRS(response.signature);
        return this.encodeSigature(
            authenticatorDataBuffer,
            clientDataBuffer,
            rs,
        );
    }

    private encodeSigature(
        authenticatorData: Buffer,
        clientData: Buffer,
        rs: Array<BigNumber>,
    ): string {
        let clientDataSuffix = clientData
            .subarray(this.expectedClientDataPrefix.length, clientData.length)
            .toString();

        const quoteIndex = clientDataSuffix.indexOf('"');
        clientDataSuffix = clientDataSuffix.slice(quoteIndex);

        return defaultAbiCoder.encode(
            ['bytes', 'string', 'bytes32[2]'],
            [authenticatorData, clientDataSuffix, rs],
        );
    }
}
