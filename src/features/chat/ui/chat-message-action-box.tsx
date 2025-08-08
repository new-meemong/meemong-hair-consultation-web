import { type ReactNode } from 'react';

import CalendarIcon from '@/assets/icons/calendar.svg';
import ContractIcon from '@/assets/icons/contract.svg';
import GalleryIcon from '@/assets/icons/gallery.svg';
import useUploadPostImageMutation from '@/features/posts/api/use-upload-post-image';
import type { ValueOf } from '@/shared/type/types';
import ImageUploader from '@/shared/ui/image-uploader';

import useSendMessage from '../hook/use-send-message';
import { createChatImagesMessage } from '../lib/create-chat-images-message';
import { HairConsultationChatMessageTypeEnum } from '../type/hair-consultation-chat-message-type';
import type { UserHairConsultationChatChannelType } from '../type/user-hair-consultation-chat-channel-type';

const ACTION_ITEM_VALUE = {
  PHOTO: 'photo',
  SCHEDULE: 'schedule',
  CONTRACTING: 'contracting',
} as const;

const ACTION_ITEMS = Object.values(ACTION_ITEM_VALUE);

function ActionItem({ label, icon }: { label: string; icon: ReactNode }) {
  return (
    <div className="flex flex-col gap-1 items-center">
      <div className="flex flex-col size-13 rounded-6 bg-label-default items-center justify-center">
        {icon}
      </div>
      <p className="typo-caption-1-regular text-label-info">{label}</p>
    </div>
  );
}

type ChatMessageActionBoxProps = {
  userChannel: UserHairConsultationChatChannelType;
};

export default function ChatMessageActionBox({ userChannel }: ChatMessageActionBoxProps) {
  const { mutateAsync: uploadImage, isPending: isUploading } = useUploadPostImageMutation();
  const sendMessage = useSendMessage();

  const handleImageUpload = async (file: File[]) => {
    if (isUploading) return;

    try {
      const response = await uploadImage(file);

      await sendMessage({
        channelId: userChannel.channelId,
        receiverId: userChannel.otherUser.id.toString(),
        message: createChatImagesMessage(response.dataList.map((img) => img.imageURL)),
        messageType: HairConsultationChatMessageTypeEnum.IMAGE,
      });
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
    }
  };

  const renderItem = (
    item: ValueOf<typeof ACTION_ITEM_VALUE>,
  ): { label: string; icon: ReactNode } => {
    switch (item) {
      case ACTION_ITEM_VALUE.PHOTO:
        return {
          label: '사진',
          icon: <GalleryIcon className="size-8 fill-white" />,
        };
      case ACTION_ITEM_VALUE.SCHEDULE:
        return {
          label: '약속잡기',
          icon: <CalendarIcon className="size-8 fill-white" />,
        };
      case ACTION_ITEM_VALUE.CONTRACTING:
        return {
          label: '초상권계약',
          icon: <ContractIcon className="size-8 fill-white" />,
        };
    }
  };
  return (
    <div className="flex justify-between px-12.5">
      {ACTION_ITEMS.map((item) => {
        const { label, icon } = renderItem(item);

        if (item === ACTION_ITEM_VALUE.PHOTO) {
          return (
            <ImageUploader key={label} setImages={handleImageUpload} validate={() => !isUploading}>
              <ActionItem label={label} icon={icon} />
            </ImageUploader>
          );
        }

        return <ActionItem key={label} label={label} icon={icon} />;
      })}
    </div>
  );
}
