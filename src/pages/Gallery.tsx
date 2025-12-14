import { Link } from "react-router-dom";
import { buildModeAResult } from "../data/modeA";
import { ACard } from "../components/ACard";

const FONT = "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";

const samplesA = [
  { mbti: "INFP", blood: "A", birth: "1996-03-28", l1: "카페", l2: "몰입", l3: "혼자", sht: 1, shb: 2, tpl: 0 },
  { mbti: "ENTP", blood: "B", birth: "1994-07-30", l1: "집", l2: "즉흥", l3: "사람들과", sht: 2, shb: 4, tpl: 1 },
  { mbti: "ISTJ", blood: "O", birth: "1990-12-12", l1: "도서관", l2: "루틴", l3: "반반", sht: 3, shb: 1, tpl: 2 },
  { mbti: "ENFJ", blood: "AB", birth: "1998-05-21", l1: "카페", l2: "루틴", l3: "사람들과", sht: 4, shb: 3, tpl: 0 },
  { mbti: "INTJ", blood: "", birth: "1992-10-25", l1: "집", l2: "몰입", l3: "혼자", sht: 0, shb: 5, tpl: 2 },
  { mbti: "", blood: "A", birth: "2001-02-08", l1: "카페", l2: "즉흥", l3: "반반", sht: 5, shb: 0, tpl: 1 },
] as const;

export default function Gallery() {
  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: 20, display: "grid", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
        <h2 style={{ margin: 0 }}>예시 결과 갤러리</h2>
        <Link to="/" style={{ opacity: 0.8 }}>홈으로</Link>
      </div>

      <div style={{ opacity: 0.8 }}>
        클릭하면 해당 예시 설정으로 바로 이동해요.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12 }}>
        {samplesA.map((s, idx) => {
          const result = buildModeAResult({
            mbti: s.mbti,
            blood: s.blood,
            birth: s.birth,
            light1: s.l1 as any,
            light2: s.l2 as any,
            light3: s.l3 as any,
            shuffleText: s.sht,
            shuffleBg: s.shb,
            templateShift: s.tpl,
          });

          const title = `${s.l1} ${s.l2} · ${s.l3} 타입`;
          const metaLine =
            `${s.mbti ? `MBTI: ${s.mbti} · ` : ""}${s.blood ? `혈액형: ${s.blood}형 · ` : ""}` +
            `${result.zodiac ? `별자리: ${result.zodiac} (${result.element})` : ""}`;

          const qs = new URLSearchParams({
            mbti: s.mbti,
            blood: s.blood,
            birth: s.birth,
            l1: s.l1,
            l2: s.l2,
            l3: s.l3,
            sht: String(s.sht),
            shb: String(s.shb),
            tpl: String(s.tpl),
            font: "system",
          }).toString();

          return (
            <Link key={idx} to={`/a?${qs}`} style={{ textDecoration: "none", color: "inherit" }}>
              <div style={{ border: "1px solid rgba(0,0,0,0.10)", borderRadius: 16, padding: 10 }}>
                <ACard
                  bg={result.bg}
                  templateId={result.templateId}
                  headline={result.headline}
                  title={title}
                  metaLine={metaLine}
                  strengthA={result.strengthA}
                  strengthB={result.strengthB}
                  caution={result.caution}
                  mission={result.mission}
                  fontFamily={FONT}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
