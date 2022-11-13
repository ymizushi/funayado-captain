import { Button } from "@components/input/Button";
import { VStackChildren } from "@components/layout/VStack";
import { Text } from "@components/text/Text";
import { useVideo } from "@hooks/useVideo";
import { MutableRefObject, useRef } from "react";

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
  return <>
    <canvas id={id} ref={ref} />
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
                uploadImage(blob)

              } )
            }
          })
          .catch((error) => console.log(error));
      }}
    >
      <Text>録画</Text>
    </Button>
  </>
}