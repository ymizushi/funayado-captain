import { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";
import { publicConfig } from "@config";
import { VStack, VStackChildren } from "@components/layout/VStack";
import { Button } from "@components/input/Button";
import { Text } from "@components/text/Text";
import { Input } from "@components/input/Input";
import { VerticalRangeSlider } from "@components/input/Slider";
import { Dispatch, SetStateAction } from "react";
import {
  initialRoomStatus,
  RoomStatus,
  useRoomStatus,
} from "@hooks/useRoomStatus";
import { speak } from "@util/textToSpeech";
import { KV, Select } from "@components/input/Select";
import { Header } from "@components/pages/Header";
import { Hr } from "@components/decoration/Hr";
import {
  FirstColumn,
  SecondColumn,
  TwoColumnComponent,
} from "@components/layout/TwoColumnComponent";
import { Component } from "@components/basic/Component";
import { Textarea } from "@components/input/Textarea";
import { MemberSetting } from "./setting/MemberSetting";

const config = publicConfig;

type PushStatus = "success" | "failed" | null;

const Home = () => {
  const [roomId, setRoomId] = useState<string>("default-room");
  const [roomStatus, setRoomStatus] = useRoomStatus(roomId);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [lastStatus, setLastStatus] = useState<RoomStatus | null>(null);
  const [isParent, setIsParent] = useState(false);
  const [eventLog, setEventLog] = useState<string>("");
  const [pushStatus, setPushStatus] = useState<PushStatus>(null);

  const [imageCapture, setImageCapture] = useState<ImageCapture|null>(null);
    
  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      setVoices(window.speechSynthesis.getVoices());
      if (window.speechSynthesis.getVoices().length > 0) {
        setVoice(window.speechSynthesis.getVoices()[0]);
      }
    };
    setVoices(window.speechSynthesis.getVoices());
    if (window.speechSynthesis.getVoices().length > 0) {
      setVoice(window.speechSynthesis.getVoices()[0]);
    }
    if (roomId) {
      const channels = new Pusher(config.pusher.key, {
        cluster: config.pusher.cluster,
      });
      let channel = channels.subscribe(roomId);
      channel.bind("roomStatus", (data: RoomStatus) => {
        setEventLog(
          (before) =>
            `${getNowDateWithString()}: data received\n${JSON.stringify(
              data
            )}\n\n${before}`
        );
        setLastStatus(data);
      });
      return () => {
        channel.unbind("roomStatus");
        channels.unsubscribe(roomId);
      };
    }
  }, [roomId]);

  useEffect(() => {
    if (lastStatus && voice) {
      let sentence = `水深は${lastStatus.waterDepth.toString()}メートル。`;
      if (lastStatus.tana) {
        sentence = sentence + `タナは${lastStatus.tana}メートル。`;
      }
      if (lastStatus.size) {
        sentence = sentence + `おおきさは${lastStatus.size}。`;
      }
      if (lastStatus.amount) {
        sentence = sentence + `かずは${lastStatus.amount}。`;
      }
      if (lastStatus.bottomMaterial) {
        sentence = sentence + `ていしつは、${lastStatus.bottomMaterial}。`;
      }
      speak(sentence, voice);
    }
    // voiceが変わったとしても再実行させたくないので、dependency list には含めない
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastStatus]);

  const pushRoomStatus = async (roomId: string, data: RoomStatus | null) => {
    const res = await fetch("/api/socket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomId: roomId,
        status: data,
      }),
    });

    if (!res.ok) {
      console.error("failed to push data.");
      setPushStatus("failed");
    } else {
      setPushStatus("success");
      setTimeout(() => setPushStatus(null), 2000);
    }
  };

  return (
    <>
      <Header>
        <Text type={"sub"}>funayado-captain</Text>
      </Header>
      <VStack>
        <MemberSetting
         setIsParent={setIsParent}
         roomId={roomId}
         setRoomId={setRoomId}
         voice={voice}
         setVoice={setVoice}
         voices={voices} setVoices={setVoices} />
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
                  waterDepth: n,
                };
                setRoomStatus(newStatus);
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
              <Text>{roomStatus.tana ?? "??"}m</Text>
            </SecondColumn>
          </TwoColumnComponent>
          <Component>
            <VerticalRangeSlider
              disabled={!isParent}
              value={roomStatus.tana ?? 0}
              onChange={(n: number) => {
                const newStatus = {
                  ...roomStatus,
                  tana: n,
                };
                setRoomStatus(newStatus);
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
                name={"selectFishSize"}
                id={"selectFishSize"}
                values={["", "おおきい", "ふつう", "ちいさい"].map((v) => ({
                  key: v,
                  name: v,
                  value: v,
                }))}
                onChange={(value: KV<string>) => {
                  const newStatus = {
                    ...roomStatus,
                    size: value.value,
                  };
                  setRoomStatus(newStatus);
                }}
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
                name={"selectFishAmount"}
                id={"selectFishAmount"}
                values={["", "たくさん", "ふつう", "すくない"].map((v) => ({
                  key: v,
                  name: v,
                  value: v,
                }))}
                onChange={(value: KV<string>) => {
                  const newStatus = {
                    ...roomStatus,
                    amount: value.value,
                  };
                  setRoomStatus(newStatus);
                }}
              />
            </SecondColumn>
          </TwoColumnComponent>
        </VStackChildren>
        <VStackChildren>
          <TwoColumnComponent>
            <FirstColumn>
              <Text>ていしつ</Text>
            </FirstColumn>
            <SecondColumn>
              <Select
                disabled={!isParent}
                name={"selectBottomMaterial"}
                id={"selectBottomMaterial"}
                values={["", "いわ", "すな"].map((v) => ({
                  key: v,
                  name: v,
                  value: v,
                }))}
                onChange={(value: KV<string>) => {
                  const newStatus = {
                    ...roomStatus,
                    bottomMaterial: value.value,
                  };
                  setRoomStatus(newStatus);
                }}
              />
            </SecondColumn>
          </TwoColumnComponent>
        </VStackChildren>
        <VStackChildren>
          <TwoColumnComponent>
            <FirstColumn>
              {pushStatus ? (
                <Component>
                  <Text>{pushStatus}</Text>
                </Component>
              ) : null}
            </FirstColumn>
            <SecondColumn>
              <Button
                disabled={!isParent}
                onClick={async () => {
                  if (roomStatus) {
                    await pushRoomStatus(roomId, roomStatus);
                  }
                }}
              >
                そうしん
              </Button>
            </SecondColumn>
          </TwoColumnComponent>
        </VStackChildren>
        <Hr />

        <VStackChildren>
          <TwoColumnComponent>
            <FirstColumn></FirstColumn>
            <SecondColumn>
              <Button
                onClick={async () => {
                  setRoomStatus(initialRoomStatus);
                }}
              >
                しょきかする
              </Button>
            </SecondColumn>
          </TwoColumnComponent>
        </VStackChildren>
        <VStackChildren>
          <TwoColumnComponent>
            <FirstColumn>
              <Text>イベントログ</Text>
            </FirstColumn>
            <SecondColumn>
              <Textarea value={eventLog} />
            </SecondColumn>
          </TwoColumnComponent>
        </VStackChildren>
        <VStackChildren>
          <Video setImageCapture={setImageCapture} />
          <canvas id="canvas"></canvas>

          <Button
            onClick={async () => {
              imageCapture?.grabFrame()
              .then(imageBitmap => {
                console.log("onGrabFrameButtonClick")
                const canvas = document.querySelector('canvas');
                if (canvas) {
                  canvas.width = imageBitmap.width
                  canvas.height = imageBitmap.height
                  canvas.getContext('2d')?.drawImage(imageBitmap, 0, 0);
                  canvas.classList.remove('hidden')
                }
              })
              .catch(error => console.log(error));
            }}
          >
            <Text>録画</Text>
          </Button>
        </VStackChildren>
      </VStack>
    </>
  );
};

function getNowDateWithString() {
  const dt = new Date();
  const y = dt.getFullYear();
  const m = ("00" + (dt.getMonth() + 1)).slice(-2);
  const d = ("00" + dt.getDate()).slice(-2);
  const h = ("00" + dt.getHours()).slice(-2);
  const minute = ("00" + dt.getMinutes()).slice(-2);
  const s = ("00" + dt.getSeconds()).slice(-2);
  const result = `${y}/${m}/${d} ${h}:${minute}:${s}`;
  return result;
}



function Video({setImageCapture}: {setImageCapture:  Dispatch<SetStateAction<ImageCapture | null>>}) {
  const ref = useRef<HTMLVideoElement|null>(null)
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({video: true})
      .then(mediaStream => {
        const video = ref.current
        if (video) {
          video.srcObject = mediaStream
          console.log(mediaStream)
        }
      
        const track = mediaStream.getVideoTracks()[0];
        setImageCapture(new ImageCapture(track))
      })
      .catch(error => console.log(`imageCapture failed: ${error}`));
    }, [])
  return <video ref={ref} autoPlay></video>
}

export default Home;
