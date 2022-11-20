import { useLocalStorage } from "./useStatus";

const STORAGE_KEY_ROOM_STATUS = "work.ymizushi.funayado-captain/roomStatus";

export type RoomStatus = {
  waterDepth: number;
  tana: number | null;
  size: string | null;
  amount: string | null;
  bottomMaterial: string | null;
};

export function useRoomStatus(
  roomId: string
): [
  roomStatus: RoomStatus | null,
  setRoom: (value: RoomStatus | null) => void
] {
  return useLocalStorage<RoomStatus | null>(
    `${STORAGE_KEY_ROOM_STATUS}?roomId=${roomId}`,
    initialRoomStatus
  );
}

export const initialRoomStatus: RoomStatus = {
  waterDepth: 30,
  tana: null,
  size: null,
  amount: null,
  bottomMaterial: null,
};
