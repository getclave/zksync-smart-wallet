import { WebauthnAuthenticationResponse } from '@/utils/types';
import { client } from '@passwordless-id/webauthn/dist/esm';
import type {
    AuthenticationEncoded,
    RegistrationEncoded,
} from '@passwordless-id/webauthn/dist/esm/types';
import * as cbor from 'cbor';

import type {
    AuthenticateOptions,
    RegisterOptions,
} from '@passwordless-id/webauthn/dist/esm/types';
import { BigNumber, ethers } from 'ethers';
import { formatHex, parseHex } from '@/utils/string';

export class Webauthn {
    private static n = BigNumber.from(
        '0xFFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551',
    );
    private static halfN = this.n.div(2);

    private static sanitizeAuthenticationResponse(
        response: AuthenticationEncoded,
    ): WebauthnAuthenticationResponse {
        return {
            id: this.base64ToBase64Url(response.credentialId),
            rawId: this.base64ToBase64Url(response.credentialId),
            response: {
                authenticatorData: this.base64ToBase64Url(
                    response.authenticatorData,
                ),
                clientDataJSON: this.base64ToBase64Url(response.clientData),
                signature: this.base64ToBase64Url(response.signature),

                /* Userhandle might be null if not provided during registration, but we can safely ignore it */
                userHandle: this.fromBase64Url(response.userHandle!),
            },
            type: 'public-key',
        };
    }

    public static async register(publicAddress: string) {
        const registration = await client.register(
            this.getRandomUsername(),
            this.getRandomChallenge(),
            this.getWebauthnRegisterOptions(publicAddress).registerOptions,
        );

        return this.sanitizeRegistrationResponse(registration);
    }

    public static async authenticate(
        credentialId: Array<string>,
        challenge: string,
    ): Promise<WebauthnAuthenticationResponse> {
        const response = await client.authenticate(
            credentialId,
            challenge,
            this.getWebauthnRegisterOptions().authOptions,
        );

        return this.sanitizeAuthenticationResponse(response);
    }

    public static async login() {
        const response = await client.authenticate(
            [],
            this.getRandomChallenge(),
            this.getWebauthnRegisterOptions().authOptions,
        );
        return this.sanitizeAuthenticationResponse(response);
    }

    public static getRandomUsername(): string {
        const date = new Date();
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `${this.padDateComponent(day)}/${this.padDateComponent(
            month,
        )}/${year} ${this.padDateComponent(hours)}:${this.padDateComponent(
            minutes,
        )}`;
    }

    public static fromBase64Url(str: string): string {
        return Buffer.from(this.base64ToBase64Url(str), 'base64').toString(
            'utf-8',
        );
    }

    public static getRandomChallenge(): string {
        const randomString = ethers.utils.randomBytes(20);

        return this.base64ToBase64Url(
            Buffer.from(randomString).toString('base64'),
        );
    }

    public static getPublicKeyFromAuthenticatorData(authData: string): string {
        const authDataBuffer = Buffer.from(this.toBase64(authData), 'base64');
        const credentialData = authDataBuffer.subarray(
            32 + 1 + 4 + 16,
            authDataBuffer.length,
        ); // RP ID Hash + Flags + Counter + AAGUID
        const l = parseInt(credentialData.subarray(0, 2).toString('hex'), 16);
        const credentialPubKey = credentialData.subarray(
            2 + l,
            credentialData.length,
        ); // sizeof(L) + L
        return this.getPublicKeyFromCredentialPublicKey(credentialPubKey);
    }

    private static getPublicKeyFromCredentialPublicKey(
        credentialPublicKey: Uint8Array,
    ): string {
        const publicKey: Map<-2 | -3 | -1 | 1 | 3, Buffer | number> =
            cbor.decode(credentialPublicKey);

        const x = this.bufferToHex(publicKey.get(-2) as Buffer);
        const y = this.bufferToHex(publicKey.get(-3) as Buffer);

        return x.concat(parseHex(y));
    }

    public static base64ToBase64Url(base64: string): string {
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
    }

    public static sanitizeRegistrationResponse(response: RegistrationEncoded) {
        return {
            id: this.base64ToBase64Url(response.credential.id),
            rawId: this.base64ToBase64Url(response.credential.id),
            authenticatorData: this.base64ToBase64Url(
                response.authenticatorData,
            ),
            clientDataJSON: this.base64ToBase64Url(response.clientData),
        };
    }

    public static padDateComponent(component: number): string {
        return component.toString().padStart(2, '0');
    }

    public static getWebauthnRegisterOptions(userHandle?: string): {
        registerOptions: RegisterOptions;
        authOptions: AuthenticateOptions;
        algorithm: string;
    } {
        return {
            registerOptions: {
                authenticatorType: 'auto', // extern => remove browser
                userVerification: 'required',
                timeout: 60000,
                attestation: false,
                debug: false,
                discoverable: 'required',
                userHandle,
            } as RegisterOptions,
            authOptions: {
                authenticatorType: 'auto', // extern => remove browser
                userVerification: 'required',
                timeout: 60000,
            } as AuthenticateOptions,
            algorithm: 'ES256',
        };
    }

    public static bufferToHex(buffer: ArrayBufferLike): string {
        return formatHex(Buffer.from(buffer).toString('hex'));
    }

    public static toBase64(input: string | Buffer): string {
        input = input.toString();
        return this.padString(input).replace(/\-/g, '+').replace(/_/g, '/');
    }
    public static padString(input: string): string {
        const segmentLength = 4;
        const stringLength = input.length;
        const diff = stringLength % segmentLength;

        if (!diff) {
            return input;
        }

        let position = stringLength;
        let padLength = segmentLength - diff;
        const paddedStringLength = stringLength + padLength;
        const buffer = Buffer.alloc(paddedStringLength);

        buffer.write(input);

        while (padLength--) {
            buffer.write('=', position++);
        }

        return buffer.toString();
    }

    public static derToRS(der: Buffer): Array<Buffer> {
        let offset = 3;
        let dataOffset: number;

        if (der[offset] == 0x21) {
            dataOffset = offset + 2;
        } else {
            dataOffset = offset + 1;
        }
        const r = der.slice(dataOffset, dataOffset + 32);
        offset = offset + der[offset] + 1 + 1;
        if (der[offset] == 0x21) {
            dataOffset = offset + 2;
        } else {
            dataOffset = offset + 1;
        }
        const s = der.subarray(dataOffset, dataOffset + 32);
        return [r, s];
    }

    public static bufferFromString(string: string): Buffer {
        return Buffer.from(string, 'utf8');
    }

    public static bufferFromBase64url(base64url: string): Buffer {
        return Buffer.from(this.toBase64(base64url), 'base64');
    }

    public static getRS(signatureBase64Url: string): Array<BigNumber> {
        const signatureBuffer = this.bufferFromBase64url(signatureBase64Url);
        const signatureParsed = this.derToRS(signatureBuffer);

        const sig: Array<BigNumber> = [
            BigNumber.from(this.bufferToHex(signatureParsed[0])),
            BigNumber.from(this.bufferToHex(signatureParsed[1])),
        ];

        if (sig[1].gt(this.halfN)) {
            sig[1] = this.n.sub(sig[1]);
        }

        return sig;
    }

    static hexToBase64Url(hex: string): string {
        return this.base64ToBase64Url(
            Buffer.from(hex, 'hex').toString('base64'),
        );
    }
}
