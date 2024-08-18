import { client } from "@passwordless-id/webauthn/dist/esm";
import type {
  AuthenticationEncoded,
  RegistrationEncoded,
} from "@passwordless-id/webauthn/dist/esm/types";

import type {
  AuthenticateOptions,
  RegisterOptions,
} from "@passwordless-id/webauthn/dist/esm/types";

export class Webauthn {
  public async register(
    username: string,
    userHandle: string,
    challenge: string
  ): Promise<RegistrationEncoded> {
    const registration = await client.register(
      username,
      challenge,
      this.getWebauthnRegisterOptions(userHandle).registerOptions
    );
    return registration;
  }

  public async authenticate(
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

  private getWebauthnRegisterOptions(userHandle?: string): {
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
