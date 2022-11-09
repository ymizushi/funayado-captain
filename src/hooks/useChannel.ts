import { PushStatus } from "pages";
import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import { publicConfig } from "@config";
import { RoomStatus } from "./useRoomStatus";
import { getNowDateWithString } from "@util/textToSpeech";

export function useChannel(roomId: string): [string, RoomStatus|null] {
  const [eventLog, setEventLog] = useState<string>("");
  const [lastStatus, setLastStatus] = useState<RoomStatus | null>(null);

  useEffect(() => {
    if (roomId) {
      const channels = new Pusher(publicConfig.pusher.key, {
        cluster: publicConfig.pusher.cluster,
      });
      let channel = channels.subscribe(roomId);
      channel.bind("roomStatus", (data: RoomStatus) => {
        setEventLog(
          (before) =>
            `${getNowDateWithString()}: data received\n${JSON.stringify(
              data
            )}\n\n${before}`
        );
        setLastStatus(data);
      });
      return () => {
        channel.unbind("roomStatus");
        channels.unsubscribe(roomId);
      };
    }
  }, [roomId]);

  return [eventLog, lastStatus]
}