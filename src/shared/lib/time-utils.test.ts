import { describe, it, expect } from 'vitest';
import { getRelativeTime } from './time-utils';

describe('getRelativeTime', () => {
  const now = new Date('2025-06-01T10:00:00Z'); // 기준 시간

  it('should return "방금 전" for times within 6 minutes', () => {
    const thirtySecondsAgo = new Date('2025-06-01T09:59:30Z');
    expect(getRelativeTime(thirtySecondsAgo.toISOString(), now)).toBe('방금 전');

    const oneMinuteAgo = new Date('2025-06-01T09:59:00Z');
    expect(getRelativeTime(oneMinuteAgo.toISOString(), now)).toBe('방금 전');

    const fiveMinutesAgo = new Date('2025-06-01T09:55:00Z');
    expect(getRelativeTime(fiveMinutesAgo.toISOString(), now)).toBe('방금 전');

    // 경계값 테스트 - 5분 59초는 방금 전
    const fiveMinutes59SecondsAgo = new Date('2025-06-01T09:54:01Z');
    expect(getRelativeTime(fiveMinutes59SecondsAgo.toISOString(), now)).toBe('방금 전');
  });

  it('should return "N분 전" for times between 6 minutes and 1 hour', () => {
    const sixMinutesAgo = new Date('2025-06-01T09:54:00Z');
    expect(getRelativeTime(sixMinutesAgo.toISOString(), now)).toBe('6분 전');

    const thirtyMinutesAgo = new Date('2025-06-01T09:30:00Z');
    expect(getRelativeTime(thirtyMinutesAgo.toISOString(), now)).toBe('30분 전');

    const fiftyNineMinutesAgo = new Date('2025-06-01T09:01:00Z');
    expect(getRelativeTime(fiftyNineMinutesAgo.toISOString(), now)).toBe('59분 전');
  });

  it('should return "N시간 전" for times between 1 hour and 24 hours', () => {
    const oneHourAgo = new Date('2025-06-01T09:00:00Z');
    expect(getRelativeTime(oneHourAgo.toISOString(), now)).toBe('1시간 전');

    const twoHoursAgo = new Date('2025-06-01T08:00:00Z');
    expect(getRelativeTime(twoHoursAgo.toISOString(), now)).toBe('2시간 전');

    const twelveHoursAgo = new Date('2025-05-31T22:00:00Z');
    expect(getRelativeTime(twelveHoursAgo.toISOString(), now)).toBe('12시간 전');

    const twentyThreeHoursAgo = new Date('2025-05-31T11:00:00Z');
    expect(getRelativeTime(twentyThreeHoursAgo.toISOString(), now)).toBe('23시간 전');
  });

  it('should return "MM/DD" for times older than 24 hours', () => {
    const oneDayAgo = new Date('2025-05-31T10:00:00Z');
    expect(getRelativeTime(oneDayAgo.toISOString(), now)).toBe('05/31');

    const threeDaysAgo = new Date('2025-05-28T10:00:00Z');
    expect(getRelativeTime(threeDaysAgo.toISOString(), now)).toBe('05/28');

    const oneWeekAgo = new Date('2025-05-24T10:00:00Z');
    expect(getRelativeTime(oneWeekAgo.toISOString(), now)).toBe('05/24');

    const oneMonthAgo = new Date('2025-05-01T10:00:00Z');
    expect(getRelativeTime(oneMonthAgo.toISOString(), now)).toBe('05/01');

    const differentYearAgo = new Date('2024-06-01T10:00:00Z');
    expect(getRelativeTime(differentYearAgo.toISOString(), now)).toBe('06/01');
  });

  it('should handle future dates', () => {
    const futureDate = new Date('2025-06-01T11:00:00Z');
    expect(getRelativeTime(futureDate.toISOString(), now)).toBe('방금 전');
  });

  it('should use current time when no reference time is provided', () => {
    // 이 테스트는 실제 현재 시간을 사용하므로 정확한 값 검증은 어렵지만
    // 함수가 오류 없이 실행되는지 확인
    const result = getRelativeTime(new Date().toISOString());
    expect(typeof result).toBe('string');
  });
});
