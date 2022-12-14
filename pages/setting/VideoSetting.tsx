import { LargeButton } from "@/components/input/Button";
import { VStackChildren } from "@/components/layout/VStack";
import { Text } from "@/components/text/Text";
import { useMediaStream } from "@/hooks/useImageCapture";
import { MutableRefObject, useEffect, useState } from "react";
import {
  FirstColumn,
  SecondColumn,
  TwoColumnComponent,
} from "@/components/layout/TwoColumnComponent";
import { Component } from "@/components/basic/Component";
import { KV, Select } from "@/components/input/Select";
import { useCapture } from "@/hooks/useCapture";
import { useUpload } from "@/hooks/useUpload";
import { useChannel } from "@/hooks/channel/useChannel";
import { CaptureMessageType, CapturePayload } from "@/hooks/channel/message";
import { defaultChannelId } from "@/hooks/channel/channel";

function ChildView({
  notifyCaptureEvent,
}: {
  notifyCaptureEvent: (_payload: CapturePayload) => Promise<Response>;
}) {
  return (
    <VStackChildren>
      <TwoColumnComponent>
        <FirstColumn>
          <Component></Component>
        </FirstColumn>
        <SecondColumn>
          <Component>
            <LargeButton
              onClick={async () => {
                const res = await notifyCaptureEvent({});
                if (!res.ok) {
                  console.error("failed to push data.");
                }
              }}
            >
              <Text>キャプチャー&アップロード依頼</Text>
            </LargeButton>
          </Component>
        </SecondColumn>
      </TwoColumnComponent>
    </VStackChildren>
  );
}

export default function VideoSetting({ isParent }: { isParent: boolean }) {
  const [captureEvent, _, notifyCaptureEvent] = useChannel<CapturePayload>(
    defaultChannelId,
    CaptureMessageType
  );

  const [mediaStream, ref] = useMediaStream();
  const [imageCapture, setImageCapture] = useState<ImageCapture | null>(null);
  const [blob, htmlCanvasElementRef, capture] = useCapture({
    imageCapture,
  });

  useEffect(() => {
    if (mediaStream) {
      const track = mediaStream.getTracks()[0];
      setImageCapture(new ImageCapture(track));
    }
  }, [setImageCapture, mediaStream]);

  useEffect(() => {
    if (captureEvent) {
      capture();
    }
  }, [captureEvent, capture]);

  return (
    <>
      <ChildView notifyCaptureEvent={notifyCaptureEvent} />
      {isParent ? (
        <>
          <VStackChildren>
            <TwoColumnComponent>
              <FirstColumn>
                <Text>せんたく</Text>
              </FirstColumn>
              <SecondColumn>
                <Component>
                  <Select
                    name={"selectCamera"}
                    id={"selectCamera"}
                    values={
                      mediaStream?.getVideoTracks().map((track) => ({
                        key: track.id,
                        name: track.label,
                        value: track.id,
                      })) ?? []
                    }
                    onChange={(kv: KV<string>) => {
                      const head =
                        mediaStream
                          ?.getVideoTracks()
                          .filter((track) => kv.key == track.id)[0] ?? null;
                      return setImageCapture(
                        head ? new ImageCapture(head) : null
                      );
                    }}
                  />
                </Component>
              </SecondColumn>
            </TwoColumnComponent>
          </VStackChildren>
          <VStackChildren>
            <TwoColumnComponent>
              <FirstColumn>
                <Component>
                  <Text>カメラにゅうりょく</Text>
                </Component>
              </FirstColumn>
              <SecondColumn>
                <video ref={ref} autoPlay></video>
              </SecondColumn>
            </TwoColumnComponent>
          </VStackChildren>
          <VStackChildren>
            <ScreenShot
              id="screenshot"
              htmlCanvasElementRef={htmlCanvasElementRef}
              blob={blob}
            />
          </VStackChildren>
        </>
      ) : null}
    </>
  );
}

export type Coords = {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: EpochTimeStamp;
};

export function ScreenShot({
  id,
  htmlCanvasElementRef,
  blob,
}: {
  id: string;
  htmlCanvasElementRef: MutableRefObject<HTMLCanvasElement | null>;
  blob: Blob | null;
}) {
  useUpload({ blob });

  return (
    <TwoColumnComponent>
      <FirstColumn>
        <Component>
          <Text>さつえいけっか</Text>
        </Component>
      </FirstColumn>
      <SecondColumn>
        <canvas id={id} ref={htmlCanvasElementRef} />
      </SecondColumn>
    </TwoColumnComponent>
  );
}
