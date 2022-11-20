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
    const message = req.body;
    if (isRoomStatusMessage(message) || isCaptureMessage(message)) {
      await channels.trigger(
        message.channelId,
        message.messageType,
        message.payload
      );
      res.status(200).json({ status: "ok" });
    } else {
      res.status(400).json({
        status: "ng",
        message: `${JSON.stringify(message)}$ is invalid request body}`,
      });
    }
  } else {
    res
      .status(500)
      .json({ status: "ng", message: "channel config is invalid" });
  }
};

export default SocketHandler;
