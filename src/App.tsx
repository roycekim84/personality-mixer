import { Routes, Route, Link } from "react-router-dom";
import ModeA from "./pages/ModeA";
import ModeB from "./pages/ModeB";
import Gallery from "./pages/Gallery";

function Home() {
  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: 20, display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gap: 8 }}>
        <h1 style={{ margin: 0 }}>Personality Mixer</h1>
        <div style={{ opacity: 0.8 }}>
          가입 없이 바로 사용 가능한 “재미용(A)” / “신뢰용(B)” 성향 리포트
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <Link
          to="/a"
          style={{
            textDecoration: "none",
            color: "inherit",
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: 16,
            padding: 16,
            display: "grid",
            gap: 8,
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 900 }}>A 모드 (재미용)</div>
          <div style={{ opacity: 0.8 }}>선택 + 자동 계산만으로 오늘의 캐릭터 카드 생성</div>
          <div style={{ opacity: 0.7, fontSize: 13 }}>MBTI/혈액형/별자리 + 가벼운 선택 3개</div>
        </Link>

        <Link
          to="/b"
          style={{
            textDecoration: "none",
            color: "inherit",
            border: "1px solid rgba(0,0,0,0.12)",
            borderRadius: 16,
            padding: 16,
            display: "grid",
            gap: 8,
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 900 }}>B 모드 (신뢰용)</div>
          <div style={{ opacity: 0.8 }}>객관식 답변으로 업무 환경/역할 추천</div>
          <div style={{ opacity: 0.7, fontSize: 13 }}>직업명 찍기 X · 환경/역할 중심</div>
        </Link>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      <Link
        to="/gallery"
        style={{
          textDecoration: "none",
          color: "inherit",
          border: "1px solid rgba(0,0,0,0.12)",
          borderRadius: 14,
          padding: "10px 14px",
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        예시 결과 갤러리 보기 →
      </Link>
    </div>


      <div style={{ border: "1px solid rgba(0,0,0,0.12)", borderRadius: 16, padding: 14 }}>
        <div style={{ fontWeight: 900, marginBottom: 6 }}>공유</div>
        <div style={{ opacity: 0.8 }}>
          각 모드에서 <b>공유 링크 복사</b>를 누르면 결과가 URL에 저장돼서 그대로 공유할 수 있어요.
        </div>
      </div>

      <div style={{ opacity: 0.7, fontSize: 12 }}>
        * 본 서비스는 재미/자기이해용이며, 채용/의학/진단의 근거로 사용하지 마세요.
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/a" element={<ModeA />} />
      <Route path="/b" element={<ModeB />} />
      <Route path="/gallery" element={<Gallery />} />
    </Routes>
  );
}
