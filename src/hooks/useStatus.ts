import { Dispatch, useCallback, useEffect, useState } from "react";

const STORAGE_KEY_STATUS = "work.ymizushi.funayado-captain/roomStatus";
import { SetStateAction } from "react";

export function useLocalStorage<T>(
  key: string,
  initialState: T
): [storage: T, setStorage: Dispatch<SetStateAction<T>>] {
  const [storage, setStorage] = useState<T>(initialState);

  useEffect(() => {
    const localStorageString = localStorage.getItem(key);
    if (localStorageString) {
      try {
        const localStorageJson = JSON.parse(localStorageString) as T;
        setStorage(localStorageJson);
      } catch (e) {
        setStorage(initialState);
      }
    }
  }, [setStorage, key, initialState]);

  const setLocalStorage = useCallback(
    (value: SetStateAction<T>) => {
      localStorage.setItem(key, JSON.stringify(value));
      setStorage(value);
    },
    [setStorage, key]
  );

  return [storage, setLocalStorage];
}
