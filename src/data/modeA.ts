export type ElementType = "불" | "땅" | "바람" | "물" | "미지정";

export const MBTI_OPTIONS = [
  "", // 선택 안 함
  "INTJ", "INTP", "ENTJ", "ENTP",
  "INFJ", "INFP", "ENFJ", "ENFP",
  "ISTJ", "ISFJ", "ESTJ", "ESFJ",
  "ISTP", "ISFP", "ESTP", "ESFP",
] as const;

export const BLOOD_OPTIONS = ["", "A", "B", "O", "AB"] as const;

export const CARD_BG = {
  // 파일명은 public/cards/ 에 있는 것과 정확히 일치해야 함(대소문자 포함)
  all: [
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
  ],
  byElement: {
    물: ["/cards/RainyDayWindow.png", "/cards/FoggyMorningMood.png", "/cards/SeasideCafeWindow.png"],
    불: ["/cards/SunsetGoldenHour.png", "/cards/CozyMorningCorner.png", "/cards/SummerIcedCoffeeGlow.png"],
    땅: ["/cards/MinimalWhiteCafe.png", "/cards/IndustrialConcreteCafe.png", "/cards/LibrarylikeQuietCafe.png", "/cards/AutumnLeavesCafe.png"],
    바람: ["/cards/SpringBlossomPatio.png", "/cards/GreenPlantCafe.png", "/cards/NightStudyNeon.png", "/cards/WinterSnowSteam.png"],
    미지정: [] as string[],
  } satisfies Record<ElementType, string[]>,
} as const;

/** YYYY-MM-DD -> 별자리(한국어) */
export function zodiacFromDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return "";
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

export function elementFromZodiac(zodiac: string): ElementType {
  if (!zodiac) return "미지정";
  // 불: 양/사자/사수
  if (zodiac === "양자리" || zodiac === "사자자리" || zodiac === "사수자리") return "불";
  // 땅: 황소/처녀/염소
  if (zodiac === "황소자리" || zodiac === "처녀자리" || zodiac === "염소자리") return "땅";
  // 바람: 쌍둥이/천칭/물병
  if (zodiac === "쌍둥이자리" || zodiac === "천칭자리" || zodiac === "물병자리") return "바람";
  // 물: 게/전갈/물고기
  if (zodiac === "게자리" || zodiac === "전갈자리" || zodiac === "물고기자리") return "물";
  return "미지정";
}

// --- 랜덤(결과 변주용): 입력 기반 해시 + seed로 재현 가능 ---
export function hashStringToUint32(input: string): number {
  let h = 2166136261; // FNV-1a
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(arr: readonly T[], rnd: () => number): T {
  return arr[Math.floor(rnd() * arr.length)] as T;
}

type TemplateBank = {
  title: string[];
  strengths: string[];
  caution: string[];
  mission: string[];
};

const BANK: Record<ElementType, TemplateBank> = {
  불: {
    title: [
      "불꽃 모드 ON, 오늘은 추진력이 답이다",
      "열정이 무기인 타입: 시작하면 끝까지 간다",
      "속도감 있는 실행러, 분위기까지 끌어올림",
    ],
    strengths: [
      "시작이 빠르고, 동기부여를 스스로 만든다",
      "답답한 회의를 줄이고 ‘바로 해보기’로 해결한다",
      "팀에 에너지를 공급하는 촉매 역할을 한다",
      "단기간 집중 스프린트에 강하다",
    ],
    caution: [
      "속도가 너무 빠르면 디테일이 새어 나갈 수 있어요",
      "열정이 꺼질 때 ‘그만둘 이유’가 먼저 떠오를 수 있어요",
      "결과가 늦게 나오는 일은 지루하게 느낄 수 있어요",
    ],
    mission: [
      "25분: 지금 당장 제일 작은 실행 1개만 끝내기",
      "오늘 할 일 중 ‘시작만’ 해도 되는 작업을 1개 고르기",
      "집중 방해 요소 1개만 치우고 바로 착수하기",
    ],
  },
  땅: {
    title: [
      "차분하게 쌓는 타입: 오늘도 안정적으로 전진",
      "탄탄한 루틴러: 믿고 맡길 수 있는 사람",
      "정리와 완성이 강점, 디테일이 곧 실력",
    ],
    strengths: [
      "품질/정확도/완성도를 끝까지 끌어올린다",
      "계획을 세우면 흔들리지 않고 실행한다",
      "반복 작업도 꾸준히 쌓아 성과로 만든다",
      "리스크를 미리 감지하고 안전하게 운용한다",
    ],
    caution: [
      "완벽을 추구하다 시작이 늦어질 수 있어요",
      "예상 밖 변수가 많으면 에너지가 빨리 새요",
      "‘일단 해보고 수정’이 불안하게 느껴질 수 있어요",
    ],
    mission: [
      "오늘 할 일 3개만 남기고 나머지 미루기(정리의 힘)",
      "10분: ‘완벽’ 대신 ‘초안’으로 제출해보기",
      "체크리스트 5개로 쪼개서 1개만 완료하기",
    ],
  },
  바람: {
    title: [
      "아이디어 순풍: 연결해서 새 길을 만드는 타입",
      "기민한 두뇌 회전, 방향 전환이 빠르다",
      "가벼운 대화 속에서 답을 찾는 사람",
    ],
    strengths: [
      "새로운 관점을 빠르게 만들고 공유한다",
      "정보를 모아 구조화하고 요약하는 데 강하다",
      "막히면 다른 길로 우회하는 유연함이 있다",
      "‘왜?’를 잘 던져 팀의 사고를 확장한다",
    ],
    caution: [
      "흥미가 옮겨가면 마무리가 약해질 수 있어요",
      "해야 할 일이 많을수록 우선순위가 흐려질 수 있어요",
      "깊게 파는 구간에서 지루함을 느낄 수 있어요",
    ],
    mission: [
      "3분: 오늘의 목표를 ‘한 문장’으로만 적기",
      "해야 할 일 3개를 ‘중요/긴급’으로만 분류하기",
      "마무리용 타이머 15분(끝내는 힘)을 추가하기",
    ],
  },
  물: {
    title: [
      "감도 높은 몰입러: 분위기 타면 깊게 들어간다",
      "섬세한 직감형: 흐름을 읽고 맞춘다",
      "조용히 강한 타입: 감정도 실력으로 바꿈",
    ],
    strengths: [
      "디테일한 감지 능력으로 문제를 빨리 알아챈다",
      "공감/커뮤니케이션에서 관계 비용을 줄인다",
      "혼자 몰입하는 시간에 결과물이 크게 나온다",
      "‘분위기 세팅’만 되면 집중력이 폭발한다",
    ],
    caution: [
      "컨디션/환경에 따라 집중 편차가 날 수 있어요",
      "피드백이 거칠면 의욕이 급격히 꺾일 수 있어요",
      "너무 많은 자극(회의/메신저)에 쉽게 지쳐요",
    ],
    mission: [
      "집중 환경 세팅 3분(조명/음악/알림 끄기) 후 시작",
      "오늘은 ‘혼자 몰입 블록’ 30분 확보하기",
      "작업 전 마음 정리 메모 5줄(생각 비우기)",
    ],
  },
  미지정: {
    title: [
      "오늘의 믹스 타입: 의외의 조합이 매력",
      "예측불가 밸런스형: 상황에 맞춰 최적화",
      "무난한 듯 강한 타입: 안정과 변주의 중간",
    ],
    strengths: [
      "상황에 맞게 톤을 조절하며 적응한다",
      "한쪽으로 치우치지 않고 균형을 잡는다",
      "필요할 때 ‘몰입/소통/정리’를 오갈 수 있다",
    ],
    caution: [
      "선택지가 많으면 결정이 늦어질 수 있어요",
      "목표가 흐려지면 추진력이 약해질 수 있어요",
      "과부하가 오면 ‘아무것도 하기 싫음’이 뜰 수 있어요",
    ],
    mission: [
      "오늘 목표 1개만 정해서 ‘끝내기’에 집중",
      "가장 쉬운 작업 1개로 워밍업",
      "휴식 타이머를 먼저 잡고 시작하기(지치기 전에 멈추기)",
    ],
  },
};

export type ModeAInput = {
  mbti: string;
  blood: string;
  birth: string; // YYYY-MM-DD
  light1: "카페" | "집" | "도서관";
  light2: "몰입" | "루틴" | "즉흥";
  light3: "혼자" | "사람들과" | "반반";
  shuffle: number; // 결과 변주
};

export type ModeAResult = {
  zodiac: string;
  element: ElementType;
  bg: string;
  headline: string;
  strengthA: string;
  strengthB: string;
  caution: string;
  mission: string;
};

export function buildModeAResult(input: ModeAInput): ModeAResult {
  const zodiac = zodiacFromDate(input.birth);
  const element = elementFromZodiac(zodiac);

  const baseKey = `${input.mbti}|${input.blood}|${input.birth}|${input.light1}|${input.light2}|${input.light3}|${element}`;
  const seed = (hashStringToUint32(baseKey) + (input.shuffle >>> 0)) >>> 0;
  const rnd = mulberry32(seed);

  const bank = BANK[element] ?? BANK["미지정"];
  const headline = pick(bank.title, rnd);
  const strengthA = pick(bank.strengths, rnd);
  let strengthB = pick(bank.strengths, rnd);
  // strengthA와 중복되면 한 번 더
  if (strengthB === strengthA && bank.strengths.length > 1) strengthB = pick(bank.strengths, rnd);

  const caution = pick(bank.caution, rnd);
  const mission = pick(bank.mission, rnd);

  const candidates = CARD_BG.byElement[element];
  const bg = candidates.length ? pick(candidates, rnd) : pick(CARD_BG.all, rnd);

  return { zodiac, element, bg, headline, strengthA, strengthB, caution, mission };
}
