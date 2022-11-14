import { Button } from "@components/input/Button";
import { VStackChildren } from "@components/layout/VStack";
import { Text } from "@components/text/Text";
import { useVideo } from "@hooks/useVideo";
import { MutableRefObject, useRef, useState } from "react";
import { WebClient } from "@slack/web-api";

export type VideoSettingProps = {};

export function VideoSetting({ }: VideoSettingProps) {
  const [imageCapture, ref] = useVideo()
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
  const ref = useRef<HTMLCanvasElement|null>(null)
  const canvas = ref.current

  // const [formData, setFormData] = useState<FormData|null>(null)
  let formData = new FormData();
  const inputFileChangeHandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files?.length) {
      return;
    }
    formData.append('file', event.target.files[0]);
  };

  return <>
    <canvas id={id} ref={ref} />
    <input type="file" multiple accept="image/*" onChange={inputFileChangeHandler} />
    <Button
      onClick={async () => {
        imageCapture
          ?.grabFrame()
          .then((imageBitmap) => {
            console.log("onGrabFrameButtonClick");
            if (canvas) {
              canvas.width = imageBitmap.width;
              canvas.height = imageBitmap.height;
              canvas.getContext("2d")?.drawImage(imageBitmap, 0, 0);
              canvas.toBlob((blob) => {
              } )
            }
          })
          .catch((error) => console.log(error));
      }}
    >
      <Text>録画</Text>
    </Button>

    <Button
      onClick={async () => {
          await fetch('/api/image', {
            method: 'POST',
            body: formData,
          });
      }}>

        <Text>アップロード</Text>
      </Button>
  </>
}