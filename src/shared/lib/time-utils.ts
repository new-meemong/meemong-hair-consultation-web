/**
 * 주어진 시간을 현재 시간 기준으로 상대적 시간 문자열로 변환합니다
 * 정책:
 * - ~6분 미만: 방금 전
 * - 6분 이상~60분 미만: n분 전
 * - 60분 이상~24시간 미만: n시간 전
 * - 24시간 이상: MM/DD
 *
 * @param dateString - ISO 날짜 문자열
 * @param referenceTime - 기준이 되는 시간 (기본값: 현재 시간)
 * @returns 상대적 시간 문자열 ("방금 전", "5분 전", "03/24" 등)
 */
export function getRelativeTime(dateString: string, referenceTime?: Date): string {
  const targetDate = new Date(dateString);
  const now = referenceTime || new Date();

  const diffInMs = now.getTime() - targetDate.getTime();

  // 미래 시간이거나 0 이하인 경우
  if (diffInMs <= 0) {
    return '방금 전';
  }

  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

  // 6분 미만
  if (diffInMinutes < 6) {
    return '방금 전';
  }

  // 6분 이상 60분 미만
  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  }

  // 60분 이상 24시간 미만
  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }

  // 24시간 이상인 경우 MM/DD 형식으로 표시
  const month = String(targetDate.getMonth() + 1).padStart(2, '0');
  const day = String(targetDate.getDate()).padStart(2, '0');

  return `${month}/${day}`;
}
