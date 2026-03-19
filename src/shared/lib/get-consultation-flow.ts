import { type BrandConfig } from '@/shared/config/brand-config';
import { DEFAULT_CONSULTATION_FLOW } from '@/shared/constants/consultation-steps';

// brand-config.ts와 consultation-steps.ts의 순환 의존을 방지하기 위해 별도 파일로 분리
// brand-config → consultation-steps (StepIdSchema 참조)
// 이 파일 → brand-config + consultation-steps (단방향)
export function getConsultationFlow(brand: BrandConfig) {
  if (!brand.consultationFlowOverride) return DEFAULT_CONSULTATION_FLOW;

  return brand.consultationFlowOverride.map(
    (id) => DEFAULT_CONSULTATION_FLOW.find((s) => s.stepId === id)!,
  );
}
