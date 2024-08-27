import { atom, useRecoilValue, useSetRecoilState } from 'recoil';

export type Credential = {
    credentialId: string;
    publicAddress: string;
};

export const CredentialStore = atom<Credential | null>({
    default: null,
    key: 'Credential.Atom',
});

export const useCredential = (): Credential | null => {
    return useRecoilValue(CredentialStore);
};

export const useCredentialNullSafe = (): Credential => {
    return useRecoilValue(CredentialStore) as Credential;
};

export const useSetCredential = () => {
    return useSetRecoilState(CredentialStore);
};
