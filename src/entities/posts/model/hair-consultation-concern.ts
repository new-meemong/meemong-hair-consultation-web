export const HAIR_CONSULTATION_CONCERNS = [
  '모발손상',
  '볼륨 부족',
  '적은 숱/가는 모발',
  '스타일링 어려움',
  '펌이 금방 풀림',
  '두피 트러블',
  '심한 곱슬',
  '심한 직모',
  '뿌리 색상 관리',
  '옐로·레드 언더톤',
  '컬러 얼룩',
  '컬러 지속력 부족',
  '특별한 문제는 없어요',
] as const;

export type HairConsultationConcern = (typeof HAIR_CONSULTATION_CONCERNS)[number];

const legacyConcerns: Record<string, HairConsultationConcern> = {
  탈모: '적은 숱/가는 모발',
  '적은 숱': '적은 숱/가는 모발',
  '얇은 모발': '적은 숱/가는 모발',
  지성두피: '두피 트러블',
  '지성 두피': '두피 트러블',
  '건조한 두피': '두피 트러블',
  '모발 손상': '모발손상',
  '펌이 금방풀림': '펌이 금방 풀림',
};

export function normalizeHairConsultationConcerns(value: unknown): HairConsultationConcern[] {
  if (!Array.isArray(value)) return [];
  const concerns = value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => legacyConcerns[item.trim()] ?? item.trim())
    .filter((item): item is HairConsultationConcern =>
      (HAIR_CONSULTATION_CONCERNS as readonly string[]).includes(item),
    );
  // 앱과 웹 모두 혼합 입력에서는 배타적인 '고민 없음' 선택을 우선한다.
  const selected = [...new Set(concerns)];
  return selected.includes('특별한 문제는 없어요') ? ['특별한 문제는 없어요'] : selected;
}
