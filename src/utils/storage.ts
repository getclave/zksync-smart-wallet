export enum StorageKeys {
  credentialId = "credentialId",
}

export class Storage {
  public static getItem(key: StorageKeys): string | null {
    return localStorage.getItem(key);
  }

  public static setItem(key: StorageKeys, value: string) {
    localStorage.setItem(key, value);
  }

  public static removeItem(key: StorageKeys) {
    localStorage.removeItem(key);
  }
}
