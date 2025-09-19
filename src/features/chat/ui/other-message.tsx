import Image from 'next/image';

import type { Timestamp } from 'firebase/firestore';

import OtherChatMessageTip from '@/assets/icons/other-chat-message-tip.svg';

import {
  HairConsultationChatMessageTypeEnum,
  type HairConsultationChatMessageType,
} from '../type/hair-consultation-chat-message-type';

import ImageMessage from './image-message';
import MessageDate from './message-date';

function OtherChatMessageBox({ message }: { message: string }) {
  return (
    <div className="flex items-end">
      <OtherChatMessageTip />
      <div className="rounded-r-10 rounded-tl-10 bg-alternative p-4 flex max-w-57">
        <p className="typo-body-2-long-regular text-black max-w-49">{message}</p>
      </div>
    </div>
  );
}

type OtherMessageProps = {
  message: HairConsultationChatMessageType;
  authorProfileImageUrl?: string | null;
};

export default function OtherMessage({ message, authorProfileImageUrl }: OtherMessageProps) {
  return (
    <div className="flex flex-1 justify-start">
      <div className="flex gap-2 items-end">
        <Image
          src={authorProfileImageUrl || '/profile.svg'}
          alt="User profile"
          width={24}
          height={24}
          className="size-6 rounded-full object-cover"
        />
        {message.messageType === HairConsultationChatMessageTypeEnum.IMAGE ? (
          <ImageMessage message={message.message} />
        ) : (
          <OtherChatMessageBox message={message.message} />
        )}
        <MessageDate messageCreatedAt={message.createdAt as Timestamp} />
      </div>
    </div>
  );
}
