import { describe, expect, it } from 'vitest';

import { DEFAULT_CONSULTATION_FLOW, StepIdSchema, stepIdToPath } from './consultation-steps';

describe('DEFAULT_CONSULTATION_FLOW', () => {
  it('중복 stepId가 없다', () => {
    const ids = DEFAULT_CONSULTATION_FLOW.map((s) => s.stepId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('중복 urlSegment가 없다', () => {
    const segments = DEFAULT_CONSULTATION_FLOW.map((s) => s.urlSegment);
    expect(new Set(segments).size).toBe(segments.length);
  });
});

describe('StepIdSchema', () => {
  it('유효한 stepId는 통과한다', () => {
    expect(StepIdSchema.safeParse('hairLength').success).toBe(true);
    expect(StepIdSchema.safeParse('personalColor').success).toBe(true);
  });

  it('유효하지 않은 값은 실패한다', () => {
    expect(StepIdSchema.safeParse('invalid').success).toBe(false);
    expect(StepIdSchema.safeParse('').success).toBe(false);
    expect(StepIdSchema.safeParse(null).success).toBe(false);
  });
});

describe('stepIdToPath', () => {
  it('DEFAULT_CONSULTATION_FLOW의 모든 stepId가 키로 존재한다', () => {
    for (const { stepId, urlSegment } of DEFAULT_CONSULTATION_FLOW) {
      expect(stepIdToPath[stepId]).toBe(urlSegment);
    }
  });

  it('stepIdToPath 키 수가 DEFAULT_CONSULTATION_FLOW 길이와 일치한다', () => {
    expect(Object.keys(stepIdToPath).length).toBe(DEFAULT_CONSULTATION_FLOW.length);
  });
});
