import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import Pusher from "pusher-js";
import { publicConfig } from '@config';
import { VStack } from '@components/layout/VStack';
import { Component } from '@components/basic/Component';
import { Button } from '@components/input/Button';
import { Text } from '@components/text/Text';
import { Input } from '@components/input/Input';
import { VerticalRangeSlider } from '@components/input/Slider';
import { initialRoomStatus, RoomStatus, useRoomStatus } from '@hooks/useRoomStatus';
import { speak } from '@util/textToSpeech';
import { KV, Select } from '@components/input/Select';
const config = publicConfig

const Home = () => {
  const [roomId, setRoomId] = useState<string>("default-room")
  const [roomStatus, setRoomStatus] = useRoomStatus(roomId)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [voice, setVoice] = useState<SpeechSynthesisVoice|null>()
  const [lastStatus, setLastStatus] = useState<RoomStatus|null>(null)
  const [isParent, setIsParent] = useState(false)
  const [fishSize, setFishSize] = useState<string|null>(null)
  const [fishAmount, setFishAmount] = useState<string|null>(null)

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
      var u = new SpeechSynthesisUtterance();
      u.text = "こんにちは";
      u.lang = 'ja-JP';
      u.rate = 1.0;
      speechSynthesis.speak(u);




      speak(`水深は${lastStatus.waterDepth.toString()}メートルです.
      魚の数は${fishAmount}です
      魚の大きさは${fishSize}です
      `, voice)
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

  console.log(roomStatus)

  return (
    <VStack>
      <Component>
        <Text>親/子</Text>
        <Text>あなたは { isParent ? "親" : "子"} です</Text>
        <Button disabled={isParent} onClick={async () => {
          setIsParent(true)
        }}>
          親になる
        </Button>
      </Component>
      <Component>
        <Text>部屋選択</Text>
        <Input id='inputRoomId' value={roomId ?? ""} onChange={(value) => setRoomId(value)} />
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
          disabled={!isParent}
          value={roomStatus.waterDepth}
          onChange={(n: number) => {
            const newStatus = {
                ...roomStatus, 
                waterDepth: n
              }
            setRoomStatus(newStatus)
          }}
          min={0}
          max={roomStatus.maxWaterDepth}
         />
      </Component>
      <Component>
        <Text>最大深度</Text>
        <Input disabled={!isParent} id='inputMaxWaterDepth' value={roomStatus?.maxWaterDepth ?? 0} onChange={(value) => setRoomStatus(
          {
            ...roomStatus,
            maxWaterDepth: parseInt(value) || 0
          }) } />
      </Component>

      <Component>
        <Text>魚の大きさ</Text>
        <Select 
          name={'selectFishSize'}
          id={'selectFishSize'} 
          values={["", "大きい", "普通", "小さい"].map(v => ({
            key: v,
            name: v,
            value: v
          }))}         
          onChange={(value: KV<string>) => {
            setFishSize(value.value === "" ? null: value.value )
          }
          }
          />
      </Component>

      <Component>
        <Text>魚の数</Text>
        <Select 
          name={'selectFishSize'}
          id={'selectFishSize'} 
          values={["", "たくさん", "普通", "少ない"].map(v => ({
            key: v,
            name: v,
            value: v
          }))}         
          onChange={(value: KV<string>) => {
            setFishAmount(value.value === "" ? null: value.value )
          }
          }
          />
      </Component>

      <Component>
        <Button disabled={!isParent} onClick={async () => {
          if (roomStatus) {
            await pushRoomStatus(
              roomId,
              roomStatus
            )
          }
        }}>
          送信
        </Button>
      </Component>

      <Component>
        <Button onClick={async () => {
          setRoomStatus(initialRoomStatus)
        }}>
          ローカルストレージを初期化
        </Button>
      </Component>
    </VStack>
  );
}

export default Home
