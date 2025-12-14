import { Routes, Route, Link } from "react-router-dom";
import ModeA from "./pages/ModeA";
import ModeB from "./pages/ModeB";

export default function App() {
  return (
    <div style={{ padding: 24 }}>
      <Routes>
        <Route
          path="/"
          element={
            <div style={{ display: "grid", gap: 12, maxWidth: 420 }}>
              <h1>Personality Mixer</h1>
              <Link to="/a">A 모드 (재미용)</Link>
              <Link to="/b">B 모드 (신뢰용)</Link>
            </div>
          }
        />
        <Route path="/a" element={<ModeA />} />
        <Route path="/b" element={<ModeB />} />
      </Routes>
    </div>
  );
}
