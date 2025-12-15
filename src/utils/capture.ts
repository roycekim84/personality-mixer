import * as htmlToImage from "html-to-image";

export function withVersion(url: string) {
  try {
    const u = new URL(url, window.location.href);
    u.searchParams.set("v", __APP_VERSION__);
    return u.toString();
  } catch {
    // fallback
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}v=${__APP_VERSION__}`;
  }
}

export async function nextPaint() {
  await new Promise<void>((r) => requestAnimationFrame(() => r()));
  await new Promise<void>((r) => requestAnimationFrame(() => r()));
}

export async function waitForImages(root: HTMLElement) {
  const imgs = Array.from(root.querySelectorAll("img"));
  await Promise.all(
    imgs.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise<void>((resolve) => {
        const done = () => resolve();
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
      });
    })
  );
}

export async function fetchAsDataUrl(url: string) {
  // cache 변수 제거(특히 iOS)
  const res = await fetch(url, { cache: "no-store" });
  const blob = await res.blob();
  return await new Promise<string>((resolve) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.readAsDataURL(blob);
  });
}

export async function nodeToBlob(node: HTMLElement) {
  // toBlob이 iOS에서 더 안정적일 때가 많음
  const blob = await htmlToImage.toBlob(node, {
    pixelRatio: 2,
    cacheBust: true,
  });
  if (blob) return blob;

  // fallback
  const dataUrl = await htmlToImage.toPng(node, { pixelRatio: 2, cacheBust: true });
  const bin = atob(dataUrl.split(",")[1]);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: "image/png" });
}
