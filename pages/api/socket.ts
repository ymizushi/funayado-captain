import type { NextApiRequest, NextApiResponse } from "next";

import Channels from "pusher";
import { privateConfig, publicConfig } from "@config";
import { isCaptureMessage, isRoomStatusMessage } from "@hooks/channel/message";

const channels = new Channels({
  appId: privateConfig.pusher.appId,
  key: publicConfig.pusher.key,
  secret: privateConfig.pusher.secret,
  cluster: publicConfig.pusher.cluster,
  useTLS: true,
});

const SocketHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (channels) {
    const data = req.body;
    if (isRoomStatusMessage(data) || isCaptureMessage(data)) {
      await channels.trigger(data.channelId, data.threadId, data.payload);
      res.status(200).json({ status: "ok" });
    } else {
      res.status(400).json(
        {
          status: "ng",
          message: `${JSON.stringify(data)}$ is invalid request body}`
        }
      );
    }
  } else {
    res.status(500).json({ status: "ng", message: "channel config is invalid"});
  }
};

export default SocketHandler;
