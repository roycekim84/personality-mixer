export type BTypeKey =
  | "DEEP_BUILDER"
  | "SYSTEM_OPERATOR"
  | "FAST_EXPERIMENTER"
  | "COLLAB_PLANNER"
  | "INSIGHT_ANALYST"
  | "CREATOR_COMMUNICATOR";

export type BChoiceKey = "A" | "B" | "C";

export type BQuestion = {
  id: string;
  title: string;
  choices: { key: BChoiceKey; label: string; scores: Partial<Record<BTypeKey, number>> }[];
};

export const B_TYPES: Record<
  BTypeKey,
  {
    title: string;
    oneLiner: string;
    bestEnv: string[];
    goodRoles: string[];
    watchouts: string[];
    experiments: string[];
  }
> = {
  DEEP_BUILDER: {
    title: "Deep Work Builder",
    oneLiner: "혼자 몰입해서 ‘완성물’을 만드는 데 강한 타입",
    bestEnv: [
      "긴 집중 블록(60~120분)을 확보할 수 있는 일정",
      "회의/메신저 방해가 적은 환경",
      "명확한 목표 + 자율적 실행",
    ],
    goodRoles: ["핵심 기능 구현", "프로덕트 품질 개선", "리팩토링/성능 최적화", "콘텐츠/글/코드 생산"],
    watchouts: ["회의가 잦으면 에너지가 빨리 새요", "작업이 쪼개지면 몰입이 깨져요"],
    experiments: ["하루 1회 ‘방해금지 90분’ 블록 만들기", "작업 전 ‘끝나는 정의(Done)’ 1문장 적기"],
  },
  SYSTEM_OPERATOR: {
    title: "System Operator",
    oneLiner: "안정적으로 운영하고 ‘안 깨지게’ 만드는 타입",
    bestEnv: [
      "예측 가능한 일정 + 반복 가능한 프로세스",
      "명확한 책임 범위와 운영 지표",
      "문서/체크리스트/룰이 있는 팀",
    ],
    goodRoles: ["운영/배포/모니터링", "프로세스 정리", "QA/품질 보증", "온보딩 문서화"],
    watchouts: ["무리한 속도전은 스트레스", "룰이 너무 자주 바뀌면 피로"],
    experiments: ["체크리스트 5개로 반복 업무 자동화", "주 1회 ‘문서 업데이트 데이’ 운영"],
  },
  FAST_EXPERIMENTER: {
    title: "Fast Experimenter",
    oneLiner: "빠르게 시도하고 학습하는 ‘실험-반복’ 타입",
    bestEnv: [
      "짧은 사이클(1~3일)로 테스트 가능한 업무",
      "실패 비용이 낮고 피드백이 빠른 팀",
      "프로토타입/검증 중심 문화",
    ],
    goodRoles: ["프로토타이핑", "A/B 테스트", "기획 검증", "신규 아이디어 실행"],
    watchouts: ["마무리/정리가 약해질 수 있어요", "완성도 요구가 너무 높으면 답답"],
    experiments: ["‘48시간 내 결과’ 규칙으로 작은 실험 1개", "실험 로그 5줄(가설/결과/다음)"],
  },
  COLLAB_PLANNER: {
    title: "Collaborative Planner",
    oneLiner: "조율하고 정리해서 팀을 앞으로 보내는 타입",
    bestEnv: [
      "역할/우선순위가 명확한 팀",
      "주기적인 싱크(주 1~2회) + 비동기 정리",
      "의사결정 기준이 있는 문화",
    ],
    goodRoles: ["요구사항 정리", "일정/우선순위 관리", "팀 커뮤니케이션", "리스크 관리"],
    watchouts: ["권한 없이 책임만 지면 힘들어요", "갈등이 장기화되면 소모"],
    experiments: ["회의 전 ‘결정해야 할 것 3개’만 적기", "주간 요약 10줄 공유 습관"],
  },
  INSIGHT_ANALYST: {
    title: "Insight Analyst",
    oneLiner: "자료를 읽고 구조화해서 ‘근거 있는 선택’을 만드는 타입",
    bestEnv: [
      "데이터/리서치 접근이 가능한 환경",
      "집중해서 파고들 수 있는 시간",
      "결정이 ‘근거’를 존중하는 문화",
    ],
    goodRoles: ["리서치/분석", "지표 설계", "문제 정의", "전략/가설 수립"],
    watchouts: ["결정이 느려질 수 있어요", "완벽한 정보가 없으면 불안"],
    experiments: ["결정 프레임 1장(가정/근거/리스크) 만들기", "‘충분한 근거 70%면 실행’ 규칙"],
  },
  CREATOR_COMMUNICATOR: {
    title: "Creator Communicator",
    oneLiner: "전달력으로 사람을 움직이고 흐름을 만드는 타입",
    bestEnv: [
      "피드백/반응이 있는 환경",
      "콘텐츠/설명/설득이 가치가 되는 팀",
      "사람과 아이디어가 자주 오가는 자리",
    ],
    goodRoles: ["문서/가이드 작성", "발표/교육", "콘텐츠 제작", "커뮤니티/커뮤니케이션"],
    watchouts: ["혼자만의 시간 없으면 번아웃", "반응이 없으면 동력 저하"],
    experiments: ["하루 1개 ‘설명글/정리글’ 남기기", "내 작업을 5문장으로 요약해 공유"],
  },
};

export const B_QUESTIONS: BQuestion[] = [
  {
    id: "q1",
    title: "일을 시작할 때 가장 편한 방식은?",
    choices: [
      { key: "A", label: "혼자 조용히 몰입해서 초안을 만든다", scores: { DEEP_BUILDER: 3, INSIGHT_ANALYST: 1 } },
      { key: "B", label: "팀과 합을 맞춘 뒤 계획을 잡고 간다", scores: { COLLAB_PLANNER: 3, SYSTEM_OPERATOR: 1 } },
      { key: "C", label: "일단 빠르게 만들어보고 반응을 본다", scores: { FAST_EXPERIMENTER: 3, CREATOR_COMMUNICATOR: 1 } },
    ],
  },
  {
    id: "q2",
    title: "불확실한 상황(요구사항이 애매함)을 만나면?",
    choices: [
      { key: "A", label: "근거/정보를 더 모아서 명확히 만든다", scores: { INSIGHT_ANALYST: 3, SYSTEM_OPERATOR: 1 } },
      { key: "B", label: "대화로 합의점을 만들고 방향을 정한다", scores: { COLLAB_PLANNER: 3, CREATOR_COMMUNICATOR: 1 } },
      { key: "C", label: "작게 실험해서 답을 찾는다", scores: { FAST_EXPERIMENTER: 3, DEEP_BUILDER: 1 } },
    ],
  },
  {
    id: "q3",
    title: "회의가 많은 날, 생산성은?",
    choices: [
      { key: "A", label: "집중이 깨져서 힘들다", scores: { DEEP_BUILDER: 3, INSIGHT_ANALYST: 1 } },
      { key: "B", label: "정리/조율이 잘 되면 오히려 괜찮다", scores: { COLLAB_PLANNER: 3, CREATOR_COMMUNICATOR: 1 } },
      { key: "C", label: "필요한 회의만 짧게 하고 실험/실행이 더 좋다", scores: { FAST_EXPERIMENTER: 2, SYSTEM_OPERATOR: 1 } },
    ],
  },
  {
    id: "q4",
    title: "업무에서 가장 중요하게 보는 건?",
    choices: [
      { key: "A", label: "완성도/품질", scores: { DEEP_BUILDER: 2, SYSTEM_OPERATOR: 2 } },
      { key: "B", label: "합의/정렬/일의 흐름", scores: { COLLAB_PLANNER: 3 } },
      { key: "C", label: "속도/학습/성장", scores: { FAST_EXPERIMENTER: 3 } },
    ],
  },
  {
    id: "q5",
    title: "문서화/정리 습관은?",
    choices: [
      { key: "A", label: "좋아한다. 남겨두면 마음이 편하다", scores: { SYSTEM_OPERATOR: 3, INSIGHT_ANALYST: 1 } },
      { key: "B", label: "필요할 때만 딱 한다", scores: { DEEP_BUILDER: 1, COLLAB_PLANNER: 1, FAST_EXPERIMENTER: 1 } },
      { key: "C", label: "설명/공유용으로 만드는 걸 즐긴다", scores: { CREATOR_COMMUNICATOR: 3, COLLAB_PLANNER: 1 } },
    ],
  },
  {
    id: "q6",
    title: "피드백을 받을 때 선호는?",
    choices: [
      { key: "A", label: "구체적이고 차분한 피드백", scores: { DEEP_BUILDER: 2, SYSTEM_OPERATOR: 1 } },
      { key: "B", label: "대화로 맥락을 맞추는 피드백", scores: { COLLAB_PLANNER: 2, CREATOR_COMMUNICATOR: 2 } },
      { key: "C", label: "빠르게 주고받는 짧은 피드백", scores: { FAST_EXPERIMENTER: 3 } },
    ],
  },
  {
    id: "q7",
    title: "작업 스타일은?",
    choices: [
      { key: "A", label: "길게 몰입해서 한 번에 끝내는 편", scores: { DEEP_BUILDER: 3 } },
      { key: "B", label: "중간중간 공유하며 맞춰가는 편", scores: { COLLAB_PLANNER: 2, CREATOR_COMMUNICATOR: 1 } },
      { key: "C", label: "짧게 치고 빠지며 여러 번 개선", scores: { FAST_EXPERIMENTER: 2, SYSTEM_OPERATOR: 1 } },
    ],
  },
  {
    id: "q8",
    title: "내가 가장 자신 있는 순간은?",
    choices: [
      { key: "A", label: "복잡한 걸 단순한 구조로 정리할 때", scores: { INSIGHT_ANALYST: 3, SYSTEM_OPERATOR: 1 } },
      { key: "B", label: "사람들을 설득/설명해서 움직일 때", scores: { CREATOR_COMMUNICATOR: 3, COLLAB_PLANNER: 1 } },
      { key: "C", label: "문제를 빠르게 해결해서 진척을 낼 때", scores: { FAST_EXPERIMENTER: 2, DEEP_BUILDER: 1 } },
    ],
  },
  {
    id: "q9",
    title: "스트레스가 가장 큰 건?",
    choices: [
      { key: "A", label: "방해가 많아 집중을 못 할 때", scores: { DEEP_BUILDER: 2, INSIGHT_ANALYST: 1 } },
      { key: "B", label: "역할/우선순위가 애매할 때", scores: { COLLAB_PLANNER: 2, SYSTEM_OPERATOR: 1 } },
      { key: "C", label: "변화가 없고 루틴만 반복될 때", scores: { FAST_EXPERIMENTER: 2, CREATOR_COMMUNICATOR: 1 } },
    ],
  },
  {
    id: "q10",
    title: "새로운 아이디어가 떠오르면?",
    choices: [
      { key: "A", label: "근거/시장/데이터를 먼저 확인한다", scores: { INSIGHT_ANALYST: 3 } },
      { key: "B", label: "사람들에게 설명하며 다듬는다", scores: { CREATOR_COMMUNICATOR: 2, COLLAB_PLANNER: 1 } },
      { key: "C", label: "바로 작은 프로토타입을 만든다", scores: { FAST_EXPERIMENTER: 3 } },
    ],
  },
  {
    id: "q11",
    title: "일정이 빡빡할 때 강한 쪽은?",
    choices: [
      { key: "A", label: "품질 지키며 안정적으로 운영", scores: { SYSTEM_OPERATOR: 3, DEEP_BUILDER: 1 } },
      { key: "B", label: "소통/정렬로 우선순위를 지킨다", scores: { COLLAB_PLANNER: 3 } },
      { key: "C", label: "속도를 올려 돌파한다", scores: { FAST_EXPERIMENTER: 2, CREATOR_COMMUNICATOR: 1 } },
    ],
  },
  {
    id: "q12",
    title: "내가 오래 잘하는 일의 형태는?",
    choices: [
      { key: "A", label: "혼자 만들어 쌓는 것(작품/기능/결과물)", scores: { DEEP_BUILDER: 2, INSIGHT_ANALYST: 1 } },
      { key: "B", label: "안정적으로 굴러가게 유지/개선하는 것", scores: { SYSTEM_OPERATOR: 3 } },
      { key: "C", label: "사람들에게 전달하고 반응을 얻는 것", scores: { CREATOR_COMMUNICATOR: 2, COLLAB_PLANNER: 1 } },
    ],
  },
];

export type ModeBAnswers = Record<string, BChoiceKey>;

export function buildModeBResult(answers: ModeBAnswers) {
  const scores: Record<BTypeKey, number> = {
    DEEP_BUILDER: 0,
    SYSTEM_OPERATOR: 0,
    FAST_EXPERIMENTER: 0,
    COLLAB_PLANNER: 0,
    INSIGHT_ANALYST: 0,
    CREATOR_COMMUNICATOR: 0,
  };

  for (const q of B_QUESTIONS) {
    const picked = answers[q.id];
    const choice = q.choices.find((c) => c.key === picked);
    if (!choice) continue;
    for (const [k, v] of Object.entries(choice.scores)) {
      scores[k as BTypeKey] += v ?? 0;
    }
  }

  const ranked = (Object.keys(scores) as BTypeKey[])
    .map((k) => ({ k, v: scores[k] }))
    .sort((a, b) => b.v - a.v);

  const top = ranked[0]?.k ?? "DEEP_BUILDER";
  const second = ranked[1]?.k ?? "SYSTEM_OPERATOR";

  return {
    scores,
    ranked,
    top,
    second,
    topInfo: B_TYPES[top],
    secondInfo: B_TYPES[second],
    answeredCount: Object.keys(answers).length,
    total: B_QUESTIONS.length,
  };
}
