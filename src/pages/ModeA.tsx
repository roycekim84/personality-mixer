import { useMemo, useRef, useState } from "react";
import * as htmlToImage from "html-to-image";
import {
  BLOOD_OPTIONS,
  MBTI_OPTIONS,
  buildModeAResult
} from "../data/modeA";
import { useEffect } from "react";
import { getSearchParam, setSearchParams, copyToClipboard } from "../utils/urlState";

export default function ModeA() {
    
  const cardRef = useRef<HTMLDivElement>(null);

const [mbti, setMbti] = useState<string>(() => getSearchParam("mbti"));
const [blood, setBlood] = useState<string>(() => getSearchParam("blood"));
const [birth, setBirth] = useState<string>(() => getSearchParam("birth"));

const [light1, setLight1] = useState<any>(() => (getSearchParam("l1") as any) || "카페");
const [light2, setLight2] = useState<any>(() => (getSearchParam("l2") as any) || "몰입");
const [light3, setLight3] = useState<any>(() => (getSearchParam("l3") as any) || "혼자");

const [shuffle, setShuffle] = useState<number>(() => Number(getSearchParam("sh") || "0"));

useEffect(() => {
  setSearchParams({
    mbti,
    blood,
    birth,
    l1: light1,
    l2: light2,
    l3: light3,
    sh: String(shuffle || 0),
  });
}, [mbti, blood, birth, light1, light2, light3, shuffle]);

  const result = useMemo(() => {
    return buildModeAResult({
      mbti,
      blood,
      birth,
      light1,
      light2,
      light3,
      shuffle,
    });
  }, [mbti, blood, birth, light1, light2, light3, shuffle]);

  const title = useMemo(() => {
    const place = light1 === "카페" ? "카페" : light1 === "집" ? "집" : "도서관";
    const rhythm = light2 === "몰입" ? "몰입" : light2 === "루틴" ? "루틴" : "즉흥";
    const energy = light3;
    return `${place} ${rhythm} · ${energy} 타입`;
  }, [light1, light2, light3]);

  async function downloadCard() {
    if (!cardRef.current) return;
    const dataUrl = await htmlToImage.toPng(cardRef.current, { pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = "A-result-card.png";
    link.href = dataUrl;
    link.click();
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
      // fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      alert("결과 텍스트를 복사했어요!");
    }
  }

  const canShowZodiacHint = birth.length > 0;

  

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gap: 6 }}>
        <h2 style={{ margin: 0 }}>A 모드 (재미용)</h2>
        <div style={{ opacity: 0.8 }}>
          선택 + 자동 계산만으로 “오늘의 캐릭터”를 뽑아줘요.
        </div>
      </div>

      {/* 입력 */}
      <div style={{ display: "grid", gap: 10, maxWidth: 560 }}>
        <label style={{ display: "grid", gap: 6 }}>
          MBTI (선택)
          <select value={mbti} onChange={(e) => setMbti(e.target.value)}>
            {MBTI_OPTIONS.map((v) => (
              <option key={v} value={v}>
                {v === "" ? "선택 안 함" : v}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          혈액형 (선택)
          <select value={blood} onChange={(e) => setBlood(e.target.value)}>
            {BLOOD_OPTIONS.map((v) => (
              <option key={v} value={v}>
                {v === "" ? "선택 안 함" : `${v}형`}
              </option>
            ))}
          </select>
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          생년월일 (별자리 자동)
          <input type="date" value={birth} onChange={(e) => setBirth(e.target.value)} />
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <label style={{ display: "grid", gap: 6 }}>
            선호 장소
            <select value={light1} onChange={(e) => setLight1(e.target.value as any)}>
              <option value="카페">카페</option>
              <option value="집">집</option>
              <option value="도서관">도서관</option>
            </select>
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            작업 리듬
            <select value={light2} onChange={(e) => setLight2(e.target.value as any)}>
              <option value="몰입">몰입</option>
              <option value="루틴">루틴</option>
              <option value="즉흥">즉흥</option>
            </select>
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            에너지
            <select value={light3} onChange={(e) => setLight3(e.target.value as any)}>
              <option value="혼자">혼자</option>
              <option value="사람들과">사람들과</option>
              <option value="반반">반반</option>
            </select>
          </label>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={() => setShuffle((s) => s + 1)}
            style={{ padding: "10px 14px", borderRadius: 12 }}
          >
            결과 다시 뽑기(셔플)
          </button>

          <button
            onClick={copyResultText}
            style={{ padding: "10px 14px", borderRadius: 12 }}
          >
            결과 텍스트 복사
          </button>

          <button
            onClick={downloadCard}
            style={{ padding: "10px 14px", borderRadius: 12 }}
          >
            카드 이미지 다운로드(PNG)
          </button>

          <button
            onClick={async () => {
                try {
                await copyToClipboard(window.location.href);
                alert("공유 링크를 복사했어요!");
                } catch {
                alert("복사 권한이 없어요. 주소창 URL을 직접 복사해 주세요.");
                }
            }}
            style={{ padding: "10px 14px", borderRadius: 12 }}
            >
            공유 링크 복사
            </button>
        </div>
      </div>

      {/* 카드 미리보기 */}
      <div
        ref={cardRef}
        style={{
            width: "100%",
            maxWidth: 600,
            aspectRatio: "4 / 5",
            position: "relative",
            borderRadius: 24,
            overflow: "hidden",
            backgroundImage: `url(${result.bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}

      >
        {/* 가독성 오버레이 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.35), rgba(0,0,0,0.08) 40%, rgba(0,0,0,0.35))",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 24,
            color: "white",
            display: "grid",
            gap: 10,
          }}
        >
          <div style={{ fontSize: 34, fontWeight: 900, lineHeight: 1.08 }}>
            {result.headline}
          </div>

          <div style={{ opacity: 0.95, fontSize: 16, display: "grid", gap: 4 }}>
            <div>{title}</div>
            <div style={{ opacity: 0.9, fontSize: 14 }}>
              {mbti ? `MBTI: ${mbti}  · ` : ""}
              {blood ? `혈액형: ${blood}형  · ` : ""}
              {canShowZodiacHint
                ? result.zodiac
                  ? `별자리: ${result.zodiac} (${result.element})`
                  : "별자리 계산중…"
                : "생년월일을 넣으면 별자리가 나와요"}
            </div>
          </div>

          <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
            <div style={{ fontSize: 16, fontWeight: 800 }}>강점</div>
            <div style={{ fontSize: 15, lineHeight: 1.4 }}>
              • {result.strengthA}
              <br />• {result.strengthB}
            </div>

            <div style={{ fontSize: 16, fontWeight: 800, marginTop: 6 }}>주의</div>
            <div style={{ fontSize: 15, lineHeight: 1.4 }}>• {result.caution}</div>
          </div>

          <div style={{ marginTop: "auto", display: "grid", gap: 6 }}>
            <div style={{ fontSize: 16, fontWeight: 900 }}>오늘의 미션</div>
            <div style={{ fontSize: 15, lineHeight: 1.4 }}>✅ {result.mission}</div>

            <div style={{ opacity: 0.85, fontSize: 12 }}>
              * 재미용 결과 카드 (진단/채용/의학적 판단 용도 아님)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
