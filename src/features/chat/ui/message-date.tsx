import { format } from 'date-fns';
import type { Timestamp } from 'firebase/firestore';

type MessageDateProps = {
  messageCreatedAt: Timestamp | null;
};

export default function MessageDate({ messageCreatedAt }: MessageDateProps) {
  return (
    <p className="typo-caption-1-regular text-label-info">
      {format(messageCreatedAt?.toDate() ?? new Date(), 'HH:mm')}
    </p>
  );
}
