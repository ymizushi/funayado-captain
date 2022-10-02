import { SetStateAction } from "react"
import { useLocalStorage } from "./useStatus"

const STORAGE_KEY_ROOM_STATUS = 'work.ymizushi.funayado-captain/roomStatus'

export type RoomStatus = {
  waterDepth: number,
  minWaterDepth: number,
  maxWaterDepth: number,
}

export function useRoomStatus(
  roomId: string|null
): [roomStatus: RoomStatus|null, setRoom: (value: RoomStatus|null) => void] {
  return useLocalStorage<RoomStatus>(`${STORAGE_KEY_ROOM_STATUS}?roomId=${roomId}`, initialRoomStatus)
}

export const initialRoomStatus: RoomStatus = {
  waterDepth: 0,
  minWaterDepth: 0,
  maxWaterDepth: 100,
}