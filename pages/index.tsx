import { useEffect, useState } from 'react';
import Pusher from "pusher-js";
import { publicConfig } from '@config';
import { VStack } from '@components/layout/VStack';
import { Component } from '@components/basic/Component';
import { Button } from '@components/input/Button';
import { Text } from '@components/text/Text';
import { Input } from '@components/input/Input';
import { VerticalSlider } from '@components/input/Slider';
import { RoomStatus, useRoomStatus } from '@hooks/useRoomStatus';
const config = publicConfig()
let channels = new Pusher(config.pusher.key , {
  cluster: config.pusher.cluster,
});



const Home = () => {
  const [roomStatus, setRoomStatus] = useRoomStatus()

  useEffect(() => {
    setPusherListener();
  }, [roomStatus?.roomId]);

  const setPusherListener = () => {
    if (roomStatus) {
      let channel = channels.subscribe(roomStatus.roomId);
      channel.bind("roomStatus", (data: RoomStatus) => {
        console.log("data from server", data)
        setRoomStatus(data)
      });
    } 
  };

  const pushRoomStatus = async (data: RoomStatus|null) => {
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
    <VStack>
      <Component>
        <Text>部屋選択</Text>
        <Input id='inputRoomId' value={roomStatus?.roomId ?? ""} onChange={(e) => roomStatus && setRoomStatus(
          {
            ...roomStatus,
            roomId: e.target.value
          }
        )} />
        <Button onClick={async () => {
          if (roomStatus) {
            await pushRoomStatus(
              roomStatus
            )
          }
        }}>
          選択
        </Button>
      </Component>
      <Component>
        <Text>水深</Text>
        <VerticalSlider
          value={roomStatus?.waterDepth ?? 0}
          onChange={(n: number) => {
            if (roomStatus) {
              const newStatus = {
                  ...roomStatus, 
                  waterDepth: n
                }
              setRoomStatus(newStatus)
              pushRoomStatus(newStatus)
            }
          }
         }
          id={'inputWaterDepth'} max={200} min={0}/>
      </Component>
    </VStack>
  );
}

export default Home
