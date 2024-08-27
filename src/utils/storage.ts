export enum StorageKeys {
  credential = "credential",
}

export class Storage {
  public static getItem(key: StorageKeys): string | null {
    return localStorage.getItem(key);
  }

  public static setJsonItem<T>(key: StorageKeys, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  public static getJsonItem<T>(key: StorageKeys): T | null {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
    return null;
  }

  public static setItem(key: StorageKeys, value: string, isJson = false) {
    localStorage.setItem(key, value);
  }

  public static removeItem(key: StorageKeys) {
    localStorage.removeItem(key);
  }
}
