// src/utils/share.ts
export function dataUrlToBlob(dataUrl: string): Blob {
  const [meta, base64] = dataUrl.split(",");
  const mime = meta.match(/data:(.*?);base64/)?.[1] ?? "image/png";
  const bin = atob(base64);
  const len = bin.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

export async function shareFileOrFallback(opts: {
  file: File;
  title: string;
  text: string;
  url?: string;
  onFallback: () => void;
}) {
  try {
    const navAny = navigator as any;

    // Web Share API 지원 여부
    if (!navAny.share) return opts.onFallback();

    // files 공유 지원 여부 (iOS/Android 대부분 OK, 데스크탑은 케이스 있음)
    const canShareFiles =
      typeof navAny.canShare === "function"
        ? navAny.canShare({ files: [opts.file] })
        : true;

    if (!canShareFiles) return opts.onFallback();

    await navAny.share({
      title: opts.title,
      text: opts.text,
      url: opts.url,
      files: [opts.file],
    });
  } catch {
    // 사용자가 취소했거나/권한 문제/브라우저 제한 등
    opts.onFallback();
  }
}
