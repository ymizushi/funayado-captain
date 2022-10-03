import type { NextApiRequest, NextApiResponse } from 'next'

import Channels from "pusher";
import { privateConfig, publicConfig } from "@config";
const channels = new Channels({
  appId:  privateConfig.pusher.appId,
  key: publicConfig.pusher.key,
  secret: privateConfig.pusher.secret,
  cluster: publicConfig.pusher.cluster,
  useTLS: true
});

const SocketHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (channels) {
    const data = req.body;
    await channels.trigger(data.roomId, "roomStatus", data.status);
    res.status(200).json({status: "ok"})
    console.log(`pushed data: ${JSON.stringify(data)}`)
  } 
}

export default SocketHandler