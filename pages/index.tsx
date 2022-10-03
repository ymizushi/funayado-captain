import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import Pusher from "pusher-js";
import { publicConfig } from '@config';
import { VStack } from '@components/layout/VStack';
import { Component } from '@components/basic/Component';
import { Button } from '@components/input/Button';
import { Text } from '@components/text/Text';
import { Input } from '@components/input/Input';
import { VerticalRangeSlider } from '@components/input/Slider';
import { RoomStatus, useRoomStatus } from '@hooks/useRoomStatus';
import { speak } from '@util/textToSpeech';
import { KV, Select } from '@components/input/Select';
const config = publicConfig
const EventType = 'roomStatus'

const Home = () => {
  const [roomId, setRoomId] = useState<string>("default-room")
  const [roomStatus, setRoomStatus] = useRoomStatus(roomId)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [voice, setVoice] = useState<SpeechSynthesisVoice|null>()
  const [lastStatus, setLastStatus] = useState<RoomStatus|null>(null)

  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      setVoices(window.speechSynthesis.getVoices())
      if (window.speechSynthesis.getVoices().length > 0) {
        setVoice(window.speechSynthesis.getVoices()[0])
      }
    };
    setVoices(window.speechSynthesis.getVoices())
    if (window.speechSynthesis.getVoices().length > 0) {
      setVoice(window.speechSynthesis.getVoices()[0])
    }
    if (roomId) {
      const channels = new Pusher(config.pusher.key , {
        cluster: config.pusher.cluster,
      });
      let channel = channels.subscribe(roomId);
      channel.bind("roomStatus", (data: RoomStatus) => {
        console.log("data from server", data)
        setLastStatus(data)
      });
      return () => {
        channel.unbind('roomStatus')
        channels.unsubscribe(roomId);
      }
    } 
  }, [roomId]);

  useEffect(() => {
    if (lastStatus && voice) {
      speak(lastStatus.waterDepth.toString()+"メートル\n", voice)
    }
  }, [lastStatus, voice])


  const pushRoomStatus = async (roomId: string, data: RoomStatus|null) => {
    const res = await fetch("/api/socket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomId: roomId,
        status: data
      }),
    });

    if (!res.ok) {
      console.error("failed to push data");
    }
  }

  return (
    <VStack>
      <Component>
        <Text>部屋選択</Text>
        <Input id='inputRoomId' value={roomId ?? ""} onChange={(e) => roomId && setRoomId(roomId)} />
        <Button onClick={async () => {
          if (roomStatus) {
            await pushRoomStatus(
              roomId,
              roomStatus
            )
          }
        }}>
          選択
        </Button>
      </Component>
      <Component>
        <Text>読み上げ言語選択</Text>
        <Select 
          name={'selectVoice'}
          id={'selectVoice'} 
          values={voices.map(v => ({
            key: v.name,
            name: v.name,
            value: v
          }))}         
          onChange={(kvVoice: KV<SpeechSynthesisVoice>) => {
            return setVoice(kvVoice.value)
          }
          }
          />
      </Component>
      <Component>
        <Text>水深</Text>
        <VerticalRangeSlider
          value={roomStatus?.waterDepth ?? 0}
          onChange={(n: number) => {
            if (roomStatus) {
              const newStatus = {
                  ...roomStatus, 
                  waterDepth: n
                }
              setRoomStatus(newStatus)
            }
          }}
          max={200}
          min={0}
         />
      </Component>
    </VStack>
  );
}

export default Home
