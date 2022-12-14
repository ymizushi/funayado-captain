import { Component } from "@/components/basic/Component";
import { Button } from "@/components/input/Button";
import {
  FirstColumn,
  SecondColumn,
  TwoColumnComponent,
} from "@/components/layout/TwoColumnComponent";
import { VStackChildren } from "@/components/layout/VStack";
import { PushStatus } from "pages";
import { Dispatch, SetStateAction } from "react";
import { Text } from "@/components/text/Text";
import { initialRoomStatus, RoomStatus } from "@/hooks/useRoomStatus";
import { Textarea } from "@/components/input/Textarea";

export type LogSettingProps = {
  pushStatus: PushStatus;
  setPushStatus: Dispatch<SetStateAction<PushStatus>>;
  isParent: boolean;
  roomStatus: RoomStatus | null;
  setRoomStatus: (_status: RoomStatus | null) => void;
  eventLog: string;
  roomStatusNotifier: (_data: RoomStatus) => Promise<Response>;
};

export default function SystemSetting({
  pushStatus,
  setPushStatus,
  isParent,
  roomStatus,
  setRoomStatus,
  eventLog,
  roomStatusNotifier,
}: LogSettingProps) {
  const pushRoomStatus = async (data: RoomStatus | null) => {
    if (data) {
      const res = await roomStatusNotifier(data);
      if (!res.ok) {
        console.error("failed to push data.");
        setPushStatus("failed");
      } else {
        setPushStatus("success");
        setTimeout(() => setPushStatus(null), 2000);
      }
    }
  };

  return (
    <>
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
                  await pushRoomStatus(roomStatus);
                }
              }}
            >
              そうしん
            </Button>
          </SecondColumn>
        </TwoColumnComponent>
      </VStackChildren>
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
    </>
  );
}
