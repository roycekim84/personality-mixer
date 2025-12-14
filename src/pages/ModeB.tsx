import { useEffect, useMemo, useState } from "react";
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
  const encoded = encodeABC(arr);
  setSearchParams({ b: encoded });
}, [answers]);

  const result = useMemo(() => buildModeBResult(answers), [answers]);
  const ratio = result.total ? result.answeredCount / result.total : 0;
const confidence =
  ratio >= 0.9 ? { label: "높음", hint: "답변이 충분해서 추천 신뢰도가 높아요." } :
  ratio >= 0.6 ? { label: "보통", hint: "대체로 괜찮아요. 몇 개 더 답하면 좋아요." } :
  { label: "낮음", hint: "아직 정보가 적어요. 더 답하면 정확도가 올라가요." };

  const isDone = result.answeredCount === result.total;

const maxScore = Math.max(...result.ranked.map((x) => x.v), 1);
const blendLine = `주 성향은 ${result.topInfo.title}, 보조 성향은 ${result.secondInfo.title} 쪽이 함께 섞여 있어요.`;


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

  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 820 }}>
      <div style={{ display: "grid", gap: 6 }}>
        <h2 style={{ margin: 0 }}>B 모드 (신뢰용)</h2>
        <div style={{ opacity: 0.8 }}>
          객관식 답변으로 “잘 맞는 업무 환경/역할”을 추천해요.
          ({result.answeredCount}/{result.total})
        </div>
      </div>

      {/* 질문 */}
      <div style={{ display: "grid", gap: 14 }}>
        {B_QUESTIONS.map((q, idx) => (
          <div key={q.id} style={{ border: "1px solid rgba(0,0,0,0.12)", borderRadius: 14, padding: 14 }}>
            <div style={{ fontWeight: 800, marginBottom: 10 }}>
              {idx + 1}. {q.title}
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {q.choices.map((c) => {
                const checked = answers[q.id] === c.key;
                return (
                  <label
                    key={c.key}
                    style={{
                      display: "flex",
                      gap: 10,
                      alignItems: "center",
                      padding: "8px 10px",
                      borderRadius: 12,
                      background: checked ? "rgba(0,0,0,0.06)" : "transparent",
                      cursor: "pointer",
                    }}
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

      {/* 결과 */}
      <div style={{ border: "1px solid rgba(0,0,0,0.12)", borderRadius: 14, padding: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "grid", gap: 4 }}>
            <div style={{ fontSize: 18, fontWeight: 900 }}>
              {result.topInfo.title}
            </div>
            <div style={{ opacity: 0.85 }}>{result.topInfo.oneLiner}</div>
            <div style={{ opacity: 0.7, fontSize: 13 }}>
              2순위 성향: {result.secondInfo.title}
            </div>
            <div style={{ marginTop: 8, display: "grid", gap: 6 }}>
                <div style={{ fontSize: 13, opacity: 0.75 }}>
                    신뢰도: <b>{confidence.label}</b> · {confidence.hint}
                </div>
                <div style={{ height: 8, borderRadius: 999, background: "rgba(0,0,0,0.08)", overflow: "hidden" }}>
                    <div style={{ width: `${Math.round(ratio * 100)}%`, height: "100%", background: "rgba(0,0,0,0.35)" }} />
                </div>
            </div>

          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={copySummary} style={{ padding: "10px 14px", borderRadius: 12 }}>
              결과 텍스트 복사
            </button>
            <button onClick={resetAll} style={{ padding: "10px 14px", borderRadius: 12 }}>
              초기화
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

        {!isDone && (
          <div style={{ marginTop: 10, opacity: 0.8 }}>
            모든 질문에 답하면 결과가 더 정확해져요.
          </div>
        )}

        <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
<section>
  <div style={{ fontWeight: 900, marginBottom: 6 }}>🧩 혼합 설명</div>
  <div style={{ opacity: 0.85 }}>{blendLine}</div>
</section>

<section>
  <div style={{ fontWeight: 900, marginBottom: 8 }}>📊 점수 분포</div>
  <div style={{ display: "grid", gap: 8 }}>
    {result.ranked.map(({ k, v }) => (
      <div key={k} style={{ display: "grid", gap: 4 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, opacity: 0.85 }}>
          <span>{B_TYPES[k].title}</span>
          <span>{v}</span>
        </div>
        <div style={{ height: 8, borderRadius: 999, background: "rgba(0,0,0,0.08)", overflow: "hidden" }}>
          <div style={{ width: `${Math.round((v / maxScore) * 100)}%`, height: "100%", background: "rgba(0,0,0,0.35)" }} />
        </div>
      </div>
    ))}
  </div>
  <div style={{ opacity: 0.65, fontSize: 12, marginTop: 8 }}>
    * 점수는 “성향 경향”을 보여주는 참고값이에요.
  </div>
</section>

 
          <section>
            <div style={{ fontWeight: 900, marginBottom: 6 }}>✅ 추천 환경</div>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {result.topInfo.bestEnv.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </section>

          <section>
            <div style={{ fontWeight: 900, marginBottom: 6 }}>✅ 잘 맞는 역할</div>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {result.topInfo.goodRoles.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </section>

          <section>
            <div style={{ fontWeight: 900, marginBottom: 6 }}>⚠️ 주의</div>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {result.topInfo.watchouts.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </section>

          <section>
            <div style={{ fontWeight: 900, marginBottom: 6 }}>🧪 바로 해볼 실험</div>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {result.topInfo.experiments.map((x) => <li key={x}>{x}</li>)}
            </ul>
          </section>

            <section>
            <div style={{ fontWeight: 900, marginBottom: 6 }}>🗺️ 액션 플랜</div>

            <div style={{ display: "grid", gap: 10 }}>
                <div>
                <div style={{ fontWeight: 800, marginBottom: 4 }}>오늘</div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {result.topInfo.actionPlan.today.map((x) => <li key={x}>{x}</li>)}
                </ul>
                </div>

                <div>
                <div style={{ fontWeight: 800, marginBottom: 4 }}>이번주</div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {result.topInfo.actionPlan.week.map((x) => <li key={x}>{x}</li>)}
                </ul>
                </div>

                <div>
                <div style={{ fontWeight: 800, marginBottom: 4 }}>이번달</div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {result.topInfo.actionPlan.month.map((x) => <li key={x}>{x}</li>)}
                </ul>
                </div>
            </div>
            </section>



          <div style={{ opacity: 0.7, fontSize: 12 }}>
            * 자기이해/참고용 결과(채용/의학적 진단 용도 아님)
          </div>
        </div>
      </div>
    </div>
  );
}
