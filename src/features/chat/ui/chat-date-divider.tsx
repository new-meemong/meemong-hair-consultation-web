import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { Timestamp } from 'firebase/firestore';

type ChatDateDividerProps = {
  date: Timestamp;
};

export default function ChatDateDivider({ date }: ChatDateDividerProps) {
  return (
    <div className="flex items-center justify-center typo-body-2-medium text-label-info">
      {format(date.toDate(), 'yyyy년 M월 d일(eee)', { locale: ko })}
    </div>
  );
}
