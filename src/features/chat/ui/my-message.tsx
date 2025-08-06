import MyChatMessageTip from '@/assets/icons/my-chat-message-tip.svg';
import { format } from 'date-fns';
import type { Timestamp } from 'firebase/firestore';
import { useHairConsultationChatChannelStore } from '../store/hair-consultation-chat-channel-store';
import type { HairConsultationChatMessageType } from '../type/hair-consultation-chat-message-type';
import MessageDate from './message-date';

type MyMessageProps = {
  message: HairConsultationChatMessageType;
};

export default function MyMessage({ message }: MyMessageProps) {
  const { otherUserHairConsultationChatChannel } = useHairConsultationChatChannelStore((state) => ({
    otherUserHairConsultationChatChannel: state.otherUserHairConsultationChatChannel,
  }));

  const isRead = () => {
    const otherLastReadAt = otherUserHairConsultationChatChannel?.lastReadAt as Timestamp | null;
    return otherLastReadAt
      ? (message.createdAt as Timestamp)?.toMillis() <= otherLastReadAt?.toMillis()
      : false;
  };

  console.log('isRead', isRead());

  return (
    <div className="flex flex-1 justify-end">
      <div className="flex gap-2 items-end">
        <MessageDate messageCreatedAt={message.createdAt as Timestamp} />
        <div className="flex items-end">
          <div className="rounded-l-10 rounded-tr-10 bg-label-default p-4 flex">
            <p className="typo-body-2-long-regular text-white">{message.message}</p>
          </div>
          <MyChatMessageTip />
        </div>
      </div>
    </div>
  );
}
