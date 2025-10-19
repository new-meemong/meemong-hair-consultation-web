'use client';

import { useEffect } from 'react';

import { FormProvider, useForm, useWatch } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';

import ArrowUpIcon from '@/assets/icons/arrow-up.svg';
import { useAuthContext } from '@/features/auth/context/auth-context';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { Textarea } from '@/shared/ui/textarea';

export const COMMENT_FORM_FIELD_NAME = {
  content: 'content',
  isVisibleToModel: 'isVisibleToModel',
  parentCommentId: 'parentCommentId',
} as const;

const formSchema = z.object({
  [COMMENT_FORM_FIELD_NAME.content]: z.string().min(1, '댓글을 입력해주세요'),
  [COMMENT_FORM_FIELD_NAME.isVisibleToModel]: z.boolean(),
  [COMMENT_FORM_FIELD_NAME.parentCommentId]: z.string().nullable(),
});

export type CommentFormValues = z.infer<typeof formSchema>;

export type CommentFormProps = {
  onSubmit: (data: CommentFormValues, options: { onSuccess: () => void }) => void;
  isReply: boolean;
  commentId: number | null;
  content: string | null;
  isPending: boolean;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
};

export function CommentForm({
  onSubmit,
  isReply,
  commentId,
  content,
  isPending,
  textareaRef,
}: CommentFormProps) {
  const { isUserDesigner } = useAuthContext();
  const placeholder = isReply ? '대댓글을 입력하세요' : '댓글을 입력하세요';

  const method = useForm<CommentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      [COMMENT_FORM_FIELD_NAME.content]: content ?? '',
      [COMMENT_FORM_FIELD_NAME.isVisibleToModel]: isUserDesigner,
      [COMMENT_FORM_FIELD_NAME.parentCommentId]: null,
    },
  });

  const { isValid, isDirty, isSubmitting } = method.formState;
  const isLoading = isSubmitting || isPending;

  useEffect(() => {
    method.setValue(COMMENT_FORM_FIELD_NAME.content, content ?? '');
  }, [content, method]);

  useEffect(() => {
    method.setValue(COMMENT_FORM_FIELD_NAME.parentCommentId, commentId?.toString() ?? null);
  }, [method, commentId]);

  useEffect(() => {
    if (isReply && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isReply, textareaRef]);

  const handleSubmit = (data: CommentFormValues) => {
    onSubmit(data, {
      onSuccess: () => {
        method.reset();
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
      },
    });
  };

  return (
    <div className={cn('w-full')}>
      <FormProvider {...method}>
        <form onSubmit={method.handleSubmit(handleSubmit)}>
          <div className="px-5 py-3">
            <div
              className={`flex w-full py-2 px-3 rounded-6 bg-alternative items-center gap-3 outline-none`}
            >
              <Textarea
                {...method.register(COMMENT_FORM_FIELD_NAME.content)}
                placeholder={placeholder}
                className="w-full flex-1 typo-body-2-long-regular placeholder:text-label-placeholder text-label-strong"
                ref={(e) => {
                  const { ref } = method.register(COMMENT_FORM_FIELD_NAME.content);
                  ref(e);
                  if (textareaRef && e) {
                    textareaRef.current = e;
                  }
                }}
              />
              <Button
                type="submit"
                size="icon"
                variant="icon"
                className="px-1"
                disabled={!isValid || !isDirty || isLoading}
              >
                <ArrowUpIcon className="fill-white" />
              </Button>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
