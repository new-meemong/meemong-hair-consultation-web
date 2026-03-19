import { z } from 'zod';

// ★ 단일 소스 — StepId, StepIdSchema, stepIdToPath 모두 이 배열에서 파생
// step 추가/제거 시 이 배열만 수정하면 나머지는 자동으로 동기화됩니다
export const DEFAULT_CONSULTATION_FLOW = [
  { stepId: 'hairLength', urlSegment: 'hair-length' },
  { stepId: 'hairConcerns', urlSegment: 'hair-concerns' },
  { stepId: 'hairTexture', urlSegment: 'hair-texture' },
  { stepId: 'skinBrightness', urlSegment: 'skin-brightness' },
  { stepId: 'personalColor', urlSegment: 'personal-color' },
] as const;

// 파생 타입 — DEFAULT_CONSULTATION_FLOW에서 자동 추출
export type StepId = (typeof DEFAULT_CONSULTATION_FLOW)[number]['stepId'];

const STEP_IDS = DEFAULT_CONSULTATION_FLOW.map((s) => s.stepId) as [StepId, ...StepId[]];
export const StepIdSchema = z.enum(STEP_IDS);

// ROUTES 헬퍼에서 사용 — 직접 정의하지 않고 파생
export const stepIdToPath = Object.fromEntries(
  DEFAULT_CONSULTATION_FLOW.map(({ stepId, urlSegment }) => [stepId, urlSegment]),
) as Record<StepId, string>;
