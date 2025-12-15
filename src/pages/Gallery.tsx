import { Link } from "react-router-dom";
import { buildModeAResult } from "../data/modeA";
import { ACard } from "../components/ACard";
import { Container, Card, Header } from "../components/ui";

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
    <Container>
      <div className="page">
        <Header
          title="예시 결과 갤러리"
          subtitle="클릭하면 해당 설정으로 A 모드가 바로 열려요."
          tag={
            <span style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link to="/" style={{ textDecoration: "none" }}>홈</Link>
              <span style={{ opacity: 0.6 }}>·</span>
              <Link to="/a" style={{ textDecoration: "none" }}>A 모드</Link>
              <span style={{ opacity: 0.6 }}>·</span>
              <Link to="/b" style={{ textDecoration: "none" }}>B 모드</Link>
            </span>
          }
        />

        <Card>
          <div className="cardTitle">팁</div>
          <p className="cardDesc">
            마음에 드는 톤을 찾았으면 A 모드에서 “배경만 셔플”로 분위기를 고정하고 공유해보세요.
          </p>
        </Card>

        <div className="galleryGrid">
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
            } as any);

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
                <div className="card" style={{ padding: 10, borderRadius: 18 }}>
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
      <div className="help">build: {__APP_VERSION__}</div>
    </Container>
  );
}
