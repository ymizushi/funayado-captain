import { MutableRefObject, useEffect, useRef, useState } from "react";

export function useMediaStream(): [
  MediaStream | null,
  MutableRefObject<HTMLVideoElement | null>
] {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((mediaStream) => {
        const video = ref.current;
        if (video) {
          video.srcObject = mediaStream;
        }
        setMediaStream(mediaStream);
      })
      .catch((error) => console.log(`getVideoTracks failed: ${error}`));
  }, [setMediaStream]);

  return [mediaStream, ref];
}
