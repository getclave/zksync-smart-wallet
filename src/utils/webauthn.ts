import { WebauthnAuthenticationResponse } from "@/utils/types";
import { client } from "@passwordless-id/webauthn/dist/esm";
import type {
  AuthenticationEncoded,
  RegistrationEncoded,
} from "@passwordless-id/webauthn/dist/esm/types";

import type {
  AuthenticateOptions,
  RegisterOptions,
} from "@passwordless-id/webauthn/dist/esm/types";
import { ethers } from "ethers";

export class Webauthn {
  public static async register(publicAddress: string) {
    const registration = await client.register(
      this.getRandomUsername(),
      this.getRandomChallenge(),
      this.getWebauthnRegisterOptions(publicAddress).registerOptions
    );

    return this.sanitizeRegistrationResponse(registration);
  }

  public static async authenticate(
    credentialId: Array<string>,
    challenge: string
  ): Promise<WebauthnAuthenticationResponse> {
    const response = await client.authenticate(
      credentialId,
      challenge,
      this.getWebauthnRegisterOptions().authOptions
    );

    return this.sanitizeAuthenticationResponse(response);
  }

  public static async login() {
    const response = await client.authenticate(
      [],
      this.getRandomChallenge(),
      this.getWebauthnRegisterOptions().authOptions
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
      month
    )}/${year} ${this.padDateComponent(hours)}:${this.padDateComponent(
      minutes
    )}`;
  }

  public static fromBase64Url(str: string): string {
    return Buffer.from(this.base64ToBase64Url(str), "base64").toString("utf-8");
  }

  public static getRandomChallenge(): string {
    const randomString = ethers.utils.randomBytes(20);

    return this.base64ToBase64Url(Buffer.from(randomString).toString("base64"));
  }

  private static base64ToBase64Url(base64: string): string {
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }

  private static sanitizeAuthenticationResponse(
    response: AuthenticationEncoded
  ): WebauthnAuthenticationResponse {
    return {
      id: this.base64ToBase64Url(response.credentialId),
      rawId: this.base64ToBase64Url(response.credentialId),
      response: {
        authenticatorData: this.base64ToBase64Url(response.authenticatorData),
        clientDataJSON: this.base64ToBase64Url(response.clientData),
        signature: this.base64ToBase64Url(response.signature),

        /* Userhandle might be null if not provided during registration, but we can safely ignore it */
        userHandle: this.fromBase64Url(response.userHandle!),
      },
      type: "public-key",
    };
  }

  private static sanitizeRegistrationResponse(response: RegistrationEncoded) {
    return {
      id: this.base64ToBase64Url(response.credential.id),
      rawId: this.base64ToBase64Url(response.credential.id),
      authenticatorData: this.base64ToBase64Url(response.authenticatorData),
      clientDataJSON: this.base64ToBase64Url(response.clientData),
    };
  }

  private static padDateComponent(component: number): string {
    return component.toString().padStart(2, "0");
  }

  private static getWebauthnRegisterOptions(userHandle?: string): {
    registerOptions: RegisterOptions;
    authOptions: AuthenticateOptions;
    algorithm: string;
  } {
    return {
      registerOptions: {
        authenticatorType: "auto", // extern => remove browser
        userVerification: "required",
        timeout: 60000,
        attestation: false,
        debug: false,
        discoverable: "required",
        userHandle,
      } as RegisterOptions,
      authOptions: {
        authenticatorType: "auto", // extern => remove browser
        userVerification: "required",
        timeout: 60000,
      } as AuthenticateOptions,
      algorithm: "ES256",
    };
  }
}
