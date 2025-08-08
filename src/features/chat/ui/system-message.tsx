import WarnIcon from '@/assets/icons/warn-triangle.svg';
import type { HairConsultationChatMessageType } from '../type/hair-consultation-chat-message-type';

type SystemMessageProps = {
  message: HairConsultationChatMessageType;
};

export default function SystemMessage({ message }: SystemMessageProps) {
  return (
    <div className="flex bg-alternative px-4 py-2.5 gap-3">
      <WarnIcon className="size-5 fill-label-info" />
      <p className="typo-body-3-regular text-label-info text-12">{message.message}</p>
    </div>
  );
}
