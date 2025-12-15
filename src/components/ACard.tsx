import React from "react";
import { useImageBrightness } from "../hooks/useImageBrightness";

export function ACard({
  bg,
  templateId,
  headline,
  title,
  metaLine,
  strengthA,
  strengthB,
  caution,
  mission,
  fontFamily,
}: {
  bg: string;
  templateId: 0 | 1 | 2;
  headline: string;
  title: string;
  metaLine: string;
  strengthA: string;
  strengthB: string;
  caution: string;
  mission: string;
  fontFamily: string;
}) {
  const brightness = useImageBrightness(bg);

  // 배경이 밝을수록 오버레이를 더 진하게(화이트 텍스트 유지)
  const a =
    brightness == null ? 0.38 :
    brightness > 190 ? 0.60 :
    brightness > 160 ? 0.50 :
    brightness > 130 ? 0.42 : 0.34;

  const overlay = `linear-gradient(to bottom, rgba(0,0,0,${a}), rgba(0,0,0,0.08) 40%, rgba(0,0,0,${a}))`;

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 600,
        aspectRatio: "4 / 5",
        position: "relative",
        borderRadius: 24,
        overflow: "hidden",
        //backgroundImage: `url(${bg})`,
        //backgroundSize: "cover",
        //backgroundPosition: "center",
        fontFamily,
      }}
    >
      {/* ✅ 배경을 img로 */}
    <img
      src={bg}
      crossOrigin="anonymous"
      alt=""
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
      }}
    />
     {/* 오버레이 */}
      <div style={{ position: "absolute", inset: 0, background: overlay }} />
      <CardOverlay
        templateId={templateId}
        headline={headline}
        title={title}
        metaLine={metaLine}
        strengthA={strengthA}
        strengthB={strengthB}
        caution={caution}
        mission={mission}
      />
    </div>
  );
}

function CardOverlay({
  templateId,
  headline,
  title,
  metaLine,
  strengthA,
  strengthB,
  caution,
  mission,
}: {
  templateId: 0 | 1 | 2;
  headline: string;
  title: string;
  metaLine: string;
  strengthA: string;
  strengthB: string;
  caution: string;
  mission: string;
}) {
  const baseWrap: React.CSSProperties = {
    position: "absolute",
    inset: 24,
    color: "white",
    display: "grid",
    gap: 10,
    textShadow: "0 1px 10px rgba(0,0,0,0.25)",
  };

  if (templateId === 0) {
    return (
      <div style={baseWrap}>
        <div style={{ fontSize: 34, fontWeight: 900, lineHeight: 1.08 }}>{headline}</div>
        <div style={{ opacity: 0.95, fontSize: 16, display: "grid", gap: 4 }}>
          <div>{title}</div>
          <div style={{ opacity: 0.9, fontSize: 14 }}>{metaLine}</div>
        </div>

        <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
          <div style={{ fontSize: 16, fontWeight: 800 }}>강점</div>
          <div style={{ fontSize: 15, lineHeight: 1.4 }}>
            • {strengthA}<br />• {strengthB}
          </div>

          <div style={{ fontSize: 16, fontWeight: 800, marginTop: 6 }}>주의</div>
          <div style={{ fontSize: 15, lineHeight: 1.4 }}>• {caution}</div>
        </div>

        <div style={{ marginTop: "auto", display: "grid", gap: 6 }}>
          <div style={{ fontSize: 16, fontWeight: 900 }}>오늘의 미션</div>
          <div style={{ fontSize: 15, lineHeight: 1.4 }}>✅ {mission}</div>
          <div style={{ opacity: 0.85, fontSize: 12 }}>* 재미용 결과</div>
        </div>
      </div>
    );
  }

  if (templateId === 1) {
    return (
      <div style={baseWrap}>
        <div
          style={{
            width: "58%",
            maxWidth: 360,
            background: "rgba(0,0,0,0.48)",
            borderRadius: 18,
            padding: 14,
            display: "grid",
            gap: 10,
          }}
        >
          <div style={{ fontSize: 12, opacity: 0.85, fontWeight: 800 }}>TODAY’S TYPE</div>
          <div style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.1 }}>{headline}</div>
          <div style={{ opacity: 0.9, fontSize: 14 }}>{title}</div>
          <div style={{ opacity: 0.75, fontSize: 12 }}>{metaLine}</div>

          <div style={{ marginTop: 6, display: "grid", gap: 8 }}>
            <div style={{ fontWeight: 900 }}>강점</div>
            <div style={{ fontSize: 13, lineHeight: 1.35 }}>
              • {strengthA}<br />• {strengthB}
            </div>

            <div style={{ fontWeight: 900 }}>미션</div>
            <div style={{ fontSize: 13, lineHeight: 1.35 }}>✅ {mission}</div>
          </div>
        </div>

        <div style={{ marginTop: "auto", opacity: 0.85, fontSize: 12 }}>* 재미용 결과</div>
      </div>
    );
  }

  return (
    <div style={baseWrap}>
      <div
        style={{
          alignSelf: "start",
          justifySelf: "start",
          background: "rgba(0,0,0,0.50)",
          borderRadius: 999,
          padding: "8px 12px",
          fontWeight: 900,
          fontSize: 13,
        }}
      >
        오늘의 타입
      </div>

      <div style={{ fontSize: 34, fontWeight: 950, lineHeight: 1.05 }}>{headline}</div>
      <div style={{ opacity: 0.9, fontSize: 14 }}>{metaLine}</div>

      <div style={{ marginTop: "auto" }}>
        <div
          style={{
            background: "rgba(0,0,0,0.55)",
            borderRadius: 18,
            padding: 14,
            display: "grid",
            gap: 10,
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 900 }}>{title}</div>
          <div style={{ fontSize: 13, lineHeight: 1.35 }}><b>강점</b> • {strengthA} / {strengthB}</div>
          <div style={{ fontSize: 13, lineHeight: 1.35 }}><b>주의</b> • {caution}</div>
          <div style={{ fontSize: 13, lineHeight: 1.35 }}><b>미션</b> • ✅ {mission}</div>
          <div style={{ opacity: 0.85, fontSize: 12 }}>* 재미용 결과</div>
        </div>
      </div>
    </div>
  );
}
