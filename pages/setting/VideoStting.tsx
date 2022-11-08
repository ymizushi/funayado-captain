import { Button } from "@components/input/Button";
import { VStackChildren } from "@components/layout/VStack";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Text } from "@components/text/Text"

function Video({setImageCapture}: {setImageCapture:  Dispatch<SetStateAction<ImageCapture | null>>}) {
  const ref = useRef<HTMLVideoElement|null>(null)
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({video: true})
      .then(mediaStream => {
        const video = ref.current
        if (video) {
          video.srcObject = mediaStream
          console.log(mediaStream)
        }
      
        const track = mediaStream.getVideoTracks()[0];
        setImageCapture(new ImageCapture(track))
      })
      .catch(error => console.log(`imageCapture failed: ${error}`));
    }, [])
  return <video ref={ref} autoPlay></video>
}

export type VideoSettingProps = {

}

export function VideoSetting({}: VideoSettingProps) {
  const [imageCapture, setImageCapture] = useState<ImageCapture|null>(null);
  return <>
    <VStackChildren>
      <Video setImageCapture={setImageCapture} />
      <canvas id="canvas"></canvas>

      <Button
        onClick={async () => {
          imageCapture?.grabFrame()
          .then(imageBitmap => {
            console.log("onGrabFrameButtonClick")
            const canvas = document.querySelector('canvas');
            if (canvas) {
              canvas.width = imageBitmap.width
              canvas.height = imageBitmap.height
              canvas.getContext('2d')?.drawImage(imageBitmap, 0, 0);
              canvas.classList.remove('hidden')
            }
          })
          .catch(error => console.log(error));
        }}
      >
        <Text>録画</Text>
      </Button>
    </VStackChildren>
  </>
}

