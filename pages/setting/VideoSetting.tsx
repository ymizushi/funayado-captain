import { Button } from "@/components/input/Button";
import { VStackChildren } from "@/components/layout/VStack";
import { Text } from "@/components/text/Text";
import { useImageCapture } from "@/hooks/useImageCapture";
import { useCallback, useEffect, useRef, useState } from "react";
import { useChannel } from "@/hooks/channel/useChannel";
import { CaptureMessageType, CapturePayload } from "@/hooks/channel/message";
import { defaultChannelId } from "@/hooks/channel/channel";

export default function VideoSetting() {
  const [imageCapture, ref] = useImageCapture();
  return (
    <>
      <VStackChildren>
        <video ref={ref} autoPlay></video>
        <ScreenShot id="screenshot" imageCapture={imageCapture} />
      </VStackChildren>
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
  imageCapture,
}: {
  id: string;
  imageCapture: ImageCapture | null;
}) {
  const [captureEvent, _, notifyCaptureEvent] = useChannel<CapturePayload>(
    defaultChannelId,
    CaptureMessageType
  );
  const ref = useRef<HTMLCanvasElement | null>(null);
  const canvas = ref.current;
  const [blob, setBlob] = useState<Blob | null>(null);

  const capture = useCallback(async (): Promise<void> => {
    const imageBitmap = await imageCapture?.grabFrame();
    if (canvas && imageBitmap) {
      canvas.width = imageBitmap.width;
      canvas.height = imageBitmap.height;
      canvas.getContext("2d")?.drawImage(imageBitmap, 0, 0);
      canvas.toBlob((b) => {
        if (b) {
          setBlob(b);
        }
      });
    }
  }, [imageCapture, canvas]);
  const upload = async (blob: Blob): Promise<void> => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async function () {
      var base64data = reader.result;
      navigator.geolocation.getCurrentPosition(async (position) => {
        // if (Object.keys(position.coords).length == 0) {
        //   alert("座標を取得できません");
        // }
        await fetch("/api/image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: base64data,
            coords: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          }),
        });
      });
    };
  };

  useEffect(() => {
    if (captureEvent) {
      capture();
    }
  }, [captureEvent, capture]);

  useEffect(() => {
    if (blob) {
      upload(blob);
    }
  }, [blob]);

  return (
    <>
      <canvas id={id} ref={ref} />
      <Button
        onClick={async () => {
          const res = await notifyCaptureEvent({});
          if (!res.ok) {
            console.error("failed to push data.");
          }
        }}
      >
        <Text>キャプチャー&アップロード依頼</Text>
      </Button>
    </>
  );
}
