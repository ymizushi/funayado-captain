import { Dispatch, useCallback, useEffect, useState } from "react"

const STORAGE_KEY_STATUS = 'work.ymizushi.funayado-captain/roomStatus'
import { SetStateAction } from "react"

export function useLocalStorage<T>(
  key: string,
  initialState: T|null = null
): [storage: T|null, setStorage: Dispatch<SetStateAction<T | null>>] {
  
  const [storage, setStorage] = useState<T|null>(initialState)

  useEffect(() => {
    const localStorageString = localStorage.getItem(key)
    if (localStorageString) {
      try {
        const localStorageJson = JSON.parse(localStorageString) as T
        setStorage(localStorageJson)
      } catch (e) {
        setStorage(null)
      }
    }
  }, [setStorage, key])

  const setLocalStorage = useCallback(
    (value: SetStateAction<T | null>) => {
      localStorage.setItem(key, JSON.stringify(value))
      setStorage(value)
    },
    [setStorage, key]
  )

  return [storage, setLocalStorage]
}