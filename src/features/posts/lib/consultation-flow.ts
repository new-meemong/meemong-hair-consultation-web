import type { StepId } from '@/shared/constants/consultation-steps';

type ConsultationStep = { stepId: StepId; urlSegment: string };

export function getNextStep(
  flow: ReadonlyArray<ConsultationStep>,
  currentStepId: StepId,
): ConsultationStep | null {
  const idx = flow.findIndex((s) => s.stepId === currentStepId);
  return flow[idx + 1] ?? null;
}

export function getPrevStep(
  flow: ReadonlyArray<ConsultationStep>,
  currentStepId: StepId,
): ConsultationStep | null {
  const idx = flow.findIndex((s) => s.stepId === currentStepId);
  return flow[idx - 1] ?? null;
}
