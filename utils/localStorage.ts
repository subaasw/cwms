type StorageKey = "token" | "user" | "theme";

const isServer = typeof window === "undefined";

export const setLocalStorage = <T>(key: StorageKey, value: T): void => {
  if (!isServer) {
    try {
      const serializedValue =
        typeof value === "object" ? JSON.stringify(value) : String(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error("Error setting localStorage key:", key, error);
    }
  }
};

export const getLocalStorage = <T>(
  key: StorageKey,
  defaultValue: T | null = null
): T | null => {
  if (!isServer) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }

      try {
        return JSON.parse(item);
      } catch {
        return item as unknown as T;
      }
    } catch (error) {
      console.error("Error getting localStorage key:", key, error);
      return defaultValue;
    }
  }
  return defaultValue;
};

export const removeLocalStorage = (key: StorageKey): void => {
  if (!isServer) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing localStorage key:", key, error);
    }
  }
};

export const clearLocalStorage = (): void => {
  if (!isServer) {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  }
};

export const isLocalStorageAvailable = (): boolean => {
  if (isServer) return false;

  try {
    localStorage.setItem("test", "test");
    localStorage.removeItem("test");
    return true;
  } catch (e) {
    return false;
  }
};
