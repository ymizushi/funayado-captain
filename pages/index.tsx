import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import Pusher from "pusher-js";
import { publicConfig } from '@config';
import { VStack, VStackChildren } from '@components/layout/VStack';
import { Component } from '@components/basic/Component';
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
    <>
      <Header>
        <Text type={'sub'}>funayado-captain</Text>
      </Header>
      <VStack>
        <VStackChildren>
          <TwoColumnComponent>
            <FirstColumn>
              <Text>せんちょ/げすと</Text>
            </FirstColumn>
            <SecondColumn>
              <Select 
                name={'selectRole'}
                id={'selectRole'} 
                values={[
                  {
                    key: 'empty',
                    name: '',
                    value: 'empty'
                  }
                  ,{
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
            <FirstColumn>
              <Text>よみあげ</Text>
            </FirstColumn>
            <SecondColumn>
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
            </SecondColumn>
          </TwoColumnComponent>
        </VStackChildren>
        <VStackChildren>
          <TwoColumnComponent>
            <FirstColumn></FirstColumn>
            <SecondColumn>
              <Button onClick={async () => {
                speak('てすと', voice)
              }}>
                テスト
              </Button>
            </SecondColumn>
          </TwoColumnComponent>
        </VStackChildren>
        <Hr />
        <VStackChildren>
          <TwoColumnComponent>
            <FirstColumn>
              <Text>すいしん</Text>
            </FirstColumn>
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
          </TwoColumnComponent>
        </VStackChildren>
        <VStackChildren>
          <TwoColumnComponent>
            <FirstColumn>
              <Text>たな</Text>
            </FirstColumn>
            <SecondColumn>
              <Input disabled={!isParent} id='inputTana' value={roomStatus?.tana ?? ""} onChange={(value) => setRoomStatus(
                {
                  ...roomStatus,
                  tana: parseInt(value)
                }) } />
            </SecondColumn>
          </TwoColumnComponent>
        </VStackChildren>
        <VStackChildren>
          <TwoColumnComponent>
            <FirstColumn>
              <Text>おおきさ</Text>
            </FirstColumn>
            <SecondColumn>
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
                name={'selectFishAmount'}
                id={'selectFishAmount'} 
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
              <Text>しょきか</Text>
            </FirstColumn>
            <SecondColumn>
              <Button onClick={async () => {
                setRoomStatus(initialRoomStatus)
              }}>
                じっこう
              </Button>
            </SecondColumn>
          </TwoColumnComponent>
        </VStackChildren>
      </VStack>
    </>
  );
}

export default Home
