import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import { publicConfig } from "@config";
import { VStack } from "@components/layout/VStack";
import { Text } from "@components/text/Text";
import { RoomStatus, useRoomStatus } from "@hooks/useRoomStatus";
import { getNowDateWithString, speak } from "@util/textToSpeech";
import { Header } from "@components/pages/Header";
import { Hr } from "@components/decoration/Hr";
import { MemberSetting } from "./setting/MemberSetting";
import { ConditionSetting } from "./setting/ConditionSetting";
import { SystemSetting } from "./setting/SystemSetting";
import { VideoSetting } from "./setting/VideoStting";

const config = publicConfig;

export type PushStatus = "success" | "failed" | null;

const Home = () => {
  const [roomId, setRoomId] = useState<string>("default-room");
  const [roomStatus, setRoomStatus] = useRoomStatus(roomId);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [lastStatus, setLastStatus] = useState<RoomStatus | null>(null);
  const [isParent, setIsParent] = useState(false);
  const [eventLog, setEventLog] = useState<string>("");
  const [pushStatus, setPushStatus] = useState<PushStatus>(null);

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
          voices={voices}
          setVoices={setVoices}
        />
        <Hr />
        <ConditionSetting
          roomStatus={roomStatus}
          setRoomStatus={setRoomStatus}
          isParent={isParent}
        />
        <Hr />
        <SystemSetting
          pushStatus={pushStatus}
          setPushStatus={setPushStatus}
          isParent={isParent}
          roomStatus={roomStatus}
          roomId={roomId}
          setRoomStatus={setRoomStatus}
          eventLog={eventLog}
        />
        <Hr />
        <VideoSetting />
      </VStack>
    </>
  );
};

export default Home;
