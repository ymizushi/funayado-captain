import { Button } from "@components/input/Button";
import { VStackChildren } from "@components/layout/VStack";
import { Text } from "@components/text/Text";
import { useImageCapture } from "@hooks/useImageCapture";
import { useCallback, useEffect, useRef, useState } from "react";
import { useChannel } from "@hooks/channel/useChannel";
import { CaptureMessageType, CapturePayload } from "@hooks/channel/message";
import { defaultChannelId } from "@hooks/channel/channel";

export function VideoSetting() {
  const [imageCapture, ref] = useImageCapture();
  return (
    <>
      <VStackChildren>
        <video ref={ref} autoPlay></video>
        <ScreenShot
          id="screenshot"
          imageCapture={imageCapture}
        />
      </VStackChildren>
    </>
  );
}

export function ScreenShot({
  id,
  imageCapture,
}: {
  id: string;
  imageCapture: ImageCapture | null;
}) {
  const [captureEvent, capturedEventLog, notifyCaptureEvent] = useChannel<CapturePayload>(
    defaultChannelId,
    CaptureMessageType
  );
  const ref = useRef<HTMLCanvasElement | null>(null);
  const canvas = ref.current;
  const [blob, setBlob] = useState<Blob | null>(null);

  const capture = useCallback(async (): Promise<void>  =>  {
    const imageBitmap = await imageCapture?.grabFrame()
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
      const formData = new FormData();
      formData.append("file", blob);
      await fetch("/api/image", {
        method: "POST",
        body: formData,
      });
  }

  useEffect(() => {
    if (captureEvent) {
      capture()
    }
  }, [captureEvent, capture]);

  useEffect(() => {
    if (blob) {
      upload(blob)
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
