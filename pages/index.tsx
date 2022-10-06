import { useEffect, useState } from 'react';
import Pusher from "pusher-js";
import { publicConfig } from '@config';
import { VStack, VStackChildren } from '@components/layout/VStack';
import { Button } from '@components/input/Button';
import { Text } from '@components/text/Text';
import { Input } from '@components/input/Input';
import { VerticalRangeSlider } from '@components/input/Slider';
import { initialRoomStatus, RoomStatus, useRoomStatus } from '@hooks/useRoomStatus';
import { speak } from '@util/textToSpeech';
import { KV, Select } from '@components/input/Select';
import { Header } from '@components/pages/Header';
import { Hr } from '@components/decoration/Hr';
import { FirstColumn, SecondColumn, TwoColumnComponent } from '@components/layout/TwoColumnComponent';
import { Component } from '@components/basic/Component';

const config = publicConfig

const Home = () => {
  const [roomId, setRoomId] = useState<string>("default-room")
  const [roomStatus, setRoomStatus] = useRoomStatus(roomId)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [voice, setVoice] = useState<SpeechSynthesisVoice|null>(null)
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
      let sentence = `水深は${lastStatus.waterDepth.toString()}メートル。`
      if (lastStatus.tana) {
        sentence = sentence + `タナは${lastStatus.tana}メートル。`
      }
      if (lastStatus.size) {
        sentence = sentence + `大きさは${lastStatus.size}。`
      }
      if (lastStatus.amount) {
        sentence = sentence + `数は${lastStatus.amount}。`
      }
      speak(sentence, voice)
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
    <>
      <Header>
        <Text type={'sub'}>funayado-captain</Text>
      </Header>
      <VStack>
        <VStackChildren>
          <TwoColumnComponent>
            <FirstColumn>
              <Text>げすと/せんちょ</Text>
            </FirstColumn>
            <SecondColumn>
              <Select 
                name={'selectRole'}
                id={'selectRole'} 
                values={[
                  {
                  key: 'guest',
                  name: 'げすと',
                  value: 'guest'
                }, {
                  key: 'captain',
                  name: 'せんちょ',
                  value: 'captain'
                }]}         
                onChange={(kvVoice: KV<string>) => {
                  return setIsParent(kvVoice.value==='captain')
                }
                }
                />
            </SecondColumn>
          </TwoColumnComponent>
        </VStackChildren>
        <VStackChildren>
          <TwoColumnComponent>
            <FirstColumn>
              <Text>へや</Text>
            </FirstColumn>
            <SecondColumn>
              <Input id='inputRoomId' value={roomId ?? ""} onChange={(value) => setRoomId(value)} />
            </SecondColumn>
          </TwoColumnComponent>
        </VStackChildren>
        <VStackChildren>
          <TwoColumnComponent>
            <FirstColumn><Text>よみあげ</Text></FirstColumn>
            <SecondColumn>
              <Button onClick={async () => {
                speak(`日本語で聞こえればオーケーです。`, voice)
              }}>
                <Text>テスト</Text>
              </Button>
            </SecondColumn>
          </TwoColumnComponent>
        </VStackChildren>
        <VStackChildren>
          <Component>
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
        </VStackChildren>
        <Hr />
        <VStackChildren>
          <TwoColumnComponent>
            <FirstColumn>
              <Text>すいしん</Text>
            </FirstColumn>
            <SecondColumn>
              <Text>{roomStatus.waterDepth}m</Text>
            </SecondColumn>
          </TwoColumnComponent>
          <Component>
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
                max={100}
               />
          </Component>
        </VStackChildren>
        <VStackChildren>
          <TwoColumnComponent>
            <FirstColumn>
              <Text>たな</Text>
            </FirstColumn>
            <SecondColumn>
              <Text>{roomStatus.tana ?? '??' }m</Text>
            </SecondColumn>
          </TwoColumnComponent>
          <Component>
            <VerticalRangeSlider
              disabled={!isParent}
              value={roomStatus.tana ?? 0 }
              onChange={(n: number) => {
                const newStatus = {
                    ...roomStatus, 
                    tana: n
                  }
                setRoomStatus(newStatus)
              }}
              min={0}
              max={100}
             />
          </Component>
        </VStackChildren>
        <VStackChildren>
          <TwoColumnComponent>
            <FirstColumn>
              <Text>おおきさ</Text>
            </FirstColumn>
            <SecondColumn>
              <Select 
                disabled={!isParent}
                name={'selectFishSize'}
                id={'selectFishSize'} 
                values={["", "おおきい", "ふつう", "ちいさい"].map(v => ({
                  key: v,
                  name: v,
                  value: v
                }))}         
                onChange={(value: KV<string>) => {
                  const newStatus = {
                      ...roomStatus, 
                      size: value.value
                    }
                  setRoomStatus(newStatus)
                  }
                }
                />
            </SecondColumn>
          </TwoColumnComponent>
        </VStackChildren>
        <VStackChildren>
          <TwoColumnComponent>
            <FirstColumn>
              <Text>かず</Text>
            </FirstColumn>
            <SecondColumn>
              <Select 
                disabled={!isParent}
                name={'selectFishAmount'}
                id={'selectFishAmount'} 
                values={["", "たくさん", "ふつう", "すくない"].map(v => ({
                  key: v,
                  name: v,
                  value: v
                }))}         
                onChange={(value: KV<string>) => {
                  const newStatus = {
                      ...roomStatus, 
                      amount: value.value
                    }
                  setRoomStatus(newStatus)
                }
                }
                />
            </SecondColumn>
          </TwoColumnComponent>
        </VStackChildren>
        <VStackChildren>
          <TwoColumnComponent>
            <FirstColumn>
            </FirstColumn>
            <SecondColumn>
              <Button disabled={!isParent} onClick={async () => {
                if (roomStatus) {
                  await pushRoomStatus(
                    roomId,
                    roomStatus
                  )
                }
              }}>
                そうしん
              </Button>
            </SecondColumn>
          </TwoColumnComponent>
        </VStackChildren>
        <Hr />

        <VStackChildren>
          <TwoColumnComponent>
            <FirstColumn>
            </FirstColumn>
            <SecondColumn>
              <Button onClick={async () => {
                setRoomStatus(initialRoomStatus)
              }}>
                しょきかする
              </Button>
            </SecondColumn>
          </TwoColumnComponent>
        </VStackChildren>
      </VStack>
    </>
  );
}

export default Home
