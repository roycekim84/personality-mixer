import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  B_QUESTIONS,
  B_TYPES,
  buildModeBResult,
  type BChoiceKey,
  type ModeBAnswers,
} from "../data/modeB";

import {
  getSearchParam,
  setSearchParams,
  copyToClipboard,
  encodeABC,
  decodeABC,
} from "../utils/urlState";

import { Container, Card, Header } from "../components/ui";

export default function ModeB() {
  const [answers, setAnswers] = useState<ModeBAnswers>(() => {
    const encoded = getSearchParam("b");
    const arr = decodeABC(encoded, B_QUESTIONS.length);
    const obj: ModeBAnswers = {};
    B_QUESTIONS.forEach((q, i) => {
      const v = arr[i];
      if (v === "A" || v === "B" || v === "C") obj[q.id] = v as any;
    });
    return obj;
  });

  useEffect(() => {
    const arr = B_QUESTIONS.map((q) => answers[q.id] ?? "");
    setSearchParams({ b: encodeABC(arr) });
  }, [answers]);

  const result = useMemo(() => buildModeBResult(answers), [answers]);
  const ratio = result.total ? result.answeredCount / result.total : 0;

  const confidence =
    ratio >= 0.9
      ? { label: "높음", hint: "답변이 충분해서 추천 신뢰도가 높아요." }
      : ratio >= 0.6
      ? { label: "보통", hint: "대체로 괜찮아요. 몇 개 더 답하면 좋아요." }
      : { label: "낮음", hint: "아직 정보가 적어요. 더 답하면 정확도가 올라가요." };

  const maxScore = Math.max(...result.ranked.map((x) => x.v), 1);

  function setAnswer(qid: string, key: BChoiceKey) {
    setAnswers((prev) => ({ ...prev, [qid]: key }));
  }

  function resetAll() {
    setAnswers({});
  }

  async function copySummary() {
    const t = result.topInfo;
    const s = result.secondInfo;

    const lines: string[] = [];
    lines.push(`[B 모드 결과] ${t.title}`);
    lines.push(`- 한줄: ${t.oneLiner}`);
    lines.push(`- 2순위 성향: ${s.title}`);
    lines.push("");
    lines.push(`신뢰도: ${confidence.label} (${result.answeredCount}/${result.total})`);
    lines.push("");

    lines.push("✅ 추천 환경:");
    t.bestEnv.forEach((x) => lines.push(`- ${x}`));
    lines.push("");

    lines.push("✅ 잘 맞는 역할:");
    t.goodRoles.forEach((x) => lines.push(`- ${x}`));
    lines.push("");

    lines.push("⚠️ 주의:");
    t.watchouts.forEach((x) => lines.push(`- ${x}`));
    lines.push("");

    lines.push("🧪 바로 해볼 실험:");
    t.experiments.forEach((x) => lines.push(`- ${x}`));
    lines.push("");

    lines.push("🗺️ 액션 플랜:");
    lines.push("오늘:");
    t.actionPlan.today.forEach((x) => lines.push(`- ${x}`));
    lines.push("이번주:");
    t.actionPlan.week.forEach((x) => lines.push(`- ${x}`));
    lines.push("이번달:");
    t.actionPlan.month.forEach((x) => lines.push(`- ${x}`));
    lines.push("");
    lines.push("* 자기이해/참고용(채용/진단 판단 용도 아님)");

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

  const blendLine = `주 성향은 ${result.topInfo.title}, 보조 성향은 ${result.secondInfo.title} 쪽이 함께 섞여 있어요.`;

  return (
    <Container>
      <div className="page page--b">
        <Header
          title="B 모드"
          subtitle="리포트 대시보드 — 객관식 답변 기반으로 업무 환경/역할/액션 플랜을 제시해요."
          tag={
            <span style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Link to="/" style={{ textDecoration: "none" }}>홈</Link>
              <span style={{ opacity: 0.6 }}>·</span>
              <Link to="/gallery" style={{ textDecoration: "none" }}>예시 갤러리</Link>
            </span>
          }
        />

        <div
          className="split"
          style={{
            gridTemplateColumns: "minmax(320px, 520px) 1fr",
          }}
        >
          {/* 좌: 질문 */}
          <div style={{ display: "grid", gap: 12 }}>
            <Card>
              <div className="cardTitle">진행 상황</div>
              <p className="cardDesc" style={{ marginBottom: 10 }}>
                답변 수가 많을수록 추천 신뢰도가 올라가요. ({result.answeredCount}/{result.total})
              </p>
              <div className="pbar">
                <div style={{ width: `${Math.round(ratio * 100)}%` }} />
              </div>
              <div style={{ marginTop: 10 }} className="help">
                신뢰도: <b>{confidence.label}</b> · {confidence.hint}
              </div>
              <div className="btnRow" style={{ marginTop: 12 }}>
                <button className="btn b" onClick={resetAll}>초기화</button>
              </div>
            </Card>

            <div style={{ display: "grid", gap: 12 }}>
              {B_QUESTIONS.map((q, idx) => (
                <div key={q.id} className="qCard">
                  <div className="qTitle">
                    {idx + 1}. {q.title}
                  </div>

                  <div style={{ display: "grid", gap: 10 }}>
                    {q.choices.map((c) => {
                      const checked = answers[q.id] === c.key;
                      return (
                        <label
                          key={c.key}
                          className={checked ? "choice active" : "choice"}
                        >
                          <input
                            type="radio"
                            name={q.id}
                            checked={checked}
                            onChange={() => setAnswer(q.id, c.key)}
                          />
                          <span>{c.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 우: 리포트 */}
          <div className="sticky" style={{ display: "grid", gap: 12 }}>
            <Card>
              <div className="reportTop">
                <div>
                  <div className="badge">결과 리포트</div>
                  <h3 className="reportTitle" style={{ marginTop: 10 }}>
                    {result.topInfo.title}
                  </h3>
                  <p className="reportLine">{result.topInfo.oneLiner}</p>
                  <div className="help" style={{ marginTop: 6 }}>
                    2순위 성향: <b>{result.secondInfo.title}</b>
                  </div>
                </div>

                <div className="btnRow">
                  <button className="btn primary" onClick={copySummary}>리포트 텍스트 복사</button>
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

              <div className="divider" />

              <div className="badge">신뢰도: {confidence.label} · {result.answeredCount}/{result.total}</div>
              <div style={{ marginTop: 10 }} className="pbar">
                <div style={{ width: `${Math.round(ratio * 100)}%` }} />
              </div>

              <div className="divider" />

              <div className="kvGrid">
                {/* 혼합 + 분포 */}
                <div className="qCard" style={{ padding: 14 }}>
                  <div className="sectionTitle">🧩 혼합 설명</div>
                  <div className="cardDesc">{blendLine}</div>

                  <div className="divider" />

                  <div className="sectionTitle">📊 점수 분포</div>
                  <div style={{ display: "grid", gap: 10 }}>
                    {result.ranked.map(({ k, v }) => (
                      <div key={k} style={{ display: "grid", gap: 6 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "rgba(255,255,255,.80)" }}>
                          <span>{B_TYPES[k].title}</span>
                          <span>{v}</span>
                        </div>
                        <div className="pbar">
                          <div style={{ width: `${Math.round((v / maxScore) * 100)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="help" style={{ marginTop: 10 }}>
                    * 점수는 성향 “경향”을 보는 참고값이에요.
                  </div>
                </div>

                {/* 액션 플랜 */}
                <div className="qCard" style={{ padding: 14 }}>
                  <div className="sectionTitle">🗺️ 액션 플랜</div>

                  <div style={{ display: "grid", gap: 12 }}>
                    <div>
                      <div className="badge">오늘</div>
                      <ul className="ul">
                        {result.topInfo.actionPlan.today.map((x) => <li key={x}>{x}</li>)}
                      </ul>
                    </div>

                    <div>
                      <div className="badge">이번주</div>
                      <ul className="ul">
                        {result.topInfo.actionPlan.week.map((x) => <li key={x}>{x}</li>)}
                      </ul>
                    </div>

                    <div>
                      <div className="badge">이번달</div>
                      <ul className="ul">
                        {result.topInfo.actionPlan.month.map((x) => <li key={x}>{x}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="divider" />

              <div className="kvGrid">
                <div className="qCard" style={{ padding: 14 }}>
                  <div className="sectionTitle">✅ 추천 환경</div>
                  <ul className="ul">
                    {result.topInfo.bestEnv.map((x) => <li key={x}>{x}</li>)}
                  </ul>
                </div>

                <div className="qCard" style={{ padding: 14 }}>
                  <div className="sectionTitle">✅ 잘 맞는 역할</div>
                  <ul className="ul">
                    {result.topInfo.goodRoles.map((x) => <li key={x}>{x}</li>)}
                  </ul>
                </div>

                <div className="qCard" style={{ padding: 14 }}>
                  <div className="sectionTitle">⚠️ 주의</div>
                  <ul className="ul">
                    {result.topInfo.watchouts.map((x) => <li key={x}>{x}</li>)}
                  </ul>
                </div>

                <div className="qCard" style={{ padding: 14 }}>
                  <div className="sectionTitle">🧪 바로 해볼 실험</div>
                  <ul className="ul">
                    {result.topInfo.experiments.map((x) => <li key={x}>{x}</li>)}
                  </ul>
                </div>
              </div>

              <div className="help" style={{ marginTop: 14 }}>
                * 자기이해/참고용 결과(채용/의학적 진단 용도 아님)
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Container>
  );
}
