import {
  MutableRefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { defaultChannelId } from "./channel/channel";
import { CaptureMessageType, CapturePayload } from "./channel/message";
import { useChannel } from "./channel/useChannel";

export function useCapture({
  isParent,
  imageCapture,
}: {
  isParent: boolean,
  imageCapture: ImageCapture | null;
}): [
  Blob | null,
  MutableRefObject<HTMLCanvasElement | null>,
  (_payload: CapturePayload) => Promise<Response>
] {
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

  useEffect(() => {
    if (!isParent && captureEvent) {
      capture();
    }
  }, [captureEvent, capture]);

  return [blob, ref, notifyCaptureEvent];
}
