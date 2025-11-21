'use client';

import { useEffect } from 'react';

import { useParams } from 'next/navigation';

import type { HTTPError } from 'ky';

import useGetConsultingResponse from '@/features/posts/api/use-get-consulting-response';
import ConsultingResponseHeader from '@/features/posts/ui/consulting-response/consulting-response-header';
import useShowMongInsufficientSheet from '@/features/mong/hook/use-show-mong-insufficient-sheet';

import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';

import { SiteHeader } from '@/widgets/header';
import ConsultingResponseContainer from '@/widgets/post/ui/consulting-response/consulting-response-container';

export default function ConsultingResponsePage() {
  const { postId, responseId } = useParams();
  const { back } = useRouterWithUser();
  const showMongInsufficientSheet = useShowMongInsufficientSheet();

  const { data: response, error } = useGetConsultingResponse(
    postId?.toString() ?? '',
    responseId?.toString() ?? '',
  );
  const consultingResponse = response?.data;

  useEffect(() => {
    if (error && 'response' in error) {
      const httpError = error as HTTPError;
      if (httpError.response?.status === 409) {
        showMongInsufficientSheet();
        back();
      }
    }
  }, [error, back, showMongInsufficientSheet]);

  if (!consultingResponse || !postId || !responseId) return null;

  return (
    <div className="min-w-[375px] w-full mx-auto flex flex-col h-screen">
      <SiteHeader title="컨설팅 답변" showBackButton />
      <div className="overflow-y-auto scrollbar-hide">
        <ConsultingResponseHeader
          postId={postId.toString()}
          author={consultingResponse.designer}
          createdAt={consultingResponse.createdAt}
          responseId={responseId.toString()}
          hairConsultPostingCreateUserId={consultingResponse.hairConsultPostingCreateUserId}
        />
        <ConsultingResponseContainer consultingResponse={consultingResponse} />
      </div>
    </div>
  );
}
