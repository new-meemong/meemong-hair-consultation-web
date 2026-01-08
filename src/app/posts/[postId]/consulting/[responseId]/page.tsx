'use client';

import type { ApiError } from '@/shared/api/client';
import ConsultingResponseContainer from '@/widgets/post/ui/consulting-response/consulting-response-container';
import ConsultingResponseHeader from '@/features/posts/ui/consulting-response/consulting-response-header';
import type { HTTPError } from 'ky';
import { SiteHeader } from '@/widgets/header';
import { useEffect } from 'react';
import useGetConsultingResponse from '@/features/posts/api/use-get-consulting-response';
import { useParams } from 'next/navigation';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useShowMongInsufficientSheet from '@/features/mong/hook/use-show-mong-insufficient-sheet';

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
      const httpError = error as HTTPError & {
        response?: { data?: { error?: ApiError }; status?: number };
      };

      // 409 에러: 몽 부족
      if (httpError.response?.status === 409) {
        showMongInsufficientSheet();
        back();
        return;
      }

      // 400 에러: Validation error (fieldErrors가 있는 경우)
      const apiError = httpError.response?.data?.error;
      if (
        httpError.response?.status === 400 &&
        apiError?.fieldErrors &&
        apiError.fieldErrors.length > 0
      ) {
        // Validation error는 콘솔에 로그만 남기고 사용자에게는 에러 메시지 표시
        console.error('Validation error:', apiError.fieldErrors);
        // 필요시 모달이나 스낵바로 에러 메시지 표시 가능
        back();
        return;
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
