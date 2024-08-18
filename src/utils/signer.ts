import { formatHex, Webauthn } from "@/utils";
import { AuthenticationEncoded } from "@passwordless-id/webauthn/dist/esm/types";
import { BigNumber } from "ethers";
import { defaultAbiCoder } from "ethers/lib/utils";

export interface IPasskeySigner {
  credentialId: string;
  sign: (data: string) => Promise<string>;
}

export class Signer implements IPasskeySigner {
  public readonly credentialId: string;

  private readonly expectedClientDataPrefix = this.bufferFromString(
    '{"type":"webauthn.get","challenge":"'
  );
  private n = BigNumber.from(
    "0xFFFFFFFF00000000FFFFFFFFFFFFFFFFBCE6FAADA7179E84F3B9CAC2FC632551"
  );
  private halfN = this.n.div(2);
  private webauthn: Webauthn;

  constructor(credentialId: string) {
    this.credentialId = credentialId;
    this.webauthn = new Webauthn();
  }

  public async sign(data: string): Promise<string> {
    const response = await this.webauthn.authenticate(
      [this.credentialId],
      data
    );
    const sanitizedResponse = this.sanitizeResponse(response);

    const authenticatorDataBuffer = this.bufferFromBase64url(
      sanitizedResponse.response.authenticatorData
    );
    const clientDataBuffer = this.bufferFromBase64url(
      sanitizedResponse.response.clientDataJSON
    );
    const rs = this.getRS(sanitizedResponse.response.signature);
    return this.encodeSigature(authenticatorDataBuffer, clientDataBuffer, rs);
  }

  private encodeSigature(
    authenticatorData: Buffer,
    clientData: Buffer,
    rs: Array<BigNumber>
  ): string {
    let clientDataSuffix = clientData
      .subarray(this.expectedClientDataPrefix.length, clientData.length)
      .toString();

    const quoteIndex = clientDataSuffix.indexOf('"');
    clientDataSuffix = clientDataSuffix.slice(quoteIndex);

    return defaultAbiCoder.encode(
      ["bytes", "string", "bytes32[2]"],
      [authenticatorData, clientDataSuffix, rs]
    );
  }

  private sanitizeResponse(response: AuthenticationEncoded) {
    return {
      id: this.base64ToBase64Url(response.credentialId),
      rawId: this.base64ToBase64Url(response.credentialId),
      response: {
        authenticatorData: this.base64ToBase64Url(response.authenticatorData),
        clientDataJSON: this.base64ToBase64Url(response.clientData),
        signature: this.base64ToBase64Url(response.signature),
        userHandle: response.userHandle
          ? this.fromBase64Url(response.userHandle)
          : null,
      },
      type: "public-key",
    };
  }

  private base64ToBase64Url(base64: string) {
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }

  private toBase64(input: string | Buffer): string {
    input = input.toString();
    return this.padString(input).replace(/\-/g, "+").replace(/_/g, "/");
  }

  private fromBase64Url(str: string): string {
    return Buffer.from(this.base64ToBase64Url(str), "base64").toString("utf-8");
  }

  private bufferFromString(string: string): Buffer {
    return Buffer.from(string, "utf8");
  }

  private bufferFromBase64url(base64url: string): Buffer {
    return Buffer.from(this.toBase64(base64url), "base64");
  }

  private getRS(_signatureBase64: string): Array<BigNumber> {
    const signatureBuffer = this.bufferFromBase64url(_signatureBase64);
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

  private padString(input: string): string {
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
      buffer.write("=", position++);
    }

    return buffer.toString();
  }

  private derToRS(der: Buffer): Array<Buffer> {
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

  private bufferToHex(buffer: ArrayBufferLike): string {
    return formatHex(Buffer.from(buffer).toString("hex"));
  }
}
