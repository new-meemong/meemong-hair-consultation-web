import { format } from 'date-fns';

export default function formatDateTime(date: string) {
  const targetDate = new Date(date);

  if (isNaN(targetDate.getTime())) {
    return date;
  }

  const now = new Date();
  const diffInMs = now.getTime() - targetDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

  if (diffInMinutes < 6) {
    return '방금 전';
  }

  if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  }

  if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  }

  return format(targetDate, 'MM/dd');
}
