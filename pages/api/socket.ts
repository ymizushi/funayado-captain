import Channels from "pusher";
import { config } from "../../config";

const SocketHandler = (req: any, res: any) => {
  const channels = new Channels({
    appId:  config.pusher.appId,
    key: config.pusher.key,
    secret: config.pusher.secret,
    cluster: config.pusher.cluster,
    useTLS: true
  });

  const data = req.body;
  channels && channels.trigger("my-channel", "my-event", data);
  res.end()
}

export default SocketHandler