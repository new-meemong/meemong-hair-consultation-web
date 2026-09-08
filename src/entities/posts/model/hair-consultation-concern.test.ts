import { describe, expect, it } from 'vitest';
import {
  HAIR_CONSULTATION_CONCERNS,
  normalizeHairConsultationConcerns,
} from './hair-consultation-concern';

describe('hair consultation concerns', () => {
  it('keeps 12 current concerns and the exclusive no-concern option', () => {
    expect(HAIR_CONSULTATION_CONCERNS).toHaveLength(13);
    expect(normalizeHairConsultationConcerns(['특별한 문제는 없어요'])).toEqual([
      '특별한 문제는 없어요',
    ]);
    expect(normalizeHairConsultationConcerns(['컬러 얼룩', '특별한 문제는 없어요'])).toEqual([
      '특별한 문제는 없어요',
    ]);
  });
  it('merges legacy values without duplicate or unsupported selections', () => {
    expect(
      normalizeHairConsultationConcerns([
        '탈모',
        '적은 숱',
        '얇은 모발',
        '지성두피',
        '건조한 두피',
        '모발 손상',
        '펌이 금방풀림',
        ' 뿌리 색상 관리 ',
        '옐로·레드 언더톤',
        '컬러 얼룩',
        '컬러 지속력 부족',
        '어울리는 스타일',
      ]),
    ).toEqual([
      '적은 숱/가는 모발',
      '두피 트러블',
      '모발손상',
      '펌이 금방 풀림',
      '뿌리 색상 관리',
      '옐로·레드 언더톤',
      '컬러 얼룩',
      '컬러 지속력 부족',
    ]);
  });
});
