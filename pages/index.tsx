import { useEffect, useState } from "react";
import { publicConfig } from "@config";
import { VStack } from "@components/layout/VStack";
import { Text } from "@components/text/Text";
import { RoomStatus, useRoomStatus } from "@hooks/useRoomStatus";
import { speak } from "@util/textToSpeech";
import { Header } from "@components/pages/Header";
import { Hr } from "@components/decoration/Hr";
import MemberSetting from "./setting/MemberSetting";
import ConditionSetting from "./setting/ConditionSetting";
import SystemSetting from "./setting/SystemSetting";
import VideoSetting from "./setting/VideoSetting";
import { useSpeech } from "@hooks/useSpeech";
import { useChannel } from "@hooks/channel/useChannel";
import { RoomStatusMessageType } from "@hooks/channel/message";
import { defaultChannelId } from "@hooks/channel/channel";

const config = publicConfig;

export type PushStatus = "success" | "failed" | null;

const Home = () => {
  const [channelId, setChannelId] = useState<string>(defaultChannelId);
  const [roomStatus, setRoomStatus] = useRoomStatus(channelId);
  const [isParent, setIsParent] = useState(false);
  const [pushStatus, setPushStatus] = useState<PushStatus>(null);

  const [voice, setVoice, voices, _] = useSpeech();
  const [lastRoomStatus, roomStatusEventLog, roomStatusNotifier] =
    useChannel<RoomStatus>(channelId, RoomStatusMessageType);

  useEffect(() => {
    if (lastRoomStatus && voice) {
      let sentence = `水深は${lastRoomStatus.waterDepth.toString()}メートル。`;
      if (lastRoomStatus.tana) {
        sentence = sentence + `タナは${lastRoomStatus.tana}メートル。`;
      }
      if (lastRoomStatus.size) {
        sentence = sentence + `おおきさは${lastRoomStatus.size}。`;
      }
      if (lastRoomStatus.amount) {
        sentence = sentence + `かずは${lastRoomStatus.amount}。`;
      }
      if (lastRoomStatus.bottomMaterial) {
        sentence = sentence + `ていしつは、${lastRoomStatus.bottomMaterial}。`;
      }
      speak(sentence, voice);
    }
    // voiceが変わったとしても再実行させたくないので、dependency list には含めない
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastRoomStatus]);

  return (
    <>
      <Header>
        <Text type={"sub"}>funayado-captain</Text>
      </Header>
      <VStack>
        <MemberSetting
          setIsParent={setIsParent}
          roomId={channelId}
          setRoomId={setChannelId}
          voice={voice}
          setVoice={setVoice}
          voices={voices}
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
          setRoomStatus={setRoomStatus}
          eventLog={roomStatusEventLog}
          roomStatusNotifier={roomStatusNotifier}
        />
        <Hr />
        <VideoSetting />
      </VStack>
    </>
  );
};

export default Home;
