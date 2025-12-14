import { useMemo, useRef, useState } from "react";
import * as htmlToImage from "html-to-image";

const CARD_BG = [
  "/cards/AutumnLeavesCafe.png",
  "/cards/CozyMorningCorner.png",
  "/cards/FoggyMorningMood.png",
  "/cards/GreenPlantCafe.png",
  "/cards/IndustrialConcreteCafe.png",
  "/cards/LibrarylikeQuietCafe.png",
  "/cards/MinimalWhiteCafe.png",
  "/cards/NightStudyNeon.png",
  "/cards/RainyDayWindow.png",
  "/cards/SeasideCafeWindow.png",
  "/cards/SpringBlossomPatio.png",
  "/cards/SummerIcedCoffeeGlow.png",
  "/cards/SunsetGoldenHour.png",
  "/cards/WinterSnowSteam.png",
];

function zodiacFromDate(dateStr: string) {
  // YYYY-MM-DD
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return "";
  // 별자리(간단)
  const md = m * 100 + d;
  if (md >= 321 && md <= 419) return "양자리";
  if (md >= 420 && md <= 520) return "황소자리";
  if (md >= 521 && md <= 621) return "쌍둥이자리";
  if (md >= 622 && md <= 722) return "게자리";
  if (md >= 723 && md <= 822) return "사자자리";
  if (md >= 823 && md <= 923) return "처녀자리";
  if (md >= 924 && md <= 1022) return "천칭자리";
  if (md >= 1023 && md <= 1122) return "전갈자리";
  if (md >= 1123 && md <= 1221) return "사수자리";
  if (md >= 1222 || md <= 119) return "염소자리";
  if (md >= 120 && md <= 218) return "물병자리";
  if (md >= 219 && md <= 320) return "물고기자리";
  return "";
}

export default function ModeA() {
  const cardRef = useRef<HTMLDivElement>(null);

  const [mbti, setMbti] = useState("");
  const [blood, setBlood] = useState("");
  const [birth, setBirth] = useState(""); // YYYY-MM-DD
  const [light1, setLight1] = useState("카페");
  const [light2, setLight2] = useState("몰입");
  const [light3, setLight3] = useState("혼자");

  const zodiac = useMemo(() => zodiacFromDate(birth), [birth]);

  // 간단히: 입력 조합으로 카드 고르기(해시 느낌)
  const bg = useMemo(() => {
    const s = `${mbti}|${blood}|${birth}|${light1}|${light2}|${light3}`;
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return CARD_BG[h % CARD_BG.length];
  }, [mbti, blood, birth, light1, light2, light3]);

  const title = useMemo(() => {
    const a = light1 === "카페" ? "카페" : light1 === "집" ? "집" : "조용한 곳";
    const b = light2 === "몰입" ? "몰입러" : light2 === "루틴" ? "루틴러" : "즉흥러";
    return `${a}에서 빛나는 ${b}`;
  }, [light1, light2]);

  async function downloadCard() {
    if (!cardRef.current) return;
    const dataUrl = await htmlToImage.toPng(cardRef.current, { pixelRatio: 2 });
    const link = document.createElement("a");
    link.download = "result-card.png";
    link.href = dataUrl;
    link.click();
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <h2>A 모드 (재미용)</h2>

      <div style={{ display: "grid", gap: 8, maxWidth: 520 }}>
        <label>
          MBTI (선택)
          <input value={mbti} onChange={(e) => setMbti(e.target.value.toUpperCase())} placeholder="예: INFP" />
        </label>
        <label>
          혈액형 (선택)
          <select value={blood} onChange={(e) => setBlood(e.target.value)}>
            <option value="">선택 안 함</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="O">O</option>
            <option value="AB">AB</option>
          </select>
        </label>
        <label>
          생년월일 (별자리 자동)
          <input type="date" value={birth} onChange={(e) => setBirth(e.target.value)} />
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          <label>
            선호 장소
            <select value={light1} onChange={(e) => setLight1(e.target.value)}>
              <option>카페</option>
              <option>집</option>
              <option>도서관</option>
            </select>
          </label>
          <label>
            작업 리듬
            <select value={light2} onChange={(e) => setLight2(e.target.value)}>
              <option>몰입</option>
              <option>루틴</option>
              <option>즉흥</option>
            </select>
          </label>
          <label>
            에너지
            <select value={light3} onChange={(e) => setLight3(e.target.value)}>
              <option>혼자</option>
              <option>사람들과</option>
              <option>반반</option>
            </select>
          </label>
        </div>
      </div>

      {/* 카드 미리보기 */}
      <div
        ref={cardRef}
        style={{
          width: 600,
          height: 750,
          position: "relative",
          borderRadius: 24,
          overflow: "hidden",
          backgroundImage: `url(${bg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* 텍스트 가독성용 오버레이 */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.25))",
          }}
        />
        <div style={{ position: "absolute", inset: 24, color: "white", display: "grid", gap: 10 }}>
          <div style={{ fontSize: 34, fontWeight: 800, lineHeight: 1.1 }}>{title}</div>
          <div style={{ opacity: 0.95, fontSize: 16 }}>
            {mbti ? `MBTI: ${mbti}  · ` : ""}
            {blood ? `혈액형: ${blood}형  · ` : ""}
            {zodiac ? `별자리: ${zodiac}` : birth ? "별자리 계산중…" : "생년월일을 넣으면 별자리가 나와요"}
          </div>

          <div style={{ marginTop: "auto", display: "grid", gap: 6, fontSize: 16 }}>
            <div>✅ 오늘의 키워드: {light1} / {light2} / {light3}</div>
            <div>⭐ 추천 미션: 25분 집중 + 5분 리셋 (한 번만)</div>
            <div style={{ opacity: 0.9, fontSize: 13 }}>
              * 재미용 결과 카드 (채용/진단 용도 아님)
            </div>
          </div>
        </div>
      </div>

      <div>
        <button onClick={downloadCard} style={{ padding: "10px 16px", borderRadius: 12 }}>
          카드 이미지 다운로드(PNG)
        </button>
      </div>
    </div>
  );
}
