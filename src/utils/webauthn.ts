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
  public static async register(): Promise<[RegistrationEncoded, string]> {
    const address = this.getRandomAddress();
    const registration = await client.register(
      this.getRandomUsername(),
      this.getRegistrationChallenge(),
      this.getWebauthnRegisterOptions(address).registerOptions
    );
    return [registration, address];
  }

  public static async authenticate(
    credentialId: Array<string>,
    challenge: string
  ): Promise<AuthenticationEncoded> {
    const login = await client.authenticate(
      credentialId,
      challenge,
      this.getWebauthnRegisterOptions().authOptions
    );

    return login;
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

  public static getRandomAddress(): string {
    const bytes = ethers.utils.randomBytes(20);
    return ethers.utils.getAddress(ethers.utils.hexlify(bytes));
  }

  private static padDateComponent(component: number): string {
    return component.toString().padStart(2, "0");
  }

  private static getRegistrationChallenge(): string {
    return this.base64ToBase64Url(Buffer.from("clave").toString("base64"));
  }

  private static base64ToBase64Url(base64: string): string {
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
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
