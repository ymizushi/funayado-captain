import { Component } from "@components/basic/Component";
import { Button } from "@components/input/Button";
import { FirstColumn, SecondColumn, TwoColumnComponent } from "@components/layout/TwoColumnComponent";
import { VStackChildren } from "@components/layout/VStack";
import { PushStatus } from "pages";
import { Dispatch, SetStateAction } from "react";
import { Text } from "@components/text/Text";
import { initialRoomStatus, RoomStatus } from "@hooks/useRoomStatus";
import { Textarea } from "@components/input/Textarea";

export type LogSettingProps = {
  pushStatus: PushStatus
  setPushStatus: Dispatch<SetStateAction<PushStatus>>
  isParent: boolean,
  roomStatus: RoomStatus
  setRoomStatus: (status: RoomStatus) => void 
  roomId: string
  eventLog: string
}

export function SystemSetting({pushStatus, setPushStatus, isParent, roomStatus, setRoomStatus, roomId, eventLog}: LogSettingProps) {
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


  return <>
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
}