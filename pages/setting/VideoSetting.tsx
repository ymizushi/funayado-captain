import { Button } from "@components/input/Button";
import { VStackChildren } from "@components/layout/VStack";
import { Text } from "@components/text/Text";
import { useVideo } from "@hooks/useVideo";

export type VideoSettingProps = {};

export function VideoSetting({}: VideoSettingProps) {
  const [imageCapture, ref] = useVideo()
  return (
    <>
      <VStackChildren>
        <video ref={ref} autoPlay></video>
        <canvas id="canvas"></canvas>
        <Button
          onClick={async () => {
            imageCapture
              ?.grabFrame()
              .then((imageBitmap) => {
                console.log("onGrabFrameButtonClick");
                const canvas = document.querySelector("canvas");
                if (canvas) {
                  canvas.width = imageBitmap.width;
                  canvas.height = imageBitmap.height;
                  canvas.getContext("2d")?.drawImage(imageBitmap, 0, 0);
                  canvas.classList.remove("hidden");
                }
              })
              .catch((error) => console.log(error));
          }}
        >
          <Text>録画</Text>
        </Button>
      </VStackChildren>
    </>
  );
}
