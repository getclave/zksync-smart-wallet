import { client } from "@passwordless-id/webauthn/dist/esm";
import type {
  AuthenticationEncoded,
  RegistrationEncoded,
} from "@passwordless-id/webauthn/dist/esm/types";

import type {
  AuthenticateOptions,
  RegisterOptions,
} from "@passwordless-id/webauthn/dist/esm/types";

export const getWebauthnRegisterOptions = (
  userHandle?: string
): {
  registerOptions: RegisterOptions;
  authOptions: AuthenticateOptions;
  algorithm: string;
} => {
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
};

export const register = async (
  username: string,
  userHandle: string,
  challenge: string
): Promise<RegistrationEncoded> => {
  const registration = await client.register(
    username,
    challenge,
    getWebauthnRegisterOptions(userHandle).registerOptions
  );
  return registration;
};

export const authenticate = async (
  credentialId: Array<string>,
  challenge: string
): Promise<AuthenticationEncoded> => {
  const login = await client.authenticate(
    credentialId,
    challenge,
    getWebauthnRegisterOptions().authOptions
  );

  return login;
};
