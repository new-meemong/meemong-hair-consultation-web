import { describe, expect, it } from 'vitest';

import formatDesignerDistance from './format-designer-distance';

describe('formatDesignerDistance', () => {
  it.each([
    [0, '0Km'],
    [100, '0.1Km'],
    [1200, '1.2Km'],
    [2000, '2Km'],
    [1250, '1.3Km'],
  ])('%sm를 플러터앱과 같은 거리 표기로 변환한다', (distanceInMeters, expected) => {
    expect(formatDesignerDistance(distanceInMeters)).toBe(expected);
  });

  it.each([null, undefined, Number.NaN, Number.POSITIVE_INFINITY, -1])(
    '표시할 수 없는 거리 %s에는 null을 반환한다',
    (distanceInMeters) => {
      expect(formatDesignerDistance(distanceInMeters)).toBeNull();
    },
  );
});
