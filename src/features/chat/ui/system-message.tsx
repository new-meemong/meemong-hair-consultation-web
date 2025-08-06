import { format } from 'date-fns';
import type { HairConsultationChatMessageType } from '../type/hair-consultation-chat-message-type';
import type { Timestamp } from 'firebase/firestore';

type SystemMessageProps = {
  message: HairConsultationChatMessageType;
};

export default function SystemMessage({ message }: SystemMessageProps) {
  return (
    <div>
      {format((message.createdAt as Timestamp).toDate(), 'yyyy년 MM월 dd일(e)')}
      {message.message}
    </div>
  );
}
