'use client';

import ArrowUpIcon from '@/assets/icons/arrow-up.svg';
import LockIcon from '@/assets/icons/lock.svg';
import { Label, Separator } from '@/shared';
import { useAuthContext } from '@/features/auth/context/auth-context';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import ControlledCheckbox from '@/shared/ui/controlled-checkbox';
import { Textarea } from '@/shared/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import z from 'zod';
import { useEffect } from 'react';

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
      [COMMENT_FORM_FIELD_NAME.isVisibleToModel]: false,
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

  const isVisibleToModel = useWatch({
    control: method.control,
    name: COMMENT_FORM_FIELD_NAME.isVisibleToModel,
  });

  const handleSubmit = (data: CommentFormValues) => {
    onSubmit(data, {
      onSuccess: () => {
        method.reset();
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
              <LockIcon
                className={cn(
                  `size-3.5`,
                  isVisibleToModel ? 'fill-negative' : 'fill-label-placeholder',
                )}
              />
              <div className="flex-1">
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
              </div>
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
          {isUserDesigner && (
            <>
              <Separator />
              <div className="flex items-center px-5 py-3 gap-2">
                <ControlledCheckbox
                  name={COMMENT_FORM_FIELD_NAME.isVisibleToModel}
                  shape="square"
                />
                <Label
                  htmlFor={COMMENT_FORM_FIELD_NAME.isVisibleToModel}
                  className="typo-body-3-regular"
                >
                  모델에게만 공개할게요
                </Label>
              </div>
            </>
          )}
        </form>
      </FormProvider>
    </div>
  );
}
