import type { Timestamp } from 'firebase/firestore';

import MyChatMessageTip from '@/assets/icons/my-chat-message-tip.svg';
import Dot from '@/shared/ui/dot';

import ImageMessage from './image-message';
import MessageDate from './message-date';
import { useHairConsultationChatChannelStore } from '../store/hair-consultation-chat-channel-store';
import {
  HairConsultationChatMessageTypeEnum,
  type HairConsultationChatMessageType,
} from '../type/hair-consultation-chat-message-type';


function MyChatMessageBox({ message }: { message: string }) {
  return (
    <div className="flex items-end">
      <div className="rounded-l-10 rounded-tr-10 bg-label-default p-4 flex max-w-57">
        <p className="typo-body-2-long-regular text-white max-w-49">{message}</p>
      </div>
      <MyChatMessageTip />
    </div>
  );
}

type MyMessageProps = {
  message: HairConsultationChatMessageType;
};

export default function MyMessage({ message }: MyMessageProps) {
  const { otherUserHairConsultationChatChannels } = useHairConsultationChatChannelStore(
    (state) => ({
      otherUserHairConsultationChatChannels: state.otherUserHairConsultationChatChannels,
    }),
  );

  const isRead = () => {
    const otherLastReadAt = otherUserHairConsultationChatChannels?.lastReadAt as Timestamp | null;
    return otherLastReadAt
      ? (message.createdAt as Timestamp)?.toMillis() <= otherLastReadAt?.toMillis()
      : false;
  };

  return (
    <div className="flex flex-1 justify-end">
      <div className="flex gap-2 items-end">
        <div className="flex gap-1 items-center">
          <MessageDate messageCreatedAt={message.createdAt as Timestamp} />
          {isRead() && (
            <>
              <Dot size="0.5" />
              <span className="typo-caption-1-regular text-label-info">읽음</span>
            </>
          )}
        </div>
        {message.messageType === HairConsultationChatMessageTypeEnum.IMAGE ? (
          <ImageMessage message={message.message} />
        ) : (
          <MyChatMessageBox message={message.message} />
        )}
      </div>
    </div>
  );
}
