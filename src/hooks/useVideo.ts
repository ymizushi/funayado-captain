import { MutableRefObject, useEffect, useRef, useState } from "react";



export function useVideo(): [ImageCapture|null, MutableRefObject<HTMLVideoElement|null>] {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [imageCapture, setImageCapture] = useState<ImageCapture|null>(null)

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((mediaStream) => {
        const video = ref.current;
        if (video) {
          video.srcObject = mediaStream;
          console.log(mediaStream);
        }

        const track = mediaStream.getVideoTracks()[0];
        setImageCapture(new ImageCapture(track));
      })
      .catch((error) => console.log(`imageCapture failed: ${error}`));
  }, [setImageCapture]);

  return [imageCapture, ref]
}