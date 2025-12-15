import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { BLOOD_OPTIONS, MBTI_OPTIONS, buildModeAResult } from "../data/modeA";
import { getSearchParam, setSearchParams, copyToClipboard } from "../utils/urlState";
import { shareFileOrFallback } from "../utils/share";
import { ACard } from "../components/ACard";
import { Container, Card, Header } from "../components/ui";
import { withVersion, fetchAsDataUrl, nextPaint, waitForImages, nodeToBlob } from "../utils/capture";


type Light1 = "카페" | "집" | "도서관";
type Light2 = "몰입" | "루틴" | "즉흥";
type Light3 = "혼자" | "사람들과" | "반반";

const FONT_MAP: Record<string, string> = {
  system: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
  serif: "ui-serif, Georgia, 'Times New Roman', serif",
  mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace",
};

export default function ModeA() {
  const cardRef = useRef<HTMLDivElement>(null);

  const [mbti, setMbti] = useState<string>(() => getSearchParam("mbti"));
  const [blood, setBlood] = useState<string>(() => getSearchParam("blood"));
  const [birth, setBirth] = useState<string>(() => getSearchParam("birth"));

  const [light1, setLight1] = useState<Light1>(() => (getSearchParam("l1") as Light1) || "카페");
  const [light2, setLight2] = useState<Light2>(() => (getSearchParam("l2") as Light2) || "몰입");
  const [light3, setLight3] = useState<Light3>(() => (getSearchParam("l3") as Light3) || "혼자");

  const shLegacy = getSearchParam("sh");
  const [shuffleText, setShuffleText] = useState<number>(() => Number(getSearchParam("sht") || shLegacy || "0"));
  const [shuffleBg, setShuffleBg] = useState<number>(() => Number(getSearchParam("shb") || shLegacy || "0"));
  const [templateShift, setTemplateShift] = useState<number>(() => Number(getSearchParam("tpl") || "0"));

  const [fontKey, setFontKey] = useState<string>(() => getSearchParam("font") || "system");

  const [captureBg, setCaptureBg] = useState<string | null>(null);


  
  useEffect(() => {
    setSearchParams({
      mbti,
      blood,
      birth,
      l1: light1,
      l2: light2,
      l3: light3,
      sht: String(shuffleText || 0),
      shb: String(shuffleBg || 0),
      tpl: String(templateShift || 0),
      font: fontKey,
    });
  }, [mbti, blood, birth, light1, light2, light3, shuffleText, shuffleBg, templateShift, fontKey]);

  const result = useMemo(() => {
    return buildModeAResult({
      mbti,
      blood,
      birth,
      light1,
      light2,
      light3,
      shuffleText,
      shuffleBg,
      templateShift,
    } as any);
  }, [mbti, blood, birth, light1, light2, light3, shuffleText, shuffleBg, templateShift]);

  const title = useMemo(() => {
    const place = light1 === "카페" ? "카페" : light1 === "집" ? "집" : "도서관";
    const rhythm = light2 === "몰입" ? "몰입" : light2 === "루틴" ? "루틴" : "즉흥";
    return `${place} ${rhythm} · ${light3} 타입`;
  }, [light1, light2, light3]);

  const metaLine = useMemo(() => {
    const parts: string[] = [];
    if (mbti) parts.push(`MBTI: ${mbti}`);
    if (blood) parts.push(`혈액형: ${blood}형`);
    if (birth && result.zodiac) parts.push(`별자리: ${result.zodiac} (${result.element})`);
    if (!birth) parts.push("생년월일을 넣으면 별자리가 나와요");
    return parts.join("  ·  ");
  }, [mbti, blood, birth, result.zodiac, result.element]);

  const bgAbs = useMemo(() => withVersion(new URL(result.bg, window.location.href).toString()), [result.bg]);
  const bgForCard = captureBg ?? bgAbs;

  async function captureCardBlob() {
  if (!cardRef.current) throw new Error("no card");

  // 1) bg를 강제로 dataURL로 인라인(가장 중요)
  const bgData = await fetchAsDataUrl(bgAbs);
  setCaptureBg(bgData);

  // 2) 렌더 반영 + 폰트/이미지 로딩 대기
  await (document as any).fonts?.ready?.catch?.(() => {});
  await nextPaint();
  await waitForImages(cardRef.current);

  // 3) 캡처(blob)
  const blob = await nodeToBlob(cardRef.current);

  // 4) 원복
  setCaptureBg(null);

  return blob;
}

async function downloadCard() {
  const blob = await captureCardBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "A-result-card.png";
  a.click();
  URL.revokeObjectURL(url);
}

async function shareCard() {
  const blob = await captureCardBlob();
  const file = new File([blob], "A-result-card.png", { type: "image/png" });

  const shareText = `${result.headline}\n${title}\n(재미용 결과 카드)`;
  const shareUrl = window.location.href;

  await shareFileOrFallback({
    file,
    title: "Personality Mixer - A 결과",
    text: shareText,
    url: shareUrl,
    onFallback: async () => {
      // 공유 미지원/실패 시 다운로드로
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "A-result-card.png";
      a.click();
      URL.revokeObjectURL(url);

      try {
        await navigator.clipboard.writeText(shareUrl);
        alert("공유가 지원되지 않아 카드 다운로드 + 링크 복사를 대신했어요!");
      } catch {
        alert("공유가 지원되지 않아 카드 다운로드를 대신했어요.");
      }
    },
  });
}


  async function copyResultText() {
    const lines: string[] = [];
    lines.push(`[A 모드 결과] ${result.headline}`);
    lines.push(`- ${title}`);
    if (birth) lines.push(`- 생년월일: ${birth}${result.zodiac ? ` (${result.zodiac}, ${result.element} 원소)` : ""}`);
    if (mbti) lines.push(`- MBTI: ${mbti}`);
    if (blood) lines.push(`- 혈액형: ${blood}형`);
    lines.push(`- 강점: ${result.strengthA} / ${result.strengthB}`);
    lines.push(`- 주의: ${result.caution}`);
    lines.push(`- 오늘의 미션: ${result.mission}`);
    lines.push(`* 재미용 결과(진단/채용 판단 용도 아님)`);

    const text = lines.join("\n");
    try {
      await navigator.clipboard.writeText(text);
      alert("결과 텍스트를 복사했어요!");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      alert("결과 텍스트를 복사했어요!");
    }
  }  

  return (
    <Container>
      <div className="page page--a">
        <Header
          title="A 모드"
          subtitle="감성 카드 스튜디오 — 선택 + 자동 계산으로 오늘의 타입을 카드로 만들어줘요."
          tag={
            <span style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link to="/" style={{ textDecoration: "none" }}>홈</Link>
              <span style={{ opacity: 0.6 }}>·</span>
              <Link to="/gallery" style={{ textDecoration: "none" }}>예시 갤러리</Link>
            </span>
          }
        />

        <div className="split">
          {/* 좌: 컨트롤 패널 */}
          <div style={{ display: "grid", gap: 12 }}>
            <Card>
              <div className="cardTitle">입력</div>
              <div className="formGrid">
                <label className="label">
                  <span>MBTI (선택)</span>
                  <select className="select" value={mbti} onChange={(e) => setMbti(e.target.value)}>
                    {MBTI_OPTIONS.map((v) => (
                      <option key={v} value={v}>{v === "" ? "선택 안 함" : v}</option>
                    ))}
                  </select>
                </label>

                <label className="label">
                  <span>혈액형 (선택)</span>
                  <select className="select" value={blood} onChange={(e) => setBlood(e.target.value)}>
                    {BLOOD_OPTIONS.map((v) => (
                      <option key={v} value={v}>{v === "" ? "선택 안 함" : `${v}형`}</option>
                    ))}
                  </select>
                </label>

                <label className="label">
                  <span>생년월일 (별자리 자동)</span>
                  <input className="input" type="date" value={birth} onChange={(e) => setBirth(e.target.value)} />
                </label>

                <div className="triGrid">
                  <label className="label">
                    <span>선호 장소</span>
                    <select className="select" value={light1} onChange={(e) => setLight1(e.target.value as Light1)}>
                      <option value="카페">카페</option>
                      <option value="집">집</option>
                      <option value="도서관">도서관</option>
                    </select>
                  </label>

                  <label className="label">
                    <span>작업 리듬</span>
                    <select className="select" value={light2} onChange={(e) => setLight2(e.target.value as Light2)}>
                      <option value="몰입">몰입</option>
                      <option value="루틴">루틴</option>
                      <option value="즉흥">즉흥</option>
                    </select>
                  </label>

                  <label className="label">
                    <span>에너지</span>
                    <select className="select" value={light3} onChange={(e) => setLight3(e.target.value as Light3)}>
                      <option value="혼자">혼자</option>
                      <option value="사람들과">사람들과</option>
                      <option value="반반">반반</option>
                    </select>
                  </label>
                </div>

                <label className="label">
                  <span>카드 폰트</span>
                  <select className="select" value={fontKey} onChange={(e) => setFontKey(e.target.value)}>
                    <option value="system">기본</option>
                    <option value="serif">Serif</option>
                    <option value="mono">Mono</option>
                  </select>
                </label>

                <div className="divider" />

                <div style={{ display: "grid", gap: 8 }}>
                  <div className="badge">셔플</div>
                  <div className="btnRow">
                    <button className="btn a" onClick={() => setShuffleText((s) => s + 1)}>문구만</button>
                    <button className="btn a" onClick={() => setShuffleBg((s) => s + 1)}>배경만</button>
                    <button
                      className="btn a"
                      onClick={() => { setShuffleText((s) => s + 1); setShuffleBg((s) => s + 1); }}
                    >
                      둘 다
                    </button>
                    <button className="btn a" onClick={() => setTemplateShift((s) => s + 1)}>템플릿</button>
                  </div>
                </div>

                <div style={{ display: "grid", gap: 8, marginTop: 6 }}>
                  <div className="badge">내보내기</div>
                  <div className="btnRow">
                    <button className="btn primary" onClick={shareCard}>공유하기(모바일)</button>
                    <button className="btn" onClick={downloadCard}>PNG 다운로드</button>
                    <button className="btn" onClick={copyResultText}>텍스트 복사</button>
                    <button
                      className="btn"
                      onClick={async () => {
                        try {
                          await copyToClipboard(window.location.href);
                          alert("공유 링크를 복사했어요!");
                        } catch {
                          alert("복사 권한이 없어요. 주소창 URL을 직접 복사해 주세요.");
                        }
                      }}
                    >
                      링크 복사
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="cardTitle">요약</div>
              <p className="cardDesc" style={{ marginBottom: 10 }}>
                {result.headline}
              </p>
              <div className="badge">{title}</div>
              <div style={{ marginTop: 10 }} className="help">
                * A 모드는 “감성/재미” 중심 카드예요. (진단/채용 판단 용도 아님)
              </div>
            </Card>
          </div>

          {/* 우: 프리뷰 */}
          <div className="sticky" style={{ display: "grid", gap: 12 }}>
            <Card pad={false}>
              <div ref={cardRef as any} style={{ padding: 12 }}>
                <ACard
                  bg={bgForCard}
                  templateId={result.templateId}
                  headline={result.headline}
                  title={title}
                  metaLine={metaLine}
                  strengthA={result.strengthA}
                  strengthB={result.strengthB}
                  caution={result.caution}
                  mission={result.mission}
                  fontFamily={FONT_MAP[fontKey] ?? FONT_MAP.system}
                />
              </div>
            </Card>

            <Card>
              <div className="cardTitle">공유 팁</div>
              <p className="cardDesc">
                “배경만 셔플”로 카드 톤을 고르고 → “공유하기(모바일)”로 바로 보내면 가장 자연스럽게 퍼져요.
              </p>
            </Card>
          </div>
        </div>
      </div>
      <div className="help">build: {__APP_VERSION__}</div>
    </Container>
  );
}
