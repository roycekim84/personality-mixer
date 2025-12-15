import { Routes, Route, Link } from "react-router-dom";
import ModeA from "./pages/ModeA";
import ModeB from "./pages/ModeB";
import Gallery from "./pages/Gallery";
import { Container, Card, Header } from "./components/ui";

function Home() {
  return (
    <Container>
      <div className="page">
        <Header
          title="Personality Mixer"
          subtitle="가입 없이 바로: A(재미용) 감성 카드 · B(신뢰용) 업무 리포트"
          tag={<span>공유 링크로 결과 저장 · 무료 정적 사이트</span>}
        />

        <div className="homeGrid">
          <Link to="/a" className="tile a">
            <div className="tTitle">A 모드 · 재미용 카드</div>
            <div className="tDesc">선택 + 자동 계산만으로 오늘의 타입을 감성 카드로 생성</div>
            <div className="badge">MBTI/혈액형/별자리 + 가벼운 선택</div>
          </Link>

          <Link to="/b" className="tile b">
            <div className="tTitle">B 모드 · 신뢰용 리포트</div>
            <div className="tDesc">객관식 답변 기반으로 업무 환경/역할/액션플랜을 제시</div>
            <div className="badge">점수 분포 · 신뢰도 · 상위 2개 혼합</div>
          </Link>
        </div>

        <div className="btnRow">
          <Link to="/gallery" className="btn ghost">
            예시 결과 갤러리 보기 →
          </Link>
          <a
            className="btn ghost"
            href="https://github.com/"
            onClick={(e) => e.preventDefault()}
            style={{ opacity: 0.75 }}
            title="필요하면 나중에 깃허브 링크/소개 페이지로 교체"
          >
            (옵션) 소개/제작기 링크 자리
          </a>
        </div>

        <Card>
          <div className="cardTitle">주의</div>
          <p className="cardDesc">
            본 서비스는 재미/자기이해용이며, 채용/의학/진단의 근거로 사용하지 마세요.
            공유 링크는 입력/답변 상태를 URL에 저장해 재현하기 위한 용도입니다.
          </p>
        </Card>
      </div>
      <div className="help">build: {__APP_VERSION__}</div>
    </Container>
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
