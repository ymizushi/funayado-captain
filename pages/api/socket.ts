import Channels from "pusher";
import { privateConfig, publicConfig } from "@config";
const channels = new Channels({
  appId:  privateConfig().pusher.appId,
  key: publicConfig().pusher.key,
  secret: privateConfig().pusher.secret,
  cluster: publicConfig().pusher.cluster,
  useTLS: true
});

const SocketHandler = (req: any, res: any) => {
  const data = req.body;
  console.log(`pushed data: ${JSON.stringify(data)}`)
  channels && channels.trigger(data.roomId, "roomStatus", data.status);
  res.end()
}

export default SocketHandler