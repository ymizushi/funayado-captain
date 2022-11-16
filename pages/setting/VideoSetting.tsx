import { Button } from "@components/input/Button";
import { VStackChildren } from "@components/layout/VStack";
import { Text } from "@components/text/Text";
import { useImageCapture } from "@hooks/useImageCapture";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { WebClient } from "@slack/web-api";
import { useChannel } from "@hooks/useChannel";
import { CaptureMessage, CaptureMessageType } from "@hooks/channel/message";

export type VideoSettingProps = {};

export function VideoSetting({ }: VideoSettingProps) {
  const [imageCapture, ref] = useImageCapture()
  return (
    <>
      <VStackChildren>
        <video ref={ref} autoPlay></video>
        <ScreenShot id="screenshot" imageCapture={imageCapture} />
      </VStackChildren>
    </>
  );
}

export function ScreenShot({ id, imageCapture }: { id: string, imageCapture: ImageCapture | null }) {
  const roomId = "default-room"
  const [latest, eventLog] = useChannel<CaptureMessage>(roomId, "capture")
  const ref = useRef<HTMLCanvasElement|null>(null)
  const canvas = ref.current
  const [blob, setBlob] = useState<Blob|null>(null)

  const capture = async () => {
        imageCapture
          ?.grabFrame()
          .then(imageBitmap => {
            if (canvas) {
              canvas.width = imageBitmap.width;
              canvas.height = imageBitmap.height;
              canvas.getContext("2d")?.drawImage(imageBitmap, 0, 0);
              canvas.toBlob((b) => {
                if (b) {
                  setBlob(b)
                }
              } )
            }
            return null
          })
          .catch((error) => console.log(error));
      } 
  const upload =  async () => {
    if (blob) {
      const formData = new FormData()
      formData.append('file', blob)
      await fetch('/api/image', {
        method: 'POST',
        body: formData,
      });
    }
  }    


  useEffect(() => {
    if(latest) {
      capture()
      console.log("captured!!")
    }
  }, [latest])

  return <>
    <canvas id={id} ref={ref} />
    <Button
      onClick={capture}
    >
      <Text>キャプチャー</Text>
    </Button>

    <Button
      onClick={async () => {
        const body: CaptureMessage = {
          channelId: roomId,
          threadId: "capture",
          messageType: CaptureMessageType,
          payload: {}
        }
        const res = await fetch("/api/socket", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!res.ok) {
          console.error("failed to push data.");
        } else {
        } }
    }
    >
      <Text>ポスト</Text>
    </Button>

    <Button
      onClick={upload}>

        <Text>アップロード</Text>
      </Button>
  </>
}