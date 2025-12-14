// src/utils/urlState.ts
export function getSearchParam(key: string): string {
  try {
    const url = new URL(window.location.href);
    return url.searchParams.get(key) ?? "";
  } catch {
    return "";
  }
}

export function setSearchParams(next: Record<string, string>) {
  const url = new URL(window.location.href);
  Object.entries(next).forEach(([k, v]) => {
    if (!v) url.searchParams.delete(k);
    else url.searchParams.set(k, v);
  });
  // 뒤로가기 히스토리 안 쌓고 URL만 갱신
  window.history.replaceState({}, "", url.toString());
}

export function copyToClipboard(text: string) {
  return navigator.clipboard.writeText(text);
}

/** B 모드 답변을 "ABCAB..." 같은 문자열로 압축/복원 */
export function encodeABC(answersByOrder: string[]): string {
  // answersByOrder: ["A","B","C", ...]
  return answersByOrder.join("");
}

export function decodeABC(encoded: string, expectedLen: number): string[] {
  const s = (encoded || "").toUpperCase();
  const out: string[] = [];
  for (let i = 0; i < Math.min(s.length, expectedLen); i++) {
    const ch = s[i];
    out.push(ch === "A" || ch === "B" || ch === "C" ? ch : "");
  }
  while (out.length < expectedLen) out.push("");
  return out;
}
