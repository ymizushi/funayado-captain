import { MutableRefObject, useCallback, useRef, useState } from "react";

export function useCapture({
  imageCapture,
}: {
  imageCapture: ImageCapture | null;
}): [Blob | null, MutableRefObject<HTMLCanvasElement | null>, () => void] {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const canvas = ref.current;
  const [blob, setBlob] = useState<Blob | null>(null);

  const capture = useCallback((): void => {
    const imageBitmap = imageCapture?.grabFrame();
    if (canvas && imageBitmap) {
      imageBitmap.then((bitmap) => {
        canvas.width = bitmap.width/2;
        canvas.height = bitmap.height/2;
        canvas.getContext("2d")?.drawImage(bitmap, 0, 0);
        canvas.toBlob((b) => {
          if (b) {
            setBlob(b);
          }
        });
      });
    }
  }, [imageCapture, canvas]);

  return [blob, ref, capture];
}
