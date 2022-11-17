export const RoomStatusMessageType = "roomStatus" as const;
export const CaptureMessageType = "capture" as const;

export type Message<A extends MessageType, B> = {
  channelId: string;
  threadId: string;
  messageType: A;
  payload: B;
};

export function isRoomStatusMessage(data: any): data is RoomStatusMessage {
  return data.messageType === RoomStatusMessageType;
}

export function isCaptureMessage(data: any): data is CaptureMessage {
  return data.messageType === CaptureMessageType;
}

export type RoomStatusMessage = Message<
  typeof RoomStatusMessageType,
  RoomStatusPayload
>;
export type CaptureMessage = Message<typeof CaptureMessageType, CapturePayload>;

export type MessageType =
  | typeof RoomStatusMessageType
  | typeof CaptureMessageType;

export type RoomStatusPayload = {
  waterDepth: number;
  tana: number | null;
  size: string | null;
  amount: string | null;
  bottomMaterial: string | null;
};

export type CapturePayload = {};
