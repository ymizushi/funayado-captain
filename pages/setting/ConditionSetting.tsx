import { Select, KV } from "@components/input/Select";
import {
  TwoColumnComponent,
  FirstColumn,
  SecondColumn,
} from "@components/layout/TwoColumnComponent";
import { VStackChildren } from "@components/layout/VStack";
import { Component } from "@components/basic/Component";
import { Text } from "@components/text/Text";
import { VerticalRangeSlider } from "@components/input/Slider";
import { RoomStatus } from "@hooks/useRoomStatus";

type ConditionSettingProps = {
  roomStatus: RoomStatus | null;
  setRoomStatus: (value: RoomStatus | null) => void;
  isParent: boolean;
};

export default function ConditionSetting({
  roomStatus,
  setRoomStatus,
  isParent,
}: ConditionSettingProps) {
  return (
    <>
      <VStackChildren>
        <TwoColumnComponent>
          <FirstColumn>
            <Text>すいしん</Text>
          </FirstColumn>
          <SecondColumn>
            <Text>{roomStatus?.waterDepth}m</Text>
          </SecondColumn>
        </TwoColumnComponent>
        <Component>
          <VerticalRangeSlider
            disabled={!isParent}
            value={roomStatus?.waterDepth ?? 0}
            onChange={(n: number) => {
              if (roomStatus) {
                const newStatus: RoomStatus = {
                  ...roomStatus,
                  waterDepth: n,
                };
                setRoomStatus(newStatus);
              }
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
            <Text>{roomStatus?.tana ?? "??"}m</Text>
          </SecondColumn>
        </TwoColumnComponent>
        <Component>
          <VerticalRangeSlider
            disabled={!isParent}
            value={roomStatus?.tana ?? 0}
            onChange={(n: number) => {
              if (roomStatus) {
                const newStatus = {
                  ...roomStatus,
                  tana: n,
                };
                setRoomStatus(newStatus);
              }
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
                if (roomStatus) {
                  const newStatus = {
                    ...roomStatus,
                    size: value.value,
                  };
                  setRoomStatus(newStatus);
                }
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
                if (roomStatus) {
                  const newStatus = {
                    ...roomStatus,
                    amount: value.value,
                  };
                  setRoomStatus(newStatus);
                }
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
                if (roomStatus) {
                  const newStatus = {
                    ...roomStatus,
                    bottomMaterial: value.value,
                  };
                  setRoomStatus(newStatus);
                }
              }}
            />
          </SecondColumn>
        </TwoColumnComponent>
      </VStackChildren>
    </>
  );
}
