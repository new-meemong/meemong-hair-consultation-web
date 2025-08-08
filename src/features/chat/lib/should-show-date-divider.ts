import { format } from 'date-fns';
import type { FieldValue, Timestamp } from 'firebase/firestore';

/**
 * 채팅 메시지 사이에 날짜 구분선을 표시해야 하는지 확인하는 함수
 * @param currentMessageCreatedAt 현재 메시지의 생성 시간
 * @param previousMessageCreatedAt 이전 메시지의 생성 시간
 * @returns 날짜 구분선을 표시해야 하는지 여부
 */
export function shouldShowDateDivider(
  currentMessageCreatedAt: FieldValue | Timestamp | null | undefined,
  previousMessageCreatedAt: FieldValue | Timestamp | null | undefined,
): boolean {
  if (!previousMessageCreatedAt) return true;
  if (!currentMessageCreatedAt) return false;

  const currentDate = 'toDate' in currentMessageCreatedAt ? currentMessageCreatedAt.toDate() : null;
  const previousDate =
    'toDate' in previousMessageCreatedAt ? previousMessageCreatedAt.toDate() : null;

  if (!currentDate || !previousDate) return false;

  return format(currentDate, 'yyyy-MM-dd') !== format(previousDate, 'yyyy-MM-dd');
}
