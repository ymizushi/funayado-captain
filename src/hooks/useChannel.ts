import Pusher from "pusher-js";
import { publicConfig } from "@config";
import { getNowDateWithString } from "@util/textToSpeech";
import { useEffect, useState } from "react";
import { Message, MessageType } from "./channel/message";

export function useChannel<A>(
  channelId: string,
  threadId: string,
  messageType: MessageType,
  receiveHandler: ((data: A) => void) | undefined = undefined
): [A | null, string, (data: A) => Promise<Response>] {
  const [eventLog, setEventLog] = useState<string>("");
  const [latest, setLatest] = useState<A | null>(null);

  useEffect(() => {
    const channels = new Pusher(publicConfig.pusher.key, {
      cluster: publicConfig.pusher.cluster,
    });
    let channel = channels.subscribe(channelId);
    console.log(channel);
    channel.bind(threadId, (data: A) => {
      console.log("data is received");
      if (receiveHandler) {
        receiveHandler(data);
      }
      setEventLog(
        (before) =>
          `${getNowDateWithString()}: data received\n${JSON.stringify(
            data
          )}\n\n${before}`
      );
      setLatest(data);
    });
    return () => {
      channel.unbind(threadId);
      channels.unsubscribe(channelId);
    };
  }, [channelId, threadId, messageType]);

  const notifier = async function (data: A): Promise<Response> {
    const message: Message<typeof messageType, A> = {
      channelId: channelId,
      threadId: threadId,
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
