import { SetStateAction } from "react"
import { useLocalStorage } from "./useStatus"

const STORAGE_KEY_ROOM_STATUS = 'work.ymizushi.funayado-captain/roomStatus'

export type RoomStatus = {
  roomId: string,
  waterDepth: number,
  minWaterDepth: number,
  maxWaterDepth: number,
}

export function useRoomStatus(
): [roomStatus: RoomStatus|null, setRoom: (value: RoomStatus|null) => void] {
  return useLocalStorage<RoomStatus>(STORAGE_KEY_ROOM_STATUS, initialRoomStatus)
}

export const initialRoomStatus: RoomStatus = {
  roomId: 'default-room',
  waterDepth: 0,
  minWaterDepth: 0,
  maxWaterDepth: 100,
}