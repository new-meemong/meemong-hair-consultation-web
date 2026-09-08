import { expect, it } from 'vitest';
import { normalizeHairConsultationContent } from './normalize-hair-consultation-content';
import { DEFAULT_HAIR_CONSULTATION_FORM_VALUES } from '../constants/hair-consultation-form-default-values';
import type { HairConsultationFormValues } from '../types/hair-consultation-form-values';

it('normalizes persisted concerns at draft restore and request preparation', () => {
  const saved = {
    ...DEFAULT_HAIR_CONSULTATION_FORM_VALUES,
    hairConcerns: ['탈모', '얇은 모발', '지성두피', '컬러 지속력 부족'],
  } as unknown as HairConsultationFormValues;
  expect(normalizeHairConsultationContent(saved).hairConcerns).toEqual([
    '적은 숱/가는 모발',
    '두피 트러블',
    '컬러 지속력 부족',
  ]);
});
