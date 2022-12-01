import { useEffect } from "react";

export function useUpload({ blob }: { blob: Blob | null }) {
  const upload = async (blob: Blob): Promise<void> => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = async function () {
      var base64data = reader.result;
      navigator.geolocation.getCurrentPosition(async (position) => {
        await fetch("/api/image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: base64data,
            coords: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            },
          }),
        });
      });
    };
  };

  useEffect(() => {
    if (blob) {
      upload(blob);
    }
  }, [blob]);
}
