import { Button } from "@/components/input/Button";
import { Input } from "@/components/input/Input";
import { Select, KV } from "@/components/input/Select";
import {
  TwoColumnComponent,
  FirstColumn,
  SecondColumn,
} from "@/components/layout/TwoColumnComponent";
import { VStackChildren } from "@/components/layout/VStack";
import { speak } from "@/util/textToSpeech";
import { Dispatch, SetStateAction } from "react";
import { Component } from "@/components/basic/Component";
import { Text } from "@/components/text/Text";

type MemberSettingProps = {
  setIsParent: Dispatch<SetStateAction<boolean>>;
  roomId: string;
  setRoomId: Dispatch<SetStateAction<string>>;
  voice: SpeechSynthesisVoice | null;
  setVoice: Dispatch<SetStateAction<SpeechSynthesisVoice | null>>;
  voices: SpeechSynthesisVoice[];
};

export default function MemberSetting({
  setIsParent,
  roomId,
  setRoomId,
  voice,
  setVoice,
  voices = [],
}: MemberSettingProps) {
  return (
    <>
      <VStackChildren>
        <CaptainComponent setIsParent={setIsParent} />
      </VStackChildren>
      <VStackChildren>
        <TwoColumnComponent>
          <FirstColumn>
            <Text>へや</Text>
          </FirstColumn>
          <SecondColumn>
            <Input
              id="inputRoomId"
              value={roomId ?? ""}
              onChange={(value) => setRoomId(value)}
            />
          </SecondColumn>
        </TwoColumnComponent>
      </VStackChildren>
      <VStackChildren>
        <TwoColumnComponent>
          <FirstColumn>
            <Text>よみあげ</Text>
          </FirstColumn>
          <SecondColumn>
            <Button
              onClick={async () => {
                speak(`日本語で聞こえれば、オーケーです。`, voice);
              }}
            >
              <Text>テスト</Text>
            </Button>
          </SecondColumn>
        </TwoColumnComponent>
      </VStackChildren>
      <VStackChildren>
        <Component>
          <Select
            name={"selectVoice"}
            id={"selectVoice"}
            values={voices.map((v) => ({
              key: v.name,
              name: v.name,
              value: v,
            }))}
            onChange={(kvVoice: KV<SpeechSynthesisVoice>) => {
              return setVoice(kvVoice.value);
            }}
          />
        </Component>
      </VStackChildren>
    </>
  );
}

function CaptainComponent({
  setIsParent,
}: {
  setIsParent: (isParent: boolean) => void;
}) {
  return (
    <TwoColumnComponent>
      <FirstColumn>
        <Text>げすと/せんちょ</Text>
      </FirstColumn>
      <SecondColumn>
        <Select
          name={"selectRole"}
          id={"selectRole"}
          values={[
            {
              key: "guest",
              name: "げすと",
              value: "guest",
            },
            {
              key: "captain",
              name: "せんちょ",
              value: "captain",
            },
          ]}
          onChange={(kvVoice: KV<string>) => {
            return setIsParent(kvVoice.value === "captain");
          }}
        />
      </SecondColumn>
    </TwoColumnComponent>
  );
}
