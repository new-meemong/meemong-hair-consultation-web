import { useRef, useState } from 'react';

import { FormProvider, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';

import CloseIcon from '@/assets/icons/close.svg';
import PlusIcon from '@/assets/icons/plus.svg';
import SendIcon from '@/assets/icons/send.svg';
import { Textarea } from '@/shared';

import type { UserHairConsultationChatChannelType } from '../type/user-hair-consultation-chat-channel-type';

import ChatMessageActionBox from './chat-message-action-box';

const CHAT_MESSAGE_INPUT_FIELD_NAME = {
  content: 'content',
} as const;

const formSchema = z.object({
  [CHAT_MESSAGE_INPUT_FIELD_NAME.content]: z.string().min(1, '메시지를 입력해주세요'),
});

export type ChatMessageInputValues = z.infer<typeof formSchema>;

type ChatMessageFormProps = {
  onSubmit: (data: ChatMessageInputValues) => Promise<{ success: boolean }>;
  userChannel: UserHairConsultationChatChannelType;
};

export default function ChatMessageForm({ onSubmit, userChannel }: ChatMessageFormProps) {
  const [showedActionBox, setShowedActionBox] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const method = useForm<ChatMessageInputValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      [CHAT_MESSAGE_INPUT_FIELD_NAME.content]: '',
    },
  });

  const handleSubmit = async (data: ChatMessageInputValues) => {
    const { success } = await onSubmit(data);

    if (success) {
      method.reset();
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleShowActionBox = () => {
    setShowedActionBox((prev) => !prev);
  };

  return (
    <FormProvider {...method}>
      <form
        className="flex flex-col px-5 py-4 shadow-emphasize gap-4"
        onSubmit={method.handleSubmit(handleSubmit)}
      >
        <div className="flex gap-3 rounded-12 bg-alternative px-3 py-2 items-center">
          <button
            className="size-7 flex items-center justify-center rounded-6 bg-label-default"
            onClick={handleShowActionBox}
          >
            {showedActionBox ? (
              <CloseIcon className="size-6 fill-white" />
            ) : (
              <PlusIcon className="size-6 fill-white" />
            )}
          </button>
          <div className="flex-1">
            <Textarea
              {...method.register(CHAT_MESSAGE_INPUT_FIELD_NAME.content)}
              placeholder="메시지 보내기"
              className="w-full flex-1 typo-body-2-regular placeholder:text-label-placeholder text-black"
              ref={(e) => {
                const { ref } = method.register(CHAT_MESSAGE_INPUT_FIELD_NAME.content);
                ref(e);
                if (e) {
                  textareaRef.current = e;
                }
              }}
            />
          </div>
          <button type="submit" className="typo-body-2-medium rounded-4 self-end">
            <SendIcon className="size-7 fill-label-sub" />
          </button>
        </div>
        {showedActionBox && <ChatMessageActionBox userChannel={userChannel} />}
      </form>
    </FormProvider>
  );
}
