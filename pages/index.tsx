import { useEffect } from 'react';
import Pusher from "pusher-js";
// TODO: 絶対importで書く
import { config } from '../config';

const TryPusher = () => {
  useEffect(() => {
    setPusherListener();
  }, []);

  const setPusherListener = () => {
    let channels = new Pusher(config.pusher.key , {
      cluster: config.pusher.cluster,
    });

    let channel = channels.subscribe("my-channel");

    channel.bind("my-event", (data: any) => {
      console.log("data from server", data)
    });
  };

  const pushData = async (data: any) => {
    const res = await fetch("/api/socket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      console.error("failed to push data");
    }
  }

  return (
    <button onClick={async () => await pushData({foo: "bar"})}>
      Get Data
    </button>
  );
}

export default TryPusher
