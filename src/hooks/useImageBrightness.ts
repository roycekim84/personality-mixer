import { useEffect, useState } from "react";

export function useImageBrightness(imageUrl: string) {
  const [brightness, setBrightness] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    if (!imageUrl) {
      setBrightness(null);
      return;
    }

    const img = new Image();
    img.src = imageUrl;
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const w = 48;
        const h = 48;
        canvas.width = w;
        canvas.height = h;

        ctx.drawImage(img, 0, 0, w, h);
        const { data } = ctx.getImageData(0, 0, w, h);

        let sum = 0;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2];
          // perceived luminance
          sum += 0.2126 * r + 0.7152 * g + 0.0722 * b;
        }
        const avg = sum / (data.length / 4);
        if (!cancelled) setBrightness(avg);
      } catch {
        if (!cancelled) setBrightness(null);
      }
    };

    img.onerror = () => {
      if (!cancelled) setBrightness(null);
    };

    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  return brightness; // 0~255, null이면 계산 실패
}
