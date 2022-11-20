import Pusher from "pusher-js";
import { publicConfig } from "@config";
import { getNowDateWithString } from "@util/textToSpeech";
import { useEffect, useState } from "react";
import { Message, MessageType } from "./message";

const channels = new Pusher(publicConfig.pusher.key, {
  cluster: publicConfig.pusher.cluster,
});

export function useChannel<A>(
  channelId: string,
  messageType: MessageType,
  receiveHandler: ((data: A) => void) | undefined = undefined
): [A | null, string, (payload: A) => Promise<Response>] {
  const [eventLog, setEventLog] = useState<string>("");
  const [latest, setLatest] = useState<A | null>(null);

  useEffect(() => {
    let channel = channels.subscribe(channelId);
    channel.bind(messageType, (payload: A) => {
      if (receiveHandler) {
        receiveHandler(payload);
      }
      setLatest(payload);
      setEventLog(
        (before) =>
          `${getNowDateWithString()}: data received\n${JSON.stringify(
            payload
          )}\n\n${before}`
      );
    });
    return () => {
      channel.unbind(messageType);
      channels.unsubscribe(channelId);
    };
  }, [channelId, messageType, receiveHandler]);

  const notifier = async function (data: A): Promise<Response> {
    const message: Message<typeof messageType, A> = {
      channelId: channelId,
      messageType: messageType,
      payload: data,
    };
    return await fetch("/api/socket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  };

  return [latest, eventLog, notifier];
}
