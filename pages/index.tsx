import { useEffect, useState } from "react";
import { publicConfig } from "@config";
import { VStack } from "@components/layout/VStack";
import { Text } from "@components/text/Text";
import { useRoomStatus } from "@hooks/useRoomStatus";
import { speak } from "@util/textToSpeech";
import { Header } from "@components/pages/Header";
import { Hr } from "@components/decoration/Hr";
import { MemberSetting } from "./setting/MemberSetting";
import { ConditionSetting } from "./setting/ConditionSetting";
import { SystemSetting } from "./setting/SystemSetting";
import { VideoSetting } from "./setting/VideoSetting";
import { useSpeech } from "@hooks/useSpeech";
import { useChannel } from "@hooks/useChannel";

const config = publicConfig;

export type PushStatus = "success" | "failed" | null;

const Home = () => {
  const [roomId, setRoomId] = useState<string>("default-room");
  const [roomStatus, setRoomStatus] = useRoomStatus(roomId);
  const [isParent, setIsParent] = useState(false);
  const [pushStatus, setPushStatus] = useState<PushStatus>(null);

  const [voice, setVoice, voices, _]= useSpeech()
  const [eventLog, lastStatus] = useChannel(roomId)

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
