import Pusher from "pusher-js";
import { publicConfig } from "@config";
import { getNowDateWithString } from "@util/textToSpeech";
import { useEffect, useState } from "react";

export function useChannel<A>(channelId: string, threadId: string, receiveHandler: ((data: A) => void)|undefined=undefined): [A|null, string] {
  const [eventLog, setEventLog] = useState<string>("");
  const [latest, setLatest] = useState<A | null>(null);

  useEffect(() => {
    if (channelId) {
      const channels = new Pusher(publicConfig.pusher.key, {
        cluster: publicConfig.pusher.cluster,
      });
      let channel = channels.subscribe(channelId);
      channel.bind(threadId, (data: A) => {
        if (receiveHandler) {
          receiveHandler(data)
        }
        setEventLog(
          (before) =>
            `${getNowDateWithString()}: data received\n${JSON.stringify(
              data
            )}\n\n${before}`
        );
        setLatest(data)
      });
      return () => {
        channel.unbind(threadId);
        channels.unsubscribe(channelId);
      };
    }
  }, [channelId, threadId]);

  return [latest, eventLog]
}